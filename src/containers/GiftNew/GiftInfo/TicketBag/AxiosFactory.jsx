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

/**
 * 获取列表
 */
async function getTicketList(data) {
    const method = `${api}getCouponPackages.ajax`;
    const params = { service, type, data, method };
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
 * 获取券包明细统计列表
 */
async function getTotalList(data) {
    const method = `${api}getCouponPackageGiftDetail.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, customerCouponPackages = [],
        totalSize, pageNo,
    } = response;
    if (code === '000') {
        const pageObj = { pageNo: +pageNo, total: +totalSize };
        return { pageObj, list: customerCouponPackages };
    }
    message.error(msg);
    return { list: [] };
}
/**
 * 券包增加页面，获取结算主体列表
 */
async function getSettleList(data) {
    const method = '/crm/CrmSettleService_querySettleBaseInfoList.ajax';
    const params = { service: 'HTTP_SERVICE_URL_CRM', type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { settleUnitInfoList = [] } = obj;
        return settleUnitInfoList;
    }
    message.error(msg);
    return [];
}
/**
 * 列表中删除券包
 */
async function deleteTicketBag(data) {
    const method = `${api}delCouponPackage.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 *  增加券包
 */
async function putTicketBag(data) {
    const method = `${api}addCouponPackage.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 详情中，赠送 发送短信功能
 */
async function putSendTicket(data) {
    const method = `${api}sendCouponPackageToCustomer.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 更新券包
 */
async function postTicketBag(data) {
    const method = `${api}updateCouponPackage.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 详情中，赠送 检测手机
 */
async function getPhoneValid(data) {
    const method = `/crm/customerService_checkCustomerByMobile.ajax`;
    const params = { service: 'HTTP_SERVICE_URL_CRM', type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { customerID } } = response;
    if (code === '000' && customerID !== '0') {
        return customerID;
    }
    message.error(msg);
    return '';
}

/**
 * 详情中，退款， 未完成url
 */
async function postRefund(data) {
    const method = `${api}updateCouponPackage.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 列表进入查看详情
 */
async function getTicketBagInfo(data) {
    const method = `${api}getCouponPackageInfo.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, couponPackageInfo,
        shopInfos = [], couponPackageGiftConfigs } = response;
    if (code === '000') {
        return {couponPackageInfo, shopInfos, couponPackageGiftConfigs};
    }
    message.error(msg);
    return '';
}

/**
 * 公众号列表
 */
async function getWechatMpInfo(data) {
    const method = `/mpInfo/queryMpInfo`;
    const params = { service: 'HTTP_SERVICE_URL_WECHAT', type, data, method };
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

/**
 * 券包打包
 */
async function getBagBatch(data) {
    const method = `${api}addCouponPackagesBatch.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, batchID } = response;
    if (code === '000') {
        return batchID;
    }
    message.error(msg);
    return [];
}
export {
    putTicketBag, getTicketList, deleteTicketBag, getTicketBagInfo, getTotalList,
    postTicketBag, getPhoneValid, putSendTicket, postRefund, getSettleList, getWechatMpInfo,
    getImgTextList, getBagBatch,
}
