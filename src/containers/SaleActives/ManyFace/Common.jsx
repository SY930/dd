import React from 'react';
import { Tooltip, Icon } from 'antd'
import moment from 'moment';
import DateRange from '../../PromotionV3/Camp/DateRange';
import DateTag from '../../PromotionV3/Camp/DateTag';
import TimeRange from '../../PromotionV3/Camp/TimeRange';
import Advance from '../../PromotionV3/Camp/Advance';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';

//
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
};

const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];

const style = {
    background: '#FFFBE6',
    borderRadius: '4px',
    border: '1px solid #FFE58F',
    paddingLeft: '11px',
}


const formItems1 = {
    eventType: {
        type: 'custom',
        label: '活动类型',
        render: () => (<p>千人千面</p>),
        defaultValue: '78',
    },
    eventName: {
        type: 'text',
        label: '活动名称',
        rules: ['required', 'stringLength', { max: '50', message: '不能超过50个字符' }],
    },
    eventCode: {
        type: 'text',
        label: <span>活动编码 <Tooltip title='活动编码填写后不可修改'><Icon type="question-circle" style={{ marginLeft: 5 }} /></Tooltip></span>,
        rules: [
            { message: "字母、数字组成，不多于50个字符",  pattern: /^[A-Za-z0-9]{1,50}$/ },
        ],
    },
    clientType: {
        type: 'custom',
        label: '适用客户端',
        options: [{ label: '小程序3.0', value: '2' }, { label: 'H5餐厅', value: '1' }],
        defaultValue: '2',
        render: () => (<p />),
    },
    clientTip: {
        type: 'custom',
        wrapperCol: { span: 15, offset: 5 },
        render: () => (<div style={style}>此功能仅支持小程序SR3.10.0及其以上版本使用</div>),
    },
    sceneList: {
        type: 'custom',
        label: '投放类型',
        options: [{ label: '弹窗海报图', value: '1' }, { label: 'banner广告', value: '2' }, { label: '开屏页', value: '4' }],
        defaultValue: '1',
        render: () => (<p />),
    },
    triggerSceneList: {
        type: 'custom',
        label: '投放位置',
        options: [],
        defaultValue: [1],
        render: () => (<p />),
        rules: ['required'],
    },
    shopIDList: {
        type: 'custom',
        label: '适用店铺',
        render: () => (<p />),
        defaultValue: [],
        rules: ['required'],
    },
    eventRemark: {
        type: 'textarea',
        label: '活动说明',
        placeholder: '请输入活动说明，最多1000个字符',
        rules: ['description2'],
    },
};

const KEY1 = ['eventType', 'eventName', 'eventCode', 'clientType'];
const KEY2 = ['sceneList', 'triggerSceneList', 'shopIDList', 'eventRemark'];
const KEY = ['clientTip'];

const formKeys1 = [...KEY1, KEY, ...KEY2];


// const formKeys2 = ['clientType', 'sceneList', 'triggerSceneList', 'shopIDList'];
/**
 * formItem3
 */
export const faceDefVal = {
    id: '0',
    conditionType: '1', // 会员身份1， 会员标签2
    conditionName: '是否持卡会员', // 是否持卡会员| 会员身份
    conditionValue: 'whetherHasCard', // 是否持卡key | 7023267909942119317
    targetName: '持卡会员',
    targetValue: '1', // 1 是持卡会员 0否
    // 点击触发的事件  小程序3.0
    triggerEventName1: '购物车夹菜',
    triggerEventValue1: '',
    triggerEventCustomInfo1: '',
    triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序

    triggerEventInfoList: [
        {
            id: '011',
            parentId: '0',
            decorateInfo: { imagePath: '' },
            triggerEventName1: '购物车夹菜',
            triggerEventValue1: '',
            triggerEventCustomInfo1: '',
            triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序
        },
    ], // banner

    // 点击触发的事件 h5
    triggerEventName2: '购物车夹菜',
    triggerEventValue2: '',
    triggerEventCustomInfo2: '',
    // children: [], // 点击小程序触发事件后的三级联动菜单
    everyTagsRule: [],

    decorateInfo: { imagePath: '' }, // 弹窗海报
    // isShowDishSelector: false,
};

const formItems3 = {
    faceRule: {
        label: '活动规则',
        type: 'custom',
        render: () => (<p />),
        defaultValue: [faceDefVal],
        wrapperCol: { span: 19 },
        labelCol: { span: 5 }
    },
    eventRange: {
        type: 'custom',
        label: '活动起止日期',
        rules: ['required'],
        wrapperCol: { span: 12 },
        labelCol: { span: 5 },
        defaultValue: [moment(), moment().add(6, 'days')],
        render: d => d()(<DateRange type={'85'} />),
    },
    advMore: {
        type: 'custom',
        render: d => d()(<Advance text={true} />),
        wrapperCol: { span: 22 },
    },
    cycleType: {
        type: 'combo',
        label: '选择周期',
        options: cycleOpts,
        defaultValue: '',
    },
    timeList: {
        type: 'custom',
        label: '活动时段',
        render: d => d()(<TimeRange type="85" />),
        defaultValue: [{id: '0'}],
    },
    validCycle: {
        type: 'custom',
        label: '每逢',
        render: () => (<p></p>),
        defaultValue: ['w1', 'm1'],
    },
    excludedDate: {
        type: 'custom',
        label: '活动排除日期',
        render: d => d()(<DateTag limit={true} />),
        defaultValue: [],
    },
};
const KEY3 = ['timeList', 'cycleType'];
const KEY4 = ['validCycle'];
const KEY5 = ['excludedDate']
const KEY6 = ['faceRule', 'eventRange', 'advMore']
const formKeys32 = [...KEY6, ...KEY3, ...KEY4, ...KEY5];

const isOverlapped = (a, b) => {
    return (a.startTime >= b.startTime
        && a.startTime <= b.endTime) || (
        a.endTime >= b.startTime
            && a.endTime <= b.endTime
    ) || (b.startTime >= a.startTime
            && b.startTime <= a.endTime) || (
        b.endTime >= a.startTime
            && b.endTime <= a.endTime
    );
}

const getItervalsErrorStatus = (intervals) => {
    const filteredIntervals = (intervals || []).filter(({ startTime, endTime }) => !!startTime && !!endTime);
    if (!filteredIntervals.length) {
        return {
            hasError: true,
            errorMessage: '至少要设置一个完整时间段',
        }
    }

    if (filteredIntervals.length === 1) {
        const { startTime, endTime } = filteredIntervals[0];
        if (startTime > endTime) {
            return {
                hasError: true,
                errorMessage: '时间段设置有误，请重新修改~',
            }
        }
    }

    if (filteredIntervals.length > 1) {
        for (let i = 0; i < (filteredIntervals.length - 1); i += 1) {
            for (let j = i + 1; j < filteredIntervals.length; j += 1) {
                if (filteredIntervals[i].startTime <= filteredIntervals[i].endTime
                    &&
                    filteredIntervals[j].startTime <= filteredIntervals[j].endTime
                ) { // i, j非跨天
                    if (isOverlapped(filteredIntervals[j], filteredIntervals[i])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置有误，请重新修改~',
                        }
                    }
                }
                if (filteredIntervals[i].startTime > filteredIntervals[i].endTime
                    &&
                    filteredIntervals[j].startTime > filteredIntervals[j].endTime
                ) { // i, j都跨天
                    return {
                        hasError: true,
                        errorMessage: '时间段设置有误，请重新修改~',
                    }
                }
                if (filteredIntervals[i].startTime <= filteredIntervals[i].endTime
                    &&
                    filteredIntervals[j].startTime > filteredIntervals[j].endTime
                ) { // i非跨天 j跨天
                    const beforeMidNightInterval = { ...filteredIntervals[j], endTime: '2359' }
                    const afterMidNightInterval = { ...filteredIntervals[j], startTime: '0000' }
                    if (isOverlapped(beforeMidNightInterval, filteredIntervals[i]) || isOverlapped(afterMidNightInterval, filteredIntervals[i])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置有误，请重新修改~',
                        }
                    }
                }
                if (filteredIntervals[j].startTime <= filteredIntervals[j].endTime
                    &&
                    filteredIntervals[i].startTime > filteredIntervals[i].endTime
                ) { // i跨天 j非跨天
                    const beforeMidNightInterval = { ...filteredIntervals[i], endTime: '2359' }
                    const afterMidNightInterval = { ...filteredIntervals[i], startTime: '0000' }
                    if (isOverlapped(beforeMidNightInterval, filteredIntervals[j]) || isOverlapped(afterMidNightInterval, filteredIntervals[j])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置有误，请重新修改~',
                        }
                    }
                }
            }
        }
    }
    return {
        hasError: false,
        errorMessage: ''
    }
}


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF, KEY, KEY1, KEY2, KEY3, KEY4, KEY5, KEY6, formKeys32, formItems3,
    getItervalsErrorStatus,
}


