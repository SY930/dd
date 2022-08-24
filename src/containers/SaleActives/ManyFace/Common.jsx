import React from 'react';
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
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};

const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];


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
    clientType: {
        type: 'radio',
        label: '适用客户端',
        options: [{ label: '小程序3.0', value: '2' }, { label: 'H5餐厅', value: '1' }],
        defaultValue: '2',
    },
    sceneList: {
        type: 'custom',
        label: '投放类型',
        options: [{ label: '弹窗海报图', value: '1' }, { label: 'banner广告', value: '2' }],
        defaultValue: '1',
        render: () => (<p />),
    },
    placement: {
        type: 'custom',
        label: '投放位置',
        options: [],
        defaultValue: '1',
        render: () => (<p />),
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

const KEY1 = ['eventType', 'eventName', 'eventRange', 'advMore'];
const KEY2 = ['eventRemark'];


const formKeys1 = [...KEY1, 'clientType', 'sceneList', 'placement', 'shopIDList', ...KEY2];


// const formKeys2 = ['clientType', 'sceneList', 'placement', 'shopIDList'];
/**
 * formItem3
 */
const faceDefVal = {
    id: '0',
    triggerScene: '1', // 点餐页弹窗海报图
    conditionType: '1', // 会员身份1， 会员标签2
    conditionName: '是否持卡会员', // 是否持卡会员| 会员身份
    conditionValue: 'whetherHasCard', // 是否持卡key | 7023267909942119317
    targetName: '持卡会员',
    targetValue: '1', // 1 是持卡会员 0否

    // 点击触发的事件
    triggerEventName1: '购物车夹菜',
    triggerEventValue1: '',
    triggerEventCustomInfo1: '',
    triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序
    
    bannerApp1: '', // 弹窗海报
    bannerApp1Ary: [
        {
            id: '011',
            bannerApp1: '',
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
    bannerApp2: '',
    // isShowDishSelector: false,
}

const formItems3 = {
    faceRule: {
        label: '活动规则',
        type: 'custom',
        render: () => (<p />),
        defaultValue: [faceDefVal],
        wrapperCol: { span: 20 },
        labelCol: { span: 4 }
    },
    eventRange: {
        type: 'custom',
        label: '活动起止日期',
        rules: ['required'],
        wrapperCol: { span: 10 },
        defaultValue: [],
        render: d => d()(<DateRange />),
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
        render: d => d()(<TimeRange />),
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
        render: d => d()(<DateTag />),
        defaultValue: [],
    },
};
const KEY3 = ['timeList', 'cycleType'];
const KEY4 = ['validCycle'];
const KEY5 = ['excludedDate']
const KEY6 = ['faceRule', 'eventRange', 'advMore']
const formKeys32 = [...KEY6, ...KEY3, ...KEY4, ...KEY5]


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF, KEY1, KEY2, KEY3, KEY4, KEY5, KEY6, formKeys32, formItems3,
}
