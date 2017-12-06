/**
 * Created by zhaohcuanchuan on 2017/6/8.
 */

import Immutable from 'immutable';

import {
    BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE,
    BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_SUCCESS,
    BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_FAILED,
    BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_TIMEOUT,
} from '../../actions/businessForecast/businessForecastAnalyse.action';


const $initialState = Immutable.fromJS({

    businessEstimateAnalyzeData: {
        businessEstimateAnalyzeList: [],
        businessEstimateAnalyzeSum: {},
        status: 'start', // start -> pending -> success -> fail
    },

});

export const businessForecastAnalyse = ($$state = $initialState, action) => {
    switch (action.type) {
        // table数据
        case BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE:
            return $$state.setIn(['businessEstimateAnalyzeData', 'status'], 'pending');
        case BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_SUCCESS:
            if ($$state.getIn(['businessEstimateAnalyzeData', 'status']) === 'pending') {
                return $$state
                    .setIn(['businessEstimateAnalyzeData', 'status'], 'success')
                    .setIn(['businessEstimateAnalyzeData', 'businessEstimateAnalyzeList'], Immutable.fromJS(action.payload.businessEstimateAnalyzeList))
                    .setIn(['businessEstimateAnalyzeData', 'businessEstimateAnalyzeSum'], Immutable.fromJS(action.payload.businessEstimateAnalyzeSum));
            }
            return $$state;
        case BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_TIMEOUT:
            return $$state.setIn(['businessEstimateAnalyzeData', 'status'], 'timeout');
        case BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_FAILED:
            return $$state.setIn(['businessEstimateAnalyzeData', 'status'], 'fail');

        default:
            return $$state;
    }
};
