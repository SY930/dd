import { message } from "antd";
import { fetchData, axiosData } from "../../../helpers/util";
import { axios, getStore } from "@hualala/platform-base";

function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get("accountInfo").toJS();
}

//获取全部卡类别卡等级
export async function fetchSpecialCardLevel(params) {
    const response = await fetchData("getSetUsedLevels_dkl", params, null, {
        path: "",
    });
    let { code, message: msg, data } = response;
    if (code === "000") {
        (data.groupCardTypeList || []).forEach((cat) => {
            (cat.cardTypeLevelList || []).forEach((level) => {
                level.cardTypeName = cat.cardTypeName;
                level.cardLevelName = `${cat.cardTypeName} - ${level.cardLevelName}`;
            });
        });
        return data.groupCardTypeList;
    }
    message.error(msg);
    return false;
}

//获得排除卡id集合
export async function getExcludeCardLevelIds(opts) {
    if (!opts.eventWay) {
        return;
    }
    let result = {};
    const response = await fetch(
        "/api/specialPromotion/getExcludeCardLevelIds_NEW",
        {
            method: "POST",
            body: JSON.stringify(opts),
            credentials: "include",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json; charset=UTF-8",
            },
        }
    );
    if (response.status >= 200 && response.status < 300) {
        if (response.headers.get("content-type").includes("application/json")) {
            result = response.json();
        }
    }
    return result;
}

// 获取线上餐厅送礼不可选择的卡类型和卡类型对应的适用店铺
export async function getEventExcludeCardTypes(opts) {
    if (!opts.eventWay) {
        return;
    }
    const response = await axiosData(
        "/specialPromotion/getEventExcludeCardTypes.ajax",
        opts,
        {},
        { path: "" },
        "HTTP_SERVICE_URL_PROMOTION_NEW"
    );
    let { code, message: msg } = response;
    if (code === "000") {
        return response;
    }
    message.error(msg);
    return false;
}

//查询已选卡类型的可用店铺
export async function getListCardTypeShop(opts) {
    const response = await axiosData(
        "/crm/cardTypeShopService_getListCardTypeShop.ajax",
        opts,
        {},
        { path: "" }
    );
    let { code, message: msg, data } = response;
    if (code === "000") {
        return data.cardTypeShopList;
    }
    message.error(msg);
    return false;
}

//判断活动交叉
export async function queryActiveList(params) {
    const method =
        "/specialPromotion/queryScopeOverlapEventsForCustomerGet.ajax";
    const payload = {
        service: "HTTP_SERVICE_URL_PROMOTION_NEW",
        type: "post",
        data: { ...params },
        method: "/specialPromotion/queryScopeOverlapEventsForCustomerGet.ajax",
    };
    const response = await axios.post("/api/v1/universal?" + method, payload);
    const {
        code,
        message: msg,
        data: { eventConfigInfoList = [] },
    } = response;
    if (code === "000") {
        return eventConfigInfoList;
    }
    message.error(msg);
    return false;
}

//新增活动
export async function putEvent(data) {
    const { groupID, accountID, userName } = getAccountInfo();
    const { event, ...others } = data;
    const newEvent = { ...event, groupID, userName, userID: accountID };
    const newData = { groupID, ...{ event: newEvent, ...others } };
    const method = `specialPromotion/addEvent.ajax`;
    const params = {
        service: "HTTP_SERVICE_URL_PROMOTION_NEW",
        type: "post",
        data: newData,
        method,
    };
    const response = await axios.post("/api/v1/universal?" + method, params);
    const { code, message: msg } = response;
    if (code === "000") {
        message.success("添加成功");
        return response;
    }
    message.error(msg);
    return false;
}

//获取活动详情
export async function getEvent(data) {
    const { groupID } = getAccountInfo();
    const newData = { groupID, ...data };
    const method = `specialPromotion/queryEventDetail.ajax`;
    const params = {
        service: "HTTP_SERVICE_URL_PROMOTION_NEW",
        type: 'post',
        data: newData,
        method,
    };
    const response = await axios.post("/api/v1/universal?" + method, params);
    const { code, message: msg } = response;
    if (code === "000") {
        return response;
    }
    message.error(msg);
    return {};
}

//更新活动
export async function postEvent(data) {
    const { groupID, accountID, userName } = getAccountInfo();
    const { event, ...others } = data;
    const newEvent = { ...event, groupID, userName, userID: accountID };
    const newData = { groupID, ...{ event: newEvent, ...others } };
    const method = `specialPromotion/updateEvent.ajax`;
    const params = {
        service: "HTTP_SERVICE_URL_PROMOTION_NEW",
        type: 'post',
        data: newData,
        method,
    };
    const response = await axios.post("/api/v1/universal?" + method, params);
    const { code, message: msg } = response;
    if (code === "000") {
        message.success("更新成功");
        return true;
    }
    message.error(msg);
    return false;
}

/**
 *  授权信息
 */
export async function getAuthLicenseData(data) {
    const { groupID } = getAccountInfo();
    const method = '/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax';
    const params = { service: 'HTTP_SERVICE_URL_CRM', type: 'post', data: { 
        groupID,
        ...data
    }, method };
    const response = await axios.post('/api/v1/universal?' + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj;
    }
    message.error(msg);
    return [];
}
/**
 * 券包增加页面，获取结算主体列表
 */
export async function getSettleList(data) {
    const method = '/crm/CrmSettleService_querySettleBaseInfoList.ajax';
    const params = { service: 'HTTP_SERVICE_URL_CRM', type: 'post', data, method };
    const response = await axios.post('/api/v1/universal?' + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        const { settleUnitInfoList = [] } = obj;
        return settleUnitInfoList;
    }
    message.error(msg);
    return [];
}
/**
 *  获取会员卡 
 */
export async function getCardTypeList() {
    const { groupID } = getAccountInfo();
    const data = { groupID, regFromLimit: true };
    const method = 'crm/cardTypeLevelService_queryCardTypeBaseInfoList.ajax';
    const params = { service: 'HTTP_SERVICE_URL_CRM', type:'post', groupID, data, method };
    const response = await axios.post('/api/v1/universal?' + method, params);
    const { code, message: msg, data: { cardTypeBaseInfoList = [] } } = response;
    if (code === '000') {
        return cardTypeBaseInfoList;
    }
    message.error(msg);
    return [];
}