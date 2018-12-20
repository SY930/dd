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
    /* 可供选择的所有活动列表 */
    availablePromotionList: [],
    searchPromotionType: '',
    searchPromotionName: '',
    isCreate: false,
    isEdit: false,
    isSaving: false,
    isDeleting: false,
    isRemoving: false,

});

export const share_rules = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_QUERY_SHARE_GROUP_START:
            return $$state.set('isQuerying', true);
        case SALE_CENTER_QUERY_SHARE_GROUP_SUCCESS:
            return $$state
                .set('isQuerying', false)
                .set('shareGroups', Immutable.fromJS(action.payload))
        case SALE_CENTER_QUERY_SHARE_GROUP_FAIL:
            return $$state
                .set('isQuerying', false)

        case SALE_CENTER_CHANGE_QUERY_PROMOTION_TYPE:
            return $$state
                .set('searchPromotionType', action.payload)
        case SALE_CENTER_CHANGE_QUERY_PROMOTION_NAME:
            return $$state
                .set('searchPromotionName', action.payload)

        case SALE_CENTER_SAVE_SHARE_GROUP_START:
            return $$state
                .set('isSaving', true)
        case SALE_CENTER_SAVE_SHARE_GROUP_SUCCESS:
            return $$state
                .set('isSaving', false)
        case SALE_CENTER_SAVE_SHARE_GROUP_FAIL:
            return $$state
                .set('isSaving', false)

        case SALE_CENTER_DELETE_SHARE_GROUP_START:
            return $$state
                .set('isDeleting', true)
        case SALE_CENTER_DELETE_SHARE_GROUP_SUCCESS:
            return $$state
                .set('isDeleting', false)
        case SALE_CENTER_DELETE_SHARE_GROUP_FAIL:
            return $$state
                .set('isDeleting', false)

        case SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_START:
            return $$state
                .set('isRemoving', true)
        case SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_SUCCESS:
            return $$state
                .set('isRemoving', false)
        case SALE_CENTER_REMOVE_ITEM_FROM_SHARE_GROUP_FAIL:
            return $$state
                .set('isRemoving', false)
        default: return $$state;
    }
};
