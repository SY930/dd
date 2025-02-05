import React from 'react';
import Tip from './Tip';
import moment from 'moment';
import styles from './index.less';
const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';
const bagOpts = [
    { label: '付费购买', value: '1' },
    { label: '活动/商城投放', value: '2' },
];
const needSelectShop = [
    { label: '开启', value: 1 },
    { label: '关闭', value: 0 },
];
const couponPackageRadio = [
    { label: '首次发放与后续相同', value: '1' },
    { label: '首次发放与后续不同', value: '2' },
];
const revokeOpts = [
    { label: '自动退款', value: '1' },
    { label: '不支持自动退款', value: '0' },
];
const userOpts = [
    { label: '支持', value: '1' },
    { label: '不支持', value: '0' },
];
const sendOpts = [
    { label: '一次性发放全部礼品', value: '1' },
    { label: '周期发放礼品', value: '2' },
];
const cycleOpts = [
    { label: '每日', value: '' },
    { label: '每周', value: 'w' },
    { label: '每月', value: 'm' },
];
const statusOpts = [
    { label: '全部', value: '' },
    { label: '待发送', value: '1' },
    { label: '已发出', value: '2' },
    { label: '已使用', value: '3' },
    { label: '已作废', value: '4' },
    { label: '已退款', value: '5' },
    { label: '退款中', value: '6' },
];
const qStatusOpts = [
    { label: '正常', value: '1' },
    { label: '已删除', value: '2' },
];
const isSendOpts = [
    { label: '不发送', value: '0' },
    { label: '仅发送短信', value: '1' },
    { label: '仅推送微信', value: '2' },
    { label: '同时发送短信和微信', value: '4' },
    { label: '微信推送不成功则发送短信', value: '3' },
];
const wayOpts = [
    { value: '', label: '全部' },
    { value: '10', label: '购买' },
    { value: '11', label: '商家赠送' },
    { value: '12', label: '摇奖活动赠送' },
    { value: '13', label: '储值套餐赠送' },
    { value: '14', label: '定额卡充值赠送' },
    { value: '15', label: '商城售卖' },
    { value: '16', label: '积分兑换发放' },
    { value: '17', label: 'openAPI发放' },
    { value: '18', label: '下单抽抽乐' },
    { value: '19', label: '限时秒杀' },
    { value: '124', label: '券包' },
    { value: '166', label: '消费送礼活动' },

];
const stockOpts = [
    { value: '1', label: '不限制' },
    { value: '2', label: '剩余库存' },
];
const separItems = {
    a: {
        type: 'custom',
        render: () => (<div className="separate"><h3>基本信息</h3></div>),
    },
    b: {
        type: 'custom',
        render: () => (<div className="separate"><h3>礼品设置</h3></div>),
    },
    c: {
        type: 'custom',
        label: <span></span>,
        render: () => (<p className="formTips">设置「付费购买」后，用户需付费购买才能获得券包；如通过活动或储值套餐或商城发放请选择「活动/商城投放」</p>),
    },
    c1: {
        type: 'custom',
        wrapperCol: { span: 24 },
        render: () => (<div className="separate"><h3 style={{ display: 'inline-block' }}>分享设置</h3> <span>（仅支持自定义小程序分享文案和图片，H5为默认设置 ）</span></div>),
    },
    d: {
        type: 'custom',
        label: <span></span>,
        render: () => (<p className="formTips">不填表示长期有效</p>),
    },
    e: {
        type: 'custom',
        label: <span></span>,
        render: () => (<p className="formTips">不填表示不限制</p>),
    },
    f: {
        type: 'custom',
        label: <span></span>,
        render: () => (<p className="formTips">未选择门店时默认所有店铺通用</p>),
    },
}
// 表单内 小问号的 tip
const tipMargin = { margin: '0 -5px 0 5px' };
const priceLabel = (<span>
        记录实收金额
        <Tip title="记录实收金额：仅用于报表作为实收金额核算" style={tipMargin} />
    </span>);
const wayLabel = (
    <span>
        发放类型
        <Tip title={(
            <div>
                <p>券包首次发放是购买/储值/参加活动后即时发；</p>
                <p>后续发放将按设定的周期和时间发送，后续的发送次数为设置的发送次数-1；</p>
            </div>
        )} />
    </span>);
const revokeLabel = (<span>
    系统过期自动退
    <Tip
        title={<p>付费购买的券包中所有券均未使用时，支持按包含券有效期最长的一张券的过期时间自动退款。</p>}
        style={tipMargin}
    />
</span>);
const userLabel = (<span>
    用户自助退款
    <Tip
        title={<p>付费购买的券包中所有券均未使用并状态都为“可使用”或“已过期”时，<br />
            支持用户自助退款。</p>}
        style={tipMargin}
    />
</span>);
// 计算售卖时间禁止日期函数
function range(start, end) {
    return Array(end - start).fill(0).map((value, idx) => {
        return idx + start;
    });
}
// 宣传图默认图
const couponImage = 'basicdoc/ca249689-3339-4895-b481-43322147862f.png';
// http://wiki.hualala.com/pages/viewpage.action?pageId=46546447 java API
// 第一次必须加载所有keys，不然会导致回显的时候出问题
// 付费购买  活动投放
const keys1 = ['a', 'couponPackageType', 'c', 'sellTime', 'd', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice', 'settleUnitID', 'defaultCardTypeID','remainStock', 'e','maxBuyCount', 'shopInfos', 'f', 'buySelectShop','isAutoRefund', 'isRefundSelf', 'couponPackageDesciption', 'couponPackageImage'];
const keys2 = ['a', 'couponPackageType', 'c', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice2', 'remainStock', 'e', 'couponPackageDesciption', 'couponPackageImage'];

const acitveKeys =  ['a', 'couponPackageType', 'c', 'couponPackageName', 'couponPackageValue',
'couponPackagePrice2', 'couponPackageDesciption', 'couponPackageImage']; // 创建新的活动、商城投放没有券包库存

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
        rules: [
            'required',
            'stringLength',
            {
                validator: (rule, v, cb) => {
                    if(String(v || '').includes('，')||String(v || '').includes(',')) {
                        cb(rule.message);
                    }
                    cb();
                },
                message: '请不要输入逗号',
            },
        ],
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
        rules: [{
            required: true,
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
    settleUnitID: {
        label: '券包结算主体',
        type: 'custom',
        defaultValue: '',
        rules: ['required'],
    },
    defaultCardTypeID: {
        label: '新用户注册卡类',
        type: 'custom',
        defaultValue: '',
        rules: ['required'],
    },
    couponPackagePrice2: {
        type: 'text',
        label: priceLabel,
        surfix: '元',
        props: {
            placeholder: '请输入记录实收金额',
        },
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                if(!pattern.test(value)){
                    return callback('最大支持8位整数，2位小数');
                }
                return callback();
            },
        }],
    },
    remainStock: {
        type: 'text',
        label: '券包库存',
        props: {
            placeholder: '不填表示不限制',
        },
        rules: [{
            validator: (rule, value, callback) => {
                const pattern = /^([1-9]\d*)$/;
                if(value && !pattern.test(value)){
                    return callback('请输入数字，并大于0');
                }
                return callback();
            },
        }],
    },

    maxBuyCount: {
        type: 'text',
        label: '可购买数量',
        defaultValue:'',
        props: {
            placeholder: '请输入每人可购买数量，不填表示不限制',
        },
        rules: [{
            validator: (rule, value, callback) => {
                const pattern = /^([1-9]\d{0,7})$/;
                if(value && !pattern.test(value)){
                    return callback('请输入大于0的8位以内整数');
                }
                return callback();
            },
        }],
    },
    shopInfos: {
        type: 'custom',
        label: '可售卖店铺',
        defaultValue: [],
        render: null,
        props: {
            placeholder: '默认全部店铺',
        },
    },
    buySelectShop:{
        type: 'radio',
        label: '购买需选择售卖店铺',
        options: needSelectShop,
        defaultValue: 0,
    },
    isAutoRefund: {
        type: 'radio',
        label: revokeLabel,
        options: revokeOpts,
        defaultValue: '1',
    },
    isRefundSelf: {
        type: 'radio',
        label: userLabel,
        options: userOpts,
        defaultValue: '1',
    },
    couponPackageDesciption: {
        type: 'textarea',
        label: '券包说明',
        rules: ['description2'],
    },
    couponPackageImage: {
        type: 'custom',
        label: '宣传图',
        props: { defValue: couponImage },
        render: null,
    },
    couponSendWay: {
        type: 'radioButton',
        label: wayLabel,
        options: sendOpts,
        defaultValue: '1',
    },
    couponPackageGiftConfigs: {
        type: 'custom',
        label: '券包内容',
        defaultValue: [],
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('券包内容不能为空');
                }
                return callback();
            },
        }],
        render: null,
    },
    couponPackageRadioSelect: {
        type: 'radio',
        label: '券包内容',
        options: couponPackageRadio,
        defaultValue: '1',
    },
    couponPackageGift:{
        type: 'custom',
        label: ' ',
        defaultValue: [],
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('礼品不能为空');
                }
                return callback();
            },
        }],
        render: null,
    },
    couponPackageFirstGift: {
        type: 'custom',
        label: '首次发放',
        defaultValue: [],
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('首次发放礼品不能为空');
                }
                return callback();
            },
        }],
        render: null,
    },
    couponPackageFollowGift: {
        type: 'custom',
        label: '后续发放',
        defaultValue: [],
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!value[0]) {
                    return callback('后续发放礼品不能为空');
                }
                return callback();
            },
        }],
        render: null,
    },
    couponPackageGiftConfigs: {
        type: 'custom',
        label: '券包内容',
        defaultValue: [],
        rules: [{
            required: true,
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
            hideDisabledOptions: true,
            defaultOpenValue: moment('00:00', 'HH:mm'),
        }
    },
    maxSendLimit: {
        type: 'text',
        label: '发送次数',
        rules: [{
            required:true, 
            validator: (rule, value, callback) => {
                const pattern = /^([1-9]\d{0,7})$/;
                if(!value){
                    return callback('发送次数不能为空');
                }
                if(value && !pattern.test(value)){
                    return callback('请输入大于0的8位以内整数');
                }
                return callback();
            },
        }],
        props: {
            placeholder: '请输入需要发送总次数',
        },
    },
    validCycle: {
        type: 'custom',
        label: '选择日期',
        render: null,
        defaultValue: ['w1', 'm1'],
    },
    shareTitle: {
        type: 'text',
        label: '分享标题',
        defaultValue: ''
    },
    miniProgramShareImagePath: {
        type: 'custom',
        label: '分享图片',
        render: null,
    },
    ...separItems,
};

// 一次性发放全部礼品 周期发放礼品
const keys3 = ['b', 'couponSendWay', 'couponPackageGiftConfigs'];
const keys4 = ['b', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime', 'maxSendLimit', 'couponPackageGiftConfigs'];
const keys5 = ['b', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime', 'maxSendLimit', 'couponPackageGiftConfigs'];

const keys6 = ['c1', 'shareTitle', 'miniProgramShareImagePath'];
const keys7 = ['b', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime',  'maxSendLimit', 'couponPackageRadioSelect','couponPackageGift'];

const keys8 = ['b', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime', 'maxSendLimit', 'couponPackageRadioSelect','couponPackageFirstGift','couponPackageFollowGift'];
const keys9 = ['b', 'couponSendWay', 'cycleType', 'validCycle','sendTime', 'maxSendLimit', 'couponPackageRadioSelect','couponPackageGift'];
const keys10 = ['b', 'couponSendWay', 'cycleType', 'validCycle','sendTime', 'maxSendLimit', 'couponPackageRadioSelect','couponPackageFirstGift','couponPackageFollowGift'];
const keys11 = ['b', 'couponSendWay', 'cycleType', 'validCycle', 'sendTime', 'maxSendLimit', 'couponPackageRadioSelect','couponPackageFirstGift'];
const keys12 = ['b', 'couponSendWay', 'cycleType', 'validCycle','sendTime', 'maxSendLimit', 'couponPackageRadioSelect','couponPackageFirstGift'];
const formKeys = [
    {
        col: { className: 'baseform-a' },
        keys: keys1,
    },
    {
        col: { className: 'baseform-b' },
        keys: keys5,
    },
    {
         col: { className: 'baseform-c1' },
         keys: keys6,
    },
];

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};
const weekMap = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
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

const qFormKeys = ['name', 'couponPackageType', 'q'];

const qFormItems = {
    name: {
        type: 'text',
        label: '券包名称',
    },
    couponPackageType: {
        type: 'combo',
        label: '券包类型',
        options: [{ value: '', label: '全部' }, ...bagOpts],
        defaultValue: '',
    },
    couponPackageStatus: {
        type: 'combo',
        label: '状态',
        options: qStatusOpts,
        defaultValue: '1',
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

const dFormKeys = ['getWay', 'couponPackageStatus', 'customerMobile', 'sendTime', 'sendShopID', 'q'];
const dFormKeys2 = ['getWay', 'customerMobile', 'useTime', 'q'];
const dFormKeys3 = ['customerCouponPackageID', 'couponPackageStatus', 'linkOrderNo', 'customerMobile', 'sendTime', 'q'];
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
        props: {
            format: 'YYYY-MM-DD HH:mm',
            showTime: { format: 'HH:mm' },
        }
    },
    customerMobile: {
        type: 'text',
        label: '手机号',
    },
    useTime: {
        type: 'datepickerRange',
        label: '使用时间',
        props: {
            format: 'YYYY-MM-DD HH:mm',
            showTime: { format: 'HH:mm' },
        }
    },
    customerCouponPackageID: {
        type: 'text',
        label: '券包编码',
    },
    linkOrderNo: {
        type: 'text',
        label: '订单编号',
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
        rules: [{
            required: true,
            message: '请输入正确的手机号码',
            pattern: /^[1]([3-9])[0-9]{9}$/,
        }],
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
const refundItems = {
    refundReason: {
        type: 'textarea',
        label: '退款原因',
        rules: ['description'],
    },
};
const stockItems = {
    type: {
        type: 'radio',
        label: <span></span>,
        options: stockOpts,
        defaultValue: '2',
    },
    remainStock: {
        type: 'text',
        label: '',
        surfix: '份',
        props: {
            placeholder: '最大支持7位整数',
        },
        rules: [{
            validator: (rule, value, callback) => {
                const pattern = /^([0-9]\d{0,6})$/;
                if(!pattern.test(value)){
                    return callback('最大支持7位整数');
                }
                return callback();
            },
        }],
    },
};
export {
    formItems, imgURI, formKeys, href, formItemLayout,
    keys1, keys2, keys3, keys4, keys5,keys7,keys8,keys9,keys10,keys11,keys12, DF, TF, monthList, weekList, weekMap,
    qFormKeys, qFormItems, dFormKeys, dFormItems, pFormKeys, pFormItems, pFormKeys2,
    dFormKeys2, dFormKeys3, refundItems, couponImage, stockItems, acitveKeys
}
