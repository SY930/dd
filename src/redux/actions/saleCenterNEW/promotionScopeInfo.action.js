/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-07T15:28:45+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.action.js
* @Last modified by:   xf
* @Last modified time: 2017-03-18T08:50:55+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO = 'sale center: fetch promotion scope info new';
export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS = 'sale center: fetch promotion scope info success new';
export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED = 'sale center: fetch promotion scope info failed new';

export const SALE_CENTER_GET_SHOP_SCHEMA = 'sale center:  get shop schema new';
export const SALE_CENTER_GET_SHOP_SCHEMA_SUCCESS = 'sale center: get shop schema success new';
export const SALE_CENTER_GET_SHOP_SCHEMA_FAILED = 'sale center: get shop schema failed new';
export const SALE_CENTER_RESET_SHOP_SCHEMA = 'sale center : reset shop schema new';


export const SALE_CENTER_SET_ACTIVITY_SCOPE_INFO = 'sale center : set promotion scope info new';
export const SALE_CENTER_GET_SHOP_BY_PARAM = 'sale center : get shop by param success new';
export const SALE_CENTER_RESET_SCOPE_INFO = 'sale center : reset scope info new';


import { message } from 'antd';
import { axios } from '@hualala/platform-base';

export const SCENARIOS = Object.freeze([{
    value: '0',
    key: 'All',
    name: '全部',
},
{
    value: '1',
    key: 'POS',
    name: '云店',
},
{
    value: '2',
    key: 'WECHAT',
    name: '微信',
},
    {
    value: '3',
    key: 'YST',
    name: '饮食通',
},
]);


import {
    fetchData,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/util';

export const fetchPromotionScopeInfo = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO,
        });
        const params = generateXWWWFormUrlencodedParams(opts);

        fetch('/api/shopcenter/shop/schema', {
            method: 'POST',
            body: params,
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
            return Promise.reject(new Error(response.statusText));
        }).then((responseJSON) => {
            if (responseJSON.resultcode === '000') {
                dispatch(fetchPromotionScopeInfoSuccess(responseJSON.data));
            } else {
                message.error(`店铺、品牌信息获取失败 ${responseJSON.resultmsg}`);
                dispatch(fetchPromotionScopeInfoFailed());
            }
        }).catch((error) => {
            dispatch(fetchPromotionScopeInfoFailed());
        });
    };
};

export const getPromotionShopSchema = (params) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_GET_SHOP_SCHEMA,
        });

        fetch('/api/shopapi/schema', {
            method: 'POST',
            body: JSON.stringify(params),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            }}).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText));
        }).then((responseJSON) => {
            if (responseJSON.code === '000') {
                dispatch(getPromotionShopSchemaSuccess(responseJSON.data));
            } else {
                message.error(`店铺、品牌信息获取失败 ${responseJSON.resultmsg}`);
                dispatch(getPromotionShopSchemaFailed());
            }
        }).catch((error) => {
            message.error(`网络连接异常，请稍后重试`);
            console.log('错误：', error);
            dispatch(getPromotionShopSchemaFailed());
        });
    };
};

export const saleCenterResetShopSchemaAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_SHOP_SCHEMA,
        payload: null,
    };
};

let fetchPromotionScopeInfoSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS,
        payload: opts,
    };
};

let fetchPromotionScopeInfoFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED,
        payload: opts,
    };
};

let getPromotionShopSchemaSuccess = (opts) => {
    return {
        type: SALE_CENTER_GET_SHOP_SCHEMA_SUCCESS,
        payload: opts,
    };
};

let getPromotionShopSchemaFailed = (opts) => {
    return {
        type: SALE_CENTER_GET_SHOP_SCHEMA_FAILED,
        payload: opts,
    };
};


export const saleCenterSetScopeInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_ACTIVITY_SCOPE_INFO,
        payload: opts,
    };
};

const getShopByParamSuccess = (payload) => {
    return {
        type: SALE_CENTER_GET_SHOP_BY_PARAM,
        payload,
    };
};

export const saleCenterGetShopByParamAC = (opts) => {
    return (dispatch) => {
        fetchData('getShopByParam_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getShopByParamSuccess(records));
            });
    };
};
export const saleCenterResetScopeInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_SCOPE_INFO,
        payload: opts,
    };
};
