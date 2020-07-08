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
        return { pageObj, list: couponPackageInfos };
    }
    message.error(msg);
    return { list: [] };
}

export {
     getTicketList,
}
