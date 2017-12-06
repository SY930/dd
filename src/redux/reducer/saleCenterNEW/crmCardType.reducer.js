import Immutable from 'immutable';
import {
    CRMCARD_LIST,
    CRMCARD_PAGE_STYLE,
    CRMCARD_SELECT_CARD_TYPE_VISIBLE,
    CRMCARD_SELECT_CARD_TYPE,
    CRM_CARD_TYPE_ALL_CHANNEL_INFO_OK,
    CRM_CARD_TYPE_GET_SCHEMA_DATA,
    CRM_CARD_TYPE_GET_FSM_SETTLE_UNIT_DATA,
    CRM_CARD_TYPE_GET_CARD_LIST_LOADING,
    CRM_CARD_TYPE_GET_CARD_LIST,
    CRM_CARD_TYPE_PARAMS,
    CRM_CARD_TYPE_SELECTED_SHOPS,
    CRM_CARD_TYPE_BASE_FORM_DATA,
    CRM_CARD_TYPE_BASE_FORM_DATA_RESET,
} from '../../actions/saleCenterNEW/crmCardType.action.js';

const $$initialState = Immutable.fromJS({
    displayStyle: 'list',
    selectTypeVisible: false,
    // selectCardType: 'weixin',
    type: 'weixin',
    loading: false,
    pageStyle: {
        contentHeight: '100%',
        tableHeight: '100%',
    },
    allChannelInfo: [],
    shopStores: [],
    fsmSettleUnit: [],
    cardTypeLst: [],
    params: {},
    stepTwo: {
        selectedShops: [],
        totalShops: [],
    },
    selectedBaseFormData: {},
});
export function crmCardTypeNew($$state = $$initialState, action) {
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
        case CRM_CARD_TYPE_ALL_CHANNEL_INFO_OK:
            return $$state.set('allChannelInfo', Immutable.fromJS(action.payload.dataSource))
        case CRM_CARD_TYPE_GET_SCHEMA_DATA:
            return $$state.set('shopStores', Immutable.fromJS(action.payload.shopStores))
        case CRM_CARD_TYPE_GET_FSM_SETTLE_UNIT_DATA:
            return $$state.set('fsmSettleUnit', Immutable.fromJS(action.payload.dataSource))
        case CRM_CARD_TYPE_GET_CARD_LIST_LOADING:
            return $$state.set('loading', Immutable.fromJS(action.payload))
        case CRM_CARD_TYPE_GET_CARD_LIST:
            return $$state.set('cardTypeLst', Immutable.fromJS(action.payload.dataSource))
                .set('loading', false)
        case CRM_CARD_TYPE_PARAMS:
            return $$state.set('params', Immutable.fromJS(action.payload))
        case CRM_CARD_TYPE_SELECTED_SHOPS:
            return $$state.setIn(['stepTwo', 'selectedShops'], Immutable.fromJS(action.payload.dataSource))
        case CRM_CARD_TYPE_BASE_FORM_DATA:
            return $$state.mergeDeep({ selectedBaseFormData: Immutable.fromJS(action.payload.dataSource) })
        case CRM_CARD_TYPE_BASE_FORM_DATA_RESET:
            return $$state.set('selectedBaseFormData', Immutable.fromJS({}))
                .setIn(['stepTwo', 'selectedShops'], Immutable.fromJS([]))
        default :
            return $$state;
    }
}
