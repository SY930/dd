/**
* @Author: Xiao Feng Wang  <Terrence>
* @Date:   2017-02-23T15:28:45+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotionBasicInfo.action.js
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T10:11:13+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START = 'sale center: fetch promotion categories start';
export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS = 'sale center: fetch promotion categories success';
export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED = 'sale center: fetch promotion categories failed';

export const SALE_CENTER_FETCH_PROMOTION_TAGS_START = 'sale center: fetch promotion tags start';
export const SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS = 'sale center: fetch promotion tags success';
export const SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED = 'sale center: fetch promotion tags failed';

export const SALE_CENTER_ADD_CATEGORY_SUCCESS = "sale center : add activity category";
export const SALE_CENTER_ADD_TAG_SUCCESS = "sale center : add activity tags";
export const SALE_CENTER_SET_ACTIVITY_BASIC_INFO = "sale center : set activity basic info";
export const SALE_CENTER_RESET_BASIC_INFO = "sale center : reset basic info";

import {
    fetchData,
    generateXWWWFormUrlencodedParams
} from '../../../helpers/util';

let fetchPromotionCategoriesSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS,
        payload: opts
    };
};

let fetchPromotionCategoriesFailed = () => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED
    };
};

export const fetchPromotionCategoriesAC = (opts) => {

    return dispatch => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START,
        });
        let params = generateXWWWFormUrlencodedParams(opts);

        fetch("/api/promotion/listPhrase", {
            method: "POST",
            body: params,
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
            dispatch(fetchPromotionCategoriesSuccess(responseJSON.data));
        }).catch(error => {
            dispatch(fetchPromotionCategoriesFailed(error));
        });
    };
};

let fetchPromotionTagsSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS,
        payload: opts
    };
};

let fetchPromotionTagsFailed = () => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED
    };
};

export const fetchPromotionTagsAC = (opts) => {
    return (dispatch) => {

        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_TAGS_START,
        });
        let params = generateXWWWFormUrlencodedParams(opts);

        fetch("/api/promotion/listPhrase", {
            method: "POST",
            body: params,
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
                return new Promise.reject(new Error(response.statusText));
            }
        }).then((responseJSON) => {
            dispatch(fetchPromotionTagsSuccess(responseJSON.data));
        }).catch(error => {
            dispatch(fetchPromotionTagsFailed(error));
        });
    };
};



let addCategorySuccess = (payload) => {
    return {
        type: SALE_CENTER_ADD_CATEGORY_SUCCESS,
        payload
    };
};

let addTagSuccess = (payload) => {
    return {
        type: SALE_CENTER_ADD_TAG_SUCCESS,
        payload
    };
};

export const saleCenterAddPhrase = (opts) => {
    return dispatch => {
        fetchData('addPhrase', opts.data, null, {
                path: 'data'
            })
            .then(records => {
                if (opts.phraseType === 'CATEGORY_NAME') {
                    dispatch(addCategorySuccess(records));
                } else {
                    dispatch(addTagSuccess(records));
                }
                opts.success && opts.success();
            })
            .catch(err=>{
                opts.fail && opts.fail();
            });
    };
};

export const saleCenterSetBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_ACTIVITY_BASIC_INFO,
        payload: opts
    };
};

export const saleCenterResetBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_BASIC_INFO,
        payload: opts
    };
};
