/**
 * Created by zhaohcuanchuan on 2017/6/8.
 */

import Immutable from 'immutable';

import {
    // 品牌
    BUSINESS_FORECAST_SHOPBRANDS_START,
    BUSINESS_FORECAST_SHOPBRANDS_SUCCESS,
    BUSINESS_FORECAST_SHOPBRANDS_FAIL,
    BUSINESS_FORECAST_SHOPBRANDS_TIMEOUT,
    // 店铺分组
    BUSINESS_FORECAST_SHOPCATEGORYS_START,
    BUSINESS_FORECAST_SHOPCATEGORYS_SUCCESS,
    BUSINESS_FORECAST_SHOPCATEGORYS_FAIL,
    BUSINESS_FORECAST_SHOPCATEGORYS_TIMEOUT,
    // 店铺名称
    BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_START,
    BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_SUCCESS,
    BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_FAILD,
    BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_TIMEOUT,

    BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE,
    BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_SUCCESS,
    BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_FAILED,
    BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_TIMEOUT,

    BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST,
    BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_SUCCESS,
    BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_FAILED,
    BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_TIMEOUT,

} from '../../actions/businessForecast/businessForecast.action';


const $initialState = Immutable.fromJS({
    brandsData: {
        initialized: false,
        shopBrands: [],
        status: 'start',
    },
    categorysData: {
        initialized: false,
        shopCategorys: [],
        status: 'start',
    },
    shopsData: {
        initialized: false,
        shops: [],
        status: 'start',
    },
    businessEstimateData: {
        businessDayEstimateList: [],
        businessDayEstimateSum: {},
        status: 'start', // start -> pending -> success -> fail
    },
    saveAdjustData: {
        status: 'start',
    },
});

export const businessForecast = ($$state = $initialState, action) => {
    switch (action.type) {
        // 品牌
        case BUSINESS_FORECAST_SHOPBRANDS_START:
            return $$state.setIn(['brandsData', 'status'], 'pending');
        case BUSINESS_FORECAST_SHOPBRANDS_SUCCESS:
            if ($$state.getIn(['brandsData', 'status']) === 'pending') {
                return $$state.setIn(['brandsData', 'initialized'], true)
                    .setIn(['brandsData', 'status'], 'success')
                    .setIn(['brandsData', 'shopBrands'], Immutable.fromJS(action.payload.records));
            }
            return $$state;
        case BUSINESS_FORECAST_SHOPBRANDS_TIMEOUT:
            return $$state.setIn(['brandsData', 'status'], 'timeout');
        case BUSINESS_FORECAST_SHOPBRANDS_FAIL:
            return $$state.setIn(['brandsData', 'status'], 'fail');
        // 分组
        case BUSINESS_FORECAST_SHOPCATEGORYS_START:
            return $$state.setIn(['categorysData', 'status'], 'pending');
        case BUSINESS_FORECAST_SHOPCATEGORYS_SUCCESS:
            if ($$state.getIn(['categorysData', 'status']) === 'pending') {
                return $$state.setIn(['categorysData', 'initialized'], true)
                    .setIn(['categorysData', 'status'], 'success')
                    .setIn(['categorysData', 'shopCategorys'], Immutable.fromJS(action.payload.records));
            }
            return $$state;
        case BUSINESS_FORECAST_SHOPCATEGORYS_TIMEOUT:
            return $$state.setIn(['categorysData', 'status'], 'timeout');
        case BUSINESS_FORECAST_SHOPCATEGORYS_FAIL:
            return $$state.setIn(['categorysData', 'status'], 'fail');

        // 店铺名称
        case BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_START:
            return $$state.setIn(['shopsData', 'status'], 'pending');
        case BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_SUCCESS:
            if ($$state.getIn(['shopsData', 'status']) === 'pending') {
                return $$state
                    .setIn(['shopsData', 'initialized'], true)
                    .setIn(['shopsData', 'status'], 'success')
                    .setIn(['shopsData', 'shops'], Immutable.fromJS(action.payload.shops));
            }
            return $$state;
        case BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_TIMEOUT:
            return $$state.setIn(['shopsData', 'status'], 'timeout');
        case BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_FAILD:
            return $$state.setIn(['shopsData', 'status'], 'fail');


        // table数据
        case BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE:
            return $$state.setIn(['businessEstimateData', 'status'], 'pending');
        case BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_SUCCESS:
            if ($$state.getIn(['businessEstimateData', 'status']) === 'pending') {
                return $$state
                    .setIn(['businessEstimateData', 'status'], 'success')
                    .setIn(['businessEstimateData', 'businessDayEstimateList'], Immutable.fromJS(action.payload.businessDayEstimateList))
                    .setIn(['businessEstimateData', 'businessDayEstimateSum'], Immutable.fromJS(action.payload.businessDayEstimateSum));
            }
            return $$state;
        case BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_TIMEOUT:
            return $$state.setIn(['businessEstimateData', 'status'], 'timeout');
        case BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_FAILED:
            return $$state.setIn(['businessEstimateData', 'status'], 'fail');

        // 保存调整数据成功
        case BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST:
            return $$state.setIn(['saveAdjustData', 'status'], 'pending');
        case BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_SUCCESS:
            if ($$state.getIn(['saveAdjustData', 'status']) === 'pending') {
                return $$state.setIn(['saveAdjustData', 'status'], 'success');
            }
            return $$state;
        case BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_FAILED:
            return $$state.setIn(['saveAdjustData', 'status'], 'fail');
        case BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_TIMEOUT:
            return $$state.setIn(['saveAdjustData', 'status'], 'timeout');

        default:
            return $$state;
    }
};
