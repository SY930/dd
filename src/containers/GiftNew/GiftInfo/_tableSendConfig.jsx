import React from 'react';
import { Tooltip, span } from 'antd';
import GiftCfg from '../../../constants/Gift';
import { mapValueToLabel } from './CommonFn';

const format = 'YYYY/MM/DD HH:mm';
const FORMITEMS = {
    timeRangeSend: {
        label: '发出时间',
        type: 'datepickerRange',
        showTime: true,
        format,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    giftStatus: {
        label: '状态',
        type: 'combo',
        defaultValue: '',
        options: GiftCfg.giftSendStatus,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    WXgiftCardStatus: {
        label: '状态',
        type: 'combo',
        defaultValue: '',
        options: GiftCfg.WXgiftCardStatus,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    getWay: {
        label: '发出方式',
        type: 'combo',
        props: {
            showSearch: true,
        },
        defaultValue: '',
        options: GiftCfg.getWay,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    timeRangeUsed: {
        label: '使用时间',
        type: 'datepickerRange',
        showTime: true,
        format,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
    mobileNum: {
        label: '手机号',
        type: 'text',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
};
const SEND_FORMKEYS = [{ col: { span: 12 }, keys: ['getWay', 'timeRangeSend', 'mobileNum'] },
{ col: { span: 12, offset: 0 }, keys: ['giftStatus', 'sendShopID'] }];
const WX_SEND_FORMKEYS = [{ col: { span: 12 }, keys: ['getWay', 'timeRangeSend', 'mobileNum'] },
{ col: { span: 12, offset: 0 }, keys: ['WXgiftCardStatus'] }];
const BASE_COLUMNS = [
    {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
    }, {
        title: '发出方式',
        dataIndex: 'getWay',
        key: 'getWay',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.getWay, String(value))}</span>
        },
    }, {
        title: '发出时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '发出店铺',
        dataIndex: 'sendShopName',
        key: 'sendShopName',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '有效日期',
        dataIndex: 'validUntilDate',
        key: 'validUntilDate',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '姓名',
        dataIndex: 'customerName',
        key: 'customerName',
    }, {
        title: '性别',
        dataIndex: 'customerSex',
        key: 'customerSex',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.sex, String(value))}</span>
        },
    }, {
        title: '手机号',
        dataIndex: 'customerMobile',
        key: 'customerMobile',
    },
];
const SEND_COLUMNS = [...BASE_COLUMNS.slice(0, 5), {
    title: '状态',
    dataIndex: 'giftStatus',
    key: 'giftStatus',
    render: (value) => {
        return <span>{mapValueToLabel(GiftCfg.giftSendStatus, String(value))}</span>
    },
}, ...BASE_COLUMNS.slice(5)]
const WX_SEND_COLUMNS = [...BASE_COLUMNS.slice(0, 5), {
    title: '状态',
    dataIndex: 'giftStatus',
    key: 'giftStatus',
    render: (value) => {
        return <span>{mapValueToLabel(GiftCfg.WXgiftCardStatus, String(value))}</span>
    },
}, ...BASE_COLUMNS.slice(5)]
const USED_FORMKEYS = [{ col: { span: 12 }, keys: ['timeRangeUsed'] }, { col: { span: 11, offset: 1 }, keys: ['usingShopID'] }];
const USED_COLUMNS = [
    {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
    }, {
        title: '获得方式',
        dataIndex: 'getWay',
        key: 'getWay',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.getWay, String(value))}</span>
        },
    }, {
        title: '获得时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '获得店铺',
        dataIndex: 'sendShopName',
        key: 'sendShopName',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '使用时间',
        dataIndex: 'usingTime',
        key: 'usingTime',
        render: value => <Tooltip title={value}><span>{value == '0' ? '' : value}</span></Tooltip>,
    }, {
        title: '使用店铺',
        dataIndex: 'usingShopName',
        key: 'usingShopName',
        render: (value = '') => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '姓名',
        dataIndex: 'customerName',
        key: 'customerName',
    }, {
        title: '性别',
        dataIndex: 'customerSex',
        key: 'customerSex',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.sex, String(value))}</span>
        },
    }, {
        title: '手机号',
        dataIndex: 'customerMobile',
        key: 'customerMobile',
    },
];
export { FORMITEMS, SEND_FORMKEYS, SEND_COLUMNS, WX_SEND_COLUMNS, USED_FORMKEYS, USED_COLUMNS, WX_SEND_FORMKEYS };
