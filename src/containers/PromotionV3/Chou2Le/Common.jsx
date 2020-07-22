import React from 'react';
import DateRange from '../Camp/DateRange';
import DateTag from '../Camp/DateTag';
import TimeRange from '../Camp/TimeRange';
import Advance from '../Camp/Advance';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';
const sendOpts = [
    { label: '不发送', value: '0' },
    { label: '推送微信消息', value: '2' },
];
const bizOpts = [
    { label: '预订', value: '10' },
    { label: '闪吃', value: '11' },
    { label: '外送', value: '20' },
    { label: '堂食', value: '31' },
    { label: '自提', value: '21' },
];

const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];
const countOpts = [
    { label: '按账单金额', value: '12' },
    { label: '按实付金额', value: '13' },
];
const sceneOpts = [
    { label: '支付成功后投放', value: '2' },
    { label: '评价成功后投放', value: '3' },
];
const formItems1 = {
    eventType: {
        type: 'custom',
        label: '活动类型',
        render: () => (<p>下单抽抽乐</p>),
        defaultValue: '78',
    },
    eventName: {
        type: 'text',
        label: '活动名称',
        rules: ['required', 'stringLength'],
    },
    eventRange: {
        type: 'custom',
        label: '活动起止日期',
        rules: ['required'],
        wrapperCol: { span: 17 },
        defaultValue: [],
        render: d => d()(<DateRange />),
    },
    advMore: {
        type: 'custom',
        render: d => d()(<Advance />),
        wrapperCol: { span: 22 },
    },
    smsGate: {
        type: 'combo',
        label: '是否发送消息',
        options: sendOpts,
        defaultValue: '0',
    },
    eventRemark: {
        type: 'textarea',
        label: '活动规则',
        rules: ['required', 'description'],
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
// eventRange
// "eventEndDate": "20220610",
// "eventStartDate": "20200522",
// excludedDate "20200522"
const KEY1 = ['eventType', 'eventName', 'smsGate', 'eventRange', 'advMore'];
const KEY2 = ['eventRemark'];
const KEY3 = ['timeList', 'cycleType'];
const KEY4 = ['validCycle'];
const KEY5 = ['excludedDate'];
const formKeys1 = [...KEY1, ...KEY3, ...KEY4, ...KEY5, ...KEY2];
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};
const lottDefVal = { id: '1', giftOdds: '', presentValue: '', cardTypeID: '',
isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }],  bagList: [] };

const formItems2 = {
    brandList: {
        type: 'combo',
        label: '品牌',
        multiple: true,
        options: [],
        defaultValue: [],
    },
    orderTypeList: {
        type: 'checkbox',
        label: '适用业务',
        options: bizOpts,
        defaultValue: ['31'],
    },
    shopIDList: {
        type: 'custom',
        label: '适用店铺',
        render: () => (<p/>),
        defaultValue: [],
    },
};
// "orderTypeList":"31,30,10,20"// 基础营销，适用业务
// "brandList":"123，123，123"// 品牌ID，如果有多个以逗号分割
const formKeys2 = ['brandList', 'orderTypeList', 'shopIDList'];

const formItems3 = {
    consumeTotalAmount: {
        type: 'text',
        label: '活动参与限制',
        surfix: '元，可参与活动',
        prefix: '消费满',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
        wrapperCol: { span: 10 },
    },
    consumeType: {
        type: 'radio',
        label: '金额计算方式',
        options: countOpts,
        defaultValue: '12',
    },
    sceneType: {
        type: 'radio',
        label: '投放场景',
        options: sceneOpts,
        defaultValue: '2',
    },
    lottery: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
};
const formKeys3 = ['consumeTotalAmount', 'consumeType', 'sceneType', 'lottery'];
export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    KEY1, KEY2, KEY3, KEY4, KEY5, TF, DF,
    formKeys2, formItems2, formKeys3, formItems3,
}
