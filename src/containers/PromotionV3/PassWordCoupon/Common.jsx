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
        render: () => (<p>口令领券</p>),
        defaultValue: '78',
    },
    eventName: {
        type: 'text',
        label: '活动名称',
        rules: ['required', 'stringLength'],
    },
    eventCode: {
        type: 'text',
        label: '活动编码',
        rules: [
            { required: true, message: '活动编码不能为空' },
            { message: "字母、数字组成，不多于20个字符",  pattern: /^[A-Za-z0-9]{1,20}$/ },
        ],
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
        rules: ['required', 'description2'],
    },
};

const formKeys1 = ['eventType', 'eventName', 'eventCode', 'smsGate', 'eventRange', 'eventRemark'];

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
        label: '新用户注册卡类',
        type: 'custom',
        defaultValue: '',
        rules: ['required'],
    },
    autoRegister: {
        type: 'radio',
        label: '参加活动成为会员',
        options: regOpts,
        defaultValue: '1',
    },
};

const keys1 = ['presentValue1'];
const keys2 = ['presentValue2', 'settleUnitID'];
const formKeys21 = ['participateRule']
const formKeys22 = ['joinCount', 'defaultCardType','autoRegister'];
/**
 * formItem3
 */
const lottDefVal = { id: '1',participateMark:'', giftTotalCopies:'', presentValue: '', presentType: '1', giftList: [{ id: '001', effectType: '1' }] };

const formItems3 = {
    lottery: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
};
const formKeys32 = ['lottery'];


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF,
    formKeys21, formKeys22, formItems2, formKeys32, formItems3, keys1, keys2,
}
