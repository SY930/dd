import { fetchData } from '../../../helpers/util';

export const CRMCARD_LIST = 'crm card new:: CRMCARD_LIST';
export const CRMCARD_PAGE_STYLE = 'crm card new:: CRMCARD_PAGE_STYLE';
export const CRMCARD_SELECT_CARD_TYPE_VISIBLE = 'crm card type new:: select card type visible';
export const CRMCARD_SELECT_CARD_TYPE = 'crm card new:: select card type';
export const CRM_CARD_TYPE_ALL_CHANNEL_INFO_OK = 'crm card new:: get all crm channel info';
export const CRM_CARD_TYPE_GET_SCHEMA_DATA = 'crm card new:: get schema data';
export const CRM_CARD_TYPE_GET_FSM_SETTLE_UNIT_DATA = 'crm card new:: get fsm settle unit data';
export const CRM_CARD_TYPE_GET_CARD_LIST_LOADING = 'crm card new:: get crm card type list loading';
export const CRM_CARD_TYPE_GET_CARD_LIST = 'crm card new:: get crm card type list';
export const CRM_CARD_TYPE_SORT = 'crm card new:: crm card type sort';
export const CRM_CARD_TYPE_PARAMS = 'crm card new:: crm card type params';
export const CRM_CARD_TYPE_SELECTED_SHOPS = 'crm card:: get selected shops';
export const CRM_CARD_TYPE_BASE_FORM_DATA = 'CRM CARD:: get crm card base form data';
export const CRM_CARD_TYPE_BASE_FORM_DATA_RESET = 'CRM CARD:: reset crm card base form data';
export function clickPic(value) {
    return {
        type: CRMCARD_LIST,
        listType: value,
    }
}
export function pageStyle(value) {
    return {
        type: CRMCARD_PAGE_STYLE,
        pageStyle: value,
    }
}

export function UpdateSelectCardVisible(value) {
    return {
        type: CRMCARD_SELECT_CARD_TYPE_VISIBLE,
        payload: value.visible,
    }
}

export function UpdateSelectCardType(value) {
    return {
        type: CRMCARD_SELECT_CARD_TYPE,
        payload: value.type,
    }
}

const getCrmAllChannelInfoSuccessAC = (opt) => {
    return {
        type: CRM_CARD_TYPE_ALL_CHANNEL_INFO_OK,
        ...opt,
    }
};

export const FetchAllChannelInfo = () => {
    return (dispatch) => {
        return fetchData('getAllChannelInfo', {}, null, {
            path: 'data.crmChannelInfoDetailList',
        })
            .then((records) => {
                dispatch(getCrmAllChannelInfoSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const loadStores = (params = {}) => {
    return (dispatch) => {
        return fetchData('getSchema', params, null, {
            path: 'data.shops',
        }).then((stores = []) => {
            const _stores = stores || []
            dispatch({
                type: CRM_CARD_TYPE_GET_SCHEMA_DATA,
                payload: {
                    shopStores: _stores,
                },
            });
            return Promise.resolve(_stores);
        });
    };
}

const getFsmSettleUnitSuccessAC = (opt) => {
    return {
        type: CRM_CARD_TYPE_GET_FSM_SETTLE_UNIT_DATA,
        ...opt,
    }
};

export const FetchFsmSettleUnit = (opts) => {
    return (dispatch) => {
        return fetchData('getFsmSettleUnit', { ...opts }, null, {
            path: 'data.records',
        })
            .then((records) => {
                dispatch(getFsmSettleUnitSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            });
    }
};

export const GetCrmCardTypeLstSuccess = (opt) => {
    return {
        type: CRM_CARD_TYPE_GET_CARD_LIST,
        ...opt,
    }
};

const UpdateCrmCardTypeParams = (opt) => {
    return {
        type: CRM_CARD_TYPE_PARAMS,
        payload: opt,
    }
}

const getShopCreditListBegin = (opt) => {
    return {
        type: CRM_CARD_TYPE_GET_CARD_LIST_LOADING,
        payload: opt,
    }
};

export const FetchCrmCardTypeLst = (opts) => {
    return (dispatch) => {
        dispatch(getShopCreditListBegin(true));
        return fetchData('getCrmCardList_dkl', { ...opts }, null, {
            path: 'data.cardTypeParamsDataList',
        })
            .then((records) => {
                dispatch(GetCrmCardTypeLstSuccess({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                dispatch(UpdateCrmCardTypeParams(opts));
                return Promise.resolve(records);
            })
            .catch(() => {
                dispatch(getShopCreditListBegin(false));
            })
    }
};

export const CardTypeSort = (opts) => {
    return (dispatch) => {
        return fetchData('cardTypeSort', { ...opts }, null, { path: '' })
            .then((records) => {
                dispatch({
                    type: CRM_CARD_TYPE_SORT,
                    payload: records,
                });
                return Promise.resolve(records);
            });
    }
}

export const UpdateCrmCardSelectedShops = (opt) => {
    return {
        type: CRM_CARD_TYPE_SELECTED_SHOPS,
        ...opt,
    }
};

export const FetchSelectedShops = (opts) => {
    return (dispatch) => {
        return fetchData('getCardTypeSelectedShops_dkl', { ...opts }, null, {
            path: 'data',
        })
            .then((data = []) => {
                const records = data.cardTypeShopResDetailList || [];
                const _records = records.map(shop => String(shop.shopID));
                dispatch(UpdateCrmCardSelectedShops({
                    payload: {
                        dataSource: _records || [],
                    },
                }));
                return Promise.resolve(_records);
            });
    }
}

export const UpdateCrmCardBaseFormData = (opt) => {
    return {
        type: CRM_CARD_TYPE_BASE_FORM_DATA,
        ...opt,
    }
};

export const FetchCrmCardTypeBaseFormData = (opts) => {
    return (dispatch) => {
        return fetchData('getCrmCardDetailByID_dkl', { ...opts }, null, {
            path: 'data.cardTypeParamsDataList',
        })
            .then((data = []) => {
                dispatch(UpdateCrmCardBaseFormData({
                    payload: {
                        dataSource: data[0] || {},
                    },
                }));
                return Promise.resolve(data[0]);
            });
    }
}

export const ResetCrmCardBaseFormData = (opt) => {
    return {
        type: CRM_CARD_TYPE_BASE_FORM_DATA_RESET,
        ...opt,
    }
};
