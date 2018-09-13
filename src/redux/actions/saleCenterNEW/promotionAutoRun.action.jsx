import { axiosData } from '../../../helpers/util';

export const SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_START = 'sale center: query promotion auto run list START';
export const SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_SUCCESS = 'sale center: query promotion auto run list SUCCESS';
export const SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL = 'sale center: query promotion auto run list FAIL';

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

const queryPromotionAutoRunListFail = () => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_FAIL,
    };
};

const queryPromotionAutoRunListStart = () => {
    return {
        type: SALE_CENTER_QUERY_PROMOTION_AUTORUN_LIST_START,
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
        dispatch(queryPromotionAutoRunListStart());
        Promise.all(
            [
                axiosData(
                    '/promotion/autoExecuteActivities_queryAutoActivities.ajax',
                    opts,
                    {},
                    {path: 'data.autoExecuteActivityItems'},
                    'HTTP_SERVICE_URL_CRM'
                )/*.then((list) => {
             dispatch(queryPromotionAutoRunListSuccess(list));
             }).catch((error) => {
             dispatch(queryPromotionAutoRunListFail(error));
             })*/,
                axiosData(
                    '/promotion/autoExecuteActivities_queryEnableAutoExePromotion.ajax',
                    opts,
                    {},
                    {path: 'data.autoExecuteActivityItems'},
                    'HTTP_SERVICE_URL_CRM'
                )/*.then((list) => {
             dispatch(queryPromotionAutoRunListSuccess(list));
             }).catch((error) => {
             dispatch(queryPromotionAutoRunListFail(error));
             })*/,
            ]
        ).then(values => {
            dispatch(queryPromotionAutoRunListSuccess(values));
        }).catch((error) => {
            dispatch(queryPromotionAutoRunListFail(error));
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
            {path: 'data'},
            'HTTP_SERVICE_URL_CRM'
        ).then((res) => {
            dispatch(savePromotionAutoRunListSuccess(res));
            return Promise.resolve();
        }).catch((error) => {
            dispatch(savePromotionAutoRunListFail(error));
            return Promise.reject();
        });
    };
}


