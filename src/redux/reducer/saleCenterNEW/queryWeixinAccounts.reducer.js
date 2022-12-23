import Immutable from 'immutable';
import {
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL,
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START,
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS,
    QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_RESET,

    QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_START,
    QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_SUCCESS,
    QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_FAIL,
    QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_RESET,

} from "../../actions/saleCenterNEW/queryWeixinAccounts.action";

const initialState = Immutable.fromJS({
    isLoading: false,
    isAllOccupied: false,
    occupiedIDs: []
});

export const queryWeixinAccounts = (state = initialState, action) => {
    switch (action.type) {
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_START: return state.set('isLoading', true);
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_SUCCESS: return state.set('isLoading', false).set('isAllOccupied', !!action.payload.noMpIDAvailable)
                                                                .set('occupiedIDs', Immutable.fromJS(action.payload.mpIDList || []));
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_FAIL: return state.set('isLoading', false);
        case QUERY_OCCUPIED_WEI_XIN_ACCOUNTS_RESET: return initialState;
        default: return state;
    }
}

export const queryDouYinAccounts = (state = initialState, action) => {
    switch (action.type) {
        case QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_START: return state.set('isLoading', true);
        case QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_SUCCESS: return state.set('isLoading', false).set('isAllOccupied', !!action.payload.noMpIDAvailable)
                                                                .set('occupiedIDs', Immutable.fromJS(action.payload.mpIDList || []));
        case QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_FAIL: return state.set('isLoading', false);
        case QUERY_OCCUPIED_DOU_YIN_ACCOUNTS_RESET: return initialState;
        default: return state;
    }
}