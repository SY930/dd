
import Immutable from 'immutable';

import {
    // 菜品分类
    FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_START,
    FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_SUCCESS,
    FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_FAIL,
    FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_TIMEOUT,
    // 查询table数据
    FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_START,
    FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_SUCCESS,
    FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_FAIL,
    FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_TIMEOUT,
    // 保存调整值
    FOODSALE_FORECAST_SAVE_ADJUST_DATA_START,
    FOODSALE_FORECAST_SAVE_ADJUST_DATA_SUCCESS,
    FOODSALE_FORECAST_SAVE_ADJUST_DATA_FAIL,
    FOODSALE_FORECAST_SAVE_ADJUST_DATA_TIMEOUT,
    // 查询菜品销量top10
    FOODSALE_FORECASR_FETCH_TOP_TEN_START,
    FOODSALE_FORECASR_FETCH_TOP_TEN_SUCCESS,
    FOODSALE_FORECASR_FETCH_TOP_TEN_FAIL,
    FOODSALE_FORECASR_FETCH_TOP_TEN_TIMEOUT,
} from '../../actions/businessForecast/foodSaleForecast.action';

const $initialState = Immutable.fromJS({
    foodSaleClass: {
        classificationData: [],
        status: 'start',
    },
    foodSaleData: {
        foodEstimateList: [],
        foodEstimateSumList: [],
        pageInfo: {},
        status: 'start',
    },
    saveAdjustData: {
        status: 'start',
    },
    foodSaleTopTenData: {
        foodSaleTopTenList: [],
        status: 'start',
    },
});

export const foodSaleForecast = ($$state = $initialState, action) => {
    switch (action.type) {
        // 菜品分类
        case FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_START:
            return $$state.setIn(['foodSaleClass', 'status'], 'pending');
        case FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_SUCCESS:
            if ($$state.getIn(['foodSaleClass', 'status']) === 'pending') {
                return $$state
                    .setIn(['foodSaleClass', 'status'], 'success')
                    .setIn(['foodSaleClass', 'classificationData'], Immutable.fromJS(action.payload.records));
            }
            return $$state;
        case FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_TIMEOUT:
            return $$state.setIn(['foodSaleClass', 'status'], 'timeout');
        case FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_FAIL:
            return $$state.setIn(['foodSaleClass', 'status'], 'fail');


        // table数据
        case FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_START:
            return $$state.setIn(['foodSaleData', 'status'], 'pending');
        case FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_SUCCESS:
            if ($$state.getIn(['foodSaleData', 'status']) === 'pending') {
                return $$state
                    .setIn(['foodSaleData', 'status'], 'success')
                    .setIn(['foodSaleData', 'foodEstimateList'], Immutable.fromJS(action.payload.foodEstimateList))
                    .setIn(['foodSaleData', 'foodEstimateSumList'], Immutable.fromJS(action.payload.foodEstimateSumList))
                    .setIn(['foodSaleData', 'pageInfo'], Immutable.fromJS(action.payload.pageInfo));
            }
            return $$state;
        case FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_TIMEOUT:
            return $$state.setIn(['foodSaleData', 'status'], 'timeout');
        case FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_FAIL:
            return $$state.setIn(['foodSaleData', 'status'], 'fail');

        // 保存调整数据成功
        case FOODSALE_FORECAST_SAVE_ADJUST_DATA_START:
            return $$state.setIn(['saveAdjustData', 'status'], 'pending');
        case FOODSALE_FORECAST_SAVE_ADJUST_DATA_SUCCESS:
            if ($$state.getIn(['saveAdjustData', 'status']) === 'pending') {
                return $$state.setIn(['saveAdjustData', 'status'], 'success');
            }
            return $$state;
        case FOODSALE_FORECAST_SAVE_ADJUST_DATA_FAIL:
            return $$state.setIn(['saveAdjustData', 'status'], 'fail');
        case FOODSALE_FORECAST_SAVE_ADJUST_DATA_TIMEOUT:
            return $$state.setIn(['saveAdjustData', 'status'], 'timeout');

        // 菜品销量预估top10数据
        case FOODSALE_FORECASR_FETCH_TOP_TEN_START:
            return $$state.setIn(['foodSaleTopTenData', 'status'], 'pending');
        case FOODSALE_FORECASR_FETCH_TOP_TEN_SUCCESS:
            if ($$state.getIn(['foodSaleTopTenData', 'status']) === 'pending') {
                return $$state.setIn(['foodSaleTopTenData', 'status'], 'success')
                    .setIn(['foodSaleTopTenData', 'foodSaleTopTenList'], Immutable.fromJS(action.payload.foodEstimateTopList ? action.payload.foodEstimateTopList : []));
            }
            return $$state;
        case FOODSALE_FORECASR_FETCH_TOP_TEN_FAIL:
            return $$state.setIn(['foodSaleTopTenData', 'status'], 'fail');
        case FOODSALE_FORECASR_FETCH_TOP_TEN_TIMEOUT:
            return $$state.setIn(['foodSaleTopTenData', 'status'], 'timeout');

        default:
            return $$state;
    }
};
