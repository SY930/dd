import React from 'react';
import { formItem } from '../constants/formItem'

const {
    actType, eventName50, eventRemark, eventLimitDate,
    partInTimes, eventCode, tagLst
} = formItem
export const formItems1 = {
    actType: {
        ...actType,
        render() {
            return <div>拼手气抢红包</div>;
        },
    },
    eventName: eventName50,
    eventCode,
    eventLimitDate,
    eventRemark,
    tagLst,
};

export const formKeys1 = [
    'actType',
    'eventName',
    'eventCode',
    'tagLst',
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
