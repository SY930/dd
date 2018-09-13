import {
    SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_START,
    SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS,
    SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL,
    SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_START,
    SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_SUCCESS,
    SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_FAIL,
    SALE_CENTER_CHANGE_PROMOTION_AUTORUN_LIST,
    SALE_CENTER_OPEN_PROMOTION_AUTORUN_LIST_MODAL,
    SALE_CENTER_CLOSE_PROMOTION_AUTORUN_LIST_MODAL,
} from '../../actions/saleCenterNEW/promotionAutoRun.action';

const Immutable = require('immutable');
const $initialState = Immutable.fromJS({
    isLoading: false,
    hasError: false,
    isModalVisible: false,
    isSaving: false,
    promotionList: [],
    allAvailablePromotionList: []

});

export const promotionAutoRunState = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_START:
            return $$state
                .set('isLoading', true);
        case SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS:
            return $$state
                .set('isLoading', false)
                .set('hasError', false)
                .set('promotionList', Immutable.fromJS(Array.isArray(action.payload[0]) ? action.payload[0].sort((itemA, itemB) => itemA.order - itemB.order).map(item => ({...item, promotionID: item.promotionIDStr})) : []))
                .set('allAvailablePromotionList', Immutable.fromJS(Array.isArray(action.payload[1]) ? action.payload[1].map(item => ({...item, promotionID: item.promotionIDStr})) : []));
        case SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL:
            return $$state
                .set('isLoading', false)
                .set('hasError', true);
        case SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_START:
            return $$state
                .set('isSaving', true);
        case SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_SUCCESS:
            return $$state
                .set('isSaving', false);
        case SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_FAIL:
            return $$state
                .set('isSaving', false);
        case SALE_CENTER_CHANGE_PROMOTION_AUTORUN_LIST:
            return $$state
                .set('promotionList', Immutable.fromJS(action.payload || []));
        case SALE_CENTER_OPEN_PROMOTION_AUTORUN_LIST_MODAL:
            return $$state
                .set('isModalVisible', true);
        case SALE_CENTER_CLOSE_PROMOTION_AUTORUN_LIST_MODAL:
            return $$state
                .set('isModalVisible', false);
        default:
            return $$state;
    }
};
