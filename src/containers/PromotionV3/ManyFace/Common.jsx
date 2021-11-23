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
    eventRemark: {
        type: 'textarea',
        label: '活动规则',
        rules: ['required', 'description'],
    },
};

const formKeys1 = ['eventType', 'eventName', 'eventRange', 'eventRemark'];


const formItems2 = {
    sceneList: {
        type: 'combo',
        label: '应用场景',
        options: [],
        defaultValue: [],
    },
    brandList: {
        type: 'combo',
        label: '品牌',
        placeholder: '请选择品牌，不选默认全部品牌可用',
        multiple: true,
        options: [],
        defaultValue: [],
    },
    shopIDList: {
        type: 'custom',
        label: '适用店铺',
        render: () => (<p />),
        defaultValue: [],
    },
};

const keys1 = ['presentValue1'];
const keys2 = ['presentValue2', 'settleUnitID'];
const formKeys2 = ['sceneList', 'brandList', 'shopIDList'];
/**
 * formItem3
 */
const lottDefVal = { id: '1', needShow: 0, giftOdds: '', giftTotalCount: '', presentValue: '', isPoint: false, isTicket: true, presentType: '1' };

const formItems3 = {
    lottery: {
        type: 'custom',
        render: () => (<p />),
        defaultValue: [lottDefVal],
        wrapperCol: { span: 18 },
    },
};

const formKeys32 = ['lottery']


export {
    formItems1, imgURI, formKeys1, href, formItemLayout,
    TF, DF,
    formItems2, formKeys32, formItems3, keys1, keys2, formKeys2,
}
