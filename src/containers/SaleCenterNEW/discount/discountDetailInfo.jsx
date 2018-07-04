
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
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];

const type = [
    { value: '0', name: '下单即折扣' },
    { value: '1', name: '任意菜品消费满' },
    { value: '2', name: '指定菜品消费满' },
]
const Option = Select.Option;

class DiscountDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            isDishVisibleIndex: '0',
            maxCount: 3,
            discount: '',
            discountFlag: true,
            ruleInfo: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: 0,
                    end: 0,
                },
            ],
            ruleType: '0',
            targetScope: '0',
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderRulesComponent = this.renderRulesComponent.bind(this);
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
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
        let { display } = this.state;
        display = !this.props.isNew;
        const _ruleType = _rule.stageType == '2' ? (_scopeLstLength == 0 ? '1' : '2') : '0';
        this.setState({
            display,
            ruleType: _ruleType,
            isDishVisibleIndex: _ruleType,
            ruleInfo: _rule.stage ? _rule.stage.map((stageInfo) => {
                // _rule.stage若不存在，则是下单即折扣end: _rule.discountRate*10
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
                end: Number((_rule.discountRate * 1).toFixed(3)).toString(),
            }],
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
            let { display } = this.state;
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
        } else if (ruleValidation && this.state.ruleType == '1' || this.state.ruleType == '2') {
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
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p> 可以采用下单即折扣、任意或指定消费满一定金额三种方式设置不同折扣</p>
                </FormItem>
                {this.renderRulesComponent()}
            </div>
        )
    }

    renderRulesComponent() {
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
                            style={{ marginLeft: '109px', width: '70.5%' }}
                        >
                            <CustomRangeInput
                                addonBefore={
                                    <Select
                                        size="default"
                                        placeholder="请选择活动类别"
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
                                endPlaceHolder="例如9.5折,8折"
                                discountMode={true}
                                relation={'折扣'}
                                addonAfterUnit={'折'}
                                disabled={this.state.ruleType == '0'}
                                value={
                                    _value
                                }
                                onChange={(value) => {
                                    this.onCustomRangeInputChange(value, index);
                                }
                                }
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
                    {this.state.isDishVisibleIndex !== '1' ? <PromotionDetailSetting /> : null}
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
)(Form.create()(DiscountDetailInfo));
