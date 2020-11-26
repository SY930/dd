/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-23T17:02:39+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: returnGiftDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T22:47:55+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Icon, Popconfirm, Checkbox, message } from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import selfStyle from '../../SaleCenterNEW/returnGift/style.less';
import {axiosData} from "../../../helpers/util";
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import ReturnGift from '../../SaleCenterNEW/returnGift/returnGift'; // 可增删的输入框 组件
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import {injectIntl} from '../../SaleCenterNEW/IntlDecor';
import style from '../../SpecialPromotionNEW/shackGift/LotteryThirdStep.less';
import { STRING_SPE } from 'i18n/common/special';
import BaseForm from '../../../components/common/BaseForm';
import { addSpecialPromotion, updateSpecialPromotion, saleCenterLotteryLevelPrizeData, saleCenterSetSpecialBasicInfoAC, saleCenterSetSpecialGiftInfoAC, } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

const Immutable = require('immutable');
const moment = require('moment');

const type = [
    { value: '2', name: SALE_LABEL.k6d8n1ew },
    { value: '1', name: SALE_LABEL.k6d8n1n8 },
];
const showType = [
    { value: '4', name: '每日签到送礼'},
    { value: '5', name: '连续签到送礼' },
];
export const DEFAULT_GIFT_ITEM = {
    giftNum: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'error',
        msg: null,
    },
    // 使用张数
    giftMaxUseNum: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },
    giftValidType: '0',
    giftEffectiveTime: {
        value: 0,
        validateStatus: 'success',
        msg: null,
    },
    giftValidDays: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },
};
const DEFAULT_GIFT_STAGE = [
    {
        stageAmount: undefined,
        gifts: [
            JSON.parse(JSON.stringify(DEFAULT_GIFT_ITEM))
        ]
    }
];
@injectIntl()
class CheckInSecondStep extends React.Component {
    constructor(props) {
        super(props);
        const { parsedRule, data, simpleData, giftGetRule, resultFormData, showGiftTrue, changeFormKeysArr, showGift1 } = this.getInitState();
        this.state = {
            display: !props.isNew,
            rule: parsedRule,
            giftGetRule,
            data,
            simpleData,
            needSyncToAliPay: 0,
            weChatCouponList: [],
            formData: resultFormData,
            formKeys: [],
            cardTypeArr: [],
            showGift1: showGift1,
            showGift2: false,
            showGift3: false,
            showGift4: false,
            showGift5: false,
            showGift6: false,
            showGift7: false,
            showGift8: false,
            showGiftTrue: showGiftTrue,
            changeFormKeysArr: changeFormKeysArr,
        }
        this.baseForm1 = null;
        this.baseForm2 = null;
        this.baseForm3 = null;
        this.baseForm4 = null;
        this.baseForm5 = null;
        this.baseForm6 = null;
        this.baseForm7 = null;
        this.baseForm8 = null;
        this.handleFinish = this.handleFinish.bind(this);
        this.handlePre = this.handlePre.bind(this);
        this.formItems = [];
    }

    formBeginGetData = (giftList) => {
        let tempObj = {};
        giftList.forEach((item) => {
            if(tempObj[item.needCount]){
                if(tempObj[item.needCount][item.presentType]){
                    let athObj = {};
                    athObj = item;
                    tempObj[item.needCount][item.presentType].push(athObj);
                }else{
                    tempObj[item.needCount][item.presentType] = [];
                    let athObj = {};
                    athObj = item;
                    tempObj[item.needCount][item.presentType].push(athObj);
                }
            }else{
                tempObj[item.needCount] = {};
                tempObj[item.needCount][item.presentType] = [];
                let athObj = {};
                athObj = item;
                tempObj[item.needCount][item.presentType].push(athObj);
            }
        })
        return tempObj;
    }

    groupGiftsByStageAmount = (obj) => {
        let keyArr = Object.keys(obj);
        let resultArr = [];
        const formData = {};
        let tempShowGift = [];
        let tempKeysArr = [];
        keyArr.forEach((item, index) => {
            let EveryObj = {};
            let tempObj = obj[item];
            if(!tempObj[1]){
                //如果该档位没有礼品的数据则此档位上传空的礼品数据
                formData[`ifHaveGift${index+2}`] = [];
                EveryObj.stageAmount = item
                let tempGift = []
                let dataObj = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE))[0].gifts[0];
                tempGift.push(dataObj);
                EveryObj.gifts = tempGift;
            }else{
                //如果该档位有礼品的数据则此档位上传空的礼品数据，应该控制相应的表单展示和礼品展示（状态管理）
                EveryObj.stageAmount = item;
                let tempGift = [];
                let tempVar = `baseForm${index + 2}`;
                //选择相应的表单展示
                formData[`ifHaveGift${index+2}`] = ['1'];
                //更改相应的表单隐藏state;
                tempShowGift.push([`showGift${index + 2}`]);
                tempObj[1].forEach((item) => {

                    let dataObj = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE))[0].gifts[0];
                    // tempObj.sortIndex = index+1;
                    //     tempObj.presentType = 1;
                    //     tempObj.effectType = giftItem.giftValidType == 1 ? 2 : giftItem.giftValidType == 2 ? 3 : 1;
                    //     if(tempObj.effectType != 2){
                    //         tempObj.giftEffectTimeHours = giftItem.giftEffectiveTime.value;
                    //     } else {
                    //         tempObj.effectTime = giftItem.giftEffectiveTime.value[0].format('YYYYMMDD');;
                    //         tempObj.validUntilDate = giftItem.giftEffectiveTime.value[1].format('YYYYMMDD');;
                    //     }
                    //     tempObj.giftValidUntilDayCount = giftItem.giftValidDays.value;
                    //     tempObj.giftID = giftItem.giftInfo.giftItemID;
                    //     tempObj.needCount = stageAmount;
                    //     tempData.push(tempObj);
                    dataObj.giftNum.value = item.giftCount;
                    dataObj.giftMaxUseNum.value = item.giftMaxUseNum || 1;
                    dataObj.giftInfo.giftName = item.giftName;
                    dataObj.giftInfo.giftItemID = item.giftID;
                    dataObj.giftInfo.msg = null;
                    dataObj.giftInfo.validateStatus = 'success';
                    dataObj.giftInfo.giftType = item.giftType || null;
                    dataObj.giftInfo.giftValue = item.giftValue || null;
                    dataObj.giftValidDays.value = item.giftValidUntilDayCount || '0';
                    dataObj.giftValidType = item.effectType == 2 ? 1 :  item.effectType == 3 ? 2 : 0;
                    if(item.effectType == 2) {
                        dataObj.giftEffectiveTime.value = [];
                        dataObj.giftEffectiveTime.value[0] = moment(item.effectTime, 'YYYYMMDD');
                        dataObj.giftEffectiveTime.value[1] = moment(item.validUntilDate, 'YYYYMMDD');
                    }else{
                        dataObj.giftEffectiveTime.value = item.effectType != '2' ? item.giftEffectTimeHours
                        : [moment(item.effectTime, 'YYYYMMDD'), moment(item.validUntilDate, 'YYYYMMDD')]; 
                    }
                    //整合每一个gifts数组中的data数据
                    tempGift.push(dataObj);
                })
                EveryObj.gifts = tempGift;
            }
            if(!tempObj[2]){
                //证明此档位没有勾选赠送积分
                formData[`ifGivePoints${index+2}`] = [];
            }else {
                formData[`ifGivePoints${index+2}`] = ['1'];
                formData[`presentValue${index+2}`] = tempObj[2][0].presentValue;
                formData[`cardTypeID${index+2}`] = tempObj[2][0].cardTypeID;
                let athObj = {};
                athObj[`formKeys${index+2}`] = [`ifGivePoints${index+2}`, `presentValue${index+2}`, `cardTypeID${index+2}`, `ifHaveGift${index+2}`]
                tempKeysArr.push(athObj)
            }
            resultArr.push(EveryObj);
        })
        return {resultArr, formData, tempShowGift, tempKeysArr};
    }

    groupSimpleGiftsByStageAmount = (obj) => {
        let keyArr = Object.keys(obj);
        let resultArr = [];
        const formData = {};
        let tempShowGift = [];
        let tempKeysArr = [];
        keyArr.forEach((item, index) => {
            let EveryObj = {};
            let tempObj = obj[item];
            if(!tempObj[1]){
                //如果该档位没有礼品的数据则此档位上传空的礼品数据
                formData[`ifHaveGift1`] = [];
                EveryObj.stageAmount = item
                let tempGift = []
                let dataObj = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE))[0].gifts[0];
                tempGift.push(dataObj);
                EveryObj.gifts = tempGift;
            }else{
                //如果该档位有礼品的数据则此档位上传空的礼品数据，应该控制相应的表单展示和礼品展示（状态管理）
                EveryObj.stageAmount = item;
                let tempGift = [];
                let tempVar = `baseForm1`;
                //选择相应的表单展示
                formData[`ifHaveGift1`] = ['1'];
                //更改相应的表单隐藏state;
                tempShowGift.push([`showGift1`]);
                tempObj[1].forEach((item) => {
                    let dataObj = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE))[0].gifts[0];
                    dataObj.giftNum.value = item.giftCount;
                    dataObj.giftMaxUseNum.value = item.giftMaxUseNum || 1;
                    dataObj.giftInfo.giftName = item.giftName;
                    dataObj.giftInfo.giftItemID = item.giftID;
                    dataObj.giftInfo.msg = null;
                    dataObj.giftInfo.validateStatus = 'success';
                    dataObj.giftInfo.giftType = item.giftType || null;
                    dataObj.giftInfo.giftValue = item.giftValue || null;
                    dataObj.giftValidDays.value = item.giftValidUntilDayCount || '0';
                    dataObj.giftValidType = item.effectType == 2 ? 1 :  item.effectType == 3 ? 2 : 0;
                    if(item.effectType == 2) {
                        dataObj.giftEffectiveTime.value = [];
                        dataObj.giftEffectiveTime.value[0] = moment(item.effectTime, 'YYYYMMDD');
                        dataObj.giftEffectiveTime.value[1] = moment(item.validUntilDate, 'YYYYMMDD');
                    }else{
                        dataObj.giftEffectiveTime.value = item.giftEffectTimeHours;
                    }
                    //整合每一个gifts数组中的data数据
                    tempGift.push(dataObj);
                })
                EveryObj.gifts = tempGift;
            }
            if(!tempObj[2]){
                //证明此档位没有勾选赠送积分
                formData[`ifGivePoints1`] = [];
            }else {
                formData[`ifGivePoints1`] = ['1'];
                formData[`presentValue1`] = tempObj[2][0].presentValue;
                formData[`cardTypeID1`] = tempObj[2][0].cardTypeID;
                let athObj = {};
                athObj[`formKeys1`] = [`ifGivePoints1`, `presentValue1`, `cardTypeID1`, `ifHaveGift1`]
                tempKeysArr.push(athObj)
            }
            resultArr.push(EveryObj);
        })
        return {resultArr, formData, tempShowGift, tempKeysArr};
    }

    getInitState = () => {
        const $rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const stageType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule', 'stageType']);
        const $giftList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'giftList'], Immutable.fromJS([]));
        const specialPromotion = this.props.specialPromotion.toJS();
        const eventInfo = specialPromotion.$eventInfo;
        const giftInfo = specialPromotion.$giftInfo;
        let showGift1 = false;
        let resultFormData = {}
        let showGiftTrue = [];
        let changeFormKeysArr = [];
        let parsedRule;
        let data = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
        let simpleData;
        let giftGetRule = eventInfo.giftGetRule ? eventInfo.giftGetRule + '' : '4';
        if (stageType) {
            parsedRule = {
                stageType,
                giftGetRule: eventInfo.giftGetRule ? eventInfo.giftGetRule + '' : '5',
                printCode: $rule.get('printCode') || 0,
            }
        } else {
            parsedRule = {
                stageType: '2',
                giftGetRule: '4',
                printCode: 0,
            }
        }
        if (giftInfo.length > 0) {
            var beginObj = this.formBeginGetData(giftInfo);
            if(giftGetRule == 4){
                //先根据giftInfo来写出simpleData的结构
                const { resultArr } = this.groupSimpleGiftsByStageAmount(beginObj);
                simpleData = resultArr;
                const { formData } = this.groupSimpleGiftsByStageAmount(beginObj);
                resultFormData = formData;
                const { tempShowGift } = this.groupSimpleGiftsByStageAmount(beginObj);
                showGiftTrue = tempShowGift;
                const { tempKeysArr } = this.groupSimpleGiftsByStageAmount(beginObj);
                changeFormKeysArr = tempKeysArr;
            }else{
                //先根据giftInfo来写出data的结构
                const { resultArr } = this.groupGiftsByStageAmount(beginObj);
                data = resultArr;
                const { formData } = this.groupGiftsByStageAmount(beginObj);
                resultFormData = formData;
                const { tempShowGift } = this.groupGiftsByStageAmount(beginObj);
                showGiftTrue = tempShowGift;
                const { tempKeysArr } = this.groupGiftsByStageAmount(beginObj);
                changeFormKeysArr = tempKeysArr;
            }   
        }
        if (data.length === 0) {
            data = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
        }       
        if(this.props.isNew){
            simpleData = JSON.parse(JSON.stringify(data));
            resultFormData.ifHaveGift1 = ['1'];
            for(let i = 0; i < 7; i++) {
                resultFormData[`ifHaveGift${i + 2}`] = ['1'];
            }
            showGift1 = true;
        }
        if( giftGetRule == 5 ) {
            simpleData = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
            resultFormData.ifHaveGift1 = ['1'];
            // for(let i = 0; i < 7; i++) {
            //     resultFormData[`ifHaveGift${i + 2}`] = ['1'];
            // }
            showGift1 = true;
        }else{
            for(let i = 0; i < 7; i++) {
                resultFormData[`ifHaveGift${i + 2}`] = ['1'];
            }
        }   
        return {
            parsedRule, data, simpleData, giftGetRule, resultFormData, showGiftTrue, changeFormKeysArr, showGift1
        }
    }

    componentDidMount() {
        this.initFormKeys();
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleFinish,
            finish: undefined,
            cancel: undefined,
        });
        this.props.fetchGiftListInfo({
            groupID: this.props.user.accountInfo.groupID,
        });
        this.queryWeChatCouponList();
        let opts = {
            groupID: this.props.user.accountInfo.groupID,
        }
        axiosData(
            '/crm/cardTypeLevelService_queryCardTypeBaseInfoList.ajax',
            { ...opts, isNeedWechatCardTypeInfo: true },
            null,
            {path: 'data.cardTypeBaseInfoList',}
        ).then((records) => {
            let tempArr = records || [];
            let resultArr = [];
            tempArr.forEach((item) => {
                resultArr.push({ value: item.cardTypeID, label: item.cardTypeName})
            })
            this.setState({
                cardTypeArr: resultArr
            }, () => {
                this.initFormItems();
            })
        });
        const { showGiftTrue, changeFormKeysArr } = this.state;
        showGiftTrue.forEach((item) => {
            let tempObj = {};
            tempObj[item] = true;
            this.setState(tempObj);
        })
        changeFormKeysArr.forEach((item) => {
            let tempObj = {};
            tempObj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
            this.setState(tempObj);
        })
    }

    initFormItems = () => {
        const tempObj = {};
        for(let i = 1; i < 9; i++){
            tempObj[`ifGivePoints${i}`] = {
                label: ``,
                type: 'checkbox',
                defaultValue: [],
                disabled: this.props.disabled,
                options: [
                    { label: `${this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}`, value: '1' },
                ]
            }
            tempObj[`presentValue${i}`] = {
                label: `${this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}`,
                type: 'text',
                surfix: '积分',
                disabled: this.props.disabled,
                defaultValue: '',
                rules: [
                    {
                        required: true,
                        message: '赠送积分为必填项',
                    },
                    // {
                    //     message: `${this.props.intl.formatMessage(STRING_SPE.d2b1c7560ae71124)}`,
                    //     pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
                    // }, 
                    {
                        pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
                        message: "请输入1~1000000数字，支持两位小数"
                    }],
                labelCol: { span: 5 },
                wrapperCol: { span: 10 },
            }
            tempObj[`cardTypeID${i}`] = {
                label: `${this.props.intl.formatMessage(STRING_SPE.d2b1c76536683246)}`,
                type: 'combo',
                defaultValue: this.state.cardTypeArr[0] ? this.state.cardTypeArr[0].value : '',
                options: this.state.cardTypeArr,
                disabled: this.props.disabled,
                rules: [{
                        message: `${this.props.intl.formatMessage(STRING_SPE.d2b1c7560ae71124)}`,
                        pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
                    }],
                labelCol: { span: 5 },
                wrapperCol: { span: 10 },
            }
            tempObj[`ifHaveGift${i}`] = {
                label: ``,
                type: 'checkbox',
                defaultValue: [],
                disabled: this.props.disabled,
                options: [
                    { label: `${this.props.intl.formatMessage(STRING_SPE.dd5aa6c59a74233)}`, value: '1' },
                ]
            }

            
        }
        this.formItems = tempObj;
    }
    initFormKeys = () => {
        this.setState({
            formKeys1: ['ifGivePoints1','ifHaveGift1'],
            formKeys2: ['ifGivePoints2','ifHaveGift2'],
            formKeys3: ['ifGivePoints3','ifHaveGift3'],
            formKeys4: ['ifGivePoints4','ifHaveGift4'],
            formKeys5: ['ifGivePoints5','ifHaveGift5'],
            formKeys6: ['ifGivePoints6','ifHaveGift6'],
            formKeys7: ['ifGivePoints7','ifHaveGift7'],
            formKeys8: ['ifGivePoints8','ifHaveGift8'],
        })
    }

    queryWeChatCouponList = () => {
        const groupID = this.props.user.accountInfo.groupID
        axiosData(
            `/payCoupon/getPayCouponBatchList?groupID=${groupID}`,
            {},
            {},
            { path: 'payCouponInfos' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({
                weChatCouponList: Array.isArray(res) ?
                    res.map(item => ({
                        ...item,
                        giftType: '112',
                        giftName: item.couponName,
                        giftItemID: item.itemID,
                        giftValue: item.couponValue / 100
                    })) : []
            })
        }).catch(e => {
        })
    }

    getFinalGiftList = (giftList) => {
        return giftList.map((item, index) => {
            if (item.giftInfo.giftType == '112') {
                return {
                    stageAmount: item.stageAmount,
                    giftValidType: '0',
                    giftValidDays: 1,
                    giftEffectiveTime: 0,
                    giftNum: item.giftNum.value,
                    giftMaxUseNum: item.giftMaxUseNum.value,
                    giftName: item.giftInfo.giftName,
                    giftItemID: item.giftInfo.giftItemID,
                    giftType: item.giftInfo.giftType,
                    freeCashVoucherValue: item.giftInfo.giftValue
                }
            }
            if (item.giftValidType == '0') {
                return {
                    stageAmount: item.stageAmount,
                    giftValidType: item.giftValidType,
                    giftMaxUseNum: item.giftMaxUseNum.value,
                    giftValidDays: item.giftValidDays.value,
                    giftEffectiveTime: (item.giftEffectiveTime.value || 0) * 60,
                    giftNum: item.giftNum.value,
                    giftName: item.giftInfo.giftName,
                    giftItemID: item.giftInfo.giftItemID,
                }
            } else if (item.giftValidType == '2') {
                return {
                    stageAmount: item.stageAmount,
                    giftValidType: item.giftValidType,
                    giftValidDays: item.giftValidDays.value,
                    giftEffectiveTime: item.giftEffectiveTime.value,
                    giftNum: item.giftNum.value,
                    giftMaxUseNum: item.giftMaxUseNum.value,
                    giftName: item.giftInfo.giftName,
                    giftItemID: item.giftInfo.giftItemID,
                }
            }
            const range = item.giftEffectiveTime;
            return {
                stageAmount: item.stageAmount,
                giftValidType: item.giftValidType,
                giftStartTime: range.value[0] ? parseInt(range.value[0].format('YYYYMMDD') + '000000') : '',
                giftEndTime: range.value[1] ? parseInt(range.value[1].format('YYYYMMDD') + '235959') : '',
                giftNum: item.giftNum.value,
                giftMaxUseNum: item.giftMaxUseNum.value,
                giftName: item.giftInfo.giftName,
                giftItemID: item.giftInfo.giftItemID,
            }
        })
    }
    handleValidForm = () => {
        if(this.state.giftGetRule == 4){
            let flag = true;
            this.baseForm1.validateFieldsAndScroll((error, basicValues) => {
                if (error) {
                    flag = false;
                }
                if(basicValues[`ifGivePoints1`].length == 0 && basicValues[`ifHaveGift1`].length == 0 ){
                    message.error('赠送积分和赠送礼品券表项中必须选择一个');
                    flag = false;
                }
            });
            return flag;
        }
        if(this.state.giftGetRule == 5){
            let baseStr = 'baseForm';
            let flag = true;
            for(let i = 0; i <this.state.data.length; i++){
                this[`${baseStr}${i + 2}`].validateFieldsAndScroll((error, basicValues) => {
                    if (error) {
                        flag = false;
                    }
                    if(basicValues[`ifGivePoints${i+2}`].length == 0 && basicValues[`ifHaveGift${i+2}`].length == 0 ){
                        message.error('赠送积分和赠送礼品券表项中必须选择一个');
                        flag = false;
                    }
                });
            }
            return flag;
        }
        

    }

    handleFinish() {
        let formFlag = true;
        formFlag = this.handleValidForm()
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                formFlag = false;
            }
        });
        if (!formFlag) return;
        const { rule, needSyncToAliPay, data, simpleData } = this.state;
        let giftList = [];
        let validateFlag = true;
        // FIXME: 这个校验在不人为输入(触发相应onChange)时等于无效, 比如编辑时直接下一步下一步保存时, 如果产品要求, 可以改掉
        if(this.state.giftGetRule == 5){
            giftList = data.reduce((acc, curr, index) => {
                acc.push(...curr.gifts.map(item => ({...item, stageAmount: curr.stageAmount, giftIndex: index,})));
                return acc;
            }, [])
            validateFlag = giftList.reduce((p, ruleInfo, index) => {
                const _validStatusOfCurrentIndex = Object.keys(ruleInfo)
                    .reduce((flag, key) => {
                        if (key === 'giftMaxUseNum' && this.state.rule.stageType == 2) return flag;
                        if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')) {
                            if(this[`baseForm${ruleInfo.giftIndex+2}`].getFieldValue(`ifHaveGift${ruleInfo.giftIndex+2}`).length){
                                const _valid = ruleInfo[key].validateStatus === 'success';
                                return flag && _valid;
                            }else{
                                return flag;
                            }
                        }
                        return flag
                    }, true);
                return p && _validStatusOfCurrentIndex;
            }, true);
        }else {
            giftList = simpleData.reduce((acc, curr, index) => {
                acc.push(...curr.gifts.map(item => ({...item, stageAmount: curr.stageAmount, giftIndex: index})));
                return acc;
            }, [])
            validateFlag = giftList.reduce((p, ruleInfo, index) => {
                const _validStatusOfCurrentIndex = Object.keys(ruleInfo)
                    .reduce((flag, key) => {
                        if (key === 'giftMaxUseNum' && this.state.rule.stageType == 2) return flag;
                        if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')) {
                            if(this[`baseForm1`].getFieldValue(`ifHaveGift1`).length){
                                const _valid = ruleInfo[key].validateStatus === 'success';
                                return flag && _valid;
                            }
                        }
                        return flag
                    }, true);
                return p && _validStatusOfCurrentIndex;
            }, true);
        } 
        let giftGetRule = this.state.giftGetRule;
        let gifts = this.gatherGiftsInfo(giftGetRule);
        let athNeedCount = giftGetRule == 4 ? 1 : gifts[gifts.length - 1].needCount;
        if (validateFlag) {
            this.props.setSpecialBasicInfo({
                giftGetRule,
                needCount: athNeedCount,
            })
            this.props.setSpecialGiftInfo(gifts);
            this.props.setPromotionDetail({
                rule: this.state.rule,
                giftList: this.getFinalGiftList(giftList),
                needSyncToAliPay,
                giftGetRule,
            });
            return true;
        }
        return false;
    }

    gatherGiftsInfo = (type) => {
        let giftData = [];
        const tempData = [];
        if(type == 4) {
            giftData = this.state.simpleData;
            if(this.baseForm1.getFieldValue('ifHaveGift1').length){
                giftData[0].gifts.forEach((giftItem) => {
                    let tempObj = {};
                    tempObj.sortIndex = 1;
                    tempObj.presentType = 1;
                    tempObj.effectType = giftItem.giftValidType == 1 ? 2 : giftItem.giftValidType == 2 ? 3 : 1;
                    if(tempObj.effectType != 2){
                        tempObj.giftEffectTimeHours = giftItem.giftEffectiveTime.value;
                    } else {
                        tempObj.effectTime = giftItem.giftEffectiveTime.value[0].format('YYYYMMDD');;
                        tempObj.validUntilDate = giftItem.giftEffectiveTime.value[1].format('YYYYMMDD');;
                    }
                    tempObj.giftValidUntilDayCount = giftItem.giftValidDays.value;
                    tempObj.giftID = giftItem.giftInfo.giftItemID;
                    tempObj.giftCount = giftItem.giftNum.value;
                    tempObj.needCount = 1;
                    tempData.push(tempObj);
                })
            } 
            if(this.baseForm1.getFieldValue('ifGivePoints1').length) {
                let tempObj = {};
                tempObj.presentType = 2;
                tempObj.sortIndex = 1;
                tempObj.presentValue = this.baseForm1.getFieldValue('presentValue1');
                tempObj.cardTypeID = this.baseForm1.getFieldValue('cardTypeID1');
                tempObj.needCount = 1;
                tempData.push(tempObj)
            } 
        }else{
            giftData = this.state.data;
            giftData.forEach(({stageAmount, gifts}, index) => {
                if(this[`baseForm${index+2}`].getFieldValue(`ifHaveGift${index+2}`).length){
                    gifts.forEach((giftItem) => {
                        let tempObj = {};
                        tempObj.sortIndex = index+1;
                        tempObj.presentType = 1;
                        tempObj.effectType = giftItem.giftValidType == 1 ? 2 : giftItem.giftValidType == 2 ? 3 : 1;
                        if(tempObj.effectType != 2){
                            tempObj.giftEffectTimeHours = giftItem.giftEffectiveTime.value;
                        } else {
                            tempObj.effectTime = giftItem.giftEffectiveTime.value[0].format('YYYYMMDD');;
                            tempObj.validUntilDate = giftItem.giftEffectiveTime.value[1].format('YYYYMMDD');;
                        }
                        tempObj.giftValidUntilDayCount = giftItem.giftValidDays.value;
                        tempObj.giftID = giftItem.giftInfo.giftItemID;
                        tempObj.giftCount = giftItem.giftNum.value;
                        tempObj.needCount = stageAmount;
                        tempData.push(tempObj);
                    })
                } 
                if(this[`baseForm${index+2}`].getFieldValue(`ifGivePoints${index+2}`).length) {
                    let tempObj = {};
                    tempObj.presentType = 2;
                    tempObj.sortIndex = index+1;
                    tempObj.presentValue = this[`baseForm${index+2}`].getFieldValue(`presentValue${index+2}`);
                    tempObj.cardTypeID = this[`baseForm${index+2}`].getFieldValue(`cardTypeID${index+2}`);
                    tempObj.needCount = stageAmount;
                    tempData.push(tempObj)
                } 
            })
        }
        return tempData      
    }

    handlePre() {
        return true;
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    handleStageChange = (val, index) => {
        const { data } = this.state;
        data[index].gifts = val;
        this.setState({data});
    }
    handleSimpleStageChange = (val, index) => {
        const { simpleData } = this.state;
        simpleData[index].gifts = val;
        this.setState({simpleData});
    }
    removeStage = (index) => {
        const { data } = this.state;
        const { disabled } = this.props;
        if(disabled){
            return;
        }
        if (data.length > 1) {
            data.splice(index, 1)
            this.setState({data});
        }
    }
    removeSimpleStage = (index) => {
        const { simpleData } = this.state;
        if (simpleData.length > 1) {
            simpleData.splice(index, 1)
            this.setState({simpleData});
        }
    }
    addStage = () => {
        const { data } = this.state;
        const { disabled } = this.props;
        if(disabled){
            return;
        }
        data.push(...JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE)));
        this.setState({data})
    }
    addSimpleStage = () => {
        const { simpleData } = this.state;
        simpleData.push(...JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE)));
        this.setState({simpleData})
    }
    handleStageAmountChange = (val, index) => {
        const { data } = this.state;
        data[index].stageAmount = val.number;
        this.setState({
            data,
        });
        for (let i = 0; i < data.length; i++) {
            if (i !== index) {
                const value = data[i].stageAmount
                this.props.form.setFields({
                    [`stageAmount${i}`]: {value: {number: value}}
                })
            }
        }
    }
    handleSimpleStageAmountChange = (val, index) => {
        const { simpleData } = this.state;
        simpleData[index].stageAmount = val.number;
        this.setState({
            simpleData,
        });
        for (let i = 0; i < simpleData.length; i++) {
            if (i !== index) {
                const value = simpleData[i].stageAmount
                this.props.form.setFields({
                    [`stageAmount${i}`]: {value: {number: value}}
                })
            }
        }
    }


    renderPromotionRule() {
        return (
            <div>
                <FormItem
                    label='活动规则'
                    className={styles.FormItemStyle}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.giftGetRule}
                        onChange={(e) => {
                            const giftGetRule = e.target.value;
                            this.setState({ giftGetRule });
                        }}
                        disabled={this.props.disabled}
                    >
                        {showType
                            .map((type) => {
                                return <Radio key={type.value} value={type.value}>{type.name}</Radio >
                            })}
                    </RadioGroup >
                </FormItem>
                {this.state.giftGetRule == 4 ? this.renderSimpleRule() : this.renderRuleDetail()}
            </div>
        )
    }
    renderSimpleRule() {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5f4b1b9 = intl.formatMessage(SALE_STRING.k5f4b1b9);
        const k67g8n9n = intl.formatMessage(SALE_STRING.k67g8n9n);
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        const isMultiple = this.state.rule.stageType == 1;
        const { formData, formKeys1 } = this.state;
        return (
            <Row>
                <Col span={2}>
                </Col>
                <Col span={22}>
                    <BaseForm
                        getForm={form => this.baseForm1 = form}
                        getRefs={refs => this.refMap = refs}
                        formItems={this.formItems}
                        formData={formData}
                        formKeys={formKeys1}
                        onChange={(key, value) => this.handleFormChange(key, value)}
                        disabled={this.props.disabled}
                    />
                </Col>  
                {this.state.simpleData.map(({stageAmount, gifts}, index, arr) => {
                    if(this.state.showGift1){
                        return(
                            <div>
                                <Col span={2}>
                                </Col>
                                <Col span={18}>
                                    <ReturnGift
                                        key={`${index}`}
                                        weChatCouponList={this.state.weChatCouponList}
                                        isMultiple={isMultiple}
                                        value={gifts}
                                        maxAddGift={10}
                                        onChange={(val) => this.handleSimpleStageChange(val, index)}
                                        filterOffLine={this.state.rule.gainCodeMode != '0'}
                                        ifExcludeWechat={true}
                                        disabled={this.props.disabled}
                                    />
                                </Col>
                            </div>
                        )
                    } else {
                        return null;
                    }
                    })}
            </Row>
        )
    }
    handleFormChange = (key, value) => {
        const PrimeKey = key.substring(0, key.length-1);
        const whichNum = key.substring(key.length-1);
        switch(PrimeKey){
            case 'ifGivePoints':
                this.chageGivePoints(key, whichNum, value);
                return;
            case 'ifHaveGift':
                this.chageHaveGift(key, whichNum, value);
        }
    }
    chageGivePoints = (key, num, value) => {
        if(value.length){
            let tempStr = `formKeys${num}`;
            let tempArr = this.state[tempStr];
            tempArr.splice(tempArr.indexOf(key)+1, 0, `cardTypeID${num}`);
            tempArr.splice(tempArr.indexOf(key)+1, 0, `presentValue${num}`);
            this.setState({
                [tempStr]: tempArr
            })   
        }else{
            let tempStr = `formKeys${num}`;
            let tempArr = Array.from(new Set(this.state[tempStr]));
            if(tempArr.indexOf(`cardTypeID${num}`) != -1){
                tempArr.splice(tempArr.indexOf(`cardTypeID${num}`), 1);
                tempArr.splice(tempArr.indexOf(`presentValue${num}`), 1);
            }
            this.setState({
                [tempStr]: tempArr
            }) 
        }
    }
    chageHaveGift = (key, num, value) => {
        let tempShowGift = `showGift${num}`;
        if(value.length){
            this.setState({
                [tempShowGift]: true,
            })
        }else{
            this.setState({
                [tempShowGift]: false,
            })
        }
    }
    renderRuleDetail() {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5f4b1b9 = intl.formatMessage(SALE_STRING.k5f4b1b9);
        const k67g8n9n = intl.formatMessage(SALE_STRING.k67g8n9n);
        const {
            form: {
                getFieldDecorator,
            },
        } = this.props;
        const isMultiple = this.state.rule.stageType == 1;
        const { formData, formKeys2,  formKeys3, formKeys4, formKeys5, formKeys6, formKeys7, formKeys8} = this.state;
        return (
            this.state.data.map(({stageAmount, gifts}, index, arr) => {
                return(
                    <Row key={`${index}`}>
                        <Col span={3}>
                            {
                                !isMultiple && (
                                    <div className={selfStyle.fakeLabel}>
                                        {SALE_LABEL.k6d8n0y8}{`${index + 1}`}
                                    </div>
                                )
                            }
                        </Col>
                        <Col span={19} style={{border: '1px solid #d9d9d9', marginTop: 15}}>
    
                                    <div className={isMultiple ? selfStyle.emptyHeader : selfStyle.grayHeader} style={{border: 'none'}}>
                                        连续签到&nbsp;
                                        <FormItem>
                                            {
                                                getFieldDecorator(`stageAmount${index}`, {
                                                    initialValue: {number: stageAmount},
                                                    onChange: (val) => this.handleStageAmountChange(val, index),
                                                    rules: [
                                                        {
                                                            validator: (rule, v, cb) => {
                                                                if (!(v.number > 0 && v.number < 8 ) || (v.number % 1 !== 0)) {
                                                                    return cb('天数为1到7的整数')
                                                                }
                                                                for (let i = 0; i < index; i ++) {
                                                                    if (arr[i].stageAmount >= +v.number) {
                                                                        return cb('必须大于前一档位的天数,小于后一档的天数')  
                                                                    }
                                                                }
                                                                cb()
                                                            }
                                                        },
                                                    ],
                                                })(<PriceInput disabled={this.props.disabled} style={{ width: 100 }} modal="float" maxNum={6} />)
                                            }
                                        </FormItem>
                                        &nbsp;天，赠送以下礼品：
                                    </div>
                            <Row>
                                <Col span={1}>
                                </Col>
                                <Col span={22}>
                                    <BaseForm
                                        getForm={form => this[`baseForm${index + 2}`] = form}
                                        getRefs={refs => this.refMap = refs}
                                        formItems={this.formItems}
                                        formData={formData}
                                        formKeys={this.state[`formKeys${index+2}`]}
                                        onChange={(key, value) => this.handleFormChange(key, value)}
                                    />
                                    {
                                        this.state[`showGift${index+2}`] ? 
                                            <ReturnGift
                                            key={`${index}`}
                                            weChatCouponList={this.state.weChatCouponList}
                                            isMultiple={isMultiple}
                                            maxAddGift={50}
                                            value={gifts}
                                            onChange={(val) => this.handleStageChange(val, index)}
                                            filterOffLine={this.state.rule.gainCodeMode != '0'}
                                            ifExcludeWechat={true}
                                            disabled={this.props.disabled}
                                        /> : null
                                    }      
                                </Col>
                            </Row>
                        </Col>
                        <Col span={2}>
                            {
                                (!isMultiple) && (
                                    <div className={selfStyle.buttonArea}>
                                        {
                                            (arr.length < 7 && index === arr.length - 1) && (
                                                <Icon
                                                    onClick={this.addStage}
                                                    style={{ marginBottom: 10 }}
                                                    className={selfStyle.plusIcon}
                                                    type="plus-circle-o"
                                                    style={{ cursor: this.props.disabled ? 'not-allowed' : 'pointer'}}
                                                />
                                            )
                                        }
                                        {
                                            this.props.disabled ? 
                                            (arr.length > 1) && (
                                                    <Icon
                                                        className={selfStyle.deleteIcon}
                                                        type="minus-circle-o"
                                                        style={{ cursor: this.props.disabled ? 'not-allowed' : 'pointer'}}
                                                    />
                                            ) :
                                            (arr.length > 1) && (
                                                <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.removeStage(index)} disabled={this.props.disabled}>
                                                    <Icon
                                                        className={selfStyle.deleteIcon}
                                                        type="minus-circle-o"
                                                        disabled={this.props.disabled}
                                                    />
                                                </Popconfirm>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
    
                )
            }
            )

        )
    }
    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        disabled: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'userCount']) > 0,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(CheckInSecondStep));
