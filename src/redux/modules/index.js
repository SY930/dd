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
import { promotionListEpic } from '../actions/saleCenter/myActivities.action';
import { promotionListEpic_NEW } from '../actions/saleCenterNEW/myActivities.action';
import { addSpecialPromotionEpic, updateSpecialPromotionEpic, specialPromotionGroupMemberEpic } from '../actions/saleCenter/specialPromotion.action';
// import { addSpecialPromotionEpic_NEW, updateSpecialPromotionEpic_NEW, specialPromotionGroupMemberEpic_NEW } from '../actions/saleCenterNEW/specialPromotion.action';
import { specialPromotionListEpic, specialPromotionDetailEpic, specialPromotionUserInfoEpic, specialDetailEpic, specialPromotionCardLevelEpic } from '../actions/saleCenter/mySpecialActivities.action';
import { specialPromotionListEpic_NEW, specialPromotionDetailEpic_NEW, specialPromotionUserInfoEpic_NEW, specialDetailEpic_NEW, specialPromotionCardLevelEpic_NEW } from '../actions/saleCenterNEW/mySpecialActivities.action';

export const rootEpic = combineEpics(
    promotionDetailEpic,
    promotionListEpic, promotionListEpic_NEW,
    specialPromotionListEpic, specialPromotionListEpic_NEW,
    addSpecialPromotionEpic,
    addPromotionEpic,
    specialPromotionDetailEpic, specialPromotionDetailEpic_NEW,
    specialPromotionUserInfoEpic, specialPromotionUserInfoEpic_NEW,
    specialDetailEpic, specialDetailEpic_NEW,
    updateSpecialPromotionEpic,
    specialPromotionCardLevelEpic, specialPromotionCardLevelEpic_NEW,
    specialPromotionGroupMemberEpic,
);
