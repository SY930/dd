/**
 * 只是想把axios请求和dom分离
 * 这是继hoc的第三版试验品
 * 把axios请求作为单独的 函数导出。
 * 并改用 async 写法
 * 此axios为封装后的，所以无法使用try，或catch捕获。
 */
 import { message } from 'antd';
 import { axios, getStore } from '@hualala/platform-base';
 import { fetchData, axiosData } from '../../../helpers/util';
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
  *  新用户注册卡类 
  */
 async function getGroupCardTypeList() {
     const { groupID, roleType, loginName, groupLoginName } = getAccountInfo();
     const response = await fetchData('getSetUsedLevels_dkl', { 
         groupID,
         _groupID: groupID,
         _role: roleType,
         _loginName: loginName,
         _groupLoginName: groupLoginName
     }, null, {path: '',});
     const { code, message: msg, data } = response;
     if (code === '000') {
         let {groupCardTypeList} = data
         return groupCardTypeList;
     }
     message.error(msg);
     return false;
 }
 
 /**
  *  公众号 
  */
 async function getWechatMpList() {
     const { groupID } = getAccountInfo();
     const response = await fetchData('queryWechatMpInfo', {
         groupID,
         _groupID: groupID,
     }, null, { path: 'mpList', throttle: false });
     const { code, message: msg, mpList = [] } = response;
     
     if (response) {
         return response;
     }
     message.error(msg);
     return false;
 }
 
 /**
  *  结算主体
  */
 async function getSettleList(data) {
     const { groupID } = getAccountInfo();
     const method = '/crm/CrmSettleService_querySettleBaseInfoList.ajax';
     const params = { service: 'HTTP_SERVICE_URL_CRM', type, data: { 
         groupID 
     }, method };
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
  *  授权信息
  */
 async function getAuthLicenseData(data) {
     const { groupID } = getAccountInfo();
     const method = '/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax';
     const params = { service: 'HTTP_SERVICE_URL_CRM', type, data: { 
         groupID,
         ...data
     }, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: obj } = response;
     if (code === '000') {
         return obj;
     }
     message.error(msg);
     return [];
 }
 
 /**
  *  增加
  */
 async function putEvent(data) {
     const { groupID, accountID, userName } = getAccountInfo();
     const { event, ...others } = data;
     const newEvent = { ...event, groupID, userName, userID: accountID };
     const newData = { groupID, ...{ event: newEvent, ...others } };
     const method = `${api}addEvent.ajax`;
     const params = { service, type, data: newData, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg } = response;
     if (code === '000') {
         message.success('添加成功');
         return response;
     }
     message.error(msg);
     return false;
 }
 
 /**
  * 获取活动详情
  */
 async function getEvent(data) {
     const { groupID } = getAccountInfo();
     const newData = { groupID, ...data };
     const method = `${api}queryEventDetail.ajax`;
     const params = { service, type, data: newData, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg } = response;
     if (code === '000') {
         return response;
     }
     message.error(msg);
     return {};
 }
 /**
  * 更新
  */
 async function postEvent(data) {
     const { groupID, accountID, userName } = getAccountInfo();
     const { event, ...others } = data;
     const newEvent = { ...event, groupID, userName, userID: accountID };
     const newData = { groupID, ...{ event: newEvent, ...others } };
     const method = `${api}updateEvent.ajax`;
     const params = { service, type, data: newData, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg } = response;
     if (code === '000') {
         message.success('更新成功');
         return true;
     }
     message.error(msg);
     return false;
 }
 
 /**
  * 获取品牌列表
  */
 async function getBrandList() {
     // const [service, api] = ['HTTP_SERVICE_URL_SHOPAPI', 'shopapi/'];
     const { groupID } = getAccountInfo();
     const data = { groupID, isActive: 1 };
     const method = 'shopapi/shopBrandInfoAuthQuery.svc';
     const params = { service: 'HTTP_SERVICE_URL_SHOPAPI', type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: { records = [] } } = response;
     if (code === '000') {
         return records;
     }
     message.error(msg);
     return [];
 }
 
 async function getSceneList() {
     const { groupID } = getAccountInfo();
     const data = { groupID, isActive: 1 };
     const method = 'shopapi/shopBrandInfoAuthQuery.svc';
     const params = { service: 'HTTP_SERVICE_URL_SHOPAPI', type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: { records = [] } } = response;
     if (code === '000') {
         return records;
     }
     message.error(msg);
     return [];
 }
 
 // 查询所有营销活动
 async function searchAllActivity() {
     const { groupID } = getAccountInfo();
     const data = { groupID };
     const method = '/specialPromotion/queryListWithoutCustomerInfo.ajax';
     const params = { service, type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, eventList = [] } = response;
     if (code === '000') {
         return eventList;
     }
     message.error(msg);
     return [];
 }
 
 // 查询商城活动
 async function searchAllMallActivity() {
     const { groupID } = getAccountInfo();
     const data = { groupID, operationMode: '3' };
     const method = '/shop/getShopBaseInfo.svc';
     const params = { service: 'HTTP_SERVICE_URL_SHOPAPI', type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: { shopBaseInfoDetails = [] } } = response;
     if (code === '000') {
         return shopBaseInfoDetails;
     }
     message.error(msg);
     return [];
 }
 
 async function queryActiveList(p) {
     const { groupID } = getAccountInfo();
     const data = { groupID, ...p };
     const method = '/specialPromotion/queryScopeOverlapEvents.ajax';
     const params = { service, type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: { eventConfigInfoList = [] } } = response
     if (code === '000') {
         return eventConfigInfoList
     }
     message.error(msg);
     return false;
 }
 
 // 活动规则
 async function putRule(p) {
     const { groupID } = getAccountInfo();
     const data = { groupID, ...p };
     const method = '/specialPromotion/updateGroupEventParamList.ajax';
     const params = { service, type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg } = response;
     if (code === '000') {
         message.success('更新成功')
         return true
     }
     message.error(msg);
     return false;
 }
 
 
 async function getAppCoustomPage() {
     const { groupID } = getAccountInfo();
     const data = { groupID, pageType: '0' };
     const method = '/minipservice/customerPage/getCustomerPageList';
     const params = { service: 'HTTP_SERVICE_URL_MINIPROGRAM', type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: obj } = response;
     if (code === '000') {
         return obj
     }
     message.error(msg);
     return [];
 }

async function getMpAppList() {
    const method = '/miniProgramCodeManage/getApps';
    const { groupID } = getAccountInfo();
    const params = { service: 'HTTP_SERVICE_URL_WECHAT', data: { groupID, page: { current: 1, pageSize: 1000 } }, method, type };
    const response = await axios.post(url + method, params);
    const { result: { code, message: msg }, apps = [] } = response;
    if (code === '000') {
        return apps
    }
    message.error(msg);
    return null;
}
 
 export {
     getBrandList, getSceneList, putEvent, getEvent, postEvent,
     getGroupCardTypeList, getWechatMpList, getSettleList, getAuthLicenseData, searchAllActivity,
     searchAllMallActivity, queryActiveList, putRule, getAppCoustomPage,
     getMpAppList,
 }
 