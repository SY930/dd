
import { message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';

const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'specialPromotion/', '/api/v1/universal?'];

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

/**
 * 获取店铺
 */
async function getShopList(parm) {
    const [service, api] = ['HTTP_SERVICE_URL_CRM', 'crm/'];
    const { groupID } = getAccountInfo();
    const data = { groupID, ...parm };
    const method = `${api}groupShopService_findSchemaNew.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { shops = [] } } = response;
    if (code === '000') {
        return shops;
    }
    message.error(msg);
    return [];
}
/**
 * 获取品牌列表
 */
async function getBrandList() {
    const [service, api] = ['HTTP_SERVICE_URL_SHOPAPI', 'shopapi/'];
    const { groupID } = getAccountInfo();
    const data = { groupID, isActive: 1 };
    const method = `${api}shopBrandInfoAuthQuery.svc`;
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: { records = [] } } = response;
    if (code === '000') {
        return records;
    }
    message.error(msg);
    return [];
}

/**
 * 获取短信签名
 */
async function querySMSSignitureList() {
        const [service] = ['HTTP_SERVICE_URL_PROMOTION_NEW'];
        const { groupID } = getAccountInfo();
        const data = { groupID };
        const method = `/promotion/message/query.ajax?groupID=${groupID}`;
        const params = { service, type, data, method };
        const response = await axios.post(url,params);
        const {code,message:msg,records = []} = response;
        if (code === '000') {
            return records;
        }
        message.error(msg);
        return [];
};
//获取短信结算主体
async function queryFsmGroupSettleUnit(){
    const [service] = ['HTTP_SERVICE_URL_PROMOTION_NEW'];
    const { groupID ,accountID} = getAccountInfo();
    const data = { groupID ,accountID };
    const method = `/specialPromotion/queryFsmGroupEquityAccount.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url,params);
    const {code,message:msg,accountInfoList = []} = response;
    if (code === '000') {
        return accountInfoList;
    }
    message.error(msg);
    return [];
};
//获取短信模板
async function getMessageTemplateList(){
    const [service] = ['HTTP_SERVICE_URL_PROMOTION_NEW'];
    const { groupID } = getAccountInfo();
    const data = { groupID };
    const method = `/sms/smsTemplateService_getSmsTemplateList.ajax`;
    const params = { service, type, data, method };
    const response = await axios.post(url,params);
    const {code,message:msg,data :{ templateList = []}} = response;
    if (code === '000') {
        return templateList;
    }
    message.error(msg);
    return [];
};

export {
    getAccountInfo, getBrandList, getShopList,querySMSSignitureList,queryFsmGroupSettleUnit,getMessageTemplateList,checkEventShopUsed,getAllShopList
}

