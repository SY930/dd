import React from 'react';
import AddGift from './components/AddGift'
import { formItem } from '../constants/formItem'
import { TreeSelect } from 'antd';

const {
    actType, eventName, eventRemark, eventLimitDate,
    consumeTotalAmount, originalImageUrl, backgroundColor,
    consumeGiftID,afterPayJumpType, miniProgramInfo, eventDate,
} = formItem
export const formItems1 = {
    actType: {
        ...actType,
        render() {
            return <div>消费券返券</div>;
        },
    },
    eventName,
    // eventLimitDate,
    eventRemark,
};

export const formKeys1 = [
    'actType',
    'eventName',
    // 'eventLimitDate',
    'eventRemark',
];

export const imgUrl = 'http://res.hualala.com';

export const formItems2 = {
    consumeGiftID,
    mySendGift: {
        type: 'custom',
        label: '添加返券',
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
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    afterPayJumpType,
    miniProgramInfo,
    eventDate,
};

export const formKeys2 = [
    'consumeGiftID',
    'mySendGift',
];
