import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';

// 查询列表
export const BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE = 'business forecast analyse::fetch businessEstimate';
export const BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_SUCCESS = 'business forecast analyse::fetch businessEstimate success';
export const BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_FAILED = 'business forecast analyse::fetch businessEstimate failed';
export const BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_CANCEL = 'business forecast analyse::fetch businessEstimate cancel';
export const BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_TIMEOUT = 'business forecast analyse::fetch businessEstimate timeout';

// 查询列表
export const fetchBusinessEstimateAC = opts => ({ type: BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE, payload: opts });
const fetchBusinessEstimateSuccess = payload => ({ type: BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_SUCCESS, payload });
const fetchBusinessEstimateFailed = payload => ({ type: BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_FAILED, payload });
export const fetchBusinessEstimateCancel = () => ({ type: BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_CANCEL });
export const fetchBusinessEstimateTimeout = () => ({ type: BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_TIMEOUT });
export const estimateListEpicAnalyse = action$ => action$.ofType(BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getBusinessEstimateAnalyze', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return fetchBusinessEstimateSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            fetchBusinessEstimateFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(BUSINESS_FORECAST_ANALYSE_FETCH_BUSINESS_ESTIMATE_CANCEL))
    });
