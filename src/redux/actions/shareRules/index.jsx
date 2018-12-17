import { axiosData } from '../../helpers/util';
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

export const startCreateShareGroup = opts => ({
    type: SALE_CENTER_START_CREATE_SHARE_GROUP,
    payload: opts,
});

export const startEditCertainShareGroup = opts => ({
    type: SALE_CENTER_START_EDIT_CERTAIN_SHARE_GROUP,
    payload: opts,
});
