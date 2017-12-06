import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';


// 店铺名称
export const BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_START = 'business forecast:: fetch businessShops start';
export const BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_SUCCESS = 'business forcast:: fetch businessShops success';
export const BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_FAILD = 'business forecast:: fetch businessShops faild';
export const BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_CANCEL = 'business forecast:: fetch businessShops cancel';
export const BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_TIMEOUT = 'business forecast:: fetch businessShops timeout';
// 查询列表
export const BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE = 'business forecast::fetch businessEstimate';
export const BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_SUCCESS = 'business forecast::fetch businessEstimate success';
export const BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_FAILED = 'business forecast::fetch businessEstimate failed';
export const BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_CANCEL = 'business forecast::fetch businessEstimate cancel';
export const BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_TIMEOUT = 'business forecast::fetch businessEstimate timeout';
// 保存调整数据
export const BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST = 'business forecst:: save adjustEstimatelist start';
export const BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_SUCCESS = 'business forecst:: save adjustEstimateList success';
export const BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_FAILED = 'business forecst:: save adjustEstimateList failed';
export const BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_CANCEL = 'business forecst:: save adjustEstimateList cancel';
export const BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_TIMEOUT = 'business forecst:: save adjustEstimateList timeout';
// 品牌
export const BUSINESS_FORECAST_SHOPBRANDS_START = 'business forecast shopBrand start';
export const BUSINESS_FORECAST_SHOPBRANDS_SUCCESS = 'business forecast shopBrand success';
export const BUSINESS_FORECAST_SHOPBRANDS_FAIL = 'business forecast shopBrand fail';
export const BUSINESS_FORECAST_SHOPBRANDS_CANCEL = 'business forecast shopBrand cancel';
export const BUSINESS_FORECAST_SHOPBRANDS_TIMEOUT = 'business forecast shopBrand timeout';
// 店铺分组
export const BUSINESS_FORECAST_SHOPCATEGORYS_START = 'business forecast shopCategorys start';
export const BUSINESS_FORECAST_SHOPCATEGORYS_SUCCESS = 'business forecast shopCategorys success';
export const BUSINESS_FORECAST_SHOPCATEGORYS_FAIL = 'business forecast shopCategorys fail';
export const BUSINESS_FORECAST_SHOPCATEGORYS_CANCEL = 'business forecast shopCategorys cancel';
export const BUSINESS_FORECAST_SHOPCATEGORYS_TIMEOUT = 'business forecast shopCategorys timeout';

export const fetchBusinessShopBrandsAC = opts => ({ type: BUSINESS_FORECAST_SHOPBRANDS_START, payload: opts });
const fetchBusinessShopBrandsSuccess = payload => ({ type: BUSINESS_FORECAST_SHOPBRANDS_SUCCESS, payload });
const fetchBusinessShopBrandsFaild = payload => ({ type: BUSINESS_FORECAST_SHOPBRANDS_FAIL, payload });
export const fetchBusinessShopBrandsCancel = () => ({ type: BUSINESS_FORECAST_SHOPBRANDS_CANCEL });
export const fetchBusinessShopBrandsTimeout = () => ({ type: BUSINESS_FORECAST_SHOPBRANDS_TIMEOUT });
export const fetchBusinessShopBrandsEpic = action$ => action$.ofType(BUSINESS_FORECAST_SHOPBRANDS_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getShopBrandInfo', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchBusinessShopBrandsSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchBusinessShopBrandsFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECAST_SHOPBRANDS_CANCEL))
    });


// 分组
export const fetchBusinessShopCategorysAC = opts => ({ type: BUSINESS_FORECAST_SHOPCATEGORYS_START, payload: opts });
const fetchBusinessShopCategorysSuccess = payload => ({ type: BUSINESS_FORECAST_SHOPCATEGORYS_SUCCESS, payload });
const fetchBusinessShopCategorysFaild = payload => ({ type: BUSINESS_FORECAST_SHOPCATEGORYS_FAIL, payload });
export const fetchBusinessShopCategorysCancel = () => ({ type: BUSINESS_FORECAST_SHOPCATEGORYS_CANCEL });
export const fetchBusinessShopCategorysTimeout = () => ({ type: BUSINESS_FORECAST_SHOPCATEGORYS_TIMEOUT });
export const fetchBusinessShopCategorysEpic = action$ => action$.ofType(BUSINESS_FORECAST_SHOPCATEGORYS_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('shopCategoryQueryLst', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchBusinessShopCategorysSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchBusinessShopCategorysFaild(response.resultcode);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECAST_SHOPCATEGORYS_CANCEL))
    });

// 店铺名称
export const fetchBusinessShopsAC = opts => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_START, payload: opts });
const fetchBusinessShopsSuccess = payload => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_SUCCESS, payload });
const fetchBusinessShopsFaild = payload => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_FAILD, payload });
export const fetchBusinessShopsCancel = () => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_CANCEL });
export const fetchBusinessShopsTimeout = () => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_TIMEOUT });
export const fetchBusinessShopsEpic = action$ => action$.ofType(BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getSchema', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchBusinessShopsSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchBusinessShopsFaild(response.resultcode);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECAST_FETCH_BUSINESS_SHOPS_CANCEL))
    });

// 查询列表
export const fetchBusinessEstimateAC = opts => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE, payload: opts });
const fetchBusinessEstimateSuccess = payload => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_SUCCESS, payload });
const fetchBusinessEstimateFailed = payload => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_FAILED, payload });
export const fetchBusinessEstimateCancel = () => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_CANCEL });
export const fetchBusinessEstimateTimeout = () => ({ type: BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_TIMEOUT });
export const estimateListEpic = action$ => action$.ofType(BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getBusinessEstimate', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchBusinessEstimateSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchBusinessEstimateFailed(response.resultcode);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECAST_FETCH_BUSINESS_ESTIMATE_CANCEL))
    });

// 保存调整数据
export const saveAdjustEstimateListAC = opts => ({ type: BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST, payload: opts });
const saveAdjustEstimateListSuccess = payload => ({ type: BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_SUCCESS, payload });
const saveAdjustEsimateListFailed = payload => ({ type: BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_FAILED, payload });
export const saveAdjustEstimateCancel = () => ({ type: BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_CANCEL });
export const saveAdjustEstimateTimeout = () => ({ type: BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_TIMEOUT });
export const saveAdjustEstimateEpic = action$ => action$.ofType(BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('estimateDdjustAddOrUpdate', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return saveAdjustEstimateListSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            saveAdjustEsimateListFailed(response.resultcode);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECST_SAVE_ADJUST_ESTIMATE_LIST_CANCEL))
    });

