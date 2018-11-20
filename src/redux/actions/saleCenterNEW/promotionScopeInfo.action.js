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
    axiosData,
    fetchData,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/util';

export const fetchPromotionScopeInfo = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO,
        });
        axiosData('/crm/groupShopService_findSchemaShopcenter.ajax', {}, {}, {path: 'data'})
            .then(data => dispatch(fetchPromotionScopeInfoSuccess(data)),
                error => dispatch(fetchPromotionScopeInfoFailed()))
            .catch(err => console.log('err: ', err))
    };
};

export const getPromotionShopSchema = (params) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_GET_SHOP_SCHEMA,
        });

        axiosData('/crm/groupShopService_findSchema.ajax', {}, {}, {path: 'data'})
            .then(data => dispatch(getPromotionShopSchemaSuccess(data)),
                error => dispatch(getPromotionShopSchemaFailed()))
            .catch(err => console.log('err: ', err))
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
