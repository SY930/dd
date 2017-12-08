/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-07T15:28:45+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.action.js
* @Last modified by:   xf
* @Last modified time: 2017-03-18T08:50:55+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO = 'sale center: fetch promotion scope info';
export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS = 'sale center: fetch promotion scope info success';
export const SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED = 'sale center: fetch promotion scope info failed';


export const SALE_CENTER_SET_ACTIVITY_SCOPE_INFO = "sale center : set promotion scope info";
export const SALE_CENTER_GET_SHOP_BY_PARAM = 'sale center : get shop by param success';
export const SALE_CENTER_RESET_SCOPE_INFO = "sale center : reset scope info";

import {message}  from 'antd';
export const SCENARIOS = Object.freeze([{
        value: '0',
        key: 'All',
        name: '全部'
    },
    {
        value: '1',
        key: 'POS',
        name: '云店'
    },
    {
        value: '2',
        key: 'WECHAT',
        name: '微信'
    }
]);


import {
    fetchData,
    generateXWWWFormUrlencodedParams
} from '../../../helpers/util';

export const fetchPromotionScopeInfo = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO,
        });
        let params = generateXWWWFormUrlencodedParams(opts);

        fetch("/api/shopcenter/shop/schema", {
            method: "POST",
            body: params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }).then((responseJSON) => {
            if(responseJSON.resultcode==='000'){
                dispatch(fetchPromotionScopeInfoSuccess(responseJSON.data));
            }else{
                message.error( `店铺、品牌信息获取失败 ${responseJSON.resultmsg}`);
                dispatch(fetchPromotionScopeInfoFailed());
            }
        }).catch(error => {
            dispatch(fetchPromotionScopeInfoFailed());
        });
    };
};

let fetchPromotionScopeInfoSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS,
        payload: opts
    };
};

let fetchPromotionScopeInfoFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED,
        payload: opts
    };
};


export const saleCenterSetScopeInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_ACTIVITY_SCOPE_INFO,
        payload: opts
    };
};

let getShopByParamSuccess = (payload) => {
    return {
        type: SALE_CENTER_GET_SHOP_BY_PARAM,
        payload
    };
};

export const saleCenterGetShopByParamAC = (opts) => {
    return dispatch => {
        fetchData('getShopByParam', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getShopByParamSuccess(records));
            });
    };
};
export const saleCenterResetScopeInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_SCOPE_INFO,
        payload: opts
    };
};
