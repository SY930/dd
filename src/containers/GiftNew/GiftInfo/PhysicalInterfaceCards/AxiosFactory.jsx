import { message } from 'antd';
import { axios } from '@hualala/platform-base';

const [service, type, api, url, cardApi] =
    ['HTTP_SERVICE_URL_CRM', 'post', 'cardTemplate/', '/api/v1/universal?', 'cardOpenTask/'];

const formatVersion = (method) => `${method}`

const formatParams = (obj) => {
    const formatObj = {};
    for (let [key, value] of Object.entries(obj)) {
        if (value !== '') {
            formatObj[key] = value;
        }
    }
    return formatObj;
}

/**
 * 卡模板列表查询
 */
async function getCardTemplateList(paramsData) {
    const method = formatVersion(`${api}queryTemplateList.ajax`);
    const params = { service, type, data: formatParams(paramsData), method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, data = {}, } = response;
    if (success === '000') {
        const { list = [], page = {} } = data;
        const { pageNo, pageSize, totalSize } = page
        const pageObj = { current: pageNo, total: totalSize, pageSize };
        return { pageObj, list };
    }
    message.error(msg);
    return { list: [] };
}

/**
 * 卡模板添加
 */
async function addCardTemplate(paramsData, addOrEdit) {
    const method = formatVersion(`${api}${addOrEdit}CardTemplate.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('添加成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 卡模板停用
 */
async function stopCardTemplate(paramsData) {
    const method = formatVersion(`${api}stopCardTemplate.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
}

/**
 * 开卡任务列表查询 cardOpenTask/queryCardOpenTaskList.ajax / 发卡任务列表 cardSendTask/queryCardSendTaskList.ajax
 */
async function getOpenCardList(paramsData, methodParam) {
    const method = formatVersion(methodParam);
    const params = { service, type, data: formatParams(paramsData), method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, data = {}, } = response;
    if (success === '000') {
        const { list = [], page = {} } = data;
        const { pageNo, pageSize, totalSize } = page
        const pageObj = { current: pageNo, total: totalSize, pageSize };
        return { pageObj, list };
    }
    message.error(msg);
    return { list: [] };
}

/**
 * 开卡任务添加
 */
async function addOpenCard(paramsData, addOrEdit) {
    const method = formatVersion(`${cardApi}${addOrEdit}CardOpenTask.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 开卡任务详情
 */
async function getOpenCardDetail(paramsData) {
    const method = formatVersion(`${cardApi}cardOpenTaskDetail.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, data = {} } = response;
    if (success === '000') {
        const { cardOpenTask = {} } = data;
        return cardOpenTask
    }
    message.error(msg);
    return {};
}

/**
 * 开卡任务修改
 */
async function editOpenCard(paramsData) {
    const method = formatVersion(`${cardApi}editCardOpenTask.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 开卡任务作废/取消作废/通过/驳回
 */
async function openCardOperate(paramsData, methodParam) {
    const method = formatVersion(methodParam);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 发卡任务添加
 */
async function addSendCard(paramsData, operation) {
    const method = formatVersion(`cardSendTask/${operation}.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 卡模板列表查询
 */
async function getCardTypeList(groupID) {
    const method = formatVersion('cardType/queryCardTypeList.ajax');
    const params = { service, type, data: { groupID }, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, data = {}, } = response;
    if (success === '000') {
        const { list = [] } = data;
        return { list: list.map(({ typeName, typeCode }) => ({ label: typeName, value: typeCode })) };
    }
    message.error(msg);
    return { list: [] };
}

/**
 * 查询公司列表（制定运营中心）
 */
async function getCompanyList(paramsData) {
    const method = formatVersion('basic/saleCompany/querySaleCompanyList');
    const params = { service: 'HTTP_SERVICE_URL_SUPPLYCHAIN', type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data = {}, } = response;
    if (code === '000') {
        const { records = [] } = data;
        return { list: records.map(({ companyName, companyCode }) => ({ label: companyName, value: companyCode })) };
    }
    message.error(msg);
    return { list: [] };
}

/**
 * 卡信息同步
 */
async function cardSync(paramsData) {
    const method = formatVersion('cardInfo/cardInfoSyncSAP.ajax');
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg } = response;
    if (success === '000') {
        message.success('操作成功~');
        return true;
    }
    message.error(msg);
    return false;
}

/**
 * 导出相关
 */
async function cardExport(paramsData, operation) {
    const method = formatVersion(`cardInfo/${operation}.ajax`);
    const params = { service, type, data: paramsData, method };
    const response = await axios.post(url + method, params);
    const { success, message: msg, data = true } = response;
    if (success === '000') {
        return data;
    }
    message.error(msg);
    return false;
}


export {
    getCardTemplateList,
    addCardTemplate,
    stopCardTemplate,
    getOpenCardList,
    addOpenCard,
    getOpenCardDetail,
    editOpenCard,
    openCardOperate,
    addSendCard,
    getCardTypeList,
    getCompanyList,
    cardSync,
    cardExport
}
