import { fetchData } from '../../../helpers/util';

export const CRM_OPERATION_GET_CRM_CARD_BEGIN = 'crm operation new:: get crm card info begin ';
export const CRM_OPERATION_GET_CRM_CARD_INFO_OK = 'crm operation new:: get crm card info ok';
export const CRM_OPERATION_GET_CRM_SHOP_OK = 'crm operation new:: get crm card shop';
export const CRM_OPERATION_GET_CRM_UUID_OK = 'crm operation new:: get crm card uuid';
export const CRM_OPERATION_UPDATE_SEARCH_MODAL_VISIBLE = 'crm operation new:: update search modal visible';
export const CRM_OPERATION_UPDATE_DETAIL_MODAL_VISIBLE = 'crm operation new:: update detail modal visible';
export const CRM_OPERATION_UPDATE_DETAIL_MODAL_LOADING = 'crm operation new:: update detail modal loading';

const getCrmCardInfoBegin = () => {
    return {
        type: CRM_OPERATION_GET_CRM_CARD_BEGIN,
    }
};

const getCrmCardInfoSuccessAC = (opt) => {
    return {
        type: CRM_OPERATION_GET_CRM_CARD_INFO_OK,
        ...opt,
    }
};

const getCrmOPerationShopSuccessAC = (opt) => {
    return {
        type: CRM_OPERATION_GET_CRM_SHOP_OK,
        ...opt,
    }
};

export const UpdateSearchModalVisible = (opt) => {
    return {
        type: CRM_OPERATION_UPDATE_SEARCH_MODAL_VISIBLE,
        ...opt,
    }
};

export const UpdateDetailModalVisible = (opt) => {
    return {
        type: CRM_OPERATION_UPDATE_DETAIL_MODAL_VISIBLE,
        ...opt,
    }
};

export const UpdateDetailModalLoading = (opt) => {
    return {
        type: CRM_OPERATION_UPDATE_DETAIL_MODAL_LOADING,
        ...opt,
    }
};

export const FetchCrmOperationShop = (opts) => {
    return (dispatch) => {
        fetchData('getCrmOperationShops_dkl', { ...opts }, null, {
            path: 'data',
        })
            .then((data) => {
                dispatch(getCrmOPerationShopSuccessAC({
                    payload: {
                        shopSource: data.cardUseShops || [],
                    },
                }));
            })
    }
};

export const FetchCrmOperationCardInfo = (opts) => {
    return (dispatch) => {
        dispatch(getCrmCardInfoBegin());
        return fetchData('getCrmInfo', { ...opts }, null, {
            path: 'data',
        })
            .then((data) => {
                const cardInfoArr = data.cardInfoResultList || [];
                const cardInfoJson = cardInfoArr[0] || {};
                dispatch(getCrmCardInfoSuccessAC({
                    payload: {
                        dataSource: cardInfoJson,
                    },
                }));
                return Promise.resolve(cardInfoJson);
            }).catch((err) => {
                return Promise.reject(err);
            });
    }
};

const getCrmOPerationUuidSuccessAC = (opt) => {
    return {
        type: CRM_OPERATION_GET_CRM_UUID_OK,
        ...opt,
    }
};

export const FetchCrmOperationUuid = (opts) => {
    return (dispatch) => {
        fetchData('crmOperationUUID_dkl', { ...opts }, null, {
            path: 'data',
        })
            .then((data) => {
                dispatch(getCrmOPerationUuidSuccessAC({
                    payload: {
                        uuid: data || [],
                    },
                }));
            });
    }
};
