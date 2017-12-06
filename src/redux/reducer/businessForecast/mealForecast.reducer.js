
import Immutable from 'immutable';

import {
    MEAL_FORECAST_FETCH_ESTIMATE_lIST_START,
    MEAL_FORECAST_FETCH_ESTIMATE_lIST_SUCCESS,
    MEAL_FORECAST_FETCH_ESTIMATE_lIST_FAIL,
    MEAL_FORECAST_FETCH_ESTIMATE_lIST_TIMEOUT,
} from '../../actions/businessForecast/mealForecast.action';

const $initialState = Immutable.fromJS({
    mealEstimateData: {
        businessMealEstimateList: [],
        businessMealEstimateSum: {},
        status: 'start', // start -> pending -> success -> fail
    },
});
export const mealForecast = ($$state = $initialState, action) => {
    switch (action.type) {
        case MEAL_FORECAST_FETCH_ESTIMATE_lIST_START:
            return $$state.setIn(['mealEstimateData', 'status'], 'pending');
        case MEAL_FORECAST_FETCH_ESTIMATE_lIST_SUCCESS:
            if ($$state.getIn(['mealEstimateData', 'status']) === 'pending') {
                return $$state
                    .setIn(['mealEstimateData', 'status'], 'success')
                    .setIn(['mealEstimateData', 'businessMealEstimateList'], Immutable.fromJS(action.payload.businessMealEstimateList))
                    .setIn(['mealEstimateData', 'businessMealEstimateSum'], Immutable.fromJS(action.payload.businessMealEstimateSum));
            }
            return $$state;
        case MEAL_FORECAST_FETCH_ESTIMATE_lIST_TIMEOUT:
            return $$state.setIn(['mealEstimateData', 'status'], 'timeout');
        case MEAL_FORECAST_FETCH_ESTIMATE_lIST_FAIL:
            return $$state.setIn(['mealEstimateData', 'status'], 'fail');
        default:
            return $$state;
    }
};
