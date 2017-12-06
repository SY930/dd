import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';

// 按餐段查询列表
export const MEAL_FORECAST_FETCH_ESTIMATE_lIST_START = 'meal forecast::fetch estimate list start';
export const MEAL_FORECAST_FETCH_ESTIMATE_lIST_SUCCESS = 'meal forecast::fetch estimate list success';
export const MEAL_FORECAST_FETCH_ESTIMATE_lIST_FAIL = 'meal forecast::fetch estimate list fail';
export const MEAL_FORECAST_FETCH_ESTIMATE_lIST_CANCEL = 'meal forecast::fetch estimate list cancel';
export const MEAL_FORECAST_FETCH_ESTIMATE_lIST_TIMEOUT = 'meal forecast::fetch estimate list timeout';

export const fetchMealEstimateAC = opts => ({ type: MEAL_FORECAST_FETCH_ESTIMATE_lIST_START, payload: opts });
const fetchMealEstimateSuccess = payload => ({ type: MEAL_FORECAST_FETCH_ESTIMATE_lIST_SUCCESS, payload });
const fetchMealEstimateFail = payload => ({ type: MEAL_FORECAST_FETCH_ESTIMATE_lIST_FAIL, payload });
export const fetchMealEstimateCancel = () => ({ type: MEAL_FORECAST_FETCH_ESTIMATE_lIST_CANCEL });
export const fetchMealEstimateTimeout = () => ({ type: MEAL_FORECAST_FETCH_ESTIMATE_lIST_TIMEOUT });
export const mealEstimateListEpic = action$ => action$.ofType(MEAL_FORECAST_FETCH_ESTIMATE_lIST_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getBusinessEstimate', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchMealEstimateSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchMealEstimateFail(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(MEAL_FORECAST_FETCH_ESTIMATE_lIST_CANCEL))
    });

