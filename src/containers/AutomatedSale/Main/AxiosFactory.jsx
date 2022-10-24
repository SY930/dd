import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';

const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'specialPromotion/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

/**
 *  获取列表
 */
async function httpApaasActivityQueryByPage(params = {}) {
    const { groupID } = getAccountInfo();
    const method = '/maEvent/queryList.ajax';
    const allParams = {
        service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            ...params
        },
        method
    };
    const response = await axios.post(url, allParams);
    const { code, message: msg } = response;
    if (code === '000') {
        return response;
    }
    message.error(msg);
    return [];
}

/**
 *  新增/编辑
 */
async function httpApaasActivitySave(params = {}) {
    const { groupID } = getAccountInfo();
    const method = '/api/apaas/admin/activity/save';
    const allParams = {
        service: 'HTTP_SERVICE_URL_CRM',
        type,
        data: {
            groupID,
            ...params
        },
        method
    };
    const response = await axios.post(url + method, allParams);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

/**
 * 查询活动详情
 */
async function httpApaasActivityQueryDetail(params = {}) {
    const { groupID } = getAccountInfo();
    const method = '/api/apaas/admin/activity/queryDetail';
    const allParams = {
        service: 'HTTP_SERVICE_URL_CRM',
        type,
        data: {
            groupID,
            ...params
        },
        method
    };
    const response = await axios.post(url + method, allParams);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

/**
 * 启动活动 / 暂停活动
 */
function httpEnableOrDisableMaPromotionEvent(params = {}) {
    return new Promise(async (resolve, reject) => {
        const { groupID: _groupID } = getAccountInfo();
        let method = '/automation/marketingAutomationService_enableMaPromotionEvent.ajax';
        if (params.status == 1) {
            method = '/automation/marketingAutomationService_disableMaPromotionEvent.ajax';
        }
        delete params.status;
        const allParams = {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            type,
            data: {
                _groupID,
                ...params
            },
            method
        };
        const response = await axios.post(url + method, allParams);
        const { code, message: msg, data: obj } = response;
        if (code === '000') {
            resolve(obj);
            return;
        }
        message.error(msg);
        reject(msg);
    })
}

/**
 * 删除活动
 */
function httpDeleteMaPromotionEvent(params = {}) {
    return new Promise(async (resolve, reject) => {
        const { groupID: _groupID } = getAccountInfo();
        let method = '/automation/marketingAutomationService_deleteMaPromotionEvent.ajax';
        const allParams = {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            type,
            data: {
                _groupID,
                ...params
            },
            method
        };
        const response = await axios.post(url + method, allParams);
        const { code, message: msg, data: obj } = response;
        if (code === '000') {
            resolve(obj);
            return;
        }
        message.error(msg);
        reject(msg);
    })
}

export {
    httpApaasActivityQueryByPage,
    httpApaasActivitySave,
    httpApaasActivityQueryDetail,
    httpEnableOrDisableMaPromotionEvent,
    httpDeleteMaPromotionEvent
}
