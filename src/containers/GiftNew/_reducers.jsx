import Immutable, { List } from 'immutable';
import {
    GIFT_NEW_FETCH_LIST_BEGIN,
    GIFT_NEW_FETCH_LIST_OK,
    GIFT_NEW_LIST_PARAMS,
    GIFT_NEW_FETCH_QUOTA_CARD_SUM_BEGIN,
    GIFT_NEW_FETCH_QUOTA_CARD_SUM_OK,
    GIFT_NEW_UPDATE_TAB_KEY,
    GIFT_NEW_UPDATE_BATCH_NO,
    GIFT_NEW_FETCH_LEVEL_OK,
    GIFT_NEW_FETCH_SCHEMA_OK,
    GIFT_NEW_FETCH_QUOTA_LIST_OK,
    GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK,
    GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY,
    GIFT_NEW_UPDATE_SEND_OR_USED_PAGE,
    GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS,
    GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE,
    GIFT_NEW_GIFT_SORT_OK,
    GIFT_NEW_GET_SHARED_GIFTS,
    GIFT_NEW_EMPTY_GET_SHARED_GIFTS,
    GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO,
    GIFT_NEW_QUOTA_CARD_BATCHNO,
} from './_action';

const $initialState = Immutable.fromJS({
    loading: false,
    dataSource: [],
    selectedItem: {},
    listParams: {
        pageNo: '0',
        pageSize: '10',
    },
    quotaCardSumLoading: false,
    quotaCardSumSource: [],
    tabKey: 'send',
    batchNO: '',
    levelList: [],
    shopData: [],
    quotaList: [],
    sendorUsedList: [],
    sendorUsedKey: 'send',
    sendorUsedPage: {
        pageNo: 1,
        pageSize: 10,
        total: 10,
    },
    sendorUsedPrams: {

    },
    detailVisible: false,
    giftSort: [],
    sharedGifts: [],
    shopsByBatchNo: [],
    batchNoInfo: [],
});
export function giftInfoNew($$state = $initialState, action) {
    switch (action.type) {
        case GIFT_NEW_FETCH_LIST_BEGIN:
            return $$state.set('loading', Immutable.fromJS(action.payload))
        case GIFT_NEW_FETCH_LIST_OK:
            return $$state.set('dataSource', Immutable.fromJS(action.payload.dataSource))
                .set('loading', Immutable.fromJS(action.payload.loading))
        case GIFT_NEW_LIST_PARAMS:
            return $$state.set('listParams', Immutable.fromJS(action.payload))
        case GIFT_NEW_FETCH_QUOTA_CARD_SUM_BEGIN:
            return $$state.set('quotaCardSumLoading', Immutable.fromJS(action.payload))
        case GIFT_NEW_FETCH_QUOTA_CARD_SUM_OK:
            return $$state.set('quotaCardSumSource', Immutable.fromJS(action.payload.dataSource))
                .set('quotaCardSumLoading', Immutable.fromJS(action.payload.loading))
        case GIFT_NEW_UPDATE_TAB_KEY:
            return $$state.set('tabKey', Immutable.fromJS(action.key))
        case GIFT_NEW_UPDATE_BATCH_NO:
            return $$state.set('batchNO', Immutable.fromJS(action.batchNO_madeCard))
        case GIFT_NEW_FETCH_LEVEL_OK:
            return $$state.set('levelList', Immutable.fromJS(action.payload.dataSource))
        case GIFT_NEW_FETCH_SCHEMA_OK:
            return $$state.set('shopData', Immutable.fromJS(action.payload.dataSource))
        case GIFT_NEW_FETCH_QUOTA_LIST_OK:
            return $$state.set('quotaList', Immutable.fromJS(action.payload.quotaList))
        case GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK:
            return $$state.set('sendorUsedList', Immutable.fromJS(action.payload.sendorUsedList))
        case GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY:
            return $$state.set('sendorUsedKey', Immutable.fromJS(action.key))
        case GIFT_NEW_UPDATE_SEND_OR_USED_PAGE:
            return $$state.set('sendorUsedPage', Immutable.fromJS(action.page))
        case GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS:
            return $$state.set('sendorUsedParams', Immutable.fromJS(action.params))
        case GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE:
            return $$state.set('detailVisible', Immutable.fromJS(action.visible))
        case GIFT_NEW_GIFT_SORT_OK:
            return $$state.set('giftSort', Immutable.fromJS(action.payload.dataSource))
        case GIFT_NEW_GET_SHARED_GIFTS:
            return $$state.set('sharedGifts', Immutable.fromJS(action.payload.dataSource))
        case GIFT_NEW_EMPTY_GET_SHARED_GIFTS:
            return $$state.set('sharedGifts', Immutable.fromJS(action.payload))
        case GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO:
            return $$state.set('shopsByBatchNo', Immutable.fromJS(action.payload.dataSource))
        case GIFT_NEW_QUOTA_CARD_BATCHNO:
            return $$state.set('batchNoInfo', Immutable.fromJS(action.payload.dataSource))
        default:
            return $$state
    }
}
