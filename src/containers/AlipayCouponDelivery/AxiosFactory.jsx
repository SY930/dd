/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
import _ from 'lodash';
import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
import { axiosData } from '../../helpers/util'
/**
 * axios 默认请求参数
 * url 加 ？ 的目的就是为了在浏览器 network 里面方便看到请求的接口路径
 */
/** restful 风格函数命名， get获取，post增加，put更新，delete删除 */
const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];

const giftTypeName = [
    { label: '全部', value: '' },
    { label: '代金券', value: '10' },
];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

function proGiftTreeData(giftTypes) {
    const _giftTypes = _.filter(giftTypes, (giftItem) => {
        if (giftItem.giftType == 10) return true;
        return false;
    });
    let treeData = [];
    const gifts = [];
    _giftTypes.map((gt, idx) => {
        const giftTypeItem = _.find(giftTypeName, { value: String(gt.giftType) }) || {};
        treeData.push({
            label: giftTypeItem.label || '--',
            key: gt.giftType,
            children: [],
        });
        gt.crmGifts.map((gift) => {
            treeData[idx].children.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
                key: gift.giftItemID,
                giftValue: gift.giftValue,
                giftType: gt.giftType,
            });
            gifts.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
            });
        });
    });
    return treeData = _.sortBy(treeData, 'key');
}

async function getCardList(data) {
    const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { crmGiftTypes = [] } = obj;
        return proGiftTreeData(crmGiftTypes);
    }
    message.error(msg);
    return [];
}

// 直连PID
async function getShopPid() {
    const method = 'channelAlipayPartnerService/queryAuthPidByCompanyId.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            companyID: groupID, pageNo: 1, pageSize: 10000,
        },
        method };
    const response = await axios.post(url + method, params);
    console.log("🚀 ~ file: AxiosFactory.jsx ~ line 83 ~ getShopPid ~ response", response)
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { authPidDataList } = obj;
        return authPidDataList
    }
    message.error(msg);
    return [];
}

// 间连商户
async function getIndirectList() {
    const method = 'settleUnitManagerService/querySettleBaseInfoList.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            userTypeList: [31],
            queryType: 'ALL',
            processStatusList: [3],
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { records } = obj;
        return records
    }
    message.error(msg);
    return [];
}

// 获取间连商户的smid
async function getSmid(value) {
    const method = 'channelZpayReportService/queryUnionMerchantNoBySettleID.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            settleID: value,
            payMethod: 'ALIPAY',
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { unionReportInfoDataList } = obj;
        return unionReportInfoDataList
    }
    message.error(msg);
    return [];
}
// smid账号是否授权
async function isAuth(value) {
    const method = 'alipaySpOperationInfoService/querySpOperationInfo.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            operateType: 'OPERATION_AUTH',
            accessProductCode: 'OPENAPI_AUTH_DEFAULT',
            merchantNo: value,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return '已授权'
    }
    // message.error(msg);
    return '';
}

// 去授权
async function goAuthorizeAC(value) {
    const method = 'alipaySpOperationInfoService/applySpOperation.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            operateType: 'OPERATION_AUTH',
            accessProductCode: 'OPENAPI_AUTH_DEFAULT',
            merchantNo: value.merchantNo,
            alipayAccount: value.alipayAccount,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        message.success(msg);
        return '成功'
    }
    message.error(msg);
    return '';
}

// 支付宝券查询
async function getAlipayCouponList() {
    const method = 'couponCodeBatchService/queryBatchList.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            pageNo: 1,
            pageSize: 999999,
            channelID: 60,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { couponCodeBatchInfos } = obj
        // message.success(msg);
        return couponCodeBatchInfos
    }
    message.error(msg);
    return [];
}

// 支付宝大促
async function getAlipayPromotionList() {
    const method = 'AlipayRecruitPlanInfoService/recruitPlanListQuery.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            pageNum: 1,
            pageSize: 100,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { data } = obj
        // message.success(msg);
        return data
    }
    message.error(msg);
    return [];
}

// 选择大促加载报名素材
async function getAlipayRecruitPlan(value) {
    const method = 'AlipayRecruitPlanInfoService/recruitPlanQuery.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            planId: value,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj
    }
    message.error(msg);
    return null;
}

// 获取券详情
async function getBatchDetail(value) {
    const method = 'couponCodeBatchService/getBatchDetail.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            itemID: value,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { couponCodeBatchInfo } = obj
        return couponCodeBatchInfo
    }
    message.error(msg);
    return null;
}

// 素材图片资源上传接口
async function uploadImageUrl(value) {
    const method = 'AlipayRecruitPlanInfoService/materialImageUpload.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            imageUrl: value,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { resourceId } = obj
        console.log("🚀 ~ file: AxiosFactory.jsx ~ line 287 ~ uploadImageUrl ~ obj", obj)
        return resourceId
    }
    message.error(msg);
    return null;
}

// 获取会场大促活动列表
async function queryEventList(opts) {
    const method = 'trdEventService/queryEventList.ajax';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type,
        data: {
            groupID,
            ...opts,
        },
        method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        // const { trdEventInfos } = obj
        console.log("🚀 ~ file: AxiosFactory.jsx ~ line 287 ~ uploadImageUrl ~ obj", obj)
        return obj
    }
    message.error(msg);
    return null;
}


export {
    getCardList,
    getShopPid,
    getIndirectList,
    getSmid,
    isAuth,
    goAuthorizeAC,
    getAlipayCouponList,
    getAlipayPromotionList,
    getAlipayRecruitPlan,
    getBatchDetail,
    uploadImageUrl,
    queryEventList,
}
