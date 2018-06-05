/**
 * @Author: Xiao Feng Wang  <Terrence>
 * @Date:   2017-03-07T15:28:45+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionBasicInfo.reducer.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T10:05:03+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import {
    SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START,
    SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS,
    SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED,

    SALE_CENTER_FETCH_PROMOTION_TAGS_START,
    SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS,
    SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED,

    SALE_CENTER_SET_ACTIVITY_BASIC_INFO,
    SALE_CENTER_ADD_CATEGORY_SUCCESS,
    SALE_CENTER_ADD_TAG_SUCCESS,

    SALE_CENTER_RESET_BASIC_INFO,
    SALE_CENTER_FILTER_SHOPS,
    SALE_CENTER_SHOPS_ALL_SET,
} from '../../actions/saleCenterNEW/promotionBasicInfo.action.js';

import {
    FULL_CUT_ACTIVITY_CYCLE_TYPE,
} from '../../actions/saleCenterNEW/types';

const Immutable = require('immutable');
const moment = require('moment');

const $initialState = Immutable.fromJS({
    $basicInfo: {
        // it's null by default. It will be used to update promotion infos.
        promotionID: null,

        // save this field
        promotionType: null,

        // promotion Category
        category: null,

        // promotion name
        name: null,

        // promotion name to display
        showName: null,

        // promotion code
        code: null, // 活动编码
        tags: [], // 活动标签  ['标签名1','标签名2']
        startDate: undefined, // 开始时间
        endDate: undefined, // 结束时间
        description: null, // 活动描述

        // 高级设置项
        activityCycle: {
            type: FULL_CUT_ACTIVITY_CYCLE_TYPE.EVERYDAY,
            selectValue: ['1'],
        },
        timeSlot: null,
        validCycleType: '0',
        timeRangeInfo: [{
            validationStatus: 'success',
            helpMsg: null,
            start: undefined,
            end: undefined,
        }, ],
        selectMonthValue: [],
        selectWeekValue: [],
        excludeDateArray: [],
    },

    $categoryList: {
        initialized: false,
        data: [],
    }, // 活动类别列表
    $tagList: {
        initialized: false,
        data: [],
    },
    $filterShops: {},
    shopsAllSet: undefined,
});

export const promotionBasicInfo_NEW = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START:
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS:
            if (undefined === action.payload) { return $$state; }
            return $$state
                .setIn(['$categoryList', 'data'], Immutable.fromJS(action.payload.phraseLst))
                .setIn(['$categoryList', 'initialized'], true);

        case SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED:
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_TAGS_START:
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS:
            if (undefined === action.payload) { return $$state; }

            return $$state
                .setIn(['$tagList', 'data'], Immutable.fromJS(action.payload.phraseLst))
                .setIn(['$tagList', 'initialized'], true);


            break;

        case SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED:
            return $$state;

        case SALE_CENTER_ADD_CATEGORY_SUCCESS:
            return $$state;

        case SALE_CENTER_ADD_TAG_SUCCESS:
            return $$state;

        case SALE_CENTER_SET_ACTIVITY_BASIC_INFO:
            const _$$state = $$state.mergeIn(['$basicInfo'], Immutable.fromJS(action.payload));
            return _$$state;

            // reset the state,
        case SALE_CENTER_RESET_BASIC_INFO:
            // reset with default value
            if (undefined === action.payload) {
                return $$state.set('$basicInfo', $initialState.get('$basicInfo'));
            }
            // reset with provided value.
            return $$state.set('$basicInfo', Immutable.fromJS(action.payload));

        case SALE_CENTER_FILTER_SHOPS:
            return $$state.set('$filterShops', Immutable.fromJS(action.payload));

        case SALE_CENTER_SHOPS_ALL_SET:
            return $$state.set('shopsAllSet', action.payload);
        default:
            return $$state;
    }
};
