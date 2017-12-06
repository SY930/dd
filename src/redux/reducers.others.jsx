// import modal from './modules/modal';
// import { steps } from './modules/steps';
// import { test } from './modules/test';
// import { CrmCardInfoAll } from '../containers/Crm/CrmCardInfo/_reducer';
// import crmCardInfoNew, { CrmCardInfoAllNew } from '../containers/CrmNew/CrmCardInfo/_reducer';
// import progressBar from './modules/progressBar';

// import { crmCardType } from './reducer/crm/crmCardType.reducer';
import { crmCardTypeNew } from './reducer/crmNew/crmCardType.reducer';

// import { fullCut } from './reducer/saleCenter/fullCut.reducer';
import { fullCut_NEW } from './reducer/saleCenterNEW/fullCut.reducer';
// import { saleCenter } from './reducer/saleCenter/saleCenter.reducer';
import { saleCenter_NEW } from './reducer/saleCenterNEW/saleCenter.reducer';
// import { myActivities } from './reducer/saleCenter/myActivities.reducer';
import { myActivities_NEW } from './reducer/saleCenterNEW/myActivities.reducer';
// import { mySpecialActivities } from './reducer/saleCenter/mySpecialActivities.reducer';
import { mySpecialActivities_NEW } from './reducer/saleCenterNEW/mySpecialActivities.reducer';
// import { promotionBasicInfo } from './reducer/saleCenter/promotionBasicInfo.reducer';
import { promotionBasicInfo_NEW } from './reducer/saleCenterNEW/promotionBasicInfo.reducer';
// import { promotionScopeInfo } from './reducer/saleCenter/promotionScopeInfo.reducer';
import { promotionScopeInfo_NEW } from './reducer/saleCenterNEW/promotionScopeInfo.reducer';
// import { promotionDetailInfo } from './reducer/saleCenter/promotionDetailInfo.reducer';
import { promotionDetailInfo_NEW } from './reducer/saleCenterNEW/promotionDetailInfo.reducer';
// import { specialPromotion } from './reducer/saleCenter/specialPromotion.reducer';
import { specialPromotion_NEW } from './reducer/saleCenterNEW/specialPromotion.reducer';

//  商会中心
// import { account } from '../containers/MerchantCenter/Account/_reducer';
// import role from '../containers/MerchantCenter/Role/_reducer';
// import { addtionalitem } from '../containers/MerchantCenter/Additionalitem/_reducer';
// import { payMode } from '../containers/MerchantCenter/PayMode/PayMode.reducer';

// import { dutyScene } from '../containers/MerchantCenter/DutyScene/_reducer';
// import { businessIdx } from '../containers/MerchantCenter/BusinessIdx/_reducers';
//  CRM
// import { crmGroup } from './reducer/crm/crmGroup.reducer';
// import { crmRechargePackageDetail } from './reducer/crm/crmRechargePackage.reducer';
// import { shopCredit } from '../containers/Crm/CrmShopCredit/_reducers';
// import { shopCredit_dkl } from '../containers/CrmNew/CrmShopCredit/_reducers';
// import { giftInfo } from '../containers/Gift/_reducers';
// import { giftInfoNew } from '../containers/GiftNew/_reducers';
import { crmOperation_dkl } from './reducer/crmNew/crmOperation.reducer';

// businForecast
// import { businessForecast } from './reducer/businessForecast/businessForecast.reducer';
// businessForecastAnalyse
// import { businessForecastAnalyse } from './reducer/businessForecast/businessForecastAnalyse.reducer';
// mealForecast
// import { mealForecast } from './reducer/businessForecast/mealForecast.reducer';
// import { foodSaleForecast } from './reducer/businessForecast/foodSaleForecast.reducer';
// import { foodSaleForecastAnalyse } from './reducer/businessForecast/foodSaleForecastAnalyse.reducer';
// HR
// import pact from '../containers/Hr/Compact/_reducer';
// import dorm from '../containers/Hr/Dorm/_reducer';
// import salary from '../containers/Hr/SalaryPolicy/_reducer';
// import salaryAccount from '../containers/Hr/SalaryAccount/_reducer';

// supplychain
// import { shopControlReturn } from './reducer/supplychain/shopControlReturn/shopControlReturn.reducer'
// import { goodSelect } from './reducer/supplychain/goodSelect/goodSelect.reducer'
// 店铺信息
// import { shopList } from '../containers/MerchantCenter/ShopList/_reducer';
// 店铺分组
// import { shopGroup } from '../containers/MerchantCenter/ShopGroup/_reducer';

// 提成设置
// import royalty from '../containers/MerchantCenter/RoyaltySetting/_reducer';

// 水电气管理
// import { wegControl } from './reducer/wegControl/wegControl.reducer';
// 加盟商合同管理
// import { allianceContract } from './reducer/allianceContract/allianceContract.reducer';
// 加盟项管理
// import { franchisefee } from '../containers/MerchantCenter/Franchisefee/_reducers';
// 集团菜品库相关
// import GroupFood from '../containers/MerchantCenter/GroupMenu/redux/reducers';
// import ShopFood from '../containers/MerchantCenter/Shop/redux/reducers';
// 品项余额报表
// import { itemRemainderReport } from './reducer/supplychain/report/repertory/itemRemainder.reducer.js'
// // 品项明细报表
// import { itemDetailReport } from './reducer/supplychain/report/repertory/itemDetail.reducer.js'
// // 库存进出明细报表
// import { inventoryInAndOutDetailReport } from './reducer/supplychain/report/repertory/inventoryInAndOutDetail.reducer.js'
// // 供应商进货类别统计报表
// import { supplierPurchaseCategoryReport } from './reducer/supplychain/report/repertory/supplierPurchaseCategory.reducer.js'
// // 仓库出库类别汇总报表
// import { collectionOfLibraryCategoryReport } from './reducer/supplychain/report/repertory/collectionOfLibraryCategory.reducer.js'
// // 收入成本统计报表
// import { incomeCostStatisticsReport } from './reducer/supplychain/report/repertory/incomeCostStatistics.reducer.js'

// import { inspectionDifferenceReport } from './reducer/supplychain/report/repertory/inspectionDifference.reducer.js'
// // 盘点消耗成本表
// import { inventoryCostReport } from './reducer/supplychain/report/repertory/inventoryCost.reducer.js'


export default {
    // 供应链
    // shopControlReturn,
    // itemRemainderReport,
    // itemDetailReport,
    // inventoryInAndOutDetailReport,
    // supplierPurchaseCategoryReport,
    // collectionOfLibraryCategoryReport,
    // incomeCostStatisticsReport,
    // inventoryCostReport,
    // inspectionDifferenceReport,
    // goodSelect,
    // // 商会中心
    // account,
    // role,
    // addtionalitem,
    // payMode,
    // shopList,
    // shopGroup,
    // dutyScene,
    // businessIdx,
    // modal,
    // steps,
    // test,
    // crmCardInfo,
    // CrmCardInfoAll,
    // crmCardInfoNew,
    // CrmCardInfoAllNew,
    // crmCardType,
    crmCardTypeNew,
    crmOperation_dkl,
    // progressBar,
    // fullCut,
    fullCut_NEW,
    // saleCenter,
    saleCenter_NEW,
    // myActivities,
    myActivities_NEW,

    //  sale center
    // promotionBasicInfo,
    promotionBasicInfo_NEW,
    // promotionScopeInfo,
    promotionScopeInfo_NEW,
    // promotionDetailInfo,
    promotionDetailInfo_NEW,
    // specialPromotion,
    specialPromotion_NEW,
    // mySpecialActivities,
    mySpecialActivities_NEW,

    //  crm
    // crmGroup,
    // crmRechargePackageDetail,
    // shopCredit,
    // shopCredit_dkl,
    // giftInfo,
    // giftInfoNew,

    // businessForecast,
    // businessForecastAnalyse,
    // mealForecast,
    // foodSaleForecast,
    // foodSaleForecastAnalyse,

    // //  hr
    // pact,
    // dorm,
    // royalty,
    // salary,
    // salaryAccount,

    // // 水电气管理
    // wegControl,
    // allianceContract,
    // // 加梦项管理
    // franchisefee,
    // GroupFood,
    // ShopFood,
};
