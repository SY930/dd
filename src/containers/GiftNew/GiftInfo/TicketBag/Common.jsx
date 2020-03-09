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
const statusOpts = [
    { label: '全部', value: '' },
    { label: '可使用', value: '1' },
    { label: '已使用', value: '2' },
    { label: '已售出', value: '12' },
    { label: '已作废', value: '13' },
];
const isSendOpts = [
    { label: '不发送', value: '0' },
    { label: '仅发送短信', value: '1' },
    { label: '仅推送微信', value: '2' },
    { label: '同时发送短信和微信', value: '4' },
    { label: '微信推送成功则发送短信', value: '3' },
];
const wayOpts = [
    { value: '', label: '全部' },
    { value: '10', label: '消费返券' },
    { value: '20', label: '摇奖活动' },
    { value: '30', label: '积分摇奖' },
    { value: '40', label: '积分兑换' },
    { value: '50', label: '订单摇奖' },
    { value: '60', label: '免费领取' },
    { value: '61', label: '消费红包' },
    { value: '62', label: '营销红包' },
    { value: '70', label: '商家赠送' },
    { value: '71', label: '会员推荐奖励' },
    { value: '80', label: '商家支付' },
    { value: '90', label: '商家卖出' },
    { value: '91', label: '会员摇奖' },
    { value: '92', label: '免费领取' },
    { value: '93', label: '积分兑换' },
    { value: '94', label: '参与活动' },
    { value: '95', label: '有奖竞猜' },
    { value: '96', label: '套餐充值' },
    { value: '97', label: '会员开卡送礼品' },
    { value: '98', label: '会员生日赠送' },
    { value: '99', label: '群发礼品' },
    { value: '100', label: '批量导入' },
    { value: '101', label: '购买权益包' },
    { value: '102', label: '消费赠送' },
    { value: '103', label: '商城售卖' },
    { value: '104', label: '分享裂变' },
    { value: '105', label: '膨胀大礼包' },
    { value: '106', label: '桌边砍' },
    { value: '107', label: '推荐有礼' },
    { value: '112', label: '完善资料送礼' },
    { value: '111', label: '升级送礼' },
    { value: '113', label: '累计消费送礼' },
    { value: '114', label: '线上餐厅送礼' },
    { value: '115', label: '微信购买领取' },
    { value: '116', label: '微信受赠领取' },
    { value: '117', label: '唤醒送礼' },
    { value: '118', label: '评价送礼' },
    { value: '119', label: '赠送领取' },
    { value: '120', label: '关注送礼' },
    { value: '121', label: '集点卡' },
    { value: '3010', label: '基础营销消费返券' },
    { value: '3011', label: '批量生成' },
    { value: '77', label: '支付后广告' },
    { value: '122', label: '签到' },
    { value: '123', label: '礼品定额卡发放' },
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
    c: {
        type: 'custom',
        render: null,
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
        props: {},
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
        rules: ['required', 'price'],
        props: { placeholder: '请输入金额' },
        rules: [{
            required: !0,
            validator: (rule, value, callback) => {
                const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                if(!pattern.test(value)){
                    return callback('最大支持8位整数，2位小数');
                }
                if (!+value>0) {
                    return callback('金额要大于0');
                }
                return callback();
            },
        }],
    },
    couponPackageStock: {
        type: 'text',
        label: '券包库存',
        rules: ['numbers'],
        props: {
            placeholder: '不填表示不限制',
        },
    },
    shopInfos: {
        type: 'custom',
        label: '可售卖店铺',
        defaultValue: [],
        render: null,
        props: {
            placeholder: '默认全部店铺',
            size: 'small',
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
            required: !0,
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
        props: {
            disabledMinutes: h => range(1, 30).concat(range(31, 60)),
            hideDisabledOptions: !0,
        }
    },
    maxSendLimit: {
        type: 'text',
        label: '发送次数',
        rules: ['required', 'numbers'],
    },
    validCycle: {
        type: 'custom',
        label: '选择日期',
        render: null,
        defaultValue: ['w1', 'm1'],
    },
    ...separItems,
};
function range(start, end) {
    return Array(end - start).fill(0).map((value, idx) => {
        return idx + start;
    });
}

const keys1 = ['a', 'couponPackageType', 'sellTime', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice', 'couponPackageStock', 'shopInfos', 'couponPackageDesciption', 'couponPackageImage'];
const keys2 = ['a', 'couponPackageType', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice', 'couponPackageStock', 'couponPackageDesciption', 'couponPackageImage'];

const keys3 = ['b', 'c', 'couponSendWay', 'couponPackageGiftConfigs'];
const keys4 = ['b', 'c', 'couponSendWay', 'cycleType', 'sendTime', 'maxSendLimit', 'couponPackageGiftConfigs'];
const keys5 = ['b', 'c', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime', 'maxSendLimit', 'couponPackageGiftConfigs'];

const formKeys = [
    {
        col: { className: 'baseform-a' },
        keys: keys1,
    },
    {
        col: { className: 'baseform-b' },
        keys: keys5,
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

const dFormKeys = ['getWay', 'couponPackageStatus', 'sendTime', 'customerMobile', 'q'];
const dFormItems = {
    getWay: {
        type: 'combo',
        label: '发出方式',
        options: wayOpts,
    },
    couponPackageStatus: {
        type: 'combo',
        label: '状态',
        options: statusOpts,
    },
    sendTime: {
        type: 'datepickerRange',
        label: '发出时间',
    },
    customerMobile: {
        type: 'text',
        label: '手机号',
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
};
const pFormKeys2 = ['cellNo', 'sendCount', 'c', 'smsGate', 'accountNo', 'smsTemplate', 'q'];
const pFormKeys = ['cellNo', 'sendCount', 'c', 'smsGate', 'q'];
const pFormItems = {
    cellNo: {
        type: 'text',
        label: '手机号',
        rules: ['required', 'phone'],
        defaultValue: '',
    },
    sendCount: {
        type: 'text',
        label: '赠送数量',
        rules: ['numbers'],
    },
    smsGate: {
        type: 'combo',
        label: '是否发送消息',
        options: isSendOpts,
        defaultValue: '0',
    },
    accountNo: {
        type: 'custom',
        label: '短信权益账户',
        rules: ['required'],
        render: null,
    },
    smsTemplate: {
        type: 'custom',
        label: '短信模板',
        rules: ['required'],
        render: null,
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
    c: {
        type: 'custom',
        label: '剩余库存',
        render: null,
    },
}
export {
    formItems, imgURI, formKeys, href, formItemLayout,
    keys1, keys2, keys3, keys4, keys5, DF, TF, monthList, weekList, weekMap,
    qFormKeys, qFormItems, dFormKeys, dFormItems, pFormKeys, pFormItems, pFormKeys2,
}
