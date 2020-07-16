import _ from 'lodash';
import memoizeOne from 'memoize-one';
import { getStore } from '@hualala/platform-base';

/**
 * 判断是不是正式线上环境: HUALALA.ENVIRONMENT === 'production-release'
 */
export const isFormalRelease = () => {
    let flag = false;
    try {
        flag = HUALALA.ENVIRONMENT === 'production-release'
    } catch (e) {
        flag = false;
    }
    return flag;
}
/**
 *  ** 集团视角/需品牌化菜品的组件调用，单店菜品调用下一个方法 **
 * 将原始数据扩展成营销考虑菜品品牌化后的数据
 * 1. 考虑品牌化上线前旧数据兼容性：先将所有的菜品分类、菜品根据名称进行去重，模拟一个‘不限品牌’的品牌
 * 2. 有许多分类、菜品的brandID为0，这是由于基本档品牌化上线前的老数据，需要将这些菜品与分类复制给每个品牌
 * 最终返回处理之后的品牌分类与菜品，供给新菜品组件使用
 * @param {Immutable.List} $brands Immutable.List 从店铺schema接口获得的所有可选品牌
 * @param {Immutable.List} $rawCategories Immutable.List 直接从基本档请求来的所有分类信息
 * @param {Immutable.List} $rawDishes Immutable.List 直接从基本档请求来的所有菜品信息
 */
const expandCategoriesAndDishes = ($brands, $rawCategories, $rawDishes) => {
    if (!$brands.size || !$rawCategories.size || !$rawDishes.size) {
        return {
            categories: [],
            dishes: [],
            brands: [],
        }
    }
    const brands = $brands.toJS().map(item => (
        {
            ...item,
            value: `${item.brandID}`,
            label: `${item.brandName}`,
        }));
    brands.unshift({
        brandID: '0',
        value: '0',
        label: '不限品牌',
    })
    const rawCategories = $rawCategories.toJS();
    const rawDishes = $rawDishes.toJS();
    const uniqCatMap = new Map();
    rawCategories.forEach(item => {
        if (!uniqCatMap.has(item.foodCategoryName)) {
            const categoryTypeSet = new Set();
            categoryTypeSet.add(`${item.type || 0}`)
            uniqCatMap.set(item.foodCategoryName, {...item, typeSet: categoryTypeSet})
        } else {
            const categoryTypeSet = uniqCatMap.get(item.foodCategoryName).typeSet;
            categoryTypeSet.add(`${item.type || 0}`)
        }
    })
    const commonCategories = Array.from(uniqCatMap.values())
        .map(cat => ({
            ...cat,
            brandID: '0',
            brandName: '不限品牌',
            label: `(不限品牌)${cat.foodCategoryName}`,
            py: cat.foodCategoryMnemonicCode,
            value: `0__${cat.foodCategoryName}`
        }));
    const uniqDishMap = new Map();
    rawDishes.forEach(food => {
        if (uniqDishMap.has(`${food.foodName}${food.unit}`)) { // 产品层面决定 如果有名称+规格重复的菜品 保留售价高的那一个
            const previousFood = uniqDishMap.get(`${food.foodName}${food.unit}`);
            const previousPrice = previousFood.prePrice == -1 ? previousFood.price : previousFood.prePrice;
            const newPrice = food.prePrice == -1 ? food.price : food.prePrice;
            if (newPrice > previousPrice) {
                uniqDishMap.set(`${food.foodName}${food.unit}`, food)
            }
        } else {
            uniqDishMap.set(`${food.foodName}${food.unit}`, food)
        }
    })
    const commonDishes = Array.from(uniqDishMap.values())
        .map(dish => ({
            ...dish,
            brandID: '0',
            brandName: '不限品牌',
            localFoodCategoryID: `0__${dish.foodCategoryName}`,
            onlineFoodCategoryID: `0__${dish.foodOnlineCategoryName}`,
            label: `(不限品牌)${dish.foodName}(${dish.unit})`,
            price: dish.prePrice == -1 ? dish.price : dish.prePrice,
            newPrice: dish.prePrice == -1 ? dish.price : dish.prePrice,
            py: dish.foodMnemonicCode,
            value: `0__${dish.foodName}${dish.unit}`
        }));
    const categories = rawCategories.reduce((acc, curr) => {
        const brandName = (brands.find(item => item.brandID === `${curr.brandID}`) || {brandName: '未知'}).brandName;
        const dupIndex = acc.findIndex(item => item.brandID === `${curr.brandID}` && item.foodCategoryName === curr.foodCategoryName)
        if (curr.brandID > 0) {
            if (dupIndex === -1) {
                acc.push({
                    ...curr,
                    brandID: `${curr.brandID}`,
                    brandName,
                    label: `(${brandName})${curr.foodCategoryName}`,
                    py: curr.foodCategoryMnemonicCode,
                    value: `${curr.brandID}__${curr.foodCategoryName}`,
                    typeSet: new Set(`${curr.type || 0}`)
                })
            } else {
                acc[dupIndex].typeSet.add(`${curr.type || 0}`)
            }
        } else if (`${curr.brandID}` === '0') { // 把这种通用的分类扩展给每个品牌
            acc.push(...brands.map(brand => ({
                ...curr,
                typeSet: acc[dupIndex].typeSet,
                brandID: `${brand.brandID}`,
                brandName: brand.brandName,
                py: curr.foodCategoryMnemonicCode,
                label: `(${brand.brandName})${curr.foodCategoryName}`,
                value: `${brand.brandID}__${curr.foodCategoryName}`
            })))
        }
        return acc;
    }, [...commonCategories]);
    const dishes = rawDishes.reduce((acc, curr) => {
        if (curr.brandID > 0) {
            const brandName = (brands.find(item => item.brandID === `${curr.brandID}`) || {brandName: '未知'}).brandName;
            acc.push({
                ...curr,
                price: curr.prePrice == -1 ? curr.price : curr.prePrice,
                newPrice: curr.prePrice == -1 ? curr.price : curr.prePrice,
                brandID: `${curr.brandID}`,
                brandName,
                label: `(${brandName})${curr.foodName}(${curr.unit})`,
                py: curr.foodMnemonicCode,
                localFoodCategoryID: `${curr.brandID}__${curr.foodCategoryName}`,
                onlineFoodCategoryID: `${curr.brandID}__${curr.foodOnlineCategoryName}`,
                value: `${curr.brandID}__${curr.foodName}${curr.unit}`,
                targetUnitName: `${curr.unit}`,
            })
        } else if (`${curr.brandID}` === '0') { // 把这种通用的菜品扩展给每个品牌
            acc.push(...brands.map(brand => ({
                ...curr,
                price: curr.prePrice == -1 ? curr.price : curr.prePrice,
                newPrice: curr.prePrice == -1 ? curr.price : curr.prePrice,
                brandID: `${brand.brandID}`,
                brandName: brand.brandName,
                label: `(${brand.brandName})${curr.foodName}(${curr.unit})`,
                py: curr.foodMnemonicCode,
                localFoodCategoryID: `${brand.brandID}__${curr.foodCategoryName}`,
                onlineFoodCategoryID: `${brand.brandID}__${curr.foodOnlineCategoryName}`,
                value: `${brand.brandID}__${curr.foodName}${curr.unit}`,
                targetUnitName: `${curr.unit}`,
            })))
        }
        return acc;
    }, [...commonDishes])
    return {
        dishes: _.sortBy(_.uniqBy(dishes, 'value'), [ 'brandID', 'foodCategoryName']),
        categories: _.sortBy(_.uniqBy(categories, 'value'), [ 'brandID', 'foodCategoryName']),
        brands: brands.sort((a, b) => a.brandID - b .brandID),
    }
}
/**
 * 将原始数据扩展成营销考虑菜品品牌化后的数据
 * 处理店铺分类与菜品，供给新菜品组件使用
 * @param {Immutable.List} $rawCategories Immutable.List 直接从基本档请求来的所有店铺分类信息
 * @param {Immutable.List} $rawDishes Immutable.List 直接从基本档请求来的所有店铺菜品信息
 */
const expandCategoriesAndDishesForShop = ($rawCategories, $rawDishes) => {
    if (!$rawCategories.size || !$rawDishes.size) {
        return {
            categories: [],
            dishes: [],
        }
    }
    const rawCategories = $rawCategories.toJS();
    const rawDishes = $rawDishes.toJS();
    const uniqCatMap = new Map();
    rawCategories.forEach(item => {
        if (!uniqCatMap.has(item.foodCategoryName)) {
            const categoryTypeSet = new Set();
            categoryTypeSet.add(`${item.type || 0}`)
            uniqCatMap.set(item.foodCategoryName, {...item, typeSet: categoryTypeSet})
        } else {
            const categoryTypeSet = uniqCatMap.get(item.foodCategoryName).typeSet;
            categoryTypeSet.add(`${item.type || 0}`)
        }
    })
    const uniqDishMap = new Map();
    rawDishes.forEach(food => {
        if (uniqDishMap.has(`${food.foodName}${food.unit}`)) { // 产品层面决定 如果有名称+规格重复的菜品 保留售价高的那一个
            const previousFood = uniqDishMap.get(`${food.foodName}${food.unit}`);
            const previousPrice = previousFood.prePrice == -1 ? previousFood.price : previousFood.prePrice;
            const newPrice = food.prePrice == -1 ? food.price : food.prePrice;
            if (newPrice > previousPrice) {
                uniqDishMap.set(`${food.foodName}${food.unit}`, food)
            }
        } else {
            uniqDishMap.set(`${food.foodName}${food.unit}`, food)
        }
    })
    const categories = Array.from(uniqCatMap.values()).reduce((acc, curr) => {
        acc.push({
            ...curr,
            label: curr.foodCategoryName,
            py: curr.foodCategoryMnemonicCode,
            value: curr.foodCategoryName,
        })
        return acc;
    }, []);
    const dishes = Array.from(uniqDishMap.values()).reduce((acc, curr) => {
            acc.push({
                ...curr,
                price: curr.prePrice == -1 ? curr.price : curr.prePrice,
                newPrice: curr.prePrice == -1 ? curr.price : curr.prePrice,
                label: `${curr.foodName}(${curr.unit})`,
                py: curr.foodMnemonicCode,
                localFoodCategoryID: `${curr.foodCategoryName}`,
                onlineFoodCategoryID: `${curr.foodOnlineCategoryName}`,
                value: `${curr.foodName}${curr.unit}`
            })
        return acc;
    }, [])
    return {
        dishes: _.sortBy(dishes, [ 'foodCategoryName']),
        categories: _.sortBy(categories, ['foodCategoryName']),
    }
}

export const memoizedExpandCategoriesAndDishes = memoizeOne(expandCategoriesAndDishes)
export const memoizedShopCategoriesAndDishes = memoizeOne(expandCategoriesAndDishesForShop)

/**
 * 根据主题参数，给body添加class，适配不同的主题
 *
 * @param {*} className
 */
export const setThemeClass = (className) => {
    const body = document.querySelector('body')
    const oldClass = body.getAttribute('class')
    body.setAttribute('class',oldClass || '' + ' ' + className)
}


/**
 * 从 Redux Store 中获取versionUI 判断是否是企业版还是标准版，从而操作样式
 */
export function getVersionUI() {
    const state = getStore().getState();
    return state.user.get('versionUI').toJS();
}
