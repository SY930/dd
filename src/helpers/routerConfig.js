/** 我的桌面 menuID */
export const HOME_PAGE_KEY = 'home';
/** 产品下载 menuID */
export const DOWNLOADS_PAGE_KEY = 'downloads';
/** 消息中心 menuID */
export const MESSAGES_PAGE_KEY = 'messages';
/** 系统公告 menuID */
export const NOTICES_PAGE_KEY = 'notices';

/**
 * 本地页面配置。
 * @param {string} key 页面的唯一ID
 * @param {string} value 页面对应的 entryCode，在入口文件(如 meta.jsx)进行配置
 * @param {string} label 页面的名称
 * @param {Array<string>} parent 父级页面的 entryCode，多个用英文逗号隔开
 */
const PAGE_CONFIGS = [{
    key: DOWNLOADS_PAGE_KEY,
    value: '10000307',
    label: '产品下载',
}, {
    key: MESSAGES_PAGE_KEY,
    value: '394',
    label: '消息中心',
}, {
    key: NOTICES_PAGE_KEY,
    value: 'notices',
    label: '更新日志',
}, {
    key: 'newshop',
    value: 'shop.jituan.newshop',
    label: '新建店铺',
    parent: [
        'shop.jituan.dianpuxinxi',
    ],
}, {
    key: 'shopGuide',
    value: 'shopGuide',
    label: '新手入门',
}, {
    key: 'singleShopSupplierGuide',
    value: 'singleShopSupplierGuide',
    label: '供应商管理向导', // 单店版
}, {
    key: 'outWarhousePlusGuide',
    value: 'outWarhousePlusGuide',
    label: '调拨出库向导',
}, {
    key: 'singleShopMyMaterialsGuide',
    value: 'singleShopMyMaterialsGuide',
    label: '我的品项向导', // 单店版
}, {
    key: 'distributionSupplierAgreementPriceGuide',
    value: 'distributionSupplierAgreementPriceGuide',
    label: '供应商协议价向导',
}, {
    key: 'enterWarhouseMinusGuide',
    value: 'enterWarhouseMinusGuide',
    label: '入库冲销退货向导',
}, {
    key: 'purchaseVoucherGuide',
    value: 'purchaseVoucherGuide',
    label: '采购单新手入门',
}, {
    key: 'purchaseCheckInGuide',
    value: 'purchaseCheckInGuide',
    label: '采购验货',
}, {
    key: 'shopControlReturnGuide',
    value: 'shopControlReturnGuide',
    label: '统配退货新手入门',
}, {
    key: 'shopBreakageGuide',
    value: 'shopBreakageGuide',
    label: '报损向导',
}, {
    key: 'addFood',
    value: 'shop.jituan.caipinku.addfood',
    label: '新增菜品',
    parent: [
        'shop.jituan.caipinku',
    ],
},
{
    key: 'editorFood',
    value: 'shop.jituan.caipinku.editorfood',
    label: '编辑菜品',
    parent: [
        'shop.jituan.caipinku',
    ],
},
{
    key: 'bookDetail',
    value: 'shop.jituan.caipinku.bookdetail',
    label: '菜谱详情',
    parent: [
        'shop.jituan.jituancaipu',
    ],
},
{
    key: 'addShopFood',
    value: 'shop.jituan.caipinku.addshopfood',
    label: '新增菜品',
    parent: [
        'shop.mendian.caipinuanli',
    ],
},
{
    key: 'editorShopFood',
    value: 'shop.jituan.caipinku.editorshopfood',
    label: '编辑菜品',
    parent: [
        'shop.mendian.caipinuanli',
    ],
},
{
    key: 'shopExamineGoodsGuide',
    value: 'shopExamineGoodsGuide',
    label: '验货向导',
}, {
    key: 'warehouseBeginningGuide',
    value: 'warehouseBeginningGuide',
    label: '仓库期初向导页面',
}, {
    key: 'voucherManagementGuide',
    value: 'voucherManagementGuide',
    label: '出库退货/冲销向导',
}, {
    key: 'goodsCheckCountGuide',
    value: 'goodsCheckCountGuide',
    label: '门店盘点向导',
}, {
    key: 'goodsCheckCountProblemGuide',
    value: 'goodsCheckCountProblemGuide',
    label: '常见问题',
}, {
    key: 'shopCheckIncomingGuide',
    value: 'shopCheckIncomingGuide',
    label: '库存单据',
}, {
    key: 'warehouseBeginningProblemGuide',
    value: 'warehouseBeginningProblemGuide',
    label: '常见问题',
}, {
    key: 'shopOrderGuide',
    value: 'shopOrderGuide',
    label: '订货向导',
},


];

export const LOCAL_PAGE_CONFIG = PAGE_CONFIGS.reduce((ret, config) => {
    const { key, ...otherCfg } = config;
    if (ret[key]) throw new Error(`local page key conflict: ${key}`);
    return { ...ret, [key]: otherCfg };
}, {});
