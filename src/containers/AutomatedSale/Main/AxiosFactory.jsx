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
    const method = '/api/apaas/admin/activity/queryByPage';
    const allParams = { 
        service: 'HTTP_SERVICE_URL_CRM', 
        type,
        data: { 
            groupID,
            ...params
        },
        method
    };
    const response = await axios.post(url, allParams);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
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
 * 操作活动状态（删除，取消，发布，启动）
 */
 async function httpApaasActivityOperate(params = {}) {
    const { groupID } = getAccountInfo();
    const method = '/api/apaas/admin/activity/operate';
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

export { 
    httpApaasActivityQueryByPage,
    httpApaasActivitySave,
    httpApaasActivityQueryDetail,
    httpApaasActivityOperate
}
