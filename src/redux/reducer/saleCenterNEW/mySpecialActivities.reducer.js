/**
 * @Author: chenshuang
 * @Date:   2017-03-20T10:14:38+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T11:20:24+08:00
 */


/*
 *  @flow
 * Created by xf on 13/2/2017.
 */


import Immutable from 'immutable';
import Moment from 'moment';

import { ACTIVITY_CATEGORIES } from '../../actions/saleCenterNEW/types';

import {

    SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE,
    // 查询活动列表
    SPECIAL_PROMOTION_FETCH_PROMOTION_LIST,
    SPECIAL_PROMOTION_FETCH_PROMOTION_OK,
    SPECIAL_PROMOTION_FETCH_PROMOTION_TIME_OUT,
    SPECIAL_PROMOTION_FETCH_PROMOTION_FAIL,
    // 查询活动详情
    SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START,
    SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_OK,
    SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_FAIL,
    SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_TIMEOUT,
    SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL,
    // 单独查询活动详情
    SALE_CENTER_FETCH_SPECIAL_DETAIL_START,
    SALE_CENTER_FETCH_SPECIAL_DETAIL_OK,
    SALE_CENTER_FETCH_SPECIAL_DETAIL_FAIL,
    SALE_CENTER_FETCH_SPECIAL_DETAIL_TIMEOUT,
    SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL,

    // 查询用户列表

    SALE_CENTER_FETCH_USER_INFO_START,
    SALE_CENTER_FETCH_USER_INFO_OK,
    SALE_CENTER_FETCH_USER_INFO_FAIL,
    SALE_CENTER_FETCH_USER_INFO_TIMEOUT,
    SALE_CENTER_FETCH_USER_INFO_CANCEL,

    SALE_CENTER_FETCH_CARD_LEVEL_START,
    SALE_CENTER_FETCH_CARD_LEVEL_OK,
    SALE_CENTER_FETCH_CARD_LEVEL_FAIL,
    SALE_CENTER_FETCH_CARD_LEVEL_TIMEOUT,
    SALE_CENTER_FETCH_CARD_LEVEL_CANCEL,

    SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_OK,
    SALE_CENTER_QUERY_GROUP_MEMBERS_FILLED, SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_SUCCESS_ONLY,
    GHT_TAGLIST_SUCCESS,
} from '../../actions/saleCenterNEW/mySpecialActivities.action'

const $initialState = Immutable.fromJS({
    pageSize: 0,
    pageNum: 0,
    totalNum: 0,
    pageCount: 10,
    $specialPromotionList: {
        data: [],
        total: 0,
        status: 'start',
    },
    $specialDetailInfo: {
        data: {
            userInfo: {},
            eventInfo: {},
            cardInfo: {},
        },
        status: 'start',
    },
    $userInfo: {
        status: 'start',
    },
    $cardInfo: {
        status: 'start',
    },
    $specialNew: {
        status: 'start',
    },
    $groupMembers: {},
    tagList: [],
});
export const mySpecialActivities_NEW = ($$state = $initialState, action) => {
    switch (action.type) {
        // 会员标签
        case GHT_TAGLIST_SUCCESS: 
            return $$state.merge({
                tagList: action.payload
            });
        // list
        case SPECIAL_PROMOTION_FETCH_PROMOTION_LIST:
            return $$state.setIn(['$specialPromotionList', 'status'], 'pending');

        case SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE:
            $$state.getIn(['$specialPromotionList', 'data']).updateIn
            if (action.payload) {
                const filteredPromotionList = $$state.getIn(['$specialPromotionList', 'data'])
                    .map(($promotion) => {
                        if (action.payload.itemID == $promotion.get('itemID')) {
                            if (action.payload.nextActive == '-1') {
                                return $promotion.set('isActive', '-1');
                            } else if ($promotion.get('isActive') == '1') {
                                return $promotion.set('isActive', '0');
                            }

                            return $promotion.set('isActive', '1');
                        }
                        return $promotion;
                    });

                return $$state.setIn(['$specialPromotionList', 'data'], filteredPromotionList);
            }

            return $$state;

        case SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_OK:
            if (action.payload instanceof Object) {
                const filteredPromotionList = $$state.getIn(['$specialPromotionList', 'data'])
                    .filter(($promotion) => {
                        return $promotion.get('itemID') !== action.payload.itemID
                    });

                return $$state.setIn(['$specialPromotionList', 'data'], filteredPromotionList)
                    .setIn(['$specialPromotionList', 'total'], $$state.getIn(['$specialPromotionList', 'total']) - 1);
            }

            return $$state;
        // 详情

        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'pending');

        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_OK:
            if ($$state.getIn(['$specialDetailInfo', 'status']) === 'pending') {
                if (action.payload.eventInfo) {
                    return $$state.setIn(['$specialDetailInfo', 'status'], 'success')
                        .setIn(['$specialDetailInfo', 'data'], Immutable.fromJS(action.payload));
                }
                return $$state.setIn(['$specialDetailInfo', 'data', 'eventInfo'], Immutable.fromJS(action.payload));
            }
            return $$state;
        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_SUCCESS_ONLY:
            return $$state.setIn(['$specialDetailInfo', 'data', 'eventInfo'], Immutable.fromJS(action.payload));

        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_TIMEOUT:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'timeout');

        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_FAIL:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'fail');

        case SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'cancel');

        // 编辑

        case SALE_CENTER_FETCH_SPECIAL_DETAIL_START:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'pending');

        case SALE_CENTER_FETCH_SPECIAL_DETAIL_OK:
            if ($$state.getIn(['$specialDetailInfo', 'status']) === 'pending') {
                return $$state.setIn(['$specialDetailInfo', 'status'], 'success')
                    .setIn(['$specialDetailInfo', 'data', 'eventInfo'], Immutable.fromJS(action.payload));
            }
            return $$state;

        case SALE_CENTER_FETCH_SPECIAL_DETAIL_TIMEOUT:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'timeout');

        case SALE_CENTER_FETCH_SPECIAL_DETAIL_FAIL:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'fail');

        case SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL:
            return $$state.setIn(['$specialDetailInfo', 'status'], 'cancel');

        // 活动列表

        case SPECIAL_PROMOTION_FETCH_PROMOTION_OK:
            if ($$state.getIn(['$specialPromotionList', 'status']) === 'pending') {
                return $$state.setIn(['$specialPromotionList', 'status'], 'success')
                    .setIn(['$specialPromotionList', 'data'], Immutable.fromJS(action.payload.datas))
                    .setIn(['$specialPromotionList', 'total'], Immutable.fromJS(action.payload.totalSize));
            }
            return $$state;

        case SPECIAL_PROMOTION_FETCH_PROMOTION_TIME_OUT:
            return $$state.setIn(['$specialPromotionList', 'status'], 'timeout');

        case SPECIAL_PROMOTION_FETCH_PROMOTION_FAIL:
            return $$state.setIn(['$specialPromotionList', 'status'], 'fail');


        // 查询用户列表

        case SALE_CENTER_FETCH_USER_INFO_START:
            return $$state.setIn(['$userInfo', 'status'], 'pending');

        case SALE_CENTER_FETCH_USER_INFO_OK:
            if ($$state.getIn(['$userInfo', 'status']) === 'pending') {
                return $$state.setIn(['$userInfo', 'status'], 'success')
                    .setIn(['$specialDetailInfo', 'data', 'userInfo'], Immutable.fromJS(action.payload));
            }
            return $$state;

        case SALE_CENTER_FETCH_USER_INFO_TIMEOUT:
            return $$state.setIn(['$userInfo', 'status'], 'timeout');

        case SALE_CENTER_FETCH_USER_INFO_FAIL:
            return $$state.setIn(['$userInfo', 'status'], 'fail');

        case SALE_CENTER_FETCH_USER_INFO_CANCEL:
            return $$state.setIn(['$userInfo', 'status'], 'cancel');

        // 查询卡等级
        case SALE_CENTER_FETCH_CARD_LEVEL_START:
            return $$state.setIn(['$cardInfo', 'status'], 'pending');

        case SALE_CENTER_FETCH_CARD_LEVEL_OK:
            return $$state.setIn(['$cardInfo', 'status'], 'success')
                .setIn(['$specialDetailInfo', 'data', 'cardInfo'], Immutable.fromJS(action.payload));

        case SALE_CENTER_FETCH_CARD_LEVEL_TIMEOUT:
            return $$state.setIn(['$cardInfo', 'status'], 'timeout');

        case SALE_CENTER_FETCH_CARD_LEVEL_FAIL:
            return $$state.setIn(['$cardInfo', 'status'], 'fail');

        case SALE_CENTER_FETCH_CARD_LEVEL_CANCEL:
            return $$state.setIn(['$cardInfo', 'status'], 'cancel');

        case SALE_CENTER_QUERY_GROUP_MEMBERS_FILLED:
            return $$state.setIn(['$groupMembers'], Immutable.fromJS(action.payload));

        default:
            return $$state;
    }
};
