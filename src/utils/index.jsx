import _ from 'lodash';

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
 * @param {*} $brands Immutable.List 从店铺schema接口获得的所有可选品牌
 * @param {*} $rawCategories Immutable.List 直接从基本档请求来的所有分类信息
 * @param {*} $rawDishes Immutable.List 直接从基本档请求来的所有菜品信息
 */
export const expandCategoriesAndDishes = ($brands, $rawCategories, $rawDishes) => {
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
            label: cat.foodCategoryName,
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
            label: `${dish.foodName}(${dish.unit})`,
            value: `0__${dish.foodName}${dish.unit}`
        }));
    const categories = rawCategories.reduce((acc, curr) => {
        if (curr.brandID > 0) {
            acc.push({
                ...curr,
                brandID: `${curr.brandID}`,
                brandName: (brands.find(item => item.brandID === `${curr.brandID}`) || {brandName: '未知'}).brandName,
                label: curr.foodCategoryName,
                value: `${curr.brandID}__${curr.foodCategoryName}`
            })
        } else if (`${curr.brandID}` === '0') { // 把这种通用的分类扩展给每个品牌
            acc.push(...brands.map(brand => ({
                ...curr,
                brandID: `${brand.brandID}`,
                brandName: brand.brandName,
                label: curr.foodCategoryName,
                value: `${brand.brandID}__${curr.foodCategoryName}`
            })))
        }
        return acc;
    }, [...commonCategories]);
    const dishes = rawDishes.reduce((acc, curr) => {
        if (curr.brandID > 0) {
            acc.push({
                ...curr,
                brandID: `${curr.brandID}`,
                brandName: (brands.find(item => item.brandID === `${curr.brandID}`) || {brandName: '未知'}).brandName,
                label: `${curr.foodName}(${curr.unit})`,
                localFoodCategoryID: `${curr.brandID}__${curr.foodCategoryName}`,
                value: `${curr.brandID}__${curr.foodName}${curr.unit}`
            })
        } else if (`${curr.brandID}` === '0') { // 把这种通用的菜品扩展给每个品牌
            acc.push(...brands.map(brand => ({
                ...curr,
                brandID: `${brand.brandID}`,
                brandName: brand.brandName,
                label: `${curr.foodName}(${curr.unit})`,
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
