/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-16T11:09:21+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionDetailInfo.action.js
 * @Last modified by:   xf
 * @Last modified time: 2017-03-31T16:41:20+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import {
    getSpecifiedUrlConfig,
} from '../../../helpers/apiConfig';
import { fetchData, axiosData } from '../../../helpers/util';
import { message } from 'antd';

export const SALE_CENTER_SET_PROMOTION_DETAIL = 'sale center:: set promotion detail new';
export const SALE_CENTER_FETCH_FOOD_CATEGORY = 'sale center:: fetch food category new';
export const SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS = 'sale center :: fetch food category success new';
export const SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED = 'sale center :: fetch food category failed new';

export const SALE_CENTER_FETCH_FOOD_MENU = 'sale center:: fetch food menu new';
export const SALE_CENTER_FETCH_FOOD_MENU_SUCCESS = 'sale center:: fetch food menu success new';
export const SALE_CENTER_FETCH_FOOD_MENU_FAILED = 'sale center:: fetch food menu failed new';

export const SALE_CENTER_FETCH_PROMOTION_LIST = 'sale center:: fetch promotion list new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS = 'sale center:: fetch promotion list success new';
export const SALE_CENTER_FETCH_PROMOTION_LIST_FAILED = 'sale center:: fetch promotion list FAILED new';

export const SALE_CENTER_FETCH_ALL_PROMOTION_LIST = 'sale center:: fetch all promotion list new';
export const SALE_CENTER_FETCH_ALL_PROMOTION_LIST_SUCCESS = 'sale center:: fetch all promotion list success new';
export const SALE_CENTER_FETCH_ALL_PROMOTION_LIST_FAILED = 'sale center:: fetch all promotion list FAILED new';

export const SALE_CENTER_FETCH_ROLE_LIST = 'sale center:: fetch role info new';
export const SALE_CENTER_FETCH_ROLE_LIST_SUCCESS = 'sale center:: fetch role info success new';
export const SALE_CENTER_FETCH_ROLE_LIST_FAILED = 'sale center:: fetch role info failed new';
export const SALE_CENTER_RESET_DETAIL_INFO = 'sale center : reset detail info new';

export const SALE_CENTER_FETCH_GIFT_LIST = 'sale center : get gift info new';
export const SALE_CENTER_FETCH_GIFT_LIST_SUCCESS = 'sale center:: fetch gift info success new';
export const SALE_CENTER_FETCH_GIFT_LIST_FAILED = 'sale center:: fetch gift info failed new';

export const SALE_CENTER_FETCH_SUBJECT_LIST = 'sale center : get subjec info new';
export const SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS = 'sale center:: fetch subject info success new';
export const SALE_CENTER_FETCH_SUBJECT_LIST_FAILED = 'sale center:: fetch subject info failed new';
export const saleCenterSetPromotionDetailAC = (opts) => {
    return {
        type: SALE_CENTER_SET_PROMOTION_DETAIL,
        payload: opts,
    };
};


const fetchFoodCategoryStart = () => {
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY,
    };
};

const fetchGiftListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_GIFT_LIST_SUCCESS,
        payload: opts,
    };
};

const fetchGiftListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_GIFT_LIST_FAILED,
        payload: opts,
    };
};

const fetchFoodCategorySuccess = (opts) => { //opts : {records: Category[]}
    const categoryIdMap = new Map();
    opts.records.filter(cat => cat.foodCount > 0).forEach(cat => {
        if (!categoryIdMap.has(cat.foodCategoryName) || cat.foodCategoryID > categoryIdMap.get(cat.foodCategoryName)) {
            categoryIdMap.set(cat.foodCategoryName, cat.foodCategoryID);
        }
    });
    const uniqMap = new Map();
    opts.records.forEach(cat => {
        if (categoryIdMap.has(cat.foodCategoryName)) {
            cat.foodCategoryID = categoryIdMap.get(cat.foodCategoryName); // 哎...
        }
        if (!uniqMap.has(cat.foodCategoryName)) {
            uniqMap.set(cat.foodCategoryName, cat);
        }
    });
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS,
        payload: {records: Array.from(uniqMap.values())},
    }
};

const fetchFoodCategoryFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED,
        payload: opts,
    }
};


export const fetchFoodCategoryInfoAC = (opts) => {
    return (dispatch) => {
        dispatch(fetchFoodCategoryStart());

        // let config = getSpecifiedUrlConfig('getFoodCategory_NEW', {...opts,bookID:0});
        const url = opts.shopID && opts.shopID > 0 ? 'queryShopFoodClass' : 'getFoodCategory_NEW';
        const config = getSpecifiedUrlConfig(url, { ...opts, bookID: 0, type: '0' });

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            // if(responseJSON.resultcode === '000'){
            if (responseJSON.code === '000') {
                dispatch(fetchFoodCategorySuccess(responseJSON.data))
            } else {
                dispatch(fetchFoodCategoryFailed(responseJSON.resultmsg));
            }
        }).catch((error) => {
            dispatch(fetchFoodCategoryFailed(error))
        });
    }
};

// 菜品去重
const fetchFoodMenuSuccess = (opts) => { // opts: { pageHeader: Object, records: Food[] }
    // TODO: 这种去重操作不应该由前端进行, 而且返回的每个对象中属性过多, 如果日后出现性能问题, 建议基本档优化接口
    let records = opts ? opts.records : [];
    const categoryIdMap = new Map();
    records.forEach(food => {
        if (!categoryIdMap.has(food.foodCategoryName) || food.foodCategoryID > categoryIdMap.get(food.foodCategoryName)) {
            categoryIdMap.set(food.foodCategoryName, food.foodCategoryID);
        }
    });
    const uniqMap = new Map();
    records.forEach(food => { //
        food.foodCategoryID = categoryIdMap.get(food.foodCategoryName); // 哎....
        if (uniqMap.has(`${food.foodName}${food.unit}`)) { // 产品层面决定 如果有名称+规格重复的菜品 保留售价高的那一个
            const previousFood = uniqMap.get(`${food.foodName}${food.unit}`);
            const previousPrice = previousFood.prePrice == -1 ? previousFood.price : previousFood.prePrice;
            const newPrice = food.prePrice == -1 ? food.price : food.prePrice;
            if (newPrice > previousPrice) {
                uniqMap.set(`${food.foodName}${food.unit}`, food)
            }
        } else {
            uniqMap.set(`${food.foodName}${food.unit}`, food)
        }
    });
    return {
        type: SALE_CENTER_FETCH_FOOD_MENU_SUCCESS,
        payload: {records: Array.from(uniqMap.values())},
    }
};

const fetchFoodMenuFailed = () => {
    return {
        type: SALE_CENTER_FETCH_FOOD_MENU_FAILED,
    }
};

// export const fetchFoodMenuInfoAC = (opts) => {
//     return (dispatch) => {
//         dispatch({
//             type: SALE_CENTER_FETCH_FOOD_MENU,
//         });

//         const config = getSpecifiedUrlConfig('getFoodMenu_NEW', { ...opts, bookID: 0 });

//         fetch(config.url, {
//             method: config.method,
//             body: config.params,
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json; charset=UTF-8',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//             },
//         }).then((response) => {
//             if (response.status >= 200 && response.status < 300) {
//                 if (response.headers.get('content-type').indexOf('application/json') >= 0) {
//                     return response.json();
//                 }
//                 return response.text();
//             }
//             return Promise.reject(new Error(response.statusText))
//         }).then((responseJSON) => {
//             if (responseJSON.resultcode === '000') {
//                 dispatch(fetchFoodMenuSuccess(responseJSON.data))
//             } else {
//                 message.error(`获取菜品信息失败!${responseJSON.resultmsg}`);
//                 dispatch(fetchFoodMenuFailed(responseJSON.resultmsg));
//             }
//         }).catch((error) => {
//             dispatch(fetchFoodMenuFailed(error))
//         });
//     }
// };
export const fetchFoodMenuInfoAC = (params = {}) => {
    return (dispatch) => {
        // return fetchData('getGroupFoodQuery', { ...params, bookID: 0, pageNo: -1 }, null, { path: 'data' }).then((res = {}) => {
        //     dispatch(fetchFoodMenuSuccess(res))
        // });
        const url = params.shopID && params.shopID > 0 ? 'queryShopFoodInfoList' : 'getGroupFoodQuery';
        return fetchData(url, { ...params, bookID: 0, pageNo: -1 }, null, { path: 'data' }).then((res = {}) => {
            // console.log(res.records.filter(item => item.foodName.includes('味全')));
            dispatch(fetchFoodMenuSuccess(res))
        }).catch(e => {
            dispatch(fetchFoodMenuFailed(e));
        });
    }
}
const fetchPromotionListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS,
        payload: opts,
    }
};

const fetchPromotionListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_LIST_FAILED,
        payload: opts,
    }
};


export const fetchPromotionListAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_LIST,
        });
        axiosData(
            '/promotion/docPromotionService_query.ajax',
            opts,
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_CRM'
        ).then((responseJSON) => {
            dispatch(fetchPromotionListSuccess(responseJSON))
        }).catch((error) => {
            dispatch(fetchPromotionListFailed(error))
        });
    }
};
// 共享活动获取全部活动列表
const fetchAllPromotionListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ALL_PROMOTION_LIST_SUCCESS,
        payload: opts,
    }
};

const fetchAllPromotionListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ALL_PROMOTION_LIST_FAILED,
        payload: opts,
    }
};

export const fetchAllPromotionListAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_ALL_PROMOTION_LIST,
        });
        axiosData(
            '/promotion/docPromotionService_query.ajax',
            { ...opts, pageNo: 1, pageSize: 10000, usageMode: opts.usageMode ? opts.usageMode : -1 },
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_CRM'
        ).then((responseJSON) => {
            dispatch(fetchAllPromotionListSuccess(responseJSON.promotionLst))
        }).catch((error) => {
            dispatch(fetchAllPromotionListFailed(error))
        });
    }
};

const fetchRoleListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ROLE_LIST_SUCCESS,
        payload: opts,
    }
};

const fetchRoleListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ROLE_LIST_FAILED,
        payload: opts,
    };
};

export const fetchRoleListInfoAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_ROLE_LIST,
        });

        // const config = getSpecifiedUrlConfig('getRole_NEW', opts);

        fetch('/api/shopcenter/empapi/queryRole', {
            method: 'POST',
            body: opts,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            dispatch(fetchRoleListSuccess(responseJSON.data))
        }).catch((error) => {
            dispatch(fetchRoleListFailed(error))
        });
    }
};


export const saleCenterResetDetailInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_DETAIL_INFO,
        payload: opts,
    };
};

export const fetchGiftListInfoAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_GIFT_LIST,
        });

        // fetch('/api/shopcenter/crm/getSortedGifts_dkl', {
        //     method: 'POST',
        //     body: JSON.stringify(opts),
        //     credentials: 'include',
        //     headers: {
        //         'Accept': 'application/json; charset=UTF-8',
        //         'Content-Type': 'application/json; charset=UTF-8',
        //     },
        // }).then((response) => {
        //     if (response.status >= 200 && response.status < 300) {
        //         if (response.headers.get('content-type').indexOf('application/json') >= 0) {
        //             return response.json();
        //         }
        //         return response.text();
        //     }
        //     return Promise.reject(new Error(response.statusText))
        // }).
        axiosData('/coupon/couponService_getSortedCouponBoardList.ajax', { ...opts }, null, {
            path: 'data',
        })
        .then((responseJSON) => {
            dispatch(fetchGiftListSuccess(responseJSON))
        }).catch((error) => {
            dispatch(fetchGiftListFailed(error))
        });
    }
};

const fetchSubjectListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS,
        payload: opts,
    }
};

const fetchSubjectListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_SUBJECT_LIST_FAILED,
        payload: opts,
    }
};


export const fetchSubjectListInfoAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_SUBJECT_LIST,
        });

        const config = getSpecifiedUrlConfig('getSubject_NEW', opts);

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText));
        }).then((responseJSON) => {
            dispatch(fetchSubjectListSuccess(responseJSON.data));
        }).catch((error) => {
            dispatch(fetchSubjectListFailed(error));
        });
    };
};

export const queryUnbindCouponPromotion = (opts) => {
    return (dispatch) => {
        fetchData('queryUnbindCouponPromotion', {
            ...opts
        }, null, { path: 'infoList' }).then((infoList) => {
            (infoList || []).forEach(pro => pro.promotionIDStr = pro.promotionID)
            return infoList;
        }).then((response) => {
            dispatch(fetchAllPromotionListSuccess(response))
        }).catch((error) => {
            dispatch(fetchAllPromotionListFailed(error))
        });
    }
};
