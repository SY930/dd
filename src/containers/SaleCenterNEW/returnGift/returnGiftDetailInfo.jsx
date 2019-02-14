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
import { Row, Col, Form, Select, Radio, TreeSelect } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import ReturnGift from './returnGift'; // 可增删的输入框 组件
import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const Immutable = require('immutable');
const moment = require('moment');

const type = [
    { value: '2', name: '消费满一定金额即赠送相应礼品' },
    { value: '1', name: '消费每满一定金额即赠送相应礼品' },
];
const showType = [
    { value: '1', name: '结账单打印券码' },
    { value: '0', name: '存入会员电子券包' },
];

class ReturnGiftDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            rule: {
                type: '2',
                gainCodeMode: '1',
                printCode: 0,
                data: [{
                    stageAmount: {
                        value: null,
                        validateStatus: 'success',
                        msg: null,
                    },
                    giftNum: {
                        value: 1,
                        validateStatus: 'success',
                        msg: null,
                    },

                    giftInfo: {
                        giftName: null,
                        giftItemID: null,
                        validateStatus: 'success',
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
                }],
            },
            needSyncToAliPay: 0,
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.renderRuleDetail = this.renderRuleDetail.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.handlePre = this.handlePre.bind(this);
        this.getRule = this.getRule.bind(this);
        this.renderPrintCode = this.renderPrintCode.bind(this);
    }


    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleFinish,
        });
        let { display } = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            needSyncToAliPay: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'needSyncToAliPay']),
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        const { rule } = this.state;
        if (Object.keys(_rule).length > 0) {
            rule.type = _rule.stageType;
            rule.gainCodeMode = _rule.gainCodeMode || '1';
            rule.printCode = _rule.printCode || 0;
            if (_rule.stageType == '2') {
                _rule.stage.map((stage, index) => {
                    if (rule.data[index] == undefined) {
                        rule.data.push({
                            stageAmount: {
                                value: null,
                                validateStatus: 'success',
                                msg: null,
                            },
                            giftNum: {
                                value: 1,
                                validateStatus: 'success',
                                msg: null,
                            },

                            giftInfo: {
                                giftName: null,
                                giftItemID: null,
                                giftType: null,
                                giftValue: null,
                                validateStatus: 'success',
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
                        });
                    }
                    rule.data[index].stageAmount.value = stage.stageAmount;
                    rule.data[index].giftNum.value = stage.giftNum;
                    rule.data[index].giftInfo.giftName = stage.giftName;
                    rule.data[index].giftInfo.giftItemID = stage.giftItemID;
                    rule.data[index].giftInfo.giftType = stage.giftType || null;
                    rule.data[index].giftInfo.giftValue = stage.freeCashVoucherValue || null;
                    rule.data[index].giftValidDays.value = stage.giftValidDays || '0';
                    rule.data[index].giftValidType = stage.giftValidType;
                    rule.data[index].giftEffectiveTime.value = stage.giftStartTime ? [moment(stage.giftStartTime, 'YYYYMMDDHHmmss'), moment(stage.giftEndTime, 'YYYYMMDDHHmmss')] : stage.giftValidType == 0 ? stage.giftEffectiveTime / 60 : stage.giftEffectiveTime;
                })
            } else {
                rule.data[0].stageAmount.value = _rule.stageAmount;
                rule.data[0].giftNum.value = _rule.giftNum;
                rule.data[0].giftInfo.giftName = _rule.giftName;
                rule.data[0].giftInfo.giftItemID = _rule.giftItemID;
                rule.data[0].giftInfo.giftType = _rule.giftType || null;
                rule.data[0].giftInfo.giftValue = _rule.freeCashVoucherValue || null;
                rule.data[0].giftValidDays.value = _rule.giftValidDays || '0';
                rule.data[0].giftMaxUseNum.value = _rule.giftMaxUseNum || _rule.giftMaxNum;
                rule.data[0].giftValidType = _rule.giftValidType;
                rule.data[0].giftEffectiveTime.value = _rule.giftStartTime ? [moment(_rule.giftStartTime, 'YYYYMMDDHHmmss'), moment(_rule.giftEndTime, 'YYYYMMDDHHmmss')] : _rule.giftValidType == 0 ? _rule.giftEffectiveTime / 60 : _rule.giftEffectiveTime;
            }
            this.setState({
                rule,
            })
        }
    }

    getRule() {
        if (this.state.rule.type == '2') {
            return {
                stageType: this.state.rule.type,
                gainCodeMode: this.state.rule.gainCodeMode,
                printCode: this.state.rule.printCode,
                stage: this.state.rule.data.map((item, index) => {
                    if (item.giftInfo.giftType == '112') {
                        return {
                            stageAmount: item.stageAmount.value,
                            giftValidType: item.giftValidType,
                            giftValidDays: item.giftValidDays.value,
                            giftEffectiveTime: item.giftEffectiveTime.value,
                            giftNum: item.giftNum.value,
                            giftName: item.giftInfo.giftName,
                            giftItemID: item.giftInfo.giftItemID,
                            giftType: item.giftInfo.giftType,
                            freeCashVoucherValue: item.giftInfo.giftValue
                        }
                    }
                    if (item.giftValidType == '0') {
                        return {
                            stageAmount: item.stageAmount.value,
                            giftValidType: item.giftValidType,
                            giftValidDays: item.giftValidDays.value,
                            giftEffectiveTime: (item.giftEffectiveTime.value || 0) * 60,
                            giftNum: item.giftNum.value,
                            giftName: item.giftInfo.giftName,
                            giftItemID: item.giftInfo.giftItemID,
                        }
                    } else if (item.giftValidType == '2') {
                        return {
                            stageAmount: item.stageAmount.value,
                            giftValidType: item.giftValidType,
                            giftValidDays: item.giftValidDays.value,
                            giftEffectiveTime: item.giftEffectiveTime.value,
                            giftNum: item.giftNum.value,
                            giftName: item.giftInfo.giftName,
                            giftItemID: item.giftInfo.giftItemID,
                        }
                    }
                    const range = item.giftEffectiveTime;
                    return {
                        stageAmount: item.stageAmount.value,
                        giftValidType: item.giftValidType,
                        giftStartTime: range.value[0] ? parseInt(range.value[0].format('YYYYMMDD') + '000000') : '',
                        giftEndTime: range.value[1] ? parseInt(range.value[1].format('YYYYMMDD') + '235959') : '',
                        giftNum: item.giftNum.value,
                        giftName: item.giftInfo.giftName,
                        giftItemID: item.giftInfo.giftItemID,
                    }
                }),
            }
        }
        if (this.state.rule.data[0].giftInfo.giftType == '112') {
            return {
                stageType: this.state.rule.type,
                giftValidType: this.state.rule.data[0].giftValidType,
                stageAmount: this.state.rule.data[0].stageAmount.value,
                giftMaxUseNum: this.state.rule.data[0].giftMaxUseNum.value,
                giftNum: this.state.rule.data[0].giftNum.value,
                giftName: this.state.rule.data[0].giftInfo.giftName,
                giftItemID: this.state.rule.data[0].giftInfo.giftItemID,
                gainCodeMode: this.state.rule.gainCodeMode,
                printCode: this.state.rule.printCode,
                giftType: this.state.rule.data[0].giftInfo.giftType,
                freeCashVoucherValue: this.state.rule.data[0].giftInfo.giftValue,
            }
        }
        if (this.state.rule.data[0].giftValidType == '0') {
            return {
                stageType: this.state.rule.type,
                giftValidType: this.state.rule.data[0].giftValidType,
                stageAmount: this.state.rule.data[0].stageAmount.value,
                giftMaxUseNum: this.state.rule.data[0].giftMaxUseNum.value,
                giftValidDays: this.state.rule.data[0].giftValidDays.value,
                giftEffectiveTime: (this.state.rule.data[0].giftEffectiveTime.value || 0) * 60,
                giftNum: this.state.rule.data[0].giftNum.value,
                giftName: this.state.rule.data[0].giftInfo.giftName,
                giftItemID: this.state.rule.data[0].giftInfo.giftItemID,
                gainCodeMode: this.state.rule.gainCodeMode,
                printCode: this.state.rule.printCode,
            }
        }else if (this.state.rule.data[0].giftValidType == '2') {
            return {
                stageType: this.state.rule.type,
                giftValidType: this.state.rule.data[0].giftValidType,
                stageAmount: this.state.rule.data[0].stageAmount.value,
                giftMaxUseNum: this.state.rule.data[0].giftMaxUseNum.value,
                giftValidDays: this.state.rule.data[0].giftValidDays.value,
                giftEffectiveTime: this.state.rule.data[0].giftEffectiveTime.value,
                giftNum: this.state.rule.data[0].giftNum.value,
                giftName: this.state.rule.data[0].giftInfo.giftName,
                giftItemID: this.state.rule.data[0].giftInfo.giftItemID,
                gainCodeMode: this.state.rule.gainCodeMode,
                printCode: this.state.rule.printCode,
            }
        }
        const range = this.state.rule.data[0].giftEffectiveTime;
        return {
            stageType: this.state.rule.type,
            giftValidType: this.state.rule.data[0].giftValidType,
            stageAmount: this.state.rule.data[0].stageAmount.value,
            giftMaxUseNum: this.state.rule.data[0].giftMaxUseNum.value,
            giftStartTime: range.value[0] ? parseInt(range.value[0].format('YYYYMMDD') + '000000') : '',
            giftEndTime: range.value[1] ? parseInt(range.value[1].format('YYYYMMDD') + '235959') : '',
            giftNum: this.state.rule.data[0].giftNum.value,
            giftName: this.state.rule.data[0].giftInfo.giftName,
            giftItemID: this.state.rule.data[0].giftInfo.giftItemID,
            gainCodeMode: this.state.rule.gainCodeMode,
            printCode: this.state.rule.printCode,
        }
    }


    handleFinish() {
        const { rule, needSyncToAliPay } = this.state;
        function checkStageAmount(stageAmount) {
            const _value = parseFloat(stageAmount.value);
            if (_value > 0) {
                return stageAmount;
            }
            return {
                msg: '消费金额必须大于0',
                validateStatus: 'error',
                value: '',
            }
        }

        function checkGiftInfo(giftInfo) {
            if (giftInfo.giftItemID === null || giftInfo.giftName === null) {
                return {
                    giftItemID: null,
                    giftName: null,
                    giftType: null,
                    giftValue: null,
                    validateStatus: 'error',
                    msg: '必须选择礼券',
                }
            }
            return giftInfo;
        }

        const validatedRuleData = rule.data.map((ruleInfo, index) => {
            return Object.assign(ruleInfo, {
                stageAmount: checkStageAmount(ruleInfo.stageAmount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
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
        if (validateFlag) {
            this.props.setPromotionDetail({
                rule: this.getRule(),
                needSyncToAliPay,
            });
            return true;
        }
        // let { rule } = this.state;
        rule.data = validatedRuleData;
        this.setState({ rule });
        return false;
    }

    handlePre() {
        this.props.setPromotionDetail({
            rule: this.state.rule,
            needSyncToAliPay: this.state.needSyncToAliPay,
        });
        return true;
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };


    renderPromotionRule() {
        return (
            <div>
                <FormItem
                    label="券显示方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.rule.gainCodeMode}
                        onChange={(e) => {
                            const { rule } = this.state;
                            rule.gainCodeMode = e.target.value;
                            // 清空已选礼品，因为结账单打印券码，只有两种券，且必须支持到店
                            rule.data.map((gift) => {
                                gift.giftInfo = {
                                    giftName: null,
                                    giftItemID: null,
                                    validateStatus: 'success',
                                    msg: null,
                                }
                            })
                            this.setState({ rule }, () => {
                                this.props.onChange && this.props.onChange(this.state.rule);
                            });
                        }}
                    >
                        {showType
                            .map((type) => {
                                return <Radio key={type.value} value={type.value}>{type.name}</Radio >
                            })}
                    </RadioGroup >
                </FormItem>
                {this.state.rule.gainCodeMode == 1 ? this.renderPrintCode() : null}
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        size="default"
                        placeholder="请选择活动类别"
                        className={`${styles.linkSelectorRight} returnGiftDetailMountClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.rule.type}
                        onChange={(val) => {
                            const { rule } = this.state;
                            rule.type = val;
                            rule.data = [rule.data[0]];
                            this.setState({ rule }, () => {
                                const onChange = this.props.onChange;
                                if (onChange) {
                                    onChange(Object.assign({}, this.state.rule));
                                }
                            });
                        }
                        }
                    >
                        {type
                            .map((type) => {
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })}
                    </Select>
                </FormItem>

                <Row>
                    <Col span={17} offset={4}>
                        {this.renderRuleDetail()}
                    </Col>
                </Row>

            </div>
        )
    }
    renderPrintCode() {
        return (
            <div>
                <FormItem
                    label="打印券码类型"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={this.state.rule.printCode}
                        onChange={(e) => {
                            const { rule } = this.state;
                            rule.printCode = e.target.value;
                            this.setState({ rule }, () => {
                                this.props.onChange && this.props.onChange(this.state.rule);
                            });
                        }}
                    >
                        <Radio key={0} value={0}>条形码</Radio >
                        <Radio key={1} value={1}>二维码</Radio >
                    </RadioGroup >
                </FormItem>
            </div>
        )
    }
    renderRuleDetail() {
        return (
            <ReturnGift
                maxCount={this.state.rule.type == '2' ? 3 : 1}
                value={this.state.rule.data}
                onChange={(val) => {
                    console.log('val: ', val)
                    const { rule } = this.state;
                    if (val !== undefined) {
                        rule.data = val;
                        this.setState({ rule });
                    } else {

                    }
                }}
                filterOffLine={this.state.rule.gainCodeMode != '0'}
            />
        )
    }

    renderAdvancedSettingButton() {
        return (
            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
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
                    <PromotionDetailSetting />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={true} stashSome={this.state.rule.gainCodeMode == '0'} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReturnGiftDetailInfo);
