/**
* @Author: Xiao Feng Wang  <Terrence>
* @Date:   2017-02-32T09:44:16+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotionScopeInfo.reducer.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T12:01:28+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


const Immutable = require('immutable');

const $initialState = Immutable.fromJS({
    getShops: [], // 异步获取的店铺信息

    $scopeInfo: {
        brands: [], // 适用品牌  ['品牌1ID','品牌2ID']
        channel: '0', // 适用场景--> value给后台，showValue用于展示
        auto: '0', // 自动执行 --> value给后台，showValue用于展示
        orderType: ['31'], // 自动执行 -->第一项给后台，第二项用于展示
        shopsInfo: [], // 已选店铺，不用传给后台
        voucherVerify: '0',
        voucherVerifyChannel: '1',
        points: '1',
        evidence: '0',
    },
    // 从服务器端拉取的数据
    refs: {
        initialized: false,
        data: {
            areas: [],
            brands: [],
            cities: [],
            shopCategorys: [],
            role: [],
            shops: [],
            constructedData: [],
        },
    },
});


import {
    SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO,
    SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS,
    SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED,
    SALE_CENTER_GET_SHOP_BY_PARAM,
    SALE_CENTER_SET_ACTIVITY_SCOPE_INFO,
    SALE_CENTER_RESET_SCOPE_INFO,
} from '../../actions/saleCenterNEW/promotionScopeInfo.action.js';

function constructTreeDataContainsCityAndShop(data) {
    const { cities, shops } = data;
    if (cities === '' || shops === '') {
        return
    }
    return cities.map((city, level1) => {
        return {
            key: `0-${level1}`,
            value: `0-${level1}`,
            label: city.cityName,
            disabled: false,
            children: shops.filter((shop) => {
                return shop.cityID == city.cityID;
            })
                .map((shop, level2) => {
                    return {
                        key: `0-${level1}-${level2}`,
                        value: `0-${level1}-${level2}`,
                        label: shop.shopName,
                        isLeaf: true,
                        ...shop,
                    };
                }),
            ...city,
        };
    });
}

function getDataStructureContainCityAndArea(data) {
    const { cities, areas, shops } = data;
    if (cities === '' || shops === '' || areas === '') {
        return
    }
    const _compositeData = cities.map((city) => {
        const _children = areas
            .filter((area) => {
                return area.cityID == city.cityID;
            })
            .map((area) => {
                const _children = shops.filter((shop) => {
                    return shop.areaID == area.areaID;
                })
                    .map((shop) => {
                        return {
                            itemName: shop.shopName,
                            itemID: shop.shopID,
                            slected: false,
                            ...shop,
                        };
                    });

                return {
                    itemName: area.areaName,
                    itemID: area.areaID,
                    children: _children,
                    ...area,
                }
            });

        return {
            itemName: city.cityName,
            itemID: city.cityID,
            children: _children,
            ...city,
        }
    });
    return _compositeData;
}

export const promotionScopeInfo_NEW = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO:
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_SUCCESS:
            const constructedData = constructTreeDataContainsCityAndShop(action.payload);
            const cityAreasShops = getDataStructureContainCityAndArea(action.payload);
            return $$state
                .setIn(['refs', 'data'], Immutable.fromJS(action.payload))
                .setIn(['refs', 'initialized'], true)
                .setIn(['refs', 'data', 'constructedData'], constructedData)
                .setIn(['refs', 'data', 'cityAreasShops'], cityAreasShops);

        case SALE_CENTER_FETCH_PROMOTION_SCOPE_INFO_FAILED:
            return $$state;

        case SALE_CENTER_GET_SHOP_BY_PARAM:
            return $$state.set('getShops', Immutable.fromJS(action.payload.records));

        case SALE_CENTER_SET_ACTIVITY_SCOPE_INFO:
            const $payload = Immutable.fromJS(action.payload);
            return $$state.mergeIn(['$scopeInfo'], $payload);

        case SALE_CENTER_RESET_SCOPE_INFO:
            // reset with default value
            if (undefined === action.payload) {
                return $$state.set('$scopeInfo', $initialState.get('$scopeInfo'));
            }
            // reset with provided value.
            return $$state.set('$scopeInfo', Immutable.fromJS(action.payload));

        default:
            return $$state;
    }
};
