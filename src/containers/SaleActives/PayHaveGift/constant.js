import React from 'react';
import AddGift from './components/AddGift'
import { formItem } from '../constants/formItem'

const {
    actType, eventName, merchantLogoUrl, eventRemark,
    consumeTotalAmount, originalImageUrl, backgroundColor,
    afterPayJumpType, miniProgramInfo, eventDate,
} = formItem
export const formItems1 = {
    actType: {
        ...actType,
        render() {
            return <div>微信支付有礼</div>;
        },
    },
    eventName,
    merchantLogoUrl,
    eventRemark,
};

export const formKeys1 = [
    'actType',
    'eventName',
    'merchantLogoUrl',
    'eventRemark',
];

export const imgUrl = 'http://res.hualala.com';

export const formItems2 = {
    consumeTotalAmount,
    mySendGift: {
        type: 'custom',
        label: '投放礼品',
        render(d) {
            return (
                <div>
                    {d({
                        rules: [
                            {
                                required: true,
                                message: '请选择投放礼品',
                            },
                        ],
                    })(<AddGift dispatch={this.props.dispatch} />)}
                </div>
            );
        },
    },
    originalImageUrl,
    backgroundColor,
    afterPayJumpType,
    miniProgramInfo,
    eventDate,
};

export const formKeys2 = [
    'consumeTotalAmount',
    'mySendGift',
    'originalImageUrl',
    'backgroundColor',
    'afterPayJumpType',
    // "miniProgramInfo",
    'eventDate',
];
