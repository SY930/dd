import React, { Component } from 'react'
import {
    Row,
    Col,
    Form,
    message,
    Radio,
    Upload,
    Icon,
    Input,
    Select,
    Switch,
    Popconfirm,
    Tooltip,
} from 'antd';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import selfStyle from './addGifts.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
    saleCenterSetSpecialRecommendSettingsInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CloseableTip from '../../../components/common/CloseableTip/index';
import {
    fetchSpecialCardLevel,
    queryAllSaveMoneySet,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import AddGifts from '../common/AddGifts';
import ENV from "../../../helpers/env";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { doRedirect } from '../../../../src/helpers/util';
const moment = require('moment');
const FormItem = Form.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const getDefaultRecommendSetting = (recommendType = 1) => ({
    recommendType,
    rechargeRate: undefined,
    consumeRate: undefined,
    pointRate: undefined,
    rewardRange: 0,
});

const roundToDecimal = (number, bit = 2) => +number.toFixed(bit)

let uuid = 0;
const getIntervalID = () => {
    uuid += 1;
    return uuid;
}

const getDefaultGiftData = (typeValue = 0, typePropertyName = 'sendType') => ({
    // 膨胀所需人数
    needCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    effectType: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    [typePropertyName]: typeValue,
})

const shareInfoEnabledTypes = [
    '65',
    '66',
]

const MULTIPLE_LEVEL_GIFTS_CONFIG = [
    {
        type: '63',
        propertyName: 'lastConsumeIntervalDays',
        levelLabel: '距上次消费天数',
        levelAffix: '天，赠送以下礼品',
    },
    {
        type: '75',
        propertyName: 'needCount',
        levelLabel: '集满',
        levelAffix: '点，赠送以下礼品',
    },
]

class SpecialDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        const {
            data,
            wakeupSendGiftsDataArray, // 唤醒送礼专用
        } = this.initState();
        const eventRecommendSettings = this.initEventRecommendSettings();
        const selectedMpId = props.specialPromotion.getIn(['$eventInfo', 'mpIDList', '0']);
        const giftGetRule = props.specialPromotion.getIn(['$eventInfo', 'giftGetRule'], props.type == '75' ? 2 : 0);
        const discountRatio = props.specialPromotion.getIn(['$eventInfo', 'discountRate']);
        const discountMinRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMinRate']);
        const discountMaxRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMaxRate']);
        const discountMaxLimitRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMaxLimitRate']);
        const defaultCardType = props.specialPromotion.getIn(['$eventInfo', 'defaultCardType']);
        const $saveMoneySetIds = props.specialPromotion.getIn(['$eventInfo', 'saveMoneySetIds']);
        const saveMoneySetIds = Immutable.List.isList($saveMoneySetIds) && $saveMoneySetIds.size > 0
        ? $saveMoneySetIds.toJS() : [];
        this.state = {
            data,
            wakeupSendGiftsDataArray,
            eventRecommendSettings,
            cleanCount: props.specialPromotion.getIn(['$eventInfo', 'cleanCount'], 1),
            /** 膨胀大礼包相关 */
            giftGetRule,
            /** 膨胀大礼包相关结束 */
            /** 小程序分享相关 */
            shareImagePath: props.specialPromotion.getIn(['$eventInfo', 'shareImagePath']),
            shareTitle: props.specialPromotion.getIn(['$eventInfo', 'shareTitle']),
            /** 小程序分享相关结束 */
            /** 桌边砍相关 */
            moneyLimitType: props.specialPromotion.getIn(['$eventInfo', 'moneyLimitType']) || 0,
            moneyLimitValue: props.specialPromotion.getIn(['$eventInfo', 'moneyLimitValue']),
            eventValidTime: props.specialPromotion.getIn(['$eventInfo', 'eventValidTime']) || 10,
            discountType: props.specialPromotion.getIn(['$eventInfo', 'discountType']) || 0,
            discountWay: props.specialPromotion.getIn(['$eventInfo', 'discountWay']) || 0,
            discountAmount: props.specialPromotion.getIn(['$eventInfo', 'discountAmount']),
            discountMinAmount: props.specialPromotion.getIn(['$eventInfo', 'discountMinAmount']),
            discountMaxAmount: props.specialPromotion.getIn(['$eventInfo', 'discountMaxAmount']),
            discountRate: discountRatio ? roundToDecimal(discountRatio * 100) : discountRatio,
            discountMinRate: discountMinRatio ? roundToDecimal(discountMinRatio * 100) : discountMinRatio,
            discountMaxRate: discountMaxRatio ? roundToDecimal(discountMaxRatio * 100) : discountMaxRatio,
            discountMaxLimitRate: discountMaxLimitRatio ? roundToDecimal(discountMaxLimitRatio * 100)
                : discountMaxLimitRatio,
            inviteType: 1, // 需求变更，固定为1
            defaultCardType: defaultCardType > 0 ? defaultCardType : undefined,
            mpIDList: selectedMpId ? [ selectedMpId ] : [],
            disabledGifts: props.isNew ? false : this.props.specialPromotion.get('$giftInfo').size === 0,
            /** 桌边砍相关结束 */
            helpMessageArray: ['', ''],
            saveMoneySetIds,
            saveMoneySetType: saveMoneySetIds.length > 0 ? '1' : '0', // 前端内部状态，saveMoneySetIds数组为空表示全部套餐
        }
    }
    componentDidMount() {
        const { type, isLast = true, } = this.props;
        this.props.getSubmitFn({
            finish: isLast ? this.handleSubmit : undefined,
            next: !isLast ? this.handleSubmit : undefined,
        });
        this.props.fetchGiftListInfo();
        if (type == 67) {
            const user = this.props.user;
            const opts = {
                _groupID: user.accountInfo.groupID,
                _role: user.accountInfo.roleType,
                _loginName: user.accountInfo.loginName,
                _groupLoginName: user.accountInfo.groupLoginName,
            };
            this.props.fetchSpecialCardLevel({
                data: opts,
            });
        }
        if (type == 68) {
            this.props.queryAllSaveMoneySet()
        }
    }
    getMultipleLevelConfig = () => {
        const { type } = this.props;
        return MULTIPLE_LEVEL_GIFTS_CONFIG.find(item => item.type === `${type}`)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.specialPromotion.getIn(['$eventInfo', 'recommendRule']) !==
        this.props.specialPromotion.getIn(['$eventInfo', 'recommendRule'])) {
            this.setState({
                helpMessageArray: ['', ''],
                eventRecommendSettings: [getDefaultRecommendSetting(1), getDefaultRecommendSetting(2)],
                saveMoneySetIds: [],
                saveMoneySetType: '0',
            });
            this.props.form.resetFields();
        }
        if (prevProps.specialPromotion.getIn(['$eventInfo', 'needCount']) !==
        this.props.specialPromotion.getIn(['$eventInfo', 'needCount'])) {
            this.setState({
                wakeupSendGiftsDataArray: [
                    {
                        key: getIntervalID(),
                        intervalDays: undefined,
                        gifts: this.initiateDefaultGifts(),
                    }
                ]
            });
            this.props.form.resetFields();
        }
    }

    initiateDefaultGifts = () => {
        const type = `${this.props.type}`;
        switch (type) {
            /** 唤醒送礼活动，天数有档位设置 */
            case '63': return [getDefaultGiftData(0, 'wakeupIntervalStageIndex')];
            /** 分享裂变有邀请人和被邀请人两种类型的礼品 */
            case '65': return [getDefaultGiftData(), getDefaultGiftData(1)];
            /** 膨胀大礼包固定3个礼品，不加减数量 */
            case '66': return [getDefaultGiftData(), getDefaultGiftData(), getDefaultGiftData()];
            /** 推荐有礼活动，是靠recommendType 字段划分礼品类型的 */
            case '68': return [];
            default: return [getDefaultGiftData()]
        }
    }

    initState = () => {
        const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
        const data = this.initiateDefaultGifts();
        giftInfo.forEach((gift, index) => {
            if (data[index] !== undefined) {
                data[index].sendType = gift.sendType || 0;
                data[index].recommendType = gift.recommendType || 0;
            } else {
                const typePropertyName = this.props.type == '68' ? 'recommendType' : 'sendType'
                const typeValue = this.props.type == '68' ? gift.recommendType : gift.sendType;
                data[index] = getDefaultGiftData(typeValue, typePropertyName); 
            }
            data[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours
                : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')];
            data[index].effectType = `${gift.effectType}`;
            data[index].giftInfo.giftName = gift.giftName;
            data[index].needCount.value = gift.needCount || 0;
            data[index].giftInfo.giftItemID = gift.giftID;
            data[index].giftValidDays.value = gift.giftValidUntilDayCount;
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                data[index].giftCount.value = gift.giftCount;
            } else {
                data[index].giftTotalCount.value = gift.giftTotalCount;
            }
            data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            data[index].lastConsumeIntervalDays = gift.lastConsumeIntervalDays ? `${gift.lastConsumeIntervalDays}` : undefined;
        })
        if (this.props.type == '68') { // 小数组，为了代码方便重复遍历的
            if (data.every(gift => gift.recommendType != 1)) {
                data.push(getDefaultGiftData(1, 'recommendType'))
            }
            if (data.every(gift => gift.recommendType != 2)) {
                data.push(getDefaultGiftData(2, 'recommendType'))
            }
            if (data.every(gift => gift.recommendType != 0)) {
                data.push(getDefaultGiftData(0, 'recommendType'))
            }
        }
        let wakeupSendGiftsDataArray = [];
        const multiConfig = this.getMultipleLevelConfig();
        if (multiConfig) {
            const intervalDaysArray = data.reduce((acc, curr) => {
                // 不同活动里的needCount 输入框层级不一样，数据类型也不一样
                if (typeof curr[multiConfig.propertyName] === 'object') {
                    curr[multiConfig.propertyName] = curr[multiConfig.propertyName].value;
                }
                const propertyValue = curr[multiConfig.propertyName];
                if (propertyValue  >= 0) { // undefined >= 0 is false
                    if (acc.indexOf(propertyValue) === -1) {
                        acc.push(propertyValue);
                    }
                }
                return acc;
            }, []);
            if (!intervalDaysArray.length) {
                wakeupSendGiftsDataArray = [
                    {
                        key: getIntervalID(),
                        intervalDays: undefined,
                        gifts: [
                            ...data,
                        ]
                    }
                ];
            } else {
                wakeupSendGiftsDataArray = intervalDaysArray
                    .sort((a, b) => a - b)
                    .map(days => ({
                        key: getIntervalID(),
                        intervalDays: days,
                        gifts: data.filter(gift => gift[multiConfig.propertyName] === days)
                    }))
            }
        }
        return {
            data,
            wakeupSendGiftsDataArray,
        };
    }

    initEventRecommendSettings = () => {
        let eventRecommendSettings = this.props.specialPromotion.get('$eventRecommendSettings').toJS();
        // 后端是按比率存的（0.11），前端是按百分比显示（11%）的
        eventRecommendSettings = eventRecommendSettings.map(setting => ({
            ...setting,
            pointRate: setting.pointRate ? roundToDecimal(setting.pointRate * 100) : undefined,
            consumeRate: setting.consumeRate ? roundToDecimal(setting.consumeRate * 100) : undefined,
            rechargeRate: setting.rechargeRate ? roundToDecimal(setting.rechargeRate * 100) : undefined,
            pointLimitValue: setting.pointLimitValue || undefined, // 0 表示不限制
            moneyLimitValue: setting.moneyLimitValue || undefined, // 0 表示不限制,
        }))
        if (eventRecommendSettings.length === 2) return eventRecommendSettings;
        if (eventRecommendSettings.length === 1) return [eventRecommendSettings[0], getDefaultRecommendSetting(2)]
        return [getDefaultRecommendSetting(1), getDefaultRecommendSetting(2)]
    }

    // 拼出礼品信息
    getGiftInfo(data) {
        const giftArr = data.map((giftInfo, index) => {
            let gifts;
            if (giftInfo.effectType != '2') {
                // 相对期限
                gifts = {
                    effectType: giftInfo.effectType,
                    giftEffectTimeHours: giftInfo.giftEffectiveTime.value,
                    giftValidUntilDayCount: giftInfo.giftValidDays.value,
                    giftID: giftInfo.giftInfo.giftItemID,
                    giftName: giftInfo.giftInfo.giftName,
                }
            } else {
                // 固定期限
                gifts = {
                    effectType: '2',
                    effectTime: giftInfo.giftEffectiveTime.value[0] && giftInfo.giftEffectiveTime.value[0] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[0].format('YYYYMMDD')) : '',
                    validUntilDate: giftInfo.giftEffectiveTime.value[1] && giftInfo.giftEffectiveTime.value[1] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[1].format('YYYYMMDD')) : '',
                    giftID: giftInfo.giftInfo.giftItemID,
                    giftName: giftInfo.giftInfo.giftName,
                }
            }
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                gifts.giftCount = giftInfo.giftCount.value;
            } else {
                gifts.giftTotalCount = giftInfo.giftTotalCount.value
            }
            if (this.props.type == '20') {
                gifts.giftOdds = giftInfo.giftOdds.value;
            }
            gifts.sendType = giftInfo.sendType || 0;
            gifts.recommendType = giftInfo.recommendType || 0;
            gifts.lastConsumeIntervalDays = giftInfo.lastConsumeIntervalDays;
            gifts.needCount = typeof giftInfo.needCount === 'object' ? giftInfo.needCount.value : giftInfo.needCount;
            return gifts
        });
        return giftArr;
    }
    checkNeedCount = (needCount, index) => {
        const _value = parseFloat(needCount.value);
        // 只有膨胀大礼包校验此字段
        if (this.props.type != '66' || index === 0 || _value > 0 && _value < 1000) {
            return needCount;
        }
        return {
            msg: '膨胀需要人数必须大于0, 小于1000',
            validateStatus: 'error',
            value: '',
        }
    }
    handleSubmit(isPrev) {
        if (isPrev) return true;
        let flag = true;
        this.props.form.validateFieldsAndScroll({ force: true }, (error, basicValues) => {
            if (error) {
                flag = false;
            }
            // 推荐有礼特有校验逻辑：两个输入框至少要有1个
            if (this.props.type == '68') {
                const { helpMessageArray } = this.state;
                if (basicValues['recharge1']) {
                    if ((basicValues['recharge1'].number === '' || basicValues['recharge1'].number == undefined) &&
                        (basicValues['point1'].number === '' || basicValues['point1'].number == undefined)
                    ) {
                        helpMessageArray[0] = '储值比例与积分比例至少要设置一项';
                        flag = false;
                    } else {
                        helpMessageArray[0] = '';
                    }
                }
                if (basicValues['consumption1']) {
                    if ((basicValues['consumption1'].number === '' || basicValues['consumption1'].number == undefined) &&
                        (basicValues['point1'].number === '' || basicValues['point1'].number == undefined)
                    ) {
                        helpMessageArray[0] = '消费比例与积分比例至少要设置一项';
                        flag = false;
                    } else {
                        helpMessageArray[0] = '';
                    }
                }
                if (basicValues['recharge2']) {
                    if ((basicValues['recharge2'].number === '' || basicValues['recharge2'].number == undefined) &&
                        (basicValues['point2'].number === '' || basicValues['point2'].number == undefined)
                    ) {
                        helpMessageArray[1] = '储值比例与积分比例至少要设置一项';
                        flag = false;
                    } else {
                        helpMessageArray[1] = '';
                    }
                }
                if (basicValues['consumption2']) {
                    if ((basicValues['consumption2'].number === '' || basicValues['consumption2'].number == undefined) &&
                        (basicValues['point2'].number === '' || basicValues['point2'].number == undefined)
                    ) {
                        helpMessageArray[1] = '消费比例与积分比例至少要设置一项';
                        flag = false;
                    } else {
                        helpMessageArray[1] = '';
                    }
                }
            }
        });
        if (!flag) {
            return false;
        }
        let {
            data,
            shareImagePath,
            shareTitle,
            cleanCount,
            discountMinRate,
            discountMaxRate,
            discountRate,
            discountMaxLimitRate,
            disabledGifts,
            saveMoneySetIds,
            giftGetRule,
            ...instantDiscountState,
        } = this.state;
        const { type } = this.props;
        // 桌边砍可以不启用礼品 直接短路返回
        if (flag && type == 67 && disabledGifts) {
            this.props.setSpecialBasicInfo(
            {
                shareImagePath,
                shareTitle,
                discountMinRate: discountMinRate ? discountMinRate / 100 : discountMinRate,
                discountMaxRate: discountMaxRate ? discountMaxRate / 100 : discountMaxRate,
                discountRate: discountRate ? discountRate / 100 : discountRate,
                discountMaxLimitRate: discountMaxLimitRate ? discountMaxLimitRate / 100 : discountMaxLimitRate,
                ...instantDiscountState,
            });
            this.props.setSpecialGiftInfo([]);
            return true;
        }
        // 校验礼品数量
        function checkgiftTotalCount(giftTotalCount) {
            const _value = parseFloat(giftTotalCount.value);
            if (_value > 0) {
                return giftTotalCount;
            }
            return {
                msg: '礼品总数必须大于0',
                validateStatus: 'error',
                value: '',
            }
        }
        function checkgiftCount(giftCount, index, giftInfoArray) {
            const _value = parseFloat(giftCount.value);
            if (!(_value > 0 && _value < 51)) {
                return {
                    msg: '礼品个数必须在1到50之间',
                    validateStatus: 'error',
                    value: '',
                }
            }
            if (type == 66) { // 膨胀大礼包，每个档位礼品不能重复
                let hasDuplica;
                for (let i = 0; i < index; i++) {
                    if (giftInfoArray[i]) {
                        hasDuplica = hasDuplica || giftInfoArray[i].giftInfo.giftItemID === giftInfoArray[index].giftInfo.giftItemID &&
                        giftInfoArray[i].giftCount.value === giftInfoArray[index].giftCount.value;
                    }
                }
                if (hasDuplica) {
                    return {
                        ...giftCount,
                        validateStatus: 'error',
                        msg: '礼品种类与个数不能完全重复',
                    }
                }
            }
            return {
                ...giftCount,
                validateStatus: 'success',
                msg: '',
            };
        }

        // 有效天数
        function checkGiftValidDays(giftValidDays, index) {
            const _value = giftValidDays.value instanceof Array ? giftValidDays.value : parseFloat(giftValidDays.value);
            if (_value > 0 || (_value[0] && _value[1])) {
                return giftValidDays;
            }
            return {
                msg: '请输入正确有效期',
                validateStatus: 'error',
                value: '',
            }
        }

        // 校验中奖比率
        function checkGiftOdds(giftOdds) {
            if (type == '20') {
                const _value = parseFloat(giftOdds.value);
                if (_value >= 0 && _value <= 100) {
                    return giftOdds;
                }
                return {
                    msg: '中奖比率必填, 大于等于0, 小于等于100',
                    validateStatus: 'error',
                    value: '',
                }
            }
            return giftOdds;
        }

        // 校验礼品信息
        function checkGiftInfo(giftInfo, index, giftInfoArray) {
            if (giftInfo.giftItemID === null || giftInfo.giftName === null) {
                return {
                    giftItemID: null,
                    giftName: null,
                    validateStatus: 'error',
                    msg: '必须选择礼券',
                }
            }
            if (type == 66) { // 膨胀大礼包，每个档位礼品不能重复
                let hasDuplica;
                for (let i = 0; i < index; i++) {
                    if (giftInfoArray[i]) {
                        hasDuplica = hasDuplica || giftInfoArray[i].giftInfo.giftItemID === giftInfoArray[index].giftInfo.giftItemID &&
                        giftInfoArray[i].giftCount.value === giftInfoArray[index].giftCount.value;
                    }
                }
                if (hasDuplica) {
                    return {
                        ...giftInfo,
                        validateStatus: 'error',
                        msg: '礼品种类与个数不能完全重复',
                    }
                }
            }
            return {
                ...giftInfo,
                validateStatus: 'success',
                msg: '',
            };
        }
        if (this.props.type == '68') {
            const recommendRange = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRange']);
            const recommendRule = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRule']);
            if (recommendRule != 1) {
                data = data.filter(item => item.recommendType == 0)
            }
            if (recommendRule == 1 && recommendRange == 0) {
                data = data.filter(item => item.recommendType == 0 || item.recommendType == 1)
            }
        }
        if (this.getMultipleLevelConfig()) {
            data = this.state.wakeupSendGiftsDataArray.reduce((acc, curr) => {
                curr.gifts.forEach(gift => {
                    gift[this.getMultipleLevelConfig().propertyName] = curr.intervalDays || 0;
                })
                acc.push(...curr.gifts);
                return acc;
            }, [])
        }
        const validatedRuleData = data.map((ruleInfo, index) => {
            const giftValidDaysOrEffect = ruleInfo.effectType != '2' ? 'giftValidDays' : 'giftEffectiveTime';
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                // check gift count
                return Object.assign(ruleInfo, {
                    giftCount: checkgiftCount(ruleInfo.giftCount, index, data),
                    giftInfo: checkGiftInfo(ruleInfo.giftInfo, index, data),
                    giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                    needCount: this.checkNeedCount(ruleInfo.needCount, index),
                    [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
                });
            }
            // check total count
            return Object.assign(ruleInfo, {
                giftTotalCount: checkgiftTotalCount(ruleInfo.giftTotalCount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                needCount: this.checkNeedCount(ruleInfo.needCount, index),
                [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
            });
        });
        const validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
            const _validStatusOfCurrentIndex = Object.keys(ruleInfo)
                .reduce((flag, key) => {
                    if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')) {
                        const _valid = ruleInfo[key].validateStatus === 'success';
                        return flag && _valid;
                    }
                    return flag
                }, true);
            return p && _validStatusOfCurrentIndex;
        }, true);
        data = validatedRuleData;
        this.setState({ data });
        if (validateFlag) {
            const giftInfo = this.getGiftInfo(data);
            this.props.setSpecialBasicInfo(giftInfo);
            this.props.setSpecialBasicInfo(
                this.props.type == '67' ? {
                shareImagePath,
                shareTitle,
                discountMinRate: discountMinRate ? discountMinRate / 100 : discountMinRate,
                discountMaxRate: discountMaxRate ? discountMaxRate / 100 : discountMaxRate,
                discountRate: discountRate ? discountRate / 100 : discountRate,
                discountMaxLimitRate: discountMaxLimitRate ? discountMaxLimitRate / 100 : discountMaxLimitRate,
                ...instantDiscountState,
            } : {
                giftGetRule,
                saveMoneySetIds,
                shareImagePath,
                shareTitle,
                cleanCount,
            });
            this.props.setSpecialGiftInfo(giftInfo);
            if (this.props.type == '68') { // 推荐有礼表项
                let { eventRecommendSettings } = this.state;
                const recommendRange = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRange']);
                const recommendRule = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRule']);
                if (recommendRule == 1) {
                    eventRecommendSettings = [];
                }
                if (recommendRule == 2) {
                    eventRecommendSettings = eventRecommendSettings
                        .map(setting => ({
                            ...setting,
                            rechargeRate: setting.rechargeRate / 100,
                            pointRate: setting.pointRate / 100,
                            consumeRate: 0,
                            rewardRange: 0,
                        }))
                }
                if (recommendRule == 3) {
                    eventRecommendSettings = eventRecommendSettings
                        .map(setting => ({
                            ...setting,
                            pointRate: setting.pointRate / 100,
                            consumeRate: setting.consumeRate / 100,
                            rechargeRate: 0,
                        }))
                }
                if (recommendRange == 0) {
                    eventRecommendSettings = eventRecommendSettings.filter(setting => setting.recommendType == 1)
                }
                this.props.setSpecialRecommendSettings(eventRecommendSettings)
            }
            return true;
        }
        return false;
    }

    gradeChange(gifts, typeValue) {
        const typePropertyName = this.props.type == '68' ? 'recommendType' : 'sendType';
        if (!Array.isArray(gifts)) return;
        const { data } = this.state;
        this.setState({
            data: [...data.filter(item => item[typePropertyName] !== typeValue), ...gifts]
        })
    }
    handleShareTitleChange = ({ target: { value }}) => {
        this.setState({
            shareTitle: value,
        })
    }
    handleMoneyLimitTypeChange = (value) => {
        this.setState({
            moneyLimitType: +value,
            moneyLimitValue: undefined,
        })
    }
    handleDiscountTypeChange = (value) => {
        this.setState({
            discountType: +value,
            discountAmount: undefined,
            discountMaxAmount: undefined,
            discountMinAmount: undefined,
            discountRate: undefined,
            discountMinRate: undefined,
            discountMaxRate: undefined,
        })
    }
    handleMpIdChange = (value) => {
        this.setState({
            mpIDList: [value],
        })
    }
    handleDefaultCardTypeChange = (value) => {
        this.setState({
            defaultCardType: value,
        })
    }
    handleDiscountRateChange = ({ number }) => {
        this.setState({
            discountRate: number,
        })
    }
    handleDiscountMinRateChange = ({ number }) => {
        this.setState({
            discountMinRate: number,
        }, () => this.props.form.setFieldsValue({discountMaxRate: {number: this.state.discountMaxRate}} ))
    }
    handleDiscountMaxRateChange = ({ number }) => {
        this.setState({
            discountMaxRate: number,
        }, () => this.props.form.setFieldsValue({discountMinRate: {number: this.state.discountMinRate}} ))
    }
    handleDiscountAmountChange = ({ number }) => {
        this.setState({
            discountAmount: number,
        })
    }
    handleDiscountMinAmountChange = ({ number }) => {
        this.setState({
            discountMinAmount: number,
        }, () => this.props.form.setFieldsValue({discountMaxAmount: {number: this.state.discountMaxAmount}} ))
    }
    handleDiscountMaxAmountChange = ({ number }) => {
        this.setState({
            discountMaxAmount: number,
        }, () => this.props.form.setFieldsValue({discountMinAmount: {number: this.state.discountMinAmount}} ))
    }
    handleDiscountMaxLimitRateChange = ({ number }) => {
        this.setState({
            discountMaxLimitRate: number,
        })
    }
    handleMoneyLimitValueChange = ({ number }) => {
        this.setState({
            moneyLimitValue: number,
        })
    }
    handleEventValidTimeChange = ({ number }) => {
        this.setState({
            eventValidTime: number,
        })
    }
    handleGiftGetRuleChange = ({ target: { value } }) => {
        if (value === 2 && this.props.type == '75') {
            let { wakeupSendGiftsDataArray } = this.state;
            wakeupSendGiftsDataArray = wakeupSendGiftsDataArray.slice(0, 1);
            wakeupSendGiftsDataArray[0].intervalDays = undefined;
            this.setState({
                wakeupSendGiftsDataArray
            })
        }
        this.setState({
            giftGetRule: value,
        })
    }
    handleCleanCountChange = ({ target: { value } }) => {
        this.setState({
            cleanCount: value,
        })
    }
    handleRecommendSettingsChange = (index, propertyName) => (val) => {
        const eventRecommendSettings = this.state.eventRecommendSettings.slice();
        const { helpMessageArray } = this.state;
        let value;
        if (typeof val === 'object') {
            value = val.number;
            helpMessageArray[index] = '';
        } else {
            value = val;
        }
        eventRecommendSettings[index][propertyName] = value;
        this.setState({
            eventRecommendSettings,
            helpMessageArray,
        })
    }
    handleDiscountWayChange = ({ target: { value } }) => {
        this.setState({
            discountWay: +value,
            discountAmount: undefined,
            discountMaxAmount: undefined,
            discountMinAmount: undefined,
            discountRate: undefined,
            discountMinRate: undefined,
            discountMaxRate: undefined,
        })
    }
    handleSaveMoneySetTypeChange = ({ target: { value } }) => {
        this.setState({
            saveMoneySetType: value,
            saveMoneySetIds: [],
        })
    }
    handleSaveMoneySetIdsChange = (val) => {
        this.setState({
            saveMoneySetIds: val,
        })
    }
    handleIntervalDaysChange = (val, index) => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray[index].intervalDays = val;
        this.setState({
            wakeupSendGiftsDataArray: wakeupSendGiftsDataArray.slice(),
        })
    }
    handleWakeupIntervalGiftsChange = (val, index) => {
        let { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray[index].gifts = val;
        this.setState({
            wakeupSendGiftsDataArray,
        })
    }
    removeInterval = (index) => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray.splice(index, 1);
        this.setState({
            wakeupSendGiftsDataArray,
        })
    }
    addInterval = () => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray.push({
            key: getIntervalID(),
            intervalDays: undefined,
            gifts: [
                getDefaultGiftData(),
            ]
        });
        this.setState({
            wakeupSendGiftsDataArray,
        })
    }
    renderImgUrl = () => {
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            className: styles1.avatarUploader,
            accept: 'image/*',
            beforeUpload: file => {
                const isAllowed = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isAllowed) {
                    message.error('仅支持png和jpeg/jpg格式的图片');
                }
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    message.error('图片不要大于1MB');
                }
                return isAllowed && isLt1M;
            },
            onChange: (info) => {
                const status = info.file.status;
                if (status === 'done' && info.file.response && info.file.response.url) {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        shareImagePath: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    })
                } else if (status === 'error' || (info.file.response && !info.file.response.url)) {
                    if (info.file.response.code === '0011111100000001') {
                        message.warning('因长时间未操作，会话已过期，请重新登陆');
                        setTimeout(() => {
                            doRedirect()
                        }, 2000)
                    } else {
                        message.error(`${info.file.name} 上传失败`);
                    }
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem>
                        <Upload
                            {...props}
                        >
                            {
                                this.state.shareImagePath ?
                                    <img src={this.state.shareImagePath} alt="" className={styles1.avatar} /> :
                                    <Icon
                                        type="plus"
                                        className={styles1.avatarUploaderTrigger}
                                    />
                            }
                        </Upload>
                        <p className="ant-upload-hint">
                            点击上传图片，图片格式为jpg、png, 小于1MB
                            <br/>
                            建议尺寸: 520*416像素
                        </p>
                    </FormItem>
                </Col>
            </Row>
        )
    }
    renderShareInfo() {
        return (
            <div>
                <FormItem
                    label="小程序分享标题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator('shareTitle', {
                        rules: [
                            { max: 50, message: '最多50个字符' },
                        ],
                        initialValue: this.state.shareTitle,
                        onChange: this.handleShareTitleChange,
                    })(
                        <Input placeholder="不填写则显示默认标题" />
                    )}
                </FormItem>
                <FormItem
                    label="小程序分享图片"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    {this.renderImgUrl()}
                </FormItem>
            </div>  
        )
    }
    renderFlexFormControl() {
        const {
            discountWay,
            discountType,
            discountAmount,
            discountMaxAmount,
            discountMinAmount,
            discountRate,
            discountMinRate,
            discountMaxRate,
        } = this.state;
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                <FormItem
                    label="邀请一人"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    style={{ width: '40%' }}
                >
                    <RadioGroup
                        onChange={this.handleDiscountWayChange}
                        value={`${discountWay}`}
                    >
                        <RadioButton value="0">减免</RadioButton>
                        <RadioButton value="1">减折</RadioButton>
                    </RadioGroup>
                </FormItem>
                {
                    (discountType === 0 && discountWay === 0) && (
                        <FormItem
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 19 }}
                            style={{ width: '60%' }}
                        >
                            {
                                getFieldDecorator('discountAmount', {
                                    onChange: this.handleDiscountAmountChange,
                                    initialValue: { number: discountAmount },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免金额必须大于0');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="元"
                                        maxNum={3}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    )
                }
                {
                    (discountType === 0 && discountWay === 1) && (
                        <FormItem
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 19 }}
                            style={{ width: '60%' }}
                        >
                            {
                                getFieldDecorator('discountRate', {
                                    onChange: this.handleDiscountRateChange,
                                    initialValue: { number: discountRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免折扣必须大于0');
                                                } else if (v.number > 100) {
                                                    return cb('比例不超过100%');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="%"
                                        maxNum={4}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    )
                }
                {
                    (discountType === 1 && discountWay === 1) && (
                        <div
                            style={{ width: '48%'}}
                            className={styles.flexFormControl}
                        >
                            <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: '45%' }}
                        >
                            {
                                getFieldDecorator('discountMinRate', {
                                    onChange: this.handleDiscountMinRateChange,
                                    initialValue: { number: discountMinRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免折扣必须大于0');
                                                } else if (v.number > 100) {
                                                    return cb('比例不超过100%');
                                                } else if (v.number > +discountMaxRate) { // 字符串和字符串做比较，有坑
                                                    return cb('不能大于最高折扣');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="%"
                                        maxNum={4}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                        至
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: '45%' }}
                        >
                            {
                                getFieldDecorator('discountMaxRate', {
                                    onChange: this.handleDiscountMaxRateChange,
                                    initialValue: { number: discountMaxRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免折扣必须大于0');
                                                } else if (v.number > 100) {
                                                    return cb('比例不超过100%');
                                                } else if (v.number < +discountMinRate) {
                                                    return cb('不能小于最低折扣');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="%"
                                        maxNum={4}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                        </div>
                        
                    )
                }           
                {
                    (discountType === 1 && discountWay === 0) && (
                        <div
                            style={{ width: '48%'}}
                            className={styles.flexFormControl}
                        >
                            <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: '45%' }}
                        >
                            {
                                getFieldDecorator('discountMinAmount', {
                                    onChange: this.handleDiscountMinAmountChange,
                                    initialValue: { number: discountMinAmount },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免金额必须大于0');
                                                } else if (v.number > +discountMaxAmount) {
                                                    return cb('不能大于最高减免');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="元"
                                        maxNum={3}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                        至
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: '45%' }}
                        >
                            {
                                getFieldDecorator('discountMaxAmount', {
                                    onChange: this.handleDiscountMaxAmountChange,
                                    initialValue: { number: discountMaxAmount },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !(v.number > 0)) {
                                                    return cb('减免金额必须大于0');
                                                } else if (v.number < +discountMinAmount) {
                                                    return cb('不能小于最低减免');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="元"
                                        maxNum={3}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                        </div> 
                    )
                }           
            </div>
        )
    }
    renderInstantDiscountForm() {
        const {
            moneyLimitType,
            moneyLimitValue,
            eventValidTime,
            discountType,
            discountMaxLimitRate,
            inviteType,
            mpIDList,
            defaultCardType,
        } = this.state;
        const {
            form: {
                getFieldDecorator,
            },
            groupCardTypeList,
            allWeChatAccountList,
        } = this.props;
        const mpInfoList = Immutable.List.isList(allWeChatAccountList) ? allWeChatAccountList.toJS() : [];
        const cardTypeList = Immutable.List.isList(groupCardTypeList) ? groupCardTypeList.toJS() : [];
        const userCount = this.props.specialPromotion.getIn(['$eventInfo', 'userCount']);// 当有人领取礼物后，礼物不可编辑
        return (
            <div
                style={{
                    marginBottom: 20,
                }}
            >
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p>支付账单时, 根据用户达成目标的阶梯, 进行相应的折扣或减免</p>
                </FormItem>
                <FormItem
                    label="账单限制"
                    className={styles.FormItemStyle}
                    required={moneyLimitType === 1}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        moneyLimitType === 0 ? (
                            <Select
                                value={`${moneyLimitType}`}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={this.handleMoneyLimitTypeChange}
                            >
                                <Select.Option value="0">不限制</Select.Option>
                                <Select.Option value="1">满</Select.Option>
                            </Select>
                        ) : getFieldDecorator('moneyLimitValue', {
                            onChange: this.handleMoneyLimitValueChange,
                            initialValue: { number: moneyLimitValue },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !v.number) {
                                            return cb('账单限制不能为空');
                                        }
                                        cb()
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonBefore={(
                                    <Select
                                        value={`${moneyLimitType}`}
                                        getPopupContainer={(node) => node.parentNode}
                                        onChange={this.handleMoneyLimitTypeChange}
                                    >
                                        <Select.Option value="0">不限制</Select.Option>
                                        <Select.Option value="1">满</Select.Option>
                                    </Select>
                                )}
                                addonAfter={'元'}
                                maxNum={8}
                                modal="float"
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    label="活动类型"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        value={`${discountType}`}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleDiscountTypeChange}
                    >
                        <Select.Option value="0">每邀请一人优惠固定数额</Select.Option>
                        <Select.Option value="1">每邀请一人优惠随机数额</Select.Option>
                    </Select>
                </FormItem>
                {
                    this.renderFlexFormControl()
                }
                <FormItem
                    label="优惠上限"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        getFieldDecorator('discountMaxLimitRate', {
                            onChange: this.handleDiscountMaxLimitRateChange,
                            initialValue: { number: discountMaxLimitRate },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !(v.number > 0)) {
                                            return cb('优惠上限必须大于0');
                                        } else if (v.number > 100) {
                                            return cb('优惠上限不能超过100%');
                                        }
                                        cb()
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonBefore="账单金额的"
                                addonAfter="%"
                                maxNum={4}
                                modal="float"
                            />
                        )
                    }
                    <CloseableTip
                        style={{
                            position: 'absolute',
                            right: '-23px',
                            top: '5px'
                        }}
                        width="100%"
                        content={
                            <div>
                                <p>优惠上限</p>
                                <br/>
                                <p>当参与活动人数已帮砍的金额达到了优惠上限,则在活动时限内,依然会每新增一人帮砍0.01元。</p>
                            </div>
                        }
                    />
                </FormItem>
                <FormItem
                    label="活动限时"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        getFieldDecorator('eventValidTime', {
                            onChange: this.handleEventValidTimeChange,
                            initialValue: { number: eventValidTime },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !(v.number > 0)) {
                                            return cb('活动限时必须大于0');
                                        } else if (v.number > 10) {
                                            return cb('活动限时不能超过10分钟');
                                        }
                                        cb()
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonAfter="分钟"
                                maxNum={3}
                                modal="int"
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    label="邀请规则"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        value={`${inviteType}`}
                        getPopupContainer={(node) => node.parentNode}
                        disabled
                    >
                        {/* <Select.Option value="0">被邀请人关注公众号即完成邀请</Select.Option> */}
                        <Select.Option value="1">被邀请人注册会员即完成邀请</Select.Option>
                    </Select>
                    <CloseableTip
                        style={{
                            position: 'absolute',
                            right: '-23px',
                            top: '5px'
                        }}
                        width="100%"
                        content={
                            <div>
                                <p>活动规则</p>
                                <br/>
                                <p>被邀请人需要关注公众号,关注后会推送选定的会员卡类型的领卡链接,被邀请人注册会员后,发起人即完成砍价任务</p>
                            </div>
                        }
                    />
                </FormItem>
                <FormItem
                    label="公众号"
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        getFieldDecorator('mpId', {
                            rules: [
                                { required: true, message: '必须选择一个公众号' }
                            ],
                            initialValue: mpIDList.length ? mpIDList[0] : undefined,
                            onChange: this.handleMpIdChange,
                        })(
                            <Select
                                placeholder="请选择被邀请人需要关注的公众号"
                                getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    mpInfoList.map(({mpID, mpName}) => (
                                        <Select.Option key={mpID} value={mpID}>{mpName}</Select.Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    label="会员卡类型"
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        getFieldDecorator('defaultCardType', {
                            rules: [
                                { required: true, message: '必须选择一个卡类型' }
                            ],
                            initialValue: defaultCardType,
                            onChange: this.handleDefaultCardTypeChange,
                        })(
                            <Select
                                showSearch={true}
                                placeholder="请选择被邀请人需要注册的会员卡类型"
                                getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    cardTypeList.map(cate => <Select.Option key={cate.cardTypeID} value={cate.cardTypeID}>{cate.cardTypeName}</Select.Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    label="礼品启用状态"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Switch
                        checked={!this.state.disabledGifts}
                        checkedChildren="开启"
                        disabled={userCount > 0}
                        unCheckedChildren="关闭"
                        onChange={(bool) => this.setState({disabledGifts: !bool})}
                    ></Switch>
                </FormItem>
            </div>
        )
    }

    renderRecommendGifts = (recommendType) => {
        let filteredGifts = this.state.data.filter(gift => gift.recommendType === recommendType);
        if (!filteredGifts.length) {
            filteredGifts = [getDefaultGiftData(recommendType, 'recommendType')]
        }
        return (
            <Row>
                <Col span={17} offset={4}>
                    <AddGifts
                        maxCount={10}
                        typeValue={recommendType}
                        typePropertyName={'recommendType'}
                        type={this.props.type}
                        isNew={this.props.isNew}
                        value={filteredGifts}
                        onChange={(gifts) => this.gradeChange(gifts, recommendType)}
                    />
                </Col>
            </Row>
        )
    }
    renderPointControl = (recommendType, index) => {
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        const {
            eventRecommendSettings,
        } = this.state;
        return (
            <Row gutter={8}>
                <Col span={10} offset={1}>
                    <FormItem
                        label="积分比例"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {
                            getFieldDecorator(`point${recommendType}`, {
                                onChange: this.handleRecommendSettingsChange(index, 'pointRate'),
                                initialValue: { number: eventRecommendSettings[index].pointRate },
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (v.number === '' || v.number === undefined) {
                                                return cb();
                                            }
                                            if (!v || !(v.number > 0)) {
                                                return cb('积分比例必须大于0');
                                            } else if (v.number > 100) {
                                                return cb('积分比例不能超过100%');
                                            }
                                            cb()
                                        },
                                    },
                                ],
                            })(
                                <PriceInput
                                    addonAfter="%"
                                    maxNum={3}
                                    modal="float"
                                />
                            )
                        }
                    </FormItem>
                </Col>
                <Col span={10}>
                    <FormItem
                        label="单笔积分上限"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {
                            getFieldDecorator(`pointLimitValue${recommendType}`, {
                                onChange: this.handleRecommendSettingsChange(index, 'pointLimitValue'),
                                initialValue: { number: eventRecommendSettings[index].pointLimitValue },
                                rules: [],
                            })(
                                <PriceInput
                                    addonAfter="分"
                                    placeholder="不填表示不限制"
                                    maxNum={6}
                                    modal="float"
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        )
    }
    renderRechargeReward = (recommendType) => {
        const {
            eventRecommendSettings,
        } = this.state;
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        const index = recommendType - 1;
        return (
            <div>
                <Row gutter={8}>
                    <Col span={10} offset={1}>
                        <FormItem
                            label="储值金额比例"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {
                                getFieldDecorator(`recharge${recommendType}`, {
                                    onChange: this.handleRecommendSettingsChange(index, 'rechargeRate'),
                                    initialValue: { number: eventRecommendSettings[index].rechargeRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (v.number === '' || v.number === undefined) {
                                                    return cb();
                                                }
                                                if (!v || !(v.number > 0)) {
                                                    return cb('储值金额比例必须大于0');
                                                } else if (v.number > 100) {
                                                    return cb('储值金额比例不能超过100%');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="%"
                                        maxNum={3}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                            label="单笔返利上限"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {
                                getFieldDecorator(`moneyLimitValue${recommendType}`, {
                                    onChange: this.handleRecommendSettingsChange(index, 'moneyLimitValue'),
                                    initialValue: { number: eventRecommendSettings[index].moneyLimitValue },
                                    rules: [],
                                })(
                                    <PriceInput
                                        addonAfter="元"
                                        placeholder="不填表示不限制"
                                        maxNum={6}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                {this.renderPointControl(recommendType, index)}
            </div>
        )
    }
    renderConsumptionReward = (recommendType) => {
        const {
            eventRecommendSettings,
        } = this.state;
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        const index = recommendType - 1;
        return (
            <div>
                <Row gutter={8}>
                    <Col span={10} offset={1}>
                        <FormItem
                            label="消费金额比例"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {
                                getFieldDecorator(`consumption${recommendType}`, {
                                    onChange: this.handleRecommendSettingsChange(index, 'consumeRate'),
                                    initialValue: { number: eventRecommendSettings[index].consumeRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (v.number === '' || v.number === undefined) {
                                                    return cb();
                                                }
                                                if (!v || !(v.number > 0)) {
                                                    return cb('消费金额比例必须大于0');
                                                } else if (v.number > 100) {
                                                    return cb('消费金额比例不能超过100%');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        addonAfter="%"
                                        maxNum={3}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                            label="单笔返利上限"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {
                                getFieldDecorator(`moneyLimitValue${recommendType}`, {
                                    onChange: this.handleRecommendSettingsChange(index, 'moneyLimitValue'),
                                    initialValue: { number: eventRecommendSettings[index].moneyLimitValue },
                                    rules: [],
                                })(
                                    <PriceInput
                                        addonAfter="元"
                                        placeholder="不填表示不限制"
                                        maxNum={6}
                                        modal="float"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>

                </Row>
                {this.renderPointControl(recommendType, index)}
                <FormItem
                    label="奖励范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 12 }}
                >
                    <Select
                        value={`${eventRecommendSettings[index].rewardRange}`}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleRecommendSettingsChange(index, 'rewardRange')}
                    >
                        <Select.Option value="0">仅会员现金卡值消费部分</Select.Option>
                        <Select.Option value="1">包含会员卡值的全部账单金额</Select.Option>
                        <Select.Option value="2">不包含会员卡值的账单金额</Select.Option>
                        <Select.Option value="3">仅账单实收金额</Select.Option>
                    </Select>
                </FormItem>
            </div>
        )
    }
    renderSaveMoneySetSelector() {
        const {
            saveMoneySetType,
        } = this.state;
        const saveMoneySetList = this.props.saveMoneySetList.toJS();
        return (
            <div>
                <FormItem
                    label="储值场景限制"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleSaveMoneySetTypeChange}
                        value={saveMoneySetType}
                    >
                        <Radio key={'0'} value={'0'}>所有储值场景</Radio>
                        <Radio key={'1'} value={'1'}>仅储值套餐</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    saveMoneySetType == 1 && (
                        <FormItem
                            label="储值套餐"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {
                                this.props.form.getFieldDecorator('saveMoneySetIds', {
                                    rules: [
                                        { required: true, message: '至少要选择一个储值套餐' }
                                    ],
                                    initialValue: this.state.saveMoneySetIds,
                                    onChange: this.handleSaveMoneySetIdsChange,
                                })(
                                    <Select
                                        showSearch={true}
                                        notFoundContent={'未搜索到结果'}
                                        multiple
                                        placeholder="请选择活动适用的储值套餐"
                                        getPopupContainer={(node) => node.parentNode}
                                    >
                                        {
                                            saveMoneySetList.map(set => (
                                                <Select.Option key={set.saveMoneySetID} value={set.saveMoneySetID}>
                                                    {set.setName}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    )
                }
            </div>
            
        )
    }
    renderRecommendGiftsDetail() {
        const recommendRange = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRange']);
        const recommendRule = this.props.specialPromotion.getIn(['$eventInfo', 'recommendRule']);
        let renderRecommentReward;
        switch (+recommendRule) {
            case 1: renderRecommentReward = this.renderRecommendGifts; break;
            case 2: renderRecommentReward = this.renderRechargeReward; break;
            case 3: renderRecommentReward = this.renderConsumptionReward; break;
            default: renderRecommentReward = this.renderRecommendGifts;
        };
        const { helpMessageArray } = this.state;
        return (
            <div>
                {recommendRule == 2 && this.renderSaveMoneySetSelector()}
                <p className={styles.coloredBorderedLabel}>
                    直接推荐人奖励： 
                    <span style={{color: '#f04134'}}>{helpMessageArray[0]}</span>
                </p>
                {renderRecommentReward(1)}
                {
                    recommendRange > 0 && (
                        <div>
                            <p className={styles.coloredBorderedLabel}>
                                间接推荐人奖励：
                                <span style={{color: '#f04134'}}>{helpMessageArray[1]}</span>
                            </p>
                            {renderRecommentReward(2)}
                        </div>
                    )
                }
                <p className={styles.coloredBorderedLabel}>
                    被推荐人奖励：
                    <Tooltip title="被推荐人在且仅在被邀请成为会员时可以领取一次被推荐人奖励。">
                        <Icon style={{ fontWeight: 'normal' }} type="question-circle" />
                    </Tooltip>
                </p>
                {this.renderRecommendGifts(0)}
            </div>
        )
    }
    renderAccumulateGiftsDetail() {
        const {
            giftGetRule,
            cleanCount,
            wakeupSendGiftsDataArray,
        } = this.state;
        const { isNew } = this.props;
        return (
            <div>
                <FormItem
                    label="礼品领取方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleGiftGetRuleChange}
                        value={giftGetRule}
                        disabled={!isNew}
                    >
                        <Radio key={'2'} value={2}>集满全部点数领取</Radio>
                        <Radio key={'3'} value={3}>阶梯点数领取</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    giftGetRule === 3 && (
                        <FormItem
                            label="阶梯礼品兑换后"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup
                                onChange={this.handleCleanCountChange}
                                value={cleanCount}
                                disabled={!isNew}
                            >
                                <Radio value={1}>扣减所用点数</Radio>
                                <Radio value={0}>不扣减所用点数</Radio>
                            </RadioGroup>
                        </FormItem>
                    )
                }
                {
                    giftGetRule === 2 ? (
                        <Row>
                            <Col span={17} offset={4}>
                                <AddGifts
                                    disabledGifts={!isNew}
                                    key={wakeupSendGiftsDataArray[0].key}
                                    maxCount={10}
                                    type={this.props.type}
                                    isNew={this.props.isNew}
                                    value={wakeupSendGiftsDataArray[0].gifts}
                                    onChange={(giftArr) => this.handleWakeupIntervalGiftsChange(giftArr, 0)}
                                />
                            </Col>
                        </Row>
                    ) : this.renderMultipleLevelGiftsDetail()
                }
            </div>
        )
    }
    getMultipleLevelValueLimit = () => {
        const { type, specialPromotion } = this.props;
        if (type == '75') {
            return specialPromotion.getIn(['$eventInfo', 'needCount'])
        }
    }
    renderMultipleLevelGiftsDetail() {
        const { wakeupSendGiftsDataArray } = this.state;
        const {
            form: {
                getFieldDecorator,
            },
            isNew,
            type,
        } = this.props;
        const disabledGifts = type == 75 && !isNew;
        const multiConfig = this.getMultipleLevelConfig();
        const userCount = this.props.specialPromotion.getIn(['$eventInfo', 'userCount']);
        return (
            <div>
                {
                    wakeupSendGiftsDataArray.map(({intervalDays, gifts, key}, index, arr) => (
                        <div key={`${key}`}>
                            <Row key={`${key}`}>
                                <Col span={4}>
                                    <div className={selfStyle.fakeLabel}>
                                        {`档位${index + 1}`}
                                    </div>
                                </Col>
                                <Col style={{ position: 'relative' }} span={17}>
                                <div className={selfStyle.grayHeader}>
                                {multiConfig.levelLabel}&nbsp;
                                <FormItem>
                                    {
                                        getFieldDecorator(`intervalDays${key}`, {
                                            onChange: ({number: val}) => this.handleIntervalDaysChange(val, index),
                                            initialValue: { number: intervalDays },
                                            rules: [
                                                {
                                                    validator: (rule, v, cb) => {
                                                        if (!v || !(v.number > 0)) {
                                                            return cb('必须大于0');
                                                        }
                                                        const limit = this.getMultipleLevelValueLimit();
                                                        if (limit && !(v.number <= limit)) {
                                                            return cb(`不能大于${limit}`);
                                                        }
                                                        if (limit && index === arr.length - 1 && v.number != limit) { // 最后一档必须填满限制
                                                            return cb(`最后一档必须等于${limit}`);
                                                        }
                                                        for (let i = 0; i < index; i++) {
                                                            const days = arr[i].intervalDays;
                                                            if (days > 0) {
                                                                // 档位设置不可以重叠
                                                                if (v.number <= +days) {
                                                                    return cb('档位数值需大于上一档位');
                                                                }
                                                            }
                                                        }
                                                        cb()
                                                    },
                                                },
                                            ],
                                        })(
                                            <PriceInput
                                                disabled={userCount > 0 || disabledGifts}
                                                maxNum={5}
                                                modal="int"
                                            />
                                        )
                                    }
                                </FormItem>
                                {multiConfig.levelAffix}
                                </div>
                                {
                                    (userCount > 0 || disabledGifts) ? null : (
                                        <div style={{
                                            position: 'absolute',
                                            width: 65,
                                            top: 10,
                                            right: -70,
                                        }}>
                                            {
                                                (index === arr.length - 1 && arr.length < 10) && (
                                                    <Icon
                                                        onClick={this.addInterval}
                                                        style={{ marginRight: 5 }}
                                                        className={styles.plusIcon}
                                                        type="plus-circle-o"
                                                    />
                                                )
                                            }
                                            {
                                                (arr.length > 1) && (
                                                    <Popconfirm title="确定要删除吗?" onConfirm={() => this.removeInterval(index)}>
                                                        <Icon
                                                            style={{ marginRight: 5 }}
                                                            className={styles.deleteIcon}
                                                            type="minus-circle-o"
                                                        />
                                                    </Popconfirm>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                </Col>        
                            </Row>
                            <Row>
                                <Col span={17} offset={4}>
                                    <AddGifts
                                        disabledGifts={disabledGifts}
                                        key={`${key}`}
                                        isAttached={true}
                                        maxCount={10}
                                        type={this.props.type}
                                        isNew={this.props.isNew}
                                        value={gifts}
                                        onChange={(giftArr) => this.handleWakeupIntervalGiftsChange(giftArr, index)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    ))
                }
            </div>
        )
    }
    render() {
        const { type } = this.props;
        if (type == '68') { // 推荐有礼的render与其它活动相差较大
            return this.renderRecommendGiftsDetail();
        }
        if (type == '63') { // 唤醒送礼，多个天数档位设置需要去重
            return this.renderMultipleLevelGiftsDetail();
        }
        if (type == '75') { // 集点卡 礼品逻辑
            return this.renderAccumulateGiftsDetail();
        }
        const userCount = this.props.specialPromotion.getIn(['$eventInfo', 'userCount']);
        return (
            <div >
                {type == '67' && this.renderInstantDiscountForm()}
                {
                    type == '65' && <p className={styles.coloredBorderedLabel}>邀请人礼品获得礼品列表：</p>
                }
                {
                    type == '66' && (
                        <FormItem
                            label="礼品领取方式"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup
                                onChange={this.handleGiftGetRuleChange}
                                value={this.state.giftGetRule}
                                disabled={userCount > 0}
                            >
                                <Radio key={'0'} value={0}>领取符合条件的最高档位礼品</Radio>
                                <Radio key={'1'} value={1}>领取符合条件的所有档位礼品</Radio>
                            </RadioGroup>
                        </FormItem>
                    )
                }
                <Row>
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount={type == '21' || type == '30' ? 1 : 10}
                            disabledGifts={type == '67' && this.state.disabledGifts}
                            type={this.props.type}
                            isNew={this.props.isNew}
                            value={
                                this.state.data
                                .filter(gift => gift.sendType === 0)
                                .sort((a, b) => a.needCount - b.needCount)
                            }
                            onChange={(gifts) => this.gradeChange(gifts, 0)}
                        />
                    </Col>
                </Row>
                {
                   type == '65' && <p className={styles.coloredBorderedLabel}>被邀请人礼品获得礼品列表：</p>
                }
                {
                    type == '65' && (
                        <Row>
                            <Col span={17} offset={4}>
                                <AddGifts
                                    maxCount={10}
                                    typeValue={1}
                                    type={type}
                                    isNew={this.props.isNew}
                                    value={this.state.data.filter(gift => gift.sendType === 1)}
                                    onChange={(gifts) => this.gradeChange(gifts, 1)}
                                />
                            </Col>
                        </Row>
                    )
                }
                {
                    shareInfoEnabledTypes.includes(`${type}`) && this.renderShareInfo()
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList'),
        groupCardTypeList: state.sale_mySpecialActivities_NEW
            .getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        saveMoneySetList: state.sale_mySpecialActivities_NEW.get('$saveMoneySetList'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
        setSpecialRecommendSettings: (opts) => {
            dispatch(saleCenterSetSpecialRecommendSettingsInfoAC(opts));
        },
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        queryAllSaveMoneySet: () => {
            dispatch(queryAllSaveMoneySet());
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
