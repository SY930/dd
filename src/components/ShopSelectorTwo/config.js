export const FILTERS = [{
    name: 'brands',
    key: 'brandID',
    label: '品牌',
    valueKey: 'brandID',
    labelKey: 'brandName',
    callserver: 'getShopBrand',
    callparams: {},
}, {
    name: 'shopCategorys',
    key: 'shopCategoryID',
    label: '店铺分组',
    valueKey: 'shopCategoryID',
    labelKey: 'shopCategoryName',
    callserver: 'getShopBrand',
    callparams: {},
}, {
    name: 'businessModels',
    key: 'businessModel',
    label: '经营模式',
    valueKey: 'businessModel',
    labelKey: 'businessModel',
    callserver: 'getShopBrand',
    callparams: {},
}, {
    name: 'cities',
    key: 'cityID',
    label: '城市',
    valueKey: 'cityID',
    labelKey: 'cityName',
    callserver: 'getShopCities',
    callparams: {},
}, {
    name: 'orgTags',
    key: 'orgTagIDs',
    label: '管理组织',
    display: 'tree',
}, {
    name: 'shopTags',
    key: 'tagIDs',
    label: '店铺属性',
    display: 'treeLeaf',
    valueKey: 'tagID',
    labelKey: 'tagName',
}];
