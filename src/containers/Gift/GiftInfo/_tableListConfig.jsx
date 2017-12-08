import React, { Component } from 'react';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
export const COLUMNS = [
            {
                title: '礼品类型',
                dataIndex: 'giftTypeName',
                key: 'giftTypeName',
                // fixed: 'left',
                width: 100,
                render: (value, record, index) => {
                    return <span>{mapValueToLabel(GiftCfg.giftTypeName, String(record.giftType))}</span>
                }
            }, {
                title: '礼品名称',
                dataIndex: 'giftName',
                key: 'giftName',
                // fixed: 'left',
                width: 150,
            }, {
                title: '礼品金额',
                dataIndex: 'giftValue',
                key: 'giftValue',
                width: 100,
                className: 'x-tr',
            }, {
                title: '已发送数量',
                dataIndex: 'sendTotalCount',
                key: 'sendTotalCount',
                width: 100,
                className: 'x-tr',
            }, {
                title: '已使用数量',
                dataIndex: 'usedCount',
                key: 'usedCount',
                width: 100,
                className: 'x-tr',
            }, {
                title: '礼品规则',
                dataIndex: 'giftRule',
                key: 'giftRule',
                className: 'gift-rule',
                render: (value, record) => {
                    if (record.giftTypeName == '菜品优惠券') {
                        return (record.isFoodCatNameList ?
                            <div>
                                {value.map((item, idx) => {
                                    if (idx < (value.length - 1)) {
                                        return <div key={idx}><span>{`${++idx}、`}</span><p>{item}</p></div>
                                    } else {
                                        return <div key={idx}><span>{`${++idx}、`}</span><p>{item}</p></div>
                                    }
                                })}
                            </div>
                            :
                            <div>{value.map((item, idx) => { return <div key={idx}><span>{`${++idx}、`}</span><p>{item}</p></div> })}</div>)
                    } else {
                        return <div>{value.map((item, idx) => { return <div key={idx}><span>{`${++idx}、`}</span><p>{item}</p></div> })}</div>
                    }
                },
            }, {
                title: '礼品描述',
                dataIndex: 'giftRemark',
                key: 'giftRemark',
                width: 150,
            }, {
                title: '创建人/修改人',
                dataIndex: 'operator',
                key: 'operator',
                width: 150,
            }, {
                title: '创建时间/修改时间',
                dataIndex: 'operateTime',
                key: 'operateTime',
                width: 150,
                className: 'x-tc',
            }
        ];
function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value : val}), 'label');
}
