import 'rxjs';
import Rx from 'rxjs/Rx';
import {
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';
import { fetchData } from '../../../helpers/util';

// 水电气，添加设备
export const WEGCONTROL_ADDUTILITIESMETER_START = 'wegControl addUtilitiesMeter:: addUtilitiesMeter start';
export const WEGCONTROL_ADDUTILITIESMETER_SUCCESS = 'wegControl addUtilitiesMeter:: addUtilitiesMeter success';
export const WEGCONTROL_ADDUTILITIESMETER_FAILED = 'wegControl addUtilitiesMeter:: addUtilitiesMeter failed';
export const WEGCONTROL_ADDUTILITIESMETER_CANCEL = 'wegControl addUtilitiesMeter:: addUtilitiesMeter cancel';

// 水电气，编辑设备
export const WEGCONTROL_EDITUTILITIESMETER_START = 'wegControl editUtilitiesMeter:: editUtilitiesMeter start';
export const WEGCONTROL_EDITUTILITIESMETER_SUCCESS = 'wegControl editUtilitiesMeter:: editUtilitiesMeter success';
export const WEGCONTROL_EDITUTILITIESMETER_FAILED = 'wegControl editUtilitiesMeter:: editUtilitiesMeter failed';
export const WEGCONTROL_EDITUTILITIESMETER_CANCEL = 'wegControl editUtilitiesMeter:: editUtilitiesMeter cancel';

// 水电气，删除设备
export const WEGCONTROL_DELETEUTILITIESMETER_START = 'wegControl deleteUtilitiesMeter:: deleteUtilitiesMeter start';
export const WEGCONTROL_DELETEUTILITIESMETER_SUCCESS = 'wegControl deleteUtilitiesMeter:: deleteUtilitiesMeter success';
export const WEGCONTROL_DELETEUTILITIESMETER_FAILED = 'wegControl deleteUtilitiesMeter:: deleteUtilitiesMeter failed';
export const WEGCONTROL_DELETEUTILITIESMETER_CANCEL = 'wegControl deleteUtilitiesMeter:: deleteUtilitiesMeter cancel';

// 查询设备名称
export const WEGCONTROL_GETUTILITIESMETERBYTYPE_START = 'wegControl getUtilitiesMeterByType:: getUtilitiesMeterByType start';
export const WEGCONTROL_GETUTILITIESMETERBYTYPE_SUCCESS = 'wegControl getUtilitiesMeterByType:: getUtilitiesMeterByType success';
export const WEGCONTROL_GETUTILITIESMETERBYTYPE_FAILD = 'wegControl getUtilitiesMeterByType:: getUtilitiesMeterByType faild';
export const WEGCONTROL_GETUTILITIESMETERBYTYPE_CANCEL = 'wegControl getUtilitiesMeterByType:: getUtilitiesMeterByType cancel';
export const WEGCONTROL_GETUTILITIESMETERBYTYPE_TIMEOUT = 'wegControl getUtilitiesMeterByType:: getUtilitiesMeterByType timeout';

// 查询设备名称(只能查名称，没有读数)
export const WEGCONTROL_GETUTILITIESMETER_START = 'wegControl getUtilitiesMeter:: getUtilitiesMeter start';
export const WEGCONTROL_GETUTILITIESMETER_SUCCESS = 'wegControl getUtilitiesMeter:: getUtilitiesMeter success';
export const WEGCONTROL_GETUTILITIESMETER_FAILD = 'wegControl getUtilitiesMeter:: getUtilitiesMeter faild';
export const WEGCONTROL_GETUTILITIESMETER_CANCEL = 'wegControl getUtilitiesMeter:: getUtilitiesMeter cancel';
export const WEGCONTROL_GETUTILITIESMETER_TIMEOUT = 'wegControl getUtilitiesMeter:: getUtilitiesMeter timeout';

// 数据录入,新增.录入水电气明细
export const WEGCONTROL_ADDUTILITIESPAYOUT_START = 'wegControl addUtilitiesPayOut:: addUtilitiesPayOut start';
export const WEGCONTROL_ADDUTILITIESPAYOUT_SUCCESS = 'wegControl addUtilitiesPayOut:: addUtilitiesPayOut success';
export const WEGCONTROL_ADDUTILITIESPAYOUT_FAILD = 'wegControl addUtilitiesPayOut:: addUtilitiesPayOut faild';
export const WEGCONTROL_ADDUTILITIESPAYOUT_CANCEL = 'wegControl addUtilitiesPayOut:: addUtilitiesPayOut cancel';
export const WEGCONTROL_ADDUTILITIESPAYOUT_TIMEOUT = 'wegControl addUtilitiesPayOut:: addUtilitiesPayOut timeout';

// 查询水电气明细
export const WEGCONTROL_GETUTILITIESPAYOUTBYDAY_START = 'wegControl getUtilitiesPayOutByDay:: getUtilitiesPayOutByDay start';
export const WEGCONTROL_GETUTILITIESPAYOUTBYDAY_SUCCESS = 'wegControl getUtilitiesPayOutByDay:: getUtilitiesPayOutByDay success';
export const WEGCONTROL_GETUTILITIESPAYOUTBYDAY_FAILD = 'wegControl getUtilitiesPayOutByDay:: getUtilitiesPayOutByDay faild';
export const WEGCONTROL_GETUTILITIESPAYOUTBYDAY_CANCEL = 'wegControl getUtilitiesPayOutByDay:: getUtilitiesPayOutByDay cancel';
export const WEGCONTROL_GETUTILITIESPAYOUTBYDAY_TIMEOUT = 'wegControl getUtilitiesPayOutByDay:: getUtilitiesPayOutByDay timeout';

// 查询月报表
export const WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_START = 'wegControl getUtilitiesPayOutByYear:: getUtilitiesPayOutByYear start';
export const WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_SUCCESS = 'wegControl getUtilitiesPayOutByYear:: getUtilitiesPayOutByYear success';
export const WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_FAILD = 'wegControl getUtilitiesPayOutByYear:: getUtilitiesPayOutByYear faild';
export const WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_CANCEL = 'wegControl getUtilitiesPayOutByYear:: getUtilitiesPayOutByYear cancel';
export const WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_TIMEOUT = 'wegControl getUtilitiesPayOutByYear:: getUtilitiesPayOutByYear timeout';

// 查询周报表
export const WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_START = 'wegControl getUtilitiesPayOutByWeek:: getUtilitiesPayOutByWeek start';
export const WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_SUCCESS = 'wegControl getUtilitiesPayOutByWeek:: getUtilitiesPayOutByWeek success';
export const WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_FAILD = 'wegControl getUtilitiesPayOutByWeek:: getUtilitiesPayOutByWeek faild';
export const WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_CANCEL = 'wegControl getUtilitiesPayOutByWeek:: getUtilitiesPayOutByWeek cancel';
export const WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_TIMEOUT = 'wegControl getUtilitiesPayOutByWeek:: getUtilitiesPayOutByWeek timeout';

// 店铺之间对比
export const WEGCONTROL_GETUTILITIESCONTRAST_START = 'wegControl getUtilitiesContrast:: getUtilitiesContrast start';
export const WEGCONTROL_GETUTILITIESCONTRAST_SUCCESS = 'wegControl getUtilitiesContrast:: getUtilitiesContrast success';
export const WEGCONTROL_GETUTILITIESCONTRAST_FAILD = 'wegControl getUtilitiesContrast:: getUtilitiesContrast faild';
export const WEGCONTROL_GETUTILITIESCONTRAST_CANCEL = 'wegControl getUtilitiesContrast:: getUtilitiesContrast cancel';
export const WEGCONTROL_GETUTILITIESCONTRAST_TIMEOUT = 'wegControl getUtilitiesContrast:: getUtilitiesContrast timeout';


// 保存,取消查询店铺
export const WEGCONTROL_SAVESHOPS_SUCCESS = 'wegControl saveShops:: saveShops success';
export const WEGCONTROL_SAVESEARCHDATA_SUCCESS = 'wegControl saveSearchdata:: saveSearchdata success';
export const WEGCONTROL_CANCLESEARCHDATA_SUCCESS = 'wegControl cancleSearchdata:: cancleSearchdata success';

// 对比店铺参数
export const WEGCONTROL_SAVECOMPARE_SUCCESS = 'wegControl saveCompareData:: saveCompareData success';

// 保存,取消查询店铺
export const saveShops = opts => ({ type: WEGCONTROL_SAVESHOPS_SUCCESS, payload: opts });
export const saveSearchdata = opts => ({ type: WEGCONTROL_SAVESEARCHDATA_SUCCESS, payload: opts });
export const cancelSearchdata = opts => ({ type: WEGCONTROL_CANCLESEARCHDATA_SUCCESS });
// 对比店铺参数
export const saveCompare = opts => ({ type: WEGCONTROL_SAVECOMPARE_SUCCESS, payload: opts });

// 水电气，添加设备
export const addUtilitiesMeter = opts => ({ type: WEGCONTROL_ADDUTILITIESMETER_START, payload: opts });
const addUtilitiesMeterSuccess = payload => ({ type: WEGCONTROL_ADDUTILITIESMETER_SUCCESS, payload });
const addUtilitiesMeterFailed = payload => ({ type: WEGCONTROL_ADDUTILITIESMETER_FAILED, payload });
export const addUtilitiesMeterEpic = action$ => action$.ofType(WEGCONTROL_ADDUTILITIESMETER_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('addUtilitiesMeter', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return addUtilitiesMeterSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            addUtilitiesMeterFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_ADDUTILITIESMETER_CANCEL))
    });
// 水电气，编辑设备
export const editUtilitiesMeter = opts => ({ type: WEGCONTROL_EDITUTILITIESMETER_START, payload: opts });
const editUtilitiesMeterSuccess = payload => ({ type: WEGCONTROL_EDITUTILITIESMETER_SUCCESS, payload });
const editUtilitiesMeterFailed = payload => ({ type: WEGCONTROL_EDITUTILITIESMETER_FAILED, payload });
export const editUtilitiesMeterEpic = action$ => action$.ofType(WEGCONTROL_EDITUTILITIESMETER_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('updateUtilitiesMeter', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return editUtilitiesMeterSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            editUtilitiesMeterFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_EDITUTILITIESMETER_CANCEL))
    });
// 水电气，删除设备
export const deleteUtilitiesMeter = opts => ({ type: WEGCONTROL_DELETEUTILITIESMETER_START, payload: opts });
const deleteUtilitiesMeterSuccess = payload => ({ type: WEGCONTROL_DELETEUTILITIESMETER_SUCCESS, payload });
const deleteUtilitiesMeterFailed = payload => ({ type: WEGCONTROL_DELETEUTILITIESMETER_FAILED, payload });
export const deleteUtilitiesMeterEpic = action$ => action$.ofType(WEGCONTROL_DELETEUTILITIESMETER_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('deleteUtilitiesMeter', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return deleteUtilitiesMeterSuccess(response);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            deleteUtilitiesMeterFailed(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_DELETEUTILITIESMETER_CANCEL))
    });
// 查询设备
export const getUtilitiesMeterByType = opts => ({ type: WEGCONTROL_GETUTILITIESMETERBYTYPE_START, payload: opts });
const getUtilitiesMeterByTypeSuccess = payload => ({ type: WEGCONTROL_GETUTILITIESMETERBYTYPE_SUCCESS, payload });
const getUtilitiesMeterByTypeFaild = payload => ({ type: WEGCONTROL_GETUTILITIESMETERBYTYPE_FAILD, payload });
export const getUtilitiesMeterByTypeCancel = () => ({ type: WEGCONTROL_GETUTILITIESMETERBYTYPE_CANCEL });
export const getUtilitiesMeterByTypeTimeout = () => ({ type: WEGCONTROL_GETUTILITIESMETERBYTYPE_TIMEOUT });
export const getUtilitiesMeterByTypeEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESMETERBYTYPE_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesMeterByType', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesMeterByTypeSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesMeterByTypeFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESMETERBYTYPE_CANCEL))
    })
// 查询设备(只能查名称，没有读数)
export const getUtilitiesMeter = opts => ({ type: WEGCONTROL_GETUTILITIESMETER_START, payload: opts });
const getUtilitiesMeterSuccess = payload => ({ type: WEGCONTROL_GETUTILITIESMETER_SUCCESS, payload });
const getUtilitiesMeterFaild = payload => ({ type: WEGCONTROL_GETUTILITIESMETER_FAILD, payload });
export const getUtilitiesMeterCancel = () => ({ type: WEGCONTROL_GETUTILITIESMETER_CANCEL });
export const getUtilitiesMeterTimeout = () => ({ type: WEGCONTROL_GETUTILITIESMETER_TIMEOUT });
export const getUtilitiesMeterEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESMETER_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesMeter', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesMeterSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesMeterFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESMETER_CANCEL))
    })

// 数据录入
export const addUtilitiesPayOut = opts => ({ type: WEGCONTROL_ADDUTILITIESPAYOUT_START, payload: opts });
const addUtilitiesPayOutSuccess = payload => ({ type: WEGCONTROL_ADDUTILITIESPAYOUT_SUCCESS, payload });
const addUtilitiesPayOutFaild = payload => ({ type: WEGCONTROL_ADDUTILITIESPAYOUT_FAILD, payload });
export const addUtilitiesPayOutCancel = () => ({ type: WEGCONTROL_ADDUTILITIESPAYOUT_CANCEL });
export const addUtilitiesPayOutTimeout = () => ({ type: WEGCONTROL_ADDUTILITIESPAYOUT_TIMEOUT });
export const addUtilitiesPayOutEpic = action$ => action$.ofType(WEGCONTROL_ADDUTILITIESPAYOUT_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('addUtilitiesPayOut', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return addUtilitiesPayOutSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            addUtilitiesPayOutFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_ADDUTILITIESPAYOUT_CANCEL))
    })
// 查询水电气明细
export const getUtilitiesPayOutByDay = opts => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYDAY_START, payload: opts });
const getUtilitiesPayOutByDaySuccess = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYDAY_SUCCESS, payload });
const getUtilitiesPayOutByDayFaild = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYDAY_FAILD, payload });
export const getUtilitiesPayOutByDayCancel = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYDAY_CANCEL });
export const getUtilitiesPayOutByDayTimeout = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYDAY_TIMEOUT });
export const getUtilitiesPayOutByDayEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYDAY_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesPayOutByDay', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesPayOutByDaySuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesPayOutByDayFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYDAY_CANCEL))
    })
// 查询月报表
export const getUtilitiesPayOutByYear = opts => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_START, payload: opts });
const getUtilitiesPayOutByYearSuccess = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_SUCCESS, payload });
const getUtilitiesPayOutByYearFaild = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_FAILD, payload });
export const getUtilitiesPayOutByYearCancel = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_CANCEL });
export const getUtilitiesPayOutByYearTimeout = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_TIMEOUT });
export const getUtilitiesPayOutByYearEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesPayOutByYear', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesPayOutByYearSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesPayOutByYearFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_CANCEL))
    })
// 查询周报表
export const getUtilitiesPayOutByWeek = opts => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_START, payload: opts });
const getUtilitiesPayOutByWeekSuccess = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_SUCCESS, payload });
const getUtilitiesPayOutByWeekFaild = payload => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_FAILD, payload });
export const getUtilitiesPayOutByWeekCancel = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_CANCEL });
export const getUtilitiesPayOutByWeekTimeout = () => ({ type: WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_TIMEOUT });
export const getUtilitiesPayOutByWeekEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesPayOutByWeek', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesPayOutByWeekSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesPayOutByWeekFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_CANCEL))
    })
// 店铺之间对比
export const getUtilitiesContrast = opts => ({ type: WEGCONTROL_GETUTILITIESCONTRAST_START, payload: opts });
const getUtilitiesContrastSuccess = payload => ({ type: WEGCONTROL_GETUTILITIESCONTRAST_SUCCESS, payload });
const getUtilitiesContrastFaild = payload => ({ type: WEGCONTROL_GETUTILITIESCONTRAST_FAILD, payload });
export const getUtilitiesContrastCancel = () => ({ type: WEGCONTROL_GETUTILITIESCONTRAST_CANCEL });
export const getUtilitiesContrastTimeout = () => ({ type: WEGCONTROL_GETUTILITIESCONTRAST_TIMEOUT });
export const getUtilitiesContrastEpic = action$ => action$.ofType(WEGCONTROL_GETUTILITIESCONTRAST_START)
    .mergeMap((action) => {
        return Rx.Observable.from(
            fetchData('getUtilitiesContrast', action.payload, null, { path: false })
        ).map((response) => {
            setTimeout(() => {
                action.payload.success && action.payload.success();
            }, 0);
            return getUtilitiesContrastSuccess(response.data);
        }).catch(({ response = {} }) => {
            if (action.payload.fail) {
                action.payload.fail(response.message);
            }
            getUtilitiesContrastFaild(response.code);
            return Rx.Observable.empty();
        }).takeUntil(action$.ofType(WEGCONTROL_GETUTILITIESCONTRAST_CANCEL))
    })

