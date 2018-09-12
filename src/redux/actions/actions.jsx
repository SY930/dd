import { axiosData } from '../../helpers/util';
import { message } from 'antd';


export const SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_START = 'sale center:: query wechat message template START';
export const SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_SUCCESS = 'sale center:: query wechat message template SUCCESS';
export const SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_FAIL = 'sale center:: query wechat message template FAIL';

export const SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_START = 'sale center:: save wechat message template START';
export const SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_SUCCESS = 'sale center:: save wechat message template SUCCESS';
export const SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_FAIL = 'sale center:: save wechat message template FAIL';

export const SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE = 'sale center:: change wechat message template properties';
export const SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE_CURRENT_TYPE = 'sale center:: change wechat message template currentType';

export const SALE_CENTER_EDIT_WECHAT_MESSAGE_TEMPLATE = 'sale center:: start editing wechat message template properties';
export const SALE_CENTER_STOP_EDIT_WECHAT_MESSAGE_TEMPLATE = 'sale center:: stop editing wechat message template properties';
export const SALE_CENTER_RESET_WECHAT_MESSAGE_TEMPLATE = 'sale center:: reset wechat message template properties';

const saleCenterQueryWeChatMessageTemplatesStart = opts => ({
    type: SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_START,
    payload: opts,
});

const saleCenterQueryWeChatMessageTemplatesSuccess = opts => ({
    type: SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_SUCCESS,
    payload: opts,
});

const saleCenterQueryWeChatMessageTemplatesFail = opts => ({
    type: SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_FAIL,
    payload: opts,
});

const saleCenterSaveWeChatMessageTemplatesStart = opts => ({
    type: SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_START,
    payload: opts,
});

const saleCenterSaveWeChatMessageTemplatesSuccess = opts => ({
    type: SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_SUCCESS,
    payload: opts,
});

const saleCenterSaveWeChatMessageTemplatesFail = opts => ({
    type: SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_FAIL,
    payload: opts,
});

export const saleCenterChangeWeChatMessageTemplates = opts => ({ //tuple: type, key, value
    type: SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE,
    payload: opts,
});

export const saleCenterChangeWeChatMessageTemplateCurrentType = opts => ({ // 1 2
    type: SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE_CURRENT_TYPE,
    payload: opts,
});

export const saleCenterResetWeChatMessageTemplates = opts => ({
    type: SALE_CENTER_RESET_WECHAT_MESSAGE_TEMPLATE,
    payload: opts,
});

export const saleCenterStartEditingWeChatMessageTemplates = opts => ({
    type: SALE_CENTER_EDIT_WECHAT_MESSAGE_TEMPLATE,
    payload: opts,
});

export const saleCenterStopEditingWeChatMessageTemplates = opts => ({
    type: SALE_CENTER_STOP_EDIT_WECHAT_MESSAGE_TEMPLATE,
    payload: opts,
});


export const queryWeChatMessageTemplates = (opts) => {
    return (dispatch) => {
        dispatch(saleCenterQueryWeChatMessageTemplatesStart());

        axiosData('/coupon/CouponWechatTemplateService_getCouponWechatTemplates.ajax', opts, {}, {path: 'data.wechatTemplates'})
            .then(
                res => {
                    dispatch(saleCenterQueryWeChatMessageTemplatesSuccess(res));
                },
                error => {
                    dispatch(saleCenterQueryWeChatMessageTemplatesFail());
                }
            )
            .catch(err => {
                console.log(err);
            })
    }
};

export const saveWeChatMessageTemplates = (opts, isCreate) => {
    return (dispatch) => {
        dispatch(saleCenterSaveWeChatMessageTemplatesStart());
        const url = isCreate ? '/coupon/CouponWechatTemplateService_addCouponWechatTemplate.ajax' :
            '/coupon/CouponWechatTemplateService_updateCouponWechatTemplate.ajax';

        axiosData(url, opts, {}, {path: 'data'})
            .then(
                res => {
                    message.success('保存成功');
                    dispatch(saleCenterSaveWeChatMessageTemplatesSuccess(res));
                },
                error => {
                    dispatch(saleCenterSaveWeChatMessageTemplatesFail());
                }
            )
            .catch(err => {
                console.log(err);
            })
    }
};

