import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
// import { fetchData, axiosData } from '../../../../helpers/util';
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
    const params = { service, type, data: { 
        groupID,
        ...data
    }, method };
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
export { initShareRuleGroup,getRuleGroupList,queryShareRuleDetail,queryShareRuleDetailList,addShareRuleGroup,updateShareRuleGroup,deleteShareRuleGroup }
