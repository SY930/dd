import Immutable from 'immutable';
import {
    SALE_CENTER_QUERY_SHARE_GROUP_START,
    SALE_CENTER_QUERY_SHARE_GROUP_SUCCESS,
    SALE_CENTER_QUERY_SHARE_GROUP_FAIL,
    SALE_CENTER_CHANGE_QUERY_PROMOTION_TYPE,
    SALE_CENTER_CHANGE_QUERY_PROMOTION_NAME,

    SALE_CENTER_START_CREATE_SHARE_GROUP,
    SALE_CENTER_START_EDIT_CERTAIN_SHARE_GROUP,

    SALE_CENTER_SAVE_SHARE_GROUP_START,
    SALE_CENTER_SAVE_SHARE_GROUP_SUCCESS,
    SALE_CENTER_SAVE_SHARE_GROUP_FAIL,

    SALE_CENTER_DELETE_SHARE_GROUP_START,
    SALE_CENTER_DELETE_SHARE_GROUP_SUCCESS,
    SALE_CENTER_DELETE_SHARE_GROUP_FAIL,

    SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_START,
    SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_SUCCESS,
    SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_FAIL,
} from '../../actions/shareRules';

const $initialState = Immutable.fromJS({
    /* 查回来的已设置的共享组 */
    shareGroups: [],
    isQuerying: false,
    hasQueryError: false,
    /* 可供选择的所有活动列表 */
    availablePromotionList: [],
    searchPromotionType: '',
    searchPromotionName: '',
    isCreate: false,
    isEdit: false,
    isSaving: false,

});

export const share_rules = ($$state = $initialState, action) => {
    switch (action.type) {

        default: return $$state;
    }
};
