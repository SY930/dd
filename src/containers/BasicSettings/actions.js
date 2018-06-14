import { axiosData } from '../../helpers/util';

export const GET_SMS_TEMPLATE_LIST_START = '开始查询短信模板list';
export const GET_SMS_TEMPLATE_LIST_SUCCESS = '查询短信模板list成功';
export const GET_SMS_TEMPLATE_LIST_FAIL = '查询短信模板list失败';

export const UPDATE_SMS_TEMPLATE_START = '开始更新短信模板';
export const UPDATE_SMS_TEMPLATE_SUCCESS = '更新短信模板成功';
export const UPDATE_SMS_TEMPLATE_FAIL = '更新短信模板失败';

export const CREATE_SMS_TEMPLATE_START = '开始创建短信模板';
export const CREATE_SMS_TEMPLATE_SUCCESS = '创建短信模板成功';
export const CREATE_SMS_TEMPLATE_FAIL = '创建短信模板失败';

export const DELETE_SMS_TEMPLATE_START = '开始删除短信模板';
export const DELETE_SMS_TEMPLATE_SUCCESS = '删除短信模板成功';
export const DELETE_SMS_TEMPLATE_FAIL = '删除短信模板失败';

const getMessageTemplateListStart = (opt) => {
    return {
        type: GET_SMS_TEMPLATE_LIST_START,
        payload: opt,
    }
};
const getMessageTemplateListSuccess = (opt) => {
    return {
        type: GET_SMS_TEMPLATE_LIST_SUCCESS,
        payload: opt,
    }
};
const getMessageTemplateListFail = (opt) => {
    return {
        type: GET_SMS_TEMPLATE_LIST_FAIL,
        payload: opt,
    }
};

const updateMessageTemplateStart = (opt) => {
    return {
        type: UPDATE_SMS_TEMPLATE_START,
        payload: opt,
    }
};
const updateMessageTemplateSuccess = (opt) => {
    return {
        type: UPDATE_SMS_TEMPLATE_SUCCESS,
        payload: opt,
    }
};
const updateMessageTemplateFail = (opt) => {
    return {
        type: UPDATE_SMS_TEMPLATE_FAIL,
        payload: opt,
    }
};

const createMessageTemplateStart = (opt) => {
    return {
        type: CREATE_SMS_TEMPLATE_START,
        payload: opt,
    }
};
const createMessageTemplateSuccess = (opt) => {
    return {
        type: CREATE_SMS_TEMPLATE_SUCCESS,
        payload: opt,
    }
};
const createMessageTemplateFail = (opt) => {
    return {
        type: CREATE_SMS_TEMPLATE_FAIL,
        payload: opt,
    }
};

const deleteMessageTemplateStart = (opt) => {
    return {
        type: DELETE_SMS_TEMPLATE_START,
        payload: opt,
    }
};
const deleteMessageTemplateSuccess = (opt) => {
    return {
        type: DELETE_SMS_TEMPLATE_SUCCESS,
        payload: opt,
    }
};
const deleteMessageTemplateFail = (opt) => {
    return {
        type: DELETE_SMS_TEMPLATE_FAIL,
        payload: opt,
    }
};

export const getMessageTemplateList = (opts) => {
    return (dispatch) => {
        dispatch(getMessageTemplateListStart());
        return axiosData('/sms/smsTemplateService_getSmsTemplateList.ajax', { ...opts }, null, {
            path: 'data.templateList',
        })
            .then((records) => {
                dispatch(getMessageTemplateListSuccess({
                    payload: {
                        list: records || [],
                    },
                }));
            }, (err) => { // network error catch
                dispatch(getMessageTemplateListFail());
            }).catch((err) => { // js error catch
                console.log(err);
            });
    }
};

export const updateMessageTemplate = (opts) => {
    return (dispatch) => {
        dispatch(updateMessageTemplateStart());
        return axiosData('/sms/smsTemplateService_updateSmsTemplate.ajax', { ...opts }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(updateMessageTemplateSuccess());
                return Promise.resolve();
            }, (err) => { // network error catch
                dispatch(updateMessageTemplateFail());
                return Promise.reject();
            });
    }
};

export const createMessageTemplate = (opts) => {
    return (dispatch) => {
        dispatch(createMessageTemplateStart());
        return axiosData('/sms/smsTemplateService_addSmsTemplate.ajax', { ...opts }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(createMessageTemplateSuccess());
                return Promise.resolve();
            }, (err) => { // network error catch
                dispatch(createMessageTemplateFail());
                return Promise.reject();
            });
    }
};

export const deleteMessageTemplate = (opts) => {
    return (dispatch) => {
        dispatch(deleteMessageTemplateStart());
        return axiosData('/sms/smsTemplateService_delete.ajax', { ...opts }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(deleteMessageTemplateSuccess());
                return Promise.resolve();
            }, (err) => { // network error catch
                dispatch(deleteMessageTemplateFail());
                return Promise.reject();
            });
    }
};
