
/**
 * @Author: chenshuang
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T13:46:08+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import {
    Form,
    Radio,
} from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Immutable = require('immutable');

const RadioGroup = Radio.Group;

@injectIntl()
class RandomCutDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            maxCount: 1,
            ruleType: '0',
            priceRule: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null,
                },
            ],
            billRule: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null,
                },
            ],

            priceValue: null,
            billValue: null,
            unitType: '1',
        };
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.onPriceInputChange = this.onPriceInputChange.bind(this);
        this.onBillInputChange = this.onBillInputChange.bind(this);
        this.onRuleTypeChange = this.onRuleTypeChange.bind(this);
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
        if (_rule.randomType == 'RATIO') {
            this.setState({
                ruleType: '1',
                billRule: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: _rule.randomMin || null,
                        end: _rule.randomMax || null,
                    },
                ],
                billValue: _rule.stageAmount,
                unitType: _rule.randomUnit || '1',
            });
        } else {
            this.setState({
                ruleType: '0',
                priceRule: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: _rule.randomMin || null,
                        end: _rule.randomMax || null,
                    },
                ],
                priceValue: _rule.stageAmount,
                unitType: _rule.randomUnit || '1',
            });
        }
        let { display } = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
        });
    }

    handleSubmit = (cbFn) => {
        const { priceRule, billRule, ruleType, priceValue, billValue, unitType } = this.state;
        let billRuleValidation = false;
        let priceRuleValidation = false;
        let rule;
        if (ruleType == '1') {
            billRuleValidation = billRule.reduce((p, c) => {
                if (c.start === null || c.end === null || c.start === '' || c.end === '' || Number.isNaN(c.start) || Number.isNaN(c.end)) {
                    c.validationStatus = 'error';
                    c.helpMsg = SALE_LABEL.k67g8jka;
                }
                return p && c.validationStatus === 'success';
            }, true);
            rule = {
                randomType: 'RATIO',
                stageAmount: billValue == null ? 0 : parseFloat(billValue),
                randomMin: billRule[0].start,
                randomMax: billRule[0].end,
            };
        } else {
            priceRuleValidation = priceRule.reduce((p, c) => {
                if (c.start === null || c.end === null || c.start === '' || c.end === '' || Number.isNaN(c.start) || Number.isNaN(c.end)) {
                    c.validationStatus = 'error';
                    c.helpMsg = SALE_LABEL.k67g8jka;
                }
                return p && c.validationStatus === 'success';
            }, true);
            rule = {
                randomType: 'AMOUNT',
                stageAmount: priceValue == null ? 0 : parseFloat(priceValue),
                randomMin: priceRule[0].start,
                randomMax: priceRule[0].end,
                randomUnit: unitType,
            };
        }
        if (billRuleValidation || priceRuleValidation) {
            this.props.setPromotionDetail({
                rule,
            });
            return true;
        }
        // TODO: add a message tips here
        this.setState({ billRule, priceRule });
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    fixed(_val) {
        if (!_val) return;
        const val = _val.split('.');
        return this.state.unitType == 1 ? val[0] : this.state.unitType == 100 ? _val :
            _val.indexOf('.') > -1 ? (val[1] ? `${val[0]}.${val[1][0]}` : `${val[0]}.`) : _val
    }

    onPriceInputChange(value) {
        const priceRule = this.state['priceRule'][0];
        this.setState({
            priceValue: value.number,
        }, () => {
            this.checkStatus(priceRule.start, priceRule.end, 0, 'priceRule');
        });
    }
    onBillInputChange(value) {
        this.setState({
            billValue: value.number,
        });
    }
    onRuleTypeChange(e) {
        let { ruleType, priceRule, billRule } = this.state;
        ruleType = e.target.value;
        if (ruleType == '0') {
            billRule[0].validationStatus = 'success';
            billRule[0].helpMsg = null;
        } else {
            priceRule[0].validationStatus = 'success';
            priceRule[0].helpMsg = null;
        }
        this.setState({ ruleType, priceRule, billRule });
    }
    renderPromotionRule = () => {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k67g8l6n = intl.formatMessage(SALE_STRING.k67g8l6n);
        const k67g8lez = intl.formatMessage(SALE_STRING.k67g8lez);
        const k67g8lnb = intl.formatMessage(SALE_STRING.k67g8lnb);
        const unitTypeType = [
            { value: '1', name: k5ezdbiy },
            { value: '10', name: k67g8lez },
            { value: '100', name: k67g8lnb },
        ];

        const randomType = [
            {
                value: '0',
                name: SALE_LABEL.k67g8jsm,
                content: (
                    <div className={styles.radioChild}>
                        <FormItem className={[styles.FormItemStyle, styles.priceInput].join(' ')} wrapperCol={{ span: 21 }}>
                            <PriceInput
                                addonBefore={SALE_LABEL.k5nh214x}
                                addonAfter={k5ezdbiy}
                                onChange={this.onPriceInputChange}
                                value={{ number: this.state.priceValue }}
                                defaultValue={{ number: this.state.priceValue }}
                                modal="float"
                            />
                        </FormItem>

                        {this.renderRulesComponent('priceRule', k67g8l6n, SALE_LABEL.k67g8k9b, k5ezdbiy, k5ezdbiy)}

                        <FormItem label={SALE_LABEL.k67g8khn} className={[styles.FormItemStyle, styles.unitType].join(' ')} labelCol={{ span: 4 }} wrapperCol={{ offset: 1, span: 18 }}>
                            <RadioGroup
                                value={this.state.unitType}
                                onChange={(e) => {
                                    let { unitType, priceRule } = this.state;
                                    unitType = e.target.value
                                    this.setState({ unitType }, () => {
                                        priceRule.map((price) => {
                                            price.start = price.start ? this.fixed(price.start) : '';
                                            price.end = price.end ? this.fixed(price.end) : '';
                                        })
                                        this.setState({ priceRule })
                                    });
                                }}
                            >
                                {
                                    unitTypeType
                                        .map((unitType) => {
                                            return <Radio key={unitType.value} value={unitType.value}>{unitType.name}</Radio>
                                        })
                                }
                            </RadioGroup>
                        </FormItem>
                    </div>
                ),
            },
            {
                value: '1',
                name: SALE_LABEL.k67g8k0y,
                content: (
                    <div className={styles.radioChild}>
                        <FormItem className={[styles.FormItemStyle, styles.priceInput].join(' ')} wrapperCol={{ span: 21 }}>
                            <PriceInput
                                addonBefore={SALE_LABEL.k5nh214x}
                                addonAfter={k5ezdbiy}
                                onChange={this.onBillInputChange}
                                value={{ number: this.state.billValue }}
                                modal="float"
                            />
                        </FormItem>
                        {this.renderRulesComponent('billRule', k67g8l6n, SALE_LABEL.k67g8kpz, '%', '%')}

                    </div>
                ),
            },
        ];
        return (
            <div className={styles.randomRule}>
                <FormItem label={SALE_LABEL.k67g8kyb} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <RadioGroup
                        value={this.state.ruleType}
                        onChange={this.onRuleTypeChange}
                    >
                        {randomType
                            .map((type) => {
                                return (<Radio style={{ display: 'block' }} key={type.value} value={type.value}>
                                    {type.name}
                                    {type.content}
                                </Radio>)
                            })
                        }
                    </RadioGroup>
                </FormItem>


            </div>
        )
    }
    onCustomRangeInputChange(value, index, ruleName) {
        const _start = ruleName == 'priceRule' ? this.fixed(value.start) : value.start;
        const _end = ruleName == 'priceRule' ? this.fixed(value.end) : value.end;
        this.checkStatus(_start, _end, index, ruleName);
    }
    checkStatus = (start, end, index, ruleName) => {
        const priceValue = this.state.priceValue;
        const _tmp = this.state[ruleName];
        const condition = ruleName == 'priceRule' ?
            ((parseFloat(start) <= parseFloat(end)) && (!Number.isNaN(start)) && (!Number.isNaN(end))
                && (!priceValue || (priceValue && parseFloat(start) <= parseFloat(priceValue) && parseFloat(end) <= parseFloat(priceValue)))) :
            ((parseFloat(start) <= parseFloat(end) && parseFloat(start) <= 100 && parseFloat(end) <= 100) ||
                (parseFloat(start <= 100) && Number.isNaN(end)) || (Number.isNaN(start) && parseFloat(end) <= 100));

        let _validationStatus,
            _helpMsg;
        // TODO:刚输入的时候就报错
        if (condition) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = SALE_LABEL.k67g8jka
        }

        _tmp[index] = {
            start: start,
            end: end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        this.setState({ [ruleName]: _tmp });
    }
    renderRulesComponent(ruleName, relation, addonBefore, addonAfter, addonAfterunitType) {
        return (this.state[ruleName].map((rule, index) => {
            const _value = {
                start: null,
                end: null,
            };
            if (rule.start) {
                _value.start = rule.start;
            }
            if (rule.end) {
                _value.end = rule.end;
            }

            return (

                <FormItem
                    key={index}
                    className={styles.FormItemStyle}
                    wrapperCol={{ span: 21 }}
                    validateStatus={rule.validationStatus}
                    help={rule.helpMsg}
                >

                    <CustomRangeInput
                        relation={relation}
                        addonAfter={addonAfter}
                        addonBefore={addonBefore}
                        addonAfterUnit={addonAfterunitType}
                        value={
                            _value
                        }
                        onChange={(value) => {
                            const _index = index;
                            this.onCustomRangeInputChange(value, index, ruleName);
                        }
                        }
                    />
                </FormItem>

            )
        }))
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
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={true} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
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
)(Form.create()(RandomCutDetailInfo));
