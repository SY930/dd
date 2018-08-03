import {axiosData, fetchData} from '../../../helpers/util';

export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START = 'sale center: fetch promotion categories start new';
export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS = 'sale center: fetch promotion categories success new';
export const SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED = 'sale center: fetch promotion categories failed new';
export const SALE_CENTER_FETCH_PROMOTION_TAGS_START = 'sale center: fetch promotion tags start new';
export const SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS = 'sale center: fetch promotion tags success new';
export const SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED = 'sale center: fetch promotion tags failed new';
export const SALE_CENTER_ADD_CATEGORY_SUCCESS = 'sale center : add activity category new';
export const SALE_CENTER_ADD_TAG_SUCCESS = 'sale center : add activity tags new';
export const SALE_CENTER_SET_ACTIVITY_BASIC_INFO = 'sale center : set activity basic info new';
export const SALE_CENTER_RESET_BASIC_INFO = 'sale center : reset basic info new';
export const SALE_CENTER_FILTER_SHOPS = 'sale center : filter shops';
export const SALE_CENTER_SHOPS_ALL_SET = 'sale center : shops all set';

const fetchPromotionCategoriesSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_SUCCESS,
        payload: opts,
    };
};

const fetchPromotionCategoriesFailed = () => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_FAILED,
    };
};

export const fetchPromotionCategoriesAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_CATEGORIES_START,
        });
        // let params = generateXWWWFormUrlencodedParams(opts);

        fetch('/api/promotion/listPhrase_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
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
            dispatch(fetchPromotionCategoriesSuccess(responseJSON));
        }).catch((error) => {
            dispatch(fetchPromotionCategoriesFailed(error));
        });
    };
};

const fetchPromotionTagsSuccess = (opts) => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_TAGS_SUCCESS,
        payload: opts,
    };
};

const fetchPromotionTagsFailed = () => {
    return {
        type: SALE_CENTER_FETCH_PROMOTION_TAGS_FAILED,
    };
};

export const fetchPromotionTagsAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_FETCH_PROMOTION_TAGS_START,
        });
        // let params = generateXWWWFormUrlencodedParams(opts);

        fetch('/api/promotion/listPhrase_NEW', {
            method: 'POST',
            body: JSON.stringify(opts),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                    return response.json();
                }
                return response.text();
            }
            return new Promise.reject(new Error(response.statusText));
        }).then((responseJSON) => {
            dispatch(fetchPromotionTagsSuccess(responseJSON));
        }).catch((error) => {
            dispatch(fetchPromotionTagsFailed(error));
        });
    };
};

const addCategorySuccess = (payload) => {
    return {
        type: SALE_CENTER_ADD_CATEGORY_SUCCESS,
        payload,
    };
};

const addTagSuccess = (payload) => {
    return {
        type: SALE_CENTER_ADD_TAG_SUCCESS,
        payload,
    };
};

export const saleCenterAddPhrase = (opts) => {
    return (dispatch) => {
        fetchData('addPhrase_NEW', opts.data, null, {
            path: '',
        })
            .then((records) => {
                if (opts.phraseType === 'CATEGORY_NAME') {
                    dispatch(addCategorySuccess(records));
                } else {
                    dispatch(addTagSuccess(records));
                }
                opts.success && opts.success();
            })
            .catch((err) => {
                opts.fail && opts.fail();
            });
    };
};

export const saleCenterSetBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_SET_ACTIVITY_BASIC_INFO,
        payload: opts,
    };
};

export const saleCenterResetBasicInfoAC = (opts) => {
    return {
        type: SALE_CENTER_RESET_BASIC_INFO,
        payload: opts,
    };
};
export const saleCenterDeletePhrase = (opts) => {
    return (dispatch) => {
        fetch('/api/promotion/deletePhrase_NEW', {
            method: 'POST',
            body: JSON.stringify(opts.data),
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                opts.success && opts.success();
            })
            .catch((err) => {
                console.log(err)
            });
    };
};

export const fetchFilterShopsSuccess = (opts) => {
    return {
        type: SALE_CENTER_FILTER_SHOPS,
        payload: opts,
    };
};

export const fetchFilterShops = (opts) => {
    return (dispatch) => {
        axiosData(
            '/promotion/docPromotionService_query.ajax',
            opts.data,
            {},
            {path: 'data'},
            'HTTP_SERVICE_URL_SHOPCENTER'
        ).then((responseJSON) => {
            dispatch(fetchFilterShopsSuccess(responseJSON))
        }, (error) => {
            opts.fail && opts.fail('店铺信息获取出错');
        })
    };
};
export const shopsAllSet = (opts) => {
    return {
        type: SALE_CENTER_SHOPS_ALL_SET,
        payload: opts,
    };
};
