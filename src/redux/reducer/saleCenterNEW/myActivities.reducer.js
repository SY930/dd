/**
 * @Author: chenshuang
 * @Date:   2017-03-20T10:14:38+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-05-09T10:00:56+08:00
 */


/*
 *  @flow
 * Created by xf on 13/2/2017.
 */


import Immutable from 'immutable';
import Moment from 'moment';

import { ACTIVITY_CATEGORIES } from '../../actions/saleCenterNEW/types';
import {
    SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES,
    SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_SUCCEED,
    SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE,
    SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD,
    SALE_CENTER_MY_ACTIVITIES_SET_QUALIFICATIONS,
    SALE_CENTER_MY_ACTIVITIES_APPLY_QUALIFICATIONS,
} from '../../actions/saleCenterNEW/myActivities.action';

import {
    TRIPLE_STATE,
} from '../../actions/saleCenterNEW/types';

import {
    SALE_CENTER_FETCH_PROMOTION_DETAIL,
    SALE_CENTER_FETCH_RROMOTION_DETAIL_PENDING,
    SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW,
    SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL,
    SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT,

    SALE_CENTER_ADD_PROMOTION_START_NEWNEW,
    SALE_CENTER_ADD_PROMOTION_SUCCESS,
    SALE_CENTER_ADD_PROMOTION_FAILED,
    SALE_CENTER_ADD_PROMOTION_TIMEOUT,
    SALE_CENTER_ADD_PROMOTION_CANCEL,
} from '../../actions/saleCenterNEW/promotion.action';

import {

    SALE_CENTER_FETCH_PROMOTION_LIST,
    SALE_CENTER_FETCH_PROMOTION_LIST_OK,
    SALE_CENTER_FETCH_PROMOTION_LIST_TIME_OUT,
    SALE_CENTER_FETCH_PROMOTION_LIST_FAIL,
    SALE_CENTER_IS_UPDATE,
    SALE_CENTER_IS_COPY,
} from '../../actions/saleCenterNEW/myActivities.action';
import { SALE_CENTER_RESET_DETAIL_INFO } from '../../actions/saleCenterNEW/promotionDetailInfo.action';

const $initialState = Immutable.fromJS({
    activitiesArr: [],
    type: ACTIVITY_CATEGORIES[0],

    pageSize: 0,
    pageNum: 0,
    totalNum: 0,
    pageCount: 10,
    $promotionList: {
        data: [],
        total: 0,
        status: 'start',
    },

    // qualifications
    $qualifications: {
        promotionDate: null, // 活动时间
        promotionType: null, // 活动类型
        promotionState: TRIPLE_STATE.ALL, // 活动状态

        promotionValid: 0, // 有效状态 {0: all, 1: valid, 2: invalid}
        promotionCategory: null, // 统计类别
        promotionTags: null,
        promotionBrands: null, //
        promotionOrder: null, // 业务类型
        promotionShop: null,
    },

    $promotionDetailInfo: {
        status: 'start', // start -> pending -> success -> fail
        data: null,
    },
    addPromotion: {
        status: 'start',
    },
    isUpdate: true,
    isCopy: false,
});


export const myActivities_NEW = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES:
            return $$state;

        case SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_SUCCEED:
            if (action.payload.promotionLst !== undefined) {
                return $$state
                    .setIn(['$promotionList', 'data'], Immutable.fromJS(action.payload.promotionLst))
                    .setIn(['$promotionList', 'initialize'], true)
                    .setIn(['$promotionList', 'total'], Immutable.fromJS(action.payload.totalSize))
                    .setIn(['$promotionList', 'status'], 'success')// debug有数据返回却不渲染


                // add valid property
                    .updateIn(['$promotionList', 'data'], ($promotionList) => {
                        return $promotionList.map(($promotion, index) => {
                            let valid,
                                currentDate = parseInt(Moment().format('YYYYMMDD'));
                            valid = !!((currentDate >= $promotion.get('startDate') && currentDate <= $promotion.get('endDate')));

                            return $promotion.merge({
                                valid,
                            });
                        })
                    });
            }
            return $$state.setIn(['$promotionList', 'initialize'], true);


        case SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE:

            $$state.getIn(['$promotionList', 'data']).updateIn
            if (action.payload) {
                const filteredPromotionList = $$state.getIn(['$promotionList', 'data'])
                    .map(($promotion) => {
                        if (action.payload.promotionIDStr == $promotion.get('promotionIDStr')) {
                            if ($promotion.get('isActive') == '1') {
                                return $promotion.set('isActive', '0');
                            }

                            return $promotion.set('isActive', '1');
                        }
                        return $promotion;
                    });

                return $$state.setIn(['$promotionList', 'data'], filteredPromotionList);
            }

            return $$state;

        case SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD:
            if (action.payload instanceof Object) {
                const filteredPromotionList = $$state.getIn(['$promotionList', 'data'])
                    .filter(($promotion) => {
                        return $promotion.get('promotionID') !== action.payload.promotionID
                    });

                return $$state.setIn(['$promotionList', 'data'], filteredPromotionList);
            }

            return $$state;


        case SALE_CENTER_MY_ACTIVITIES_SET_QUALIFICATIONS:

            // 特殊处理
            if (action.payload.hasOwnProperty('promotionTags')) {
                return $$state.setIn(['$qualifications', 'promotionTags'], action.payload.promotionTags);
            } else if (action.payload.hasOwnProperty('promotionBrands')) {
                return $$state.setIn(['$qualifications', 'promotionBrands'], action.payload.promotionBrands);
            } else if (action.payload.hasOwnProperty('promotionOrder')) {
                return $$state.setIn(['$qualifications', 'promotionOrder'], action.payload.promotionOrder);
            }
            return $$state.mergeDeepIn(['$qualifications'], action.payload);


        case SALE_CENTER_MY_ACTIVITIES_APPLY_QUALIFICATIONS:
            // let $promotionList =  $$state.get("$promotionList")
            //   .filter((promotion) => {
            //     return ( null == $$state.getIn(["$qualifications", "promotionType"]) ||
            //     promotion.get("promotionType") == $$state.getIn(["$qualifications", "promotionType"]))
            //   });

            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_DETAIL:
            return $$state.setIn(['$promotionDetailInfo', 'status'], 'pending');

        case SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW:
            if ($$state.getIn(['$promotionDetailInfo', 'status']) === 'pending') {
                if(action.payload.promotionInfo.foodRuleList){
                    action.payload.promotionInfo.priceLst = action.payload.promotionInfo.foodRuleList;
                }
                return $$state.setIn(['$promotionDetailInfo', 'status'], 'success')
                    .setIn(['$promotionDetailInfo', 'data'], Immutable.fromJS(action.payload));
            }
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT:
            return $$state.setIn(['$promotionDetailInfo', 'status'], 'timeout');

        case SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL:
            return $$state.setIn(['$promotionDetailInfo', 'status'], 'fail');

        case SALE_CENTER_RESET_DETAIL_INFO:
            return $$state.setIn(['$promotionDetailInfo', 'status'], 'pending')
                .setIn(['$promotionDetailInfo', 'data'], Immutable.fromJS(action.payload));

        // list
        case SALE_CENTER_FETCH_PROMOTION_LIST:
            return $$state.setIn(['$promotionList', 'status'], 'pending');

        case SALE_CENTER_FETCH_PROMOTION_LIST_OK:
            if ($$state.getIn(['$promotionList', 'status']) === 'pending') {
                // 兼容后台，没有数据直接没有promotionLst字段
                if (action.payload.promotionLst === undefined) {
                    return $$state;
                }
                return $$state.setIn(['$promotionList', 'status'], 'success')
                    .setIn(['$promotionList', 'data'], Immutable.fromJS(action.payload.promotionLst ? action.payload.promotionLst : []))
                    .setIn(['$promotionList', 'total'], Immutable.fromJS(action.payload.totalSize));
            }
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_LIST_TIME_OUT:
            return $$state.setIn(['$promotionList', 'status'], 'timeout');

        case SALE_CENTER_FETCH_PROMOTION_LIST_FAIL:
            return $$state.setIn(['$promotionList', 'status'], 'fail');

        // 添加营销活动
        case SALE_CENTER_ADD_PROMOTION_START_NEWNEW:
            return $$state.setIn(['addPromotion', 'status'], 'pending');

        case SALE_CENTER_ADD_PROMOTION_SUCCESS:
            if ($$state.getIn(['addPromotion', 'status']) === 'pending') {
                return $$state.setIn(['addPromotion', 'status'], 'success');
            }
            return $$state;

        case SALE_CENTER_ADD_PROMOTION_TIMEOUT:
            return $$state.setIn(['addPromotion', 'status'], 'timeout');

        case SALE_CENTER_ADD_PROMOTION_FAILED:
            return $$state.setIn(['addPromotion', 'status'], 'fail');
        case SALE_CENTER_IS_UPDATE:
            return $$state.set('isUpdate', action.payload);
        case SALE_CENTER_IS_COPY:
            return $$state.set('isCopy', action.payload);
        default:
            return $$state;
    }
};
