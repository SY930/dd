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
        defaultValue: '1',
    },
    eventRemark: {
        type: 'textarea',
        label: '活动规则',
        rules: ['required', 'description'],
    },
    g: {
        type: 'combo',
        label: '选择周期',
        options: cycleOpts,
        defaultValue: '',
    },
    timeList: {
        type: 'custom',
        label: '活动时段',
        render: d => d()(<TimeRange />),
        defaultValue: [],
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
const KEY1 = ['eventType', 'eventName', 'eventRange', 'advMore'];
const KEY2 = ['smsGate', 'eventRemark'];
const KEY3 = ['timeList', 'g'];
const KEY4 = ['validCycle'];
const KEY5 = ['excludedDate'];
const formKeys1 = [...KEY1, ...KEY3, ...KEY4, ...KEY5, ...KEY2];
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const formItems2 = {
    brandList: {
        type: 'combo',
        label: '品牌',
        options: sendOpts,
    },
    orderTypeList: {
        type: 'checkbox',
        label: '适用业务',
        options: bizOpts,
    },
    shops: {
        type: 'custom',
        label: '适用店铺',
        render: () => (<p/>),
    },
};
const formKeys2 = ['brandList', 'orderTypeList', 'shops'];

const formItems3 = {
    consumeTotalAmount: {
        type: 'text',
        label: '活动参与限制',
        surfix: '元，可以参与',
        prefix: '消费满',
        wrapperCol: { span: 10 },
    },
    consumeType: {
        type: 'radio',
        label: '金额计算方式',
        options: countOpts,
        defaultValue: '12',
    },
    lottery: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: [],
    },
};
const formKeys3 = ['consumeTotalAmount', 'consumeType', 'lottery'];
export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    KEY1, KEY2, KEY3, KEY4, KEY5,
    formKeys2, formItems2, formKeys3, formItems3,
}
