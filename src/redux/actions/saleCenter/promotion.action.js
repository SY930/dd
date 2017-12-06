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

import { message } from 'antd';
import 'rxjs';
import Rx from 'rxjs/Rx';

export const SALE_CENTER_ADD_PROMOTION_START = 'sale center:: add new promotion start';
export const SALE_CENTER_ADD_PROMOTION_SUCCESS = 'sale center:: add new promotion success';
export const SALE_CENTER_ADD_PROMOTION_FAILED = 'sale center:: add new promotion failed';
export const SALE_CENTER_ADD_PROMOTION_TIMEOUT = 'sale center: add promotion time out';
export const SALE_CENTER_ADD_PROMOTION_CANCEL = 'sale center: add promotion cancel';

export const SALE_CENTER_UPDATE_PROMOTION_START = 'sale center: update promotion start';
export const SALE_CENTER_UPDATE_PROMOTION_SUCCESS = 'sale center: update promotion success';
export const SALE_CENTER_UPDATE_PROMOTION_FAILED = 'sale center: update promotion failed';

export const SALE_CENTER_FETCH_PROMOTION_DETAIL = 'sale center: fetch promotion detail';
export const SALE_CENTER_FETCH_RROMOTION_DETAIL_PENDING = 'sale center: fetch promotion detail pending';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_OK = 'sale center: fetch promotion detail ok';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL = 'sale center: fetch promotion  detail fail';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL = 'sale center: fetch promotion detail cancel';
export const SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT = 'sale center: fetch promotion detail time out';

export const SALE_CENTER_RESET_PROMOTION_DETAIL = 'sale center: reset promotion detail';

export const saleCenterAddNewActivityAC = opts => ({ type: SALE_CENTER_ADD_PROMOTION_START, payload: opts });
const addPromotionSuccess = payload => ({ type: SALE_CENTER_ADD_PROMOTION_SUCCESS, payload });
const addPromotionFail = payload => ({ type: SALE_CENTER_ADD_PROMOTION_FAILED, payload });
export const addPromotionCancel = () => ({ type: SALE_CENTER_ADD_PROMOTION_CANCEL });
export const addPromotionTimeout = () => ({ type: SALE_CENTER_ADD_PROMOTION_TIMEOUT });

export const addPromotionEpic = action$ => action$.ofType(SALE_CENTER_ADD_PROMOTION_START)
    .mergeMap((action) => {
        const params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/promotion/add', {
                method: 'POST',
                body: params,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
                    setTimeout(() => {
                        action.payload.success && action.payload.success();
                    }, 0);
                    return addPromotionSuccess(response.data);
                } else if (response.code === '1211200003') {
                    setTimeout(() => {
                        action.payload.sameCode && action.payload.sameCode();
                    }, 0);
                    return addPromotionFail(response.code);
                }
                setTimeout(
                    () => {
                        action.payload.fail && action.payload.fail(response.msg);
                    }
                );
                return addPromotionFail(response.code);
            })
            .timeout(40000) // 设置超时时间为20s。
            .catch((err) => {
                setTimeout(() => {
                    action.payload.fail && action.payload.fail('网络超时，请稍后再试');
                }, 0);
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(addPromotionTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_ADD_PROMOTION_CANCEL))
    });


export const saleCenterUpdateNewActivityAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_START,
        });
        const urlConf = getSpecifiedUrlConfig('updatePromotion', opts.data);

        fetch(urlConf.url, {
            method: 'POST',
            body: urlConf.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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


export const fetchPromotionDetail = opts => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL, payload: opts });
const fetchPromotionDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_OK, payload });
const fetchPromotionDetailFail = payload => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_FAIL, payload });
export const fetchPromotionDetailCancel = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL });
export const fetchPromotionDetailTimeout = () => ({ type: SALE_CENTER_FETCH_PROMOTION_DETAIL_TIME_OUT });

export const promotionDetailEpic = action$ => action$.ofType(SALE_CENTER_FETCH_PROMOTION_DETAIL)
    .mergeMap((action) => {
        const params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/promotion/detail', {
                method: 'POST',
                body: params,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
        )
            .map((response) => {
                const promotionID = /"promotionID":(\d+),/.exec(response)[1];
                const result = JSON.parse(response);
                result.data.promotionInfo.master.promotionID = promotionID;
                if (result.code === '000') {
                    if (action.payload.success !== undefined && typeof action.payload.success === 'function') {
                        action.payload.success(result.data);
                    }
                    return fetchPromotionDetailFullfilled(result.data);
                }
                action.payload.fail && action.payload.fail(result.message);
                return fetchPromotionDetailFail(result.code);
            })
            .timeout(100000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchPromotionDetailTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_PROMOTION_DETAIL_CANCEL))
    });
