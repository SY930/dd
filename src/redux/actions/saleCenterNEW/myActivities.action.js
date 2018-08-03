/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-07T15:28:45+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: myActivities.action.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T14:02:46+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


/**
 * Created by Xiao Feng Wang on 13/2/2017.
 */

import {
    axiosData,
    fetchData,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/util';

import 'rxjs';
import Rx from 'rxjs/Rx';

export const SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES = 'sale center: initialization of my activities new';
export const SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_SUCCEED = 'sale center: initialization of my activities succeed new';
export const SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_FAILED = 'sale center: initialization of my activities failed new';
export const SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE = 'sale center:: my activities: toggle selected record state new';
export const SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD = 'sale center:: my activities: delete record new';
export const SALE_CENTER_MY_ACTIVITIES_SET_QUALIFICATIONS = 'sale center:: my activities: set qualifications new';
export const SALE_CENTER_MY_ACTIVITIES_APPLY_QUALIFICATIONS = 'sale center:: my activities: apply qualifications new';

export const SALE_CENTER_FETCH_PROMOTION_LIST = 'sale center: fetch promotion list new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_OK = 'sale center: fetch promotion list ok new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_FAIL = 'sale center: fetch promotion list fail new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_CANCEL = 'sale center: fetch promotion list cancel new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_TIME_OUT = 'sale center: fetch promotion list time out new';

export const SALE_CENTER_IS_UPDATE = 'sale center: is update';

export const fetchPromotionList = opts => ({ type: SALE_CENTER_FETCH_PROMOTION_LIST, payload: opts });
const fetchPromotionListFullfilled = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_LIST_OK, payload });
const fetchPromotionListFail = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_LIST_FAIL, payload });
export const fetchPromotionListCancel = () => ({ type: SALE_CENTER_FETCH_PROMOTION_LIST_CANCEL });
export const fetchPromotionListTimeout = () => ({ type: SALE_CENTER_FETCH_PROMOTION_LIST_TIME_OUT });

export const promotionListEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_PROMOTION_LIST)
    .mergeMap((action) => {
        // let params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/promotion/list_NEW', {
                method: 'POST',
                body: JSON.stringify(action.payload.data),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                            return response.json();
                        }
                        return response.text();
                    }
                    return Promise.reject(new Error(response.statusText));
                })
                .catch((error) => {
                    throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
                })
        )
            .map((response) => {
                if (response.code === '000') {
                    action.payload.success && action.payload.success(response.promotionLst);

                    return fetchPromotionListFullfilled(response);
                }
                action.payload.fail && action.payload.fail(response.message);
                return fetchPromotionListFail(response.code);
            })

            .timeout(20000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchPromotionListTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_PROMOTION_LIST_CANCEL))
    })


// Initialization

const initializationOfMyActivitiesStart = () => {
    return {
        type: SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES,
    }
};

const initializationOfMyActivitiesSucceed = (opts) => {
    return {
        type: SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_SUCCEED,
        payload: opts,
    }
};

const initializationOfMyActivitiesFailed = (opts) => {
    return {
        type: SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_FAILED,
        payload: opts,
    }
};

// Initialization of my activities
export const initializationOfMyActivities = (opts) => {
    return (dispatch) => {
        opts.start && opts.start();
        dispatch(initializationOfMyActivitiesStart());
        const _opts = opts;
        fetchData('getPromotionList_NEW', { ..._opts }, null, { path: '' })
            .then((records) => {
                opts.end && opts.end();
                dispatch(initializationOfMyActivitiesSucceed(records));
                opts.cb && opts.cb(records.promotionLst);
            })
            .catch(err => opts.fail && opts.fail());
    }
};

export const toggleSelectedActivityStateSuccess = (opts) => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE,
        payload: opts,
    }
};
export const toggleSelectedActivityStateAC = (opts) => {
    const params = {
        groupID: opts.record.groupID,
        shopID: opts.record.shopID,
        promotionID: opts.record.promotionIDStr,
        isActive: opts.record.isActive == 'ACTIVE' ? 'NOT_ACTIVE' : 'ACTIVE',
    };
    return (dispatch) => {
        fetch('/api/promotion/setActive_NEW', {
            method: 'POST',
            body: JSON.stringify(params),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            dispatch(toggleSelectedActivityStateSuccess(opts.record));

            opts.cb && opts.cb();
        }).catch((error) => {
            // dispatch(fetchPromotionTagsFailed())
        });
    };
};

const deleteSelectedRecordSuccess = (opts) => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD,
        payload: opts,
    }
};

export const deleteSelectedRecordAC = (opts) => {
    const params = {
        _groupID: opts._groupID,
        promotionID: opts.promotionID,
    };

    return (dispatch) => {
        axiosData(
            '/promotion/docPromotionService_delete.ajax',
            params,
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_SHOPCENTER'
        ).then((responseJSON) => {
            dispatch(deleteSelectedRecordSuccess({
                promotionID: opts.promotionID,
            }));
            opts.cb && opts.cb();
        }).catch((error) => {
        });
    };
};

export const setQualificationsAC = (opts) => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_SET_QUALIFICATIONS,
        payload: opts,
    }
};


export const applyQualificationsAC = () => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_APPLY_QUALIFICATIONS,
    }
};
export const toggleIsUpdateAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_IS_UPDATE,
            payload: opts,
        })
    }
};
