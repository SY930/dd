import Immutable from 'immutable';
import {
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL,
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START,
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS
} from "../../actions/saleCenterNEW/queryWeixinAccounts.action";

const initialState = Immutable.fromJS({
    isLoading: false,
    isAllOccupied: false,
    availableAccounts: []
});

export const queryWeixinAccounts = (state = initialState, action) => {
    switch (action.type) {
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START: return state.set('isLoading', true);
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS: return state.set('isLoading', false);
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL: return state.set('isLoading', false);
        default: return state;
    }
}
