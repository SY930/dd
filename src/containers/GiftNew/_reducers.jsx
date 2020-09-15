import Immutable, { List } from 'immutable';

// 定义参考 ../action.jsx 文件
import {
    GIFT_NEW_FETCH_LIST_BEGIN,
    GIFT_NEW_FETCH_LIST_OK,
    GIFT_NEW_FETCH_ALL_LIST_OK,
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
    GIFT_NEW_QUOTA_CARD_CANSELL_LIST,
    GIFT_NEW_QUERY_WECHAT_MPINFO_START,
    GIFT_NEW_QUERY_WECHAT_MPINFO_SUCCESS,
    GIFT_NEW_QUERY_WECHAT_MPINFO_FAIL,
    GIFT_NEW_FETCH_SEND_TOTAL_OK,
    GIFT_NEW_FETCH_USED_TOTAL_OK,
    GIFT_NEW_RESET_SEND_USED_TOTAL,
    GIFT_NEW_START_CREATE_GIFT,
    GIFT_NEW_START_EDIT_GIFT,
    GIFT_NEW_CANCEL_START_SAVING_GIFT,
    GIFT_NEW_CANCEL_END_SAVING_GIFT,
    GIFT_NEW_CANCEL_CREATE_EDIT_GIFT,
    GIFT_NEW_CHANGE_FORM_KEY_VALUE,
    GIFT_NEW_FETCH_SEND_LIST_OK,
    GIFT_NEW_FETCH_USED_LIST_OK,
    GIFT_NEW_SAVE_BRANDS_TO_STORE,
} from './_action';

const $initialEditState = Immutable.fromJS({
    isCreatingOrEditing: false,
    currentGiftType: null,
    operationType: 'add',
    loading: false,
    createOrEditFormData: {
    },
    allBrands: [],
});
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
    sendList: [],
    usedList: [],
    sendorUsedKey: 'send',
    redPacketInfoList: [],
    sendorUsedPage: {
        pageNo: 1,
        pageSize: 10,
        total: 10,
    },
    sendorUsedPrams: {

    },
    totalSendCount: 0,
    totalUsedCount: 0,
    detailVisible: false,
    giftSort: [],
    allGiftList: [],
    sharedGifts: [],
    shopsByBatchNo: [],
    batchNoInfo: [],
    quotaCardCanSellInfo: [],
    mpList: [],
    mpListLoading: false,
});


export function editGiftInfoNew($$state = $initialEditState, action) {
    switch (action.type) {
        // 创建建礼品
        case GIFT_NEW_START_CREATE_GIFT:
            return $$state
                .set('isCreatingOrEditing', true)
                .set('operationType', 'add')
                .set('currentGiftType', action.payload.value)
                .set('createOrEditFormData', Immutable.fromJS(action.payload.data))
                ;
        // 编辑礼品
        case GIFT_NEW_START_EDIT_GIFT:
            return $$state
                .set('isCreatingOrEditing', true)
                .set('operationType', action.payload.operationType)
                .set('currentGiftType', action.payload.value)
                .set('createOrEditFormData', Immutable.fromJS(action.payload.data))
                ;
        case GIFT_NEW_CANCEL_CREATE_EDIT_GIFT:
            return $$state
                .set('isCreatingOrEditing', false)
                .set('currentGiftType', null)
                .set('operationType', 'add')
                .set('createOrEditFormData', Immutable.fromJS({}))
                ;
        case GIFT_NEW_CANCEL_START_SAVING_GIFT:
            return $$state
                .set('loading', true);
        case GIFT_NEW_CANCEL_END_SAVING_GIFT:
            return $$state
                .set('loading', false);
        case GIFT_NEW_CHANGE_FORM_KEY_VALUE:
            return $$state
                .setIn(['createOrEditFormData', action.payload.key], Immutable.fromJS(action.payload.value))
                ;
        case GIFT_NEW_SAVE_BRANDS_TO_STORE:
            return $$state.set('allBrands', Immutable.fromJS(action.payload));
        default:
            return $$state
    }
}
export function giftInfoNew($$state = $initialState, action) {
    switch (action.type) {
        case GIFT_NEW_FETCH_LIST_BEGIN:
            return $$state.set('loading', Immutable.fromJS(action.payload));
        case GIFT_NEW_FETCH_LIST_OK:
            return $$state
                .set('dataSource', Immutable.fromJS(action.payload.dataSource))
                .set('loading', Immutable.fromJS(action.payload.loading));
        case GIFT_NEW_FETCH_ALL_LIST_OK:
            // 之前状态结构不太合理, 故采用新的字段存储, 防止对旧组件产生影响
            return $$state
                .set('allGiftList',
                    Immutable.fromJS(
                        Array.isArray(action.payload.dataSource) ?
                            []
                            :
                            (action.payload.dataSource || { crmGiftList: [] }).crmGiftList
                    )
                );
        case GIFT_NEW_LIST_PARAMS:
            return $$state.set('listParams', Immutable.fromJS(action.payload));
        case GIFT_NEW_FETCH_QUOTA_CARD_SUM_BEGIN:
            return $$state.set('quotaCardSumLoading', Immutable.fromJS(action.payload));
        case GIFT_NEW_FETCH_QUOTA_CARD_SUM_OK:
            return $$state.set('quotaCardSumSource', Immutable.fromJS(action.payload.dataSource))
                .set('quotaCardSumLoading', Immutable.fromJS(action.payload.loading));
        case GIFT_NEW_UPDATE_TAB_KEY:
            return $$state.set('tabKey', Immutable.fromJS(action.key));
        case GIFT_NEW_UPDATE_BATCH_NO:
            return $$state.set('batchNO', Immutable.fromJS(action.batchNO_madeCard));
        case GIFT_NEW_FETCH_LEVEL_OK:
            return $$state.set('levelList', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_FETCH_SCHEMA_OK:
            return $$state.set('shopData', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_FETCH_QUOTA_LIST_OK:
            return $$state.set('quotaList', Immutable.fromJS(action.payload.quotaList));
        case GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK:
            return $$state.set('sendorUsedList', Immutable.fromJS(action.payload.sendorUsedList));
        case GIFT_NEW_FETCH_SEND_LIST_OK:
            // 实际是一个obj,不是list
            const sendorUsedList = action.payload.sendorUsedList;
            return $$state
            .set('sendList', Immutable.fromJS(sendorUsedList))
            .set('redPacketInfoList',  Immutable.fromJS(sendorUsedList.summaryByGiftStatusList || []));
        case GIFT_NEW_FETCH_USED_LIST_OK:
            return $$state.set('usedList', Immutable.fromJS(action.payload.sendorUsedList));
        case GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY:
            return $$state.set('sendorUsedKey', Immutable.fromJS(action.key));
        case GIFT_NEW_UPDATE_SEND_OR_USED_PAGE:
            return $$state.set('sendorUsedPage', Immutable.fromJS(action.page));
        case GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS:
            return $$state.set('sendorUsedParams', Immutable.fromJS(action.params));
        case GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE:
            return $$state.set('detailVisible', Immutable.fromJS(action.visible));
        case GIFT_NEW_GIFT_SORT_OK:
            return $$state.set('giftSort', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_GET_SHARED_GIFTS:
            return $$state.set('sharedGifts', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_EMPTY_GET_SHARED_GIFTS:
            return $$state.set('sharedGifts', Immutable.fromJS(action.payload));
        case GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO:
            return $$state.set('shopsByBatchNo', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_QUOTA_CARD_BATCHNO:
            return $$state.set('batchNoInfo', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_QUOTA_CARD_CANSELL_LIST:
            return $$state.set('quotaCardCanSellInfo', Immutable.fromJS(action.payload.dataSource));
        case GIFT_NEW_FETCH_SEND_TOTAL_OK:
            return $$state.set('totalSendCount', action.payload.total || 0);
        case GIFT_NEW_FETCH_USED_TOTAL_OK:
            return $$state.set('totalUsedCount', action.payload.total || 0);
        case GIFT_NEW_RESET_SEND_USED_TOTAL:
            return $$state
                .set('sendList', Immutable.fromJS([]))
                .set('usedList', Immutable.fromJS([]))
                .set('redPacketInfoList', Immutable.fromJS([]))
                .set('totalUsedCount', 0)
                .set('totalSendCount', 0);
        case GIFT_NEW_QUERY_WECHAT_MPINFO_START:
            return $$state.set('mpListLoading', true);
        case GIFT_NEW_QUERY_WECHAT_MPINFO_SUCCESS:
            return $$state.set('mpList', Immutable.fromJS(action.payload)).set('mpListLoading', false);
        case GIFT_NEW_QUERY_WECHAT_MPINFO_FAIL:
            return $$state.set('mpListLoading', false);
        default:
            return $$state
    }
}
