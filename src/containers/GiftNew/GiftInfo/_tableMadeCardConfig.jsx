import React, { Component } from 'react';
import { Tooltip } from 'antd';
import GiftCfg from '../../../constants/Gift';

const MADECARD_COLUMNS = [
    {
        title: '序号',
        dataIndex: 'rowNum',
        key: 'rowNum',
        width: 50,
        className: 'x-tc',
    }, {
        title: '卡名称',
        dataIndex: 'giftName',
        key: 'giftName',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '批次号',
        dataIndex: 'batchNO',
        key: 'batchNO',
        width: 100,
    }, {
        title: '卡号',
        dataIndex: 'cardNO',
        key: 'cardNO',
        width: 200,
    },
];
const MADECARD_QUERY_FORMITEMS = {
    queryGiftStatus: {
        label: '卡状态',
        type: 'combo',
        options: GiftCfg.giftCardStatus,
        defaultValue: '',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    },
    cardNO_madeCard: {
        label: '卡号',
        type: 'text',
        placeholder: '请输入卡号',
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    },
    batchNO_madeCard: {
        label: '批次号',
        type: 'text',
        placeholder: '请输入批次号',
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    },
};
const MADECARD_FORMKEYS = [{ col: { span: 8 }, keys: ['queryGiftStatus'] },
    { col: { span: 8 }, keys: ['cardNO_madeCard'] },
    { col: { span: 8 }, keys: ['batchNO_madeCard'] }];
export { MADECARD_COLUMNS, MADECARD_FORMKEYS, MADECARD_QUERY_FORMITEMS };
