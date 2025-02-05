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
        totalSize, pageNo,
    } = response;
    if (code === '000') {
        const pageObj = { pageNo: +pageNo, total: +totalSize };
        return { pageObj, list: couponPackageInfos.filter(item => item.couponPackageStock == -1) };
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
 *
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
 *
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
 *
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
 * 更新
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
 * 检测手机
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
 * 暂时不用了
 */
// async function getAccount(data) {
//     const method = `/specialPromotion/queryFsmGroupEquityAccount.ajax`;
//     const params = { service: 'HTTP_SERVICE_URL_CRM', type, data, method };
//     const response = await axios.post(url + method, params);
//     const { code, message: msg, accountInfoList } = response;
//     if (code === '000') {
//         return accountInfoList;
//     }
//     message.error(msg);
//     return [];
// }

/**
 *
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
export {
    putTicketBag, getTicketList, deleteTicketBag, getTicketBagInfo, getTotalList,
    postTicketBag, getPhoneValid, putSendTicket,
}
