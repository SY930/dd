import { axios, getStore } from '@hualala/platform-base';
import { FILTERS } from './config';

function presetFilterOptions(records, filter) {
    const { valueKey, labelKey } = filter;
    return records.map(record => ({
        ...record,
        value: record[valueKey],
        label: record[labelKey],
    }));
}
function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

/**
 * 调用接口请求 shopSchema 数据，如果提供 cache 则直接使用 cache
 * @param {any} params 请求参数
 * @param {any} cache 缓存数据
 */
export async function loadShopSchema(params = {}, cache) {
    const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'crm/', '/api/v1/universal?'];
    const method = `${api}groupShopService_findSchemaShopcenterNew.ajax`;
    let data = cache;
    const { groupID, dataPermissions } = getAccountInfo();
    if (!data) {
        const params = { service, type, data:{ groupID }, method };
        const res = await axios.post(url + method, params);
        if (res.code !== '000') throw new Error(res.message);
        data = res.data;
    }
    const filterOptions = FILTERS.reduce((ret, filter) => {
        const records = data[filter.name];
        return {
            ...ret,
            [filter.name]: records ? presetFilterOptions(records, filter) : undefined,
        };
    }, {});
    const { shopList = [] } = dataPermissions;
    const userShops = shopList.map(x=>x.shopID);
    return {
        shops: data.shops ? data.shops.map(shop => ({
            ...shop,
            value: shop.shopID,
            disabled: !userShops.includes(shop.shopID),
            label: shop.shopName,
            orgTagIDs: `${shop.orgTagMarket},${shop.orgTagBusiness},${shop.orgTagSteer}`,
        })) : undefined,
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
    return toFilters.map(filter => ({
        ...filters.find(item => item.name === filter.name),
        ...filter,
    }));
}
