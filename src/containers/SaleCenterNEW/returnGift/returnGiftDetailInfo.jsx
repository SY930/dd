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
import { Row, Col, Form, Select, Radio, Icon, Popconfirm, Tooltip } from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import selfStyle from './style.less';
import { axiosData } from "../../../helpers/util";
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import ReturnGift from './returnGift'; // 可增删的输入框 组件
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from '../common/PriceInput';
import { injectIntl } from '../IntlDecor';

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
    { value: '1', name: SALE_LABEL.k6d8n1vk },
    { value: '0', name: SALE_LABEL.k6d8n23w },
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
class ReturnGiftDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        const { parsedRule, data } = this.getInitState();
        this.state = {
            display: !props.isNew,
            rule: parsedRule,
            data,
            needSyncToAliPay: 0,
            weChatCouponList: [],
        };
        this.handleFinish = this.handleFinish.bind(this);
        this.handlePre = this.handlePre.bind(this);
    }

    groupGiftsByStageAmount(giftList) {
        const giftMap = new Map();
        giftList.forEach(gift => {
            const emptyGift = JSON.parse(JSON.stringify(DEFAULT_GIFT_ITEM));
            emptyGift.giftNum.value = gift.giftNum;
            emptyGift.giftMaxUseNum.value = gift.giftMaxUseNum || 1;
            emptyGift.giftInfo.giftName = gift.giftName;
            emptyGift.giftInfo.giftItemID = gift.giftItemID;
            emptyGift.giftInfo.msg = null;
            emptyGift.giftInfo.validateStatus = 'success';
            emptyGift.giftInfo.giftType = gift.giftType || null;
            emptyGift.giftInfo.giftValue = gift.freeCashVoucherValue || null;
            emptyGift.giftValidDays.value = gift.giftValidDays || '0';
            emptyGift.giftValidType = gift.giftType == 112 ? '0' : gift.giftValidType;
            emptyGift.giftEffectiveTime.value = gift.giftType == 112 ? 0 : gift.giftStartTime ? [moment(gift.giftStartTime, 'YYYYMMDDHHmmss'), moment(gift.giftEndTime, 'YYYYMMDDHHmmss')] : gift.giftValidType == 0 ? gift.giftEffectiveTime / 60 : gift.giftEffectiveTime;
            if (giftMap.has(`${gift.stageAmount}`)) {
                const arr = giftMap.get(`${gift.stageAmount}`);
                arr.push(emptyGift)
            } else {
                giftMap.set(`${gift.stageAmount}`, [emptyGift]);
            }
        });
        return Array.from(giftMap.entries()).map(([stageAmount, gifts]) => ({ stageAmount, gifts })).sort((a, b) => a.stageAmount - b.stageAmount)
    }

    getInitState() {
        const $rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const stageType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule', 'stageType']);
        const activeCode = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule', 'activeCode']);
        const $giftList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'giftList'], Immutable.fromJS([]));
        let parsedRule;
        let data = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
        if (stageType) {
            parsedRule = {
                stageType,
                activeCode,
                gainCodeMode: $rule.get('gainCodeMode') || '1',
                printCode: $rule.get('printCode') || 0,
            }
        } else {
            parsedRule = {
                activeCode: '1',
                stageType: '2',
                gainCodeMode: '1',
                printCode: 0,
            }
        }
        if ($giftList.size > 0) {
            const giftList = $giftList.toJS();
            data = this.groupGiftsByStageAmount(giftList);
        } else if (stageType == 1) {// 每满
            data[0].stageAmount = $rule.get('stageAmount')
            data[0].gifts[0].giftNum.value = $rule.get('giftNum');
            data[0].gifts[0].giftInfo.giftName = $rule.get('giftName');
            data[0].gifts[0].giftInfo.msg = null;
            data[0].gifts[0].giftInfo.validateStatus = 'success';
            data[0].gifts[0].giftInfo.giftItemID = $rule.get('giftItemID');
            data[0].gifts[0].giftInfo.giftType = $rule.get('giftType') || null;
            data[0].gifts[0].giftInfo.giftValue = $rule.get('freeCashVoucherValue') || null;
            data[0].gifts[0].giftValidDays.value = $rule.get('giftValidDays') || '0';
            data[0].gifts[0].giftMaxUseNum.value = $rule.get('giftMaxUseNum') || $rule.get('giftMaxNum');
            data[0].gifts[0].giftValidType = $rule.get('giftType') == 112 ? '0' : $rule.get('giftValidType');
            data[0].gifts[0].giftEffectiveTime.value = $rule.get('giftType') == 112 ? 0 : $rule.get('giftStartTime') ? [moment($rule.get('giftStartTime'), 'YYYYMMDDHHmmss'), moment($rule.get('giftEndTime'), 'YYYYMMDDHHmmss')] : $rule.get('giftValidType') == 0 ? $rule.get('giftEffectiveTime') / 60 : $rule.get('giftEffectiveTime');
        } else if (stageType == 2 || stageType == 3) {
            const giftList = $rule.getIn(['stage'], Immutable.fromJS([])).toJS();
            data = this.groupGiftsByStageAmount(giftList);
        }
        if (data.length === 0) {
            data = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
        }
        return {
            parsedRule, data
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleFinish,
        });
        this.props.fetchGiftListInfo({
            groupID: this.props.user.accountInfo.groupID,
        });
        this.queryWeChatCouponList()
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

    handleFinish() {
        let formFlag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                formFlag = false;
            }
        });
        if (!formFlag) return;
        const { rule, needSyncToAliPay, data } = this.state;
        const giftList = data.reduce((acc, curr) => {
            acc.push(...curr.gifts.map(item => ({ ...item, stageAmount: curr.stageAmount })));
            return acc;
        }, [])
        // FIXME: 这个校验在不人为输入(触发相应onChange)时等于无效, 比如编辑时直接下一步下一步保存时, 如果产品要求, 可以改掉
        const validateFlag = giftList.reduce((p, ruleInfo) => {
            const _validStatusOfCurrentIndex = Object.keys(ruleInfo)
                .reduce((flag, key) => {
                    if (key === 'giftMaxUseNum' && this.state.rule.stageType == 2) return flag;
                    if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')) {
                        const _valid = ruleInfo[key].validateStatus === 'success';
                        return flag && _valid;
                    }
                    return flag
                }, true);
            return p && _validStatusOfCurrentIndex;
        }, true);
        if(this.state.rule.activeCode == 2){
            this.state.rule.stageType = '3'//活动形式：会员日送礼
        }
        if (validateFlag) {
            this.props.setPromotionDetail({
                rule: this.state.rule,
                giftList: this.getFinalGiftList(giftList),
                needSyncToAliPay,
            });
            return true;
        }
        return false;
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
        this.setState({ data });
    }
    removeStage = (index) => {
        const { data } = this.state;
        if (data.length > 1) {
            data.splice(index, 1)
            this.setState({ data });
        }
    }
    addStage = () => {
        const { data } = this.state;
        data.push(...JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE)));
        this.setState({ data })
    }
    handleStageAmountChange = (val, index,type) => {
        const { data } = this.state;
        data[index].stageAmount = val.number;
        this.setState({
            data,
        });
        for (let i = 0; i < data.length; i++) {
            if (i !== index) {
                const value = data[i].stageAmount
                if(type == '2'){
                    this.props.form.setFields({
                        [`stageAmounts${i}`]: { value: { number: value } }
                    })
                }else{
                    this.props.form.setFields({
                        [`stageAmount${i}`]: { value: { number: value } }
                    })
                }
                
            }
        }
    }

    activeCodeRadioChange(e){
        const { rule } = this.state;
        const data = JSON.parse(JSON.stringify(DEFAULT_GIFT_STAGE));
        rule.activeCode = e.target.value;
        this.setState({ rule,data });
    }
    renderPromotionRule() {
        const { activeCode } = this.state.rule;
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k67g8m3z}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.rule.gainCodeMode}
                        onChange={(e) => {
                            const { rule } = this.state;
                            rule.gainCodeMode = e.target.value;
                            this.setState({ rule });
                        }}
                    >
                        {showType
                            .map((type) => {
                                return <Radio key={type.value} value={type.value}>{type.name}</Radio >
                            })}
                    </RadioGroup >
                </FormItem>
                {this.state.rule.gainCodeMode == 1 ? this.renderPrintCode() : null}
                <div>
                    <FormItem
                        label={'活动形式'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <RadioGroup
                            value={String(activeCode)}
                            onChange={(e) => this.activeCodeRadioChange(e)}
                        >
                            <Radio key={'1'} value={'1'}>消费送礼</Radio >
                            <Radio key={'2'} value={'2'}>会员日送礼</Radio >
                        </RadioGroup >
                    </FormItem>
                    <Tooltip title={'仅线下买单支持此场景'} ><Icon type="question-circle" style={{ position: 'relative', top: '-39', left: '284' }} /></Tooltip>
                </div>
                {
                    activeCode == '2' ? 
                    null
                    :
                    <FormItem
                        label={SALE_LABEL.k5ez4n7x}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Select
                            size="default"
                            placeholder=""
                            className={`${styles.linkSelectorRight} returnGiftDetailMountClassJs`}
                            getPopupContainer={(node) => node.parentNode}
                            value={this.state.rule.stageType == '3' ? '2' : this.state.rule.stageType}
                            onChange={(val) => {
                                const { rule, data } = this.state;
                                rule.stageType = val;
                                this.setState({ rule, data: [data[0]] });
                            }
                            }
                        >
                            {type
                                .map((type) => {
                                    return <Option key={type.value} value={type.value}>{type.name}</Option>
                                })}
                        </Select>
                    </FormItem>
                }
                {this.renderRuleDetail()}
            </div>
        )
    }
    renderPrintCode() {
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k67g8mcb}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.rule.printCode}
                        onChange={(e) => {
                            const { rule } = this.state;
                            rule.printCode = e.target.value;
                            this.setState({ rule });
                        }}
                    >
                        <Radio key={0} value={0}>{SALE_LABEL.k67g8mkn}</Radio >
                        <Radio key={1} value={1}>{SALE_LABEL.k67g8msz}</Radio >
                    </RadioGroup >
                </FormItem>
                <p className={styles.yellowFont}>当有会员信息时，礼品卡会直接存入会员账户不再打印券码</p>
            </div>
        )
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
        const { activeCode } = this.state.rule;
        return (
            <div>
                {
                    activeCode == '2' ?
                        this.state.data.map(({ stageAmount, gifts }, index, arr) => (
                            <Row key={`index`}>
                                <Col span={4}>
                                    <div className={selfStyle.fakeLabel}>
                                        活动条件
                                    </div>
                                </Col>
                                <Col span={17}>
                                    <div className={selfStyle.grayHeader}>
                                        每天第&nbsp;
                                        <FormItem>
                                            {
                                                getFieldDecorator(`stageAmounts${index}`, {
                                                    initialValue: { number: stageAmount },
                                                    onChange: (val) => this.handleStageAmountChange(val, index,'2'),
                                                    rules: [
                                                        {
                                                            validator: (rule, v, cb) => {
                                                                if (!(v.number > 0)) {
                                                                    return cb(k5f4b1b9)
                                                                }
                                                                cb()
                                                            }
                                                        },
                                                    ],
                                                })(<PriceInput style={{ width: 100 }} modal="float" maxNum={6} />)
                                            }
                                        </FormItem>
                                        &nbsp;单，{SALE_LABEL.k6d8n16k}
                                    </div>
                                    <ReturnGift
                                        key={`index`}
                                        weChatCouponList={this.state.weChatCouponList}
                                        isMultiple={isMultiple}
                                        value={gifts}
                                        activeCode={activeCode}
                                        onChange={(val) => this.handleStageChange(val, index)}
                                        filterOffLine={this.state.rule.gainCodeMode != '0'}
                                    />
                                </Col>
                            </Row>
                        ))
                        :
                        this.state.data.map(({ stageAmount, gifts }, index, arr) => (
                            <Row key={`${index}`}>
                                <Col span={4}>
                                    {
                                        !isMultiple && (
                                            <div className={selfStyle.fakeLabel}>
                                                {SALE_LABEL.k6d8n0y8}{`${index + 1}`}
                                            </div>
                                        )
                                    }
                                </Col>
                                <Col span={17}>
                                    <div className={isMultiple ? selfStyle.emptyHeader : selfStyle.grayHeader}>
                                        {isMultiple ? SALE_LABEL.k67g8n1b : SALE_LABEL.k5nh214x}&nbsp;
                                    <FormItem>
                                            {
                                                getFieldDecorator(`stageAmount${index}`, {
                                                    initialValue: { number: stageAmount },
                                                    onChange: (val) => this.handleStageAmountChange(val, index,'1'),
                                                    rules: [
                                                        {
                                                            validator: (rule, v, cb) => {
                                                                if (!(v.number > 0)) {
                                                                    return cb(k5f4b1b9)
                                                                }
                                                                for (let i = 0; i < index; i++) {
                                                                    if (arr[i].stageAmount >= +v.number) {
                                                                        return cb(k67g8n9n)
                                                                    }
                                                                }
                                                                cb()
                                                            }
                                                        },
                                                    ],
                                                })(<PriceInput style={{ width: 100 }} modal="float" maxNum={6} />)
                                            }
                                        </FormItem>
                                    &nbsp;{k5ezdbiy}，{SALE_LABEL.k6d8n16k}
                                    </div>


                                    <ReturnGift
                                        key={`${index}`}
                                        weChatCouponList={this.state.weChatCouponList}
                                        isMultiple={isMultiple}
                                        value={gifts}
                                        activeCode={activeCode}
                                        onChange={(val) => this.handleStageChange(val, index)}
                                        filterOffLine={this.state.rule.gainCodeMode != '0'}
                                    />
                                </Col>
                                <Col span={2}>
                                    {
                                        (!isMultiple) && (
                                            <div className={selfStyle.buttonArea}>
                                                {
                                                    (arr.length < 5 && index === arr.length - 1) && (
                                                        <Icon
                                                            onClick={this.addStage}
                                                            style={{ marginBottom: 10 }}
                                                            className={selfStyle.plusIcon}
                                                            type="plus-circle-o"
                                                        />
                                                    )
                                                }
                                                {
                                                    (arr.length > 1) && (
                                                        <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.removeStage(index)}>
                                                            <Icon
                                                                className={selfStyle.deleteIcon}
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

                        ))

                }
            </div>



        )
    }

    renderAdvancedSettingButton() {
        return (
            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={true} stashSome={this.state.rule.gainCodeMode == '0'} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(ReturnGiftDetailInfo));
