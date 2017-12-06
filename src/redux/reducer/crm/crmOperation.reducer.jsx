import Immutable, { List } from 'immutable';
import {
    CRM_OPERATION_GET_CRM_CARD_INFO_OK,
    CRM_OPERATION_GET_CRM_SHOP_OK,
    CRM_OPERATION_GET_CRM_UUID_OK,
    CRM_OPERATION_UPDATE_SEARCH_MODAL_VISIBLE,
    CRM_OPERATION_UPDATE_DETAIL_MODAL_VISIBLE,
    CRM_OPERATION_UPDATE_DETAIL_MODAL_LOADING,
} from '../../actions/crm/crmOperation.action';

const $initialState = Immutable.fromJS({
    loading: false,
    cardInfo: {},
    shopStores: [],
    uuid: '',
    searchVisible: false,
    detailVisible: false,
    detailLoading: false,
});
export function crmOperation($$state = $initialState, action) {
    switch (action.type) {
        case CRM_OPERATION_GET_CRM_CARD_INFO_OK:
            return $$state.set('cardInfo', Immutable.fromJS(action.payload.dataSource));
        case CRM_OPERATION_GET_CRM_SHOP_OK:
            return $$state.set('shopStores', Immutable.fromJS(action.payload.shopSource));
        case CRM_OPERATION_GET_CRM_UUID_OK:
            return $$state.set('uuid', Immutable.fromJS(action.payload.uuid));
        case CRM_OPERATION_UPDATE_SEARCH_MODAL_VISIBLE:
            return $$state.set('searchVisible', action.visible);
        case CRM_OPERATION_UPDATE_DETAIL_MODAL_VISIBLE:
            return $$state.set('detailVisible', action.visible);
        case CRM_OPERATION_UPDATE_DETAIL_MODAL_LOADING:
            return $$state.set('detailLoading', action.loading);
        default:
            return $$state
    }
}
