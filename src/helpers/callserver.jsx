/* eslint-disable max-len */
const apiCfg = [
    // 框架页面
    ['getUserInfo', '/api/user/getUserInfo'],
    ['getMenuList', '/api/user/auth/selectMenus'],
    ['userLogout', '/api/user/logOff'],
    ['registerUserInfo', '/api/shopcenter/shop/registerUserInfo'],
    ['setGroupAccountShortCut', '/api/user/auth/setGroupAccountShortCut'],
    ['getMessageCount', '/api/message/queryMessageCounts', { type: 'JSON' }],
    // 系统管理
    ['getRoleList', '/api/user/auth/selectRoles'], // 获取角色列表
    ['toggerActiveRole', '/api/user/auth/isActiveRole'], // 启停角色
    ['getAccountInfo', '/api/user/auth/getAccountInfo'], // 得到登陆账户的信息
    ['createRole', '/api/user/auth/insertRole'], // 创建角色
    ['editRole', '/api/user/auth/updateRole'], // 修改角色
    ['getPermissions', '/api/user/auth/selectRights'], // 得到权限列表
    ['deleteRole', '/api/user/auth/deleteRole'], // 删除角色
    ['editRolePermissions', '/api/user/auth/updateRoleRights'], // 修改角色权限
    ['getAccountList', '/api/user/auth/selectGroupAccounts'], // 获取集团账户列表
    ['insertAccount', '/api/user/auth/insertGroupAccount'], // 创建集团账号
    ['updateAccount', '/api/user/auth/updateGroupAccount'], // 修改集团账号
    ['deleteAccount', '/api/user/auth/deleteGroupAccount'], // 删除集团账号
    ['resetAccountPWD', '/api/user/auth/resetGroupAccountLoginPwd'], // 重置集团账号密码
    ['setAccountPermissions', '/api/user/auth/setAccountPermissions'], // 设置集团账号功能、数据权限
    ['getAccountPermissions', '/api/user/auth/selectAccountDataPermissions'],
    ['getDeviceInfoLst', '/api/shopcenter/base/getDeviceInfoLst'],
    ['deleteDeviceInfo', '/api/shopcenter/base/deleteDeviceInfo'],
    ['updateDeviceInfo', '/api/shopcenter/base/updateDeviceInfo'],
    // 收入科目
    ['printerQuery', '/api/shopcenter/base/printerQuery'],
    ['getIncomeSubjects', '/api/shopcenter/base/subjectQuery'],
    ['getIncomeSubjects_NEW', '/api/shopcenter/base/subjectQuery_NEW'],
    ['addIncomeSubject', '/api/shopcenter/base/subjectInsert'],
    ['updateIncomeSubject', '/api/shopcenter/base/subjectUpdate'],
    ['switchIncomeSubject', '/api/shopcenter/base/subjectActive'],
    ['deleteIncomeSubject', '/api/shopcenter/base/subjectDelete'],
    ['getRole', '/api/shopcenter/base/roleQuery'],
    // 供货商协议价（多列外） AgreementPriceException ben 2017-06-01
    ['auditPrice', '/api/supplychain/basic/goodPrice/auditPrice', { type: 'JSON' }],
    ['queryFastPriceList', '/api/shopcenter/base/goodPrice/queryFastPriceList', { type: 'JSON' }], // 查询加工列表
    ['queryFastPriceExt', '/api/shopcenter/base/goodPrice/queryFastPriceExt', { type: 'JSON' }], // 查询例外
    ['getSubDistribution', '/api/supplychain/basic/organizationGetSubDistribution', { type: 'JSON' }], // 获取下级配送中心的组织

    /* SupplyChain ben 查询组织品项或集团品项 公共服务 */
    ['queryAll', '/api/shopcenter/base/goodsCategory/queryAll', { type: 'JSON' }], // 1:查询集团下品项的分类【我的加工品、配方管理（新增原料）】
    ['queryGoodsList', '/api/supplychain/basic/goodsQueryGoodsList', { type: 'JSON' }], // 2:查询集团下的品项【我的加工品、配方管理（新增原料）】
    ['queryShopCategory', '/api/supplychain/basic/queryShopCategory', { type: 'JSON' }], // 3:查询组织下品项的分类【配方管理（新增加工出品）】
    ['queryShopGoodsList', '/api/supplychain/basic/queryShopGoodsList', { type: 'JSON' }], // 4:查询组织下的品项【配方管理（新增加工出品）】
    /* SupplyChain ben 我的加工间 MyProcessedProducts */
    ['querySearchProceseList', '/api/shopcenter/base/procesed/querySearchProceseList', { type: 'JSON' }], // NEW:加工品页面搜索功能获取列表
    ['updateProceseGoodsPrice', '/api/shopcenter/base/procesed/updateProceseGoodsPrice', { type: 'JSON' }], // NEW:修改加工品的单价
    ['queryProcesedGoodsList', '/api/shopcenter/base/procesed/queryProcesedGoodsList', { type: 'JSON' }], // 1:查询我的加工品(表格数据和表格上的检索都是这个接口)
    ['deleteProcesedGoods', '/api/shopcenter/base/procesed/deleteProcesedGoods', { type: 'JSON' }], // 2:删除我的加工品
    ['updateProcesedGoods', '/api/shopcenter/base/procesed/updateProcesedGoods', { type: 'JSON' }], // 3:修改加工品的默认加工间
    ['queryProcesedGoodsByDemandID', '/api/basic/procesed/queryProcesedGoodsByDemandID', { type: 'JSON' }], // 4:查询加工间存在的加工品（添加加工品时用到）
    ['queryProcesedGoodsFromGroup', '/api/basic/procesed/queryProcesedGoodsFromGroup', { type: 'JSON' }], // 5:根据分类ID查询集团下的加工品（添加加工品时用到）   配方管理-新增加工原料
    ['queryProcesedGoodsCategory', '/api/shopcenter/base/procesed/queryProcesedGoodsCategory', { type: 'JSON' }], // 6:查询我的加工间下的分类（左侧树）
    ['addProcesedGoods', '/api/shopcenter/base/procesed/addProcesedGoods', { type: 'JSON' }], // 7:添加我的加工品
    ['queryMaterial', '/api/supplychain/basic/material/queryMaterial', { type: 'JSON' }], // 8:虚拟品项
    ['getOrg', '/api/shopcenter/base/organization/getOrg', { type: 'JSON' }],
    ['queryShopGoodsBySearchKey', '/api/supplychain/basic/queryShopGoodsBySearchKey', { type: 'JSON' }], // 8:获取配送中心的加工间  获取配送中心组织
    ['queryLevel3Category', '/api/shopcenter/base/goodsCategory/queryLevel3Category', { type: 'JSON' }], // 订货到加工单的 获取分类
    // supplyChain 历史盘点表
    ['queryInventoryList', '/api/supplychain/invetory/queryInventoryList', { type: 'JSON' }], // 查询历史盘点表
    ['queryInventoryDetail', '/api/supplychain/invetory/queryInventoryDetail', { type: 'JSON' }], // 历史盘点表详情
    // 门店生产加工
    ['querySemifinishedCostcardListByShop', '/api/supplychain/basic/semifinishedCostcard/querySemifinishedCostcardListByShop', { type: 'JSON' }], // 门店半成品成本卡列表
    ['querySemifinishedCostcardDetailByshop', '/api/supplychain/basic/semifinishedCostcard/querySemifinishedCostcardDetailByshop', { type: 'JSON' }], // 门店半成品成本卡详情列表
    ['subtractBuckleLibrary', '/api/supplychain/stocks/voucher/subtractBuckleLibrary', { type: 'JSON' }], // 门店自动扣库
    ['queryVoucherList', '/api/supplychain/stocks/voucher/queryVoucherList', { type: 'JSON' }], // 门店加工入库单列表
    ['insertVoucher', '/api/supplychain/stocks/voucher/insertVoucher', { type: 'JSON' }], // 门店加工入库单添加
    ['updateVoucherInfo', '/api/supplychain/stocks/voucher/updateVoucherInfo', { type: 'JSON' }], // 门店加工入库单编辑
    // supplychain 统配验货查询
    ['queryShopInspectionStatus', '/api/supplychain/stocks/voucherDetail/queryShopInspectionStatus', { type: 'JSON' }], // 统配验货查询
    // supplychain 基础设置检查
    ['checkOrgHaveGoods', '/api/supplychain/basic/check/checkOrgHaveGoods', { type: 'JSON' }], // 1.未分配品项的仓库
    ['checkShopAndHouse', '/api/supplychain/basic/organization/checkShopAndHouse', { type: 'JSON' }], // 2.未启用/设置为仓库组织的组织：
    ['checkSupplierList', '/api/supplychain/basic/supplier/checkSupplierList', { type: 'JSON' }], // 4.没有设过规则的供应商：
    ['queryGoodsNotRouter', '/api/supplychain/basic/distributionRouter/queryGoodsNotRouter', { type: 'JSON' }], // 5.没有设过规则的供应商：
    ['checkGoodsPriceList', '/api/supplychain/basic/check/checkGoodsPriceList', { type: 'JSON' }], // 6.没有设置过报价的品项
    ['queryNotBomFood', '/api/supplychain/basic/costcard/queryNotBomFood', { type: 'JSON' }], // 7.没有设置过bom的菜品
    ['checkProduce', '/api/supplychain/basic/check/checkProduce', { type: 'JSON' }], // 8.没有设置过bom的加工品
    // supplychain 报表
    ['queryItemRemainderReportList', '/api/supplychain/chainReport/balanceReport/getGoodsBalance', { type: 'JSON' }],
    ['queryItemDetailReportList', '/api/supplychain/chainReport/balanceReport/getGoodsBalanceDetails', { type: 'JSON' }],
    ['queryInventoryInAndOutDetailList', '/api/supplychain/chainReport/balanceReport/getStockInOutDetail', { type: 'JSON' }],
    ['exportInventoryInAndOutDetailList', '/api/supplychain/chainReport/balanceReport/exportStockInOutDetail', { type: 'JSON' }],
    ['querySupplierPurchaseCategoryList', '/api/supplychain/chainReport/balanceReport/getSupplierGoodsCategory', { type: 'JSON' }],
    ['exportSupplierPurchaseCategoryList', '/api/supplychain/chainReport/balanceReport/exportSupplierGoodsCategory', { type: 'JSON' }],
    ['queryCollectionOfLibraryCategoryList', '/api/supplychain/chainReport/balanceReport/getHouseOutCategory', { type: 'JSON' }],
    ['exportCollectionOfLibraryCategoryList', '/api/supplychain/chainReport/balanceReport/exportHouseOutCategory', { type: 'JSON' }],
    ['getShopInventory', '/api/supplychain/chainReport/esReport/shop/getShopInventory', { type: 'JSON' }],
    ['queryIncomeCostStatisticsList', '/api/supplychain/chainReport/balanceReport/getInComeCostSum', { type: 'JSON' }],
    ['getSupplierGoodsCategory', '/api/supplychain/chainReport/balanceReport/getSupplierGoodsCategory', { type: 'JSON' }],
    ['getStraightCheckDiff', '/api/supplychain/esReport/straightCheckDiff/getStraightCheckDiff', { type: 'JSON' }],
    ['exportStraightCheckDiff', '/api/supplychain/esReport/straightCheckDiff/exportStraightCheckDiff', { type: 'JSON' }],
    ['exportIncomeCostStatisticsList', '/api/supplychain/chainReport/balanceReport/exportInComeCostSum', { type: 'JSON' }],
    // ['checkShopAndHouse','/api/basic/organization/checkShopAndHouse',{type: 'JSON'}],
    ['checkShopisOpeningBalance', '/api/supplychain/basic/organization/checkShopisOpeningBalance', { type: 'JSON' }], // 10.检测仓库期初
    // 出成率
    ['queryGoodsRateList', '/api/supplychain/basic/goods/queryGoodsRateList', { type: 'JSON' }],
    ['updateGoodsRateList', '/api/supplychain/basic/goods/updateGoodsRateList', { type: 'JSON' }],
    ['queryHouseAndOtherDistributions', '/api/supplychain/basic/organization/queryHouseAndOtherDistributions', { type: 'JSON' }], // 配送规则按门店查询编辑
    ['updateRouterDefaultSupplier', '/api/supplychain/basic/distributionRouter/updateRouterDefaultSupplier', { type: 'JSON' }], // 配送规则设置默认供货商
    ['addBatch', '/api/supplychain/basic/distributionRouter/addBatch', { type: 'JSON' }], // 添加配送供货商
    ['organizationGetShopCategoryAndShop', '/api/supplychain/basic/organizationGetShopCategoryAndShop', { type: 'JSON' }], // 添加配送供货商
    // 集团信息
    ['getGroupBasicInfo', '/api/shopcenter/shop/queryGroupInfo'],
    ['setGroupLogo', '/api/shopcenter/shop/setGroupLOGO'],
    // 单注品注
    ['queryGroupBrand', '/api/shopcenter/queryGroupBrand'],
    ['queryNotesType', '/api/shopcenter/queryNotesType'],
    ['deleteFoodRemark', '/api/shopcenter/deleteFoodRemark'],
    ['addFoodRemark', '/api/shopcenter/addFoodRemark'],
    ['queryFoodRemark', '/api/shopcenter/queryFoodRemark'],
    ['updateFoodRemark', '/api/shopcenter/updateFoodRemark'],
    ['batchAddFoodRemark', '/api/shopcenter/batchAddFoodRemark'],
    // 结账方式管理
    ['groupSubjectChangeIsActive', '/api/shopcenter/groupSubjectChangeIsActive'],
    ['groupSubjectDelete', '/api/shopcenter/groupSubjectDelete'],
    ['groupSubjectUpdate', '/api/shopcenter/groupSubjectUpdate'],
    ['groupSubjectAdd', '/api/shopcenter/groupSubjectAdd'],
    ['shopSubjectQuery', '/api/shopcenter/shopSubjectQuery'],
    ['shopSubjectDelete', '/api/shopcenter/shopSubjectDelete'],
    ['shopSubjectUpdate', '/api/shopcenter/shopSubjectUpdate'],
    ['shopSubjectAdd', '/api/shopcenter/shopSubjectAdd'],
    ['subjectBookSetDetail', '/api/shopcenter/subjectBookSetDetail'],
    ['shopSubjectChangeIsActive', '/api/shopcenter/shopSubjectChangeIsActive'],
    ['groupSubjectUpdateSortIndex', '/api/shopcenter/groupSubjectUpdateSortIndex'],
    ['shopSubjectUpdateSortIndex', '/api/shopcenter/shopSubjectUpdateSortIndex'],
    // 站点管理
    ['updateDeviceGroup', '/api/shopcenter/shop/updateDeviceGroup'],
    ['deleteDeviceGroup', '/api/shopcenter/shop/deleteDeviceGroup'],
    ['queryDeviceGroup', '/api/shopcenter/shop/queryDeviceGroup'],
    ['addDeviceGroup', '/api/shopcenter/shop/addDeviceGroup'],

    // 部门管理--集团视角
    ['groupDepartmentInsert', '/api/shopapi/groupDepartmentInsert'],
    ['groupDepartmentUpdate', '/api/shopapi/groupDepartmentUpdate'],
    ['groupDepartmentDelete', '/api/shopapi/groupDepartmentDelete'],
    ['groupDepartmentQuery', '/api/shopapi/groupDepartmentQuery'],

    // 部门管理--门店视角 单店视角
    ['insertShopDepartment', '/api/shopapi/insertShopDepartment'],
    ['updateShopDepartment', '/api/shopapi/updateShopDepartment'],
    ['deleteShopDepartment', '/api/shopapi/deleteShopDepartment'],
    ['queryShopDepartment', '/api/shopapi/queryShopDepartment'],
    ['queryGroupDepartmentsByShop', '/api/shopapi/queryGroupDepartmentsByShop'],

    // 门店管理
    ['getShopType', '/api/shopcenter/shop/getShopType'],
    ['groupSubjectQuery', '/api/shopcenter/groupSubjectQuery'],
    ['queryGroupSubjectCategory', '/api/shopcenter/queryGroupSubjectCategory'],
    ['subjectBookQuery', '/api/shopcenter/group/queryFoodBookInfo'],
    ['queryFoodBookPublishBatch', '/api/shopcenter/group/queryFoodBookPublishBatch'],
    ['subjectBookAdd', '/api/shopcenter/group/addFoodBook'],
    ['subjectBookDelete', '/api/shopcenter/group/deleteFoodBook'],
    ['subjectBookUpdate', '/api/shopcenter/group/updateFoodBook'],
    ['AddFoodBookPublish', '/api/shopcenter/group/AddFoodBookPublish'],
    ['revokeFoodBookPublish', '/api/shopcenter/group/revokeFoodBookPublish'],
    ['queryFoodBookPublish', '/api/shopcenter/group/queryFoodBookPublish'],
    ['queryFoodInfo', '/api/shopcenter/group/queryFoodInfo'],
    ['getAccountSupplier', '/api/shopcenter/shop/getSupplierList'],
    ['getAccountGoods', '/api/shopcenter/shop/getGoodsList'],
    ['getFsmSettleUnit', '/api/shopcenter/fsm/queryFsmSettleUnit'],
    /* Org 组织架构 */
    ['getShopOrg', '/api/shopcenter/group/selectOrgs'],
    ['addShopOrg', '/api/shopcenter/group/insertOrg'],
    ['getShopOrgParams', '/api/shopcenter/group/selectOrgParams'],
    ['updateShopOrg', '/api/shopcenter/group/updateOrg'],
    ['getAuthModel', '/shopcenter/group/queryGroupAuthModel.svc'],
    ['getShopInfo', '/api/shopcenter/shop/queryShopInfo'],
    /* promotion 营销 */
    ['getSchema', '/api/shopcenter/shop/schema'],
    ['getShopByParam', '/api/shopcenter/shop/query'],
    ['getFoodCategory', '/saas/api/shopcenter/shop/getFoodCategory'],
    ['getFoodMenu', '/api/shopcenter/shop/queryShopFoodMenu'],

    // 卡类别设置
    ['getDemoItems', '/api/shopcenter/api/shopcenter/crm/getDemoItems', { method: 'POST' }],
    ['getCrmCardList', '/api/shopcenter/crm/getCardTypeListInfo'],
    ['getCrmCardDetailByID', '/api/shopcenter/crm/getCardTypeDetailInfo'],
    ['addCrmCardBaseParam', '/api/shopcenter/crm/addCardTypeInfo'],
    ['updateCrmCardBaseParam', '/api/shopcenter/crm/updateCardTypeInfo'],
    ['getInitCardTypeLevel', '/api/shopcenter/crm/initCardTypeLevel'],
    ['updateCardTypeLevel', '/api/shopcenter/crm/updateCardTypeLevel'],
    ['addCardTypeLevel', '/api/shopcenter/crm/addCardTypeLevel'],
    ['getCardTypeLevelDetail', '/api/shopcenter/crm/getCardTypeLevelInfo'],
    ['getCardTypeLevelList', '/api/shopcenter/crm/getCardTypeLevelList'],
    ['getCardTypeSelectedShops', '/api/shopcenter/crm/getCardTypeShop'],
    ['addCardTypeShop', '/api/shopcenter/crm/addCardTypeShop'],
    ['getCardTypeShops', '/api/shopcenter/crm/GroupParamsService_queryGroupUnbindShopList'],

    ['getCrmCardList_dkl', '/api/shopcenter/crm/cardTypeParamsService_getCardTypeListInfo'],
    ['addCardTypeLevel_dkl', '/api/shopcenter/crm/cardTypeLevelService_addCardTypeLevel'],
    ['getCardTypeLevelListDkl', '/api/shopcenter/crm/cardTypeLevelService_getCardTypeLevelList'],
    ['getCrmCardDetailByID_dkl', '/api/shopcenter/crm/cardTypeParamsService_getCardTypeDetailInfo'],
    ['addCardTypeinfo_dkl', '/api/shopcenter/crm/cardTypeParamsService_addCardTypeInfo'],
    ['updateCrmCardBaseParam_dkl', '/api/shopcenter/crm/cardTypeParamsService_updateCardTypeInfo'],
    ['updateCardTypeLevel_dkl', '/api/shopcenter/crm/cardTypeLevelService_updateCardTypeLevel'],
    ['queryGroupCustomerCardList_dkl', '/api/shopcenter/crm/groupParamsService_fuzzyQueryGroupCustomerCardList'],
    ['getCardTypeSelectedShops_dkl', '/api/shopcenter/crm/cardTypeShopService_getCardTypeShop'],
    ['getAllChannelInfo', '/api/shopcenter/crm/crmChannelService_queryAllChannelInfo'],
    ['cardTypeSort', '/api/shopcenter/crm/cardTypeParamsService_updateCardTypeRanking'],

    // 客户资料
    ['addCrmCard', '/api/shopcenter/crm/openCard'],
    ['addNewCustomer', '/api/shopcenter/crm/addNewCustomer'],
    ['queryCardInfo', '/api/shopcenter/crm/queryCardInfo'],
    ['getCardTransDetail', '/api/shopcenter/crm/getCardTransDetail'],
    ['getCardGiftList', '/api/shopcenter/crm/getCardGiftList'],
    ['getCardLogs', '/api/shopcenter/crm/getCardLogs'],
    ['manualAdjustBalance', '/api/shopcenter/crm/manualAdjustBalance'],
    ['updateCardInfo', '/api/shopcenter/crm/updateCardInfo'],
    ['queryCustomerCardInfo', '/api/shopcenter/crm/queryCustomerCardInfo'],
    ['updateCustomerInfo', '/api/shopcenter/crm/updateCustomerInfo'],
    ['queryGroupCustomerCardList', '/api/shopcenter/crm/GroupParamsService_queryGroupCustomerCardList'],
    ['cardInfoService_openCard', '/api/shopcenter/crm/cardInfoService_openCard'],
    ['cardInfoService_addNewCustomer', '/api/shopcenter/crm/cardInfoService_addNewCustomer'],
    ['cardInfoService_queryCardInfo', '/api/shopcenter/crm/cardInfoService_queryCardInfo'],

    ['getCardTransDetail_dkl', '/api/shopcenter/crm/crmTransDetailService_getCardTransDetail'],
    ['getCardGiftList_dkl', '/api/shopcenter/crm/crmGiftService_getCardGiftList'],
    ['getCardLogs_dkl', '/api/shopcenter/crm/cardLogService_getCardLogs'],
    ['queryCustomerCardInfo_dkl', '/api/shopcenter/crm/customerService_queryCustomerCardInfo'],
    ['updateCustomerInfo_dkl', '/api/shopcenter/crm/customerService_updateCustomerInfo'],
    ['getCardInterestList_dkl', '/api/shopcenter/crm/crmGiftService_getCardInterestList'],
    ['getFutureRightsLst', '/api/shopcenter/crm/futureRightsRecordRpcService_listAllFutureRights'],
    ['getInvoiceOutRecord', '/api/shopcenter/crm/invoiceRpcService_getInvoiceOutRecord'],
    ['billDetail', '/api/crm/business/json/billDetail'],
    // 卡操作
    ['getCardInfo', '/api/shopcenter/crm/searchCardByInfo'],
    ['getCrmInfo', '/api/shopcenter/crm/cardInfoService_queryCardInfo'],
    ['updateCrmOperationRecharge', '/api/shopcenter/crm/cardRecharge'],
    ['crmOperationRecharge', '/api/shopcenter/crm/crmRechargeService_recharge'],
    ['updateCrmOperation', '/api/shopcenter/crm/updateCardStatus'],
    ['crmOperationCanUsedSet', '/api/shopcenter/crm/CrmSaveMoneySetService_queryCardSaveMoneySets'],
    ['crmOperationAdjustQuota', '/api/shopcenter/crm/updateCreditAmount'],
    ['crmOperationPostpone', '/api/shopcenter/crm/deferCardValidUntiDate'],
    ['crmOperationBatchPostpone', '/api/shopcenter/crm/batchDeferCardValidUntiDate'],
    ['crmOperationConsume', '/api/shopcenter/crm/cardConsume'],
    ['crmOperationRecede', '/api/shopcenter/crm/cardRefund'],
    ['crmOperationResetCardPWD', '/api/shopcenter/crm/resetCardPWD'],
    ['crmOperationChangeCardPWD', '/api/shopcenter/crm/changeCardPWD'],
    ['crmOperationUUID', '/api/shopcenter/crm/getUUID'],
    ['crmChangeCardGiftStatus', '/api/shopcenter/crm/changeCardGiftStatus'],
    ['getCrmOperationShops', '/api/shopcenter/crm/getShops4Card'],
    ['getUnbindCardTypeShops', '/api/shopcenter/crm/getUnbindCardTypeShops'],
    ['updateCrmOperationStatus', '/api/shopcenter/crm/cardInfoService_updateCardStatus'],

    ['crmOperationResetCardPWD_dkl', '/api/shopcenter/crm/cardInfoService_resetCardPWD'],
    ['crmOperationUUID_dkl', '/api/shopcenter/crm/uUIDService_getUUID'],
    ['getCrmOperationShops_dkl', '/api/shopcenter/crm/cardUseShopService_getShops4Card'],
    ['getUnbindCardTypeShops_dkl', '/api/shopcenter/crm/cardUseShopService_getUnbindCardTypeShops'],
    ['manualAdjustBalance_dkl', '/api/shopcenter/crm/crmRechargeService_manualAdjustBalance'],
    ['crmOperationAdjustQuota_dkl', '/api/shopcenter/crm/cardInfoService_updateCreditAmount'],
    ['crmOperationPostpone_dkl', '/api/shopcenter/crm/cardInfoService_deferCardValidUntiDate'],
    ['crmOperationBatchPostpone_dkl', '/api/shopcenter/crm/cardInfoService_batchDeferCardValidUntiDate'],
    ['crmOperationConsume_dkl', '/api/shopcenter/crm/crmConsumeService_cardConsume'],
    ['crmOperationChangeCardPWD_dkl', '/api/shopcenter/crm/cardInfoService_changeCardPWD'],
    ['crmChangeCardGiftStatus_dkl', '/api/shopcenter/crm/crmGiftService_changeCardGiftStatus'],
    ['crmOperationCanUsedSet_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_queryCardSaveMoneySets_dkl'],
    ['crmOperationOutInvoice', '/api/shopcenter/crm/invoiceRpcService_outInvoice'],

    // 会员推荐
    ['getCrmParams', '/api/shopcenter/crm/getCardTypeRecommendationInfo'],
    ['setCrmParams', '/api/shopcenter/crm/updateCardTypeRecommendationInfo'],

    ['getCrmParams_dkl', '/api/shopcenter/crm/cardTypeRecommendService_getCardTypeRecommendationInfo'],
    ['setCrmParams_dkl', '/api/shopcenter/crm/cardTypeRecommendService_updateCardTypeRecommendationInfo'],

    // 会员充值
    ['getSetList', '/api/shopcenter/crm/queryCrmSaveMoneySets'],
    ['getSetUsedShops', '/api/shopcenter/crm/getGroupShops'],
    ['getSetUsedLevels', '/api/shopcenter/crm/getGroupCardTypeLevels'],
    ['addSet', '/api/shopcenter/crm/addCrmSaveMoneySet'],
    ['getSetCardLevel', '/api/shopcenter/crm/queryCrmSaveMoneySetCardLevel'],
    ['getSetUpToCardLevel', '/api/shopcenter/crm/queryCrmSaveMoneySetUpToCardLevel'],
    ['getCrmSaveMoneySetShops', '/api/shopcenter/crm/queryCrmSaveMoneySetShops'],
    ['getCrmSetByID', '/api/shopcenter/crm/queryCrmSaveMoneySetInfo'],
    ['updateSet', '/api/shopcenter/crm/updateGroupSaveMoneySet'],
    ['deleteSet', '/api/shopcenter/crm/delGroupSaveMoneySet'],

    ['getSetUsedShops_dkl', '/api/shopcenter/crm/groupParamsService_getGroupShops'],
    ['getSetUsedShopList_dkl', '/api/shopcenter/crm/groupParamsService_queryCardTypeCanBindShopList'],
    ['getSetUsedLevels_dkl', '/api/shopcenter/crm/groupParamsService_getGroupCardTypeLevels'],
    ['addSet_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_addCrmSaveMoneySet'],
    ['getCrmSetByID_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_queryCrmSaveMoneySetInfo'],
    ['updateSet_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_updateGroupSaveMoneySet'],
    ['deleteSet_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_delGroupSaveMoneySet'],
    ['getSetList_dkl', '/api/shopcenter/crm/crmSaveMoneySetService_queryCrmSaveMoneySets'],

    // 会员群组 CrmGroup ben 2017-4-25
    ['queryGroupMembersList', '/api/shopcenter/crm/groupMembersService_queryGroupMembersList'], // 添加会员群体
    ['addNewGroupMembers', '/api/shopcenter/crm/groupMembersService_addNewGroupMembers'], // 添加会员群体
    ['deleteGroupMembers', '/api/shopcenter/crm/groupMembersService_deleteGroupMembers'], // 删除会员群体
    ['queryGroupMembersParams', '/api/shopcenter/crm/groupMembersService_queryGroupMembersParams'], // 编辑会员群体 获取
    ['updateGroupMembers', '/api/shopcenter/crm/groupMembersService_updateGroupMembers'], // 编辑会员群体 保存
    ['queryGroupMembersDetail', '/api/shopcenter/crm/groupMembersService_queryGroupMembersDetail'],


    ['queryGroupMembersList_dkl', '/api/shopcenter/crm/groupMembersService_queryGroupMembersList_dkl'], // 添加会员群体
    ['addNewGroupMembers_dkl', '/api/shopcenter/crm/groupMembersService_addNewGroupMembers_dkl'], // 添加会员群体
    ['deleteGroupMembers_dkl', '/api/shopcenter/crm/groupMembersService_deleteGroupMembers_dkl'], // 删除会员群体
    ['queryGroupMembersParams_dkl', '/api/shopcenter/crm/groupMembersService_queryGroupMembersParams_dkl'], // 编辑会员群体 获取
    ['updateGroupMembers_dkl', '/api/shopcenter/crm/groupMembersService_updateGroupMembers_dkl'], // 编辑会员群体 保存
    ['queryGroupMembersDetail_dkl', '/api/shopcenter/crm/groupMembersService_queryGroupMembersDetail_dkl'],

    // 店铺授信
    ['getShopCreditList', '/api/shopcenter/crm/getCrmShopParamsList'],
    ['getCrmPayList', '/api/shopcenter/crm/getShopPayList'],
    ['updateCrmShopParams', '/api/shopcenter/crm/updateCrmShopParams'],
    ['crmShopCreditShopPay', '/api/shopcenter/crm/shopPay'],

    ['getShopCreditList_dkl', '/api/shopcenter/crm/crmShopParamsService_getCrmShopParamsList'],
    ['getCrmPayList_dkl', '/api/shopcenter/crm/crmShopPaymentHistoryService_getShopPayList'],
    ['updateCrmShopParams_dkl', '/api/shopcenter/crm/crmShopParamsService_updateCrmShopParams'],
    ['crmShopCreditShopPay_dkl', '/api/shopcenter/crm/crmShopPaymentHistoryService_shopPay'],

    // 礼品
    ['getGifts', '/api/shopcenter/crm/getGifts'],
    ['addGift', '/api/shopcenter/crm/addGift'],
    ['removeGift', '/api/shopcenter/crm/removeGift'],
    ['updateGift', '/api/shopcenter/crm/updateGift'],
    ['getGiftShops', '/api/shopcenter/crm/getGiftShops'],
    ['getSortedGifts', '/api/shopcenter/crm/getSortedGifts'],
    ['getGiftUsageInfo', '/api/shopcenter/crm/getGiftUsageInfo'],
    ['getGiftSummary', '/api/shopcenter/crm/getGiftSummary'],
    ['getCardInfoByMobile', '/api/shopcenter/crm/getCardInfoByMobile'],
    ['sendGifts', '/api/shopcenter/crm/sendGifts'],
    ['updateCardUseShop', '/api/shopcenter/crm/updateCardUseShop'],
    ['getCardUseShopList', '/api/shopcenter/crm/getCardUseShopList'],

    ['getSortedGifts_dkl', '/api/shopcenter/crm/getSortedGifts_dkl', { type: 'JSON' }],
    ['updateCardUseShop_dkl', '/api/shopcenter/crm/cardUseShopService_updateCardUseShop'],
    ['getCardUseShopList_dkl', '/api/shopcenter/crm/cardUseShopService_getCardUseShopList'],
    ['sendGifts_dkl', '/api/shopcenter/crm/crmGiftService_sendGifts'],
    ['getGifts_dkl', '/api/shopcenter/crm/crmGiftService_getGifts', { type: 'JSON' }],
    ['addGift_dkl', '/api/shopcenter/crm/crmGiftService_addGift', { type: 'JSON' }],
    ['removeGift_dkl', '/api/shopcenter/crm/crmGiftService_removeGift', { type: 'JSON' }],
    ['updateGift_dkl', '/api/shopcenter/crm/crmGiftService_updateGift', { type: 'JSON' }],
    ['getGiftShops_dkl', '/api/shopcenter/crm/giftShopService_getGiftShops'],
    ['getGiftUsageInfo_dkl', '/api/shopcenter/crm/crmGiftService_getGiftUsageInfo', { type: 'JSON' }],
    ['getGiftSummary_dkl', '/api/shopcenter/crm/crmGiftService_getGiftSummary'],
    ['getCardInfoByMobile_dkl', '/api/shopcenter/crm/getCardInfoByMobile'],
    ['getSharedGifts', '/api/shopcenter/crm/crmGiftService_getSharedGifts', { type: 'JSON' }],

    // 定额卡
    ['addSendCard', '/api/shopcenter/crm/issueGiftCards'],
    ['changeQuotaStatus', '/api/shopcenter/crm/changeGiftCardStatus'],
    ['getQuotaSummary', '/api/shopcenter/crm/getQuotaSummary'],
    ['getQuotaBatchInfo', '/api/shopcenter/crm/getQuotaBatchInfo'],
    ['getQuotaBatchDetail', '/api/shopcenter/crm/getQuotaBatchDetail'],
    ['getQuotaSummary_dkl', '/api/shopcenter/crm/crmQuotaCardService_getQuotaSummary'],
    ['getQuotaBatchInfo_dkl', '/api/shopcenter/crm/crmQuotaCardService_getQuotaBatchInfo'],
    ['getQuotaBatchDetail_dkl', '/api/shopcenter/crm/crmQuotaCardService_getQuotaBatchDetail'],
    ['addSendCard_dkl', '/api/shopcenter/crm/crmQuotaCardService_issueGiftCards'],
    ['changeQuotaStatus_dkl', '/api/shopcenter/crm/crmQuotaCardService_changeGiftCardStatus'],
    ['crmBatchSellGiftCards', '/api/shopcenter/crm/crmGiftService_batchSellGiftCards'],
    ['getCardTypeShopListByBatchNo', '/api/shopcenter/crm/cardTypeShopService_getCardTypeShopListByBatchNo'],

    // 营销
    ['getSpecialPromotionList', '/api/shopcenter/crm/queryCrmCustomerEvent'],
    ['getMyDetail', '/api/promotion/detail'],
    ['getMyDetail_NEW', '/api/promotion/detail_NEW', { type: 'JSON' }],
    ['addPromotion', '/api/promotion/add'],
    ['addPromotion_NEW', '/api/promotion/add_NEW', { type: 'JSON' }],
    ['updatePromotion', '/api/promotion/update'],
    ['updatePromotion_NEW', '/api/promotion/update_NEW', { type: 'JSON' }],
    ['deletePromotion', '/api/promotion/delete'],
    ['deletePromotion_NEW', '/api/promotion/delete_NEW', { type: 'JSON' }],
    ['getPromotionList', '/api/promotion/list'],
    ['getPromotionList_NEW', '/api/promotion/list_NEW', { type: 'JSON' }],
    ['getPhrase', '/api/promotion/listPhrase'],
    ['getPhrase_NEW', '/api/promotion/listPhrase_NEW', { type: 'JSON' }],
    ['addPhrase', '/api/promotion/addPhrase'],
    ['addPhrase_NEW', '/api/promotion/addPhrase_NEW', { type: 'JSON' }],
    ['deletePhrase', '/api/promotion/deletePhrase'],
    ['deletePhrase_NEW', '/api/promotion/deletePhrase_NEW', { type: 'JSON' }],

    /* SupplyChain ben 加工单 ProcessingSheet */
    ['updateIreportTemplate', '/api/basic/printTemplate/updateTemplate', { type: 'FORM' }],
    ['queryProceseList', '/api/supplychain/process/queryProceseList', { type: 'JSON' }], // 查询加工单列表
    ['queryProceseDetail', '/api/supplychain/process/queryProceseDetail', { type: 'JSON' }], // 查看加工单详情
    ['addProcese', '/api/supplychain/process/addProcese', { type: 'JSON' }], // 新增加工单
    ['auditProcese', '/api/supplychain/process/auditProcese', { type: 'JSON' }], // 审核加工单
    ['updateProcese', '/api/supplychain/process/updateProcese', { type: 'JSON' }], // 编辑加工单
    ['deleteProcese', '/api/supplychain/process/deleteProcese', { type: 'JSON' }], // 删除加工单
    ['queryBillToProcese', '/api/supplychain/process/queryBillToProcese', { type: 'JSON' }], // 订货到加工单查询
    ['billToProcese', '/api/supplychain/process/billToProcese', { type: 'JSON' }], // 订货到加工单生 成加工单
    ['queryStockToProcese', '/api/supplychain/process/queryStockToProcese', { type: 'JSON' }], // 安全库存到加工单查询
    ['safeStockToProcese', '/api/supplychain/process/safeStockToProcese', { type: 'JSON' }], // 安全库存生 成加工单

    /* SupplyChain ben 配方管理 Recipeanagement */
    ['checkFormulaNameOrCode', '/api/supplychain/formula/checkFormulaNameOrCode', { type: 'JSON' }], // new 校验配方的名称和编码是否重复
    ['queryFormulaList', '/api/supplychain/formula/queryFormulaList', { type: 'JSON' }], // 查询配方列表
    ['addFormula', '/api/supplychain/formula/addFormula', { type: 'JSON' }], // 添加配方
    ['queryFormulaNo', '/api/supplychain/formula/queryFormulaNo', { type: 'JSON' }], // 获取配方编码
    ['deleteFormula', '/api/supplychain/formula/deleteFormula', { type: 'JSON' }], // 删除配方
    ['updateFormula', '/api/supplychain/formula/updateFormula', { type: 'JSON' }], // 编辑配方
    ['queryMaterialList', '/api/supplychain/formula/queryMaterialList', { type: 'JSON' }], // 查询加工原料列表
    ['addMaterial', '/api/supplychain/formula/addMaterial', { type: 'JSON' }], // 新增加工原料
    ['queryProduceList', '/api/supplychain/formula/queryProduceList', { type: 'JSON' }], // 查询加工出品列表
    ['deleteMaterial', '/api/supplychain/formula/deleteMaterial', { type: 'JSON' }], // 删除加工原料
    ['addProduce', '/api/supplychain/formula/addProduce', { type: 'JSON' }], // 新增加工出品
    ['deleteProduce', '/api/supplychain/formula/deleteProduce', { type: 'JSON' }], // 删除加工出品
    ['updateMaterial', '/api/supplychain/formula/updateMaterial', { type: 'JSON' }], // 编辑加工原料
    ['updateProduce', '/api/supplychain/formula/updateProduce', { type: 'JSON' }], // 编辑加工出品
    ['queryProceseBoard', '/api/supplychain/procese/queryProceseBoard', { type: 'JSON' }], // 查询加工看板
    ['printProceseBoardByIreport', '/api/supplychain/procese/printProceseBoardByIreport'], // 打印加工看板
    ['proceseBoardGeneratePickingVoucher', '/api/supplychain/procese/proceseBoardGeneratePickingVoucher', { type: 'JSON' }], // 看板生成领料单
    ['addVoucherfromProceseBoard', '/api/supplychain/stocks/voucher/addVoucherfromProceseBoard', { type: 'JSON' }], // 加工领料单保存
    ['queryProceseGoodsList', '/api/supplychain/procese/queryProceseGoodsList', { type: 'JSON' }], // 快速添加加工任务
    ['addProceserAnRegister', '/api/supplychain/procese/addProceserAnRegister', { type: 'JSON' }], // 添加加工单并登记入库
    ['updateProceseBoard', '/api/supplychain/procese/updateProceseBoard', { type: 'JSON' }], // 加工看板编辑
    ['proceseBoardGenerateBill', '/api/supplychain/procese/proceseBoardGenerateBill', { type: 'JSON' }], // 生成订货单
    ['proceseBoardGenerateStorgeVoucher', '/api/supplychain/procese/proceseBoardGenerateStorgeVoucher', { type: 'JSON' }], // 看板登记入库
    ['exportBoardData', '/api/supplychain/procese/exportBoardData'], // 加工看板导出列表
    ['getCostPrice', '/api/supplychain/voucher/getCostPrice', { type: 'JSON' }], // 获取出库价格和配送价格
    ['queryList', '/api/supplychain/voucher/queryList', { type: 'JSON' }], // 查看单据列表
    ['addVoucher', '/api/supplychain/voucher/addVoucher', { type: 'JSON' }], // 新增领料单
    ['queryVoucherByID', '/api/supplychain/voucher/queryVoucherByID', { type: 'JSON' }], // 查看单据详情
    ['updateVoucher', '/api/supplychain/voucher/updateVoucher', { type: 'JSON' }], // 编辑领料单
    ['auditVoucher', '/api/supplychain/voucher/auditVoucher', { type: 'JSON' }], // 审核单据
    ['deleteVoucher', '/api/supplychain/voucher/deleteVoucher', { type: 'JSON' }], // 删除单据
    ['queryCalProceseList', '/api/supplychain/calculate/queryCalProceseList', { type: 'JSON' }], // 获取加工品价格计算的列表
    ['queryMaterialList1', '/api/supplychain/calculate/queryMaterialList', { type: 'JSON' }], // 获取原材料成本列表
    ['queryCalCostList', '/api/supplychain/calculate/queryCalCostList', { type: 'JSON' }], // 获取费用成本列表
    ['updateProcesePrice', '/api/supplychain/calculate/updateProcesePrice', { type: 'JSON' }], // 重新计算加工品价格
    ['queryCurrentStockNum', '/api/supplychain/balance/queryCurrentStockNum', { type: 'JSON' }], // 查询当前库存量
    ['queryHouseStockNum', '/api/supplychain/stocks/balance/queryHouseStockNum', { type: 'JSON' }], // 批量修改当前库存量
    ['querySupplierList', '/api/supplychain/supplier/querySupplierList', { type: 'JSON' }], // 获取供应商接口
    ['queryGoodsPrice', '/api/supplychain/distributionGoods/queryGoodsPrice', { type: 'JSON' }], // 生产入库单 查询加工品的价格
    ['queryGoodsPrice1', '/api/supplychain/basic/priceHis/queryGoodsPrice', { type: 'JSON' }], // 生产入库单 查询加工品的价格
    ['queryParams', '/api/supplychain/params/queryParams', { type: 'JSON' }], // 获取集团的计价方式
    ['queryDuration', '/api/supplychain/accounts/queryDuration', { type: 'JSON' }], // 查询集团当前会计月
    ['querySemifinishedCostcardList', '/api/supplychain/basic/semifinishedCostcard/querySemifinishedCostcardList', { type: 'JSON' }], // 查询半成品成本卡列表
    ['updateSemifinishedCostcardPrice', '/api/supplychain/basic/semifinishedCostcard/updateSemifinishedCostcardPrice', { type: 'JSON' }], // 修改半成品成本卡价格
    ['addSemifinishedCostcard', '/api/supplychain/basic/semifinishedCostcard/addSemifinishedCostcard', { type: 'JSON' }], // 添加半成品成本卡
    ['querySemifinishedCostcardDetail', '/api/supplychain/basic/semifinishedCostcard/querySemifinishedCostcardDetail', { type: 'JSON' }], // 查看半成品成本卡详情
    ['queryDictionary', '/api/supplychain/dictionary/queryDictionary', { type: 'JSON' }], // 查询费用项列表
    ['insertDictionary', '/api/supplychain/dictionary/insertDictionary', { type: 'JSON' }], // 添加费用项
    ['getOrgParams', '/api/supplychain/organization/getOrgParams', { type: 'JSON' }], // 查询组织参数
    ['shopGoodsCategoryUnit', '/api/supplychain/distributionGoods/shopGoodsCategoryUnit', { type: 'JSON' }], // 多规格盘点查目录分类
    ['getShopStalls', '/api/supplychain/organization/getShopStalls', { type: 'JSON' }], // 门店单店获得仓库信息
    ['getGroupOrg', '/api/supplychain/organization/getGroupOrg', { type: 'JSON' }], // 获取所属配送中心信息
    ['queryCostList', '/api/supplychain/cost/queryCostList', { type: 'JSON' }], // 查询加工间费用列表
    ['addCosts', '/api/supplychain/cost/addCosts', { type: 'JSON' }], // 保存加工间费用
    ['queryConsumeList', '/api/supplychain/consume/queryConsumeList', { type: 'JSON' }], // 加工工时列表
    ['updateConsumeList', '/api/supplychain/consume/updateConsumeList', { type: 'JSON' }], // 保存加工工时
    ['addInvetory', '/api/supplychain/invetory/addInvetory', { type: 'JSON' }], // 增加盘点品项
    ['queryInvetoryGoods', '/api/supplychain/invetory/queryInvetoryGoods', { type: 'JSON' }], // 获取盘点品项
    ['deleteInvetory', '/api/supplychain/invetory/deleteInvetory', { type: 'JSON' }],
    ['getAutoBelt', '/api/supplychain/stocks/voucher/subtractVoucherHouse', { type: 'JSON' }], // 调自动扣库按钮借口
    ['getAutoBelts', '/api/supplychain/stocks/voucher/isShowSubtractButton', { type: 'JSON' }], // 调自动扣库按钮借口
    ['queryVoucherDetail', '/api/supplychain/stocks/voucher/queryVoucherDetail', { type: 'JSON' }], // 单据查看专用接口

    ['queryDetailByGoodsIDs', ' /api/supplychain/invetory/queryDetailByGoodsIDs', { type: 'JSON' }], // 查询临时品项
    // 配送规则
    ['queryShopRouterInfo', '/api/supplychain/basic/distributionRouter/queryShopRouterInfo', { type: 'JSON' }], // 配送规则按门店查询
    ['updateShopGoodsRouter', '/api/supplychain/basic/distributionRouter/updateShopGoodsRouter', { type: 'JSON' }], // 配送规则按门店查询编辑
    ['replaceSupplier', '/api/supplychain/basic/distributionRouter/replaceSupplier', { type: 'JSON' }], // 配送规则设置替换供货商
    ['replaceDefaultSupplier', '/api/supplychain/basic/distributionRouter/replaceDefaultSupplier', { type: 'JSON' }],
    ['queryGoodsAndCategory', '/api/supplychain/basic/goodsExtend/queryGoodsAndCategory', { type: 'JSON' }], // 获取集团所有品项（缓存）
    ['queryDistributionGoodsAndCategoryList', '/api/supplychain/basic/distributionGoods/queryDistributionGoodsAndCategoryList', { type: 'JSON' }], // 获取门店所有品项（缓存）
    // 供应商协议价
    ['getRateList', '/api/supplychain/basic/rate/getRateList', { type: 'JSON' }], // 获取税率列表
    ['queryPriceListByShop', '/api/supplychain/basic/goodPrice/queryPriceListByShop', { type: 'JSON' }], // 根据门店查询供应商报价
    ['getShopBrand', '/api/shopcenter/shop/shopBrandInfoQuery'],
    ['addShopBrand', '/api/shopcenter/shop/shopBrandInfoInsert'],
    ['updateShopBrand', '/api/shopcenter/shop/shopBrandInfoUpdate'],
    ['deleteShopBrand', '/api/shopcenter/shop/shopBrandInfoDelete'],
    ['imageUpload', '/api/common/imageUpload'], // 图片上传
    ['treeEmpDictory', '/api/hr/dic/datatypes'], // 人事 数据字典
    ['showEmpDictory', '/api/hr/dic/query'], // 人事 数据字典查询列表
    ['addEmpDictory', '/api/hr/dic/add'], // 人事 数据字典添加
    ['editEmpDictory', '/api/hr/dic/edit'], // 人事 数据字典编辑
    ['delEmpDictory', '/api/hr/dic/del'], // 人事 数据字典删除
    ['workquery', '/api/hr/emp/work/query'], // 人事 在职员工查询
    ['referralsQuery', '/api/hr/emp/referrals/query', { type: 'JSON' }], // 人事 员工推荐人查询
    ['queryEmploee', '/api/hr/emp/query'], // 人事 员工查询
    ['statsEmploee', '/api/hr/emp/stats'], // 人事 员工数量统计
    ['addEmploee', '/api/hr/emp/add'], // 人事 员工添加
    ['editEmploee', '/api/hr/emp/edit'], // 人事 员工编辑
    ['edit', '/api/hr/emp/edit/detail'], // 人事 员工编辑详情
    ['detailEmploee', '/api/hr/emp/detail'], // 人事 员工详情查看
    ['leaveList', '/api/hr/emp/leave/query'], // 人事 员工离职列表
    ['leaveEmploee', '/api/hr/emp/leave', { type: 'FORM' }], // 人事 员工离职
    ['resumeList', '/api/hr/emp/resume/query'], // 人事 员工复职列表
    ['resumeEmploee', '/api/hr/emp/resume'], // 人事 员工复职
    ['changeJobList', '/api/hr/emp/changejob/query'], // 人事 员工调岗列表
    ['changeJobEmploee', '/api/hr/emp/changeJob'], // 人事 员工调岗
    ['changeOrganList', '/api/hr/emp/changeorg/query'], // 人事 员工调动列表
    ['changeOrganEmploee', '/api/hr/emp/changeOrg'], // 人事 员工调动
    ['hrRevoke', '/api/hr/emp/change/revoke', { type: 'JSON' }], // 人事 员工撤销
    ['getWorkSchedual', '/api/hr/work/query'], // 人事 班次设置 班次列表查询
    ['addWorkSchedual', '/api/hr/work/add'], // 人事 班次设置 班次添加
    ['actionStatus', '/api/hr/work/status'], // 人事 班次设置 是否开启该班次(状态)
    ['delWorkType', '/api/hr/work/del'], // 人事 班次设置 删除班次
    ['editWorkType', '/api/hr/work/edit'], // 人事 班次设置 编辑班次
    ['detailWorkType', '/api/hr/work/detail'], // 人事 班次设置 查询班次
    ['getWorkArrange', '/api/hr/work/order/query'], // 人事 排班管理 查询排班列表
    ['saveWorkArrange', '/api/hr/work/order/edit'], // 人事 排班管理 保存(编辑)班次
    ['getAttendanceList', '/api/hr/check/audit/query', { type: 'JSON' }], // 人事 考勤审核 考勤列表
    ['checkAudit', '/api/hr/check/audit', { type: 'JSON' }], // 人事 考勤审核 考勤审核
    ['HR_Account', '/api/hr/check/audit/lock', { type: 'JSON' }], // 人事 考勤审核 封账
    ['HR_Aproval', '/api/hr/check/audit/report', { type: 'JSON' }], // 人事 考勤审核 报审
    ['HR_Statistics', '/api/hr/check/audit/stats', { type: 'JSON' }], // 人事 考勤审核 统计
    ['HR_Reject', '/api/hr/check/audit/reject', { type: 'JSON' }], // 人事 考勤审核 驳回
    ['cancelAudit', '/api/hr/check/audit/resume', { type: 'JSON' }], // 人事 考勤审核 考勤撤销
    ['getAttendanceTotalList', '/api/hr/check/stats/query'], // 人事 考勤汇总 考勤汇总列表
    ['hrRule', '/api/hr/check/rule'], // 人事 考勤规定查看
    ['hrRuleEdit', '/api/hr/check/rule/edit'], // 人事 考勤规定设置
    ['queryAMlist', '/api/hr/device/query', { type: 'JSON' }], // 人事 考勤机分发 考勤机列表
    ['addAM', '/api/hr/device/add', { type: 'JSON' }], // 人事 考勤机分发 添加考勤机
    ['editAM', '/api/hr/device/edit', { type: 'JSON' }], // 人事 考勤机分发 编辑考勤机
    ['bindAMOrg', '/api/hr/device/bind', { type: 'JSON' }], // 人事 考勤机分发 绑定部门
    ['unbindAMOrg', ' /api/hr/device/unbind', { type: 'JSON' }], // 人事 考勤机分发 解绑部门
    ['delAM', ' /api/hr/device/del', { type: 'JSON' }], // 人事 考勤机分发 删除
    ['queryAMbrands', '/api/hr/device/brands', { type: 'JSON' }], // 人事 考勤机分发 考勤机品牌列表
    ['AMbindEm', '/api/hr/device/emp/bind', { type: 'JSON' }], // 人事 考勤机分发 考勤机绑定员工
    ['AMunbindEm', '/api/hr/device/emp/unbind', { type: 'JSON' }], // 人事 考勤机分发 考勤机解绑员工
    ['AMqueryEM', '/api/hr/device/emp/query', { type: 'JSON' }], // 人事 考勤机分发 考勤机员工查询
    ['queryOrgBindAM', '/api/hr/device/org/query', { type: 'JSON' }], // 人事 考勤机分发 部门关联考勤机查询
    ['OrgBindAM', '/api/hr/device/org/bind', { type: 'JSON' }], // 人事 考勤机分发 部门绑定考勤机
    ['queryHoliday', '/api/hr/holiday/query', { type: 'JSON' }], // 人事 假日管理 假期查询
    ['queryHolidayType', '/api/hr/holiday/item/query', { type: 'JSON' }], // 人事 假日管理 假期类型查询
    ['queryRemainHoliday', '/api/hr/holiday/remain', { type: 'JSON' }], // 人事 假日管理 假期剩余查询
    ['queryRemainHolidayEmp', '/api/hr/holiday/remain/emp', { type: 'JSON' }], // 人事 假日管理 人员剩余假期查询
    ['holidayReq', '/api/hr/holiday/request', { type: 'JSON' }], // 人事 假日管理 假期申请
    ['revokeHoliday', '/api/hr/holiday/revoke', { type: 'JSON' }], // 人事 假日管理 撤销假日
    ['queryGoodsListData', '/api/hr/goods/query', { type: 'JSON' }], // 人事 物品领用 查询物品列表
    ['addGoods', '/api/hr/goods/add', { type: 'JSON' }], // 人事 物品领用 添加物品管理
    ['goodsTransfer', '/api/hr/goods/transfer', { type: 'JSON' }], // 人事 物品领用 物品移交
    ['goodsReturn', '/api/hr/goods/return', { type: 'JSON' }], // 人事 物品领用 物品归还
    ['salaryEffect', '/api/hr/salary/effect'], // 人事 绩效工资列表
    ['salaryEdit', ' /api/hr/salary/edit'], // 人事 绩效工资编辑
    ['salaryMonth', ' /api/hr/salary/month'], // 人事 薪资月报
    ['salaryChangeinfo', '/api/hr/salary/changeinfo'], // 人事 薪资调整列表
    ['salaryChange', '/api/hr/salary/change'], // 人事 薪资调整
    ['salaryReport', '/api/hr/salary/report'], // 人事 薪资列表
    ['salaryStats', '/api/hr/salary/month/stats'], // 人事 月报工资统计
    ['salaryChangeReport', '/api/hr/salary/change/report'], // 人事 调薪列表
    ['dicdataEmploee', '/api/hr/dicdata'], // 人事 考勤审核 读取字典数据
    ['querydicData', '/api/hr/dicdata'], // 人事 读取字典 工作类型 (小时工 全职工)
    ['idcardMessage', '/api/hr/idcard/info'], // 人事 身份信息
    ['idcardValidate', '/api/hr/idcard/validate'], // 人事 身份验证
    ['getWorkType', '/api/hr/valid/works'], // 人事 排班管理 获取有效班次
    ['getPunchRecordDetailsData', '/api/hr/checktime/query'], // 人事 考勤汇总 详细打卡纪录
    ['attendanceExport', '/api/hr/export/checktime', { type: 'FORM' }], // 人事 考勤导出
    ['exportEmp', '/api/hr/export/employee', { type: 'FORM' }], // 人事 员工导出
    ['importEmp', '/api/hr/import/employee', { type: 'FORM' }],
    ['importChecktime', '/api/hr/import/checktime', { type: 'FORM' }],
    ['hrBlackRevoke', '/api/hr/black/revoke', { type: 'JSON' }], // 人事 黑名单撤销
    ['empBlackList', '/api/hr/black/query', { type: 'JSON' }], // 人事 黑名单列表
    ['baseSalary', '/api/hr/base/salary'], // 人事 基本工资


    // 人事 考勤合计
    ['queryMonthStats', '/api/hr/check/stats/month', { type: 'JSON' }], //  考勤合计 按月汇总
    ['queryDayStats', '/api/hr/check/stats/day', { type: 'JSON' }], //  考勤合计 按天汇总
    ['queryDetailStats', '/api/hr/check/stats/detail', { type: 'JSON' }], //  考勤合计 打卡记录

    // ["pactFileDel", " /api/hr/pact/file/del", { type: 'JSON' }],                //人事 合同管理 附件删除
    ['pactQuery', '/api/hr/pact/query', { type: 'JSON' }], // 人事 合同管理 查询
    ['pactDel', '/api/hr/pact/del', { type: 'JSON' }], // 人事 合同管理 删除
    ['pactDetail', '/api/hr/pact/detail', { type: 'JSON' }], // 人事 合同管理 查看
    ['pactEditDetail', '/api/hr/pact/edit/detail', { type: 'JSON' }], // 人事 合同管理 编辑详情
    ['pactAdd', ' /api/hr/pact/add', { type: 'FORM' }], // 人事 合同管理 添加
    ['pactEdit', '/api/hr/pact/edit', { type: 'FORM' }], // 人事 合同管理 编辑
    ['pactDownLoad', '/api/hr/pact/download', { type: 'JSON' }], // 人事 合同管理 合同附件
    ['cardQuery', '/api/hr/card/query', { type: 'JSON' }], // 人事 证照管理 查询
    ['cardAdd', '/api/hr/card/add', { type: 'FORM' }], // 人事 证照管理 添加
    ['cardEditDetail', '/api/hr/card/edit/detail', { type: 'JSON' }], // 人事 证照管理 编辑详情
    ['cardEdit', '/api/hr/card/edit', { type: 'FORM' }], // 人事 证照管理 编辑
    ['cardDel', '/api/hr/card/del', { type: 'JSON' }], // 人事 证照管理 删除
    ['cardDownLoad', '/api/hr/card/download', { type: 'JSON' }], // 人事 证照管理 证照附件
    ['holidatyRuleQuery', '/api/hr/holiday/rule/query', { type: 'JSON' }], // 人事 年假规定 查询
    ['holidatyRuleEdit', '/api/hr/holiday/rule/edit', { type: 'JSON' }], // 人事 年假规定 编辑
    ['systemLog', '/api/log/queryOperatorLog'],

    // 宿舍管理
    ['dormEmpsave', '/api/hr/dormbed/empsave', { type: 'JSON' }], // 人事 人员入住保存
    ['dormEmpQuery', '/api/hr/dormbed/emp/query', { type: 'JSON' }], // 人事 人员入住查询
    ['dormDel', '/api/hr/dorm/del', { type: 'JSON' }], // 人事 宿舍删除
    ['dormAdd', '/api/hr/dorm/add', { type: 'JSON' }], // 人事 宿舍新增
    ['dormQuery', '/api/hr/dorm/query', { type: 'JSON' }], // 人事 宿舍查询
    ['dormbedQuery', '/api/hr/dormbed/query', { type: 'JSON' }], // 人事 床位查询
    ['dormEdit', '/api/hr/dorm/edit', { type: 'JSON' }], // 人事 宿舍编辑
    ['dormCheckout', '/api/hr/dormbed/checkout', { type: 'JSON' }], // 人事 宿舍退房
    ['dormbedDel', '/api/hr/dormbed/del', { type: 'JSON' }], // 人事 床位删除
    ['dormbedAdd', '/api/hr/dormbed/add', { type: 'JSON' }], // 人事 床位新增
    // 岗位工资管理
    ['jobQuery', '/api/hr/job/query', { type: 'JSON' }], // 人事 岗位薪资查询
    ['jobSave', '/api/hr/job/save', { type: 'JSON' }], // 人事 岗位薪资编辑
    ['jobDel', '/api/hr/job/del', { type: 'JSON' }], // 人事 岗位薪资删除
    ['rankQuery', '/api/hr/rank/query', { type: 'JSON' }], // 人事 职级薪资查询
    ['rankSave', '/api/hr/rank/save', { type: 'JSON' }], // 人事 职级薪资编辑
    ['rankDel', '/api/hr/rank/del', { type: 'JSON' }], // 人事 职级薪资删除
    ['ageQuery', '/api/hr/age/query', { type: 'JSON' }], // 人事 工龄薪资查询
    ['ageSave', '/api/hr/age/save', { type: 'JSON' }], // 人事 工龄薪资编辑
    ['ageDel', '/api/hr/age/del', { type: 'JSON' }], // 人事 工龄薪资删除
    // 账套管理
    ['accountOrgBind', '/api/hr/account/org/bind', { type: 'JSON' }], // 人事 账套分配
    ['accountOrgUnBind', '/api/hr/account/org/unbind', { type: 'JSON' }], // 人事 账套部门解绑
    ['accountDel', '/api/hr/account/del', { type: 'JSON' }], // 人事 账套删除
    ['accountStatus', '/api/hr/account/status', { type: 'JSON' }], // 人事 帐套启用停用
    ['accountSort', '/api/hr/account/item/sort', { type: 'JSON' }], // 人事 帐套条目排序
    ['accountQuery', '/api/hr/account/query', { type: 'JSON' }], // 人事 账套查询
    ['accountSave', '/api/hr/account/save', { type: 'JSON' }], // 人事 账套添加
    ['accountDetail', '/api/hr/account/detail', { type: 'JSON' }], // 人事 账套详情
    ['accountOrgQuery', '/api/hr/account/org/query', { type: 'JSON' }], // 人事 账套关联部门查询
    // 薪资计算
    ['salaryCal', '/api/hr/salary/cal', { type: 'JSON' }], // 人事 薪资核算
    ['salaryCalDetail', '/api/hr/salary/cal/detail', { type: 'JSON' }], // 人事 薪资核算查看
    ['salaryCalQuery', '/api/hr/salary/cal/query', { type: 'JSON' }], // 人事 薪资计算列表
    ['salaryCalAudit', '/api/hr/salary/cal/audit', { type: 'JSON' }], // 人事 薪资计算审核
    ['salaryCalReport', '/api/hr/salary/cal/report', { type: 'JSON' }], // 人事 薪资计算报审
    ['salaryOrgQuery', '/api/hr/salary/org/query', { type: 'JSON' }], // 人事 薪资部门列表

    // 人事报表
    ['empChange', '/api/hr/report/emp/change', { type: 'JSON' }], // 人事报表
    ['empAge', '/api/hr/report/emp/age', { type: 'JSON' }], // 人事报表
    ['empWorkage', '/api/hr/report/emp/workage', { type: 'JSON' }], // 人事报表
    // 人事档案
    ['archiveQuery', '/api/hr/emp/archive/query', { type: 'JSON' }], // 档案查询
    ['archiveDetail', '/api/hr/emp/archive/detail', { type: 'JSON' }], // 档案查看

    // 系统清空数据
    ['queryClearDataLatestPlan', '/api/shopcenter/shop/queryGroupClearDataLatestPlan'],
    ['sendClearDataRequest', '/api/shopcenter/shop/sendClearDataRequest'],
    ['executeClearDataRequest', '/api/shopcenter/shop/executeClearDataRequest'],
    ['finishClearDataRequest', '/api/shopcenter/shop/finishClearDataRequest'],

    // 提成设置
    ['queryRoyalty', '/api/business/royalty/query'], // 提成设置查询
    ['saveRoyalty', '/api/business/royalty/save'], // 提成设置添加、编辑
    ['delRoyalty', '/api/business/royalty/del'], // 提成设置删除
    // 提成查询
    ['queryMonthRoyalty', '/api/business/royalty/month/query'], // 提成金额查询
    ['queryDayRoyalty', '/api/business/royalty/day/query'], // 提成金额详情

    // 值班场景管理
    ['getSceneScheme', '/api/duty/scheme/getByShop'], // 根据门店获取方案
    ['editSceneScheme', '/api/duty/scheme/save'], // 添加修改值班方案
    ['copySceneScheme', '/api/duty/scheme/copy'], // 复制方案
    ['deleteSceneScheme', '/api/duty/scheme/delete'], // 删除值班方案
    ['updateIsActive', '/api/duty/scheme/updateIsActive'],
    ['deleteChildScene', '/api/duty/scene/delete'], // 删除场景
    ['updateChildScene', '/api/duty/scene/update'], // 更新场景
    ['getChildScene', '/api/duty/scene/getByScheme'], // 根据方案获取场景
    ['saveChildScene', '/api/duty/scene/save'], // 添加场景
    ['editSceneTask', '/api/duty/sceneTask/update'], // 修改待办事项
    ['deleteSceneTask', '/api/duty/sceneTask/delete'], // 删除待办事项
    ['saveSceneTask', '/api/duty/sceneTask/add'], // 新增待办事项
    ['querySceneTask', '/api/duty/sceneTask/query'], // 查询待办事项
    ['deleteSceneTools', '/api/duty/sceneTools/delete'], // 删除功能(工具)
    ['saveSceneTools', '/api/duty/sceneTools/save'], // 新增功能（工具）
    ['getSceneTools', '/api/duty/sceneTools/getAll'], // 获取所有功能(工具)
    ['updateSceneTool', '/api/duty/sceneTools/update'],

    ['getDict', '/api/duty/seventDict/getDict'], // 查询字典
    ['updateDict', '/api/duty/seventDict/update'], // 修改字典
    ['addDict', '/api/duty/seventDict/add'], // 添加字典
    ['deleteDict', '/api/duty/seventDict/delete'], // 删除字典
    ['getHolidayList', '/api/duty/holiday/query'],
    ['updateHolidayList', '/api/duty/holiday/update'],
    ['getBusinessIdxList', '/api/shopcenter/business/monthIndex/getByGroup'],
    ['updateMonthIndex', '/api/shopcenter/business/monthIndex/save'],
    ['getDayIdxList', '/api/shopcenter/business/dayIndex/getByMonth'],
    ['addDayIdx', '/api/shopcenter/business/dayIndex/save'],
    // 系统参数管理
    ['getDynamicParams', '/api/shopcenter/monitor/queryParams'],
    ['selectSysParams', '/api/shopcenter/org/selectSysParams'],
    ['updateSysParams', '/api/shopcenter/org/updateSysParams'],
    // 系统账号
    ['sendDynamicCode', '/api/user/sendDynamicCode'],
    ['bindMobile', '/api/user/bindmobile'],
    ['unbindMobile', '/api/user/unbindMobile'],
    // 稽核系统
    ['getAuditTemp', '/api/audit/auditTemp/get'],
    ['addAuditTemp', '/api/audit/auditTemp/add'],
    ['updateAuditTemp', '/api/audit/auditTemp/update'],
    ['updateAuditTempAction', '/api/audit/auditTemp/updateAction'],
    ['deleteAuditTemp', '/api/audit/auditTemp/delete'],
    ['getOwnWareHouseAccount', '/audit/auditTemp/getOwnWareHouseAccount'],
    // 补充接口
    ['fastAddGoodPrice', '/api/supplychain/basic/goodPrice/fastAddGoodPrice', { type: 'JSON' }],
    ['getShopAndHouse', '/api/supplychain/basic/organizationGetShopAndHouse', { type: 'JSON' }], // 查询仓库
    ['queryRejectBillList', '/api/supplychain/rejectbill/queryRejectBillList', { type: 'JSON' }],
    ['addReject', '/api/supplychain/rejectbill/addBill', { type: 'JSON' }],
    ['auditReject', '/api/supplychain/rejectbill/auditReject', { type: 'JSON' }],
    ['deleteReject', '/api/supplychain/rejectbill/deleteRejectBills', { type: 'JSON' }],
    ['queryRejectBillDetail', '/api/supplychain/bill/queryBillDetail', { type: 'JSON' }],
    ['updateRejectBill', '/api/supplychain/rejectbill/updateBill', { type: 'JSON' }],
    ['selectTongReverse', '/api/supplychain/stocks/voucherDetail/selectTongReverse', { type: 'JSON' }],

    ['queryGroupSupplierList', '/api/supplychain/basic/supplierCategory/queryGroupSupplierList', { type: 'JSON' }],
    ['queryBillDetail', '/api/supplychain/bill/queryBillDetail', { type: 'JSON' }], // 查询报价单细节
    ['queryOfferPriceList', '/api/supplychain/offerPrice/queryOfferPriceList', { type: 'JSON' }], // 查询报价单据
    ['deleteOfferPrice', '/api/supplychain/offerPrice/deleteOfferPrice', { type: 'JSON' }], // 删除报价单
    ['addOfferPrice', '/api/supplychain/offerPrice/addOfferPrice', { type: 'JSON' }], // 新加报价单
    ['updateOfferPrice', '/api/supplychain/offerPrice/updateOfferPrice', { type: 'JSON' }], // 编辑报价单
    ['updateDistributionPrice', '/api/supplychain/distributionPrice/updateDistributionPrice', { type: 'JSON' }], // 修改配送报价单
    ['deleteDistributionPrice', '/api/supplychain/distributionPrice/deleteDistributionPrice', { type: 'JSON' }], // 删除配送报价单
    ['auditDistributionPrice', '/api/supplychain/distributionPrice/auditDistributionPrice', { type: 'JSON' }], // 审核配送报价单
    ['addDistributionPrice', '/api/supplychain/distributionPrice/addDistributionPrice', { type: 'JSON' }], // 新增配送报价单订单
    ['queryDistributionPriceList', '/api/supplychain/distributionPrice/queryDistributionPriceList', { type: 'JSON' }], // 查询配送报价单
    ['addDistributionPriceUpLoad', '/api/supplychain/goodsPriceExcel/addDistributionPriceUpLoad', { type: 'FORM' }], // 通过excel导入报价单
    ['downLoadDistributionPriceTemplate', '/api/supplychain/goodsPriceExcel/downLoadDistributionPriceTemplate', { type: 'JSON' }], // 下载配送报价单模板
    ['addGoodPriceUpLoad', '/api/supplychain/goodsPriceExcel/addGoodPriceUpLoad', { type: 'FORM' }], // 供应商协议价多例外导入
    // 获取税率列表
    ['auditOfferPrice', '/api/supplychain/offerPrice/auditOfferPrice', { type: 'JSON' }], // 审核或提交报价单
    ['addBillGoodPriceUpLoad', '/api/supplychain/goodsPriceExcel/addBillGoodPriceUpLoad', { type: 'FORM' }], // 导入报价单
    ['bizGetDictList', '/api/shopcenter/business/dict/getDict'], // 坐支管理得到所有开启的字典
    ['bizGetDictListByType', '/api/shopcenter/business/dict/getDictByType'], // 坐支管理得到所有字典
    ['bizUpdateDictAction', '/api/shopcenter/business/dict/updateDictAction'], // 坐支管理更新字典状态
    ['bizUpdateDict', '/api/shopcenter/business/dict/updateDict'], // 坐支管理更新字典
    ['bizDeleteDict', '/api/shopcenter/business/dict/deleteDict'], // 坐支管理删除字典
    ['bizAddDict', '/api/shopcenter/business/dict/addDict'], // 坐支管理添加字典
    ['bizAddPayOut', '/api/shopcenter/business/payOut/addPayOut'], // 明细录入
    // 首页门店订货小工具
    ['queryRemindBill', '/api/supplychain/bill/queryRemindBill', { type: 'JSON' }],
    ['bizGetPayOutByDay', '/api/shopcenter/business/payOut/getPayOutByDay'], // 明细查询
    ['bizGetPayOutByYear', '/api/shopcenter/business/payOut/getPayOutByYear'], // 根据年查询报表
    ['bizGetPayOutByMonth', '/api/shopcenter/business/payOut/getPayOutByMonth'], // 根据月查询报表
    // 快捷首页
    ['queryPurchaseBillList', '/api/supplychain/purchaseBill/queryPurchaseBillList', { type: 'JSON' }],
    ['queryShopBill', '/api/supplychain/shop/check/queryShopBill', { type: 'JSON' }],
    ['checkorgInfo', '/api/supplychain/basic/check/checkorgInfo', { type: 'JSON' }], // 是否进入新手入门
    ['checkShopOrgInfo', '/api/supplychain/basic/check/checkShopOrgInfo', { type: 'JSON' }], // 弱连锁是否进入新手入门
    ['rightsList', '/api/deprecated_supplychain/user/rightsList', { type: 'JSON' }], // 是否进入新手入门
    // 水电气
    ['addUtilitiesMeter', '/api/shopcenter/business/utilities/addUtilitiesMeter'], // 水电气设备管理,新增设备
    ['getUtilitiesMeterByType', '/api/shopcenter/business/utilities/getUtilitiesMeterByType'], // 水电气设备管理,查询设备
    ['getUtilitiesMeter', '/api/shopcenter/business/utilities/getUtilitiesMeter'], // 水电气设备管理,查询设备(只能查设备名称，没有读数)
    ['deleteUtilitiesMeter', '/api/shopcenter/business/utilities/deleteUtilitiesMeter'], // 水电气设备管理,删除设备
    ['updateUtilitiesMeter', '/api/shopcenter/business/utilities/updateUtilitiesMeter'], // 水电气设备管理,编辑设备
    ['addUtilitiesPayOut', '/api/shopcenter/business/utilities/addUtilitiesPayOut'], // 水电气数据录入，新增数据，录入水电气明细
    ['getUtilitiesPayOutByDay', '/api/shopcenter/business/utilities/getUtilitiesPayOutByDay'], // 查询水电气明细
    ['getUtilitiesPayOutByYear', '/api/shopcenter/business/utilities/getUtilitiesPayOutByYear'], // 查询月报表
    ['getUtilitiesPayOutByWeek', '/api/shopcenter/business/utilities/getUtilitiesPayOutByWeek'], // 查询周报表
    ['getUtilitiesContrast', '/api/shopcenter/business/utilities/getUtilitiesContrast'], // 查询周报表

    // 加盟商合同管理
    ['franchiseeInfoList', '/api/shopcenter/franchisee/info/list'], // 查询加盟商分类列表
    ['queryFContract', '/api/shopcenter/franchisee/queryFContract'], // 查询加盟合同列表
    ['addFContract', '/api/shopcenter/franchisee/addFContract'], // 新增加盟合同
    ['updateFContract', '/api/shopcenter/franchisee/updateFContract'], // 修改加盟合同列表
    ['queryFsmSettleUnit', '/api/shopcenter/franchisee/queryFsmSettleUnit'], // 查询结算主体

    // 加盟项管理
    ['franchiseeItemAdd', '/api/shopcenter/franchisee/item/add'], // 添加收费项
    ['franchiseeItemQuery', '/api/shopcenter/franchisee/item/query'], // 查询收费项
    ['franchiseeItemUpdate', '/api/shopcenter/franchisee/item/update'], // 编辑收费项
    ['franchiseeItemDelete', '/api/shopcenter/franchisee/item/delete'], // 删除收费项
    ['franchiseeItemUpdateStatus', '/api/shopcenter/franchisee/item/updateStatus'], // 修改收费项状态
    ['queryAccount', '/api/shopcenter/franchisee/account/query'], // 查询账单
    ['queryExpireAccount', '/api/shopcenter/franchisee/account/queryExpire'], // 查询到期账单


    // 店铺信息
    ['queryAreas', '/api/shop/queryArea'],
    ['queryCuisine', '/api/shop/queryCuisine'],
    ['shopTagQuery', '/api/shop/shopTagQuery'],
    ['addTags', '/api/shop/shopTagAdd'],
    ['shopCreate', '/api/shopapi/addShop'],
    ['queryShopInfo', '/api/shopapi/queryShop'],
    ['shopTagDelete', '/api/shop/shopTagDelete'],
    ['shopUpdate', '/api/shopapi/update'],
    ['shopSwitch', '/api/shop/status'],
    ['updateSettleUnit', '/api/shop/updateSettleUnitByshopID'],
    ['shopCreateAuth', '/api/shop/groupAuthCheck'],
    ['getSchemaData', '/api/shopapi/schema'],
    ['getShopCities', '/api/shop/queryCity'],
    ['addCommissionAgent', '/api/shopapi/addProxyShop'],
    ['queryCommissionAgent', '/api/shopapi/queryProxyShopList'],
    ['updateCommissionAgent', '/api/shopapi/updateProxyShop'],
    ['deleteCommissionAgent', '/api/shopapi/deleteProxyShop'],
    ['setDynamicValues', '/api/shopapi/updateGeneralParameters'],

    // WMS 公共接口
    ['wms_getHouse', '/api/supplychain/orgnazation/getHouse', { type: 'JSON' }], // 根据集团查询仓库

    // WMS 容器管理 ben 2017-08-22
    ['wms_addContainerTableData', '/api/supplychain/container/insert', { type: 'JSON' }], // 新增容器
    ['wms_getContainerTableData', '/api/supplychain/container/selectList', { type: 'JSON' }], // 查看容器
    ['wms_delContainerTableData', '/api/supplychain/container/delete', { type: 'JSON' }], // 删除容器
    ['wms_updateContainerStatus', '/api/supplychain/container/update', { type: 'JSON' }], // 修改状态
    ['wms_batchUpdateContainerStatus', '/api/supplychain/container/batchUpdate', { type: 'JSON' }], // 批量修改状态
    ['wms_containerTypes', '/api/supplychain/dictionary/selectByType', { type: 'JSON' }], // 容器类型列表
    ['wms_downContainerTemplate', '/api/supplychain/container/exportFile'], // 下载容器模板
    ['wms_importContainer', '/api/supplychain/container/importFile', { type: 'FORM' }], // 导入容器接口

    // WMS 货位管理 ben 2017-08-25
    ['wms_getStorageData', '/api/supplychain/location/selectList', { type: 'JSON' }], // 查看货位列表
    ['wms_getAreaList', '/api/supplychain/area/selectList', { type: 'JSON' }], // 查询区域列表
    ['wms_getAreaTypeList', '/api/supplychain/dictionary/selectByType', { type: 'JSON' }], // 查询区域列表
    ['wms_getAreaTypes', '/api/supplychain/area/selectTypeById', { type: 'JSON' }], // 根据区域查找区域类型
    ['wms_getShelfType', '/api/supplychain/dictionary/selectByType', { type: 'JSON' }], // 查询货架类型列表
    ['wms_addStorage', '/api/supplychain/location/insert', { type: 'JSON' }], // 新增货位
    ['wms_addArea', '/api/supplychain/area/insert', { type: 'JSON' }], // 新增区域
    ['wms_delStorage', '/api/supplychain/location/delete', { type: 'JSON' }], // 删除货位
    ['wms_updateStorageStatus', '/api/supplychain/location/update', { type: 'JSON' }], // 修改货位状态
    ['wms_batchStorageStatus', '/api/supplychain/location/batchUpdate', { type: 'JSON' }], // 批量修改货位状态
    ['wms_downStorageTemplate', '/api/supplychain/location/exportFile'], // 下载货位模板
    ['wms_importStorage', '/api/supplychain/location/importFile', { type: 'FORM' }], // 导入货位接口

    // WMS 集货位管理 xinruo 2017-08-31
    ['wms_getCollectionTableData', '/api/supplychain/shippingArea/selectList', { type: 'JSON' }], // 查看集货位
    ['wms_delCollectionTableData', '/api/supplychain/shippingArea/delete', { type: 'JSON' }], // 删除集货位
    ['wms_addCollectionTableData', '/api/supplychain/shippingArea/insert', { type: 'JSON' }], // 新增集货位
    ['wms_updateCollectionTableData', '/api/supplychain/shippingArea/update', { type: 'JSON' }], // 修改集货位状态
    ['wms_batchUpdateCollectionData', '/api/supplychain/shippingArea/batchUpdate', { type: 'JSON' }], // 批量修改集货位状态
    ['wms_importCollectionData', '/api/supplychain/shippingArea/importFile', { type: 'FORM' }], // 导入集货位

    // WMS 入库管理 收货单
    ['wms_receiptQuery', '/api/supplychain/receiptOrderMaster/listData', { type: 'JSON' }], // 收货单查询
    ['wms_receivingDetailsQuery', '/api/supplychain/receiptOrderDetail/listData', { type: 'JSON' }], // 收货单明细查询
    ['wms_receiptDetailsQuery', '/api/supplychain/receiptContainer/listData', { type: 'JSON' }], // 收货单详情查询
    ['wms_receiptComplete', '/api/supplychain/receiptOrderMaster/close', { type: 'JSON' }], // 收货单完成操作

    // WMS 入库管理 上架记录
    ['wms_recordQuery', '/api/supplychain/shelfRecord/listData', { type: 'JSON' }], // 上架记录查询

    // WMS 库存管理
    ['wms_goodsAllocationStockQuery', '/api/supplychain/locationInventory/listData', { type: 'JSON' }], // 货位库存查询
    ['wms_goodsStockQuery', '/api/supplychain/storeInventory/listData', { type: 'JSON' }], // 商品库存查询
    ['wms_StockDealQuery', '/api/supplychain/storeTransactionLog/listData', { type: 'JSON' }], // 库存交易查询

    // WMS 2017-09-22 ben 策略管理
    ['wms_waveStrategyQuery', '/api/supplychain/waveStrategy/selectOne', { type: 'JSON' }], // 查看波次策略
    ['wms_waveStrategySave', '/api/supplychain/waveStrategy/save', { type: 'JSON' }], // 保存波次策略
    ['wms_waveStrategyData', '/api/supplychain/dictionary/waveStrategy', { type: 'JSON' }], // 波次策略数据

    // WMS 2017-09-26 xin 出库管理
    ['wms_waveQuery', '/api/supplychain/wave/listData', { type: 'JSON' }], // 波次查询
    ['wms_waveQueryView', '/api/supplychain/waveLog/selectByWaveId', { type: 'JSON' }], // 波次查询页面的波次日志查看
    ['wms_waveCreate', '/api/supplychain/wave/createWave', { type: 'JSON' }], // 波次创建
    ['wms_waveCreateListData', '/api/supplychain/orderMaster/listData', { type: 'JSON' }], // 波次创建页面查询订单
    ['wms_waveCreateQueryPurchaseOrder', '/api/supplychain/orderDetail/selectByMasterId', { type: 'JSON' }], // 波次创建页面查询订货单
    ['wms_pikingTaskQuery', '/api/supplychain/pickingTask/listData', { type: 'JSON' }], // 拣货任务查询
    ['wms_pikingTaskView', '/api/supplychain/pickingTaskDetail/selectByTaskId', { type: 'JSON' }], // 拣货页面查看拣货明细
    ['wms_pikingTaskStatus', '/api/supplychain/dictionary/selectByType', { type: 'JSON' }], // 拣货任务查询状态列表

    // WMS 2017-10-12 ben 出库管理
    ['wms_sortingRecordQuery', '/api/supplychain/sortingRecord/listData', { type: 'JSON' }], // 分拣记录查询
    ['wms_orderManagementQuery', '/api/supplychain/orderMaster/queryData', { type: 'JSON' }], // 订单管理
    ['wms_orderManagementDetails', '/api/supplychain/orderDetail/listData', { type: 'JSON' }], // 订单管理详情

    ['shopCopy', '/api/shopapi/copyShop'],
    ['changeCloseShopIsActive', '/api/shopapi/changeCloseShopIsActive'],
    ['addCloseShop', '/api/shopapi/addCloseShop'],
    ['queryCloseShop', '/api/shopapi/queryCloseShop'],

    // 店铺分组
    ['deleteShopCategory', '/api/shopapi/deleteShopCategory'],
    ['queryProvince', '/api/shopapi/queryProvince'],
    ['getShopCategory', '/api/shopapi/queryShopCategory'],
    ['addShopCategory', '/api/shopapi/addShopCategory'],
    ['updateShopCategory', '/api/shopapi/updateShopCategory'],
    ['querySingleCategory', '/api/shopapi/queryCategoryMappingShop'],

    ['bizWorkCheckUp', '/api/shopcenter/business/workCheckUp'], // 店铺日常检查
    ['previewCategoryShop', '/api/shopapi/previewCategoryShop'],
    ['queryGroupCity', '/api/shopapi/queryGroupCity'],

    // 预估系统
    ['shopCategoryQueryLst', '/api/shopcenter/shop/shopCategoryQueryLst?', { method: 'GET' }], // 分组
    ['getBusinessEstimate', '/api/shopcenter/business/getBusinessEstimate'], // 营业预估查询列表
    ['estimateDdjustAddOrUpdate', '/api/shopcenter/business/estimateDdjust/addOrUpdate'], // 营业预估保存调整数据
    ['getBusinessEstimateAnalyze', '/api/shopcenter/business/getBusinessEstimateAnalyze'], // 营业预估分析查询列表
    ['shopGetFoodCategory', '/api/shopcenter/shop/getFoodCategory'], // 菜品预估分类
    ['getFoodEstimate', '/api/shopcenter/business/getFoodEstimate'], // 菜品预估table数据
    ['addOrUpdate', '/api/shopcenter/business/foodDdjust/addOrUpdate'], // 菜品预估调整值
    ['getFoodEstimateTopN', '/api/shopcenter/business/getFoodEstimateTopN'], // 查询菜品销量预估top10
    ['getFoodEstimateAnalyze', '/api/shopcenter/business/getFoodEstimateAnalyze'], // // 菜品预估分析查询table数据

    // 菜品库
    ['getGroupFoodCategory', '/api/shopapi/queryGroupFoodCategory'],
    ['saveGroupFoodCategory', '/api/saveGroupFoodCategory'],
    ['updateGroupFoodCategory', '/api/updateGroupFoodCategory'],
    ['delGroupFoodCategory', '/api/delGroupFoodCategory'],
    ['sortGroupFoodCategoryTop', '/api/sortGroupFoodCategoryTop'],
    ['sortGroupFoodCategoryBottom', '/api/sortGroupFoodCategoryBottom'],
    ['sortGroupFoodCategorySwap', '/api/sortGroupFoodCategorySwap'],
    ['toggleGroupCategoryStatus', '/api/toggleGroupCategoryStatus'],
    ['getShopFoodSubject', '/api/deprecated_merchant/saas/base/subjectQuery.ajax'],
    ['getShopBrandInfo', '/api/shopcenter/shop/shopBrandInfoQuery'],
    ['getFoodTags', '/api/getFoodTags'],
    ['addFoodTags', '/api/addFoodTags'],
    ['getFoodRemark', '/api/getFoodRemark'],
    ['getGroupFoodQuery', '/api/getFoodQuery'],
    ['saveGroupFood', '/api/saveGroupFood'],
    ['delGroupFood', '/api/delGroupFood'],
    ['updateGroupFood', '/api/updateGroupFood'],
    ['swapStatus', '/api/swapstatus'],
    ['updateMultiFood', '/api/updateMultiFood'],
    ['getShopFoodList', '/api/shopapi/queryShopFoodPublishInfoList'],
    ['getShopFoodCategory', '/api/shopapi/queryShopFoodClassPublish'],

    ['adsDetail', '/api/queryadsDetail'],
    ['getGroupDynamicParams', '/api/GroupDynamicParams'],
    ['saveGroupDynamicParams', '/api/saveGroupDynamicParams'],
    ['updateAdsInfo', '/api/resetFoodAdsdetail'],
    ['setGroupFoodMaterial', '/api/setGroupFoodMaterial'],

    ['exportFoodExcel', '/api/exportFoodExcel'],
    ['exportFoodExcelIds', '/api/exportFoodExcelIds'],
    ['multiDelFoods', '/api/multiDelFoods'],


    ['importFoodsTemp', '/api/deprecated_merchant/dicFoodImportByExcel.action', { type: 'FORM' }],
    ['importImgsTemp', '/api/importImgsTemp', { type: 'FORM' }],
    /* 菜品排序 */
    ['sortFoodTop', '/api/sortFoodTop'],
    ['sortFoodSwap', '/api/sortFoodSwap'],
    ['sortFoodBottom', '/api/sortFoodBottom'],
    // ['exportFoodExcel', '/shop/excelGroupFoodDetail.svc'],
    // ['exportFoodExcelIds', '/shop/extShopFoodGroupIDsExcel.svc'],
    /* 集团菜谱 */
    ['addGroupFoodBook', '/api/addGroupFoodBook'],
    ['updateGroupFoodBook', '/api/updateGroupFoodBook'],
    ['delGroupFoodBook', '/api/delGroupFoodBook'],
    ['queryGroupFoodBook', '/api/queryGroupFoodBook'],
    ['importFromGroup', '/api/importFromGroup'],
    ['importGroupFoodCategory', '/api/importGroupFoodCategory'],
    ['publishFoodBook', '/api/publishFoodBook'],
    ['getBookImportFood', '/api/getBookImportFood'],
    /** 找回密码相关 */
    ['checkGroupAccount', '/api/user/checkGroupAccount'],
    ['sendResetPasswordAuthCode', '/api/user/sendResetPasswordAuthCode'],
    ['checkResetPasswordAuthCode', '/api/user/checkResetPasswordAuthCode'],
    ['resetPwdForForget', '/api/user/resetPwdForForget'],
    // 集团菜谱相关
    ['queryGroupFoodBookPublishBatch', '/api/queryGroupFoodBookPublishBatch'], /* 菜谱发布查询 */
    ['revokeGroupFoodBookPublish', '/api/revokeGroupFoodBookPublish'], /* 撤销查询 */
    ['queryGroupFoodBookPublish', '/api/queryGroupFoodBookPublish'], /* 菜谱详情 */
    /** 我亲爱的加盟商 */
    ['getFranchiseeList', '/api/shopcenter/franchisee/info/list'],
    ['updateFranchisee', '/api/shopcenter/franchisee/info/update'],
    ['updateFranchiseeStatus', '/api/shopcenter/franchisee/info/updateStatus'],
    ['deleteFranchisee', '/api/shopcenter/franchisee/info/delete'],
    ['addFranchisee', '/api/shopcenter/franchisee/info/add'],
    ['deleteFranchiseeCategory', '/api/shopcenter/franchisee/category/delete'],
    ['addFranchiseeCategory', '/api/shopcenter/franchisee/category/add'],
    ['getFranchiseeCategoryList', '/api/shopcenter/franchisee/category/list'],

    ['addShopTag', '/api/shopcenter/shop/shopTagAdd'],
    ['deleteShopTag', '/api/shopcenter/shop/shopTagDelete'],
    ['getShopTagList', '/api/shopcenter/shop/shopTagQuery'],
    ['getShopStoreList', '/api/shopcenter/shop/getShopBaseInfo'],
    ['getShopContractList', '/api/shopcenter/shop/shopContractList'],
    ['shopTagBathchAdd', '/api/shopcenter/shop/shopTagBathchAdd'],

    // 系统公告
    ['getSysNotice', '/api/monitor/selectNotice'],
    ['readSysNotice', '/api/monitor/getNoticeBody'],

    // 短信模板
    ['queryTemplateList', '/api/queryTemplateList'],
    ['querySmsBusiness', '/api/querySmsBusiness'],
    ['queryKeywordList', '/api/queryKeywordList'],
    ['updateTemplate', '/api/updateTemplate'],
    ['deleteTemplate', '/api/deleteTemplate'],
    ['addTemplate', '/api/addTemplate'],

    // 店铺菜品管理 gfz
    ['queryShopFoodClass', '/api/queryShopFoodClass'],
    ['delShopFoodCategory', '/api/delShopFoodCategory'],
    ['addShopFoodCategory', '/api/addShopFoodCategory'],
    ['updateShopFoodCategory', '/api/updateShopFoodCategory'],
    ['isActiveShopFoodCategory', '/api/isActiveShopFoodCategory'],
    ['topShopFoodCategorySortIndex', '/api/topShopFoodCategorySortIndex'],
    ['bottomShopFoodCategorySortIndex', '/api/bottomShopFoodCategorySortIndex'],
    ['swapShopFoodCategorySortIndex', '/api/swapShopFoodCategorySortIndex'],
    ['queryShopFoodInfoList', '/api/queryShopFoodInfoList'],
    ['topShopFoodSortIndex', '/api/topShopFoodSortIndex'],
    ['bottomShopFoodSortIndex', '/api/bottomShopFoodSortIndex'],
    ['swapShopFoodSortIndex', '/api/swapShopFoodSortIndex'],
    ['addShopFood', '/api/addShopFood'],
    ['updateShopFood', '/api/updateShopFood'],
    ['delShopFood', '/api/delShopFood'],
    ['setIsActive', '/api/setIsActive'],
    ['queryFoodAdsdetail', '/api/queryFoodAdsdetail'],
    ['resetShopFoodAdsdetail', '/api/shop/resetFoodAdsdetail'],
    ['setShopFoodMaterial', '/api/setShopFoodMaterial'],
    ['departmentQuery', '/api/departmentQuery'],
    ['delShopMultiFood', '/api/delShopMultiFood'],
    ['updateShopMultiFood', '/api/updateShopMultiFood'],
    ['extShopFoodIDsExcel', '/api/extShopFoodIDsExcel'],
    ['excelFoodDetail', '/api/excelFoodDetail'],
    ['foodImportByExcel', '/api/foodImportByExcel', { type: 'FORM' }],
    ['FoodImageImportByZip', '/api/FoodImageImportByZip', { type: 'FORM' }],
    ['shopFoodTagQuery', '/api/shopFoodTagQuery'],
    ['queryMenuScheme', '/api/shopapi/queryGroupFoodBookPublish'],

    // 配送中心选择组织组件
    ['queryDemandAndShopNoShopDemandOrg', '/api/supplychain/basic/organization/queryDemandAndShopNoShopDemandOrg', { type: 'JSON' }],
    ['queryAndOtherDemandOrg', '/api/supplychain/basic/organization/queryAndOtherDemandOrg', { type: 'JSON' }],
    ['queryDemandAndShopForOut', '/api/supplychain/basic/organization/queryDemandAndShopForOut', { type: 'JSON' }],
    ['queryDemandAndSubDem', '/api/supplychain/basic/organization/queryDemandAndSubDem', { type: 'JSON' }],
    ['queryMultipeOrgNoShopDemandOrg', '/api/supplychain/basic/organization/queryMultipeOrgNoShopDemandOrg', { type: 'JSON' }],
    ['queryMultipeAllShopAndDemand', '/api/supplychain/basic/organization/queryMultipeAllShopAndDemand', { type: 'JSON' }],
    ['queryShop', '/api/supplychain/basic/organization/queryShop', { type: 'JSON' }],
    ['queryAllShop', '/api/supplychain/basic/organization/queryAllShop', { type: 'JSON' }],
    ['queryDisAndDemand', '/api/supplychain/basic/organization/queryDisAndDemand', { type: 'JSON' }],
    ['queryMultipeDisAndDemand', '/api/supplychain/basic/organization/queryMultipeDisAndDemand', { type: 'JSON' }],
    ['queryOrgByGroup', '/api/supplychain/basic/organization/queryOrgByGroup', { type: 'JSON' }],
    // 按品项复制规则
    ['copyDistributionGoodsRouter', '/api/supplychain/basic/distributionRouter/copyDistributionGoodsRouter', { type: 'JSON' }],
    // 查询品项类别编码
    ['queryGoodsCategoryFinaceCode', '/api/supplychain/basic/goodsCategory/queryGoodsCategoryFinaceCode', { type: 'JSON' }],
    // 查询供应商财务编码
    ['querySupplierFinanceCode', '/api/supplychain/basic/supplier/querySupplierFinanceCode', { type: 'JSON' }],
    // 更新品项类别财务编码
    ['updateGoodsCategoryFinanceCode', '/api/supplychain/basic/goodsCategory/updateGoodsCategoryFinanceCode', { type: 'JSON' }],
    // 更新供应商财务编码
    ['updateSupplierFinanceCode', '/api/supplychain/basic/supplier/updateSupplierFinanceCode', { type: 'JSON' }],
    // 供应商类别
    ['querySupplierCategory', '/api/supplychain/basic/supplierCategory/querySupplierCategory', { type: 'JSON' }],
    ['querySupAndOrg', '/api/supplychain/basic/ChainSupplierAndOrgController/querySupAndOrg', { type: 'JSON' }],
    ['querySupAndOrgDemand', '/api/supplychain/basic/ChainSupplierAndOrgController/querySupAndOrgDemand', { type: 'JSON' }],
    ['querySupAndOrgByShop', '/api/supplychain/basic/ChainSupplierAndOrgController/querySupAndOrgByShop', { type: 'JSON' }],

    ['getShopDynamicParams', '/api/ShopDynamicParams'],
    ['saveShopDynamicParams', '/api/saveShopDynamicParams'],
    ['queryDecorationArchivesList', '/api/queryDecorationArchivesList'],
    ['addDecorationArchives', '/api/addDecorationArchives'],
    ['updateDecorationArchives', '/api/updateDecorationArchives'],
    ['deleteDecorationArchives', '/api/deleteDecorationArchives'],
    // 桌台管理相关
    ['queryGroupbyArea', '/api/deptapi/queryGroupbyArea'], // 查询区域信息
    ['updateTableAreaActive', '/api/deptapi/updateTableAreaActive'], // 启用/禁用  设置区域可点菜品分类
    ['deleteTableArea', '/api/deptapi/deleteTableArea'], // 删除区域
    ['addTableArea', '/api/deptapi/addTableArea'], // 添加区域
    ['updateTableArea', '/api/deptapi/updateTableArea'], // 修改区域
    ['tableAreaIsExist', '/api/deptapi/tableAreaIsExist'], // 检查区域是否存在
    ['tableAreaSort', '/api/deptapi/tableAreaSort'], // 区域置顶、置底、上下换位
    ['wechatListMp', '/api/wechat/wechatListMp'], // 获取微信平台号
    ['produceWxTableQrcode', '/api/deptapi/produceWxTableQrcode'], // 提交桌台码

    ['queryTable', '/api/deptapi/queryTable'], // 查询桌台信息
    ['tableIsExist', '/api/deptapi/tableIsExist'], // 检查桌台是否存在
    ['addOneTable', '/api/deptapi/addOneTable'], // 添加桌台
    ['addTables', '/api/deptapi/addTables'], // 批量添加桌台
    ['deleteOneTable', '/api/deptapi/deleteOneTable'], // 删除桌台
    ['deleteTables', '/api/deptapi/deleteTables'], // 批量删除桌台
    ['querySaasPrinter', '/api/deptapi/querySaasPrinter'], // 查询sass打印机
    ['updateTableSort', '/api/deptapi/updateTableSort'], // 桌台置顶、置底、上下换位
    ['updateOneTable', '/api/deptapi/updateOneTable'], // 修改桌台  修改桌台是否启用
    ['updateTables', '/api/deptapi/updateTables'], // 批量修改桌台
    ['qryWxTblCodeProduceProgress', '/api/deptapi/qryWxTblCodeProduceProgress'], // 查看桌台码生成进度
    ['zipTblQrCode', '/api/deptapi/zipTblQrCode'], // 下载桌台码
    // 第三方外卖评价相关
    ['getComment', '/api/shopcenter/takeevalution/getComment', { method: 'GET', type: 'json' }], // 获取评论
    ['postReply', '/api/shopcenter/takeevalution/postReply', { type: 'json' }], // 提交店铺回复
]
/* eslint-enable max-len */

const apiCfgMap = apiCfg.reduce((ret, cfg = []) => {
    const [name, path] = cfg;
    if (!name || !path) return ret;
    if (ret[name] && process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`callserver: api with name ${name} already existed.`);
    }
    return { ...ret, [name]: cfg };
}, {});

export default function getApiConfig(apiName) {
    const config = apiCfgMap[apiName];
    if (!config) throw new Error(`getApiConfig: cannot find ${apiName} config.`);
    const [name, url, {
        method = 'POST',
        type = '',
        credentials = 'include',
    } = {}] = config;
    return {
        name,
        url,
        options: { method, type, credentials },
    };
}
