import React from 'react';
import Point from './Point';
import Ticket from './Ticket';

const giftTypeName= [
    { label: '全部', value: '' },
    { label: '代金券', value: '10' },
    { label: '菜品优惠券', value: '20' },
    { label: '菜品兑换券', value: '21' },
    { label: '实物礼品券', value: '30' },
    { label: '会员充值券', value: '40' },
    { label: '会员积分券', value: '42' },
    { label: '会员权益券', value: '80' },
    { label: '礼品定额卡', value: '90' },
    { label: '线上礼品卡', value: '91' },
    { label: '买赠券', value: '110' },
    { label: '折扣券', value: '111' },
    { label: '现金红包', value: '113' },
    { label: '配送券', value: '22' },
];
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
};
const formItems = {
    giftOdds: {
        type: 'text',
        label: '中奖概率',
        surfix: '%',
        wrapperCol: { span: 6 },
        rules: ['required', 'numbers'],
    },
    point: {
        type: 'custom',
        defaultValue: {},
        render: d => d()(<Point />),
    },
    ticket: {
        type: 'custom',
        defaultValue: {},
        render: d => d()(<Ticket />),
    },
};
const formKeys = ['giftOdds', 'point', 'ticket'];
export {
    giftTypeName, formItemLayout, formKeys, formItems,
}
