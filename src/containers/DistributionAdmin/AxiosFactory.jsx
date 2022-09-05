import { message } from 'antd';
import { axios ,getStore} from '@hualala/platform-base';
const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'couponPackage/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

async function getWechatMpInfo(data) {
    const { groupID } = getAccountInfo();
    data.groupID = groupID;
    const method = `/mpInfo/queryMpInfo`;
    const params = { 
        service: 'HTTP_SERVICE_URL_WECHAT', 
        type, 
        data, 
        method 
    };
    const response = await axios.post(url + method, params);
    const { result: { code, message: msg }, mpInfoResDataList = [] } = response;
    if (code === '000') {
        return mpInfoResDataList;
    }
    message.error(msg);
    return [];
}

export {
    getWechatMpInfo,
    getImgTextList
}
 