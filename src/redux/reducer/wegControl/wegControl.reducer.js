/**
 * Created by zhaohcuanchuan on 2017/6/8.
 */

import Immutable from 'immutable';

import {
    // 水电气添加设备
    WEGCONTROL_ADDUTILITIESMETER_START,
    WEGCONTROL_ADDUTILITIESMETER_SUCCESS,
    WEGCONTROL_ADDUTILITIESMETER_FAILED,
    // 水电气，编辑设备
    WEGCONTROL_EDITUTILITIESMETER_START,
    WEGCONTROL_EDITUTILITIESMETER_SUCCESS,
    WEGCONTROL_EDITUTILITIESMETER_FAILED,
    WEGCONTROL_EDITUTILITIESMETER_CANCEL,
    // 水电气删除设备
    WEGCONTROL_DELETEUTILITIESMETER_START,
    WEGCONTROL_DELETEUTILITIESMETER_SUCCESS,
    WEGCONTROL_DELETEUTILITIESMETER_FAILED,
    // 查询设备名称
    WEGCONTROL_GETUTILITIESMETERBYTYPE_START,
    WEGCONTROL_GETUTILITIESMETERBYTYPE_SUCCESS,
    WEGCONTROL_GETUTILITIESMETERBYTYPE_FAILD,
    WEGCONTROL_GETUTILITIESMETERBYTYPE_CANCEL,
    WEGCONTROL_GETUTILITIESMETERBYTYPE_TIMEOUT,
    // 查询设备名称(只能查名称，没有读数)
    WEGCONTROL_GETUTILITIESMETER_START,
    WEGCONTROL_GETUTILITIESMETER_SUCCESS,
    WEGCONTROL_GETUTILITIESMETER_FAILD,
    WEGCONTROL_GETUTILITIESMETER_CANCEL,
    WEGCONTROL_GETUTILITIESMETER_TIMEOUT,
    // 数据录入,新增水电气明细
    WEGCONTROL_ADDUTILITIESPAYOUT_START,
    WEGCONTROL_ADDUTILITIESPAYOUT_SUCCESS,
    WEGCONTROL_ADDUTILITIESPAYOUT_FAILD,
    WEGCONTROL_ADDUTILITIESPAYOUT_CANCEL,
    WEGCONTROL_ADDUTILITIESPAYOUT_TIMEOUT,
    // 查询水电气明细
    WEGCONTROL_GETUTILITIESPAYOUTBYDAY_START,
    WEGCONTROL_GETUTILITIESPAYOUTBYDAY_SUCCESS,
    WEGCONTROL_GETUTILITIESPAYOUTBYDAY_FAILD,
    WEGCONTROL_GETUTILITIESPAYOUTBYDAY_CANCEL,
    WEGCONTROL_GETUTILITIESPAYOUTBYDAY_TIMEOUT,

    // 查询月报表
    WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_START,
    WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_SUCCESS,
    WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_FAILD,
    WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_CANCEL,
    WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_TIMEOUT,

    WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_START,
    WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_SUCCESS,
    WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_FAILD,
    WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_CANCEL,
    WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_TIMEOUT,

    // 保存查询数据
    WEGCONTROL_SAVESHOPS_SUCCESS,
    WEGCONTROL_SAVESEARCHDATA_SUCCESS,
    WEGCONTROL_CANCLESEARCHDATA_SUCCESS,

    // 店铺之间对比
    WEGCONTROL_GETUTILITIESCONTRAST_START,
    WEGCONTROL_GETUTILITIESCONTRAST_SUCCESS,
    WEGCONTROL_GETUTILITIESCONTRAST_FAILD,
    WEGCONTROL_GETUTILITIESCONTRAST_CANCEL,
    WEGCONTROL_GETUTILITIESCONTRAST_TIMEOUT,

    // 保存对比参数
    WEGCONTROL_SAVECOMPARE_SUCCESS,

} from '../../actions/wegControl/wegControl.action';


const $initialState = Immutable.fromJS({
    // 水电气添加设备
    addUtilitiesMeter: {
        status: 'start',
    },
    // 水电气编辑设备
    editUtilitiesMeter: {
        status: 'start',
    },
    // 水电气删除设备
    deleteUtilitiesMeter: {
        status: 'start',
    },
    // 查询水电气设备
    getUtilitiesMeterByType: {
        utilitiesMeterList: [],
        status: 'start', // start -> pending -> success -> fail
    },
    // 查询设备名称(只能查名称，没有读数)
    getUtilitiesMeter: {
        utilitiesMeterList: [],
        status: 'start',
    },
    // 数据录入,新增
    addUtilitiesPayOut: {
        status: 'start',
    },
    // 查询水电气明细
    getUtilitiesPayOutByDay: {
        status: 'start',
        data: {},
    },
    // 查询月报表
    getUtilitiesPayOutByYear: {
        status: 'start',
        data: {},
    },
    // 查询周报表
    getUtilitiesPayOutByWeek: {
        status: 'start',
        data: {},
    },
    // 保存查询数据
    searchData: {
        search: 'cancel',
        data: '',
        shops: [],
    },
    // 店铺对比数据
    getUtilitiesContrast: {
        status: 'start',
        data: {},
    },
    // 保存对比参数
    compareData: {
        data: {},
    },
});

export const wegControl = ($$state = $initialState, action) => {
    switch (action.type) {
        // 水电气添加设备
        case WEGCONTROL_ADDUTILITIESMETER_START:
            return $$state.setIn(['addUtilitiesMeter', 'status'], 'pending');
        case WEGCONTROL_ADDUTILITIESMETER_SUCCESS:
            if ($$state.getIn(['addUtilitiesMeter', 'status']) === 'pending') {
                return $$state.setIn(['addUtilitiesMeter', 'status'], 'success');
            }
            return $$state;
        case WEGCONTROL_ADDUTILITIESMETER_FAILED:
            return $$state.setIn(['addUtilitiesMeter', 'status'], 'fail');
        // 水电气编辑设备
        case WEGCONTROL_EDITUTILITIESMETER_START:
            return $$state.setIn(['editUtilitiesMeter', 'status'], 'pending');
        case WEGCONTROL_EDITUTILITIESMETER_SUCCESS:
            if ($$state.getIn(['editUtilitiesMeter', 'status']) === 'pending') {
                return $$state.setIn(['editUtilitiesMeter', 'status'], 'success');
            }
            return $$state;
        case WEGCONTROL_EDITUTILITIESMETER_FAILED:
            return $$state.setIn(['editUtilitiesMeter', 'status'], 'fail');
        // 水电气删除设备
        case WEGCONTROL_DELETEUTILITIESMETER_START:
            return $$state.setIn(['deleteUtilitiesMeter', 'status'], 'pending');
        case WEGCONTROL_DELETEUTILITIESMETER_SUCCESS:
            if ($$state.getIn(['deleteUtilitiesMeter', 'status']) === 'pending') {
                return $$state.setIn(['deleteUtilitiesMeter', 'status'], 'success');
            }
            return $$state;
        case WEGCONTROL_DELETEUTILITIESMETER_FAILED:
            return $$state.setIn(['deleteUtilitiesMeter', 'status'], 'fail');
        // 水电气查询设备
        case WEGCONTROL_GETUTILITIESMETERBYTYPE_START:
            return $$state.setIn(['getUtilitiesMeterByType', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESMETERBYTYPE_SUCCESS:
            if ($$state.getIn(['getUtilitiesMeterByType', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesMeterByType', 'status'], 'success')
                    .setIn(['getUtilitiesMeterByType', 'utilitiesMeterList'], Immutable.fromJS(action.payload.utilitiesMeterList));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESMETERBYTYPE_TIMEOUT:
            return $$state.setIn(['getUtilitiesMeterByType', 'status'], 'timeout');
        case WEGCONTROL_GETUTILITIESMETERBYTYPE_FAILD:
            return $$state.setIn(['getUtilitiesMeterByType', 'status'], 'fail');
        // 查询设备名称(只能查名称，没有读数)
        case WEGCONTROL_GETUTILITIESMETER_START:
            return $$state.setIn(['getUtilitiesMeter', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESMETER_SUCCESS:
            if ($$state.getIn(['getUtilitiesMeter', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesMeter', 'status'], 'success')
                    .setIn(['getUtilitiesMeter', 'utilitiesMeterList'], Immutable.fromJS(action.payload.utilitiesMeterList));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESMETER_TIMEOUT:
            return $$state.setIn(['getUtilitiesMeter', 'status'], 'timeout');
        case WEGCONTROL_GETUTILITIESMETER_FAILD:
            return $$state.setIn(['getUtilitiesMeter', 'status'], 'fail');
        // 数据录入,新增水电气明细
        case WEGCONTROL_ADDUTILITIESPAYOUT_START:
            return $$state.setIn(['addUtilitiesPayOut', 'status'], 'pending');
        case WEGCONTROL_ADDUTILITIESPAYOUT_SUCCESS:
            if ($$state.getIn(['addUtilitiesPayOut', 'status']) === 'pending') {
                return $$state.setIn(['addUtilitiesPayOut', 'status'], 'success');
            }
            return $$state;
        case WEGCONTROL_ADDUTILITIESPAYOUT_FAILD:
            return $$state.setIn(['addUtilitiesPayOut', 'status'], 'fail');
            // 查询水电气明细
        case WEGCONTROL_GETUTILITIESPAYOUTBYDAY_START:
            return $$state.setIn(['getUtilitiesPayOutByDay', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESPAYOUTBYDAY_SUCCESS:
            if ($$state.getIn(['getUtilitiesPayOutByDay', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesPayOutByDay', 'status'], 'success')
                    .setIn(['getUtilitiesPayOutByDay', 'data'], Immutable.fromJS(action.payload));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESPAYOUTBYDAY_FAILD:
            return $$state.setIn(['getUtilitiesPayOutByDay', 'status'], 'fail');
            // 查询月报表
        case WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_START:
            return $$state.setIn(['getUtilitiesPayOutByYear', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_SUCCESS:
            if ($$state.getIn(['getUtilitiesPayOutByYear', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesPayOutByYear', 'status'], 'success')
                    .setIn(['getUtilitiesPayOutByYear', 'data'], Immutable.fromJS(action.payload));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESPAYOUTBYYEAR_FAILD:
            return $$state.setIn(['getUtilitiesPayOutByWeek', 'status'], 'fail');
            // 查询周报表
        case WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_START:
            return $$state.setIn(['getUtilitiesPayOutByWeek', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_SUCCESS:
            if ($$state.getIn(['getUtilitiesPayOutByWeek', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesPayOutByWeek', 'status'], 'success')
                    .setIn(['getUtilitiesPayOutByWeek', 'data'], Immutable.fromJS(action.payload));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESPAYOUTBYWEEK_FAILD:
            return $$state.setIn(['getUtilitiesPayOutByWeek', 'status'], 'fail');
            // 保存查询数据
        case WEGCONTROL_SAVESEARCHDATA_SUCCESS:
            return $$state
                .setIn(['searchData', 'search'], 'save')
                .setIn(['searchData', 'data'], Immutable.fromJS(action.payload));
        case WEGCONTROL_SAVESHOPS_SUCCESS:
            return $$state.setIn(['searchData', 'shops'], Immutable.fromJS(action.payload));
        case WEGCONTROL_CANCLESEARCHDATA_SUCCESS:
            return $$state
                .setIn(['searchData', 'search'], 'cancel')

        // 店铺对比
        case WEGCONTROL_GETUTILITIESCONTRAST_START:
            return $$state.setIn(['getUtilitiesContrast', 'status'], 'pending');
        case WEGCONTROL_GETUTILITIESCONTRAST_SUCCESS:
            if ($$state.getIn(['getUtilitiesContrast', 'status']) === 'pending') {
                return $$state
                    .setIn(['getUtilitiesContrast', 'status'], 'success')
                    .setIn(['getUtilitiesContrast', 'data'], Immutable.fromJS(action.payload));
            }
            return $$state;
        case WEGCONTROL_GETUTILITIESCONTRAST_FAILD:
            return $$state.setIn(['getUtilitiesContrast', 'status'], 'fail');
        // 保存对比数据
        case WEGCONTROL_SAVECOMPARE_SUCCESS:
            return $$state.setIn(['compareData', 'data'], Immutable.fromJS(action.payload));
        default:
            return $$state;
    }
};
