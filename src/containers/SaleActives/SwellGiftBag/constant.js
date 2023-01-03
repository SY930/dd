import React from 'react';
import { formItem } from '../constants/formItem'

const {
    actType,
    eventName50,
    eventRemark,
    eventLimitDate,
    partInTimes,
    defaultCardType,
    eventCode,
} = formItem;
export const formItems1 = {
    actType: {
        ...actType,
        render() {
            return <div>膨胀大礼包</div>;
        },
    },
    eventName: eventName50,
    eventCode,
    eventLimitDate,
    eventRemark,
};

// _TODO
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
    defaultCardType,

};

export const formKeys2 = [
    'partInTimes',
    'defaultCardType',
];
