import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';

// 查询table数据
export const FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_START = 'foodSale forecast analyse::fetch foodSale analyse estimate list start';
export const FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_SUCCESS = 'foodSale forecast analyse::fetch foodSale analyse estimate list success';
export const FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_FAIL = 'foodSale forecast analyse::fetch foodSale analyse estimate list fail';
export const FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_CANCEL = 'foodSale forecast analyse::fetch foodSale analyse estimate list cancel';
export const FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_TIMEOUT = 'foodSale forecast analyse::fetch foodSale analyse estimate list timeout';

// 查询table数据
export const fetchFoodSaleEstimateListAC = opts => ({ type: FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_START, payload: opts });
const fetchFoodSaleEstimateListSuccess = payload => ({ type: FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_SUCCESS, payload });
const fetchFoodSaleEstimateListFail = payload => ({ type: FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_FAIL, payload });
export const fetchFoodSaleEstimateCancel = () => ({ type: FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_CANCEL });
export const fetchFoodSaleEstimateTimeout = () => ({ type: FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_TIMEOUT });
export const fetchSaleEstimateListEpicAnalyse = action$ => action$.ofType(FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getFoodEstimateAnalyze', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchFoodSaleEstimateListSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchFoodSaleEstimateListFail(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(FOODSALE_FORECAST_ANALYSE_FETCH_ESTIMATE_LIST_CANCEL))
    });

