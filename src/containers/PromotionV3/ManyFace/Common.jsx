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
const lottDefVal = { id: '1', needShow: 0, giftOdds: '', giftTotalCount: '', presentValue: '', isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }] };
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
    formItems2, formKeys31, formKeys32, formItems3, keys1, keys2, formKeys2,
}
