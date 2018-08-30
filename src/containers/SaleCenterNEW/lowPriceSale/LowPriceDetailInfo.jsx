
/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T13:42:07+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, InputNumber, Input, Icon } from 'antd';
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';

const Immutable = require('immutable');

import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import RangeInput from '../../../containers/SaleCenterNEW/common/RangeInput';

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';


const client = [
    { key: '0', value: '0', name: '不限制' },
    { key: '1', value: '1', name: '仅会员' },
    { key: '2', value: '2', name: '非会员' },
];

const type = [
    { value: '0', name: '下单即折扣' },
    { value: '1', name: '任意菜品消费满' },
    { value: '2', name: '指定菜品消费满' },
]
const Option = Select.Option;

class LowPriceDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            isDishVisibleIndex: '0',
            maxCount: 3,
            discount: '',
            discountFlag: true,
            stageAmountFlag: true,
            ruleType: '1',
            targetScope: '0',
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderRulesComponent = this.renderRulesComponent.bind(this);
        this.handleRuleTypeChange = this.handleRuleTypeChange.bind(this);
        this.handleStageAmountChange = this.handleStageAmountChange.bind(this);
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.onDiscountChange = this.onDiscountChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }

        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        const _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']);
        const _scopeLstLength = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().length;
        let display;
        display = !this.props.isNew;
        const _ruleType = _scopeLstLength === 0 ? '1' : '2';
        this.setState({
            display,
            ruleType: _ruleType,
            discount: _rule.discountRate ? Number((_rule.discountRate * 1).toFixed(3)).toString() : '',
            targetScope: _categoryOrDish,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])) {
            let _rule = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
            if (_rule === null || _rule === undefined) {
                return null;
            }
            _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
            // default value
            _rule = Object.assign({}, _rule);
            const _categoryOrDish = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']);
            let display;
            display = !this.props.isNew;
            this.setState({
                display,
                ruleType: _rule.stageType || '0',
                ruleInfo: _rule.stage ? _rule.stage.map((stageInfo) => {
                    return {
                        start: stageInfo.stageAmount,
                        end: Number((stageInfo.discountRate * 1).toFixed(3)).toString(),
                        validationStatus: 'success',
                        helpMsg: null,
                    }
                }) : [{
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: this.state.discount,
                }],
                discount: _rule.discountRate ? Number((_rule.discountRate * 1).toFixed(3)).toString() : '',
                targetScope: _categoryOrDish,
            });
        }
    }

    handleSubmit = (cbFn) => {
        let { discount, discountFlag, ruleInfo } = this.state;
        let rule;
        if (discount == null || discount == '') {
            discountFlag = false;
        }
        this.setState({ discount, discountFlag });

        const ruleValidation = ruleInfo.reduce((p, c) => {
            if (c.start === null || c.end === null || c.start == '' || c.end == '' || Number.isNaN(c.start) || Number.isNaN(c.end)) {
                c.validationStatus = 'error';
                c.helpMsg = '请输入正确折扣范围';
            }
            return p && c.validationStatus === 'success';
        }, true);
        let nextFlag = true;
        if (discountFlag && this.state.ruleType == '0') {
            rule = {
                stageType: this.state.ruleType,
                targetScope: this.state.targetScope,
                discountRate: this.state.discount,
            };
            this.props.setPromotionDetail({
                rule,
            });
        } else if (ruleValidation && (this.state.ruleType == '1' || this.state.ruleType == '2')) {
            rule = {
                stageType: '2',
                stage: this.state.ruleInfo.map((ruleInfo) => {
                    return {
                        targetScope: this.state.targetScope,
                        stageAmount: ruleInfo.start,
                        discountRate: ruleInfo.end,
                    }
                }),
            }
            this.props.setPromotionDetail({
                rule,
            });
        } else {
            nextFlag = false;
        }


        return nextFlag;
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    handleRuleTypeChange(val) {
        this.setState({
            ruleType: val,
        })
    }

    handleStageAmountChange(val) {
        const numberValue = Number(val.number || 0);
        const stageAmountFlag = numberValue >= 1 && numberValue <= 50;
        this.setState({
            stageAmount: val.number,
            stageAmountFlag
        })
    }

    onCustomRangeInputChange(value, index) {
        const _start = value.start;
        const _end = value.end;
        let _validationStatus,
            _helpMsg;
        // TODO:刚输入的时候就报错
        if (parseFloat(_end) <= 10 || (_start == null && _end != null) || (_start != null && _end == null)) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = '请输入正确折扣范围'
        }

        const _tmp = this.state.ruleInfo;
        _tmp[index] = {
            start: _start,
            end: _end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        this.setState({ ruleInfo: _tmp });
        this.onDiscountChange(_end);
    }

    onDiscountChange(value) {
        let { discount, discountFlag } = this.state;
        if (value == null || value > 10) {
            discountFlag = false;
            discount = value;
        } else {
            discountFlag = true;
            discount = value;
        }
        this.setState({ discount, discountFlag });
    }

    renderPromotionRule() {
        return (
            <div>
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p> 消费一定的菜品，可对价格最低菜品进行减免、折扣或特定售价的优惠活动</p>
                </FormItem>
                    {this.renderRulesComponent()}


            </div>
        )
    }

    renderRulesComponent() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.explainBack].join(' ')}
                wrapperCol={{span:17, offset:4}}
                validateStatus={this.state.stageAmountFlag?'success':'error'}
                help={this.state.stageAmountFlag?null:'份数为1-50'}
            >
                <PriceInput
                    addonBefore={
                    <Select
                        size="default"
                        onChange={this.handleRuleTypeChange}
                        value={this.state.ruleType}
                    >
                        <Option key="1" value='1'>任意消费满</Option>
                        <Option key="2" value='2'>指定菜品消费满</Option>
                    </Select>
                }
                            addonAfter={'份'}
                            value={{number: this.state.stageAmount}}
                            defaultValue={{number: this.state.stageAmount}}
                            onChange={this.handleStageAmountChange}
                            maxNum={4}
                            modal="int"
                />
            </FormItem>
        )
    }

    renderAdvancedSettingButton() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.formItemForMore].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
            >
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display &&
                <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        const payLimit = this.state.ruleType != 0;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.state.ruleType === '2' ? <PromotionDetailSetting /> : null}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={payLimit} /> : null}
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
)(Form.create()(LowPriceDetailInfo));
