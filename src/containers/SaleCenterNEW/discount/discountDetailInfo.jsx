


import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, InputNumber, Input, Icon } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import NoThresholdDiscountFoodSelector from './NoThresholdDiscountFoodSelector'
import NoThresholdDiscountFoodSelectorForShop from './NoThresholdDiscountFoodSelectorForShop'
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
import { handlerDiscountToParam } from '../../../containers/SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
const Immutable = require('immutable');
const Option = Select.Option;
const isValidNumber = (value) => value != null && value != '' && !Number.isNaN(value);

export const notValidDiscountNum = (strNum) => {
    if(typeof strNum == 'string'){
        if(+strNum !== +strNum){
            return true;
        }
        if(strNum.indexOf('.') == -1){
            // 没有小数点
           return strNum > 100 || (strNum.length > 1 && strNum[0] == 0) || strNum < 0;
        }else{
            let index = strNum.indexOf('.');
            // 有小数点
            if(strNum > 0 && strNum < 10){
                return strNum.length > 3;
            }else if(strNum > 10){
                return strNum.length > 4;
            }
            return strNum[0] == 0 || index != strNum.lastIndexOf('.');
       }
    }
    return false;
}

@injectIntl()
class DiscountDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: !this.props.isNew,
            maxCount: 3,
            discountFlag: true,
            ...this.initState(),
        };
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.onDiscountChange = this.onDiscountChange.bind(this);
    }

    initState = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return {
                discount: '',
                ruleInfo: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: 0,
                        end: 0,
                    },
                ],
                ruleType: '0',
                isDishVisibleIndex: '0',
                targetScope: '0',
            };
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        const _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']);
        const _scopeLstLength = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().length;
        const _ruleType = _rule.stageType == '2' ? (_scopeLstLength == 0 ? '1' : '2') : '0';
        return {
            ruleType: _ruleType,
            isDishVisibleIndex: _ruleType,
            ruleInfo: _rule.stage ? _rule.stage.map((stageInfo) => {
                // _rule.stage若不存在，则是下单即折扣end: _rule.discountRate*10
                return {
                    start: stageInfo.stageAmount,
                    end: Number((stageInfo.discountRate * 10).toFixed(3)).toString(),
                    validationStatus: 'success',
                    helpMsg: null,
                }
            }) : [{
                validationStatus: 'success',
                helpMsg: null,
                start: null,
                end: Number((_rule.discountRate * 10).toFixed(3)).toString(),
            }],
            discount: _rule.discountRate ? Number((_rule.discountRate * 10).toFixed(3)).toString() : '',
            targetScope: _categoryOrDish,
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleSubmit = (cbFn) => {
        let { discount, discountFlag, ruleInfo } = this.state;
        let rule;
        if (!isValidNumber(discount)) {
            discountFlag = false;
        }
        let nextFlag = true;
        const ruleValidation = ruleInfo.reduce((p, c) => {
            if (this.state.ruleType == '0') {
                if (!isValidNumber(c.end)) {
                    c.validationStatus = 'error';
                    c.helpMsg = SALE_LABEL.k5gez9pw;
                }
            } else {
                if (!isValidNumber(c.start) || !isValidNumber(c.end)) {
                    c.validationStatus = 'error';
                    c.helpMsg = SALE_LABEL.k5gez9pw;
                }
            }
            return p && c.validationStatus === 'success';
        }, true);
        this.setState({ruleInfo, discount, discountFlag})
        if (discountFlag && this.state.ruleType == '0') {
            rule = {
                stageType: this.state.ruleType,
                targetScope: this.state.targetScope,
                discountRate: handlerDiscountToParam(this.state.discount),
            };
            this.props.setPromotionDetail({
                rule,
            });
        } else {
            if (ruleValidation && (this.state.ruleType == '1' || this.state.ruleType == '2')) {
                rule = {
                    stageType: '2',
                    stage: this.state.ruleInfo.map((ruleInfo) => {
                        return {
                            targetScope: this.state.targetScope,
                            stageAmount: ruleInfo.start,
                            discountRate: handlerDiscountToParam(ruleInfo.end),
                        }
                    }),
                }
                this.props.setPromotionDetail({
                    rule,
                });
            } else {
                nextFlag = false;
            }
        }
        return nextFlag;
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    onCustomRangeInputChange(value, index) {
        const _start = value.start;
        const _end = value.end;
        let _validationStatus,
            _helpMsg;

        if(notValidDiscountNum(_end)){
            _validationStatus = 'error';
            _helpMsg = SALE_LABEL.k5gez9pw
        }else {
            _validationStatus = 'success';
            _helpMsg = null
        }

        // if (parseFloat(_end) <= 10 || (_start == null && _end != null) || (_start != null && _end == null)) {
        //     _validationStatus = 'success';
        //     _helpMsg = null
        // } else {
        //     _validationStatus = 'error';
        //     _helpMsg = SALE_LABEL.k5gez9pw
        // }
        
        // if (_end > 10) {
        //     _validationStatus = 'error';
        //     _helpMsg = SALE_LABEL.k5gez9pw
        // }

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
        if (notValidDiscountNum(value)) {
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
                <p>{SALE_LABEL.k5gfcri5}</p>
                </FormItem>
                {this.renderRulesComponent()}
            </div>
        )
    }

    renderRulesComponent = () => {
        const { intl } = this.props;
        const k5gez90v = intl.formatMessage(SALE_STRING.k5gez90v);
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k5ezdckg = intl.formatMessage(SALE_STRING.k5ezdckg);

        const type = [
            { value: '0', name: k5gez90v },
            { value: '1', name: k5ez4ovx },
            { value: '2', name: k5ez4pvb },
        ];
        return (this.state.ruleInfo.map((ruleInfo, index) => {
            const _value = {
                start: null,
                end: null,
            };
            if (ruleInfo.start) {
                _value.start = ruleInfo.start;
            }
            if (ruleInfo.end) {
                _value.end = ruleInfo.end;
            }
            return (
                <Row key={index}>
                    <Col>
                        <FormItem
                            label=""
                            className={styles.FormItemStyle}
                            // labelCol={{span: 4}}
                            // wrapperCol={{span: 17}}
                            validateStatus={ruleInfo.validationStatus}
                            help={ruleInfo.helpMsg}
                            style={{ marginLeft: '96px', width: '90%' }}
                        >
                            <CustomRangeInput
                                addonBefore={
                                    <Select
                                        size="default"
                                        placeholder=""
                                        className={`${styles.linkSelectorRight} discountDetailMountClassJs`}
                                        getPopupContainer={(node) => node.parentNode}
                                        value={this.state.ruleType}
                                        onChange={(val) => {
                                            let { ruleType, maxCount, isDishVisibleIndex } = this.state;
                                            ruleType = val;
                                            isDishVisibleIndex = val;
                                            const _tmp = this.state.ruleInfo;
                                            _tmp.length = 1;
                                            _tmp[0] = {
                                                start: '',
                                                end: '',
                                                validationStatus: 'success',
                                                helpMsg: null,
                                            };
                                            if (val == '0') {
                                                maxCount = 1;
                                            } else {
                                                maxCount = 3;
                                            }
                                            if (val == '1') {
                                                this.props.setPromotionDetail({
                                                    // i清空已选,
                                                    scopeLst: [],
                                                    dishes: [],
                                                    priceLst: [],
                                                    foodCategory: [],
                                                    excludeDishes: [],
                                                });
                                            }
                                            this.setState({
                                                ruleType,
                                                maxCount,
                                                isDishVisibleIndex,
                                                ruleInfo: _tmp,
                                            });
                                        }}
                                    >
                                        {type
                                            .map((type) => {
                                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                                            })
                                        }
                                    </Select>
                                }
                                endPlaceHolder={k5ezdckg}
                                discountMode={true}
                                relation={this.state.ruleType == '0' ? SALE_LABEL.k5gez998 : SALE_LABEL.k5ezcu1b}
                                addonAfterUnit={k5ezdc19}
                                disabled={this.state.ruleType == '0'}
                                value={_value}
                                onChange={(value) => {
                                    this.onCustomRangeInputChange(value, index);
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        {this.state.ruleType == '0' ? null : this.renderOperationIcon(index)}
                    </Col>

                </Row>

            )
        }))
    }

    addRule() {
        const _tmp = this.state.ruleInfo;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            start: 0,
            end: 0,
        });

        this.setState({
            'ruleInfo': _tmp,
        }, () => {
            const onChange = this.props.onChange;
            if (onChange) {
                onChange(Object.assign({}, { type: this.state.ruleType, data: this.state.ruleInfo }));
            }
        });
    }

    deleteRule(index, e) {
        const _tmp = this.state.ruleInfo;
        _tmp.splice(index, 1);

        this.setState({
            'ruleInfo': _tmp,
        }, () => {
            const onChange = this.props.onChange;
            if (onChange) {
                onChange(Object.assign({}, { type: this.state.ruleType, data: this.state.ruleInfo }));
            }
        })
    }

    renderOperationIcon(index) {
        const _len = this.state.ruleInfo.length;
        //
        if (this.state.maxCount == 1) {
            return null;
        }

        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule} />
                </span>
            )
        }

        if (_len == this.state.maxCount && index == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon
                        className={styles.deleteIconLeft}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteRule(_index, e)
                        }}
                    />
                </span>
            )
        }
        if (index == _len - 1 && _len == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteRule(_index, e)
                        }}
                    />
                </span>
            )
        }
        return null;
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
        const payLimit = this.state.ruleType != 0;
        let component;
        if (this.state.ruleType == '0') {
            component = this.props.isShopFoodSelectorMode ? NoThresholdDiscountFoodSelectorForShop :
                NoThresholdDiscountFoodSelector;
        }
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.state.isDishVisibleIndex !== '1' ?
                        <ConnectedScopeListSelector
                            component={component}
                            isShopMode={this.props.isShopFoodSelectorMode}
                        />
                    : null}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={payLimit} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
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
)(Form.create()(DiscountDetailInfo));
