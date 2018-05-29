import { Observable} from 'rxjs/Observable';

export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START = 'sale center: query occupied wei xin accounts start';
export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS = 'sale center: query occupied wei xin accounts success';
export const QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL = 'sale center: query occupied wei xin accounts fail';

export const queryOccupiedWeiXinAccountsStart = (opts) => {
    return {
        type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START,
        payload: opts,
    }
};
export const queryOccupiedWeiXinAccountsEpic = action$ =>
    action$.ofType(QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START)
           .switchMap(action => Observable.fromPromise(new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(1);
                    }, 5000)
               })).map(i => ({type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS, payload: i}))
                .catch(err => {console.log(err);return Observable.of({type: QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL, payload: undefined})})
           );
