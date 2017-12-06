/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-27T10:27:52+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: apiConfig.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-01T15:22:14+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


const ApiConfig = Object.freeze({
    'getFoodCategory': {
        url: '/api/shopcenter/group/queryFoodCategoryInfo',
        method: 'POST',
        paramsValidation: null,
    },
    'getFoodCategory_NEW': {
        url: '/api/shopcenter/group/queryFoodCategoryInfo_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'getFoodMenu': {
        url: '/api/shopcenter/group/queryFoodInfo',
        method: 'POST',
        paramsValidation: null,
    },
    'getFoodMenu_NEW': {
        url: '/api/shopcenter/group/queryFoodInfo_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'getPromotionList': {
        url: '/api/promotion/list',
        method: 'POST',
        paramsValidation: null,
    },
    'getPromotionList_NEW': {
        url: '/api/promotion/list_NEW',
        method: 'POST',
        paramsValidation: null,
    },
    'getAllPromotionList_NEW': {
        url: '/api/promotion/allListPromotion_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'getRole': {
        url: '/api/shopcenter/base/roleQuery',
        method: 'POST',
        paramsValidation: null,
    },
    'getRole_NEW': {
        url: '/api/shopcenter/base/roleQuery',
        method: 'POST',
        paramsValidation: null,
    },
    'getGift': {
        url: '/api/shopcenter/crm/getSortedGifts',
        method: 'POST',
        paramsValidation: null,
    },
    'getGift_NEW': {
        url: '/api/shopcenter/crm/getSortedGifts_dkl',
        method: 'POST',
        paramsValidation: null,
    },

    'getSubject': {
        url: '/api/shopcenter/base/subjectQuery',
        method: 'POST',
        paramsValidation: null,
    },

    'getSubject_NEW': {
        url: '/api/shopcenter/base/subjectQuery_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'updatePromotion': {
        url: '/api/promotion/update',
        method: 'POST',
        paramsValidation: null,
    },

    'updatePromotion_NEW': {
        url: '/api/promotion/update_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'setActive': {
        url: '/api/promotion/setActive',
        method: 'POST',
        paramsValidation: null,
    },

    'setActive_NEW': {
        url: '/api/promotion/setActive_NEW',
        method: 'POST',
        paramsValidation: null,
    },

    'specialList': {
        url: '/api/shopcenter/crm/queryCrmCustomerEvent',
        method: 'POST',
        paramsValidation: null,
    },
    'specialList_NEW': {
        url: '/api/shopcenter/crm/queryCrmCustomerEvent_NEW',
        method: 'POST',
        paramsValidation: null,
    },
    'getShopFoodCategory': {
        url: '/api/saas/shop/getFoodCategory',
        method: 'POST',
        paramsValidation: null,
    },

    'getShopFoodMenu': {
        url: '/api/shop/queryShopFoodMenu',
        method: 'POST',
        paramsValidation: null,
    },
    'getGoodsCategory': {
        url: '/api/deprecated_supplychain/basic/goodsCategory/queryAll',
        method: 'POST',
        paramsValidation: null,
    },
});

export function generateXWWWFormUrlencodedParams(opts) {
    if (!(opts instanceof Object || typeof opts === 'object')) {
        throw new Error('\'opts\' must be type of \'object\'.');
    }

    const params = Object.keys(opts)
        .filter((key) => {
            return !(opts[key] === null || undefined === opts[key]);
        })
        .map((key) => {
            let value = opts[key];
            if (value instanceof Set || value instanceof Map) {
                value = JSON.stringify([...value]);
            } else if (value instanceof Object || typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }).join('&');

    return params;
}

export const getSpecifiedUrlConfig = (key, opts) => {
    // 校验参数
    if (!ApiConfig[key].paramsValidation || ApiConfig[key].paramsValidation(opts)) {
        return {
            url: ApiConfig[key].url,
            method: ApiConfig[key].method,
            params: generateXWWWFormUrlencodedParams(opts),
        };
    }
    // TODO: dispatch the global wrong paras notifications
};

/**
 * @Param {object} opts: opts.url is the request url. or function return url.
 * opts.config is the request config or function, the result it return is type of object containing configuration
 * opts.reject is the function got invoked once the async operation failed.
 * opts.resolve is the func got invoked once the async operation successed
 * */
export const HualalaFetch = (opts) => {
    let _url,
        _config;
    if (opts === undefined || opts.url === undefined) {
        if (typeof opts.url === 'string') {
            _url = opts.url;
        } else if (typeof opts.url === 'function') {
            const url = opts.url();
            if (typeof temp === 'string') {
                _url = temp;
            }
        } else {
            throw new Error(`opts.url should be a string or func:string, and it's ${opts.url}`);
        }
    }

    if (opts.config === undefined) {
        throw new Error('opts.config is required');
    }
    _config = (typeof opts.config === 'function') ? opts.config() : opts.config;

    const { resovle: _resovleFn, reject: _rejectFn } = opts;

    if (typeof _resovleFn !== 'function' || typeof _rejectFn !== 'function') {
        throw new Error('opts.reject and resolve should be typeof \'function\'');
    }

    fetch(_url, _config)
        .then((response) => {

        });
    /*
    fetch(urlConf.url, {
        method: "POST",
        body: urlConf.params,
        credentials: 'include',
        headers: {
            'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            setTimeout(() => {
                constMessage(), opts.success && opts.success();
            }, 0);
            if (response.headers.get("content-type") == 'application/json; charset=UTF-8') {
                return response.json();
            } else {
                return response.text();
            }

        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }).then((responseJSON) => {
        // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_SUCCESS,
            payload: responseJSON
        });
    }).catch((error) => {
        setTimeout(() => {
            constMessage();
            opts.fail && opts.fail();
        }, 0);
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_FAILED,
            payload: error
        })
    })
    */
};
