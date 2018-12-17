import Immutable from 'immutable';
import {

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
