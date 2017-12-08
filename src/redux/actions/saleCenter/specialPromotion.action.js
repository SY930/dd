

import {
    generateXWWWFormUrlencodedParams
} from '../../../helpers/apiConfig';

import {message} from 'antd';

import 'rxjs';
import Rx from 'rxjs/Rx';



export const SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO = "sale center: set special promotion event info";
export const SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO = "sale center: set special promotion gift info";

export const SALE_CENTER_CHECK_BIRTHDAY_EXIST = "sale center: check birthday exist";
export const SALE_CENTER_CHECK_BIRTHDAY_SUCCESS = "sale center: check birthday exist success";
export const SALE_CENTER_CHECK_BIRTHDAY_EXIST_FAILED = "sale center: check birthday exist fail";

export const SALE_CENTER_ADD_SPECIAL_PROMOTION_START = "sale center: add special promotion start";
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_OK = "sale center: add special promotion ok";
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL = "sale center: add special promotion fail";
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT = "sale center: add special promotion time out";
export const SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL = "sale center: add special promotion cancel";

export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START = "sale center: update special promotion start";
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK = "sale center: update special promotion ok";
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL = "sale center: update special promotion fail";
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT = "sale center: update special promotion time out";
export const SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL = "sale center: update special promotion cancel";
export const SALE_CENTER_RESET_SPECIAL_PROMOTION = "sale center: update special promotion cancel";


export const SALE_CENTER_FETCH_GROUP_MEMBER_START = "sale center: fetch group member start";
export const SALE_CENTER_FETCH_GROUP_MEMBER_OK = "sale center: fetch group member ok";
export const SALE_CENTER_FETCH_GROUP_MEMBER_FAIL = "sale center: fetch group member fail";
export const SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT = "sale center: fetch group member time out";
export const SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL = "sale center: fetch group member cancel";

export const saleCenterSetSpecialBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO,
        payload: opts
    };
};
export const saleCenterSetSpecialGiftInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO,
        payload: opts
    };
};
export const saleCenterResetDetailInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_SPECIAL_PROMOTION,
        payload: opts
    };
};
//检查生日赠送
export const saleCenterCheckExist = (opts) => {

    let constMessage = message.loading('正在检查', 0);
    return dispatch => {
        dispatch({
            type: SALE_CENTER_CHECK_BIRTHDAY_EXIST,
        });
        let event = '';
        if(opts.eventWay == '51'){
            event = "/api/specialPromotion/checkBirthdayEvent";
        }
        if(opts.eventWay == '52'){
            event = "/api/specialPromotion/checkSendGift";
        }
        fetch(event, {
            method: "POST",
            body: JSON.stringify(opts.data),
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get("content-type").includes('application/json')) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            if(responseJSON.code === '000'){
                constMessage();
                opts.success && opts.success(responseJSON);
                dispatch({
                    type: SALE_CENTER_CHECK_BIRTHDAY_SUCCESS,
                    payload: responseJSON
                });
            }
            // TODO: add handling fail case
        }).catch((error) => {
            constMessage();
            opts.fail && opts.fail();
            dispatch({
                type: SALE_CENTER_CHECK_BIRTHDAY_EXIST_FAILED,
                payload: error
            })
        })

    }
};

export const addSpecialPromotion = opts => ({type: SALE_CENTER_ADD_SPECIAL_PROMOTION_START, payload: opts});
const addSpecialPromotionSuccess = payload => ({type: SALE_CENTER_ADD_SPECIAL_PROMOTION_OK, payload});
const addSpecialPromotionFail = payload => ({type: SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL, payload});
export const addSpecialPromotionCancel = ()=>({type: SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL});
export const addSpecialPromotionTimeout = ()=>({type: SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT});

export const addSpecialPromotionEpic = action$ => action$.ofType(SALE_CENTER_ADD_SPECIAL_PROMOTION_START)
    .mergeMap(action => {
        return Rx.Observable.from(
            fetch('/api/specialPromotion/addEvent', {
                method: "POST",
                body: JSON.stringify(action.payload.data),
                credentials: 'include',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {

                        if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                            return response.json();
                        } else {
                            return response.text();
                        }
                    } else {
                        return Promise.reject(new Error(response.statusText));
                    }
                })
                .catch( (error) => {
                    throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                })
        )
        .map(response => {
            if (response.code === '000') {
                setTimeout(() => {
                    action.payload.success && action.payload.success();
                }, 0);
                return addSpecialPromotionSuccess(response.datas);
            } else {
                setTimeout(
                    ()=>{
                        action.payload.fail && action.payload.fail(response.message);
                    }
                );
                return addSpecialPromotionFail(response.code);
            }
        })
        .timeout(40000) // 设置超时时间为20s。
        .catch((err) => {
            setTimeout(() => {
                action.payload.fail && action.payload.fail("网络超时，请稍后再试");

            }, 0);
            if(err.name === "TimeoutError") {
                return Rx.Observable.of(addSpecialPromotionTimeout());
            }
            return Rx.Observable.empty();
        })
        .takeUntil(action$.ofType(SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL))
    });


export const updateSpecialPromotion = opts => ({type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START, payload: opts});
const updateSpecialPromotionSuccess = payload => ({type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK, payload});
const updateSpecialPromotionFail = payload => ({type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL, payload});
export const updateSpecialPromotionCancel = ()=>({type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL});
export const updateSpecialPromotionTimeout = ()=>({type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT});

export const updateSpecialPromotionEpic = action$ => action$.ofType(SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START)
    .mergeMap(action => {
        let params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/api/specialPromotion/updateEvent', {
                method: "POST",
                body: JSON.stringify(action.payload.data),
                credentials: 'include',
                headers: {
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {

                        if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                            return response.json();
                        } else {
                            return response.text();
                        }
                    } else {
                        return Promise.reject(new Error(response.statusText));
                    }
                })
                .catch( (error) => {
                    throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
                })
        )
        .map(response => {
            if (response.code === '000') {
                setTimeout(() => {
                    action.payload.success && action.payload.success();
                }, 0);
                return updateSpecialPromotionSuccess(response);
            } else {
                action.payload.fail && action.payload.fail(response.message);
                return updateSpecialPromotionFail(response.code);
            }
        })
        .timeout(40000) // 设置超时时间为20s。
        .catch((err) => {
            setTimeout(() => {
                action.payload.fail && action.payload.fail("网络超时，请稍后再试");

            }, 0);
            if(err.name === "TimeoutError") {
                return Rx.Observable.of(updateSpecialPromotionTimeout());
            }
            return Rx.Observable.empty();
        })
        .takeUntil(action$.ofType(SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL))
    });

//查询会员群体
export const fetchSpecialGroupMember = opts => ({type: SALE_CENTER_FETCH_GROUP_MEMBER_START, payload: opts});
const fetchSpecialGroupMemberfilled = payload => ({type: SALE_CENTER_FETCH_GROUP_MEMBER_OK, payload});
const fetchSpecialGroupMemberFail = payload => ({type: SALE_CENTER_FETCH_GROUP_MEMBER_FAIL, payload});
export const fetchSpecialGroupMemberCancel = ()=>({type: SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL});
export const fetchSpecialGroupMemberTimeout = ()=>({type: SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT});

export const specialPromotionGroupMemberEpic = action$ => action$.ofType(SALE_CENTER_FETCH_GROUP_MEMBER_START)
    .mergeMap(action => {
        let params = generateXWWWFormUrlencodedParams(action.payload.data);
        return Rx.Observable.from(
            fetch('/crm/getGroupCardTypeLevels.ajax', {
                method: "POST",
                body: { _groupID: params._groupID},
                credentials: 'include',
                headers: {
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                }
            })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                            return response.json();
                        } else {
                            return response.text();
                        }
                    } else {
                        return Promise.reject(new Error(response.statusText));
                    }
                })
                .catch( (error) => {
                    throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
                })
        )
            .map(response => {
                if (response.code === '000') {
                    action.payload.success && action.payload.success();
                    return fetchSpecialGroupMemberfilled(response);
                } else {
                    action.payload.fail && action.payload.fail(response.message);
                    return fetchSpecialGroupMemberFail(response.code);
                }
            })
            .timeout(100000)
            .catch((err) => {
                if(err.name === "TimeoutError") {
                    return Rx.Observable.of(fetchSpecialGroupMemberTimeout());
                }
                return Rx.Observable.empty();
            })
            .takeUntil(action$.ofType(SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL))
    });
