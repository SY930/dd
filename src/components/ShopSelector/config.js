import { SALE_LABEL } from 'i18n/common/salecenter';


export const FILTERS = [{
    name: 'brands',
    key: 'brandID',
    label: <span>{SALE_LABEL.k5dlpn4t}</span>,
    valueKey: 'brandID',
    labelKey: 'brandName',
    callserver: 'getShopBrand',
    callparams: {},
}, {
    name: 'shopCategories',
    key: 'shopCategoryID',
    label: <span>{SALE_LABEL.d16hlk3kccf0161}</span>,
    valueKey: 'shopCategoryID',
    labelKey: 'shopCategoryName',
    callserver: 'getShopBrand',
    callparams: {},
}, {
    name: 'businessModels',
    key: 'businessModel',
    label: <span>{SALE_LABEL.dok9lk8l8157}</span>,
    valueKey: 'businessModel',
    labelKey: 'businessType',
}, /*{
    name: 'orgs',
    key: 'parentOrgID',
    label: '组织',
    display: 'tree',
    valueKey: 'orgID',
    labelKey: 'orgName',
},*/ {
    name: 'citys',
    key: 'cityID',
    label: <span>{SALE_LABEL.dok9lk8l82132}</span>,
    valueKey: 'cityID',
    labelKey: 'cityName',
    callserver: 'getShopCities',
    callparams: {},
}, {
    name: 'orgTags',
    key: 'orgTagIDs',
    label: <span>{SALE_LABEL.d5g4obe6e1346}</span>,
    display: 'tree',
}, {
    name: 'shopTags',
    key: 'tagIDs',
    label: <span>{SALE_LABEL.d455j75nqf4152}</span>,
    display: 'treeLeaf',
    valueKey: 'tagID',
    labelKey: 'tagName',
}];
