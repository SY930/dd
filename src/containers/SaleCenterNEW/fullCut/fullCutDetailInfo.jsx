import React, { Component } from 'react'
import { Row, Col, Form, Select, Tooltip, Icon } from 'antd';
import { connect } from 'react-redux'


import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Immutable = require('immutable');

@injectIntl()
class FullCutDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        const {
            display,
            ruleType,
            ruleInfo,
            maxCount,
        } = this.initState();
        this.state = {
            display,
            ruleType,
            // 最多创建的档
            maxCount: props.isOnline ? 5 : maxCount,
            ruleInfo,
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderRulesComponent = this.renderRulesComponent.bind(this);
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    componentDidMount() {
        // this.props.getSubmitFn(this.handleSubmit);
        this.props.getSubmitFn({
            finish: this.handleSubmit,
            prev: this.handlePrev,
        });
    }
    initState = () => {
        if (this.props.isNew) {
            return {
                display: false,
                ruleType: '2',
                maxCount: 3,
                ruleInfo: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: null,
                        end: null,

                    },
                ],
            }
        }
        // restore data from redux to state
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        let ruleInfo,
            ruleType,
            maxCount;
        const display = !this.props.isNew;
        if (_rule.stage !== undefined && _rule.stage instanceof Array) {
            ruleInfo = _rule.stage.map((stageInfo) => {
                return {
                    start: stageInfo.stageAmount,
                    end: stageInfo.freeAmount,
                    validationStatus: 'success',
                    helpMsg: null,
                }
            });
            maxCount = 3;
        } else {
            // 初始值
            ruleInfo = [{
                start: _rule.stageAmount,
                end: _rule.freeAmount,
                validationStatus: 'success',
                helpMsg: null,
            }];
            maxCount = 1
        }
        // 根据菜单列表是否为空，将每满分为任意和指定，满分为任意和指定
        if (_rule.stageType == '1') {
            ruleType = _scopeLst.size == 0 ? '1' : '4';
        } else {
            ruleType = _scopeLst.size == 0 ? '2' : '3';
        }
        return {
            display,
            ruleType,
            ruleInfo,
            maxCount,
        }
    }

    handlePrev(cb, index) {
        return true
    }

    // next is 0, finish is 1
    handleSubmit() {
        const { ruleInfo, ruleType } = this.state;
        const ruleValidation = ruleInfo.reduce((p, c, index, arr) => {
            if (c.start === null || c.end === null || c.start == '' || c.end == '' || Number.isNaN(c.start) || Number.isNaN(c.end) || Number(c.start) < Number(c.end)) {
                c.validationStatus = 'error';
                c.helpMsg = SALE_LABEL.k5gdz0vu;
                return false;
            }
            if (index > 0 && (Number(c.start) <= Number(arr[index - 1].start) || Number(c.end) <= Number(arr[index - 1].end))) {
                c.validationStatus = 'error';
                c.helpMsg = SALE_LABEL.k5gdz146;
                return false;
            }
            return p && c.validationStatus === 'success';
        }, true);


        // construct state to specified format
        let rule;
        if (ruleType == '2' || ruleType == '3') {
            rule = {
                stageType: 2,
                stage: this.state.ruleInfo.map((ruleInfo) => {
                    return {
                        stageAmount: ruleInfo.start,
                        freeAmount: ruleInfo.end,
                    }
                }),
            }
        } else {
            rule = {
                stageType: 1,
                stageAmount: ruleInfo[0].start,
                freeAmount: ruleInfo[0].end,
            }
        }
        // save state to redux
        if (ruleValidation) {
            this.props.setPromotionDetail({
                rule,
            });
            return true;
        }
        // TODO: add a message tips here
        this.setState({ ruleInfo });
    }

    onChangeClick = () => {
        this.setState({
            display: !this.state.display,
        });
    };
    onCustomRangeInputChange(value, index) {
        const _start = value.start;
        const _end = value.end;
        let _validationStatus,
            _helpMsg;
        if (parseFloat(_start) >= parseFloat(_end) || (_start == null && _end != null) || (_start != null && _end == null)) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = SALE_LABEL.k5gdz0vu
        }
        const _tmp = this.state.ruleInfo;
        if (
            _validationStatus === 'success' &&
            _start && _end &&
            index > 0 &&
            (Number(_start) <= Number(_tmp[index - 1].start) || Number(_end) <= Number(_tmp[index - 1].end))
        ) {
            _validationStatus = 'error';
            _helpMsg = SALE_LABEL.k5gdz146
        }
        if (
            _validationStatus === 'success' &&
            index > 0 && (_tmp.length > index + 1) &&
            _start && _end && _tmp[index + 1].start && _tmp[index + 1].end &&
            (Number(_start) >= Number(_tmp[index + 1].start) || Number(_end) >= Number(_tmp[index + 1].end))
        ) {
            _tmp[index + 1] = {
                ..._tmp[index + 1],
                validationStatus: 'error',
                helpMsg: SALE_LABEL.k5gdz146,
            };
        }
        _tmp[index] = {
            start: _start,
            end: _end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        this.setState({ ruleInfo: _tmp });
    }

    renderPromotionRule() {
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k5ez4n7x}
                    className={styles.FormItemStyle}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                >
                <p>{SALE_LABEL.k5gdz1ci}</p>
                </FormItem>
                {
                    this.renderRulesComponent()
                }

            </div>
        )
    }

    renderRulesComponent = () => {
        const { intl } = this.props;
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);

        const type = [
            {
                value: '2',
                name: k5ez4ovx,
            },
            {
                value: '1',
                name: k5ez4pdf,
            },
            {
                value: '3',
                name: k5ez4pvb,
            },
            {
                value: '4',
                name: k5ez4qew,
            },
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
                            validateStatus={ruleInfo.validationStatus}
                            help={ruleInfo.helpMsg}
                            style={{ width: '85%', marginLeft: '40px' }}
                        >
                            <CustomRangeInput
                                addonBefore={
                                    <Select
                                        size="default"
                                        className={styles.linkSelectorRight}
                                        getPopupContainer={(node) => node.parentNode}
                                        value={`${this.state.ruleType}`}
                                        onChange={(val) => {
                                            let { ruleType, maxCount } = this.state;
                                            ruleType = val;
                                            if (val == '1' || val == '4') {
                                                maxCount = 1;
                                                this.state.ruleInfo.length = 1;
                                            } else {
                                                maxCount = 3
                                            }
                                            if (val == '1' || val == '2') {
                                                this.props.setPromotionDetail({
                                                    // i清空已选,
                                                    scopeLst: [],
                                                    dishes: [],
                                                    priceLst: [],
                                                    foodCategory: [],
                                                    excludeDishes: [],
                                                });
                                            }
                                            this.setState({ ruleType, maxCount });
                                        }
                                        }
                                    >
                                        {type.map((type, index) => {
                                            return <Option style={{width:'120px'}} key={`options-${index}`} value={type.value}>{type.name}</Option>
                                        })}
                                    </Select>
                                }
                                value={
                                    _value
                                }
                                onChange={(value) => 
                                    {
                                        this.onCustomRangeInputChange(value, index);
                                    }
                                }
                                addonAfterUnit='元'
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        { this.renderOperationIcon(index)}
                    </Col>

                </Row>

            )
        }))
    }
    renderOnlinePromotionRule() {
        return (this.state.ruleInfo.map((ruleInfo, index) => {
            const _value = {
                start: ruleInfo.start || null,
                end: ruleInfo.end || null,
            };
            return (
                <Row key={index}>
                    <Col>
                        <FormItem
                            label=""
                            className={styles.FormItemStyle}
                            validateStatus={ruleInfo.validationStatus}
                            help={ruleInfo.helpMsg}
                            style={{ marginLeft: '109px', width: '70.5%' }}
                        >
                            <CustomRangeInput
                                value={_value}
                                onChange={(value) => {
                                    this.onCustomRangeInputChange(value, index);
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        { this.renderOperationIcon(index)}
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
            start: null,
            end: null,
        });

        this.setState({
            'ruleInfo': _tmp,
        });
    }

    deleteRule(index, e) {
        const _tmp = this.state.ruleInfo;
        _tmp.splice(index, 1);

        this.setState({
            'ruleInfo': _tmp,
        });
    }

    renderOperationIcon(index) {
        const _len = this.state.ruleInfo.length;
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
        if (index == _len - 1 && _len < this.state.maxCount) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} type="plus-circle-o" onClick={this.addRule} />
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
                wrapperCol={{
                    span: 17,
                    offset: 4,
                }}
            >
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }
    render() {
        const { isOnline } = this.props;
        if (isOnline) {
            return (
                <Form className={styles.FormStyle}>
                    <FormItem
                        label={
                            <span>
                                {SALE_LABEL.k5gdz1t6}&nbsp;
                                <Tooltip title={SALE_LABEL.k5gdz1ku}>
                                    <Icon type="question-circle-o"></Icon>
                                </Tooltip>
                            </span>
                        }
                        className={styles.FormItemStyle}
                        labelCol={{span: 4}}
                        wrapperCol={{ span: 17 }}
                    >

                    </FormItem>
                    {this.renderOnlinePromotionRule()}
                </Form>
            )
        }
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.state.ruleType != '1' && this.state.ruleType != '2' ?
                        (
                            <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                        ) : null
                    }
                    {this.renderAdvancedSettingButton()}
                    {this.state.display
                        ? <AdvancedPromotionDetailSetting payLimit={true} />
                        : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FullCutDetailInfo));
