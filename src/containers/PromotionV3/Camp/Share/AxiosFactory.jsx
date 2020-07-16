/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
import { giftTypeName } from './Common';
import _ from 'lodash';
/**
 * axios 默认请求参数
 * url 加 ？ 的目的就是为了在浏览器 network 里面方便看到请求的接口路径
 */
/** restful 风格函数命名， get获取，post增加，put更新，delete删除 */
const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
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
function proGiftTreeData(giftTypes) {
    const _giftTypes = _.filter(giftTypes, (giftItem) => {
        if (giftItem.giftType == 10 || giftItem.giftType == 20 || giftItem.giftType == 21 || giftItem.giftType == 30 || giftItem.giftType == 40 || giftItem.giftType == 42 || giftItem.giftType == 80 || giftItem.giftType == 110 || giftItem.giftType == 111 || giftItem.giftType == 22) return true;
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

/**
 * 获取会员卡
 */
async function getCardTypeList() {
    const { groupID } = getAccountInfo();
    const data = { groupID };
    const method = 'crm/cardTypeLevelService_queryCardTypeBaseInfoList.ajax';
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { cardTypeBaseInfoList = [] } } = response;
    if (code === '000') {
        return cardTypeBaseInfoList;
    }
    message.error(msg);
    return [];
}
export {
    getCardList, getCardTypeList,
}
