import { fetchData } from '../../helpers/util';

export const GIFT_NEW_FETCH_LIST_BEGIN = 'gift new:: fetch list';
export const GIFT_NEW_FETCH_LIST_OK = 'gift new :: fetch list ok';
export const GIFT_NEW_LIST_PARAMS = 'gift new :: update list params';
export const GIFT_NEW_FETCH_QUOTA_CARD_SUM_BEGIN = 'gift new :: get quota card sum begin';
export const GIFT_NEW_FETCH_QUOTA_CARD_SUM_OK = 'gift new :: get quota card sum ok';
export const GIFT_NEW_UPDATE_TAB_KEY = 'gift new:: update tab key';
export const GIFT_NEW_UPDATE_BATCH_NO = 'gift new :: update batch NO';
export const GIFT_NEW_FETCH_LEVEL_OK = 'gift new ::  fetch level ok';
export const GIFT_NEW_FETCH_SCHEMA_OK = 'gift new :: fetch schema ok';
export const GIFT_NEW_FETCH_QUOTA_LIST_OK = 'gift new :: fetch quota list';
export const GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK = 'gift new:: fetch send or used list';
export const GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY = 'gift new:: update send or used key';
export const GIFT_NEW_UPDATE_SEND_OR_USED_PAGE = 'gift new:: update send or used page';
export const GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS = 'gift new:: update send or used params';
export const GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE = 'gift new:: update detail modal visible';
export const GIFT_NEW_GIFT_SORT_OK = 'gift new:: get gift sort';
export const GIFT_NEW_GET_SHARED_GIFTS = 'gift new:: get shared gifts';
export const GIFT_NEW_EMPTY_GET_SHARED_GIFTS = 'gift new:: empty get shared gifts';
export const GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO = 'gift new :: get quota card shop by batchNo';
export const GIFT_NEW_QUOTA_CARD_BATCHNO = 'gift new :: get quota card batchNo';

const getGiftListBegin = (opt) => {
    return {
        type: GIFT_NEW_FETCH_LIST_BEGIN,
        payload: opt,
    }
};
const getGiftListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_LIST_OK,
        ...opt,
    }
};
const updateGiftListParams = (opt) => {
    return {
        type: GIFT_NEW_LIST_PARAMS,
        payload: opt,
    }
}
export const FetchGiftList = (opts) => {
    return (dispatch) => {
        dispatch(getGiftListBegin(true));
        return fetchData('getGifts_dkl', { ...opts }, null, {
            path: '',
        })
            .then((records) => {
                dispatch(getGiftListSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    },
                }));
                dispatch(updateGiftListParams(opts));
                return Promise.resolve(records);
            }).catch((err) => {
                dispatch(getGiftListBegin(false));
            });
    }
};
const getQuotaCardSumBegin = (opt) => {
    return {
        type: GIFT_NEW_FETCH_QUOTA_CARD_SUM_BEGIN,
        payload: opt,
    }
};
const getQuotaCardSumSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_QUOTA_CARD_SUM_OK,
        ...opt,
    }
};
export const FetchQuotaCardSum = (opts) => {
    return (dispatch) => {
        dispatch(getQuotaCardSumBegin(true));
        return fetchData('getQuotaSummary_dkl', { ...opts }, null, {
            path: 'data.summary',
        })
            .then((records) => {
                dispatch(getQuotaCardSumSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    },
                }));
                return Promise.resolve(records);
            });
    }
};
export const FetchCardTypeList = (opts) => {
    return (dispatch) => {
        return fetchData('getSetUsedLevels_dkl', { ...opts }, null, {
            path: 'data.groupCardTypeList',
        })
            .then((records) => {
                dispatch(getQuotaCardSumSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    },
                }));
                return Promise.resolve(records);
            });
    }
};
export const UpdateTabKey = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_TAB_KEY,
        ...opts,
    }
}
export const UpdateBatchNO = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_BATCH_NO,
        ...opts,
    }
}
export const getGiftLevelSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_LEVEL_OK,
        ...opt,
    }
};
export const FetchGiftLevel = (opts) => {
    return (dispatch) => {
        return fetchData('getSetUsedLevels_dkl', { ...opts }, null, {
            path: 'data.groupCardTypeList',
        })
            .then((records) => {
                dispatch(getGiftLevelSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const getGiftSchemaSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_SCHEMA_OK,
        ...opt,
    }
};
export const FetchGiftSchema = (opts) => {
    return (dispatch) => {
        return fetchData('getSchema', { ...opts }, null, {
            path: 'data.shops',
        })
            .then((records) => {
                dispatch(getGiftSchemaSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const getQuotaListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_QUOTA_LIST_OK,
        ...opt,
    }
};

export const FetchQuotaList = (opts) => {
    return (dispatch) => {
        return fetchData(opts.callserver, { ...opts.params }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getQuotaListSuccessAC({
                    payload: {
                        quotaList: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const getSendorUsedListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK,
        ...opt,
    }
};

export const FetchSendorUsedList = (opts) => {
    return (dispatch) => {
        return fetchData('getGiftUsageInfo_dkl', { ...opts.params }, null, {
            path: '',
        })
            .then((records) => {
                dispatch(getSendorUsedListSuccessAC({
                    payload: {
                        sendorUsedList: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const UpdateSendorUsedTabKey = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY,
        ...opts,
    }
}

export const UpdateSendorUsedPage = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_SEND_OR_USED_PAGE,
        ...opts,
    }
}

export const UpdateSendorUsedParams = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS,
        ...opts,
    }
}

export const UpdateDetailModalVisible = (opts) => {
    return {
        type: GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE,
        ...opts,
    }
}

const getGiftSortSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_GIFT_SORT_OK,
        ...opt,
    }
};
export const FetchGiftSort = (opts) => {
    return (dispatch) => {
        return fetchData('getSortedGifts_dkl', { ...opts }, null, {
            path: 'crmGiftTypes',
        })
            .then((records) => {
                dispatch(getGiftSortSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

const getSharedGiftsSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_GET_SHARED_GIFTS,
        ...opt,
    }
};
export const FetchSharedGifts = (opts) => {
    return (dispatch) => {
        return fetchData('getSharedGifts', { ...opts }, null, {
            path: '',
        })
            .then((records) => {
                dispatch(getSharedGiftsSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const emptyGetSharedGifts = () => {
    return {
        type: GIFT_NEW_EMPTY_GET_SHARED_GIFTS,
        payload: {},
    }
};
export const CrmBatchSellGiftCards = (opts) => {
    return (dispatch) => {
        return fetchData('crmBatchSellGiftCards', { ...opts }, null, {
            path: '',
        })
            .then((data) => {
                return Promise.resolve(data);
            });
    }
};

export const getQuotaCardShopByBatchNoAC = (opt) => {
    return {
        type: GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO,
        ...opt,
    }
};
export const FetchQuotaCardShopByBatchNo = (opts) => {
    return (dispatch) => {
        return fetchData('getCardTypeShopListByBatchNo', { ...opts }, null, {
            path: 'data.cardTypeShopResDetailList',
        })
            .then((records = []) => {
                dispatch(getQuotaCardShopByBatchNoAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};
export const getQuotaCardBatchNoAC = (opt) => {
    return {
        type: GIFT_NEW_QUOTA_CARD_BATCHNO,
        ...opt,
    }
};
export const FetchQuotaCardBatchNo = (opts) => {
    return (dispatch) => {
        return fetchData('getQuotaBatchInfo_dkl', { ...opts }, null, {
            path: 'data.quotaCardList',
        })
            .then((records = []) => {
                dispatch(getQuotaCardBatchNoAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};
