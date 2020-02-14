import React, { Component } from 'react';
import _ from 'lodash';
import { COMMON_LABEL } from 'i18n/common';
import GiftCfg from '../../../constants/Gift';
import Authority from '../../../components/common/Authority';
import {Tooltip} from 'antd';
import {GIFT_DETAIL_QUERY, GIFT_LIST_DELETE, GIFT_LIST_UPDATE} from "../../../constants/authorityCodes";
import {
    getHuaTianDisabledGifts, isBrandOfHuaTianGroupList, isHuaTian,
    isMine
} from "../../../constants/projectHuatianConf";

// { label: '代金券', value: '10' },
// { label: '菜品优惠券', value: '20' },
// { label: '菜品兑换券', value: '21' },
// { label: '实物礼品券', value: '30' },
// { label: '会员充值券', value: '40' },
// { label: '会员积分券', value: '42' },
// { label: '会员权益券', value: '80' },
// { label: '礼品定额卡', value: '90' },
// { label: '活动券', value: '100' },
// { label: '线上礼品卡', value: '91' },
// { label: '买赠券', value: '110' },
// { label: '折扣券', value: '111' },
// { label: '现金红包', value: '113' },

const ONLINE_STORE_VISIBLE_GIFT_TYPE = [
    '10', '20', '21', '30', '40', '42', '80', '110', '111'
]

export const COLUMNS = [
    {
        title: COMMON_LABEL.serialNumber,
        dataIndex: 'num',
        key: 'num',
        className: 'x-tc',
        // fixed: 'left',
        width: 50,
    }, {
        title: COMMON_LABEL.actions,
        dataIndex: 'operate',
        className: 'TableTxtCenter',
        key: 'operate',
        // fixed: 'left',
        width: 200,
        render(value, record) {
            return (
                <span>
                    <Authority rightCode={GIFT_LIST_UPDATE}>
                        {
                            (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                                <a
                                    href="javaScript:;"
                                    disabled={true}
                                >{ COMMON_LABEL.edit }</a>
                            ) : (
                                <a
                                    href="javaScript:;"
                                    onClick={() => {
                                        this.handleEdit(record, 'edit')
                                    }
                                    }
                                >{ COMMON_LABEL.edit }</a>
                            )
                        }
                    </Authority>
                    <a
                        href="javaScript:;"
                        onClick={() => {
                            this.handleEdit(record, 'detail')
                        }}
                    >
                        { COMMON_LABEL.view }
                    </a>
                    <Authority rightCode={GIFT_LIST_DELETE}>
                        {
                            (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                                <a disabled={true}><span>{ COMMON_LABEL.delete }</span></a>
                            ) : (
                                <a onClick={() => this.handleDelete(record)}><span>{ COMMON_LABEL.delete }</span></a>
                            )
                        }
                    </Authority>
                    {
                        ONLINE_STORE_VISIBLE_GIFT_TYPE.includes(`${record.giftType}`) && (
                            <a href="javaScript:;" onClick={() => this.handleGenerateLink(record)}>投放</a>
                        )
                    }
                    <Authority rightCode={GIFT_DETAIL_QUERY}>
                        {
                            (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                                <a disabled={true}>详情</a>
                            ) : (
                                <a href="javaScript:;" onClick={() => this.handleMore(record)}>{ COMMON_LABEL.detail }</a>
                            )
                        }
                    </Authority>
                </span>
            )
        },
    }, {
        title: '礼品类型',
        dataIndex: 'giftTypeName',
        key: 'giftTypeName',
        // fixed: 'left',
        width: 100,
        render: (value, record, index) => {
            return <span>{mapValueToLabel(GiftCfg.giftTypeName, String(record.giftType))}</span>
        },
    }, {
        title: '礼品ID',
        dataIndex: 'giftItemID',
        key: 'giftItemID',
        render: (value) => {
            return <span title={value}>{value}</span>
        },
        // fixed: 'left',
        width: 150,
    },  {
        title: '礼品名称',
        dataIndex: 'giftName',
        key: 'giftName',
        // fixed: 'left',
        render: (value) => {
            return <span title={value}>{value}</span>
        },
        width: 150,
    }, {
        title: '礼品金额 (元)',
        dataIndex: 'giftValue',
        key: 'giftValue',
        width: 100,
        className: 'x-tr',
    }, {
        title: '礼品描述',
        dataIndex: 'giftRemark',
        key: 'giftRemark',
        width: 150,
        render: (value) => {
            return <span title={value}>{value}</span>
        },
    }, {
        title: '创建人/修改人',
        dataIndex: 'operator',
        key: 'operator',
        width: 150,
        render: (value) => {
            return <span title={value}>{value}</span>
        },
    }, {
        title: '创建时间/修改时间',
        dataIndex: 'operateTime',
        key: 'operateTime',
        width: 150,
        className: 'x-tc',
    },
];
function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
