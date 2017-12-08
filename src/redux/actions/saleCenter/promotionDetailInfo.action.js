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
    getSpecifiedUrlConfig
} from '../../../helpers/apiConfig';
import { message } from 'antd';
export const SALE_CENTER_SET_PROMOTION_DETAIL = "sale center:: set promotion detail";
export const SALE_CENTER_FETCH_FOOD_CATEGORY = "sale center:: fetch food category";
export const SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS = "sale center :: fetch food category success";
export const SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED = "sale center :: fetch food category failed";

export const SALE_CENTER_FETCH_FOOD_MENU = "sale center:: fetch food menu";
export const SALE_CENTER_FETCH_FOOD_MENU_SUCCESS = "sale center:: fetch food menu success";
export const SALE_CENTER_FETCH_FOOD_MENU_FAILED = "sale center:: fetch food menu failed";

export const SALE_CENTER_FETCH_PROMOTION_LIST = "sale center:: fetch promotion list";
export const SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS = "sale center:: fetch promotion list success";
export const SALE_CENTER_FETCH_PROMOTION_LIST_FAILED = "sale center:: fetch promotion list FAILED";


export const SALE_CENTER_FETCH_ROLE_LIST = "sale center:: fetch role info";
export const SALE_CENTER_FETCH_ROLE_LIST_SUCCESS = "sale center:: fetch role info success";
export const SALE_CENTER_FETCH_ROLE_LIST_FAILED = 'sale center:: fetch role info failed';
export const SALE_CENTER_RESET_DETAIL_INFO = "sale center : reset detail info";

export const SALE_CENTER_FETCH_GIFT_LIST = "sale center : get gift info";
export const SALE_CENTER_FETCH_GIFT_LIST_SUCCESS = "sale center:: fetch gift info success";
export const SALE_CENTER_FETCH_GIFT_LIST_FAILED = 'sale center:: fetch gift info failed';

export const SALE_CENTER_FETCH_SUBJECT_LIST = "sale center : get subjec info";
export const SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS = "sale center:: fetch subject info success";
export const SALE_CENTER_FETCH_SUBJECT_LIST_FAILED = 'sale center:: fetch subject info failed';
export const saleCenterSetPromotionDetailAC = (opts) => {
    return {
        type: SALE_CENTER_SET_PROMOTION_DETAIL,
        payload: opts
    };
};


let fetchFoodCategoryStart = () => {
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY
    };
};

let fetchGiftListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_GIFT_LIST_SUCCESS,
        payload: opts
    };
};

let fetchGiftListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_GIFT_LIST_FAILED,
        payload: opts
    };
};

let fetchFoodCategorySuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS,
        payload: opts
    }
};

let fetchFoodCategoryFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED,
        payload: opts
    }
};


export const fetchFoodCategoryInfoAC = (opts) => {
    return dispatch => {
        dispatch(fetchFoodCategoryStart());
        let config = ''
        if (opts.shopID) { //店铺  zhangqiu
            config = getSpecifiedUrlConfig('getShopFoodCategory', {...opts, bookID: 0 });
        } else {
            config = getSpecifiedUrlConfig('getFoodCategory', {...opts, bookID: 0 });
        }

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            if (responseJSON.resultcode === '000') {
                dispatch(fetchFoodCategorySuccess(responseJSON.data))
            } else {
                message.error(`获取菜品分类失败!${responseJSON.resultmsg}`);
                dispatch(fetchFoodCategoryFailed(responseJSON.resultmsg));
            }
        }).catch(error => {
            dispatch(fetchFoodCategoryFailed(error))
        });
    }
};

let fetchFoodMenuSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_FOOD_MENU_SUCCESS,
        payload: opts

    }
};

let fetchFoodMenuFailed = () => {
    return {
        type: SALE_CENTER_FETCH_FOOD_MENU_FAILED
    }
};

export const fetchFoodMenuInfoAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_FOOD_MENU
        });
        let config = '';
        if (opts.shopID) { //店铺  zhangqiu
            config = getSpecifiedUrlConfig('getShopFoodMenu', {...opts, bookID: 0 });
        } else {
            config = getSpecifiedUrlConfig('getFoodMenu', {...opts, bookID: 0 });
        }

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            if (responseJSON.resultcode === '000') {
                dispatch(fetchFoodMenuSuccess(responseJSON.data))
            } else {
                message.error(`获取菜品信息失败!${responseJSON.resultmsg}`);
                dispatch(fetchFoodMenuFailed(responseJSON.resultmsg));
            }
        }).catch(error => {
            dispatch(fetchFoodMenuFailed(error))
        });
    }
};

let fetchPromotionListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS,
        payload: opts
    }
};

let fetchPromotionListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_LIST_FAILED,
        payload: opts
    }
};


export const fetchPromotionListAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_LIST
        });

        let config = getSpecifiedUrlConfig('getPromotionList', opts);

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            dispatch(fetchPromotionListSuccess(responseJSON.data))
        }).catch(error => {
            dispatch(fetchPromotionListFailed(error))
        });
    }
};

let fetchRoleListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ROLE_LIST_SUCCESS,
        payload: opts
    }
};

let fetchRoleListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_ROLE_LIST_FAILED,
        payload: opts
    };
};

export const fetchRoleListInfoAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_ROLE_LIST
        });

        let config = getSpecifiedUrlConfig('getRole', opts);

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            dispatch(fetchRoleListSuccess(responseJSON.data))
        }).catch(error => {
            dispatch(fetchRoleListFailed(error))
        });
    }
};



export const saleCenterResetDetailInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_DETAIL_INFO,
        payload: opts
    };
};

export const fetchGiftListInfoAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_GIFT_LIST
        });

        let config = getSpecifiedUrlConfig('getGift', opts);

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            dispatch(fetchGiftListSuccess(responseJSON.data))
        }).catch(error => {
            dispatch(fetchGiftListFailed(error))
        });
    }
};

let fetchSubjectListSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS,
        payload: opts
    }
};

let fetchSubjectListFailed = (opts) => {
    return {
        type: SALE_CENTER_FETCH_SUBJECT_LIST_FAILED,
        payload: opts
    }
};


export const fetchSubjectListInfoAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_SUBJECT_LIST
        });

        let config = getSpecifiedUrlConfig('getSubject', opts);

        fetch(config.url, {
            method: config.method,
            body: config.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {

                if (response.headers.get("content-type").indexOf('application/json') >= 0) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }).then((responseJSON) => {
            dispatch(fetchSubjectListSuccess(responseJSON.data));
        }).catch(error => {
            dispatch(fetchSubjectListFailed(error));
        });
    };
};