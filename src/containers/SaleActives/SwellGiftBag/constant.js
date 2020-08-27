import React from 'react';
import { formItem } from '../constants/formItem'

const {
    actType, eventName, eventRemark, eventLimitDate,
    partInTimes,
} = formItem
export const formItems1 = {
    actType: {
        ...actType,
        render() {
            return <div>膨胀大礼包</div>;
        },
    },
    eventName,
    eventLimitDate,
    eventRemark,
};

export const formKeys1 = [
    'actType',
    'eventName',
    'eventLimitDate',
    'eventRemark',
];

export const imgUrl = 'http://res.hualala.com';

export const formItems2 = {
    partInTimes,

};

export const formKeys2 = [
    'partInTimes',
];
