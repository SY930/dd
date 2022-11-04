/*
 * @Author: dangxiaorun
 * @Date: 2022-03-09 17:22:31
 * @LastEditors: dangxiaorun
 * @LastEditTime: 2022-03-09 17:26:31
 * @Description: file content
 */
/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
import { message } from 'antd';
import { axios } from '@hualala/platform-base';
import GiftCfg from './gift';
import _ from 'lodash';
import { SALE_CENTER_COUPON_TYPE } from './giftType';
import { getStore } from '@hualala/platform-base'
/**
 * axios 默认请求参数
 * url 加 ？ 的目的就是为了在浏览器 network 里面方便看到请求的接口路径
 */
/** restful 风格函数命名， get获取，post增加，put更新，delete删除 */
const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];

async function getCardList(data) {
    const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
    const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW', type, data: {
        ...data,
        accountID: getStore().getState().user.getIn(['accountInfo', 'accountID'])
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { crmGiftTypes = [] } = obj;
        return proGiftTreeData(crmGiftTypes);
    }
    message.error(msg);
    return [];
}
async function getCouponsData (paramsData) {
    const method = '/retailCouponService/queryCouponTypeBatchGroup.ajax';
    const params = { service:'HTTP_SERVICE_URL_PROMOTION_NEW', type: 'post', data: {groupID: paramsData.groupID}, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { couponTypeBatchGroupInfoList = [] } = obj;
        return proCouponData(couponTypeBatchGroupInfoList)
    }else {
        message.error(msg);
    }
    return [];
}
function proGiftTreeData(giftTypes) {
    const _giftTypes = _.filter(giftTypes, (giftItem) => {
        if (giftItem.giftType == 10 || giftItem.giftType == 20 || giftItem.giftType == 21 || giftItem.giftType == 30 || giftItem.giftType == 40 || giftItem.giftType == 42 || giftItem.giftType == 80 || giftItem.giftType == 110 || giftItem.giftType == 111 || giftItem.giftType == 22) return true;
        return false;
    });
    let treeData = [];
    const gifts = [];
    const couponKeys = [10,20,21]
    _giftTypes.map((gt, idx) => {
        const giftTypeItem = _.find(GiftCfg.giftTypeName, { value: String(gt.giftType) }) || {};
        treeData.push({
            label: giftTypeItem.label || '--',
            key: gt.giftType,
            children: [],
        });

        gt.crmGifts.map((gift) => {
            treeData[idx].children.push({
                label: gift.applyScene == '1' && couponKeys.includes(gt.giftType) ? `[商城券]${gift.giftName}` : gift.giftName,
                value: String(gift.giftItemID),
                key: gift.giftItemID,
                giftValue: gift.giftValue,
                giftType: gt.giftType,
                applyScene: gift.applyScene
            });
            gifts.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
            });
        });
    });
    return treeData = _.sortBy(treeData, 'key');
}


function proCouponData(giftTypes) {
    const _giftTypes = giftTypes;
    let treeData = [];
    let result = _giftTypes.map((gt, idx) => {
        treeData.push({
            label: _.find(SALE_CENTER_COUPON_TYPE, { value: String(gt.couponType) }) ? _.find(SALE_CENTER_COUPON_TYPE, { value: String(gt.couponType) }).label : '',
            key: gt.couponType,
            children: [],
        });
        gt.couponBatchInfoList.map((gift) => {
            treeData[idx].children.push({
                label: gift.couponBatchName,
                value: String(gift.couponBatchID),
                key: gift.couponBatchID,
                giftValue: gift.giftValue,
                giftType: gt.couponType,
            });
        });
    });
    return treeData;
}
export { getCardList,getCouponsData }
