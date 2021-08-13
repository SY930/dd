/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
import { message } from 'antd';
import { axios ,getStore} from '@hualala/platform-base';
/** restful 风格函数命名， get获取，post增加，put更新，delete删除 */
/**
 * axios 默认请求参数
 * url 加 ？ 的目的就是为了在浏览器 network 里面方便看到请求的接口路径
 */
const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'couponPackage/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

/**
 * 公众号列表
 */
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
/**
 * 图文列表
 */
async function getImgTextList(data) {
    const { groupID } = getAccountInfo();
    data.groupID = groupID;
    const method = `/material/getListByTitle`;
    const params = { service: 'HTTP_SERVICE_URL_WECHAT', type, data, method };
    const response = await axios.post(url + method, params);
    const { result: { code, message: msg }, resources = [] } = response;
    if (code === '000') {
        return resources;
    }
    message.error(msg);
    return [];
}
export {
    getWechatMpInfo,
    getImgTextList
}
