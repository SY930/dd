/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-09T10:01:11+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.js
 * @Last modified by:   xf
 * @Last modified time: 2017-06-19T10:53:33+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import { combineEpics } from 'redux-observable';
import { promotionDetailEpic, addPromotionEpic } from '../actions/saleCenter/promotion.action';
import { promotionDetailEpic_NEW, addPromotionEpic_NEW } from '../actions/saleCenterNEW/promotion.action';
// import { estimateListEpic, saveAdjustEstimateEpic, fetchBusinessShopsEpic, fetchBusinessShopBrandsEpic, fetchBusinessShopCategorysEpic } from '../actions/businessForecast/businessForecast.action';
// import { estimateListEpicAnalyse } from '../actions/businessForecast/businessForecastAnalyse.action';
import { promotionListEpic } from '../actions/saleCenter/myActivities.action';
import { promotionListEpic_NEW } from '../actions/saleCenterNEW/myActivities.action';
import { addSpecialPromotionEpic, updateSpecialPromotionEpic, specialPromotionGroupMemberEpic } from '../actions/saleCenter/specialPromotion.action';
import { addSpecialPromotionEpic_NEW, updateSpecialPromotionEpic_NEW, specialPromotionGroupMemberEpic_NEW } from '../actions/saleCenterNEW/specialPromotion.action';
import { specialPromotionListEpic, specialPromotionDetailEpic, specialPromotionUserInfoEpic, specialDetailEpic, specialPromotionCardLevelEpic } from '../actions/saleCenter/mySpecialActivities.action';
import { specialPromotionListEpic_NEW, specialPromotionDetailEpic_NEW, specialPromotionUserInfoEpic_NEW, specialDetailEpic_NEW, specialPromotionCardLevelEpic_NEW } from '../actions/saleCenterNEW/mySpecialActivities.action';
// import { mealEstimateListEpic } from '../actions/businessForecast/mealForecast.action';
// 菜 品 销 售 预 估 
// import { foodSaleClassificationEpic, fetchSaleEstimateListEpic, saveFoodSaleAdjustDataEpic, fetchFoodSaleTopTenEpic } from '../actions/businessForecast/foodSaleForecast.action';
// import { fetchSaleEstimateListEpicAnalyse } from '../actions/businessForecast/foodSaleForecastAnalyse.action';
// 水电气，添加设备
// import {
//     addUtilitiesMeterEpic, // 添加设备
//     editUtilitiesMeterEpic, // 编辑设备
//     getUtilitiesMeterByTypeEpic, // 查询设备
//     getUtilitiesMeterEpic, // 查询设备，只有名称，没有读数
//     deleteUtilitiesMeterEpic, // 删除设备
//     addUtilitiesPayOutEpic, // 数据录入，新增水电气明细
//     getUtilitiesPayOutByDayEpic, // 查询水电气明细
//     getUtilitiesPayOutByYearEpic, // 查询月报表
//     getUtilitiesPayOutByWeekEpic, // 查询周报表
//     getUtilitiesContrastEpic, // 店铺对比
// } from '../actions/wegControl/wegControl.action';

// import {
//     franchiseeInfoListEpic, // 查询加盟商基本信息
//     queryFContractEpic, // 查询加盟合同列表
//     addFContractEpic, // 新增加盟合同
//     updateFContractEpic, // 修改加盟合同
//     getFsmSettleUnitEpic, // 结算账户查询
// } from '../actions/allianceContract/allianceContract.action';

export const rootEpic = combineEpics(
    promotionDetailEpic, promotionDetailEpic_NEW,
    promotionListEpic, promotionListEpic_NEW,
    specialPromotionListEpic, specialPromotionListEpic_NEW,
    addSpecialPromotionEpic, addSpecialPromotionEpic_NEW,
    addPromotionEpic, addPromotionEpic_NEW,
    specialPromotionDetailEpic, specialPromotionDetailEpic_NEW,
    specialPromotionUserInfoEpic, specialPromotionUserInfoEpic_NEW,
    specialDetailEpic, specialDetailEpic_NEW,
    updateSpecialPromotionEpic, updateSpecialPromotionEpic_NEW,
    specialPromotionCardLevelEpic, specialPromotionCardLevelEpic_NEW,
    specialPromotionGroupMemberEpic, specialPromotionGroupMemberEpic_NEW,

    // estimateListEpic, // 营业预估
    // saveAdjustEstimateEpic,
    // fetchBusinessShopsEpic,
    // fetchBusinessShopBrandsEpic,
    // fetchBusinessShopCategorysEpic,

    // estimateListEpicAnalyse, // 营业分析预估

    // mealEstimateListEpic, // 餐段预估

    // foodSaleClassificationEpic, // 菜品销售预估
    // fetchSaleEstimateListEpic,
    // saveFoodSaleAdjustDataEpic,
    // fetchFoodSaleTopTenEpic,

    // fetchSaleEstimateListEpicAnalyse, // 菜品销售预估分析

    // addUtilitiesMeterEpic, // 水电气，添加设备
    // editUtilitiesMeterEpic, // 编辑设备
    // getUtilitiesMeterByTypeEpic, // 水电气，查询设备
    // getUtilitiesMeterEpic, // 查询设备，只有名称，没有读数
    // deleteUtilitiesMeterEpic, // 水电气，删除设备
    // addUtilitiesPayOutEpic, // 数据录入，新增水电气明细
    // getUtilitiesPayOutByDayEpic, // 查询水电气明细
    // getUtilitiesPayOutByYearEpic, // 查询月报表
    // getUtilitiesPayOutByWeekEpic, // 查询周报表
    // getUtilitiesContrastEpic, // 店铺对比
    // franchiseeInfoListEpic, // 查询加盟商基本信息
    // queryFContractEpic, // 查询加盟合同列表
    // addFContractEpic, // 新增加盟合同
    // updateFContractEpic, // 修改加盟合同
    // getFsmSettleUnitEpic,
);
