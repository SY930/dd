import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';

/** restful 风格函数命名， get获取，post增加，put更新，delete删除 */
/**
 * axios 默认请求参数
 * url 加 ？ 的目的就是为了在浏览器 network 里面方便看到请求的接口路径
 */
const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'specialPromotion/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}
/**
 *  获取页面初始状态
 */
async function initShareRuleGroup(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_initShareRuleGroup.ajax';

    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);

    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { initialized } = obj
        return initialized;
    }
    message.error(msg);
    return false;
}
/**
 *  获取共享规则列表
 */
async function getRuleGroupList(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_queryShareRuleGroupList.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { shareGroupInfos = [] } = obj;
        return shareGroupInfos;
    }
    message.error(msg);
    return [];
}

/**
 *  编辑或者查看详情
 */
async function queryShareRuleDetail(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_queryShareRuleDetail.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { shareRuleInfo = {} } = obj;
        return shareRuleInfo;
    }
    message.error(msg);
    return [];
}

/**
 *  获取已存在活动列表，共享规则时不能选择
 */
async function queryShareRuleDetailList(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_queryShareRuleDetailList.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { shareRulePromotionInfos = [] } = obj;
        return shareRulePromotionInfos;
    }
    message.error(msg);
    return [];
}
/**
 *  添加共享规则
 */
async function addShareRuleGroup(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_addShareRuleGroup.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}
/**
 *  更新共享规则
 */
async function updateShareRuleGroup(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_updateShareRuleGroup.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}
/**
 *  删除共享规则
 */
async function deleteShareRuleGroup(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/promotionShareRuleGroup_deleteShareRuleGroup.ajax';
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return true;
    }
    message.error(msg);
    return false;
}

//缓存筛选到的菜品
const setStorageValue = (key, value, expire, groupID) => {
    let obj = {
        data: value,
        time: Date.now(),
        expire: expire,
        groupID
    };
    //localStorage 设置的值不能为对象,转为json字符串
    localStorage.setItem(key, JSON.stringify(obj).replaceAll("\r|\n", ""));
}
const getStorageValue = key => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val;
}
//获取券模板
async function FetchGiftList(data) {
    const { groupID } = getAccountInfo();
    const method = '/coupon/couponService_getBoards.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { crmGiftList } } = response;
    if (code === '000') {
        return crmGiftList;
    }
    message.error(msg);
    return [];
}
//请求获取所有基础营销活动
async function fetchAllPromotionList(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/docPromotionService_query.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        if (obj && obj.promotionLst && obj.promotionLst.length > 0) {
            return obj.promotionLst
        } else {
            return []
        }
    }
    message.error(msg);
    return [];
}

async function getInitRuleList(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/init.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return {};
}

async function getRuleDetail(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/query.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

async function updateRule(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/update.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    return response;
}

async function getRuleList(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/queryPage.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

async function deleteRule(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/delete.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

async function queryConfiguredShopId(data) {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeRule/queryConfiguredShopId.ajax';
    const params = {
        service, type, data: {
            groupID,
            ...data
        }, method
    };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}

async function getCouponList() {
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeExecOrder/query.ajax';
    const params = { service, type, data: { groupID, pageNo: 1, pageSize: 10000 }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { activityTypeExecOrderQueryList = [] } } = response;
    if (code === '000') {
        return activityTypeExecOrderQueryList.sort((item, next) => item.executeOrder - next.executeOrder);
    }
    message.error(msg)
    return [];
}

async function saveActiveOrder(values = []) {
    const data = values.map((item, index) => {
        return { ...item, executeOrder: index + 1 }
    })
    const { groupID } = getAccountInfo();
    const method = '/promotion/v2/activityTypeExecOrder/save.ajax';
    const params = { service, type, data: { groupID, activityTypeExecOrderSaveList: data }, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg } = response;
    if (code === '000') {
        message.success('更新成功')
        return true
    }
    message.error(msg)
    return false;
}


export { initShareRuleGroup, getRuleGroupList, queryShareRuleDetail, queryShareRuleDetailList, addShareRuleGroup, updateShareRuleGroup, deleteShareRuleGroup, setStorageValue, getStorageValue, FetchGiftList, fetchAllPromotionList, 
    getInitRuleList,getRuleDetail, updateRule,getRuleList, deleteRule, queryConfiguredShopId, getCouponList, saveActiveOrder }
