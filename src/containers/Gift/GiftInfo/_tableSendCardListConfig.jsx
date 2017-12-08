import React, { Component } from 'react';
import { Tooltip } from 'antd';
import Moment from 'moment';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
const format = "YYYY/MM/DD HH:mm";
const SENDCARD_COLUMNS = [
            {
                title:'批次号',
                dataIndex:'batchNO',
                key:'batchNO',
                fixed:'left',
                width: 140,
            },{
                title:'张数',
                dataIndex:'totalSum',
                key:'totalSum',
                className:'x-tr',
                width: 50,
            },{
                title:'状态',
                dataIndex:'status',
                key:'status',
                render:value=>value ? _.find(GiftCfg.giftSendStatus,{value:String(value)}).label : ''
            },{
                title:'已制卡',
                dataIndex:'createdNum',
                key:'createdNum',
                className:'x-tr',
                width: 50,
            },{
                title:'已售出',
                dataIndex:'soldNum',
                key:'soldNum',
                className:'x-tr',
                width: 50,
            },{
                title:'已充值',
                dataIndex:'rechargedNum',
                key:'rechargedNum',
                className:'x-tr',
                width: 50,
            },{
                title:'已作废',
                dataIndex:'cancelledNum',
                key:'cancelledNum',
                className:'x-tr',
                width: 50,
            },{
                title:'开户选择等级',
                dataIndex:'cardLevelName',
                key:'cardLevelName',
            },{
                title:'制卡日期',
                dataIndex:'createStamp',
                key:'createStamp',
                className:'x-tc',
                width: 120,
                render:v=>v ? <Tooltip title={Moment(v).format(format)}><span>{Moment(v).format(format)}</span></Tooltip> : '',
            },{
                title:'操作人',
                dataIndex:'seller',
                key:'seller',
                render:value=>value ? value : '',
            },{
                title:'备注',
                dataIndex:'remark',
                key:'remark',
                render:value=>value ? <Tooltip placement="topLeft" title={value}><span>{value}</span></Tooltip> : '',
            }
        ];
const SENDCARD_QUERY_FORMITEMS = {
            timeRangeSend_sendCard:{
                label:'发出时间',
                type:'datepickerRange',
                showTime:true,
                format:format,
                labelCol:{span:4},
                wrapperCol:{span:18},
            },
            batchNO_sendCard:{
                label:'批次号',
                type:'text',
                placeholder:'请输入批次号',
                labelCol:{span:4},
                wrapperCol:{span:18},
            }
    };
const SENDCARD_FORMKEYS = [{col:{span:14},keys:['timeRangeSend_sendCard']},{col:{span:10},keys:['batchNO_sendCard']}];
export { SENDCARD_COLUMNS, SENDCARD_QUERY_FORMITEMS, SENDCARD_FORMKEYS };
