import Rx from 'rxjs/Rx';
import { fetchData } from '../../../helpers/util';

// 查询加盟商基本信息
export const ALLIANCECONTRACT_FRANCHISEEINFOLIST_START = 'allianceContract franchiseeInfoList:: franchiseeInfoList start';
export const ALLIANCECONTRACT_FRANCHISEEINFOLIST_SUCCESS = 'allianceContract franchiseeInfoList:: franchiseeInfoList success';
export const ALLIANCECONTRACT_FRANCHISEEINFOLIST_FAILED = 'allianceContract franchiseeInfoList:: franchiseeInfoList failed';
export const ALLIANCECONTRACT_FRANCHISEEINFOLIST_CANCEL = 'allianceContract franchiseeInfoList:: franchiseeInfoList cancel';

// 查询加盟商基本信息
export const franchiseeInfoList = opts => ({ type: ALLIANCECONTRACT_FRANCHISEEINFOLIST_START, payload: opts });
const franchiseeInfoListSuccess = payload => ({ type: ALLIANCECONTRACT_FRANCHISEEINFOLIST_SUCCESS, payload });
const franchiseeInfoListFailed = payload => ({ type: ALLIANCECONTRACT_FRANCHISEEINFOLIST_FAILED, payload });
export const franchiseeInfoListEpic = action$ => action$.ofType(ALLIANCECONTRACT_FRANCHISEEINFOLIST_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('franchiseeInfoList', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return franchiseeInfoListSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            franchiseeInfoListFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(ALLIANCECONTRACT_FRANCHISEEINFOLIST_CANCEL))
    });


// 查询加盟合同列表
export const ALLIANCECONTRACT_QUERYFCONTRACT_START = 'allianceContract queryFContract:: queryFContract start';
export const ALLIANCECONTRACT_QUERYFCONTRACT_SUCCESS = 'allianceContract queryFContract:: queryFContract success';
export const ALLIANCECONTRACT_QUERYFCONTRACT_FAILED = 'allianceContract queryFContract:: queryFContract failed';
export const ALLIANCECONTRACT_QUERYFCONTRACT_CANCEL = 'allianceContract queryFContract:: queryFContract cancel';

// 查询加盟合同列表
export const queryFContract = opts => ({ type: ALLIANCECONTRACT_QUERYFCONTRACT_START, payload: opts });
const queryFContractSuccess = payload => ({ type: ALLIANCECONTRACT_QUERYFCONTRACT_SUCCESS, payload });
const queryFContractFailed = payload => ({ type: ALLIANCECONTRACT_QUERYFCONTRACT_FAILED, payload });
export const queryFContractEpic = action$ => action$.ofType(ALLIANCECONTRACT_QUERYFCONTRACT_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('queryFContract', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return queryFContractSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            queryFContractFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(ALLIANCECONTRACT_QUERYFCONTRACT_CANCEL))
    });

// 新增加盟合同
export const ALLIANCECONTRACT_ADDFCONTRACT_START = 'allianceContract addFContract:: addFContract start';
export const ALLIANCECONTRACT_ADDFCONTRACT_SUCCESS = 'allianceContract addFContract:: addFContract success';
export const ALLIANCECONTRACT_ADDFCONTRACT_FAILED = 'allianceContract addFContract:: addFContract failed';
export const ALLIANCECONTRACT_ADDFCONTRACT_CANCEL = 'allianceContract addFContract:: addFContract cancel';

// 新增加盟合同
export const addFContract = opts => ({ type: ALLIANCECONTRACT_ADDFCONTRACT_START, payload: opts });
const addFContractSuccess = payload => ({ type: ALLIANCECONTRACT_ADDFCONTRACT_SUCCESS, payload });
const addFContractFailed = payload => ({ type: ALLIANCECONTRACT_ADDFCONTRACT_FAILED, payload });
export const addFContractEpic = action$ => action$.ofType(ALLIANCECONTRACT_ADDFCONTRACT_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('addFContract', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return addFContractSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            return Rx.Observable.of(addFContractFailed(response.code));
            // return Rx.Observable.empty();
        }).takeUntil(action$.ofType(ALLIANCECONTRACT_ADDFCONTRACT_CANCEL))
    });

// 修改加盟商合同
export const ALLIANCECONTRACT_UPDATEFCONTRACT_START = 'allianceContract updateFContract:: updateFContract start';
export const ALLIANCECONTRACT_UPDATEFCONTRACT_SUCCESS = 'allianceContract updateFContract:: updateFContract success';
export const ALLIANCECONTRACT_UPDATEFCONTRACT_FAILED = 'allianceContract updateFContract:: updateFContract failed';
export const ALLIANCECONTRACT_UPDATEFCONTRACT_CANCEL = 'allianceContract updateFContract:: updateFContract cancel';

// 修改加盟商合同
export const updateFContract = opts => ({ type: ALLIANCECONTRACT_UPDATEFCONTRACT_START, payload: opts });
const updateFContractSuccess = payload => ({ type: ALLIANCECONTRACT_UPDATEFCONTRACT_SUCCESS, payload });
const updateFContractFailed = payload => ({ type: ALLIANCECONTRACT_UPDATEFCONTRACT_FAILED, payload });
export const updateFContractEpic = action$ => action$.ofType(ALLIANCECONTRACT_UPDATEFCONTRACT_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('updateFContract', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return updateFContractSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            updateFContractFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(ALLIANCECONTRACT_UPDATEFCONTRACT_CANCEL))
    });


// 查询结算账户
export const ALLIANCECONTRACT_GETFSMSETTLEUNIT_START = 'allianceContract getFsmSettleUnit:: getFsmSettleUnit start';
export const ALLIANCECONTRACT_GETFSMSETTLEUNIT_SUCCESS = 'allianceContract getFsmSettleUnit:: getFsmSettleUnit success';
export const ALLIANCECONTRACT_GETFSMSETTLEUNIT_FAILED = 'allianceContract getFsmSettleUnit:: getFsmSettleUnit failed';
export const ALLIANCECONTRACT_GETFSMSETTLEUNIT_CANCEL = 'allianceContract getFsmSettleUnit:: getFsmSettleUnit cancel';
// 查询结算账户
export const getFsmSettleUnit = opts => ({ type: ALLIANCECONTRACT_GETFSMSETTLEUNIT_START, payload: opts });
const getFsmSettleUnitSuccess = payload => ({ type: ALLIANCECONTRACT_GETFSMSETTLEUNIT_SUCCESS, payload });
const getFsmSettleUnitFailed = payload => ({ type: ALLIANCECONTRACT_GETFSMSETTLEUNIT_FAILED, payload });
export const getFsmSettleUnitEpic = action$ => action$.ofType(ALLIANCECONTRACT_GETFSMSETTLEUNIT_START).mergeMap((action) => {
    return Rx.Observable.from(
        fetchData('queryFsmSettleUnit', action.payload, null, { path: false })
    ).map((response) => {
        setTimeout(() => {
            action.payload.success && action.payload.success();
        }, 0);
        return getFsmSettleUnitSuccess(response);
    }).catch(({ response = {} }) => {
        if (action.payload.fail) {
            action.payload.fail(response.message);
        }
        getFsmSettleUnitFailed(response.code);
        return Rx.Observable.empty();
    }).takeUntil(action$.ofType(ALLIANCECONTRACT_GETFSMSETTLEUNIT_CANCEL))
});
