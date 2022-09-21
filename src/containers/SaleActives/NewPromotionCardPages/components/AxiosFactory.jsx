import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
import { giftTypeName } from '../common/giftConfig';
import _ from 'lodash';
import { fetchData } from '../../../../helpers/util';

const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];


function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

async function httpGetGroupCardTypeList() {
    const { groupID, roleType, loginName, groupLoginName } = getAccountInfo();
    const response = await fetchData('getSetUsedLevels_dkl', {
        groupID,
        _groupID: groupID,
        _role: roleType,
        _loginName: loginName,
        _groupLoginName: groupLoginName
    }, null, { path: '', });
    const { code, message: msg, data } = response;
    if (code === '000') {
        let { groupCardTypeList } = data;
        groupCardTypeList = groupCardTypeList.map(item => {
            if (item.cardTypeLevelList && item.cardTypeLevelList.length > 0) {
                item.cardTypeLevelList = item.cardTypeLevelList.map(newItem => {
                    newItem.cardTypeID = item.cardTypeID;
                    return newItem;
                })
            }
            return item;
        })
        return groupCardTypeList;
    }
    message.error(msg);
    return false;
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
        if (giftItem.giftType == 10 || giftItem.giftType == 20 || giftItem.giftType == 21 || giftItem.giftType == 30 || giftItem.giftType == 40 || giftItem.giftType == 42 || giftItem.giftType == 80 || giftItem.giftType == 110 || giftItem.giftType == 111 || giftItem.giftType == 115 || giftItem.giftType == 22) return true;
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

async function httpCreatePromotion(data) {
    const { groupID } = getAccountInfo();
    data.event.groupID = groupID;
    Object.assign(data, {
        groupID
    })
    const method = 'specialPromotion/addEvent.ajax';
    const params = {
        service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type: 'post',
        data,
        method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        message.success('创建成功');
        return true;
    }
    message.error(msg);
    return false;
}

async function httpGetPromotionDetail(data) {
    const { groupID } = getAccountInfo();
    Object.assign(data, {
        groupID
    })
    const method = "specialPromotion/queryEventDetail.ajax";
    const params = {
        service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type: 'post',
        data,
        method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: newData = {}, eventGiftConditionList = [], eventMutexDependRuleInfos = [] } = response;
    if (code === '000') {
        return {
            data: newData,
            eventGiftConditionList,
            eventMutexDependRuleInfos
        };
    }
    message.error(msg);
    return false;
}

export {
    getCardList,
    httpCreatePromotion,
    httpGetPromotionDetail,
    httpGetGroupCardTypeList
}
