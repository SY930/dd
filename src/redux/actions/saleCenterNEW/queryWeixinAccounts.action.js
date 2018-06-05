import { Observable} from 'rxjs/Observable';
import {axiosData} from "../../../helpers/util";


export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START = 'sale center: query occupied wei xin accounts start';
export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS = 'sale center: query occupied wei xin accounts success';
export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL = 'sale center: query occupied wei xin accounts fail';
export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_RESET = 'sale center: query occupied wei xin accounts reset';

export const queryOccupiedWeiXinAccountsStart = (opts) => {
    return {
        type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START,
        payload: opts,
    }
};

export const resetOccupiedWeChatInfo = (opts) => {
    return {
        type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_RESET,
        payload: opts,
    }
};
export const queryOccupiedWeiXinAccountsEpic = action$ =>
    action$.ofType(QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START)
           .switchMap(action => Observable.fromPromise(
               axiosData('/specialPromotion/queryAvailableMpInfo.ajax', action.payload, {}, {path: ''}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
               ).map(responseJSON => ({type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS,
                                       payload: {
                                            mpIDList: responseJSON.mpIDList || [],
                                           noMpIDAvailable: !!responseJSON.noMpIDAvailable
                                       }})
               ).catch(err => {console.log(err);return Observable.of({type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL, payload: undefined})})
           );
