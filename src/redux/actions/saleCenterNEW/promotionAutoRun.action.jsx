import { axiosData } from '../../../helpers/util';
import { getStore } from '@hualala/platform-base/lib';

export const SALE_CENTER_QUERY_PROMOTION_LIST_START = 'sale center: query promotion list START';
export const SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS = 'sale center: query promotion auto run list SUCCESS';
export const SALE_CENTER_QUERY_PROMOTION_LIST_SUCCESS = 'sale center: query promotion list SUCCESS';
export const SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL = 'sale center: query promotion auto run list FAIL';
export const SALE_CENTER_QUERY_PROMOTION_LIST_FAIL = 'sale center: query promotion list FAIL';
export const SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_START = 'sale center: save promotion auto run list START';
export const SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_SUCCESS = 'sale center: save promotion auto run list SUCCESS';
export const SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_FAIL = 'sale center: save promotion auto run list FAIL';

export const SALE_CENTER_CHANGE_PROMOTION_AUTORUN_LIST = 'sale center: change promotion auto run list'; // 前端内部action
export const SALE_CENTER_OPEN_PROMOTION_AUTORUN_LIST_MODAL = 'sale center: set promotion auto run list modal visible = true'; // 前端内部action
export const SALE_CENTER_CLOSE_PROMOTION_AUTORUN_LIST_MODAL = 'sale center: set promotion auto run list modal visible = false'; // 前端内部action

export const openPromotionAutoRunListModal = () => {
    return {
        type: SALE_CENTER_OPEN_PROMOTION_AUTORUN_LIST_MODAL,
    };
};

export const closePromotionAutoRunListModal = () => {
    return {
        type: SALE_CENTER_CLOSE_PROMOTION_AUTORUN_LIST_MODAL,
    };
};

export const changePromotionAutoRunListSuccess = (opts) => {
    return {
        type: SALE_CENTER_CHANGE_PROMOTION_AUTORUN_LIST,
        payload: opts,
    };
};
// 查询操作
const queryPromotionAutoRunListSuccess = (opts) => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS,
        payload: opts,
    };
};
//获取可自动执行列表
const queryPromotionListSuccess = (opts) => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_LIST_SUCCESS,
        payload: opts,
    };
};
const queryPromotionListFail = () => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_LIST_FAIL,
    };
};
const queryPromotionAutoRunListFail = () => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL,
    };
};
const queryPromotionListStart = () => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_LIST_START,
    };
};
// 保存操作
const savePromotionAutoRunListSuccess = (opts) => {
    return {
        type: SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_SUCCESS,
        payload: opts,
    };
};

const savePromotionAutoRunListFail = () => {
    return {
        type: SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_FAIL,
    };
};

const savePromotionAutoRunListStart = () => {
    return {
        type: SALE_CENTER_SAVE_PROMOTION_AUTORUN_LIST_START,
    };
};

export const queryPromotionAutoRunList = (opts) => {
    return (dispatch) => {
        axiosData(
            '/promotion/autoExecuteActivities_queryAutoActivities.ajax',
            opts,
            {},
            { path: 'data.autoExecuteActivityItems' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(values => {
            console.log(values, 'values------------------queryPromotionAutoRunList')
            dispatch(queryPromotionAutoRunListSuccess(values));
        }).catch((error) => {
            console.log(error);
            dispatch(queryPromotionAutoRunListFail(error));
        })
    };
}
export const queryPromotionList = (opts) => {
    return (dispatch) => {
        dispatch(queryPromotionListStart());
        axiosData(
            '/promotion/autoExecuteActivities_queryEnableAutoExePromotion.ajax',
            { ...opts, isActive: '1' },
            {},
            { path: 'data.autoExecuteActivityItems' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(values => {
            console.log(values, 'values------------------queryPromotionList')
            const groupID = getStore().getState().user.getIn(['accountInfo', 'groupID']);
            const topEvents = [
                {
                    promotionName: '会员价',
                    promotionType: 20,
                    groupID,
                    promotionID: '-10',
                    promotionIDStr: '-10',
                    order: 0,
                },
                {
                    promotionName: '会员折扣',
                    promotionType: 20,
                    groupID,
                    promotionID: '-20',
                    promotionIDStr: '-20',
                    order: 0,
                }
            ];
            const newVals = [...topEvents, ...values];
            console.log(newVals, 'newValues-----------')
            dispatch(queryPromotionListSuccess(newVals));
        }).catch((error) => {
            console.log(error);
            dispatch(queryPromotionListFail(error));
        })
    };
}
export const savePromotionAutoRunList = (opts) => {
    return (dispatch) => {
        dispatch(savePromotionAutoRunListStart());
        return axiosData(
            '/promotion/autoExecuteActivities_mergeAutoActivities.ajax',
            opts,
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((res) => {
            dispatch(savePromotionAutoRunListSuccess(res));
            return Promise.resolve();
        }).catch((error) => {
            dispatch(savePromotionAutoRunListFail(error));
            return Promise.reject();
        });
    };
}


