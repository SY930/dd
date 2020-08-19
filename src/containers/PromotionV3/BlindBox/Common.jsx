import React from 'react';
import DateRange from '../Camp/DateRange';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';

//
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

/**
 *  formItem1
 */
const sendOpts = [
    { label: '不发送', value: '0' },
    { label: '推送微信消息', value: '2' },
];

const formItems1 = {
    eventType: {
        type: 'custom',
        label: '活动类型',
        render: () => (<p>盲盒</p>),
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
};

const formKeys1 = ['eventType', 'eventName', 'smsGate', 'eventRange', 'eventRemark'];

/**
 * formItem2
 */
const countOpts = [
    { label: '免费参与', value: '0' },
    { label: '参加活动扣积分', value: '1' },
    { label: '付费购买', value: '2' },
];

const regOpts = [
    { label: '无需用户填写注册信息', value: '1' },
    { label: '用户需填写注册信息', value: '0' },
];

const joinCountValue = { joinCount: '0', partInTimesNoValid: 0, partInTimes: 0, countCycleDays: 0 };

const formItems2 = {
    mpIDList: {
        type: 'custom',
        label: '适用公众号',
        render: () => (<p/>),
        defaultValue: [],
        wrapperCol: { span: 18 },
    },
    participateRule: {
        type: 'radio',
        label: '参与条件',
        options: countOpts,
        defaultValue: '0',
    },
    presentValue1: {
        type: 'text',
        label: '扣除积分',
        surfix: '积分',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
            message: '请输入0.01~100000之间的数据，支持两位小数',
        }],
        wrapperCol: { span: 10 },
    },
    presentValue2: {
        type: 'text',
        label: '付费金额',
        surfix: '元',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
            message: '请输入0.01~100000之间的数字，最多支持两位小数',
        }],
        wrapperCol: { span: 10 },
    },
    settleUnitID: {
        type: 'combo',
        label: '结算主体',
        rules: ['required'],
        options: [],
        defaultValue: [],
    },
    joinCount: {
        type: 'custom',
        label: '参与次数限制',
        render: () => (<p/>),
        defaultValue: joinCountValue,
    },
    defaultCardType: {
        type: 'combo',
        label: '新用户注册卡类',
        rules: ['required'],
        options: [],
        defaultValue: [],
    },
    autoRegister: {
        type: 'radio',
        label: '注册方式',
        options: regOpts,
        defaultValue: '1',
    },
};

const keys1 = ['presentValue1'];
const keys2 = ['presentValue2', 'settleUnitID'];
const formKeys21 = ['mpIDList', 'participateRule']
const formKeys22 = ['joinCount', 'defaultCardType', 'autoRegister'];
/**
 * formItem3
 */
const lottDefVal = { id: '1', needShow: 0, giftOdds: '', presentValue: '', isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }] };
const openlottDefVal = { id: '1', needShow: 1, presentValue: '', isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }] };
const shareDefVal = { type: '79', shareTitle: 'duang!被一个盲盒砸中，看你手气了~', shareSubtitle: '', restaurantShareImagePath: '', shareImagePath: '' };

const formItems3 = {
    needShow: {
        type: 'custom',
        render: () => (<p/>),
        wrapperCol: { span: 18 },
    },
    openLottery: {
        type: 'custom',
        // label: '11',
        render: () => (<p/>),
        defaultValue: openlottDefVal,
        wrapperCol: { span: 18 },
    },
    eventImagePath: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: '',
        wrapperCol: { span: 18 },
    },
    lottery: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
    shareInfo: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: shareDefVal,
        wrapperCol: { span: 18 },
    },
};
const formKeys31 = ['needShow', 'openLottery', 'eventImagePath', 'lottery', 'shareInfo'];
const formKeys32 = ['needShow', 'eventImagePath', 'lottery', 'shareInfo'];


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF,
    formKeys21, formKeys22, formItems2, formKeys31, formKeys32, formItems3, keys1, keys2,
}
