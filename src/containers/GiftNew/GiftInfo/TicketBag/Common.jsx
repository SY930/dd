import React from 'react';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';
const bagOpts = [
    { label: '付费购买', value: '1' },
    { label: '活动投放', value: '2' },
];
const sendOpts = [
    { label: '一次性发放', value: '1' },
    { label: '周期性发放', value: '2' },
];
const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];
const separItems = {
    a: {
        type: 'custom',
        render: () => (<div className="separate"><h3>基本信息</h3></div>),
    },
    b: {
        type: 'custom',
        render: () => (<div className="separate"><h3>券包设置</h3></div>),
    },
}
// 宣传图默认图
const couponImage = 'basicdoc/ba69a0bf-c383-4c06-8ee5-4f50f657dfac.png';
// http://wiki.hualala.com/pages/viewpage.action?pageId=46546447 java API
const formItems = {
    couponPackageType: {
        type: 'radioButton',
        label: '券包类型',
        options: bagOpts,
        defaultValue: '1',
    },
    sellTime: {
        type: 'datepickerRange',
        label: '售卖时间',
    },
    couponPackageName: {
        type: 'text',
        label: '券包名称',
        rules: ['required', 'stringLength'],
    },
    couponPackageValue: {
        type: 'text',
        label: '礼品价值',
        surfix: '元',
        rules: ['required', 'price'],
    },
    couponPackagePrice: {
        type: 'text',
        label: '购买金额',
        surfix: '元',
        rules: ['price'],
    },
    couponPackageStock: {
        type: 'text',
        label: '券包库存',
        rules: ['numbers'],
    },
    shopInfos: {
        type: 'custom',
        label: '可售卖店铺',
        defaultValue: [],
        render: null,
        props: {
            size: 'small',
            defaultCheckAll: !!1,
        },
    },
    couponPackageDesciption: {
        type: 'textarea',
        label: '券包说明',
        rules: ['description'],
    },
    couponPackageImage: {
        type: 'custom',
        label: '宣传图',
        props: { defValue: couponImage },
        render: null,
    },
    couponSendWay: {
        type: 'radioButton',
        label: '发放类型',
        options: sendOpts,
        defaultValue: '1',
    },
    couponPackageGiftConfigs: {
        type: 'custom',
        label: '券包内容',
        defaultValue: [],
        rules: [{
            required: !!1,
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('券包内容不能为空');
                }
                return callback();
            },
        }],
        render: null,
    },
    cycleType: {
        type: 'combo',
        label: '选择周期',
        options: cycleOpts,
        defaultValue: '',
    },
    sendTime: {
        type: 'timepicker',
        label: '发送时间',
        format: 'HH:mm',
        rules: ['required'],
    },
    giftSendCount: {
        type: 'text',
        label: '发送次数',
        rules: ['required', 'numbers'],
    },
    validcycle: {
        type: 'custom',
        label: '选择日期',
        render: null,
        rules: [{
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('必须选择其中一天');
                }
                return callback();
            },
        }],
    },
    ...separItems,
};

const keys1 = ['a', 'couponPackageType', 'sellTime', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice', 'couponPackageStock', 'shopInfos', 'couponPackageDesciption', 'couponPackageImage'];
const keys2 = ['a', 'couponPackageType', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice', 'couponPackageStock', 'couponPackageDesciption', 'couponPackageImage'];

const keys3 = ['b', 'couponSendWay', 'couponPackageGiftConfigs'];
const keys4 = ['b', 'couponSendWay', 'cycleType', 'sendTime', 'giftSendCount', 'couponPackageGiftConfigs'];
const keys5 = ['b', 'couponSendWay', 'cycleType', 'validcycle', 'sendTime', 'giftSendCount', 'couponPackageGiftConfigs'];

const formKeys = [
    {
        col: { className: 'baseform-a' },
        keys: keys1,
    },
    {
        col: { className: 'baseform-b' },
        keys: keys3,
    },
];
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const weekMap = ['', '一', '二', '三', '四', '五', '六', '日'];
const weekList = (() => {
    const week = [];
    for(let i = 1; i < 8; i++) {
        week.push('w'+i);
    }
    return week;
})();
const monthList = (() => {
    const month = [];
    for(let i = 1; i < 32; i++) {
        month.push('m'+i);
    }
    return month;
})();

const qFormKeys = ['name', 'q'];

const qFormItems = {
    name: {
        type: 'text',
        label: '券包名称',
    },
    brandID: {
        type: 'combo',
        label: '选择品牌',
        options: [],
        props: {
            placeholder: '全部品牌',
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
        },
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
}
export {
    formItems, imgURI, formKeys, href, formItemLayout,
    keys1, keys2, keys3, keys4, keys5, DF, TF, monthList, weekList, weekMap,
    qFormKeys, qFormItems,
}
