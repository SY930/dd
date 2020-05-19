import React from 'react';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';
const bagOpts = [
    { label: '付费购买', value: '1' },
    { label: '活动投放', value: '2' },
];


const formItems = {
    couponPackageType: {
        type: 'radioButton',
        label: '券包类型',
        options: bagOpts,
        defaultValue: '1',
    },
};

const formKeys = ['b', 'couponSendWay', 'couponPackageGiftConfigs'];
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

export {
    formItems, imgURI, formKeys, href, formItemLayout,
}
