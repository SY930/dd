import React, { Component } from 'react';
import {
    Tooltip,
    Icon,
    Radio,
} from 'antd';
import GiftCfg from '../../../constants/Gift';

export const FORMITEMS = {
    specialInterestType: {
        label: '特殊权益',
        type: 'radio',
        defaultValue: 1,
        options: GiftCfg.specialInterestType,
    },
    giftRemark: {
        label: '礼品详情',
        type: 'textarea',
        placeholder: '请输入礼品详情',
        rules: [
            { required: true, message: '礼品详情不能为空' },
            { max: 1000, message: '最多1000个字符' },
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
    // 商城券适用范围
    mallScope: {
        label: '适用范围',
        type: 'radio',
        defaultValue: '0',
        options: [
            { label: '按分类', value: '0' },
            { label: '按商品', value: '1' },
        ]
    },

    isOfflineCanUsing: {
        label: '使用场景',
        type: 'radio',
        defaultValue: '1',
        options: GiftCfg.isOfflineCanUsing,
        
    },


    /**
     * 买赠券
    */
    discountRule : {
        label: '优惠规则',
        type: 'custom',
        defaultValue: '1',
        render: (decorator, form) => {
            return decorator({})(
                <Radio.Group >
                    <Radio value={'1'}><div style={{ display: 'inline-block'}}>
                        <span>特价</span>
                        <Tooltip title={
                            <p>
                                如果所点菜品在优惠菜品范围内，且所点菜品价格小于等于设置的特价金额，则该菜品不占用优惠菜品份数
                            </p>
                        }>
                            <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle" />
                        </Tooltip>
                    </div></Radio>
                    <Radio value={'2'}>折扣</Radio>
                    <Radio value={'3'}>
                        <span>立减</span>
                        <Tooltip title={
                            <p>
                                如果所点菜品在优惠菜品范围内，且所点菜品价格小于设置的立减金额，则该菜品不占用优惠菜品份数
                            </p>
                        }>
                            <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle" />
                        </Tooltip>
                    </Radio>
                </Radio.Group>
            );
        }
    },


    // 优惠顺序（买赠券）
    discountSortRule: {
        label: '优惠顺序',
        type: 'radio',
        defaultValue: '0',
        options: GiftCfg.discountSortRules,
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
        label: (
            <span>
                会员单笔账单张数限制
                <Tooltip title={
                    <p>
                        场景描述：<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;【结账收银】方式为：【仅主被扫线上支付自动结账】核销订单，在POS清台结账操作前，均受单笔账单张数限制约束。
                        <br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;【结账收银】方式为：【自动结账】或【仅主被扫线上支付自动结账】核销订单，均受单笔账单张数限制约束。
                        <br/>
                        仅主被扫线上支付自动结账方式举例：
                        <br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 此券【会员单笔账单张数限制】5张，会员持有此券8张，付款未结账清台前，多次下单结账，此券多次结账合计数量最大为5张。
                    </p>
                }>
                    <Icon type="question-circle" />
                </Tooltip>
            </span>
        ),
        type: 'text',
        placeholder: '请输入1-9999之间的数字，不填表示不限制',
        surfix: '张',
        rules: [{
            validator: (rule, v = '', cb) => {
                if (/^(?:[1-9][0-9]{0,3})?$/.test(v)) {
                    return cb()
                }
                cb(rule.message);
            },
            message: '请输入1-9999之间的数字'
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

export const MALL_COUPON_BASIC_SETTING_FORM_ITEMS = {
    '代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'pushMessage',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'giftRemark',
                'category',
                'mallScope',
                'applyScene',
            ],
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                // 'foodsboxs',  商城不需要
                //'mallScope',  // 商城券适用范围， 0， 按分类， 1， 按商品?
            ]
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                '',
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
                'pushMessage',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'giftRemark',
                'category',
                'mallScope',
                'applyScene',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                // 'foodScopes',
            ],
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                '',
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                // 'isNeedCustomerInfo',
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
                // 'selectMall',
                'pushMessage',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'priceSortRule',
                'giftRemark',
                'category',
                'mallScope',
                'applyScene',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                // 'foodScopes',
            ],
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
            ],
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: [
                // 'isNeedCustomerInfo',
            ],
        },
    ],
}


export const MALL_COUPON_APPLY_SETTING_FORM_ITEMS = {
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
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'amountType',
                'showGiftRule',
                'giftImagePath',
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
                // 'supportOrderTypeLst',
                // 'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'selectedShops',
                'showGiftRule',
                'giftImagePath',
                // 'aggregationChannels',
                // 'TrdTemplate',
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
                // 'supportOrderTypeLst',
                // 'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'selectedShops',
                'showGiftRule',
                'giftImagePath',
                // 'aggregationChannels',
                // 'TrdTemplate',
                'isSynch',
            ],
        },
    ],
}

export const FIRST_KEYS = {
    '代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'pushMessage',
                'notice',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'separateAccountType',
                'giftRemark',
                'category',
                'mallScope',
                'applyScene',
            ],
        }
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
                'pushMessage',
                'notice',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'separateAccountType',
                'giftRemark',
                'category',
                'mallScope',
                'applyScene',
            ],
        }
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
                'pushMessage',
                'notice',
                'giftValueCurrencyType',
                'giftValue',
                'price',
                'separateAccountType',
                'priceSortRule',
                'giftRemark',
                'category',
                'foodUnitType',
                'weight',
                'weightOffset',
                'mallScope',
                'applyScene',
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
                'pushMessage',
                'cardTypeList',
                'selectedMemberRightShops',
                'giftRemark',
                'category',
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
                'category',
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
                'category',
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
                'pushMessage',
                // 'mallScope',
                'foodsboxs',
                // 'buyGiveFoods',
                'stageType',
                'buyGiveSecondaryFoods',
                'subRule',
                'discountRule',                     // 优惠规则
                'stageAmount',
                'giveFoodCount',
                // 'compositeFoodDiscount',            // 数量及优惠组件，整合到一个新组件
                // 'discountRateSetting',              // 折扣设置 （注释掉，通过代码动态注释）
                // 'specialPriceVolSetting',           // 特价设置
                // 'discountDecreaseVolSetting',       // 立减
                'discountSortRule',                 // 买赠券优惠规则
                // 'priceSortRule',
                'price',
                'separateAccountType',
                'giftRemark',
                'category',
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
                'pushMessage',
                'notice',
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
                'separateAccountType',
                'giftRemark',
                'category',
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
                'pushMessage',
                'giftValueCurrencyType',
                'delivery',
                'price',
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: []
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftRemark',
                'category',
            ]
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: []
        },
    ],
    '不定额代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'applyScene',
                'giftName',
                'selectBrands',
                'pushMessage',
                'giftRemark',
                'category',
                'isNeedCustomerInfo'
            ],
        },
    ],
    '特殊权益券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftType',
                'giftName',
                'pushMessage',
                'notice',
                'specialInterestType'
            ],
        },
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: []
        },
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'giftRemark',
                'category',
            ]
        },
        {
            col: {
                span: 24,
                push: 3,
            },
            keys: []
        },
    ],
};
export const SECOND_KEYS = (() => ({
    '代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'selectedShops',
                // 'amountType',
                'showGiftRule',
                'giftImagePath',
                'aggregationChannels',
                'TrdTemplate',
                'isSynch',
            ],
        },
    ],
    '不定额代金券': [
        {
            col: {
                span: 24,
                pull: 2,
            },
            keys: [
                'transferType',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'selectedShops',
                // 'amountType',
                'showGiftRule',
                'giftImagePath',
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
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'selectedShops',
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
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'maxUseLimit',
                // 'selectedShops',
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
                'selectedShops',
                'deductMoneyType',
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
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                // 'customerUseCountLimit',
                'selectedShops',
                'excludeShops',
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
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'supportOrderTypeLst',
                'isOfflineCanUsing',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                // 'customerUseCountLimit',
                'selectedShops',
                'excludeShops',
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
                'transferringAvailable',
                'transferTitle',
                'transferImage',
                'usingWeekType',
                'usingDateType',
                'couponPeriodSettings',
                'isOnlineExchangeable',
                'giftShareType',
                'moneyLimitTypeAndValue',
                'customerUseCountLimit',
                'selectedShops',
                'excludeShops',
                'showGiftRule',
                'giftImagePath',
                'isSynch',
            ],
        },
    ],
    '特殊权益券': [
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
                'showGiftRule',
                'giftImagePath',
                'isSynch',
            ],
        },
    ],
}))();


export const THIRD_KEYS = (() => ({
    '代金券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectBrands',
                'foodsboxs',
                'selectedShops',
                'excludeShops',
                // 'subRule',
                'isNeedCustomerInfo'
            ]
        },
    ],
    '菜品优惠券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectBrands',
                'foodScopes',
                'selectedShops',
                'excludeShops',
                'subRule',
                'isNeedCustomerInfo'
            ]
        },
    ],
    '菜品兑换券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectBrands',
                'foodScopes',
                'selectedShops',
                'excludeShops',
                'subRule',
                'isNeedCustomerInfo'
            ]
        },
    ],
}))();
export const FOURTH_KEYS = (() => ({
    '代金券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectMall',
                'mallCategorySelector',     // 商城商品分类选择
                'mallExcludeGoodSelector',  // 排除商品选择
                'mallIncludeGoodSelector',  // 商城礼品卡适用商品选择框
            ]
        },
    ],
    '菜品优惠券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectMall',
                'mallCategorySelector',     // 商城商品分类选择
                'mallExcludeGoodSelector',  // 排除商品选择
                'mallIncludeGoodSelector',  // 商城礼品卡适用商品选择框
            ]
        },
    ],
    '菜品兑换券': [
        {
            col: {
                span: 24,
                push: 2,
            },
            keys: [
                'selectMall',
                'mallCategorySelector',     // 商城商品分类选择
                'mallExcludeGoodSelector',  // 排除商品选择
                'mallIncludeGoodSelector',  // 商城礼品卡适用商品选择框
            ]
        },
    ],
}))();
// 代金券
// const FORM_ITEMS_TO_INCLUDES

// 代金券商城场景下，使用规则表单需要删除的项目
export const FORM_ITEMS_GIFTS_RULES_TO_EXCLUDE_IN_MALL_SCENE = [
    'supportOrderTypeLst',              // 适用业务
    'isOfflineCanUsing',                // 使用场景
    'selectedShops',                        // 可使用店铺
    'aggregationChannels',              // 投放场景
    'TrdTemplate',                      // 是否关联第三方券
]

// export { FORMITEMS, FIRST_KEYS, SECOND_KEYS, FORM_ITEMS_GIFTS_RULES_TO_EXCLUDE_IN_MALL_SCENE }
