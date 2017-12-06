/**
 * @Author: fengxiao.wang <feng>
 * @Date:   2017-02-04T11:56:26+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCut.reducer.js
 * @Last modified by:   xf
 * @Last modified time: 2017-02-09T18:30:32+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import Immutable from 'immutable';
import {
    FULL_CUT_GET_ACTIVITY_SUCCESS,
    FULL_CUT_GET_DATA_BEGIN,
    GET_SHOP_BY_PARAM_START,
    GET_SHOP_BY_PARAM_SUCCESS,
    GET_ADD_CATEGORY_SUCCESS,
    GET_ADD_TAG_SUCCESS,
    GET_ROLE_SUCCESS,
    DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY,
    ADD_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY,

    FULL_CUT_SET_ACTIVITY_PERIOD,
    FULL_CUT_ACTIVITY_CYCLE_TYPE,

    FULL_CUT_SET_ACTIVITY_TIME_SLOT,
    GET_PROMOTION_LIST_SUCCESS,
    GET_DETAIL_LIST_SUCCESS,

    FULL_CUT_GET_ACTIVITY_CATEGORY,
    FULL_CUT_GET_ACTIVITY_CATEGORY_SUCCESS,
    FULL_CUT_GET_ACTIVITY_TAG_SUCCESS,

    FULL_CUT_SET_ACTIVITY_INFOTAG,
    FULL_CUT_SET_ACTIVITY_CATEGORY,
    FULL_CUT_SET_ACTIVITY_NAME,
    FULL_CUT_SET_ACTIVITY_SHOWNAME,
    FULL_CUT_SET_ACTIVITY_CODE,
    FULL_CUT_SET_ACTIVITY_TAGS,
    FULL_CUT_SET_ACTIVITY_STARTDATE,
    FULL_CUT_SET_ACTIVITY_ENDDATE,
    FULL_CUT_SET_ACTIVITY_DATE,
    FULL_CUT_SET_ACTIVITY_DESCRIPTION,

    FULL_CUT_SET_ACTIVITY_RANGETAG,
    FULL_CUT_SET_ACTIVITY_BRANDS,
    FULL_CUT_SET_ACTIVITY_CHANNEL,
    FULL_CUT_SET_ACTIVITY_AUTO,
    FULL_CUT_SET_ACTIVITY_ORDERTYPE,
    FULL_CUT_SET_ACTIVITY_SHOPS,
    FULL_CUT_SET_ACTIVITY_SHOPSINFO,

    FULL_CUR_GET_ACTIVITY_FOOD_CATEGORY,
    FULL_CUR_GET_ACTIVITY_FOOD_MENU,

    FULL_CUT_SET_ACTIVITY_CONTENTTAG,
    FULL_CUT_SET_ACTIVITY_TYPE,
    FULL_CUT_SET_ACTIVITY_FORRULE,
    FULL_CUT_SET_ACTIVITY_FOOD_CATEGORY,
    FULL_CUT_SET_ACTIVITY_EXCLUDEDISHES,
    FULL_CUT_SET_ACTIVITY_DISHES,
    FULL_CUT_SET_ACTIVITY_USERS,
    FULL_CUT_SET_ACTIVITY_SUBJECTTYPE,
    FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIES,
    FULL_CUT_SET_ACTIVITY_ROLE,
    FULL_CUT_SET_ACTIVITY_FOOD_CATEGORYINFO,
    FULL_CUT_SET_ACTIVITY_EXCLUDEDISHESINFO,
    FULL_CUT_SET_ACTIVITY_DISHESINFO,
    FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIESINFO,
    FULL_CUT_SET_ACTIVITY_ROLEINFO,
    FULL_CUT_SET_ACTIVITY_CONTENT_STATE,
    FULL_CUR_GET_ACTIVITY_FOOD_MENU_EXCLUDE,


} from '../../actions/saleCenterNEW/fullCutActivity.action.js';


const $initialState = Immutable.fromJS({
    data: {
        areas: [],
        brands: [],
        cities: [],
        shopCategorys: [],
        role: [],
    },

    startDate: null, // Date, the activity start
    endDate: null, // Date, the activity end
    excludedDate: [], // Date, excluded date
    validCycle: null, // 有效周期列表(列表,以都好分割;每一项的第一位表示周期类型w-周,t-旬,m-月,第二位之后表示周期内值,如w1表示每周一,m2表示每周二,这里在旬和月周期中增加一个周期内值e表示最后一天，如me表示每月月底
    activityCycle: {
        type: FULL_CUT_ACTIVITY_CYCLE_TYPE.EVERYDAY,
        selectValue: ['1'],
    },
    timeSlot: null,
    shops: [],
    promotionList: [],
    promotionDetail: [],


    infoTag: false,
    $categoryList: [], // 活动类别列表
    $tagList: [], // 活动标签列表
    $detailInfo: {
        category: null, // 活动类别
        name: null, // 活动名称
        showName: null, // 活动展示名称
        code: null, // 活动编码
        tags: null, // 活动标签  ['标签名1','标签名2']
        date: [null, ''], // 用来展示的时间，不用传给后台
        startDate: null, // 开始时间
        endDate: null, // 结束时间
        description: null, // 活动描述
    },

    rangeTag: false,
    $activityRange: {
        brands: null, // 适用品牌  ['品牌1ID','品牌2ID']
        channel: '0', // 适用场景--> value给后台，showValue用于展示
        auto: '1', // 自动执行 --> value给后台，showValue用于展示
        orderType: ['31'], // 自动执行 -->第一项给后台，第二项用于展示
        shops: null, // 适用店铺 ['店铺1ID','店铺2ID']
        shopsInfo: null, // 已选店铺，不用传给后台
    },


    $foodCategoryList: [], // 菜品分类列表
    $foodMenuList: [], // 菜品列表
    $foodMenuExcludeList: [], // 排除菜品

    contentTag: false,
    $activityContent: {

        forRule: [], // 满减的金额 [[100,10],[200,20]]
        category: [], // 已选菜品分类ID
        excludeDishes: [], // 排除菜品ID
        dishes: [], // 已选菜品ID
        users: null, // 适用用户
        subjectType: null, // 支付限制
        mutexActivities: [], // 不能同时进行的活动ID
        role: [], // 活动执行角色ID
        // 以下都不用传给后台
        contentState: {
            type: null, // 活动方式
            uuid: null, // 档数
            categoryOrDish: null, // 选择“菜品”还是“分类”
        },

        categoryInfo: null, // 已选分类数据
        excludeDishesInfo: null, // 排除菜品
        dishesInfo: null, // 已选菜品
        mutexActivitiesInfo: null, // 不能同时进行的活动
        roleInfo: null, // 活动执行角色
    },


});

export function fullCut_NEW($$state = $initialState, action) {
    switch (action.type) {
        case FULL_CUT_GET_DATA_BEGIN:
            return $$state;

        case FULL_CUT_GET_ACTIVITY_SUCCESS:
            return $$state.set('data', Immutable.fromJS(action.payload));


        case GET_SHOP_BY_PARAM_START:
            return $$state;

        case GET_SHOP_BY_PARAM_SUCCESS:
            return $$state.set('shops', Immutable.fromJS(action.payload.records));

        case GET_ADD_CATEGORY_SUCCESS:
            return $$state;


        case GET_ADD_TAG_SUCCESS:
            return $$state;

        case GET_ROLE_SUCCESS:
            return $$state.setIn(['data', 'role'], Immutable.fromJS(action.payload.records));


        case DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY:
            const index = action.payload.index;
            const tempExcludedDate = $$state.get('excludedDate').splice(index, 1);
            return $$state.set('excludedDate', tempExcludedDate);

        case ADD_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY:
            return $$state.set('excludedDate', $$state.get('excludedDate').push(action.payload));

        case FULL_CUT_SET_ACTIVITY_PERIOD:
            return $$state.set('activityCycle', Immutable.fromJS(action.payload));

        case FULL_CUT_SET_ACTIVITY_TIME_SLOT:
            return $$state.set('timeSlot', action.payload);

        case GET_PROMOTION_LIST_SUCCESS:
            return $$state.set('promotionList', Immutable.fromJS(action.payload.promotionLst));

        case GET_DETAIL_LIST_SUCCESS:
            return $$state.set('promotionDetail', Immutable.fromJS(action.payload));

        case FULL_CUT_GET_ACTIVITY_CATEGORY:
            return $$state;

        case FULL_CUT_GET_ACTIVITY_CATEGORY_SUCCESS:
            if (action.payload == undefined) { return $$state; }
            return $$state.set('$categoryList', Immutable.fromJS(action.payload.phraseLst));

        case FULL_CUT_GET_ACTIVITY_TAG_SUCCESS:
            if (action.payload == undefined) { return $$state; }
            return $$state.set('$tagList', Immutable.fromJS(action.payload.phraseLst));


        case FULL_CUT_SET_ACTIVITY_INFOTAG:
            return $$state.set('infoTag', action.payload);

        case FULL_CUT_SET_ACTIVITY_RANGETAG:
            return $$state.set('rangeTag', action.payload);

        case FULL_CUT_SET_ACTIVITY_CONTENTTAG:
            return $$state.set('contentTag', action.payload);

        case FULL_CUT_SET_ACTIVITY_CATEGORY:
            return $$state.setIn(['$detailInfo', 'category'], action.payload);

        case FULL_CUT_SET_ACTIVITY_NAME:
            return $$state.setIn(['$detailInfo', 'name'], action.payload);

        case FULL_CUT_SET_ACTIVITY_SHOWNAME:
            return $$state.setIn(['$detailInfo', 'showName'], action.payload);

        case FULL_CUT_SET_ACTIVITY_CODE:
            return $$state.setIn(['$detailInfo', 'code'], action.payload);

        case FULL_CUT_SET_ACTIVITY_TAGS:
            return $$state.setIn(['$detailInfo', 'tags'], action.payload);

        case FULL_CUT_SET_ACTIVITY_STARTDATE:
            return $$state.setIn(['$detailInfo', 'startDate'], action.payload);

        case FULL_CUT_SET_ACTIVITY_ENDDATE:
            return $$state.setIn(['$detailInfo', 'endDate'], action.payload);

        case FULL_CUT_SET_ACTIVITY_DATE:
            return $$state.setIn(['$detailInfo', 'date'], action.payload);

        case FULL_CUT_SET_ACTIVITY_DESCRIPTION:
            return $$state.setIn(['$detailInfo', 'description'], action.payload);

        case FULL_CUT_SET_ACTIVITY_BRANDS:
            return $$state.setIn(['$activityRange', 'brands'], action.payload);

        case FULL_CUT_SET_ACTIVITY_CHANNEL:
            return $$state.setIn(['$activityRange', 'channel'], action.payload);

        case FULL_CUT_SET_ACTIVITY_AUTO:
            // 0 or 1
            return $$state.setIn(['$activityRange', 'auto'], action.payload);

        case FULL_CUT_SET_ACTIVITY_ORDERTYPE:
            // payload may looks like ["11", "20", "31", "21"]
            return $$state.setIn(['$activityRange', 'orderType'], action.payload);

        case FULL_CUT_SET_ACTIVITY_SHOPS:
            return $$state.setIn(['$activityRange', 'shops'], action.payload);

        case FULL_CUT_SET_ACTIVITY_SHOPSINFO:
            return $$state.setIn(['$activityRange', 'shopsInfo'], action.payload);

        case FULL_CUR_GET_ACTIVITY_FOOD_CATEGORY:
            return $$state.set('$foodCategoryList', Immutable.fromJS(action.payload.records));

        case FULL_CUR_GET_ACTIVITY_FOOD_MENU:
            return $$state.set('$foodMenuList', Immutable.fromJS(action.payload.records));

        case FULL_CUR_GET_ACTIVITY_FOOD_MENU_EXCLUDE:
            return $$state.set('$foodMenuExcludeList', Immutable.fromJS(action.payload.records));

        case FULL_CUT_SET_ACTIVITY_TYPE:
            return $$state.setIn(['$activityContent', 'type'], action.payload);

        case FULL_CUT_SET_ACTIVITY_FORRULE:
            return $$state.setIn(['$activityContent', 'forRule'], action.payload);

        case FULL_CUT_SET_ACTIVITY_FOOD_CATEGORY:
            return $$state.setIn(['$activityContent', 'category'], action.payload);

        case FULL_CUT_SET_ACTIVITY_EXCLUDEDISHES:
            return $$state.setIn(['$activityContent', 'excludeDishes'], action.payload);

        case FULL_CUT_SET_ACTIVITY_DISHES:
            return $$state.setIn(['$activityContent', 'dishes'], action.payload);

        case FULL_CUT_SET_ACTIVITY_USERS:
            return $$state.setIn(['$activityContent', 'users'], action.payload);

        case FULL_CUT_SET_ACTIVITY_SUBJECTTYPE:
            return $$state.setIn(['$activityContent', 'subjectType'], action.payload);

        case FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIES:
            return $$state.setIn(['$activityContent', 'mutexActivities'], action.payload);

        case FULL_CUT_SET_ACTIVITY_ROLE:
            return $$state.setIn(['$activityContent', 'role'], action.payload);

        case FULL_CUT_SET_ACTIVITY_CONTENT_STATE:
            return $$state.setIn(['$activityContent', 'contentState'], action.payload);

        case FULL_CUT_SET_ACTIVITY_FOOD_CATEGORYINFO:
            return $$state.setIn(['$activityContent', 'categoryInfo'], action.payload);

        case FULL_CUT_SET_ACTIVITY_EXCLUDEDISHESINFO:
            return $$state.setIn(['$activityContent', 'excludeDishesInfo'], action.payload);

        case FULL_CUT_SET_ACTIVITY_DISHESINFO:
            return $$state.setIn(['$activityContent', 'dishesInfo'], action.payload);

        case FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIESINFO:
            return $$state.setIn(['$activityContent', 'mutexActivitiesInfo'], action.payload);

        case FULL_CUT_SET_ACTIVITY_ROLEINFO:
            return $$state.setIn(['$activityContent', 'roleInfo'], action.payload);

        // TODO: Add responding SALE_CENTER_ADD_PROMOTION_START,
        // SALE_CENTER_ADD_PROMOTION_SUCCESS, SALE_CENTER_ADD_PROMOTION_FAILED
        // to handle request state


        default:
            return $$state;
    }
}
