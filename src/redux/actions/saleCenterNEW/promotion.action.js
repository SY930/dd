/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-22T17:42:45+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotion.action.js
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T11:12:08+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import {
    getSpecifiedUrlConfig,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';
import {axiosData, getAccountInfo} from "../../../helpers/util";

export const SALE_CENTER_ADD_PROMOTION_START_NEWNEW = 'sale center:: add new promotion start new new';
export const SALE_CENTER_ADD_PROMOTION_SUCCESS = 'sale center:: add new promotion success new';
export const SALE_CENTER_ADD_PROMOTION_FAILED = 'sale center:: add new promotion failed new';
export const SALE_CENTER_ADD_PROMOTION_TIMEOUT = 'sale center: add promotion time out new';
export const SALE_CENTER_ADD_PROMOTION_CANCEL = 'sale center: add promotion cancel new';

export const SALE_CENTER_UPDATE_PROMOTION_START = 'sale center: update promotion start new';
export const SALE_CENTER_UPDATE_PROMOTION_SUCCESS = 'sale center: update promotion success new';
export const SALE_CENTER_UPDATE_PROMOTION_FAILED = 'sale center: update promotion failed new';

export const SALE_CENTER_FETCH_PROMOTION_DETAIL = 'sale center: fetch promotion detail new';
export const SALE_CENTER_FETCH_RROMOTION_DETAIL_PENDING = 'sale center: fetch promotion detail pending new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW = 'sale center: fetch promotion detail ok new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL = 'sale center: fetch promotion  detail fail new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL = 'sale center: fetch promotion detail cancel new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT = 'sale center: fetch promotion detail time out new';

export const SALE_CENTER_RESET_PROMOTION_DETAIL = 'sale center: reset promotion detail new';

// export const saleCenterAddNewActivityACccccccc = opts => ({ type: SALE_CENTER_ADD_PROMOTION_START_NEWNEW, payload: opts });
const addPromotionSuccess = payload => ({ type: SALE_CENTER_ADD_PROMOTION_SUCCESS, payload });
const addPromotionFail = payload => ({ type: SALE_CENTER_ADD_PROMOTION_FAILED, payload });
export const addPromotionCancel = () => ({ type: SALE_CENTER_ADD_PROMOTION_CANCEL });
export const addPromotionTimeout = () => ({ type: SALE_CENTER_ADD_PROMOTION_TIMEOUT });

export const saleCenterAddNewActivityAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_ADD_PROMOTION_START_NEWNEW,
            payload: opts.data,
        });
        const userName = getAccountInfo().userName
        const params = {
            ...opts.data.promotionInfo.master,
            priceLst: opts.data.promotionInfo.priceLst,
            foodRuleList: opts.data.promotionInfo.foodRuleList,
            timeLst: opts.data.promotionInfo.timeLst,
            scopeLst: opts.data.promotionInfo.scopeLst,
            shareLst: opts.data.promotionInfo.shareLst,
            cardScopeList: opts.data.promotionInfo.cardScopeList,
            createBy: userName,

            //周黑鸭新需求
            mutexActivityId:opts.data.promotionInfo.mutexActivityId,
            mutexActivityType:opts.data.promotionInfo.mutexActivityType,
            sharedAndNotOverlieActivityId:opts.data.promotionInfo.sharedAndNotOverlieActivityId,
            sharedAndNotOverlieType:opts.data.promotionInfo.sharedAndNotOverlieType,
            sharedAndOverlieActivityId:opts.data.promotionInfo.sharedAndOverlieActivityId,
            sharedAndOverlieType:opts.data.promotionInfo.sharedAndOverlieType,  
            goodsScopeList:opts.data.promotionInfo.goodsScopeList,  
            ruleUseType:opts.data.promotionInfo.ruleUseType,  
            shopScopeList:opts.data.promotionInfo.shopScopeList,
            requiredLst:opts.data.promotionInfo.requiredLst,
            stageGoodsList:opts.data.promotionInfo.stageGoodsList,
        };
        axiosData(
            '/promotion/docPromotionService_add.ajax',
            params,
            {needThrow: true, needCode: true},
            {path: 'data'},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((responseJSON) => {
            setTimeout(() => {
                opts.success && opts.success();
            }, 0);
            dispatch(addPromotionSuccess(responseJSON))
        }).catch((error) => {
            if (error.code === '1211200003' || error === '1211200003') {
                setTimeout(() => {
                    opts.sameCode && opts.sameCode();
                }, 0);
                dispatch(addPromotionFail(error.code));
            } else {
                setTimeout(() => {
                    opts.fail && opts.fail(error.message);
                }, 0);
                dispatch(addPromotionFail(error.code));
            }
        });
    }
}

export const saleCenterUpdateNewActivityAC = (opts) => { // opts.data
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_START,
        });
        const params = {
            ...opts.data.promotionInfo.master,
            priceLst: opts.data.promotionInfo.priceLst,
            foodRuleList: opts.data.promotionInfo.foodRuleList,
            timeLst: opts.data.promotionInfo.timeLst,
            scopeLst: opts.data.promotionInfo.scopeLst,
            shareLst: opts.data.promotionInfo.shareLst,
            cardScopeList: opts.data.promotionInfo.cardScopeList,
            modifiedBy: getAccountInfo().userName,

             //周黑鸭新需求
             mutexActivityId:opts.data.promotionInfo.mutexActivityId,
             mutexActivityType:opts.data.promotionInfo.mutexActivityType,
             sharedAndNotOverlieActivityId:opts.data.promotionInfo.sharedAndNotOverlieActivityId,
             sharedAndNotOverlieType:opts.data.promotionInfo.sharedAndNotOverlieType,
             sharedAndOverlieActivityId:opts.data.promotionInfo.sharedAndOverlieActivityId,
             sharedAndOverlieType:opts.data.promotionInfo.sharedAndOverlieType,  
             goodsScopeList:opts.data.promotionInfo.goodsScopeList,  
             ruleUseType:opts.data.promotionInfo.ruleUseType?opts.data.promotionInfo.ruleUseType:'0',  
             shopScopeList:opts.data.promotionInfo.shopScopeList,
             requiredLst:opts.data.promotionInfo.requiredLst,
             stageGoodsList:opts.data.promotionInfo.stageGoodsList,
        };

        axiosData(
            '/promotion/docPromotionService_update.ajax',
            params,
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((responseJSON) => {
            setTimeout(() => {
                opts.success && opts.success();
            }, 0);
            dispatch({
                type: SALE_CENTER_UPDATE_PROMOTION_SUCCESS,
                payload: responseJSON,
            });
        }).catch((error) => {
            dispatch({
                type: SALE_CENTER_UPDATE_PROMOTION_FAILED,
                payload: error,
            })
        });
    }
}

export const resetPromotionDetail = () => ({ type: SALE_CENTER_RESET_PROMOTION_DETAIL });


// export const fetchPromotionDetail = opts => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL, payload: opts });
const fetchPromotionDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW, payload });
const fetchPromotionDetailFail = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL, payload });
export const fetchPromotionDetailCancel = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL });
export const fetchPromotionDetailTimeout = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT });

export const fetchPromotionDetail = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_DETAIL,
        })
        axiosData(
            '/promotion/docPromotionService_queryDetail.ajax',
            opts.data,
            {},
            {path: ''},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((record) => {
            const { data: result , promotionVersion } = record;
            let res = {...result};
            res.data = { promotionInfo: result.promotionInfo, promotionVersion };
            try {
                if (opts.success !== undefined && typeof opts.success === 'function') {
                    opts.success(res.data);
                }
            } catch (e) {
                console.log('error', e);
            }
            return dispatch(fetchPromotionDetailFullfilled(res.data))
        }).catch((error) => {
            console.log('error', error)
            dispatch(fetchPromotionDetailFail(error.code))
        });
    }
}
