/**
 *
 */


import {
    fetchData,
    genFetchOptions,
} from '../../../../helpers/util';

export const FETCH_SHOP_CONTROL_RETURN_ORG_DATA_START = 'supplchain_shop_control_return: fetch org data start';
export const FETCH_SHOP_CONTROL_RETURN_ORG_DATA_SUCCESS = 'supplchain_shop_control_return: fetch org data success';
export const FETCH_SHOP_CONTROL_RETURN_ORG_DATA_FAIL = 'supplchain_shop_control_return: fetch org data fail';

export const FETCH_SHOP_CONTROL_RETURN_TABLE_START = 'supplchain_shop_control_return: fetch data start';
export const FETCH_SHOP_CONTROL_RETURN_TABLE_SUCCESS = 'supplchain_shop_control_return: fetch data success';
export const FETCH_SHOP_CONTROL_RETURN_TABLE_FAIL = 'supplchain_shop_control_return: fetch data fail';

export const UPDATE_SHOP_CONTROL_RETURN_SHOW_DIALOG_TYPE = 'supplchain_shop_control_return: update show dialog type';
export const HIDE_SHOP_CONTROL_RETURN_DIALOG = 'supplchain_shop_control_return: hide dialog';

export const SAVE_EDIT_CONFIRM_FLAG = 'supplchain_shop_control_return: save edit confirm flag';

const fetchShopControlReturnTableDataStart = () => {
    return {
        type: FETCH_SHOP_CONTROL_RETURN_TABLE_START,
    };
};
const fetchShopControlReturnTableDataSuccess = (payload) => {
    return {
        type: FETCH_SHOP_CONTROL_RETURN_TABLE_SUCCESS,
        payload,
    }
};
const fetchShopControlReturnTableDataFail = () => {
    return {
        type: FETCH_SHOP_CONTROL_RETURN_TABLE_FAIL,
    };
};

export const fetchShopControlReturnOrgData = (opts1, opts2) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_SHOP_CONTROL_RETURN_ORG_DATA_START,
        });
        fetchData('getGroupOrg', opts1, null, { path: null })
            .then((res) => {
                if (res.code == '000') {
                    dispatch({
                        type: FETCH_SHOP_CONTROL_RETURN_ORG_DATA_SUCCESS,
                        payload: res.data.records,
                    });
                    dispatch(fetchShopControlReturnTableData(opts2));
                }
            }).catch(() => {
                dispatch({
                    type: FETCH_SHOP_CONTROL_RETURN_ORG_DATA_FAIL,
                })
            });
    }
};

export const fetchShopControlReturnTableData = (opts) => {
    return (dispatch) => {
        dispatch(fetchShopControlReturnTableDataStart());
        fetchData('queryRejectBillList', opts, null, { path: null })
            .then((res) => {
                if (res.code == '000') {
                    dispatch(fetchShopControlReturnTableDataSuccess(res.data.records));
                }
            }).catch(() => {
                dispatch(fetchShopControlReturnTableDataFail());
            });
    };
};
export const updateControlReturnShowDialogType = (opts) => {
    return {
        type: UPDATE_SHOP_CONTROL_RETURN_SHOW_DIALOG_TYPE,
        payload: opts,
    }
};
export const hideControlReturnDialog = () => {
    return {
        type: HIDE_SHOP_CONTROL_RETURN_DIALOG,
    }
};
export const saveEditConfirmFlag = (opts) => {
    return {
        type: SAVE_EDIT_CONFIRM_FLAG,
        payload: opts,
    }
};
