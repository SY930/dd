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
        className:'TableTxtCenter',
        key: 'num',
    }, {
        title: '发出方式',
        className:'TableTxtCenter',
        dataIndex: 'getWay',
        key: 'getWay',
        render: (value) => {
            const label = mapValueToLabel(GiftCfg.getWay, String(value));
            return <Tooltip title={label}><span>{label}</span></Tooltip>
        },
    }, {
        title: '发出时间',
        dataIndex: 'createTime',
        className:'TableTxtCenter',
        key: 'createTime',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '发出店铺',
        dataIndex: 'sendShopName',
        className:'TableTxtCenter',
        key: 'sendShopName',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '有效日期',
        dataIndex: 'validUntilDate',
        className:'TableTxtCenter',
        key: 'validUntilDate',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '姓名',
        className:'TableTxtCenter',
        dataIndex: 'customerName',
        key: 'customerName',
    }, {
        title: '性别',
        dataIndex: 'customerSex',
        className:'TableTxtCenter',
        key: 'customerSex',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.sex, String(value))}</span>
        },
    }, {
        title: '手机号',
        className:'TableTxtCenter',
        dataIndex: 'customerMobile',
        key: 'customerMobile',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    },
];
const SEND_COLUMNS = [...BASE_COLUMNS.slice(0, 5), {
    title: '状态',
    dataIndex: 'giftStatus',
    className:'TableTxtCenter',
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
        className:'TableTxtCenter',
        key: 'num',
    }, {
        title: '获得方式',
        dataIndex: 'getWay',
        width: 80,
        className:'TableTxtCenter',
        key: 'getWay',
        render: (value) => {
            const label = mapValueToLabel(GiftCfg.getWay, String(value));
            return <Tooltip title={label}><span>{label}</span></Tooltip>
        },
    }, {
        title: '获得时间',
        width: 150,
        dataIndex: 'createTime',
        className:'TableTxtCenter',
        key: 'createTime',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '获得店铺',
        className:'TableTxtCenter',
        dataIndex: 'sendShopName',
        key: 'sendShopName',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '使用时间',
        className:'TableTxtCenter',
        dataIndex: 'usingTime',
        key: 'usingTime',
        render: value => <Tooltip title={value}><span>{value == '0' ? '' : value}</span></Tooltip>,
    }, {
        title: '使用店铺',
        className:'TableTxtCenter',
        dataIndex: 'usingShopName',
        key: 'usingShopName',
        render: (value = '') => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '姓名',
        className:'TableTxtCenter',
        dataIndex: 'customerName',
        key: 'customerName',
    }, {
        title: '性别',
        className:'TableTxtCenter',
        dataIndex: 'customerSex',
        key: 'customerSex',
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.sex, String(value))}</span>
        },
    }, {
        title: '手机号',
        dataIndex: 'customerMobile',
        className:'TableTxtCenter',
        width: 100,
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
        key: 'customerMobile',
    }, {
        title: '会员卡号',
        width: 120,
        className:'TableTxtCenter',
        dataIndex: 'transCardNo',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
        key: 'transCardNo',
    },
];
export { FORMITEMS, SEND_FORMKEYS, SEND_COLUMNS, WX_SEND_COLUMNS, USED_FORMKEYS, USED_COLUMNS, WX_SEND_FORMKEYS };
