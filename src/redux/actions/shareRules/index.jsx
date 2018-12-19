import { axiosData } from '../../../helpers/util';
import { message } from 'antd';

export const SALE_CENTER_QUERY_SHARE_GROUP_START = 'sale center:: sale_center_query_share_group_start';
export const SALE_CENTER_QUERY_SHARE_GROUP_SUCCESS = 'sale center:: sale_center_query_share_group_success';
export const SALE_CENTER_QUERY_SHARE_GROUP_FAIL = 'sale center:: sale_center_query_share_group_fail';

export const SALE_CENTER_CHANGE_QUERY_PROMOTION_TYPE = 'sale center:: sale_center_change_query_promotion_type';
export const SALE_CENTER_CHANGE_QUERY_PROMOTION_NAME = 'sale center:: sale_center_change_query_promotion_name';

export const SALE_CENTER_START_CREATE_SHARE_GROUP = 'sale center:: sale_center_start_create_share_group';
export const SALE_CENTER_START_EDIT_CERTAIN_SHARE_GROUP = 'sale center:: sale_center_start_edit_certain_share_group';

export const SALE_CENTER_SAVE_SHARE_GROUP_START = 'sale center:: sale_center_save_share_group_start';
export const SALE_CENTER_SAVE_SHARE_GROUP_SUCCESS = 'sale center:: sale_center_save_share_group_success';
export const SALE_CENTER_SAVE_SHARE_GROUP_FAIL = 'sale center:: sale_center_save_share_group_fail';

export const SALE_CENTER_DELETE_SHARE_GROUP_START = 'sale center:: sale_center_delete_share_group_start';
export const SALE_CENTER_DELETE_SHARE_GROUP_SUCCESS = 'sale center:: sale_center_delete_share_group_success';
export const SALE_CENTER_DELETE_SHARE_GROUP_FAIL = 'sale center:: sale_center_delete_share_group_fail';

export const SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_START = 'sale center:: sale_center_remove_item_from_share_group_start';
export const SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_SUCCESS = 'sale center:: sale_center_remove_item_from_share_group_success';
export const SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_FAIL = 'sale center:: sale_center_remove_item_from_share_group_fail';

// 打开新建窗口
export const startCreateShareGroup = opts => ({
    type: SALE_CENTER_START_CREATE_SHARE_GROUP,
    payload: opts,
});

// 打开编辑窗口
export const startEditCertainShareGroup = opts => ({
    type: SALE_CENTER_START_EDIT_CERTAIN_SHARE_GROUP,
    payload: opts,
});

// TODO: 替换真实请求接口
export const queryShareGroups = (opts) => {
    return (dispatch) => {
        dispatch({type: SALE_CENTER_QUERY_SHARE_GROUP_START});
        axiosData('/promotion/docPromotionService_querySHAREGROUPS.ajax', opts, {}, { path: 'data' }, 'HTTP_SERVICE_URL_CRM')
            .then((list) => {
                dispatch({
                    type: SALE_CENTER_QUERY_SHARE_GROUP_SUCCESS,
                    payload: Array.isArray(list) ? list : [],
                })
            })
            .catch(err => dispatch({type: SALE_CENTER_QUERY_SHARE_GROUP_FAIL}));
    }
};

// TODO: 替换真实请求接口
/**
 * 更新 新建都走此接口, 区别在于有无id
 * @param opts
 * @returns {function(*)}
 */
export const createOrUpdateCertainShareGroup = (opts) => {
    return (dispatch) => {
        dispatch({type: SALE_CENTER_SAVE_SHARE_GROUP_START});
        axiosData('/promotion/docPromotionService_querySHAREGROUPS.ajax', opts, {}, { path: 'data' }, 'HTTP_SERVICE_URL_CRM')
            .then((list) => {
                dispatch({
                    type: SALE_CENTER_SAVE_SHARE_GROUP_SUCCESS,
                })
            })
            .catch(err => dispatch({type: SALE_CENTER_SAVE_SHARE_GROUP_FAIL}));
    }
};

// TODO: 替换真实请求接口
/**
 * 根据ID删除特定group
 * @param opts
 * @returns {function(*)}
 */
export const deleteCertainShareGroup = (opts) => {
    return (dispatch) => {
        dispatch({type: SALE_CENTER_DELETE_SHARE_GROUP_START});
        axiosData('/promotion/docPromotionService_querySHAREGROUPS.ajax', opts, {}, { path: 'data' }, 'HTTP_SERVICE_URL_CRM')
            .then((list) => {
                dispatch({
                    type: SALE_CENTER_DELETE_SHARE_GROUP_SUCCESS,
                })
            })
            .catch(err => dispatch({type: SALE_CENTER_DELETE_SHARE_GROUP_FAIL}));
    }
};

/**
 * 移除某一group中的某一项
 * @param opts
 * @returns {function(*)}
 */
export const removeItemFromCertainShareGroup = (opts) => {
    return (dispatch) => {
        dispatch({type: SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_START});
        axiosData('/promotion/docPromotionService_querySHAREGROUPS.ajax', opts, {}, { path: 'data' }, 'HTTP_SERVICE_URL_CRM')
            .then((list) => {
                dispatch({
                    type: SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_SUCCESS,
                })
            })
            .catch(err => dispatch({type: SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_FAIL}));
    }
};
