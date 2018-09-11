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

const availableList = [
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf1',
        promotionID: '12341'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf2',
        promotionID: '12342'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf3',
        promotionID: '12343',
        order: '2'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf4',
        promotionID: '12344'
    }, {
        promotionName: 'asdfasdfasdfsadfasdfsadf12',
        promotionID: '123412'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf22',
        promotionID: '123422'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf32',
        promotionID: '123432',
        order: '2'
    },
    {
        promotionName: 'asdfasdfasdfsadfasdfsadf42',
        promotionID: '123442'
    },
];
const Immutable = require('immutable');
const $initialState = Immutable.fromJS({
    isLoading: false,
    hasError: false,
    isModalVisible: false,
    isSaving: false,
    promotionList: [
        {
            promotionName: 'asdfasdfasdfsadfasdfsadf1',
            promotionID: '12341'
        },
        {
            promotionName: 'asdfasdfasdfsadfasdfsadf2',
            promotionID: '12342'
        },
        {
            promotionName: 'asdfasdfasdfsadfasdfsadf3',
            promotionID: '12343',
            order: '2'
        },
        {
            promotionName: 'asdfasdfasdfsadfasdfsadf4',
            promotionID: '12344'
        },
    ],
    allAvailablePromotionList: [...availableList]

});

export const promotionAutoRunState = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_START:
            return $$state
                .set('isLoading', true);
        case SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS:
            return $$state
                .set('isLoading', false)
                .set('promotionList', Immutable.fromJS(action.payload[0] || []))
                .set('allAvailablePromotionList', Immutable.fromJS(action.payload[1] || []));
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
