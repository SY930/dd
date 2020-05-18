

import {
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';

import { message } from 'antd';

import 'rxjs';
import axios from 'axios'
import { fetchFilterShopsSuccess } from './promotionBasicInfo.action'
import {
    axiosData,
    getAccountInfo,
} from "../../../helpers/util";
import { getStore } from '@hualala/platform-base/lib';


export const SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO = 'sale center: set special promotion event info new';
export const SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO = 'sale center: set special promotion gift info new';
export const SALE_CENTER_SET_SPECIAL_PROMOTION_RECOMMEND_SETTINGS_INFO = 'sale center: set special promotion recommend settings info new';

export const SALE_CENTER_CHECK_BIRTHDAY_EXIST = 'sale center: check birthday exist new';
export const SALE_CENTER_CHECK_BIRTHDAY_SUCCESS = 'sale center: check birthday exist success new';
export const SALE_CENTER_CHECK_BIRTHDAY_EXIST_FAILED = 'sale center: check birthday exist fail new';
export const SALE_CENTER_GET_EXCLUDE_CARDLEVELIDS = 'sale center: get exclude cardLevelIds new';
export const SALE_CENTER_GET_EXCLUDE_CARD_TYPE_AND_SHOP = 'sale center: sale_center_get_exclude_card_type_and_shop';
export const SALE_CENTER_SAVE_CURRENT_CAN_USE_SHOP = 'sale center: sale_center_save_current_can_use_shop';

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
export const SALE_CENTER_RESET_SPECIAL_PROMOTION = 'sale center: update special promotion reset new';


export const SALE_CENTER_FETCH_GROUP_MEMBER_START = 'sale center: fetch group member start new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_OK = 'sale center: fetch group member ok new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_FAIL = 'sale center: fetch group member fail new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT = 'sale center: fetch group member time out new';
export const SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL = 'sale center: fetch group member cancel new';
export const SALE_CENTER_FSM_SETTLE_UNIT = 'sale center: query fsm group settle unit new';
export const SALE_CENTER_FSM_EQUITY_UNIT = 'sale center: query fsm group equity unit new';
export const SALE_CENTER_QUERY_SMS_SIGN_SUCCESS = 'sale center: SALE_CENTER_QUERY_SMS_SIGN_SUCCESS';
export const SALE_CENTER_GET_EXCLUDE_EVENT_LIST = 'sale center: get exclude event list new';
export const SALE_CENTER_QUERY_ONLINE_RESTAURANT_SHOPS_STATUS = 'sale center: sale_center_query_online_restaurant_shops_status';
export const SALE_CENTER_QUERY_GROUP_CRM_CUSTOMER_AMOUNT = 'sale center: SALE_CENTER_QUERY_GROUP_CRM_CUSTOMER_AMOUNT';

export const SALE_CENTER_CARDGROUPID = 'sale center: set special promotion event info new222';

export const saleCenterSetSpecialBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO,
        payload: opts,
    };
};
export const saleCenterSetSpecialBasicInfoCardGroupID = (opts) => {
    return {
        type: SALE_CENTER_CARDGROUPID,
        payload: opts,
    };
};
export const saleCenterQueryOnlineRestaurantStatus = (opts) => {
    return {
        type: SALE_CENTER_QUERY_ONLINE_RESTAURANT_SHOPS_STATUS,
        payload: opts,
    };
};
export const saleCenterSetSpecialGiftInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO,
        payload: opts,
    };
};
export const saleCenterSetSpecialRecommendSettingsInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_SPECIAL_PROMOTION_RECOMMEND_SETTINGS_INFO,
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
    if (!opts.eventWay) {
        return (dispatch) => {};
    }
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
// 获取线上餐厅送礼不可选择的卡类型和卡类型对应的适用店铺
export const getEventExcludeCardTypes = (opts) => {
    if (!opts.eventWay) {
        return (dispatch) => {};
    }
    return (dispatch) => {
        axiosData('/specialPromotion/getEventExcludeCardTypes.ajax', opts, {}, {path: ''}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then(({ excludeCardTypeIDs = [], excludeCardTypeShops = [] }) => {
                dispatch({
                    type: SALE_CENTER_GET_EXCLUDE_CARD_TYPE_AND_SHOP,
                    payload: {
                        excludeCardTypeIDs: Array.isArray(excludeCardTypeIDs) ? excludeCardTypeIDs : [],
                        excludeCardTypeShops: Array.isArray(excludeCardTypeShops) ? excludeCardTypeShops : []
                    },
                });
            })
    }
}
/**
 * 查询集团所有会员的数量
 */
export const getGroupCRMCustomAmount = () => {
    return (dispatch) => {
        axiosData('/specialPromotion/queryCrmCustomerCount.ajax', {}, {needThrow: true}, {path: ''}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then(res => {
                dispatch({
                    type: SALE_CENTER_QUERY_GROUP_CRM_CUSTOMER_AMOUNT,
                    payload: {
                        customerCount: res.customerCount
                    },
                });
            })
    }
}
// 计算出当前线上餐厅送礼的可选活动 存到redux
export const saveCurrentCanUseShops = (arr) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_SAVE_CURRENT_CAN_USE_SHOP,
            payload: arr,
        });
    }
}
// 获取短信权益账户
export const queryFsmGroupEquityAccount = () => {
    return (dispatch) => {
        axiosData(
            '/specialPromotion/queryFsmGroupEquityAccount.ajax',
            { accountID: getAccountInfo().accountID },
            {},
            {path: 'accountInfoList'},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
        .then(res => {
            dispatch({
                type: SALE_CENTER_FSM_EQUITY_UNIT,
                payload: Array.isArray(res) ? res : [],
            });
        })
    }
}
/**
 * 获取短信签名
 */
export const querySMSSignitureList = () => {
    return (dispatch) => {
        return axiosData(
            `/promotion/message/query.ajax?groupID=${getStore().getState().user.getIn(['accountInfo', 'groupID'])}`,
            {},
            null,
            {path: 'records'},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
        .then((records = []) => {
            dispatch({
                type: SALE_CENTER_QUERY_SMS_SIGN_SUCCESS,
                payload: Array.isArray(records) ? records : [],
            });
        })
        .catch((error) => {
            console.log(error)
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
                if (Array.isArray(responseJSON.accountInfoList)) {
                    // 应后端要求 余额balance置为0
                    responseJSON.accountInfoList && responseJSON.accountInfoList.forEach(item => item.balance = 0);
                    dispatch({
                        type: SALE_CENTER_FSM_SETTLE_UNIT,
                        payload: responseJSON.accountInfoList,
                    });
                }
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
                dispatch({
                    type: SALE_CENTER_GET_EXCLUDE_EVENT_LIST,
                    payload: responseJSON,
                });
            }
        }).catch((error) => {
        })
    }
};
// export const addSpecialPromotion = opts => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_START, payload: opts });
const addSpecialPromotionSuccess = payload => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_OK, payload });
const addSpecialPromotionFail = payload => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL, payload });
export const addSpecialPromotionCancel = () => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL });
export const addSpecialPromotionTimeout = () => ({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT });

export const addSpecialPromotion = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_ADD_SPECIAL_PROMOTION_START, payload: opts });
        fetch('/api/specialPromotion/addEvent_NEW', {
            method: 'POST',
            body: JSON.stringify(opts.data),
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
            .then((response) => {
                if (response.code === '000') {
                    setTimeout(() => {
                        opts.success && opts.success();
                    }, 0);
                    return dispatch(addSpecialPromotionSuccess(response.datas));
                }
                setTimeout(
                    () => {
                        opts.fail && opts.fail(response.message);
                    }
                );
                return dispatch(addSpecialPromotionFail(response.code));
            }, err => {
                if (err.name === 'TimeoutError') {
                    opts.fail && opts.fail('网络超时，请稍后再试');
                    return dispatch(addSpecialPromotionTimeout());
                }
                return dispatch(addSpecialPromotionFail(err));
            })
            .catch((err) => {
            })
    }
}

const updateSpecialPromotionSuccess = payload => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK, payload });
const updateSpecialPromotionFail = payload => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL, payload });
export const updateSpecialPromotionTimeout = () => ({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT });

export const updateSpecialPromotion = opts => {
    return dispatch => {
        // 微信推送mpID，在编辑时清空
        const { event, ...rest } = opts.data;
        event.pushMessageMpID = '';
        dispatch({ type: SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START, payload: opts });
        fetch('/api/specialPromotion/updateEvent_NEW', {
            method: 'POST',
            body: JSON.stringify({ event, ...rest }),
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

            .then((response) => {
                if (response.code === '000') {
                    setTimeout(() => {
                        opts.success && opts.success();
                    }, 0);
                    return dispatch(updateSpecialPromotionSuccess(response));
                }
                setTimeout(
                    () => {
                        opts.fail && opts.fail(response.message);
                    }
                );
                return dispatch(updateSpecialPromotionFail(response.code));
            })
            .catch((err) => {
                setTimeout(() => {
                    opts.fail && opts.fail('网络超时，请稍后再试');
                }, 0);
                if (err.name === 'TimeoutError') {
                    return dispatch(updateSpecialPromotionTimeout());
                }
            })
    }
}
// 查询会员群体
// export const fetchSpecialGroupMember = opts => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_START, payload: opts });
const fetchSpecialGroupMemberfilled = payload => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_OK, payload });
const fetchSpecialGroupMemberFail = payload => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_FAIL, payload });
export const fetchSpecialGroupMemberCancel = () => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_CANCEL });
export const fetchSpecialGroupMemberTimeout = () => ({ type: SALE_CENTER_FETCH_GROUP_MEMBER_TIMEOUT });

export const fetchSpecialGroupMember = opts => {
    return dispatch => {
        dispatch({ type: SALE_CENTER_FETCH_GROUP_MEMBER_START, payload: opts });
        const params = generateXWWWFormUrlencodedParams(opts.data);
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
            .then((response) => {
                if (response.code === '000') {
                    opts.success && opts.success();
                    return dispatch(fetchSpecialGroupMemberfilled(response));
                }
                opts.fail && opts.fail(response.message);
                return dispatch(fetchSpecialGroupMemberFail(response.code));
            }, err => {
                if (err.name === 'TimeoutError') {
                    return dispatch(fetchSpecialGroupMemberTimeout());
                }
                return dispatch(fetchSpecialGroupMemberFail(err));
            })
            .catch((err) => {

            })
    }
};

// 查询已占用店铺for评价返礼64
export const saleCenterGetShopOfEventByDate = opts => {
    return dispatch => {
        return axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            method: '/specialPromotion/getShopOfEventByDate.ajax',
            type: 'post',
            data: opts,
        })
            .then((responseJSON) => {
                if (responseJSON.code === '000') {
                    // 特色和基础营销共用shop组件和排除逻辑，需要转化数据对象来符合已写的逻辑
                    dispatch(fetchFilterShopsSuccess({
                        allShopSet: responseJSON.allShopCheck,
                        shopList: responseJSON.shopIDList ? responseJSON.shopIDList.map(shopId => String(shopId)) : []
                    }));
                    return Promise.resolve(responseJSON.allShopCheck)
                } else {
                    return Promise.reject(responseJSON.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
};
