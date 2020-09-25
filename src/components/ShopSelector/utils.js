import { axios, getStore } from "@hualala/platform-base";
import { FILTERS } from "./config";
import { isHuaTian } from "../../constants/projectHuatianConf";

function presetFilterOptions(records, filter) {
    const { valueKey, labelKey } = filter;
    return records.map((record) => ({
        ...record,
        value: record[valueKey],
        label: record[labelKey],
    }));
}
function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get("accountInfo").toJS();
}

/**
 * 调用接口请求 shopSchema 数据，如果提供 cache 则直接使用 cache
 * @param {any} params 请求参数
 * @param {any} cache 缓存数据
 */
export async function loadShopSchema(params = {}, cache) {
    const [service, type, api, url] = [
        "HTTP_SERVICE_URL_CRM",
        "post",
        "crm/",
        "/api/v1/universal?",
    ];
    const method = `${api}groupShopService_findSchemaShopcenterNew.ajax`;
    let data = cache;
    const { groupID, dataPermissions } = getAccountInfo();
    if (!data) {
        const parm = { service, type, data: { groupID, ...params}, method };
        const res = await axios.post(url + method, parm);
        if (res.code !== "000") throw new Error(res.message);
        data = res.data;
    }
    const filterOptions = FILTERS.reduce((ret, filter) => {
        const records = data[filter.name];
        return {
            ...ret,
            [filter.name]: records
                ? presetFilterOptions(records, filter)
                : undefined,
        };
    }, {});
    filterOptions.businessModels = [
        { businessModel: "1", businessType: "直营", value: "1", label: "直营" },
        { businessModel: "2", businessType: "加盟", value: "2", label: "加盟" },
        { businessModel: "3", businessType: "托管", value: "3", label: "托管" },
        { businessModel: "4", businessType: "合作", value: "4", label: "合作" },
    ];
    const { shopList = [] } = dataPermissions;
    const userShops = shopList.map((x) => x.shopID);
    return {
        shops: data.shops
            ? data.shops.map((shop) => ({
                  ...shop,
                  value: shop.shopID,
                  disabled: isHuaTian
                      ? false
                      : !userShops.includes(shop.shopID),
                  label: shop.shopName,
                  orgTagIDs: `${shop.orgTagMarket},${shop.orgTagBusiness},${shop.orgTagSteer}`,
              }))
            : undefined,
        ...filterOptions,
    };
}

/**
 * 合并两个过滤器，相同名字的属性对应覆盖
 * @param {Array} toFilters 合并到过滤器
 * @param {Array} filters 合并的来源
 */
export function mergeFilters(toFilters, filters) {
    if (toFilters === filters) return toFilters;
    return toFilters.map((filter) => ({
        ...filters.find((item) => item.name === filter.name),
        ...filter,
    }));
}
