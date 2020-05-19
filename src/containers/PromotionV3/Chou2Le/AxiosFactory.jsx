/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
import { message } from 'antd';
import { axios } from '@hualala/platform-base';

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
 * 获取列表
 */
async function getTicketList(data) {
    const { groupID } = getAccountInfo();
    const newData = { groupID, ...data };
    const method = `${api}getCouponPackages.ajax`;
    const params = { service, type, data: newData, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, couponPackageInfos = [],
        totalSize, pageNo, pageSize,
    } = response;
    if (code === '000') {
        const pageObj = { pageNo: +pageNo, total: +totalSize, pageSize };
        return { pageObj, list: couponPackageInfos };
    }
    message.error(msg);
    return { list: [] };
}

/**
 * 列表中删除
 */
async function deleteTicketBag(data) {
    const { groupID } = getAccountInfo();
    const newData = { groupID, ...data };
    const method = `${api}delCouponPackage.ajax`;
    const params = { service, type, data: newData, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 *  增加
 */
async function putTicketBag(data) {
    const { groupID } = getAccountInfo();
    const newData = { groupID, ...data };
    const method = `${api}addCouponPackage.ajax`;
    const params = { service, type, data: newData, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 更新
 */
async function postTicketBag(data) {
    const { groupID } = getAccountInfo();
    const newData = { groupID, ...data };
    const method = `${api}updateCouponPackage.ajax`;
    const params = { service, type, data: newData, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}


export {
    putTicketBag, getTicketList, deleteTicketBag,
    postTicketBag,
}
