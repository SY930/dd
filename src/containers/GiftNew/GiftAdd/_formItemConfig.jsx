import React, { Component } from 'react';
import {
    Tooltip,
    Icon,
} from 'antd';
import GiftCfg from '../../../constants/Gift';

const FORMITEMS = {
    giftRemark: {
        label: '活动详情',
        type: 'textarea',
        placeholder: '请输入活动详情',
        rules: [
            { required: true, message: '活动详情不能为空' },
            { max: 400, message: '最多400个字符' },
        ],
    },
    transferType: {
        label: '券是否可转赠',
        type: 'radio',
        defaultValue: 0,
        options: GiftCfg.transferType,
    },
    isHolidaysUsing: { // 废弃
        label: '节假日是否可用',
        type: 'radio',
        defaultValue: '0',
        options: GiftCfg.isHolidaysUsing,
    },
    usingDateType: {
        label: '排除日期',
        type: 'checkbox',
        options: GiftCfg.usingDateType,
    },
    usingWeekType: {
        label: '可用日期',
        type: 'checkbox',
        defaultValue: ['1', '2', '3', '4', '5', '6', '7'],
        options: GiftCfg.usingWeekType,
        rules: [{ type: 'array', required: true, message: '请设置使用日期' }],
    },
    supportOrderType: {
        label: '业务支持',
        type: 'combo',
        defaultValue: '2',
        options: GiftCfg.supportOrderType,
    },
    supportOrderTypeLst: {
        label: '适用业务',
        type: 'checkbox',
        defaultValue: ['31', '20', '21', '11', '10'],
        options: GiftCfg.supportOrderTypeLst,
        rules: [{ type: 'array', required: true, message: '至少要选择一种适用业务' }],
    },
    aggregationChannels: {
        label: '投放场景',
        type: 'checkbox',
        defaultValue: [],
    },
    isOfflineCanUsing: {
        label: '使用场景',
        type: 'radio',
        defaultValue: '1',
        options: GiftCfg.isOfflineCanUsing,
    },
    showGiftRule: {
        label: '显示系统生成规则',
        type: 'radio',
        defaultValue: 0,
        options: GiftCfg.showGiftRule,
    },
    isOnlineExchangeable: {
        label: '允许线上通过券码兑换',
        type: 'radio',
        defaultValue: 0,
        options: GiftCfg.isOnlineExchangeable,
    },
    giftShareType: {
        label: (
            <span>
                券与券共用&nbsp;
                <Tooltip title={
                    <p>
                        使用说明：
                        <br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;对线上营销，与所有券共用设置不执行。所有券之间默认互斥，与活动默认同
                        <br/>
                        享。也就是说，一笔订单享受满减、特价商品等活动，当有满足账单使用情况时可以
                        <br/>
                        使用优惠券，但一笔订单只能使用一张券。
                    </p>
                }>
                    <Icon type="question-circle" />
                </Tooltip>
            </span>
        ),
        type: 'combo',
        defaultValue: '1',
        options: GiftCfg.shareType,
    },
    maxUseLimit: {
        label: '一笔订单最多使用',
        type: 'text',
        placeholder: '不填表示不限制',
        surfix: '张',
        rules: [{
            validator: (rule, v = '', cb) => {
                if (/^(?:[1-9][0-9]{0,5})?$/.test(v)) {
                    return cb()
                }
                cb(rule.message);
            },
            message: '张数范围1~999999'
        }],
    },
    customerUseCountLimit: {
        label: '会员单天使用张数限制',
        type: 'text',
        placeholder: '不填表示不限制',
        surfix: '张',
        rules: [{
            validator: (rule, v = '', cb) => {
                if (/^(?:[1-9][0-9]{0,5})?$/.test(v)) {
                    return cb()
                }
                cb(rule.message);
            },
            message: '张数范围1~999999'
        }],
    },
    isFoodCatNameList: {
        // label: '抵扣规则',
        // type: 'combo',
        // defaultValue: '0',
        // rules: [{required: true, message: '请选择抵扣规则'}],
        // options: GiftCfg.isFoodCatNameList,
    },
    isCustomerPrice: {
        label: '享受会员价',
        type: 'switcher',
        defaultValue: false,
        onLabel: '是',
        offLabel: '否',
    },
    hasPrivilegeOfWait: {
        label: '享受插队',
        type: 'switcher',
        defaultValue: false,
        onLabel: '是',
        offLabel: '否',
    },
    isDiscountRate: {
        label: '享受折扣',
        type: 'switcher',
        defaultValue: false,
        onLabel: '是',
        offLabel: '否',
    },
    discountRate: {
        label: '折扣率',
        type: 'text',
        placeholder: '0.7(7折),0.77(77折)',
        rules: [
            { required: true, message: '折扣率不能为空' },
            { pattern: /^([0](\.\d{1,2})?|1(\.[0]{1,2})?)$/, message: '取值范围0~1,最多可取两位小数,未开启表示无折扣' },
        ],
    },
    isPointRate: {
        label: '享受积分',
        type: 'switcher',
        defaultValue: false,
        onLabel: '是',
        offLabel: '否',
    },
    pointRate: {
        label: '积分系数',
        type: 'text',
        placeholder: '0.12（现金12%积分）',
        rules: [
            { required: true, message: '积分系数不能为空' },
            {
                pattern: /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/,
                message: '请输入0到100的数,可输入两位小数',
            },
        ],
    },
    couponCodeType: {
        label: '是否生成券码',
        type: 'radio',
        defaultValue: 1,
        options: GiftCfg.couponCodeType,
    },
};

const FIRST_KEYS = {
    '代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'giftValueCurrencyType',
                'giftValue',
                'price',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'foodsboxs',
            ]
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftRemark',
            ]
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ]
        },
    ],
    '菜品优惠券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'giftValueCurrencyType',
                'giftValue',
                'price',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'foodScopes',
            ],
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftRemark',
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ],
        },
    ],
    '菜品兑换券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'giftValueCurrencyType',
                'giftValue',
                'price',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'foodScopes',
            ],
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'priceSortRule',
                'giftRemark',
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ],
        },
    ],
    '会员权益券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'cardTypeList',
                'giftRemark',
            ],
        },
    ],
    '活动券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'giftRemark',
            ],
        },
    ],
    '线上礼品卡': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'validityDays',
                'cardTypeList',
                'giftRemark',
            ],
        },
    ],
    '买赠券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'buyGiveFoods',
                'stageAmount',
                'buyGiveSecondaryFoods',
                'giveFoodCount',
                'priceSortRule',
                'price',
                'giftRemark',
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ],
        },
    ],
    '折扣券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'disCountTypeAndValue',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [], // 为菜品组件预留位置
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'discountOffMax',
                'price',
                'giftRemark',
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ],
        },
    ],
    '配送券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'selectBrands',
                'pushMessageMpID',
                'giftValueCurrencyType',
                'giftValue2',
                'price',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'foodsboxs',
            ]
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftRemark',
            ]
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                'isNeedCustomerInfo',
            ]
        },
    ],
};
const SECOND_KEYS = (() => ({
    '代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'shopNames',
                'amountType',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
    '菜品优惠券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'shopNames',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
    '菜品兑换券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'shopNames',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
    '会员权益券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'isCustomerPrice',
                'hasPrivilegeOfWait',
                'isDiscountRate',
                'isPointRate',
                'numberOfTimeType',
                'moneyTopLimitType',
                'showGiftRule',
                'giftImagePath',
                'isSynch',
            ],
        },
    ],
    '活动券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'TrdTemplate',
                'promotionID',
            ],
        },
    ],
    '线上礼品卡': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'shopNames',
                'transferLimitType',
                'couponTrdChannelStockNums',
                'isSynch',
            ],
        },
    ],
    '买赠券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'shopNames',
                'showGiftRule',
                'giftImagePath',
                'isSynch',
            ],
        },
    ],
    '折扣券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'shopNames',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
    '配送券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'shopNames',
                'amountType',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
}))();
export { FORMITEMS, FIRST_KEYS, SECOND_KEYS }
