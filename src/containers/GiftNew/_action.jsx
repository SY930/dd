import { fetchData, axiosData } from '../../helpers/util';

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
export const GIFT_NEW_FETCH_SEND_LIST_OK = 'gift new:: fetch send list';
export const GIFT_NEW_FETCH_USED_LIST_OK = 'gift new:: fetch used list';
export const GIFT_NEW_FETCH_USED_TOTAL_OK = 'gift new:: 成功获取到发送数';
export const GIFT_NEW_FETCH_SEND_TOTAL_OK = 'gift new:: 成功获取到使用数';

export const GIFT_NEW_FETCH_USED_TOTAL_FAIL = 'gift new:: 未能成功获取到发送数';
export const GIFT_NEW_FETCH_SEND_TOTAL_FAIL = 'gift new:: 未能获取到使用数';
export const GIFT_NEW_RESET_SEND_USED_TOTAL = 'gift new:: 重置发出使用数为0';
export const GIFT_NEW_UPDATE_SEND_OR_USED_TAB_KEY = 'gift new:: update send or used key';
export const GIFT_NEW_UPDATE_SEND_OR_USED_PAGE = 'gift new:: update send or used page';
export const GIFT_NEW_UPDATE_SEND_OR_USED_PARAMS = 'gift new:: update send or used params';
export const GIFT_NEW_UPDATE_DETAIL_MODAL_VISIBLE = 'gift new:: update detail modal visible';
export const GIFT_NEW_GIFT_SORT_OK = 'gift new:: get gift sort';
export const GIFT_NEW_GET_SHARED_GIFTS = 'gift new:: get shared gifts';
export const GIFT_NEW_EMPTY_GET_SHARED_GIFTS = 'gift new:: empty get shared gifts';
export const GIFT_NEW_QUOTA_CARD_SHOP_BY_BATCHNO = 'gift new :: get quota card shop by batchNo';
export const GIFT_NEW_QUOTA_CARD_BATCHNO = 'gift new :: get quota card batchNo';
export const GIFT_NEW_QUERY_WECHAT_MPINFO_START = 'gift new :: query wechat mpinfo start';
export const GIFT_NEW_QUERY_WECHAT_MPINFO_SUCCESS = 'gift new :: query wechat mpinfo success';
export const GIFT_NEW_QUERY_WECHAT_MPINFO_FAIL = 'gift new :: query wechat mpinfo fail';
export const GIFT_NEW_START_CREATE_GIFT = 'gift new :: 开始新建礼品模板';
export const GIFT_NEW_START_EDIT_GIFT = 'gift new :: 开始编辑礼品模板';
export const GIFT_NEW_CANCEL_CREATE_EDIT_GIFT = 'gift new :: 取消新建或编辑礼品模板';
export const GIFT_NEW_CANCEL_START_SAVING_GIFT = 'gift new :: 开始保存礼品模板(loading状态开始)';
export const GIFT_NEW_CANCEL_END_SAVING_GIFT = 'gift new :: 保存礼品模板结束(loading状态结束)';
export const GIFT_NEW_CHANGE_FORM_KEY_VALUE = 'gift new :: 礼品字段变更';

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
        return axiosData('/coupon/couponService_getBoards.ajax', { ...opts }, null, {
            path: 'data',
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
        return axiosData('/coupon/couponQuotaService_getQuotaCardSummary.ajax', { ...opts }, null, {
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
            }).catch(err => {
                // empty catch
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
            }).catch(err => {
                // empty catch
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
            }).catch(err => {
                // empty catch
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
        return axiosData('/crm/groupShopService_findSchemaShopcenter.ajax', {}, {}, {path: 'data.shops'})
            .then((records) => {
                dispatch(getGiftSchemaSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            }).catch(err => {
                // empty catch
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
        return axiosData(opts.callserver, { ...opts.params }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getQuotaListSuccessAC({
                    payload: {
                        quotaList: records || [],
                    },
                }));
                return Promise.resolve(records);
            }).catch(err => {
                // empty catch
            });
    }
};

export const getSendorUsedListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_SEND_OR_USED_LIST_OK,
        ...opt,
    }
};

export const getSendListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_SEND_LIST_OK,
        ...opt,
    }
};

export const getUsedListSuccessAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_USED_LIST_OK,
        ...opt,
    }
};

export const getUsedTotalCountSuccessAC = (total) => {
    return {
        type: GIFT_NEW_FETCH_USED_TOTAL_OK,
        payload: {total},
    }
};

export const getSendTotalCountSuccessAC = (total) => {
    return {
        type: GIFT_NEW_FETCH_SEND_TOTAL_OK,
        payload: {total},
    }
};

export const getUsedTotalCountFailAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_USED_TOTAL_FAIL,
        ...opt,
    }
};

export const getSendTotalCountFailAC = (opt) => {
    return {
        type: GIFT_NEW_FETCH_SEND_TOTAL_FAIL,
        ...opt,
    }
};

export const resetSendOrTotalCount = (opt) => {
    return {
        type: GIFT_NEW_RESET_SEND_USED_TOTAL,
        ...opt,
    }
};

export const FetchSendorUsedList = (opts) => {
    return (dispatch) => {

        const sendOrUsageCountParam = {
            pageSize: 1,
            pageNo: 0,
            giftItemID: opts.params.giftItemID,
        };
        if (!opts.isSend) {
            sendOrUsageCountParam.giftStatus = 2;
        }
        axiosData('/coupon/couponService_queryCouponUsageInfo.ajax', sendOrUsageCountParam, {needThrow: true}, {path: 'data.totalSize'})
            .then(total => {
                if (!opts.isSend) {
                    dispatch(getUsedTotalCountSuccessAC(total))
                } else {
                    dispatch(getSendTotalCountSuccessAC(total))
                }
            })
            .catch(error => {
                if (!opts.isSend) {
                    dispatch(getUsedTotalCountFailAC())
                } else {
                    dispatch(getSendTotalCountFailAC())
                }
            })
        return axiosData('/coupon/couponService_queryCouponUsageInfo.ajax', { ...opts.params }, null, {
            path: 'data',
        })
            .then((records) => {
                if (opts.isSend) {
                    dispatch(getSendListSuccessAC({
                        payload: {
                            sendorUsedList: records || [],
                        },
                    }));
                } else {
                    dispatch(getUsedListSuccessAC({
                        payload: {
                            sendorUsedList: records || [],
                        },
                    }));
                }
                return Promise.resolve(records);
            }).catch(err => {
                // empty catch
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
        return axiosData('/coupon/couponService_getSortedCouponBoardList.ajax', { ...opts }, null, {
            path: 'data.crmGiftTypes',
        })
        .then((records) => {
            dispatch(getGiftSortSuccessAC({
                payload: {
                    dataSource: records || [],
                },
            }));
            return Promise.resolve(records);
        })
        .catch(err => {
            // empty catch
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
        return axiosData('/coupon/couponService_getShareCoupons.ajax', { ...opts }, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getSharedGiftsSuccessAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            }).catch(err => {
                // empty catch
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
        // return fetchData('crmBatchSellGiftCards', { ...opts }, null, {
        return axiosData('/coupon/couponQuotaService_batchSellQuotaCards.ajax', { ...opts }, {needThrow: true}, {
            path: '',
        }).then(data => Promise.resolve(data)).catch(err => Promise.reject(err));
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
            })
            .catch(err => {
                dispatch(getQuotaCardShopByBatchNoAC({
                    payload: {
                        dataSource: [],
                    },
                }));
                return Promise.resolve([]);
            })
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
        // return fetchData('getQuotaBatchInfo_dkl', { ...opts }, null, {
        return axiosData('/coupon/couponQuotaService_getQuotaBatch.ajax', { ...opts }, null, {
            path: 'data.quotaCardList',
        })
            .then((records = []) => {
                dispatch(getQuotaCardBatchNoAC({
                    payload: {
                        dataSource: records || [],
                    },
                }));
                return Promise.resolve(records);
            }).catch(err => {
                // empty catch
            });
    }
};
// 券适用店铺查询 ,暂时无用{groupID:10890,giftItemID: '6526002596388280970' }-->data:{couponShopList:[]}

export const queryCouponShopList = (opts) => {
    return (dispatch) => {
        return axiosData('/coupon/couponService_queryCouponShopList.ajax', { ...opts }, null, {
            path: 'data',
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
};

// 公众号
export const queryWechatMpInfo = (opts) => {
    return (dispatch) => {
        dispatch({
            type: GIFT_NEW_QUERY_WECHAT_MPINFO_START,
            payload: undefined,
        });
        return fetchData('queryWechatMpInfo', {...opts}, null, { path: 'mpList', throttle: false })
            .then((mpList) => {
                dispatch({
                    type: GIFT_NEW_QUERY_WECHAT_MPINFO_SUCCESS,
                    payload: mpList || [],
                });
                return Promise.resolve(mpList)
            }, err => {
                dispatch({
                    type: GIFT_NEW_QUERY_WECHAT_MPINFO_FAIL,
                    payload: undefined,
                });
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    }
};

export const startCreateGift = (opt) => {
    return {
        type: GIFT_NEW_START_CREATE_GIFT,
        payload: opt,
    }
};

// opts: {value: String,type: 'edit' | 'detail', data: Object}  查看和编辑都走此action, 故多传一个operationType
export const startEditGift = (opt) => {
    return {
        type: GIFT_NEW_START_EDIT_GIFT,
        payload: opt,
    }
};

export const cancelCreateOrEditGift = (opt) => {
    return {
        type: GIFT_NEW_CANCEL_CREATE_EDIT_GIFT,
        payload: opt,
    }
};

export const startSaving = (opt) => {
    return {
        type: GIFT_NEW_CANCEL_START_SAVING_GIFT,
        payload: opt,
    }
};

export const endSaving = (opt) => {
    return {
        type: GIFT_NEW_CANCEL_END_SAVING_GIFT,
        payload: opt,
    }
};

export const changeGiftFormKeyValue = (opt) => {// opt: {key: String, value: primitive?}
    return {
        type: GIFT_NEW_CHANGE_FORM_KEY_VALUE,
        payload: opt,
    }
};
