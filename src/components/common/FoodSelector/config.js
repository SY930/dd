export const FILTERS = [{
    name: 'categories',
    key: 'foodCategoryID',
    valueKey: 'brandID',
    labelKey: 'brandName',
    label: '分类',
    valueKey: 'foodCategoryID',
    labelKey: 'foodCategoryName',
    pyKey: 'foodCategoryMnemonicCode',
    callserver: 'getGroupFoodCategory',
    callparams: { bookID: 0 },
}, {
    name: 'brands',
    key: 'brandID',
    label: '品牌',
    valueKey: 'brandID',
    labelKey: 'brandName',
    callserver: 'getShopBrand',
    callparams: { isActive: 1 },
}, {
    name: 'tags',
    key: 'tagID',
    valueKey: 'brandID',
    labelKey: 'brandName',
    label: '标签',
    valueKey: 'itemID',
    labelKey: 'tagName',
    path: 'data.tagDetailList',
    callserver: 'getFoodTags',
    callparams: { tagType: 3 },
}];
