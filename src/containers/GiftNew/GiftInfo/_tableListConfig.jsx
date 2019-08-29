import React, { Component } from 'react';
import _ from 'lodash';
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

const ONLINE_STORE_VISIBLE_GIFT_TYPE = [
    '10', '20', '21', '30', '40', '42', '80', '110', '111'
]

export const COLUMNS = [
    {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
        className: 'x-tc',
        // fixed: 'left',
        width: 50,
    }, {
        title: '操作',
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
                                >编辑</a>
                            ) : (
                                <a
                                    href="javaScript:;"
                                    onClick={() => {
                                        this.handleEdit(record, 'edit')
                                    }
                                    }
                                >编辑</a>
                            )
                        }
                    </Authority>
                    <a
                        href="javaScript:;"
                        onClick={() => {
                            this.handleEdit(record, 'detail')
                        }}
                    >
                        查看
                    </a>
                    {record.sendTotalCount > 0 ?
                        <Tooltip title="券已发出，无法删除">
                            <a disabled={true}><span style={{pointerEvents: 'auto'}}>删除</span></a>
                        </Tooltip>
                        :
                        <Authority rightCode={GIFT_LIST_DELETE}>
                            {
                                (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                                    <a disabled={true}><span>删除</span></a>
                                ) : (
                                    <a onClick={() => this.handleDelete(record)}><span>删除</span></a>
                                )
                            }
                        </Authority>
                    }
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
                                <a href="javaScript:;" onClick={() => this.handleMore(record)}>详情</a>
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
    // }, {
    //     title: '已发送数量',
    //     dataIndex: 'sendTotalCount',
    //     key: 'sendTotalCount',
    //     width: 100,
    //     className: 'x-tr',
    // }, {
    //     title: '已使用数量',
    //     dataIndex: 'usedCount',
    //     key: 'usedCount',
    //     width: 100,
    //     className: 'x-tr',
    // }, {
    //     title: '礼品规则',
    //     dataIndex: 'giftRule',
    //     key: 'giftRule',
    //     className: 'gift-rule',
    //     render: (value, record) => {
    //         if (record.giftTypeName == '菜品优惠券') {
    //             return (record.isFoodCatNameList ?
    //                 <div>
    //                     {value.map((item, idx) => {
    //                         if (idx < (value.length - 1)) {
    //                             return <div key={idx} className="wrapLetter"><span>{`${++idx}、`}</span><span>{item}</span></div>
    //                         }
    //                         return <div key={idx} className="wrapLetter"><span>{`${++idx}、`}</span><span>{item}</span></div>
    //                     })}
    //                 </div>
    //                 :
    //                 <div>{value.map((item, idx) => {
    //                     return <div key={idx} className="wrapLetter"><span>{`${++idx}、`}</span><span>{item}</span></div>
    //                 })}</div>)
    //         }
    //         return (<div>{value.map((item, idx) => {
    //             return <div key={idx} className="wrapLetter"><span>{`${++idx}、`}</span><span>{item}</span></div>
    //         })}</div>)
    //     },
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
