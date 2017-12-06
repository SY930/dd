/**
 * Created By MengCheng on 2017/06/14
 */

import Immutable from 'immutable';
import {
    FETCH_SHOP_CONTROL_RETURN_ORG_DATA_START,
    FETCH_SHOP_CONTROL_RETURN_ORG_DATA_SUCCESS,
    FETCH_SHOP_CONTROL_RETURN_ORG_DATA_FAIL,

    FETCH_SHOP_CONTROL_RETURN_TABLE_START,
    FETCH_SHOP_CONTROL_RETURN_TABLE_SUCCESS,
    FETCH_SHOP_CONTROL_RETURN_TABLE_FAIL,

    UPDATE_SHOP_CONTROL_RETURN_SHOW_DIALOG_TYPE,
    HIDE_SHOP_CONTROL_RETURN_DIALOG,

    SAVE_EDIT_CONFIRM_FLAG,
} from '../../../actions/supplychain/shopControlReturn/shopControlReturn.action.js';

const $initialState = Immutable.fromJS({
    flags: {
        save_edit_confirm: false,
    },
    orgData: [],
    dataSource: [],
    loading: false,
    showDialog: false,
    showDialogType: null, // "add" "edit" "look" "batchDelete" "delete" "audit" "batchEdit"
});

export function shopControlReturn($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_SHOP_CONTROL_RETURN_ORG_DATA_START:
            return $$state.set('loading', true);
        case FETCH_SHOP_CONTROL_RETURN_ORG_DATA_SUCCESS:
            return $$state.set('orgData', action.payload).set('loading', false);
        case FETCH_SHOP_CONTROL_RETURN_ORG_DATA_FAIL:
            return $$state.set('loading', false);

        case FETCH_SHOP_CONTROL_RETURN_TABLE_START:
            return $$state.set('loading', true).set('showDialog', false);
        case FETCH_SHOP_CONTROL_RETURN_TABLE_SUCCESS:
            return $$state.set('dataSource', action.payload).set('loading', false).setIn(['flags', 'save_edit_confirm'], false);
        case FETCH_SHOP_CONTROL_RETURN_TABLE_FAIL:
            return $$state.set('loading', false);

        case UPDATE_SHOP_CONTROL_RETURN_SHOW_DIALOG_TYPE:
            return $$state.set('showDialog', true).set('showDialogType', action.payload);
        case HIDE_SHOP_CONTROL_RETURN_DIALOG:
            return $$state.set('showDialog', false);

        case SAVE_EDIT_CONFIRM_FLAG:
            return $$state.setIn(['flags', 'save_edit_confirm'], action.payload);

        default:
            return $$state;
    }
}
