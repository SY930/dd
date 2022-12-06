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
 
 const { groupID, roleType, loginName, groupLoginName, accountID, userName  } = getAccountInfo();
 /**
  *  新用户注册卡类 
  */
 async function getGroupCardTypeList() {
     const response = await fetchData('getSetUsedLevels_dkl', { 
         groupID,
         _groupID: groupID,
         _role: roleType,
         _loginName: loginName,
         _groupLoginName: groupLoginName
     }, null, {path: '',});
     const { code, message: msg, data } = response;
     console.log("🚀 ~ file: AxiosFactory.jsx ~ line 36 ~ getGroupCardTypeList ~ response", response)
     if (code === '000') {
         let {groupCardTypeList} = data
         return groupCardTypeList;
     }
     message.error(msg);
     return false;
 }
 

 /**
  *  授权信息
  */
 async function getAuthLicenseData(data) {
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
 
 async function queryActiveList(p) {
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

/**
 * 
 * @returns 权益卡列表
 */
 async function getBenefitCards() {
    const data = { groupID, pageNo: 1, pageSize: 10000, isActive: 1 };
     const method = '/benefit/CrmBenefitCardService_queryBenefitCardScheme.ajax';
     const params = { service: 'HTTP_SERVICE_URL_CRM', type, data, method };
     const response = await axios.post(url + method, params);
     const { code, message: msg, data: obj } = response;
     if (code === '000') {
         const { benefitCardBaseInfoList = [] } = obj
         return benefitCardBaseInfoList
     }
     message.error(msg);
     return [];
 }
 
 /**
  * 获取权益卡档位
  */
 async function queryCardDetail(id) {
    const data = { groupID, cardTypeID: id };
    const method = '/benefit/CrmBenefitCardService_queryBenefitCardSchemeDetail.ajax';
    const params = { service: 'HTTP_SERVICE_URL_CRM', type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { paymentStageList = [] } = obj
        return paymentStageList
    }
    message.error(msg);
    return [];
 }
 
 export {
     getBrandList, putEvent, getEvent, postEvent,
     getGroupCardTypeList, getAuthLicenseData, queryActiveList, putRule,
     getBenefitCards, queryCardDetail
 }
 