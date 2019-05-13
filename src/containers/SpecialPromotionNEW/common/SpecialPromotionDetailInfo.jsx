/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:52:34+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

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
} from 'antd';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import AddGifts from '../common/AddGifts';
import ENV from "../../../helpers/env";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { doRedirect } from '../../../../src/helpers/util';
const moment = require('moment');
const FormItem = Form.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const getDefaultGiftData = (sendType = 0) => ({
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
    sendType,
})

const shareInfoEnabledTypes = [
    '65',
    '66',
]

class SpecialDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        const { data } = this.initState();
        const selectedMpId = props.specialPromotion.getIn(['$eventInfo', 'mpIDList', '0']);
        const discountRatio = props.specialPromotion.getIn(['$eventInfo', 'discountRate']);
        const discountMinRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMinRate']);
        const discountMaxRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMaxRate']);
        const discountMaxLimitRatio = props.specialPromotion.getIn(['$eventInfo', 'discountMaxLimitRate']);
        const defaultCardType = props.specialPromotion.getIn(['$eventInfo', 'defaultCardType']);
        this.state = {
            data,
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
            discountRate: discountRatio ? discountRatio * 100 : discountRatio,
            discountMinRate: discountMinRatio ? discountMinRatio * 100 : discountMinRatio,
            discountMaxRate: discountMaxRatio ? discountMaxRatio * 100 : discountMaxRatio,
            discountMaxLimitRate: discountMaxLimitRatio ? discountMaxLimitRatio * 100 : discountMaxLimitRatio,
            inviteType: props.specialPromotion.getIn(['$eventInfo', 'inviteType']) || 0,
            defaultCardType: defaultCardType > 0 ? defaultCardType : undefined,
            mpIDList: selectedMpId ? [ selectedMpId ] : [],
            disabledGifts: props.isNew ? false : this.props.specialPromotion.get('$giftInfo').size === 0,
            /** 桌边砍相关结束 */
        }
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: this.handlePrev,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        this.props.fetchGiftListInfo();
        if (this.props.type == 67) {
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
    }

    initiateDefaultGifts = () => {
        const type = `${this.props.type}`;
        switch (type) {
            /** 分享裂变有邀请人和被邀请人两种类型的礼品 */
            case '65': return [getDefaultGiftData(), getDefaultGiftData(1)];
            /** 膨胀大礼包固定3个礼品，不加减数量 */
            case '66': return [getDefaultGiftData(), getDefaultGiftData(), getDefaultGiftData()];
            default: return [getDefaultGiftData()]
        }

    }

    initState = () => {
        const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
        const data = this.initiateDefaultGifts();
        giftInfo.forEach((gift, index) => {
            if (data[index] !== undefined) {
                data[index].effectType = `${gift.effectType}`,
                data[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')],
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID = gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                data[index].needCount.value = gift.needCount || 0;
                data[index].sendType = gift.sendType || 0;
                if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                    data[index].giftCount.value = gift.giftCount;
                } else {
                    data[index].giftTotalCount.value = gift.giftTotalCount;
                }
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            } else {
                data[index] = getDefaultGiftData(gift.sendType);
                data[index].effectType = `${gift.effectType}`,
                data[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')],
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID = gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                    data[index].giftCount.value = gift.giftCount;
                } else {
                    data[index].giftTotalCount.value = gift.giftTotalCount;
                }
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            }
        })
        return {
            data,
        };
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
                    needCount: giftInfo.needCount.value,
                    giftName: giftInfo.giftInfo.giftName,
                }
            } else {
                // 固定期限
                gifts = {
                    effectType: '2',
                    effectTime: giftInfo.giftEffectiveTime.value[0] && giftInfo.giftEffectiveTime.value[0] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[0].format('YYYYMMDD')) : '',
                    validUntilDate: giftInfo.giftEffectiveTime.value[1] && giftInfo.giftEffectiveTime.value[1] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[1].format('YYYYMMDD')) : '',
                    giftID: giftInfo.giftInfo.giftItemID,
                    needCount: giftInfo.needCount.value,
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
    handlePrev() {
        return this.handleSubmit(true)
    }
    handleSubmit(isPrev) {
        if (isPrev) return true;
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        let {
            data,
            shareImagePath,
            shareTitle,
            discountMinRate,
            discountMaxRate,
            discountRate,
            discountMaxLimitRate,
            disabledGifts,
            ...instantDiscountState,
        } = this.state;
        const { type } = this.props;
        // 桌边砍可以不启用礼品
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
            if (_value > 0 && _value <= 1000000000) {
                return giftTotalCount;
            }
            return {
                msg: '礼品总数必须大于0, 小于等于10亿',
                validateStatus: 'error',
                value: '',
            }
        }
        function checkgiftCount(giftCount) {
            const _value = parseFloat(giftCount.value);
            if (_value > 0 && _value < 51) {
                return giftCount;
            }
            return {
                msg: '礼品个数必须在1到50之间',
                validateStatus: 'error',
                value: '',
            }
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
        function checkGiftInfo(giftInfo) {
            if (giftInfo.giftItemID === null || giftInfo.giftName === null) {
                return {
                    giftItemID: null,
                    giftName: null,
                    validateStatus: 'error',
                    msg: '必须选择礼券',
                }
            }
            return giftInfo;
        }

        const validatedRuleData = data.map((ruleInfo, index) => {
            const giftValidDaysOrEffect = ruleInfo.effectType != '2' ? 'giftValidDays' : 'giftEffectiveTime';
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                return Object.assign(ruleInfo, {
                    giftCount: checkgiftCount(ruleInfo.giftCount),
                    giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                    giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                    needCount: this.checkNeedCount(ruleInfo.needCount, index),
                    [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
                });
            }
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
        // 把中奖率累加,判断总和是否满足小于等于100
        const validOdds = data.reduce((res, cur) => {
            return res + parseFloat(cur.giftOdds.value)
        }, 0);
        data = validatedRuleData;
        this.setState({ data });
        if (validateFlag) {
            if (validOdds > 100) {
                message.warning('中奖比率之和不能大于100!');
                return false;
            }
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
                shareImagePath,
                shareTitle,
            });
            this.props.setSpecialGiftInfo(giftInfo);
            return true;
        }
        return false;
    }

    gradeChange(gifts, sendType) {
        if (!Array.isArray(gifts)) return;
        const { data } = this.state;
        this.setState({
            data: [...data.filter(item => item.sendType !== sendType), ...gifts]
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
    handleInviteTypeChange = (value) => {
        this.setState({
            inviteType: +value,
            mpIDList: [],
            defaultCardType: undefined,
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
    handleDiscountWayChange = ({ target : { value } }) => {
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
                        onChange={this.handleInviteTypeChange}
                    >
                        <Select.Option value="0">被邀请人关注公众号即完成邀请</Select.Option>
                        <Select.Option value="1">被邀请人注册会员即完成邀请</Select.Option>
                    </Select>
                </FormItem>
                {
                    inviteType === 0 ? (
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
                    ) : (
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
                    )
                }
                <FormItem
                    label="礼品启用状态"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Switch
                        checked={!this.state.disabledGifts}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        onChange={(bool) => this.setState({disabledGifts: !bool})}
                    ></Switch>
                </FormItem>
            </div>
        )
    }
    render() {
        const { type } = this.props;
        return (
            <div >
                {type == '67' && this.renderInstantDiscountForm()}
                {
                    type == '65' && <p style={{padding: '10px 18px'}}>邀请人礼品获得礼品列表：</p>
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
                   type == '65' && <p style={{padding: '10px 18px'}}>被邀请人礼品获得礼品列表：</p>
                }
                {
                    type == '65' && (
                        <Row>
                            <Col span={17} offset={4}>
                                <AddGifts
                                    maxCount={10}
                                    sendType={1}
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
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
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
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
