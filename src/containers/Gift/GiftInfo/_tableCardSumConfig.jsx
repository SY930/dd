import React, { Component } from 'react';
import { Tooltip, span } from 'antd';
import Moment from 'moment';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
import { PWDSafe } from './QuatoCardDetailModalTabs';
const format = "YYYY/MM/DD HH:mm";
const CARD_SUM_COLUMNS = [
            {
                title:'序号',
                dataIndex:'rowNum',
                key:'rowNum',
                width:50,
                fixed:'left',
                className:'x-tc',
            },{
                title:'卡名称',
                dataIndex:'giftName',
                key:'giftName',
                width:120,
                fixed:'left',
                render:value=><Tooltip title={value}><span>{value}</span></Tooltip>
            },{
                title:'批次号',
                dataIndex:'batchNO',
                key:'batchNO',
                width:70,
                fixed:'left',
            },{
                title:'卡号',
                dataIndex:'cardNO',
                key:'cardNO',
                width:160,
                fixed:'left',
            },{
                title:'密码',
                dataIndex:'giftPWD',
                key:'giftPWD',
                width:110,
                render:(value)=><PWDSafe value={value}/>
            },{
                title:'状态',
                dataIndex:'giftStatus',
                key:'giftStatus',
                width:70,
                render:value=>value ? _.find(GiftCfg.giftCardStatus,{value:String(value)}).label : ''
            },{
                title:'实收',
                dataIndex:'price',
                key:'price',
                className:'x-tr',
            },{
                title:'实收方式',
                dataIndex:'payWayName',
                key:'payWayName',
                render:v=>v?v:'',
            },{
                title:'制卡人',
                dataIndex:'createBy',
                key:'createBy',
                render:v=>v ? v : '',
            },{
                title:'制卡时间',
                dataIndex:'createTime',
                key:'createTime',
                className:'x-tc',
                render:v=>v ? Moment(v,'YYYYMMDDHHmmss').format(format) : '--',
            },{
                title:'售出人',
                dataIndex:'seller',
                key:'seller',
                render:value=>value ? value : '--',
            },{
                title:'售出店铺',
                dataIndex:'usingShopName',
                key:'usingShopName',
                render:value=>value ? <Tooltip title={value}><span>{value}</span></Tooltip> : ''
            },{
                title:'售出时间',
                dataIndex:'sellTime',
                key:'sellTime',
                className:'x-tc',
                render:v=>v ? Moment(v,'YYYYMMDDHHmmss').format(format) : '--',
            },{
                title:'充值会员卡号',
                dataIndex:'rechargeToCardID',
                key:'rechargeToCardNO',
                render:value => String(value),
            },{
                title:'充值时间',
                dataIndex:'rechargeTime',
                key:'rechargeTime',
                className:'x-tc',
                render:v=>v ? Moment(v,'YYYYMMDDHHmmss').format(format) : '--',
            }
        ];
    const CARD_SUM_FORMITEMS = {
            giftStatus:{
                label:'卡状态',
                type:'combo',
                options:GiftCfg.giftCardStatus,
                defaultValue:'',
                labelCol:{span:6},
                wrapperCol:{span:18},
            },
            cardNO_sum:{
                label:'卡号',
                type:'text',
                placeholder:'请输入卡号',
                labelCol:{span:6},
                wrapperCol:{span:18},
            },
            batchNO_sum:{
                label:'批次号',
                type:'text',
                placeholder:'请输入批次号',
                labelCol:{span:6},
                wrapperCol:{span:18},
            },
            timeRangeSend_sum:{
                label:'售出时间',
                type:'datepickerRange',
                showTime:true,
                format:format,
                labelCol:{span:6},
                wrapperCol:{span:18},
            },
            payWayName:{
                label:'实收方式',
                type:'combo',
                options:GiftCfg.payWayName,
                defaultValue:'',
                labelCol:{span:6},
                wrapperCol:{span:18},
            }
        };
    const CARD_SUM_FROMKEYS = [{col:{span:8},keys:['batchNO_sum','payWayName']},
                        {col:{span:8},keys:['cardNO_sum', 'timeRangeSend_sum']},
                        {col:{span:8},keys:['giftStatus', 'usingShopID']}];
    export { CARD_SUM_COLUMNS, CARD_SUM_FORMITEMS, CARD_SUM_FROMKEYS }