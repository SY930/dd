import { axios, getStore } from "@hualala/platform-base";

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
    return {
        shops: data.shops 
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
