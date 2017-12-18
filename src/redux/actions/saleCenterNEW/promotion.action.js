/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-22T17:42:45+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotion.action.js
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T11:12:08+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import {
    getSpecifiedUrlConfig,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';

export const SALE_CENTER_ADD_PROMOTION_START_NEWNEW = 'sale center:: add new promotion start new new';
export const SALE_CENTER_ADD_PROMOTION_SUCCESS = 'sale center:: add new promotion success new';
export const SALE_CENTER_ADD_PROMOTION_FAILED = 'sale center:: add new promotion failed new';
export const SALE_CENTER_ADD_PROMOTION_TIMEOUT = 'sale center: add promotion time out new';
export const SALE_CENTER_ADD_PROMOTION_CANCEL = 'sale center: add promotion cancel new';

export const SALE_CENTER_UPDATE_PROMOTION_START = 'sale center: update promotion start new';
export const SALE_CENTER_UPDATE_PROMOTION_SUCCESS = 'sale center: update promotion success new';
export const SALE_CENTER_UPDATE_PROMOTION_FAILED = 'sale center: update promotion failed new';

export const SALE_CENTER_FETCH_PROMOTION_DETAIL = 'sale center: fetch promotion detail new';
export const SALE_CENTER_FETCH_RROMOTION_DETAIL_PENDING = 'sale center: fetch promotion detail pending new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW = 'sale center: fetch promotion detail ok new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL = 'sale center: fetch promotion  detail fail new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL = 'sale center: fetch promotion detail cancel new';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT = 'sale center: fetch promotion detail time out new';

export const SALE_CENTER_RESET_PROMOTION_DETAIL = 'sale center: reset promotion detail new';

// export const saleCenterAddNewActivityACccccccc = opts => ({ type: SALE_CENTER_ADD_PROMOTION_START_NEWNEW, payload: opts });
const addPromotionSuccess = payload => ({ type: SALE_CENTER_ADD_PROMOTION_SUCCESS, payload });
const addPromotionFail = payload => ({ type: SALE_CENTER_ADD_PROMOTION_FAILED, payload });
export const addPromotionCancel = () => ({ type: SALE_CENTER_ADD_PROMOTION_CANCEL });
export const addPromotionTimeout = () => ({ type: SALE_CENTER_ADD_PROMOTION_TIMEOUT });

export const saleCenterAddNewActivityAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_ADD_PROMOTION_START_NEWNEW,
            payload: opts.data,
        });
        fetch('/api/promotion/add_NEW', {
            method: 'POST',
            body: JSON.stringify(opts.data),
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
            .then((response) => {
                if (response.code === '000') {
                    setTimeout(() => {
                        opts.success && opts.success();
                    }, 0);
                    return dispatch(addPromotionSuccess(response));
                } else if (response.code === '1211200003') {
                    setTimeout(() => {
                        opts.sameCode && opts.sameCode();
                    }, 0);
                    return dispatch(addPromotionFail(response.code));
                }
                setTimeout(() => {
                    opts.fail && opts.fail(response.msg);
                }
                );
                return dispatch(addPromotionFail(response.code));
            })
    }
}

export const saleCenterUpdateNewActivityAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_START,
        });
        const urlConf = getSpecifiedUrlConfig('updatePromotion_NEW', opts.data);

        fetch(urlConf.url, {
            method: 'POST',
            body: JSON.stringify(opts.data),
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
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            if (responseJSON.code == '000') {
                setTimeout(() => {
                    opts.success && opts.success();
                }, 0);
                dispatch({
                    type: SALE_CENTER_UPDATE_PROMOTION_SUCCESS,
                    payload: responseJSON,
                });
            } else {
                setTimeout(() => {
                    opts.fail && opts.fail();
                }, 0);
                dispatch({
                    type: SALE_CENTER_UPDATE_PROMOTION_FAILED,
                    payload: error,
                })
            }
        }).catch((error) => {
            setTimeout(() => {
                opts.fail && opts.fail();
            }, 0);
            dispatch({
                type: SALE_CENTER_UPDATE_PROMOTION_FAILED,
                payload: error,
            })
        })
    }
}

export const resetPromotionDetail = () => ({ type: SALE_CENTER_RESET_PROMOTION_DETAIL });


// export const fetchPromotionDetail = opts => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL, payload: opts });
const fetchPromotionDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_OK_NEW, payload });
const fetchPromotionDetailFail = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL, payload });
export const fetchPromotionDetailCancel = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL });
export const fetchPromotionDetailTimeout = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT });

export const fetchPromotionDetail = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_DETAIL,
        })
        fetch('/api/promotion/detail_NEW', {
            method: 'POST',
            body: JSON.stringify(opts.data),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                        return response.text();
                    }
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .catch((error) => {
                throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
            })
            .then((response) => {
                const promotionID = /"promotionID":(\d+),/.exec(response)[1];
                const result = JSON.parse(response);
                result.data = { promotionInfo: result.promotionInfo };
                result.data.promotionInfo.master.promotionID = promotionID;
                if (result.code === '000') {
                    if (opts.success !== undefined && typeof opts.success === 'function') {
                        opts.success(result.data);
                    }
                    return dispatch(fetchPromotionDetailFullfilled(result.data))
                }
                opts.fail && opts.fail(result.message);
                return dispatch(fetchPromotionDetailFail(result.code));
            })
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchPromotionDetailTimeout());
                }
            })
    }
}
