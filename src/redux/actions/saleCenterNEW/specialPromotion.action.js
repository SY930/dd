

import {
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';

import { message } from 'antd';

import 'rxjs';
import Rx from 'rxjs/Rx';


export const SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO = 'sale center: set special promotion event info new';
export const SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO = 'sale center: set special promotion gift info new';

export const SALE_CENTER_CHECK_BIRTHDAY_EXIST = 'sale center: check birthday exist new';
export const SALE_CENTER_CHECK_BIRTHDAY_SUCCESS = 'sale center: check birthday exist success new';
export const SALE_CENTER_CHECK_BIRTHDAY_EXIST_FAILED = 'sale center: check birthday exist fail new';
export const SALE_CENTER_GET_EXCLUDE_CARDLEVELIDS = 'sale center: get exclude cardLevelIds new';

export const SALE_CENTER_ADD_SPECIAL_PROMOTION_START = 'sale center: add special promotion start new';
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_OK = 'sale center: add special promotion ok new';
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL = 'sale center: add special promotion fail new';
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT = 'sale center: add special promotion time out new';
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL = 'sale center: add special promotion cancel new';

export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START = 'sale center: update special promotion start new';
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK = 'sale center: update special promotion ok new';
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL = 'sale center: update special promotion fail new';
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT = 'sale center: update special promotion time out new';
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL = 'sale center: update special promotion cancel new';
export const SALE_CENTER_RESET_SPECIAL_PROMOTION = 'sale center: update special promotion cancel new';


export const SALE_CENTER_FETCH_GROUP_MEMBER_START = 'sale center: fetch group member start new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_OK = 'sale center: fetch group member ok new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_FAIL = 'sale center: fetch group member fail new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT = 'sale center: fetch group member time out new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL = 'sale center: fetch group member cancel new';
export const SALE_CENTER_FSM_SETTLE_UNIT = 'sale center: query fsm group settle unit new';
export const SALE_CENTER_GET_EXCLUDE_EVENT_LIST = 'sale center: get exclude event list new';

export const saleCenterSetSpecialBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO,
        payload: opts,
    };
};
export const saleCenterSetSpecialGiftInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO,
        payload: opts,
    };
};
export const saleCenterResetDetailInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_SPECIAL_PROMOTION,
        payload: opts,
    };
};
// 检查生日赠送
export const saleCenterCheckExist = (opts) => {
    const constMessage = message.loading('正在检查', 0);
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_CHECK_BIRTHDAY_EXIST,
        });
        let event = '';
        if (opts.eventWay == '51') {
            event = '/api/specialPromotion/checkBirthdayEvent_NEW';
        }
        if (opts.eventWay == '52') {
            event = '/api/specialPromotion/checkSendGift_NEW';
        }
        if (opts.eventWay == '60') {
            event = '/api/specialPromotion/checkEventWayExist_NEW';
        }

        fetch(event, {
            method: 'POST',
            body: JSON.stringify(opts.data),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').includes('application/json')) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            if (responseJSON.code === '000') {
                constMessage();
                opts.success && opts.success(responseJSON);
                dispatch({
                    type: SALE_CENTER_CHECK_BIRTHDAY_SUCCESS,
                    payload: responseJSON,
                });
            }
            // TODO: add handling fail case
        }).catch((error) => {
            constMessage();
            opts.fail && opts.fail();
            dispatch({
                type: SALE_CENTER_CHECK_BIRTHDAY_EXIST_FAILED,
                payload: error,
            })
        })
    }
};

// 获得排除卡id集合 getExcludeCardLevelIds 
export const saleCenterGetExcludeCardLevelIds = (opts) => {
    return (dispatch) => {
        fetch('/api/specialPromotion/getExcludeCardLevelIds_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').includes('application/json')) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            if (responseJSON.code === '000') {
                dispatch({
                    type: SALE_CENTER_GET_EXCLUDE_CARDLEVELIDS,
                    payload: responseJSON,
                });
            }
        }).catch((error) => {
        })
    }
};
// 获取短信结算主体
export const saleCenterQueryFsmGroupSettleUnit = (opts) => {
    return (dispatch) => {
        fetch('/api/specialPromotion/queryFsmGroupSettleUnit_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').includes('application/json')) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            if (responseJSON.code === '000') {
                console.log(responseJSON.accountInfoList)
                dispatch({
                    type: SALE_CENTER_FSM_SETTLE_UNIT,
                    payload: responseJSON.accountInfoList,
                });
            }
        }).catch((error) => {
        })
    }
};
// 获取同时段的唤醒活动
export const saleCenterGetExcludeEventList = (opts) => {
    return (dispatch) => {
        fetch('/api/specialPromotion/getExcludeEventList_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').includes('application/json')) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            if (responseJSON.code === '000') {
                console.log(responseJSON)
                dispatch({
                    type: SALE_CENTER_GET_EXCLUDE_EVENT_LIST,
                    payload: responseJSON,
                });
            }
        }).catch((error) => {
        })
    }
};
export const addSpecialPromotion = opts => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_START, payload: opts });
const addSpecialPromotionSuccess = payload => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_OK, payload });
const addSpecialPromotionFail = payload => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL, payload });
export const addSpecialPromotionCancel = () => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL });
export const addSpecialPromotionTimeout = () => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT });

export const addSpecialPromotionEpic_NEW = action$ => action$.ofType(SALE_CENTER_ADD_SPECIAL_PROMOTION_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetch('/api/specialPromotion/addEvent_NEW', {
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
                    throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                })
        )
            .map((response) => {
                if (response.code === '000') {
                    setTimeout(() => {
                        action.payload.success && action.payload.success();
                    }, 0);
                    return addSpecialPromotionSuccess(response.datas);
                }
                setTimeout(
                    () => {
                        action.payload.fail && action.payload.fail(response.message);
                    }
                );
                return addSpecialPromotionFail(response.code);
            })
            .timeout(40000) // 设置超时时间为20s。
            .catch((err) => {
                setTimeout(() => {
                    action.payload.fail && action.payload.fail('网络超时，请稍后再试');
                }, 0);
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(addSpecialPromotionTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL))
    });


export const updateSpecialPromotion = opts => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START, payload: opts });
const updateSpecialPromotionSuccess = payload => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK, payload });
const updateSpecialPromotionFail = payload => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL, payload });
export const updateSpecialPromotionCancel = () => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL });
export const updateSpecialPromotionTimeout = () => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT });

export const updateSpecialPromotionEpic_NEW = action$ => action$.ofType(SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START)
    .mergeMap((action) => {
        const params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/specialPromotion/updateEvent_NEW', {
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
                if (response.code === '000') {
                    setTimeout(() => {
                        action.payload.success && action.payload.success();
                    }, 0);
                    return updateSpecialPromotionSuccess(response);
                }
                action.payload.fail && action.payload.fail(response.message);
                return updateSpecialPromotionFail(response.code);
            })
            .timeout(40000) // 设置超时时间为20s。
            .catch((err) => {
                setTimeout(() => {
                    action.payload.fail && action.payload.fail('网络超时，请稍后再试');
                }, 0);
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(updateSpecialPromotionTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL))
    });

// 查询会员群体
export const fetchSpecialGroupMember = opts => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_START, payload: opts });
const fetchSpecialGroupMemberfilled = payload => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_OK, payload });
const fetchSpecialGroupMemberFail = payload => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_FAIL, payload });
export const fetchSpecialGroupMemberCancel = () => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL });
export const fetchSpecialGroupMemberTimeout = () => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT });

export const specialPromotionGroupMemberEpic_NEW = action$ => action$.ofType(SALE_CENTER_FETCH_GROUP_MEMBER_START)
    .mergeMap((action) => {
        const params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/crm/getGroupCardTypeLevels.ajax', {
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
                    return fetchSpecialGroupMemberfilled(response);
                }
                action.payload.fail && action.payload.fail(response.message);
                return fetchSpecialGroupMemberFail(response.code);
            })
            .timeout(100000)
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return Rx.Observable.of(fetchSpecialGroupMemberTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL))
    });
