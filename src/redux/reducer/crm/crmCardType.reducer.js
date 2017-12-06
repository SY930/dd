import Immutable from 'immutable';
import {
    CRMCARD_LIST,
    CRMCARD_PAGE_STYLE,
    CRMCARD_SELECT_CARD_TYPE_VISIBLE,
    CRMCARD_SELECT_CARD_TYPE,
} from '../../actions/crm/crmCardType.action.js';

const $$initialState = Immutable.fromJS({
    displayStyle: 'list',
    selectTypeVisible: false,
    // selectCardType: 'weixin',
    type: 'weixin',
    pageStyle: {
        contentHeight: '100%',
        tableHeight: '100%',
    },
});
export function crmCardType($$state = $$initialState, action) {
    switch (action.type) {
        case CRMCARD_LIST:
            return $$state
                .merge({ displayStyle: action.listType });
        case CRMCARD_PAGE_STYLE:
            return $$state
            // .set('Value',action.testValue)；
            // .update('Value',action.testValue);
                .merge({ pageStyle: action.pageStyle });
        case CRMCARD_SELECT_CARD_TYPE_VISIBLE:
            return $$state.set('selectTypeVisible', Immutable.fromJS(action.payload))
        case CRMCARD_SELECT_CARD_TYPE:
            return $$state.set('type', Immutable.fromJS(action.payload))
        default :
            return $$state;
    }
}
