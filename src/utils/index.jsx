import _ from 'lodash';
import memoizeOne from 'memoize-one';

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
            uniqCatMap.set(item.foodCategoryName, item)
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
    rawDishes.forEach(item => {
        if (!uniqDishMap.has(`${item.foodName}${item.unit}`)) {
            uniqDishMap.set(`${item.foodName}${item.unit}`, item)
        }
    })
    const commonDishes = Array.from(uniqDishMap.values())
        .map(dish => ({
            ...dish,
            brandID: '0',
            brandName: '不限品牌',
            localFoodCategoryID: `0__${dish.foodCategoryName}`,
            label: `(不限品牌)${dish.foodName}(${dish.unit})`,
            price: dish.prePrice == -1 ? dish.price : dish.prePrice,
            newPrice: dish.prePrice == -1 ? dish.price : dish.prePrice,
            py: dish.foodMnemonicCode,
            value: `0__${dish.foodName}${dish.unit}`
        }));
    const categories = rawCategories.reduce((acc, curr) => {
        if (curr.brandID > 0) {
            const brandName = (brands.find(item => item.brandID === `${curr.brandID}`) || {brandName: '未知'}).brandName;
            acc.push({
                ...curr,
                brandID: `${curr.brandID}`,
                brandName,
                label: `(${brandName})${curr.foodCategoryName}`,
                py: curr.foodCategoryMnemonicCode,
                value: `${curr.brandID}__${curr.foodCategoryName}`
            })
        } else if (`${curr.brandID}` === '0') { // 把这种通用的分类扩展给每个品牌
            acc.push(...brands.map(brand => ({
                ...curr,
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
                value: `${curr.brandID}__${curr.foodName}${curr.unit}`
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
                value: `${brand.brandID}__${curr.foodName}${curr.unit}`
            })))
        }
        return acc;
    }, [...commonDishes])
    return {
        dishes: _.uniqBy(dishes, 'value'),
        categories: _.uniqBy(categories, 'value'),
        brands,
    }
}

export const memoizedExpandCategoriesAndDishes = memoizeOne(expandCategoriesAndDishes)
