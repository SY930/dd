import { message } from "antd";
import { fetchData, axiosData } from "../../../helpers/util";

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
