import {axiosData, fetchData} from '../../helpers/util';
import _ from 'lodash';
export const GIFT_FETCH_LIST_BEGIN = 'gift:: fetch list';
export const GIFT_FETCH_LIST_OK = 'gift:: fetch list ok';
export const GIFT_LIST_PARAMS = 'gift:: update list params';
export const GIFT_FETCH_QUOTA_CARD_SUM_BEGIN = 'gift:: get quota card sum begin';
export const GIFT_FETCH_QUOTA_CARD_SUM_OK = 'gift:: get quota card sum ok';
export const GIFT_UPDATE_TAB_KEY = 'gift:: update tab key';
export const GIFT_UPDATE_BATCH_NO = 'gift:: update batch NO';
export const GIFT_FETCH_LEVEL_OK = 'gift::  fetch level ok';
export const GIFT_FETCH_SCHEMA_OK = 'gift:: fetch schema ok';
export const GIFT_FETCH_QUOTA_LIST_OK = 'gift new :: fetch quota list';


const getGiftListBegin = opt => {
    return {
        type: GIFT_FETCH_LIST_BEGIN,
        payload: opt,
    }
};
const getGiftListSuccessAC = (opt) => {
    return {
        type: GIFT_FETCH_LIST_OK,
        ...opt
    }
};
const updateGiftListParams = opt => {
    return {
        type: GIFT_LIST_PARAMS,
        payload: opt,
    }
}
export const FetchGiftList = (opts) => {
    return dispatch => {
        dispatch(getGiftListBegin(true));
        return fetchData('getGifts', {...opts}, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getGiftListSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    }
                }));
                dispatch(updateGiftListParams(opts));
                return Promise.resolve(records);
            }).catch(err => {
                dispatch(getGiftListBegin(false));
            });
    }
};
const getQuotaCardSumBegin = opt => {
    return {
        type: GIFT_FETCH_QUOTA_CARD_SUM_BEGIN,
        payload: opt,
    }
};
const getQuotaCardSumSuccessAC = (opt) => {
    return {
        type: GIFT_FETCH_QUOTA_CARD_SUM_OK,
        ...opt
    }
};
export const FetchQuotaCardSum = (opts) => {
    return dispatch => {
        dispatch(getQuotaCardSumBegin(true));
        return fetchData('getQuotaSummary', {...opts}, null, {
                path: 'data.summary'
            })
            .then(records => {
                dispatch(getQuotaCardSumSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    }
                }));
                return Promise.resolve(records);
            });
    }
};
export const FetchCardTypeList = (opts) => {
    return dispatch => {
        return fetchData('getSetUsedLevels_dkl', {...opts}, null, {
                path: 'data.groupCardTypeList'
            })
            .then(records => {
                dispatch(getQuotaCardSumSuccessAC({
                    payload: {
                        dataSource: records || [],
                        loading: false,
                    }
                }));
                return Promise.resolve(records);
            });
    }
};
export const UpdateTabKey = opts => {
    return {
        type: GIFT_UPDATE_TAB_KEY,
        ...opts
    }
}
export const UpdateBatchNO = opts => {
    return {
        type: GIFT_UPDATE_BATCH_NO,
        ...opts
    }
}
export const getGiftLevelSuccessAC = (opt) => {
    return {
        type: GIFT_FETCH_LEVEL_OK,
        ...opt
    }
};
export const FetchGiftLevel = (opts) => {
    return dispatch => {
        return fetchData('getSetUsedLevels_dkl', { ...opts }, null, {
                path: 'data.groupCardTypeList'
            })
            .then(records => {
                dispatch(getGiftLevelSuccessAC({
                    payload: {
                        dataSource: records || [],
                    }
                }));
                return Promise.resolve(records);
            });
    }
};

export const getGiftSchemaSuccessAC = (opt) => {
    return {
        type: GIFT_FETCH_SCHEMA_OK,
        ...opt
    }
};
export const FetchGiftSchema = (opts) => {
    return dispatch => {
        return axiosData('/crm/groupShopService_findSchemaShopcenter.ajax', {}, {}, {path: 'data.shop'})
            .then(records => {
                dispatch(getGiftSchemaSuccessAC({
                    payload: {
                        dataSource: records || [],
                    }
                }));
                return Promise.resolve(records);
            });
    }
};

export const getQuotaListSuccessAC = (opt) => {
    return {
        type: GIFT_FETCH_QUOTA_LIST_OK,
        ...opt
    }
};

export const FetchQuotaList = (opts) => {
    return dispatch => {
        return fetchData(opts.callserver, {...opts.params}, null, {
            path: 'data',
        })
            .then(records => {
                dispatch(getQuotaListSuccessAC({
                    payload: {
                        quotaList: records || [],
                    }
                }));
                return Promise.resolve(records);
            });
    }
};
