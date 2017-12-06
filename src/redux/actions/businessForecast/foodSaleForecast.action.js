import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';

// 菜品分类
export const FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_START = 'foodSale forecast::fetch food classification start';
export const FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_SUCCESS = 'foodSale forecast::fetch food classification success';
export const FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_FAIL = 'foodSale forecast::fetch food classification fail';
export const FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_CANCEL = 'foodSale forecast::fetch food classification cancel';
export const FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_TIMEOUT = 'foodSale forecast::fetch food classification timeout';
// 查询table数据
export const FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_START = 'foodSale forecast::fetch foodSale estimate list start';
export const FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_SUCCESS = 'foodSale forecast::fetch foodSale estimate list success';
export const FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_FAIL = 'foodSale forecast::fetch foodSale estimate list fail';
export const FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_CANCEL = 'foodSale forecast::fetch foodSale estimate list cancel';
export const FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_TIMEOUT = 'foodSale forecast::fetch foodSale estimate list timeout';
// 保存调整值
export const FOODSALE_FORECAST_SAVE_ADJUST_DATA_START = 'foodSale forecast::save adjustData start';
export const FOODSALE_FORECAST_SAVE_ADJUST_DATA_SUCCESS = 'foodSale forecast::save adjustData success';
export const FOODSALE_FORECAST_SAVE_ADJUST_DATA_FAIL = 'foodSale forecast::save adjustData fail';
export const FOODSALE_FORECAST_SAVE_ADJUST_DATA_CANCEL = 'foodSale forecast::save adjustData cancel';
export const FOODSALE_FORECAST_SAVE_ADJUST_DATA_TIMEOUT = 'foodSale forecast::save adjustData timeout';
// 查询菜品销量top10
export const FOODSALE_FORECASR_FETCH_TOP_TEN_START = 'foodSale forecast::fetch top ten start';
export const FOODSALE_FORECASR_FETCH_TOP_TEN_SUCCESS = 'foodSale forecast::fetch top ten success';
export const FOODSALE_FORECASR_FETCH_TOP_TEN_FAIL = 'foodSale forecast::fetch top ten fail';
export const FOODSALE_FORECASR_FETCH_TOP_TEN_CANCEL = 'foodSale forecast::fetch top ten cancel';
export const FOODSALE_FORECASR_FETCH_TOP_TEN_TIMEOUT = 'foodSale forecast::fetch top ten timeout';

// 菜品分类
export const fetchFoodSaleClassificationAC = opts => ({ type: FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_START, payload: opts });
const fetchFoodSaleClasscificationSuccess = payload => ({ type: FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_SUCCESS, payload });
const fetchFoodSaleClassificationFail = payload => ({ type: FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_FAIL, payload });
export const fetchFoodSaleClassificationCancel = () => ({ type: FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_CANCEL });
export const fetchFoodSaleClassificationTimeout = () => ({ type: FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_TIMEOUT });
export const foodSaleClassificationEpic = action$ => action$.ofType(FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('shopGetFoodCategory', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchFoodSaleClasscificationSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchFoodSaleClassificationFail(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(FOODSALE_FORECAST_FETCH_FOOD_CLASSIFICATION_CANCEL))
    });

// 查询table数据
export const fetchFoodSaleEstimateListAC = opts => ({ type: FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_START, payload: opts });
const fetchFoodSaleEstimateListSuccess = payload => ({ type: FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_SUCCESS, payload });
const fetchFoodSaleEstimateListFail = payload => ({ type: FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_FAIL, payload });
export const fetchFoodSaleEstimateCancel = () => ({ type: FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_CANCEL });
export const fetchFoodSaleEstimateTimeout = () => ({ type: FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_TIMEOUT });
export const fetchSaleEstimateListEpic = action$ => action$.ofType(FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getFoodEstimate', action.payload, null, { path: false })
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
        }).takeUntil(action$.ofType(FOODSALE_FORECAST_FETCH_ESTIMATE_LIST_CANCEL))
    });
// 保存调整值
export const saveFoodSaleAdjustDataAC = opts => ({ type: FOODSALE_FORECAST_SAVE_ADJUST_DATA_START, payload: opts });
const saveFoodSaleAdjustDataSuccess = payload => ({ type: FOODSALE_FORECAST_SAVE_ADJUST_DATA_SUCCESS, payload });
const saveFoodSaleAdjustDataFail = payload => ({ type: FOODSALE_FORECAST_SAVE_ADJUST_DATA_FAIL, payload });
export const saveFoodSaleAdjustDataCancel = () => ({ type: FOODSALE_FORECAST_SAVE_ADJUST_DATA_CANCEL });
export const saveFoodSaleAdjustDataTimeout = () => ({ type: FOODSALE_FORECAST_SAVE_ADJUST_DATA_TIMEOUT });
export const saveFoodSaleAdjustDataEpic = action$ => action$.ofType(FOODSALE_FORECAST_SAVE_ADJUST_DATA_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('addOrUpdate', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return saveFoodSaleAdjustDataSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            saveFoodSaleAdjustDataFail(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(FOODSALE_FORECAST_SAVE_ADJUST_DATA_CANCEL))
    });
// 查询菜品销量预估top10
export const fetchFoodSaleTopTenAC = opts => ({ type: FOODSALE_FORECASR_FETCH_TOP_TEN_START, payload: opts });
const fetchFoodSaleTopTenSuccess = payload => ({ type: FOODSALE_FORECASR_FETCH_TOP_TEN_SUCCESS, payload });
const fetchFoodSaleTopTenFail = payload => ({ type: FOODSALE_FORECASR_FETCH_TOP_TEN_FAIL, payload });
export const fetchFoodSaleTopTenCancel = () => ({ type: FOODSALE_FORECASR_FETCH_TOP_TEN_CANCEL });
export const fetchFoodSaleTopTenTimeout = () => ({ type: FOODSALE_FORECASR_FETCH_TOP_TEN_TIMEOUT });
export const fetchFoodSaleTopTenEpic = action$ => action$.ofType(FOODSALE_FORECASR_FETCH_TOP_TEN_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getFoodEstimateTopN', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchFoodSaleTopTenSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchFoodSaleTopTenFail(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(FOODSALE_FORECASR_FETCH_TOP_TEN_CANCEL))
    });

