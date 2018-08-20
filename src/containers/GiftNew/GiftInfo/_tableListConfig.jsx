import React, { Component } from 'react';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
import Authority from '../../../components/common/Authority';
import {Tooltip} from 'antd';

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
                    <Authority rightCode="marketing.lipinxin.update">
                        <a
                            href="javaScript:;"
                            onClick={() => {
                                this.handleEdit(record, 'edit')
                            }
                            }
                        >编辑</a>
                    </Authority>
                    <a
                        href="javaScript:;"
                        onClick={() => {
                            this.handleEdit(record, 'detail')
                        }
                        }
                    >查看</a>
                    {record.sendTotalCount > 0 ?
                        <Tooltip title="券已发出，无法删除">
                            <a disabled={true}><span style={{pointerEvents: 'auto'}}>删除</span></a>
                        </Tooltip>
                        :
                        <Authority rightCode="marketing.lipinxin.delete">
                            <a onClick={() => this.handleDelete(record)}><span>删除</span></a>
                        </Authority>
                    }
                    <Authority rightCode="marketing.chakanlipinxin.query">
                        <a href="javaScript:;" onClick={() => this.handleMore(record)}>详情</a>
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
