/**
 * @flow
 * @Author: fengxiao.wang <feng>
 * @Date:   2017-02-04T12:10:27+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: types.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:28:14+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */
import { ONLINE_PROMOTION_TYPES } from '../../../constants/promotionType'
import { SALE_LABEL, SALE_STRING, } from 'i18n/common/salecenter';
import { COMMON_GIFT, } from 'i18n/common/gift';
const Moment = require('moment');

export const ACTIVITY_CYCLE_TYPE = Object.freeze({
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
});
export const CLIENT_CATEGORY = [
    { key: '0', value: '0', name: SALE_LABEL.k5dn26n4 },
    { key: '1', value: '1', name: SALE_LABEL.k6hhuahr },
    { key: '2', value: '2', name: SALE_LABEL.k6hhuaq3 },
];
export const CLIENT_CATEGORY_RETURN_GIFT = [
    { key: '0', value: '0', name: SALE_LABEL.k5dn26n4 },
    { key: '1', value: '1', name: SALE_LABEL.k6hhu86f },
];
export const CLIENT_CATEGORY_RETURN_POINT = [
    { key: '1', value: '1', name: SALE_LABEL.k6hhu86f },
];
export const CLIENT_CATEGORY_ADD_UP = [
    { key: '1', value: '1', name: SALE_LABEL.k6hhu86f },
    { key: '3', value: '3', name: SALE_LABEL.k6hhu8er },
    // { key: 'CUSTOMER_CARD_TYPE', value: 'CUSTOMER_CARD_TYPE', name: '可使用卡类的会员' },
];
export const PAYMENTS_OPTIONS = Object.freeze([
    { key: '0', value: '0', name: SALE_LABEL.k5dn26n4 },
    { key: '1', value: '1', name: SALE_LABEL.k6hhu8n3 },
]);
export const CYCLE_TYPE = Object.freeze([{
    value: '0',
    name: '每日',
},
{
    value: '1',
    name: '每周',
},
{
    value: '2',
    name: '每月',
},
]);

export const SALE_CENTER_ACTIVITY_CHANNEL_LIST = Object.freeze([{
    idx: 0,
    name: SALE_LABEL.k5eng042,
    key: '',
    value: '0',
},
{
    idx: 1,
    name: SALE_LABEL.k5krn6qx,
    key: 'POS',
    value: '1',
},
{
    idx: 2,
    name: SALE_LABEL.k5krn6z9,
    key: 'WECHAT',
    value: '2',
},
    {
    idx: 3,
    name: SALE_LABEL.k5krn77l,
    key: 'YST',
    value: '3',
},
]);

// TODO: remove the bottom definition,
export const SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST = Object.freeze([{
    label: '预定',
    value: '10',
},
{
    label: '闪吃',
    value: '11',
},
{
    label: '外送',
    value: '20',
},
{
    label: '堂食',
    value: '31',
},
{
    label: '自提',
    value: '21',
},
]);

export const SALE_CENTER_ACTIVITY_ORDER_TYPE = Object.freeze({
    '10': '预定',
    '11': '闪吃',
    '20': '外送',
    '31': '堂食',
    '21': '自提',
});

export const SALE_CENTER_GIFT_TYPE = Object.freeze([{
    label: SALE_LABEL.k5m5avfn,
    value: '10',
},
{
    label: SALE_LABEL.k5m5avnz,
    value: '20',
},
{
    label: SALE_LABEL.k5m5avwb,
    value: '21',
},
{
    label: SALE_LABEL.k636qvha,
    value: '111',
},
{
    label: SALE_LABEL.k6hhubnf,
    value: '112',
},
{
    label: SALE_LABEL.k636qvpm,
    value: '110',
},
{
    label: SALE_LABEL.k67g7tk4,
    value: '30',
},
{
    label: SALE_LABEL.k67g7tsg,
    value: '40',
},
{
    label: SALE_LABEL.k67g7u0s,
    value: '42',
},
{
    label: SALE_LABEL.k67g7u94,
    value: '80',
},
{
    label: SALE_LABEL.k5m6e393,
    value: '100',
},

]);

export const SALE_CENTER_GIFT_EFFICT_TIME = Object.freeze([{
    label: COMMON_GIFT.d1qc7cfgh16,
    value: '0',
},
{
    label: <span>1{COMMON_GIFT.d7h90e123090127}</span>,
    value: '1',
},
{
    label: <span>2{COMMON_GIFT.d7h90e123090127}</span>,
    value: '2',
},
{
    label: <span>3{COMMON_GIFT.d7h90e123090127}</span>,
    value: '3',
},
{
    label: <span>4{COMMON_GIFT.d7h90e123090127}</span>,
    value: '4',
},
{
    label: <span>5{COMMON_GIFT.d7h90e123090127}</span>,
    value: '5',
},
{
    label: <span>6{COMMON_GIFT.d7h90e123090127}</span>,
    value: '6',
},
{
    label: <span>7{COMMON_GIFT.d7h90e123090127}</span>,
    value: '7',
},
{
    label: <span>8{COMMON_GIFT.d7h90e123090127}</span>,
    value: '8',
},
{
    label: <span>9{COMMON_GIFT.d7h90e123090127}</span>,
    value: '9',
},
{
    label: <span>10{COMMON_GIFT.d7h90e123090127}</span>,
    value: '10',
},
{
    label: <span>11{COMMON_GIFT.d7h90e123090127}</span>,
    value: '11',
},
{
    label: <span>12{COMMON_GIFT.d7h90e123090127}</span>,
    value: '12',
},
{
    label: <span>13{COMMON_GIFT.d7h90e123090127}</span>,
    value: '13',
},
{
    label: <span>14{COMMON_GIFT.d7h90e123090127}</span>,
    value: '14',
},
{
    label: <span>15{COMMON_GIFT.d7h90e123090127}</span>,
    value: '15',
},
{
    label: <span>16{COMMON_GIFT.d7h90e123090127}</span>,
    value: '16',
},
{
    label: <span>17{COMMON_GIFT.d7h90e123090127}</span>,
    value: '17',
},
{
    label: <span>18{COMMON_GIFT.d7h90e123090127}</span>,
    value: '18',
},
{
    label: <span>19{COMMON_GIFT.d7h90e123090127}</span>,
    value: '19',
},
{
    label: <span>20{COMMON_GIFT.d7h90e123090127}</span>,
    value: '20',
},
{
    label: <span>21{COMMON_GIFT.d7h90e123090127}</span>,
    value: '21',
},
{
    label: <span>22{COMMON_GIFT.d7h90e123090127}</span>,
    value: '22',
},
{
    label: <span>23{COMMON_GIFT.d7h90e123090127}</span>,
    value: '23',
},
{
    label: <span>24{COMMON_GIFT.d7h90e123090127}</span>,
    value: '24',
},
]);


export const SALE_CENTER_GIFT_EFFICT_DAY = Object.freeze([
    {
        label: <span>1{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '1',
    },
    {
        label: <span>2{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '2',
    },
    {
        label: <span>3{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '3',
    },
    {
        label: <span>4{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '4',
    },
    {
        label: <span>5{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '5',
    },
    {
        label: <span>6{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '6',
    },
    {
        label: <span>7{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '7',
    },
    {
        label: <span>8{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '8',
    },
    {
        label: <span>9{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '9',
    },
    {
        label: <span>10{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '10',
    },
    {
        label: <span>11{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '11',
    },
    {
        label: <span>12{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '12',
    },
    {
        label: <span>13{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '13',
    },
    {
        label: <span>14{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '14',
    },
    {
        label: <span>15{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '15',
    },
    {
        label: <span>16{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '16',
    },
    {
        label: <span>17{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '17',
    },
    {
        label: <span>18{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '18',
    },
    {
        label: <span>19{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '19',
    },
    {
        label: <span>20{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '20',
    },
    {
        label: <span>21{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '21',
    },
    {
        label: <span>22{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '22',
    },
    {
        label: <span>23{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '23',
    },
    {
        label: <span>24{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '24',
    },
    {
        label: <span>25{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '25',
    },
    {
        label: <span>26{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '26',
    },
    {
        label: <span>27{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '27',
    },
    {
        label: <span>28{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '28',
    },
    {
        label: <span>29{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '29',
    },
    {
        label: <span>30{COMMON_GIFT.d7h90e1230904678}</span>,
        value: '30',
    },
]);

export const ACTIVITY_CATEGORIES = (function () {
    const basic = [{
        idx: 0,
        title: SALE_LABEL.k67b3v0o,
        color: '#84aac6',
        text: SALE_LABEL.k67cp2qm,
        example: SALE_LABEL.k67cpr2v,
        key: '2010',
    },
    {
        idx: 1,
        title: SALE_LABEL.k67b3v90,
        color: '#c49b79',
        text:   <div>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, margin: '10px 0'}}>1. 同一活动时间，有多个满赠活动，活动会执行哪个？</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</p>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, padding: '10px 0', borderTop: '1px solid #E9E9E9', marginTop: '7px'}}>2. 满赠活动使用注意事项</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>满赠/每满赠活动与买赠、第二份打折、加价换购活动之间不受互斥规则限制，在线上餐厅都按通向执行</p>
                </div>,
        example: '',
        key: '1030',
    },
    {
        idx: 2,
        title: SALE_LABEL.k5ezcu1b,
        color: '#9dc568',
        text: SALE_LABEL.k67cp14a,
        example: SALE_LABEL.k67cppov,
        key: '2020',
    },
    {
        idx: 3,
        title: SALE_LABEL.k67b2sac,
        color: '#e5be6c',
        text: SALE_LABEL.k67cp1cm,
        example: SALE_LABEL.k67cppx7,
        key: '1010',
    },
    {
        idx: 4,
        title: SALE_LABEL.k67b3vhc,
        color: '#c49b79',
        text: SALE_LABEL.k67cp37a,
        example: SALE_LABEL.k67cprjj,
        key: '1020',
    },
    {
        idx: 5,
        title: SALE_LABEL.k67b2sr0,
        color: '#84aac6',
        text: SALE_LABEL.k67cp1ta,
        example: SALE_LABEL.k67cpq5j,
        key: '1050',
    },
    {
        idx: 6,
        title: SALE_LABEL.k5m4q0ae,
        color: '#9dc568',
        text: SALE_LABEL.k67b4tme,
        example: SALE_LABEL.k67cporj,
        key: '3010',
    },
    {
        idx: 7,
        title: SALE_LABEL.k5m4q0iq,
        color: '#c49b79',
        text: SALE_LABEL.k67b4tuq,
        example: SALE_LABEL.k67cpozv,
        key: '3020',
    },
    {
        idx: 8,
        title: SALE_LABEL.k67b2sio,
        color: '#e5be6c',
        text: SALE_LABEL.k67cp1ky,
        example: '',
        key: '4010',
    },
    {
        idx: 9,
        title: SALE_LABEL.k67b2pqo,
        color: '#84aac6',
        text: SALE_LABEL.k67b4sxe,
        example: SALE_LABEL.k67cpoj7,
        key: '2030',
    },
    {
        idx: 10,
        title: SALE_LABEL.k67b3vy0,
        color: '#84aac6',
        text: SALE_LABEL.k67cp3ny,
        example: SALE_LABEL.k67g7rxs,
        key: '2040',
    },
    {
        idx: 11,
        title: SALE_LABEL.k67b3weo,
        color: '#84aac6',
        text: SALE_LABEL.k67cp44m,
        example: SALE_LABEL.k67g7seg,
        key: '1040',
    },
    {
        idx: 12,
        title: SALE_LABEL.k67b3uk0,
        color: '#84aac6',
        text: SALE_LABEL.k67cp21m,
        example: SALE_LABEL.k67cpqdv,
        key: '1070',
    },
    {
        idx: 13,
        title: SALE_LABEL.k67b3w6c,
        color: '#84aac6',
        text: SALE_LABEL.k67cp3wa,
        example: SALE_LABEL.k67g7s64,
        key: '2050',
    },
    {
        idx: 14,
        title: SALE_LABEL.k67b3vpo,
        color: '#84aac6',
        text: SALE_LABEL.k67cp3fm,
        example: SALE_LABEL.k67g7rpg,
        key: '1060',
    },
    {
        idx: 15,
        title: SALE_LABEL.k67b2qwc,
        color: '#84aac6',
        text: SALE_LABEL.k67b4ujq,
        example: SALE_LABEL.k67cppgj,
        key: '2070',
    },
    {
        idx: 16,
        title: SALE_LABEL.k67b2qo0,
        color: '#84aac6',
        text: SALE_LABEL.k67b4ube,
        example: SALE_LABEL.k67cpp87,
        key: '1080',
    },
    {
        idx: 17,
        title: SALE_LABEL.k5m5auib,
        color: '#84aac6',
        text: SALE_LABEL.k67cp29y,
        example: SALE_LABEL.k67cpqm7,
        key: '5010',
    },
    {
        idx: 18,
        title: SALE_LABEL.k67b3usc,
        color: '#84aac6',
        text: SALE_LABEL.k67cp2ia,
        example: SALE_LABEL.k67cpquj,
        key: '1090',
    },
    {
        idx: 19,
        color: '#84aac6',
        title: SALE_LABEL.k67b3wn0,
        text: SALE_LABEL.k67cp4cy,
        example: SALE_LABEL.k67g7uy4,
        key: '2080',
    },
    ];
    return basic;
}());

export const CHARACTERISTIC_CATEGORIES = (function () {
    const basic = [{
        idx: 0,
        title: SALE_LABEL.k67b2r4o,
        text: SALE_LABEL.k67b4us2,
        example: '',
        key: '51',
    },
    {
        idx: 1,
        title: SALE_LABEL.k67b2p1n,
        text: SALE_LABEL.k67b4s02,
        example: '',
        key: '52',
    },
    {
        idx: 2,
        title: SALE_LABEL.k636p0yo,
        text: SALE_LABEL.k67b4rb2,
        example: '',
        key: '21',
    },
    {
        idx: 3,
        title: SALE_LABEL.k636p31p,
        text: SALE_LABEL.k67b4s8e,
        example: '',
        key: '20',
    },
    {
        idx: 4,
        title: SALE_LABEL.k67b2qfo,
        text: SALE_LABEL.k67b4u32,
        example: '',
        key: '30',
    },
    {
        idx: 5,
        title: SALE_LABEL.k67b2pic,
        text: SALE_LABEL.k67b4sp2,
        example: '',
        key: '22',
    },
    {

        idx: 6,
        title: SALE_LABEL.k67b2pz0,
        text: SALE_LABEL.k67b4t5q,
        example: '',
        key: '53',
    },
    {
        idx: 7,
        title: SALE_LABEL.k67b2q7c,
        text: SALE_LABEL.k67b4te2,
        example: '',
        key: '50',
    },
    {
        idx: 8,
        title: SALE_LABEL.k67b2s20,
        text: SALE_LABEL.k67cp0vy,
        example: '',
        key: '60',
    },
    {
        idx: 9,
        title: SALE_LABEL.k67b2rto,
        text: SALE_LABEL.k67cp0nm,
        example: '',
        key: '61',
        tip: SALE_LABEL.k67g7v6g,
    },
    {
        idx: 10,
        title: SALE_LABEL.k67b2rlc,
        text: SALE_LABEL.k67b4v8q,
        example: '',
        key: '62',
        tip: SALE_LABEL.k67g7ves,
    },
    {
        idx: 11,
        title: SALE_LABEL.k67b2otb,
        text: SALE_LABEL.k67b4rrq,
        example: '',
        key: '23',
    },
        {
            idx: 12,
            title: SALE_LABEL.k67b2rd0,
            text: SALE_LABEL.k67b4v0e,
            example: '',
            key: '63',
        },
        {
            idx: 13,
            title: SALE_LABEL.k67b2p9z,
            text: SALE_LABEL.k67b4sgq,
            example: '',
            key: '64',
        },
        {
            idx: 14,
            title: SALE_LABEL.k639vhpm,
            text: SALE_LABEL.k67b4rje,
            example: '',
            key: '31',
        },
        {
            idx: 15,
            title: SALE_LABEL.k636p3a1,
            text: SALE_LABEL.k67b3xsp,
            example: '',
            key: '65',
        },
        {
            idx: 16,
            title: SALE_LABEL.k635s5id,
            text: SALE_LABEL.k67b3y11,
            example: '',
            key: '66',
            tip: <p>{SALE_LABEL.k636f2yf}<br/>
                1、{SALE_LABEL.k636f36s}<br/>
                2、{SALE_LABEL.k636f3f4}<br/>
                {SALE_LABEL.k636f3ng}:<br/>
                1、{SALE_LABEL.k636f3vs}<br/>
                2、{SALE_LABEL.k636f444}<br/>
                {SALE_LABEL.k67g7vn4}:<br/>
                {SALE_LABEL.k67g8jby}</p>,

        },
        {
            idx: 17,
            title: SALE_LABEL.k639vh8y,
            text: SALE_LABEL.k67b3y9d,
            example: '',
            key: '67',
        },
        {
            idx: 18,
            title: SALE_LABEL.k639vhha,
            text: SALE_LABEL.k67b3yhp,
            example: '',
            key: '68',
        },
        {
            idx: 19,
            title: '集点卡',
            text: '消费后获得集点，促进会员多次消费',
            example: '',
            key: '75',
        },{
            idx: 20,
            title: '支付后广告',
            text: '支付成功页自定义投放广告内容，便于餐后营销',
            example: '',
            key: '77',
        },{
            idx: 21,
            title: '签到',
            text: '签到获取礼品，提升用户日活量',
            example: '',
            key: '76',
        },
    ];
    return basic;
}());

export const arrayTransformAdapter = function (source) {
    if (!(source instanceof String || typeof source === 'string')) {
        throw new Error(`The source string should be string, which is ${source}`);
    }

    if (source === '') {
        return [];
    }
    // JSON parse format
    const pattern = /\[/gi;
    const matchs = pattern.exec(source);

    if (matchs && undefined !== matchs[0]) {
        return JSON.parse(source);
    }

    return source.split(',');
};

/**
 * @param {Object} source source data to be transform
 * @param {Bool} direction flag 'false' indicate it is transform to redux format or to the server end format
 * @return {Object}  transformed data
 */
export const promotionBasicDataAdapter = function (source, dir) {
    if (!(source instanceof Object)) {
        throw new Error(`source should be an Object, which is ${source}`);
    }
    const _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        let _startDate,
            _endDate;
        if (_source.master.startDate === 20000101 || _source.master.startDate === 29991231) {
            _startDate = _endDate = undefined;
        } else {
            _startDate = Moment(_source.master.startDate, 'YYYYMMDD');
            _endDate = Moment(_source.master.endDate, 'YYYYMMDD');
        }
        const _tagList = arrayTransformAdapter(_source.master.tagLst);

        const _excludeDateArray = arrayTransformAdapter(_source.master.excludedDate).map((ed) => {
            return Moment(ed, 'YYYYMMDD');
        });
        const _timeRangeInfo = _source.timeLst ? _source.timeLst.map((time) => {
            return {
                validationStatus: 'success',
                helpMsg: null,
                start: Moment(time.startTime, 'HHmm'),
                end: Moment(time.endTime, 'HHmm'),
            }
        }) : [{
            validationStatus: 'success',
            helpMsg: null,
            start: undefined,
            end: undefined,
        }];
        let _validCycleType = '0';
        const _selectMonthValue = [];
        const _selectWeekValue = [];

        const _validCycle = arrayTransformAdapter(_source.master.validCycle);
        _validCycle.map((vc) => {
            if (vc[0] == 'w') {
                _validCycleType = '1';
                _selectWeekValue.push(vc.substr(1));
            } else if (vc[0] == 'm') {
                _validCycleType = '2';
                _selectMonthValue.push(vc.substr(1));
            } else {
                _validCycleType = '0';
            }
        });
        return {
            category: _source.master.categoryName,
            name: _source.master.promotionName, // 活动名称
            showName: _source.master.promotionShowName, // 活动展示名称
            code: _source.master.promotionCode, // 活动编码
            tags: _tagList, // 活动标签  ['标签名1','标签名2']
            startDate: _startDate, // 开始时间
            endDate: _endDate, // 结束时间
            description: _source.master.description, // 活动描述
            promotionID: _source.master.promotionIDStr,
            promotionType: _source.master.promotionType,
            validCycleType: _validCycleType,
            timeRangeInfo: _timeRangeInfo,
            selectMonthValue: _selectMonthValue,
            selectWeekValue: _selectWeekValue,
            excludeDateArray: _excludeDateArray,
        };
    }

    const _startDateInFormat = ((date) => {
        if (date === undefined) {
            return 20000101;
        }
        return date.format('YYYYMMDD');
    })(_source.startDate);

    const _endDateInFormat = ((date) => {
        if (date === undefined) {
            return 29991231;
        }
        return date.format('YYYYMMDD');
    })(_source.endDate);

    const validCycle = ((validType) => {
        if (validType == '1') {
            return _source.selectWeekValue.map((week) => {
                return `w${week}`;
            }).join(',');
        } else if (validType == '2') {
            return _source.selectMonthValue.map((month) => {
                return `m${month}`;
            }).join(',');
        }
        return null;
    })(_source.validCycleType);

    const excludedDate = ((date) => {
        return date.map((d) => {
            return d.format('YYYYMMDD');
        }).join(',');
    })(_source.excludeDateArray);

    const timeLst = ((range) => {
        return range.filter(item => item.start && item.end).map((r) => {
            return {
                timeType: 'CONSUME_TIME',
                startTime: r.start.format('HHmm'),
                endTime: r.end.format('HHmm'),
            };
        });
    })(_source.timeRangeInfo);
    return {
        categoryName: _source.category,
        promotionName: _source.name,
        promotionShowName: _source.showName,
        promotionCode: _source.code,
        tagLst: _source.tags.join(','),
        startDate: _startDateInFormat,
        endDate: _endDateInFormat,
        description: _source.description,
        promotionID: _source.promotionID,
        promotionType: _source.promotionType,
        timeLst,
        validCycle,
        excludedDate,
    };
};

export const promotionScopeInfoAdapter = function (source, dir) {
    if (!(source instanceof Object)) {
        throw new Error(`source should be an Object, which is ${source}`);
    }
    const _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        // let ruleJson=JSON.parse(_source.ruleJson);
        // let ruleJson = _source.ruleJson!=''&& _source.ruleJson !=='stageType' ? JSON.parse(_source.ruleJson):{};
        let ruleJson;
        try {
            ruleJson = _source.ruleJson != '' && JSON.parse(_source.ruleJson);
        } catch (err) {
            ruleJson = {};
        }
        const _brands = arrayTransformAdapter(_source.brandIDLst);
        const _auto = _source.defaultRun === 'YES' ? '1' : '0';
        const _orderType = arrayTransformAdapter(_source.orderTypeLst);
        const _channel = SALE_CENTER_ACTIVITY_CHANNEL_LIST.find((channel) => {
            return channel.key === _source.channelLst;
        });
        const _shopsInfo = arrayTransformAdapter(_source.shopIDLst);
        return {
            'auto': _auto,
            'brands': _brands,
            'orderType': _orderType,
            'shopsInfo': _shopsInfo,
            'channel': _channel ? _channel.value : '0',
            'voucherVerify': ruleJson.voucherVerify,
            'voucherVerifyChannel': ruleJson.voucherVerifyChannel,
            'invoice': ruleJson.invoice || '0',
            'points': ruleJson.points,
            'evidence': ruleJson.evidence,
            'usageMode': source.usageMode || 1,
        };
    }
    return {
        brandIDLst: _source.brands.join(','),
        channelLst: _source.channel == 1 ? 'POS' : _source.channel == 0 ? '' : _source.channel == 2 ? 'WECHAT' : _source.channel == 3 ? 'YST' : '',
        defaultRun: _source.auto == '1' ? 'YES' : 'NO',
        orderTypeLst: _source.orderType.join(','),
        shopIDLst: _source.shopsInfo
            .map((item) => {
                return item.shopID || item; //object[] or string[]
            })
            .join(','),
        usageMode: _source.usageMode || 1,
    };
};

export const promotionDetailInfoAdapter = function (source, dir) {
    if (!(source instanceof Object || typeof source === 'object')) {
        throw new Error(`The source should be object, which is ${source}`);
    }
    if (!dir) {
        let priceLst = [];
        if (source.priceLst) {
            priceLst = source.priceLst;
        }
        let scopeLst = [];
        if (source.scopeLst) {
            scopeLst = source.scopeLst;
        }
        let foodRuleList = [];
        if (source.foodRuleList) {
            foodRuleList = source.foodRuleList;
        }
        let ruleJson;
        try {
            ruleJson = source.master.ruleJson != '' && JSON.parse(source.master.ruleJson);
        } catch (err) {
            ruleJson = {};
        }
        return {
            rule: ruleJson,
            blackList: ruleJson.blackList || false,
            customerUseCountLimit: ruleJson.customerUseCountLimit || 0,
            foodCategory: [],
            excludeDishes: [], // excluded dish
            dishes: [], // selected dish
            userSetting: source.master.userType,
            birthdayLimit: source.master.birthdayLimit,
            subjectType: source.master.subjectType == '0' ? '0' : '1', // 支付限制
            mutexPromotions: source.shareLst, // 不能同时进行的活动ID
            role: arrayTransformAdapter(source.master.roleIDLst),
            priceLst,
            scopeLst,
            foodRuleList,
            giftList: source.giftList || [],
            categoryOrDish: 0, // promotion advanced setting
            costIncome: ruleJson.costIncome,
            isActive: source.master.isActive,
            cardScopeList: source.cardScopeList || [],
            needSyncToAliPay: source.master.needSyncToAliPay || 0,
        };
    }
    // compose scopeList
    let scope = [];
    if (source.scopeLst && source.scopeLst.length > 0 && source.foodCategory.length == 0 &&
        source.excludeDishes.length == 0 && source.dishes.length == 0 &&
        (!source.upGradeDishes || source.upGradeDishes.length == 0)) {
        scope = source.scopeLst;
    } else {
        if (source.foodCategory !== null) {
            (source.foodCategory || []).map((item) => {
                scope.push({
                    scopeType: '1',
                    brandID: `${item.brandID || 0}`,
                    targetID: item.foodCategoryID,
                    targetCode: item.foodCategoryKey,
                    targetName: item.foodCategoryName,
                    discountRate: item.discountRate || 0,
                });
            });
        }

        if (source.excludeDishes !== null) {
            (source.excludeDishes || []).map((item) => {
                scope.push({
                    scopeType: '4',
                    targetID: item.itemID,
                    brandID: `${item.brandID || 0}`,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
        }

        if (source.dishes !== null) {
            (source.dishes || []).map((item) => {
                scope.push({
                    scopeType: '2',
                    targetID: item.itemID,
                    brandID: `${item.brandID || 0}`,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
        }
        if (source.upGradeDishes !== null) {
            (source.upGradeDishes || []).map((item) => {
                scope.push({
                    scopeType: '5',
                    targetID: item.itemID,
                    brandID: `${item.brandID || 0}`,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
        }
    }
    return {
        foodRuleList: source.foodRuleList,
        scopeLst: scope,
        ruleJson: source.rule,
        priceLst: source.priceLst,
    };
};


export const specialPromotionBasicDataAdapter = function (source, dir) {
    if (!(source instanceof Object)) {
        throw new Error(`source should be an Object, which is ${source}`);
    }
    const _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        return _source;
    }
};

// find the idx according the promotinKey, user can use the idx to get the related Component.
export const getPromotionIdx = function (promotionKey) {
    // console.log('promotion key:', promotionKey);
    if (!(promotionKey instanceof String || typeof promotionKey === 'string')) {
        throw new Error(`'promotionKey' should be a String type. Which is '${promotionKey}'`);
    }

    const index = [
        ...ACTIVITY_CATEGORIES,
        ...ONLINE_PROMOTION_TYPES,
    ].findIndex(promotionInfo => promotionInfo.key === promotionKey)

    if (index >= 0) return index;
    throw new Error(`There is not promotion with the specified promotionKey ${promotionKey}`);
};

export const getSpecialPromotionIdx = function (promotionKey) {
    const promotionKeyStr = String(promotionKey);
    const _promotionInfo = CHARACTERISTIC_CATEGORIES.find(promotionInfo => promotionInfo.key === promotionKeyStr);
    if (_promotionInfo) {
        return _promotionInfo.idx;
    }
};


export const TRIPLE_STATE = Object.freeze({
    ALL: '0',
    OPTION1: '1',
    OPTION2: '2',
});

export const BUSINESS_MODEL = Object.freeze({
    '1': '直营',
    '2': '加盟',
    '3': '托管',
    '4': '合作',
});


// 是否发信息
export const SEND_MSG = Object.freeze([{
    label: COMMON_GIFT.d1qcjcuhhg05,
    value: '0',
}, {
    label: COMMON_GIFT.d1qcjcuhhg143,
    value: '1',
}, {
    label: COMMON_GIFT.d1duuh1lsu215,
    value: '2',
}, {
    label: COMMON_GIFT.d141vvwo7r310,
    value: '4',
},{
    label: COMMON_GIFT.d1qcjcuhhg492,
    value: '3',
},]);

// 是否发信息
export const NOTIFICATION_FLAG = Object.freeze([{
    label: COMMON_GIFT.d1qcjcuhhg05,
    value: '0',
}, {
    label: COMMON_GIFT.d1qeq24lqo035,
    value: '2',
},
]);
