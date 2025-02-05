import React, { Component } from 'react'
import {
    Row,
    Col,
    Form,
    Select,
    Button,
    Tooltip,
    Radio,
    Icon
} from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import {saleCenterSetPromotionDetailAC} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
import { notValidDiscountNum } from "../../../containers/SaleCenterNEW/discount/discountDetailInfo.jsx";
import { handlerDiscountToParam } from '../../../containers/SaleCenterNEW/common/PriceInput';

const Immutable = require('immutable');
const ButtonGroup = Button.Group;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

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
            subRule: 1,
            priceType: '1',
            reduceLimitType: '1',
            reduceLimit: undefined
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleRuleTypeChange = this.handleRuleTypeChange.bind(this);
        this.handleStageAmountChange = this.handleStageAmountChange.bind(this);
        this.handleDisTypeChange = this.handleDisTypeChange.bind(this);
        this.handleDiscountRateChange = this.handleDiscountRateChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.onDiscountChange = this.onDiscountChange.bind(this);
        this.renderFoodNeedCalc = this.renderFoodNeedCalc.bind(this);
        this.handleChangeSubRule = this.handleChangeSubRule.bind(this);
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
        const subRule = (_rule || {}).subRule;
        const reduceLimit = (_rule || {}).reduceLimit;
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
            } else if (stageType == 21) {//同一菜品满
                ruleType = '5'
            } else {
                ruleType = '2'
            }
        } else {// 任意菜品
            if (stageType == 1) { // 每满
                ruleType = '3'
            } else if (stageType == 21) {//同一菜品满
                ruleType = '5'
            } else {
                ruleType = '1'
            }
        }
        if(reduceLimit){
            ruleType = '5'
        }
        this.setState({
            display,
            ruleType,
            reduceLimit,
            reduceLimitType: reduceLimit ? '2' : '1',
            subRule: subRule === undefined ? 1 : subRule,
            discountRate: _rule.discountRate ? Number((_rule.discountRate * 10).toFixed(3)).toString() : '',
            disType: _rule.disType ? String(_rule.disType) : '3',
            freeAmount: _rule.freeAmount ? String(_rule.freeAmount) : '',
            stageAmount: _rule.stageAmount ? String(_rule.stageAmount) : '',
            priceType: _rule.priceType ? String(_rule.priceType) : '',
        });
    }

    handleSubmit = () => {
        let {
            discountRate,
            freeAmount,
            stageAmount,
            disType,
            ruleType,
            subRule,
            priceType,
            reduceLimit
        } = this.state;
        let rule;
        let stageType;
        if (Number(stageAmount || 0) <= 0) {
            this.setState({
                stageAmountFlag: false
            });
            return
        }
        if (disType == 2) {
            if (notValidDiscountNum(discountRate)) {
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
        if(ruleType == "5"){
            stageType = "21";
        }else{
            if(ruleType === '1' || ruleType === '2'){
                stageType = "2";
            }else{
                stageType = "1";
            }
        }
        rule = {
            subRule,
            stageType: stageType,
            reduceLimit: ruleType !== '5' ? '' : reduceLimit,
            stage: [{
                    freeAmount,
                    disType,
                    stageAmount,
                    discountRate: disType == 2 ? String(Number(handlerDiscountToParam(discountRate))) : '',
                    priceType
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
        if (val == 1 || val == 3 || val == 5) {
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
        const discountFlag = !notValidDiscountNum(val.number);
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
        if (notValidDiscountNum(value)) {
            discountFlag = false;
            discount = value;
        } else {
            discountFlag = true;
            discount = value;
        }
        this.setState({ discount, discountFlag });
    }
    //低价促销支持配菜计算
    renderFoodNeedCalc(){
        const { user:{groupID} } = this.props;
        const {subRule} = this.state;
        return (
            <FormItem
                label={'配菜是否参与计算'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
            >
                <RadioGroup value={subRule} onChange={this.handleChangeSubRule} defaultValue={1}>
                    <Radio key={1} value={1}>参与</Radio>
                    <Radio key={0} value={0}>不参与</Radio>
                    <Tooltip title={'配菜包括配菜、做法加价等'}>
                        <Icon
                            type="question-circle-o"
                            className={styles.question}
                        />
                    </Tooltip>
                </RadioGroup>
            </FormItem>
        )
    }
    renderReduceLimit(){
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.explainBack, styles.pushedExplain].join(' ')}
                wrapperCol={{span: 16}}
                labelCol={{ span: 4 }}
                label={'同一商品每单'}
            >
                <PriceInput
                    addonBefore={
                        <div style={{
                            width: "200px"
                        }}>
                            <Select
                                size="default"
                                dropdownMatchSelectWidth={false}
                                onChange={this.handleReduceLimitTypeChange}
                                value={this.state.reduceLimitType}
                            >
                                <Option key="1" value='1'>不限制</Option>
                                <Option key="2" value='2'>限制</Option>
                            </Select>
                        </div>

                }
                    addonAfter={"份 享受特价"}
                    value={{number: this.state.reduceLimit}}
                    defaultValue={{number: this.state.reduceLimit}}
                    onChange={this.handleReduceLimitChange}
                    disabled={this.state.reduceLimitType === "1"}
                    maxNum={4}
                    modal="int"
                />
            </FormItem>
        )
    }
    handleChangeSubRule(e){
        const {target} = e;
        const {value} = target;
        this.setState({
            subRule:value
        })
    }
    handleReduceLimitTypeChange = (value) => {
        this.setState({
            reduceLimitType: value
        })
        if(value === "1"){
            this.setState({
                reduceLimit: undefined
            })
        }
    }
    handlePriceTypeChange = (value) => {
        this.setState({
            priceType: value
        })
    }
    handleReduceLimitChange = (e) => {
        const { number } = e;
        this.setState({
            reduceLimit: number
        })
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
                    <Col span={7} push={0.5}>
                        {this.renderStageAmount()}
                    </Col>
                    <Col span={17} push={0.5}>
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
                                <Option key="5" value='5'>同一菜品满</Option>
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
                wrapperCol={{span:17}}
                labelCol={{ span: 7 }}
                label={<div className={styles.priceTypeWrapper}>
                    <span>对</span>
                    <Select
                        size="default"
                        dropdownMatchSelectWidth={false}
                        onChange={this.handlePriceTypeChange}
                        value={this.state.priceType || "1"}
                    >
                        <Option key="1" value='1'>最低价</Option>
                        <Option key="2" value='2'>最高价</Option>
                    </Select>
                    <span>菜品</span>
                </div>}
                validateStatus={this.state.freeAmountFlag && this.state.discountFlag ?'success':'error'}
                help={!this.state.freeAmountFlag ? SALE_LABEL.k5ez4rmr : !this.state.discountFlag ? SALE_LABEL.k5ezcavr : null}
            >
                <div 
                    className={[styles.flexFormItemNoMod, styles.radioInLine].join(' ')} 
                    style={{display: 'flex', justifyContent: 'space-between'}}
                >
                    <ButtonGroup size="small">
                        <Button  value="3" type={disType == '3' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('3')}>{k5ezcvbm}</Button>
                        <Button  value="1" type={disType == '1' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('1')}>{SALE_LABEL.k5ezcd0f}</Button>
                        <Button  value="2" type={disType == '2' ? 'primary' : 'default'} onClick={() => this.handleDisTypeChange('2')}>{SALE_LABEL.k5ezcu1b}</Button>
                    </ButtonGroup>
                    <div style={{
                        flex: 1,
                        width: '150px',
                        marginLeft: '5px'
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
                                maxNum={3}
                                modal="float"
                                style={{width: '103px'}}
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
        const { ruleType, priceType } = this.state;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.renderFoodNeedCalc()}
                    {ruleType === '2' || ruleType === '4' || ruleType === '5' ? <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    : null}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                    {ruleType === '5' ? <div className={styles.logoGroupHeader} >点单限制</div> : null}
                    {ruleType === '5' ? this.renderReduceLimit() : null}
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
        user:state.user.get('accountInfo').toJS()
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
