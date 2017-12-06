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
    fetchData,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/util';

import 'rxjs';
import Rx from 'rxjs/Rx';
import _ from 'lodash';

export const SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE = 'special sale center:: my activities: toggle selected record state new';
export const SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE_FAIL = 'special sale center:: my activities: toggle selected record state fail new';

export const SPECIAL_PROMOTION_FETCH_PROMOTION_LIST = 'special sale center: fetch special promotion list new';
export const SPECIAL_PROMOTION_FETCH_PROMOTION_OK = 'special sale center: fetch special promotion list ok new';
export const SPECIAL_PROMOTION_FETCH_PROMOTION_FAIL = 'special sale center: fetch special promotion list fail new';
export const SPECIAL_PROMOTION_FETCH_PROMOTION_CANCEL = 'special sale center: fetch special promotion list cancel new';
export const SPECIAL_PROMOTION_FETCH_PROMOTION_TIME_OUT = 'special sale center: fetch special promotion list time out new';


export const SALE_CENTER_FETCH_SPECIAL_DETAIL_START = 'sale center: fetch special detail start new';
export const SALE_CENTER_FETCH_SPECIAL_DETAIL_OK = 'sale center: fetch special detail ok new';
export const SALE_CENTER_FETCH_SPECIAL_DETAIL_FAIL = 'sale center: fetch special detail fail new';
export const SALE_CENTER_FETCH_SPECIAL_DETAIL_TIMEOUT = 'sale center: fetch special detail time out new';
export const SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL = 'sale center: fetch special detail cancel new';

export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START = 'sale center: fetch special promotion detail start new';
export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_OK = 'sale center: fetch special promotion detail ok new';
export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_FAIL = 'sale center: fetch special promotion detail fail new';
export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_TIMEOUT = 'sale center: fetch special promotion detail time out new';
export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL = 'sale center: fetch special promotion detail cancel new';

export const SALE_CENTER_FETCH_CARD_LEVEL_START = 'sale center: fetch card level start new';
export const SALE_CENTER_FETCH_CARD_LEVEL_OK = 'sale center: fetch card level ok new';
export const SALE_CENTER_FETCH_CARD_LEVEL_FAIL = 'sale center: fetch card level fail new';
export const SALE_CENTER_FETCH_CARD_LEVEL_TIMEOUT = 'sale center: fetch card level time out new';
export const SALE_CENTER_FETCH_CARD_LEVEL_CANCEL = 'sale center: fetch card level cancel new';

export const SALE_CENTER_FETCH_USER_INFO_START = 'sale center: fetch user info start new';
export const SALE_CENTER_FETCH_USER_INFO_OK = 'sale center: fetch user info ok new';
export const SALE_CENTER_FETCH_USER_INFO_FAIL = 'sale center: fetch user info fail new';
export const SALE_CENTER_FETCH_USER_INFO_TIMEOUT = 'sale center: fetch user info time out new';
export const SALE_CENTER_FETCH_USER_INFO_CANCEL = 'sale center: fetch user info cancel new';

export const SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_OK = 'sale center: fetch user info delete new';
export const SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_FAIL = 'sale center: fetch user info delete Fail new';

export const SALE_CENTER_QUERY_GROUP_MEMBERS_FILLED = 'sale center: query group memebers filled new'
// 以下是活动列表
export const fetchSpecialPromotionList = opts => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_LIST, payload: opts });
const fetchPromotionListFullfilled = payload => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_OK, payload });
const fetchPromotionListFail = payload => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_FAIL, payload });
export const fetchPromotionListCancel = () => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_CANCEL });
export const fetchPromotionListTimeout = () => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_TIME_OUT });

export const specialPromotionListEpic_NEW = action$ => action$.ofType(SPECIAL_PROMOTION_FETCH_PROMOTION_LIST)
    .mergeMap((action) => {
        return Rx.Observable.from(

            fetch('/api/specialPromotion/queryEvents_NEW', {
                method: 'POST',
                body: JSON.stringify(action.payload.data),
                credentials: 'include',
                headers: {
                    'Accept': '*/*',
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
            .takeUntil(action$.ofType(SPECIAL_PROMOTION_FETCH_PROMOTION_CANCEL))
    });

export const toggleSelectedActivityStateSuccess = (opts) => {
    return {
        type: SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE,
        payload: opts,
    }
};
export const toggleSelectedActivityStateFail = (opts) => {
    return {
        type: SPECIAL_SALE_CENTER_MY_ACTIVITIES_TOGGLE_SELECTED_RECORD_STATE_FAIL,
        payload: opts,
    }
};
export const toggleSelectedActivityStateAC = (opts) => {
    const nextActive = opts.nextActive == '-1' ? '-1' : (opts.record.isActive == '1' ? '0' : '1');
    const params = {
        groupID: opts.record.groupID,
        itemID: opts.record.itemID,
        isActive: nextActive,
    };
    return (dispatch) => {
        fetch('/api/specialPromotion/switchActiveState_NEW', {
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
            if (responseJSON.code === '000') {
                opts.modalTip ? opts.success && opts.success(opts.modalTip) : null;
                dispatch(toggleSelectedActivityStateSuccess({ ...opts, itemID: opts.record.itemID }));
            } else if (responseJSON.code === 'SP00002') {
                opts.modalTip ? opts.warning && opts.warning(responseJSON.message) : null;
                dispatch(toggleSelectedActivityStateFail(opts));
            } else {
                opts.modalTip ? opts.fail && opts.fail(responseJSON.message) : null;
            }
        }).catch((error) => {
            dispatch(toggleSelectedActivityStateFail(opts));
        });
    };
};
export const updateExpiredActiveState = (opts) => {
    return (dispatch) => {
        fetch('/api/specialPromotion/updateExpiredActiveState_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).catch((error) => {
            console.log(error)
        })
    }
}
const deleteSelectedRecordSuccess = (opts) => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_OK,
        payload: opts,
    }
};
const deleteSelectedRecordFail = (opts) => {
    return {
        type: SALE_CENTER_MY_ACTIVITIES_DELETE_RECORD_FAIL,
        payload: opts,
    }
};

export const deleteSelectedRecordAC = (opts) => {
    const params = {
        groupID: opts.groupID,
        itemID: opts.itemID,
    };
    return (dispatch) => {
        fetch('/api/specialPromotion/deleteEvent_NEW', {
            method: 'DELETE',
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
            if (responseJSON.code === '000') {
                opts.success && opts.success();
                dispatch(deleteSelectedRecordSuccess({
                    itemID: opts.itemID,
                }));
            } else {
                opts.fail && opts.fail(responseJSON.resultmsg);
                dispatch(deleteSelectedRecordFail())
            }
        }).catch((error) => {
            dispatch(deleteSelectedRecordFail())
        });
    };
};

// 以下是活动跟踪内容
export const fetchSpecialPromotionDetailAC = opts => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START, payload: opts });
const fetchSpecialPromotionDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_OK, payload });
const fetchSpecialPromotionDetailFail = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_FAIL, payload });
export const fetchSpecialPromotionDetailCancel = () => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL });
export const fetchSpecialPromotionDetailTimeout = () => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_TIMEOUT });

export const specialPromotionDetailEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetch('/api/specialPromotion/queryEventDetail_NEW', {
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
                    throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                })
        )
            .map((response) => {
                return {
                    eventInfo: response,
                }
            })
            .merge(
                Rx.Observable.from(
                    fetch('/api/specialPromotion/queryEventCustomer_NEW', {
                        method: 'POST',
                        body: JSON.stringify({ eventID: action.payload.data.itemID, groupID: action.payload.data.groupID }),
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
                            throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                        }))
                    .map((result) => {
                        return {
                            userInfo: result,
                        }
                    })
            )
            .merge(
                Rx.Observable.from(
                    fetch('/api/shopcenter/crm/groupParamsService_getGroupCardTypeLevels', {
                        method: 'POST',
                        body: generateXWWWFormUrlencodedParams({ _groupID: action.payload.data.groupID }),
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
                            throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                        }))
                    .map((result) => {
                        return {
                            cardInfo: result,
                        }
                    })
            )
            .reduce((curr, val) => {
                return { ...curr, ...val };
            }, {})
            .map((result) => {
                if (result.eventInfo.code === '000' && result.userInfo.code === '000' && result.cardInfo.code === '000') {
                    action.payload.success && action.payload.success(result.eventInfo);
                    return fetchSpecialPromotionDetailFullfilled(result);
                }
                action.payload.fail && action.payload.fail();
                return fetchSpecialPromotionDetailFail(result);
            })
            .timeout(20000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchSpecialPromotionDetailTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL))
    });


// 以下是修改
export const fetchSpecialDetailAC = opts => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_START, payload: opts });
const fetchSpecialDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_OK, payload });
const fetchSpecialDetailFail = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_FAIL, payload });
export const fetchSpecialDetailCancel = () => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL });
export const fetchSpecialDetailTimeout = () => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_TIMEOUT });

export const specialDetailEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_SPECIAL_DETAIL_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetch('/api/specialPromotion/queryEventDetail_NEW', {
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
                    throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                })
        )
            .map((result) => {
                if (result.code === '000') {
                    action.payload.success && action.payload.success(result);
                    return fetchSpecialDetailFullfilled(result);
                }
                action.payload.fail && action.payload.fail();
                return fetchSpecialDetailFail(result);
            })
            .timeout(20000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchSpecialDetailTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL))
    });


// 以下是查询用户列表
export const fetchSpecialUserList = opts => ({ type: SALE_CENTER_FETCH_USER_INFO_START, payload: opts });
const fetchSpecialUserListfilled = payload => ({ type: SALE_CENTER_FETCH_USER_INFO_OK, payload });
const fetchSpecialUserListFail = payload => ({ type: SALE_CENTER_FETCH_USER_INFO_FAIL, payload });
export const fetchSpecialUserListCancel = () => ({ type: SALE_CENTER_FETCH_USER_INFO_CANCEL });
export const fetchSpecialUserListTimeout = () => ({ type: SALE_CENTER_FETCH_USER_INFO_TIMEOUT });

export const specialPromotionUserInfoEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_USER_INFO_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetch('/api/specialPromotion/queryEventCustomer_NEW', {
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
                    action.payload.success && action.payload.success();
                    return fetchSpecialUserListfilled(response);
                }
                action.payload.fail && action.payload.fail(response.message);
                return fetchSpecialUserListFail(response.code);
            })
            .timeout(20000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchSpecialUserListTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_USER_INFO_CANCEL))
    });


// 以下是会员卡等级
export const fetchSpecialCardLevel = opts => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_START, payload: opts });
const fetchSpecialCardLevelfilled = payload => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_OK, payload });
const fetchSpecialCardLevelFail = payload => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_FAIL, payload });
export const fetchSpecialCardLevelCancel = () => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_CANCEL });
export const fetchSpecialCardLevelTimeout = () => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_TIMEOUT });

export const specialPromotionCardLevelEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_CARD_LEVEL_START)
    .mergeMap((action) => {
        const params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/shopcenter/crm/groupParamsService_getGroupCardTypeLevels', {
                method: 'POST',
                body: { _groupID: params._groupID },
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
                    action.payload.success && action.payload.success();
                    return fetchSpecialCardLevelfilled(response);
                }
                action.payload.fail && action.payload.fail(response.message);
                return fetchSpecialCardLevelFail(response.code);
            })
            .timeout(100000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchSpecialCardLevelTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_CARD_LEVEL_CANCEL))
    });
    // 查询会员群体列表
export const queryGroupMembersListfilled = opts => ({ type: SALE_CENTER_QUERY_GROUP_MEMBERS_FILLED, payload: opts });
export const queryGroupMembersList = (opts) => {
    return (dispatch) => {
        fetchData('queryGroupMembersList_dkl', opts, null, { path: 'data' })
            .then((response) => {
                dispatch(queryGroupMembersListfilled(response));
            }).catch((error) => {
                console.log(error);
            });
    };
};
