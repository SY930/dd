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
    { label: '免费参与', value: '12' },
    { label: '参加活动扣积分', value: '13' },
    { label: '付费购买', value: '14' },
];

const regOpts = [
    { label: '无需用户填写注册信息', value: '12' },
    { label: '用户需填写注册信息', value: '13' },
];

const formItems2 = {
    brandList: {
        type: 'combo',
        label: '适用公众号',
        surfix: '元，可参与活动',
        options: [],
        defaultValue: [],
    },
    consumeType: {
        type: 'radio',
        label: '参与条件',
        options: countOpts,
        defaultValue: '12',
    },
    consumeTotalAmount: {
        type: 'text',
        label: '扣除积分',
        surfix: '积分',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
        wrapperCol: { span: 6 },
    },
    consumeTotalAmount1: {
        type: 'text',
        label: '付费金额',
        surfix: '元',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
        wrapperCol: { span: 6 },
    },
    cardTypeList1: {
        type: 'combo',
        label: '结算主体',
        rules: ['required'],
        options: [],
        defaultValue: [],
    },
    timeLimit: {
        type: 'custom',
        label: '参与次数限制',
        render: () => (<p/>),
        defaultValue: [],
    },
    cardTypeList: {
        type: 'combo',
        label: '新用户注册卡类',
        rules: ['required'],
        options: [],
        defaultValue: [],
    },
    registType: {
        type: 'radio',
        label: '注册方式',
        options: regOpts,
        defaultValue: '12',
    },
};

// const formKeys2 = ['brandList', 'orderTypeList', 'shopIDList'];
const formKeys2 = Object.keys(formItems2)
/**
 * formItem3
 */
const lottDefVal = { id: '1', giftOdds: '', presentValue: '', cardTypeID: '',
isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }],  bagList: [] };
const openlottDefVal = { id: '1', giftOdds: '', presentValue: '', cardTypeID: '',
isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }],  bagList: [] };

const formItems3 = {
    needShow: {
        type: 'custom',
        // label: '11',
        // render: decorator => (
        //     <div>
        //         {decorator({
        //             rules: [{required: true, message: '请选择'}]
        //         })(
        //             <div>
        //                 <div>
        //                     <p>明盒</p>
        //                 </div>
        //                 <p>盲盒活动中，部分可以直接展示给消费者礼品可以设置明盒礼品，全盲盒活动则不需要设置</p>
        //             </div>
        //         )}
        //     </div>
        // ),
        wrapperCol: { span: 18 },
    },
    consumeTotalAmount: {
        type: 'custom',
        // label: '11',
        render: () => (<p/>),
        defaultValue: [openlottDefVal],
        wrapperCol: { span: 18 },
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
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
    share: {
        type: 'custom',
        render: () => (<p/>),
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
};
const formKeys3 = ['needShow', 'consumeTotalAmount', 'lottery', 'share'];


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF,
    formKeys2, formItems2, formKeys3, formItems3,
}
