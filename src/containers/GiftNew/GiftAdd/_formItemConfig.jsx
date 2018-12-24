import React, { Component } from 'react';
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
        label: '券是否可分享',
        type: 'radio',
        defaultValue: 0,
        options: GiftCfg.transferType,
    },
    isHolidaysUsing: {
        label: '节假日是否可用',
        type: 'radio',
        defaultValue: '0',
        options: GiftCfg.isHolidaysUsing,
    },
    usingTimeType: {
        label: '使用餐段',
        type: 'checkbox',
        defaultValue: ['1', '2', '3', '4', '5'],
        options: GiftCfg.usingTimeType,
        rules: [{ type: 'array', required: true, message: '请选择使用时段' }],
    },
    supportOrderType: {
        label: '业务支持',
        type: 'combo',
        defaultValue: '2',
        options: GiftCfg.supportOrderType,
    },
    supportOrderTypes: {
        label: '业务支持',
        type: 'checkbox',
        defaultValue: ['0', '1', '2', '3', '4'],
        options: GiftCfg.supportOrderTypes,
        rules: [{ type: 'array', required: true, message: '请选择业务支持' }],
    },
    isOfflineCanUsing: {
        label: '到店使用',
        type: 'radio',
        defaultValue: 'true',
        options: GiftCfg.isOfflineCanUsing,
    },
    giftShareType: {
        label: '券与券共用',
        type: 'combo',
        defaultValue: '1',
        options: GiftCfg.shareType,
    },
    moneyLimitType: {
        label: '金额限制',
        type: 'combo',
        options: GiftCfg.moneyLimitType,
        defaultValue: '0',
    },
    moenyLimitValue: {
        label: ' ',
        type: 'text',
        defaultValue: '100',
        placeholder: '请输入金额',
        surfix: '元，使用一张',
        rules: [{
            required: true,
            validator: (rule, v, cb) => {
                if ((!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) || v <= 0) {
                    cb(rule.message);
                }
                cb();
            },
            message: '整数不超过8位，小数不超过2位，必须大于0',
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
    /*isSynch: {
        label: '是否同步',
        type: 'switcher',
        defaultValue: false,
        onLabel: '是',
        offLabel: '否',
    },*/
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
    '代金券': [{ col: { span: 24, pull: 2 }, keys: ['giftType','giftName','selectBrands', 'giftValue', 'foodsboxs', 'giftRemark',] },
    { col: { span: 24, push: 3 }, keys: ['isNeedCustomerInfo'] }],
    '菜品优惠券': [
        {col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'giftValue', 'foodNameList', 'giftRemark'],},
        {col: { span: 24, push: 3 }, keys: ['isNeedCustomerInfo']
        }],
    '菜品兑换券': [
        {col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'giftValue', 'foodNameList', 'giftRemark'],},
        {col: { span: 24, push: 3 }, keys: ['isNeedCustomerInfo']
    }],
    '会员权益券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'giftRemark'] }],
    '活动券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'giftRemark'] }],
    '线上礼品卡': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'giftValue', 'price', 'validityDays', 'giftRemark'] }],
    '买赠券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'buyGiveFoods', 'stageAmount', 'buyGiveSecondaryFoods', 'giveFoodCount', 'giftRemark',] },
        { col: { span: 24, push: 3 }, keys: ['isNeedCustomerInfo'] }],
    '折扣券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName','selectBrands', 'disCountTypeAndValue', 'discountOffMax', 'giftRemark',] },
        { col: { span: 24, push: 3 }, keys: ['isNeedCustomerInfo'] }],
};
const SECOND_KEYS = {
    '代金券': [{
        col: { span: 24, pull: 2 },
        keys: ['TrdTemplate', 'transferType', 'isHolidaysUsing', 'couponPeriodSettings', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'moneyLimitType', 'shopNames', 'isSynch'],
    }],
    '菜品优惠券': [{
        col: { span: 24, pull: 2 },
        keys: ['TrdTemplate', 'transferType', 'isHolidaysUsing', 'couponPeriodSettings', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'moneyLimitType', 'shopNames', 'isSynch'],
    }],
    '菜品兑换券': [{
        col: { span: 24, pull: 2 },
        keys: ['TrdTemplate', 'transferType', 'isHolidaysUsing', 'couponPeriodSettings', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'moneyLimitType', 'shopNames', 'isSynch'],
    }],
    '会员权益券': [{
        col: { span: 24, pull: 2 },
        keys: ['isCustomerPrice', 'hasPrivilegeOfWait', 'isDiscountRate', 'isPointRate', 'numberOfTimeType', 'moneyTopLimitType', 'isSynch'],
    }],
    '活动券': [{
        col: { span: 24, pull: 2 },
        keys: ['TrdTemplate', 'promotionID'],
    }],
    '线上礼品卡': [{
        col: { span: 24, pull: 2 },
        keys: ['shopNames', 'transferLimitType', 'couponTrdChannelStockNums', 'isSynch'],
    }],
    '买赠券': [{
        col: { span: 24, pull: 2 },
        keys: [ 'transferType', 'isHolidaysUsing', 'couponPeriodSettings', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'shopNames', 'isSynch'],
    }],
    '折扣券': [{
        col: { span: 24, pull: 2 },
        keys: ['TrdTemplate', 'transferType', 'isHolidaysUsing', 'couponPeriodSettings', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'shopNames', 'isSynch'],
    }],
};
export { FORMITEMS, FIRST_KEYS, SECOND_KEYS }
