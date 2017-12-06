
import Immutable from 'immutable';

import {
    // 查询table数据
    FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_START,
    FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_SUCCESS,
    FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_FAIL,
    FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_TIMEOUT,
} from '../../actions/businessForecast/foodSaleForecastAnalyse.action';

const $initialState = Immutable.fromJS({
    foodSaleData: {
        foodEstimateAnalyzeList: [],
        foodEstimateAnalyzeSumList: [],
        pageInfo: {},
        status: 'start',
    },
});

export const foodSaleForecastAnalyse = ($$state = $initialState, action) => {
    switch (action.type) {
        // table数据
        case FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_START:
            return $$state.setIn(['foodSaleData', 'status'], 'pending');
        case FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_SUCCESS:
            if ($$state.getIn(['foodSaleData', 'status']) === 'pending') {
                return $$state
                    .setIn(['foodSaleData', 'status'], 'success')
                    .setIn(['foodSaleData', 'foodEstimateAnalyzeList'], Immutable.fromJS(action.payload.foodEstimateAnalyzeList))
                    .setIn(['foodSaleData', 'foodEstimateAnalyzeSumList'], Immutable.fromJS(action.payload.foodEstimateAnalyzeSumList))
                    .setIn(['foodSaleData', 'pageInfo'], Immutable.fromJS(action.payload.pageInfo));
            }
            return $$state;
        case FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_TIMEOUT:
            return $$state.setIn(['foodSaleData', 'status'], 'timeout');
        case FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_FAIL:
            return $$state.setIn(['foodSaleData', 'status'], 'fail');
        default:
            return $$state;
    }
};
