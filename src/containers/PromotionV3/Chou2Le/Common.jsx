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
    { label: '不发送', value: '1' },
    { label: '推送微信消息', value: '2' },
];
const bizOpts = [
    { label: '预订', value: '1' },
    { label: '闪吃', value: '2' },
    { label: '外送', value: '3' },
    { label: '堂食', value: '4' },
    { label: '自提', value: '5' },
];
const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];
const countOpts = [
    { label: '按账单金额', value: '1' },
    { label: '按实付金额', value: '2' },
];
const formItems1 = {
    a: {
        type: 'custom',
        label: '活动类型',
        render: () => (<p>下单抽抽乐</p>),
    },
    b: {
        type: 'text',
        label: '活动名称',
        rules: ['required', 'stringLength'],
    },
    c: {
        type: 'custom',
        label: '活动起止日期',
        rules: ['required'],
        wrapperCol: { span: 17 },
        defaultValue: [],
        render: d => d()(<DateRange />),
    },
    d: {
        type: 'custom',
        render: d => d()(<Advance />),
        wrapperCol: { span: 22 },
    },
    e: {
        type: 'combo',
        label: '是否发送消息',
        options: sendOpts,
        defaultValue: '1',
    },
    f: {
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
    h: {
        type: 'custom',
        label: '活动时段',
        render: d => d()(<TimeRange />),
        defaultValue: [],
    },
    i: {
        type: 'custom',
        label: '每逢',
        render: () => (<p></p>),
        defaultValue: ['w1', 'm1'],
    },
    j: {
        type: 'custom',
        label: '活动排除日期',
        render: d => d()(<DateTag />),
        defaultValue: [],
    },
};

const KEY1 = ['a', 'b', 'c', 'd'];
const KEY2 = ['e', 'f'];
const KEY3 = ['h', 'g'];
const KEY4 = ['i'];
const KEY5 = ['j'];
const formKeys1 = [...KEY1, ...KEY3, ...KEY4, ...KEY5, ...KEY2];
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const formItems2 = {
    a: {
        type: 'combo',
        label: '品牌',
        options: sendOpts,
    },
    b: {
        type: 'checkbox',
        label: '适用业务',
        options: bizOpts,
    },
    c: {
        type: 'custom',
        label: '适用店铺',
        render: () => (<p/>),
    },
};
const formKeys2 = ['a', 'b', 'c'];


const formItems3 = {
    a: {
        type: 'combo',
        label: '活动参与限制',
        options: sendOpts,
    },
    b: {
        type: 'radio',
        label: '金额计算方式',
        options: countOpts,
        defaultValue: '1',
    },
    c: {
        type: 'custom',
        render: () => (<p/>),
    },
};
const formKeys3 = ['a', 'b', 'c'];
export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    KEY1, KEY2, KEY3, KEY4, KEY5,
    formKeys2, formItems2, formKeys3, formItems3,
}
