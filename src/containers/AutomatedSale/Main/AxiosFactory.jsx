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
async function httpGetList(params = {}) {
    console.log('列表参数', params);
    // const { groupID } = getAccountInfo();
    // const method = '/promotion/promotionShareRuleGroup_initShareRuleGroup.ajax';
    // const params = { service, type, data: { 
    //     groupID,
    //     ...data
    // }, method };
    // const response = await axios.post(url + method, params);
    // const { code, message: msg, data: obj } = response;
    const { code, message: msg, data: obj } = {
        code: '000',
        data: {
            total: 10,
            list: [
                {
                    code: 1,
                    name: '1',
                    status: 1,
                },
                {
                    code: 2,
                    name: '2',
                    status: 2,
                }
            ]
        }
    };
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return {};
}

/**
 *  新增/编辑
 */
 async function httpCreate(params = {}) {
    console.log('新增/编辑', params);
    const { code, message: msg, data: obj } = {
        code: '000',
        data: {}
    };
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return null;
}

export { 
    httpGetList,
    httpCreate
}
