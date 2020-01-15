import React, { Component } from 'react'
import {
    Row,
    Col,
    Form,
    Select,
    Button,
} from 'antd';
import { connect } from 'react-redux'

const Immutable = require('immutable');
const ButtonGroup = Button.Group;
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Option = Select.Option;

@injectIntl()
class LowPriceDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            discountRate: '',
            discountFlag: true,
            freeAmountFlag: true,
            freeAmount: '',
            stageAmountFlag: true,
            stageAmount: '',
            disType: '3',
            ruleType: '1',
            targetScope: '0',
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleRuleTypeChange = this.handleRuleTypeChange.bind(this);
        this.handleStageAmountChange = this.handleStageAmountChange.bind(this);
        this.handleDisTypeChange = this.handleDisTypeChange.bind(this);
        this.handleDiscountRateChange = this.handleDiscountRateChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.onDiscountChange = this.onDiscountChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        this.parseRule()
    }

    parseRule(props = this.props) {
        let _rule = props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }

        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        const stageType = (_rule || {}).stageType;
        try {
            _rule = _rule.stage[0];
        } catch (e) {
            _rule = {}
        }
        const _scopeLstLength = props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().length;
        let display;
        display = !this.props.isNew;
        let ruleType;
        if (_scopeLstLength) {// 指定菜品
            if (stageType == 1) { // 每满
                ruleType = '4'
            } else {
                ruleType = '2'
            }
        } else {// 任意菜品
            if (stageType == 1) { // 每满
                ruleType = '3'
            } else {
                ruleType = '1'
            }
        }
        this.setState({
            display,
            ruleType,
            discountRate: _rule.discountRate ? Number((_rule.discountRate * 1).toFixed(3)).toString() : '',
            disType: _rule.disType ? String(_rule.disType) : '3',
            freeAmount: _rule.freeAmount ? String(_rule.freeAmount) : '',
            stageAmount: _rule.stageAmount ? String(_rule.stageAmount) : '',
        });
    }

    handleSubmit = () => {
        let {
            discountRate,
            freeAmount,
            stageAmount,
            disType,
            ruleType,
        } = this.state;
        let rule;
        if (Number(stageAmount || 0) <= 0) {
            this.setState({
                stageAmountFlag: false
            });
            return
        }
        if (disType == 2) {
            if (Number(discountRate || 0) <= 0 || Number(discountRate || 0) > 10) {
                this.setState({
                    discountFlag: false
                });
                return
            }
        } else {
            if (Number(freeAmount || 0) <= 0) {
                this.setState({
                    freeAmountFlag: false
                });
                return
            }
        }

        rule = {
            stageType: ruleType === '1' || ruleType === '2' ? '2' : '1',
            stage:  [{
                    freeAmount,
                    disType,
                    stageAmount,
                    discountRate: disType == 2 ? String(Number(discountRate || 0)) : ''
                }]
            };
            this.props.setPromotionDetail({
                rule,
            });
        return true;
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
        if (val == 1 || val == 3) {
            this.props.setPromotionDetail({
                categoryOrDish: 0,
                dishes: [],
                excludeDishes: [],
                foodCategory: [],
                priceLst: [],
                scopeLst: [],
            })
        }
    }

    handleStageAmountChange(val) {
        const numberValue = Number(val.number || 0);
        const stageAmountFlag = numberValue >= 1 && numberValue <= 50;
        this.setState({
            stageAmount: val.number,
            stageAmountFlag
        })
    }

    handleFreeAmountChange(val) {
        const numberValue = Number(val.number || 0);
        const freeAmountFlag = numberValue > 0;
        this.setState({
            freeAmount: val.number,
            freeAmountFlag
        })
    }

    handleDiscountRateChange(val) {
        const numberValue = Number(val.number || 0);
        const discountFlag = numberValue > 0 && numberValue <= 10;
        this.setState({
            discountRate: val.number,
            discountFlag
        })
    }

    handleDisTypeChange(v) {
        if (v == 2) {
            this.setState({
                disType: v,
                freeAmountFlag: true,
            })
        } else {
            this.setState({
                disType: v,
                discountFlag: true,
            })
        }
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
                    label={SALE_LABEL.k5ez4n7x}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                <p>{SALE_LABEL.k5ez4nw2}</p>
                </FormItem>
                <Row>
                    <Col span={8} push={1}>
                        {this.renderStageAmount()}
                    </Col>
                    <Col span={15} push={1}>
                        {this.renderFreeAmountAndDiscount()}
                    </Col>
                </Row>
            </div>
        )
    }

    renderStageAmount = () => {
        const { intl } = this.props;
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.explainBack, styles.pushedExplain].join(' ')}
                wrapperCol={{span:24}}
                validateStatus={this.state.stageAmountFlag?'success':'error'}
                help={this.state.stageAmountFlag?null: SALE_LABEL.k5ez4odk}
            >
                <PriceInput
                    addonBefore={
                        <div style={{
                            width: "120px"
                        }}>
                            <Select
                                size="default"
                                dropdownMatchSelectWidth={false}
                                onChange={this.handleRuleTypeChange}
                                value={this.state.ruleType}
                            >
                                <Option key="1" value='1'>{k5ez4ovx}</Option>
                                <Option key="3" value='3'>{k5ez4pdf}</Option>
                                <Option key="2" value='2'>{k5ez4pvb}</Option>
                                <Option key="4" value='4'>{k5ez4qew}</Option>
                            </Select>
                        </div>

                }
                    addonAfter={k5ez4qy4}
                    value={{number: this.state.stageAmount}}
                    defaultValue={{number: this.state.stageAmount}}
                    onChange={this.handleStageAmountChange}
                    maxNum={4}
                    modal="int"
                />
            </FormItem>
        )
    }

    renderFreeAmountAndDiscount() {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k5ezdckg = intl.formatMessage(SALE_STRING.k5ezdckg);
        const k5ezcuto = intl.formatMessage(SALE_STRING.k5ezcuto);
        const k5ezcvbm = intl.formatMessage(SALE_STRING.k5ezcvbm);
        const disType = this.state.disType;
        return (
            <FormItem
                className={styles.pushedExplain}
                wrapperCol={{span:18}}
                labelCol={{ span: 5 }}
                label={SALE_LABEL.k5ezdxpr}
                validateStatus={this.state.freeAmountFlag && this.state.discountFlag ?'success':'error'}
                help={!this.state.freeAmountFlag ? SALE_LABEL.k5ez4rmr : !this.state.discountFlag ? SALE_LABEL.k5ezcavr : null}
            >
                <div className={[styles.flexFormItemNoMod, styles.radioInLine].join(' ')}>
                    <ButtonGroup size="small">
                        <Button  value="3" type={disType == '3' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('3')}>{k5ezcvbm}</Button>
                        <Button  value="1" type={disType == '1' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('1')}>{SALE_LABEL.k5ezcd0f}</Button>
                        <Button  value="2" type={disType == '2' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('2')}>{SALE_LABEL.k5ezcu1b}</Button>
                    </ButtonGroup>
                    <div style={{
                        display: 'inline-block',
                        width: '100px',
                        marginLeft: '10px'
                    }}>
                        {disType != 2 &&
                        <PriceInput
                            addonAfter={k5ezdbiy}
                            placeholder={disType == '1' ? k5ezcuto : k5ezcvbm}
                            value={{number: this.state.freeAmount}}
                            defaultValue={{number: this.state.freeAmount}}
                            onChange={this.handleFreeAmountChange}
                            maxNum={5}
                            modal="float"
                        />
                        }
                        {disType == 2 &&
                        <PriceInput
                            addonAfter={k5ezdc19}
                            discountMode={true}
                            value={{number: this.state.discountRate}}
                            placeholder={k5ezdckg}
                            defaultValue={{number: this.state.discountRate}}
                            onChange={this.handleDiscountRateChange}
                            maxNum={2}
                            modal="float"
                        />
                        }
                    </div>
                </div>
            </FormItem>
        )
    }

    renderAdvancedSettingButton() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.formItemForMore].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
            >
    <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    {SALE_LABEL.k5ezdx9f} {!this.state.display &&
                <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        const { ruleType } = this.state;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {ruleType === '2' || ruleType === '4' ? <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    : null}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),

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
