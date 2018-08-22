import React from 'react';
import { Tooltip, span } from 'antd';
import Moment from 'moment';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
import { PWDSafe } from './QuatoCardDetailModalTabs';

const format = 'YYYY/MM/DD HH:mm';
function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
const CARD_SUM_COLUMNS = [
    {
        title: '序号',
        dataIndex: 'rowNum',
        key: 'rowNum',
        className: 'TableTxtCenter',
        width: 50,
        fixed: 'left',
        render(value) { return ((this.state.pageNo || 1) - 1) * this.state.pageSize + value}  ,
    }, {
        title: '卡名称',
        dataIndex: 'giftName',
        key: 'giftName',
        width: 120,
        fixed: 'left',
        render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
    }, {
        title: '批次号',
        dataIndex: 'batchNO',
        key: 'batchNO',
        width: 80,
        fixed: 'left',
    }, {
        title: '卡号',
        dataIndex: 'cardNO',
        key: 'cardNO',
        width: 150,
        fixed: 'left',
    }, {
        title: '密码',
        dataIndex: 'giftPWD',
        key: 'giftPWD',
        className: 'TableTxtCenter',
        width: 110,
        render: (value, record) => <PWDSafe key={`${record.cardNO}`} value={value} />,
    }, {
        title: '状态',
        dataIndex: 'giftStatus',
        key: 'giftStatus',
        width: 70,
        render: (value) => {
            return <span>{mapValueToLabel(GiftCfg.giftCardStatus, String(value))}</span>
        },
    }, {
        title: '实收',
        dataIndex: 'price',
        key: 'price',
        className: 'x-tr',
    }, {
        title: '实收方式',
        dataIndex: 'payWayName',
        key: 'payWayName',
        render: (value) => { return value || '--' },
    }, {
        title: '制卡人',
        dataIndex: 'createBy',
        key: 'createBy',
        render: (value) => { return value ? <Tooltip title={value}><span>{value}</span></Tooltip> : '' },
    }, {
        title: '制卡时间',
        dataIndex: 'createTime',
        key: 'createTime',
        className: 'TableTxtCenter',
        width: 120,
        render: (v) => { return v ? Moment(v, 'YYYYMMDDHHmmss').format(format) : '--' },
    }, {
        title: '售出人',
        dataIndex: 'seller',
        key: 'seller',
        width: 100,
        render: (value) => { return value ? <Tooltip title={value}><span>{value}</span></Tooltip> : '' },
    }, {
        title: '售出店铺',
        dataIndex: 'usingShopName',
        className: 'TableTxtCenter',
        key: 'usingShopName',
        render: (value) => { return value ? <Tooltip title={value}><span>{value}</span></Tooltip> : '' },
    }, {
        title: '售出时间',
        dataIndex: 'sellTime',
        className: 'TableTxtCenter',
        width: 120,
        key: 'sellTime',
        render: (v) => { return v ? Moment(v, 'YYYYMMDDHHmmss').format(format) : '--' },
    }, {
        title: '充值会员卡号',
        dataIndex: 'rechargeToCardNO',
        key: 'rechargeToCardNO',
        width: 140,
        render: (value) => { return value ? <Tooltip title={value}><span>{value}</span></Tooltip> : '' },
    }, {
        title: '充值时间',
        dataIndex: 'rechargeTime',
        className: 'TableTxtCenter',
        width: 120,
        key: 'rechargeTime',
        render: (v) => { return v ? Moment(v, 'YYYYMMDDHHmmss').format(format) : '--' },
    },
];
const CARD_SUM_FORMITEMS = {
    giftStatus: {
        label: '卡状态',
        type: 'combo',
        options: GiftCfg.giftCardStatus,
        props: {
            showSearch: true,
        },
        defaultValue: '',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    },
    cardNO_sum: {
        label: '卡号',
        type: 'text',
        placeholder: '请输入卡号',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    },
    batchNO_sum: {
        label: '批次号',
        type: 'text',
        placeholder: '请输入批次号',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    },
    timeRangeSend_sum: {
        label: '售出时间',
        type: 'datepickerRange',
        showTime: true,
        format,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    },
    payWayName: {
        label: '实收方式',
        type: 'combo',
        options: GiftCfg.payWayName,
        defaultValue: '',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        props: {
            showSearch: true,
        },
    },
};
const CARD_SUM_FROMKEYS = [{ col: { span: 8 }, keys: ['batchNO_sum', 'payWayName'] },
    { col: { span: 8 }, keys: ['cardNO_sum', 'timeRangeSend_sum'] },
    { col: { span: 8 }, keys: ['giftStatus', 'usingShopID'] }];

export { CARD_SUM_COLUMNS, CARD_SUM_FORMITEMS, CARD_SUM_FROMKEYS }
