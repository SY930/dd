import Immutable, { List } from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import {
    GIFT_FETCH_LIST_BEGIN,
    GIFT_FETCH_LIST_OK,
    GIFT_LIST_PARAMS,
    GIFT_FETCH_QUOTA_CARD_SUM_BEGIN,
    GIFT_FETCH_QUOTA_CARD_SUM_OK,
    GIFT_UPDATE_TAB_KEY,
    GIFT_UPDATE_BATCH_NO,
    GIFT_FETCH_LEVEL_OK,
    GIFT_FETCH_SCHEMA_OK,
    GIFT_FETCH_QUOTA_LIST_OK,
} from './_action';

const $initialState = Immutable.fromJS({
    loading: false,
    dataSource: [],
    selectedItem: {},
    listParams: {
        pageNo: '0',
        pageSize:'10',
    },
    quotaCardSumLoading: false,
    quotaCardSumSource: [],
    tabKey: 'send',
    batchNO: '',
    levelList: [],
    shopData: [],
    quotaList: [],
});
export function giftInfo($$state = $initialState, action) {
    switch(action.type) {
        case GIFT_FETCH_LIST_BEGIN:
            return $$state.set('loading', Immutable.fromJS(action.payload))
        case GIFT_FETCH_LIST_OK:
            return $$state.set('dataSource', Immutable.fromJS(action.payload.dataSource))
                    .set('loading', Immutable.fromJS(action.payload.loading))
        case GIFT_LIST_PARAMS:
            return $$state.set('listParams', Immutable.fromJS(action.payload))
        case GIFT_FETCH_QUOTA_CARD_SUM_BEGIN:
            return $$state.set('quotaCardSumLoading', Immutable.fromJS(action.payload))
        case GIFT_FETCH_QUOTA_CARD_SUM_OK:
            return $$state.set('quotaCardSumSource', Immutable.fromJS(action.payload.dataSource))
                    .set('quotaCardSumLoading', Immutable.fromJS(action.payload.loading))
        case GIFT_UPDATE_TAB_KEY:
            return $$state.set('tabKey', Immutable.fromJS(action.key))
        case GIFT_UPDATE_BATCH_NO:
            return $$state.set('batchNO', Immutable.fromJS(action.batchNO_madeCard))
        case GIFT_FETCH_LEVEL_OK:
            return $$state.set('levelList', Immutable.fromJS(action.payload.dataSource))
        case GIFT_FETCH_SCHEMA_OK:
            return $$state.set('shopData', Immutable.fromJS(action.payload.dataSource))
        case GIFT_FETCH_QUOTA_LIST_OK:
            return $$state.set('quotaList', Immutable.fromJS(action.payload.quotaList))
        default:
            return $$state
    }
}
