import { axiosData } from '../../../helpers/util';
import { getStore } from '@hualala/platform-base/lib';

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
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                ),
                axiosData(
                    '/promotion/autoExecuteActivities_queryEnableAutoExePromotion.ajax',
                    {...opts, isActive: '1'},
                    {},
                    {path: 'data.autoExecuteActivityItems'},
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                ),
            ]
        ).then(values => {
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
            const [a1, a2] = values;
            const newVals = [a1, [...topEvents, ...a2]];
            dispatch(queryPromotionAutoRunListSuccess(newVals));
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


