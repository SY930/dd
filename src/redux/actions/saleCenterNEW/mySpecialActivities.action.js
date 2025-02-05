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
    axiosData,
    parseResponseJson,
    doRedirect
} from '../../../helpers/util';

import 'rxjs';
import { Modal } from 'antd';
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
export const SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_SUCCESS_ONLY = 'sale center: sale_center_fetch_special_promotion_detail_success_only';

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

export const SALE_CENTER_QUERY_GROUP_MEMBERS_FILLED = 'sale center: query group memebers filled new';
export const GHT_TAGLIST_SUCCESS = 'sale center: get tagList'
export const GHT_TAGGROUPLIST_SUCCESS = 'sale center: get tagRroupList'
export const SALE_CENTER_GET_CRM_SAVE_MONEY_SET_SUCCESS = 'sale center: SALE_CENTER_GET_CRM_SAVE_MONEY_SET_SUCCESS';
export const SALE_CENTER_GET_CRM_RIGHT_PACKAGE_SET_SUCCESS = 'sale center: SALE_CENTER_GET_CRM_RIGHT_PACKAGE_SET_SUCCESS';
export const SALE_CENTER_UPDATE_GIFTS_LEVEL = 'sale center: lottery gifts level'
export const SALE_CENTER_GET_CRM_BENEFIT_CARD_SUCCESS = 'sale center: SALE_CENTER_GET_CRM_BENEFIT_CARD_SUCCESS'
// 以下是活动列表
// export const fetchSpecialPromotionList = opts => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_LIST, payload: opts });
const fetchPromotionListFullfilled = payload => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_OK, payload });
export const UpdateGiftLevel = payload => ({ type: SALE_CENTER_UPDATE_GIFTS_LEVEL, payload});
const fetchPromotionListFail = payload => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_FAIL, payload });
export const fetchPromotionListCancel = () => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_CANCEL });
export const fetchPromotionListTimeout = () => ({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_TIME_OUT });

export const fetchSpecialPromotionList = (opts) => {
    return dispatch => {
        opts.start && opts.start();
        dispatch({ type: SPECIAL_PROMOTION_FETCH_PROMOTION_LIST, payload: opts });
        // opts.data.createScenes = '0'
        fetch('/api/specialPromotion/queryEvents_NEW', {
            method: 'POST',
            body: JSON.stringify(opts.data),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                opts.end && opts.end();
                if (response.status >= 200 && response.status < 300) {
                    if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                        return response.json();
                    }
                    return response.text();
                }
                return Promise.reject(new Error(response.statusText));
            })
            .catch((error) => {
                opts.end && opts.end();
                throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
            })
            .then((response) => {
                const { redirect, success, code, msg } = parseResponseJson(response, '000');
                if (!success && redirect) {
                    Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: `${msg}`,
                    });
                    redirect && window.setTimeout(() => doRedirect(), 1500);
                } else if (response.code === '000') {
                    return dispatch(fetchPromotionListFullfilled(response));
                }else {
                    opts.fail && opts.fail(response.message);
                    return dispatch(fetchPromotionListFail(response.code));
                }
            }, (err) => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchPromotionListTimeout());
                }
                return dispatch(fetchPromotionListFail(err));
            })
            .catch(err => {

            })
    }
}

export const fetchSpecialPromotionDetailData = (opts) => {
    return dispatch => {
         let url = '/specialPromotion/queryEventDetail.ajax';
         if(opts.eventWay == 30 || opts.eventWay == 78 || opts.eventWay == 91){
            url = '/specialPromotion/queryEventTrackInfo.ajax'
         }
         opts.data.statGiftRecovery = true;//统计礼品回收: false-不统计, true-统计 默认不统计
        axiosData(url, opts.data, {needThrow: true}, { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW')
                .then((res) => {
                    return dispatch({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_SUCCESS_ONLY, payload: res });
                })
    }
}


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
        groupID: opts.groupID,
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
                opts.fail && opts.fail(responseJSON.resultmsg || responseJSON.message);
                dispatch(deleteSelectedRecordFail())
            }
        }).catch((error) => {
            dispatch(deleteSelectedRecordFail())
        });
    };
};

// 以下是活动跟踪内容
// export const fetchSpecialPromotionDetailAC = opts => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START, payload: opts });
const fetchSpecialPromotionDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_OK, payload });
const fetchSpecialPromotionDetailFail = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_FAIL, payload });
export const fetchSpecialPromotionDetailCancel = () => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_CANCEL });
export const fetchSpecialPromotionDetailTimeout = () => ({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_TIMEOUT });

export const fetchSpecialPromotionDetailAC = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_SPECIAL_PROMOTION_DETAIL_START, payload: opts });
        const queryEventDetail = param => {
            let url = '/specialPromotion/queryEventDetail.ajax';
            if(opts.eventWay == 30 || opts.eventWay == 78 || opts.eventWay == 91){
                url = '/specialPromotion/queryEventTrackInfo.ajax'
            }
            param.data.statGiftRecovery = true;//统计礼品回收: false-不统计, true-统计 默认不统计
            return axiosData(url, param.data, {needThrow: true}, { path: '' },
                'HTTP_SERVICE_URL_PROMOTION_NEW')
                    .then((res) => {
                        return { eventInfo: res }
                    })
        }
        const queryEventCustomer = param => {
            return fetch('/api/specialPromotion/queryEventCustomer_NEW', {
                method: 'POST',
                body: JSON.stringify({ eventID: param.data.itemID, groupID: param.data.groupID }),
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
                    return {
                        userInfo: response,
                    }
                })
        }
        Promise.all([queryEventDetail(opts), queryEventCustomer(opts)])
            .then((res) => {
                const result = res.reduce((curr, val) => {
                    return { ...curr, ...val };
                }, {});
                if (parseResponseJson(result.eventInfo, '000').redirect || parseResponseJson(result.userInfo, '000').redirect) {
                    Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: `会话失效,请重新登录`,
                    });
                    window.setTimeout(() => doRedirect(), 1500);
                }else if (result.eventInfo.code === '000' && result.userInfo.code === '000') {
                    opts.success && opts.success(result.eventInfo);
                    return dispatch(fetchSpecialPromotionDetailFullfilled(result));
                }else {
                    opts.fail && opts.fail();
                    return dispatch(fetchSpecialPromotionDetailFail(result));
                }
            })
            .catch((err) => {
                console.log(err)
                opts.fail();
                return dispatch(fetchSpecialPromotionDetailFail(err));
            })
    }
}
// 以下是修改
// export const fetchSpecialDetailAC = opts => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_START, payload: opts });
const fetchSpecialDetailFullfilled = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_OK, payload });
const fetchSpecialDetailFail = payload => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_FAIL, payload });
export const fetchSpecialDetailCancel = () => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_CANCEL });
export const fetchSpecialDetailTimeout = () => ({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_TIMEOUT });

export const fetchSpecialDetailAC = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_SPECIAL_DETAIL_START, payload: opts });
        fetch('/api/specialPromotion/queryEventDetail_NEW', {
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
            .catch((error) => {
                throw new Error(`fetchSpecialPromotionDetailAC cause problem with msg ${error}`);
            })
            .then((result) => {
                const { redirect, success, code, msg } = parseResponseJson(result, '000');
                if (!success && redirect) {
                    Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: `${msg}`,
                    });
                    redirect && window.setTimeout(() => doRedirect(), 1500);
                } else if (result.code === '000') {
                    opts.success && opts.success(result);
                    return dispatch(fetchSpecialDetailFullfilled(result));
                }else {
                    opts.fail && opts.fail();
                    return dispatch(fetchSpecialDetailFail(result));
                }
            }, (err) => { // add REAL backend error handler @author: wuhao
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchSpecialDetailTimeout());
                }
                return dispatch(fetchSpecialDetailFail(err));
            })
            .catch(err => {
                // empty catch for possible render error
            })
    }
}

// 以下是查询用户列表
// export const fetchSpecialUserList = opts => ({ type: SALE_CENTER_FETCH_USER_INFO_START, payload: opts });
const fetchSpecialUserListfilled = payload => ({ type: SALE_CENTER_FETCH_USER_INFO_OK, payload });
const fetchSpecialUserListFail = payload => ({ type: SALE_CENTER_FETCH_USER_INFO_FAIL, payload });
export const fetchSpecialUserListCancel = () => ({ type: SALE_CENTER_FETCH_USER_INFO_CANCEL });
export const fetchSpecialUserListTimeout = () => ({ type: SALE_CENTER_FETCH_USER_INFO_TIMEOUT });

export const fetchSpecialUserList = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_USER_INFO_START, payload: opts });
        fetch('/api/specialPromotion/queryEventCustomer_NEW', {
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
            .catch((error) => {
                throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
            })
            .then((response) => {
                if (response.code === '000') {
                    opts.success && opts.success();
                    return dispatch(fetchSpecialUserListfilled(response));
                }
                opts.fail && opts.fail(response.message);
                return dispatch(fetchSpecialUserListFail(response.code));
            }, err => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchSpecialUserListTimeout());
                }
                return dispatch(fetchSpecialUserListFail(err));
            })
            .catch((err) => {

            })
    }
}


// 以下是会员卡等级
// export const fetchSpecialCardLevel = opts => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_START, payload: opts });
const fetchSpecialCardLevelfilled = payload => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_OK, payload });
const fetchSpecialCardLevelFail = payload => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_FAIL, payload });
export const fetchSpecialCardLevelCancel = () => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_CANCEL });
export const fetchSpecialCardLevelTimeout = () => ({ type: SALE_CENTER_FETCH_CARD_LEVEL_TIMEOUT });

export const fetchSpecialCardLevel = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_CARD_LEVEL_START, payload: opts });
        fetchData('getSetUsedLevels_dkl', { ...opts.data }, null, {
            path: '',
        })
            .then((response) => {
                if (response.code === '000') {
                    opts.success && opts.success();
                    (response.data.groupCardTypeList || []).forEach((cat) => {
                        (cat.cardTypeLevelList || []).forEach((level) => {
                            level.cardTypeName = cat.cardTypeName;
                            level.cardLevelName = `${cat.cardTypeName} - ${level.cardLevelName}`;
                        })
                    })
                    return dispatch(fetchSpecialCardLevelfilled(response));
                }
                opts.fail && opts.fail(response.message);
                return dispatch(fetchSpecialCardLevelFail(response.code));
            })
            .catch((err) => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchSpecialCardLevelTimeout());
                }
            })
    }
}
// /crm/groupParamsService_getGroupShopsCardTypeLevel.ajax可接受shopIDs的接口
export const fetchShopCardLevel = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_CARD_LEVEL_START, payload: opts });
        axiosData('/crm/groupParamsService_getGroupShopCardTypeLevels.ajax', { ...opts.data }, null, {
            // axiosData('/crm/groupParamsService_getGroupShopsCardTypeLevel.ajax', { ...opts.data }, null, {
            path: '',
        })
            .then((response) => {
                if (response.code === '000') {
                    opts.success && opts.success();
                    (response.data.groupCardTypeList || []).forEach((cat) => {
                        (cat.cardTypeLevelList || []).forEach((level) => {
                            level.cardTypeName = cat.cardTypeName;
                            level.cardLevelName = `${cat.cardTypeName} - ${level.cardLevelName}`;
                        })
                    })
                    return dispatch(fetchSpecialCardLevelfilled(response));
                }
                opts.fail && opts.fail(response.message);
                return dispatch(fetchSpecialCardLevelFail(response.code));
            }, err => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchSpecialCardLevelTimeout());
                }
                return dispatch(fetchSpecialCardLevelFail(err));
            })
            .catch((err) => {

            })
    }
}
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
// 获取会员标签
export const queryTagDetailList = (opt) =>{
    return (dispatch) =>{
        axiosData('/tag/tagManagementService_queryTagDetailList.ajax', opt, {
          needThrow: true
        }, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: GHT_TAGLIST_SUCCESS,
                    payload: res.tagList
                })
            })
            .catch(err => {
                // console.log(err);
            })
    }
}
// 获取会员标签组
export const queryAllTagGroupList = (opt) =>{
    return (dispatch) =>{
        axiosData('/tag/tagManagementService_queryAllTagGroupList.ajax', opt, null, { path: 'data' })
            .then((res) => {
                const { code, response } = res
                if(code === '000') {
                    dispatch({
                        type: GHT_TAGGROUPLIST_SUCCESS,
                        payload: response.tagGroupList
                    })
                }
            })
            .catch(err => {
                // console.log(err);
            })
    }
}

/**
 * 查询所有储值套餐
 */
export const queryAllSaveMoneySet = () => {
    return (dispatch) =>{
        axiosData(
            '/crm/crmSaveMoneySetService_queryCrmSaveMoneySets.ajax',
            {sourceType: 60},
            null,
            { path: 'data.payCrmSaveMoneySetList' })
            .then(data => {
                dispatch({
                    type: SALE_CENTER_GET_CRM_SAVE_MONEY_SET_SUCCESS,
                    payload: Array.isArray(data) ? data.filter(item => item.saveMoneySetType != 2) : [],
                })
                dispatch({
                    type: SALE_CENTER_GET_CRM_RIGHT_PACKAGE_SET_SUCCESS,
                    payload: Array.isArray(data) ? data.filter(item => item.saveMoneySetType == 2) : [],
                })
            })
            .catch(err => {
                // oops
            })
    }
}

/**
 * 查询所有权益卡列表
 */
export const queryAllBenefitCard = () => {
    return (dispatch) => {
        axiosData(
            "/benefit/CrmBenefitCardService_queryBenefitCardScheme.ajax",
            { pageNo: 1, pageSize: 10000, onSale: 1, isActive: 1 },
            null,
            { path: "data.benefitCardBaseInfoList" }
        )
            .then((data) => {
                dispatch({
                    type: SALE_CENTER_GET_CRM_BENEFIT_CARD_SUCCESS,
                    payload: Array.isArray(data)
                        ? data
                        : [],
                });
            })
            .catch((err) => {
                // oops
            });
    };
};
