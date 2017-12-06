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
import { Row, Col, Form, Select, Icon } from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}
const Immutable = require('immutable');

const FormItem = Form.Item;
const Option = Select.Option;

const client = [
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];
const RULE_TYPE = [
    { key: '0', value: '任意消费满' },
    { key: '1', value: '任意消费每满' },
    { key: '2', value: '指定菜品消费满' },
    { key: '3', value: '指定菜品消费每满' },
];


class BuyAFreeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            data: [
                {
                    stageAmount: '',
                    freeAmount: '',
                    stageAmountFlag: true,
                    freeAmountFlag: true,
                },
            ],
            ruleType: '0',
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onFreeAmountChange = this.onFreeAmountChange.bind(this);
        this.ruleTypeChange = this.ruleTypeChange.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.addRule = this.addRule.bind(this);
        this.renderRules = this.renderRules.bind(this);
        this.renderOperationIcon = this.renderOperationIcon.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let { display, data } = this.state;
        display = !this.props.isNew;
        const _ruleType = _rule.stage ? (
            _scopeLst.length > 0 ? '2' : '0'
        ) : (
            _scopeLst.length > 0 ? '3' : '1'
        )

        if (_rule.stage) {
            data = _rule.stage.map((rule) => {
                return {
                    stageAmount: rule.stageAmount || '',
                    freeAmount: rule.freeAmount || '',
                    stageAmountFlag: true,
                    freeAmountFlag: true,
                }
            })
        } else {
            data = [{
                stageAmount: _rule.stageAmount || '',
                freeAmount: _rule.freeAmount || '',
                stageAmountFlag: true,
                freeAmountFlag: true,
            }];
        }

        // 根据ruleJson填充页面
        this.setState({
            display,
            ruleType: _ruleType,
            data,
        });
    }

    handleSubmit = () => {
        let { data, ruleType } = this.state;
        let nextFlag = true;
        data = data.map((rule, idx) => {
            if (rule.stageAmount == null || rule.stageAmount === '' || rule.freeAmount > rule.stageAmount) {
                rule.stageAmountFlag = false;
                nextFlag = false;
            }
            if (rule.freeAmount == null || rule.freeAmount === '' || rule.freeAmount > rule.stageAmount) {
                rule.freeAmountFlag = false;
                nextFlag = false;
            }
            return rule;
        });
        this.setState({ data });

        if (nextFlag) {
            let rule;
            if (ruleType == '0' || ruleType == '2') {
                rule = {
                    stageType: 2,
                    stage: data.map((rule) => {
                        return {
                            stageAmount: rule.stageAmount,
                            freeAmount: rule.freeAmount,
                        }
                    }),
                }
            } else {
                rule = {
                    stageType: 1,
                    stageAmount: data[0].stageAmount,
                    freeAmount: data[0].freeAmount,
                }
            }
            if (ruleType == '0' || ruleType == '1') {
                this.props.setPromotionDetail({
                    rule,
                    scopeLst: [],
                    dishes: [],
                    excludeDishes: [],
                    foodCategory: [],
                });
            } else {
                this.props.setPromotionDetail({
                    rule,
                });
            }
        }
        return nextFlag;
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    onStageAmountChange(value, idx) {
        const { data } = this.state;
        let stageAmount,
            stageAmountFlag;
        if (value.number == null || value.number === '' || value.number < data[idx].freeAmount) {
            stageAmountFlag = false;
            stageAmount = value.number;
        } else {
            stageAmountFlag = true;
            stageAmount = value.number;
        }
        data[idx].stageAmount = stageAmount;
        data[idx].stageAmountFlag = stageAmountFlag;
        this.setState({ data });
    }

    onFreeAmountChange(value, idx) {
        const { data } = this.state;
        let freeAmountFlag,
            freeAmount;
        if (value.number == null || value.number === '' || value.number > data[idx].stageAmount) {
            freeAmountFlag = false;
            freeAmount = value.number;
        } else {
            freeAmountFlag = true;
            freeAmount = value.number;
        }
        data[idx].freeAmount = freeAmount;
        data[idx].freeAmountFlag = freeAmountFlag
        this.setState({ data });
    }

    addRule() {
        const _tmp = this.state.data;
        _tmp.push({
            stageAmount: '',
            freeAmount: '',
            stageAmountFlag: true,
            freeAmountFlag: true,
        });

        this.setState({
            data: _tmp,
        });
    }

    deleteRule(index) {
        const _tmp = this.state.data;
        _tmp.splice(index, 1);

        this.setState({
            data: _tmp,
        });
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
    ruleTypeChange(val) {
        let data = this.state.data;
        if (val == '1' || val == '3') {
            data = [
                {
                    stageAmount: '',
                    freeAmount: '',
                    stageAmountFlag: true,
                    freeAmountFlag: true,
                },
            ];
        }
        this.setState({ ruleType: val, data })
    }

    renderOperationIcon(index) {
        const _len = this.state.data.length;
        if (this.state.ruleType == '0' || this.state.ruleType == '2') {
            if (_len == 1) {
                return (
                    <span className={styles.iconsStyle}>
                        <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule} />
                    </span>
                )
            }

            if (_len == 3 && index == 2) {
                return (
                    <span className={styles.iconsStyle}>
                        <Icon
                            className={styles.deleteIconLeft}
                            type="minus-circle-o"
                            onClick={(e) => {
                                const _index = index;
                                this.deleteRule(_index)
                            }}
                        />
                    </span>
                )
            }
            if (_len < 3 && index !== 0) {
                return (
                    <span className={styles.iconsStyle}>
                        <Icon
                            className={styles.pulsIcon}
                            disabled={false}
                            type="plus-circle-o"
                            onClick={this.addRule}
                        />
                        <Icon
                            className={styles.deleteIcon}
                            type="minus-circle-o"
                            onClick={(e) => {
                                const _index = index;
                                this.deleteRule(_index)
                            }}
                        />
                    </span>
                )
            }
        } else {
            return null;
        }
    }

    renderRules() {
        return this.state.data.map((rule, idx) => {
            return (
                <Row key={`row${idx}`}>
                    <Col span={17} offset={4}>
                        <Col span={14}>
                            <FormItem
                                className={[styles.selectInInput, styles.FormItemStyle, styles.explainBack].join(' ')}
                                wrapperCol={{ span: 24 }}
                                validateStatus={rule.stageAmountFlag ? 'success' : 'error'}
                                help={rule.stageAmountFlag ? null : '请输入不小于免费数的值'}
                            >

                                <PriceInput
                                    addonBefore={
                                        idx == 0 ? (
                                            <Select size="default" onChange={this.ruleTypeChange} value={this.state.ruleType}>
                                                {
                                                    RULE_TYPE.map((item) => {
                                                        return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                                                    })
                                                }
                                            </Select>
                                        ) : (
                                            <span style={{ textAlign: 'left', paddingLeft: 7, display: 'inherit' }}>
                                                {RULE_TYPE[parseInt(this.state.ruleType)].value}
                                            </span>
                                        )
                                    }
                                    addonAfter={'份'}
                                    value={{ number: rule.stageAmount }}
                                    defaultValue={{ number: rule.stageAmount }}
                                    onChange={(val) => { this.onStageAmountChange(val, idx) }}
                                    modal="int"
                                />

                            </FormItem>
                        </Col>
                        <Col span={9} offset={1}>
                            <FormItem
                                className={styles.FormItemStyle}
                                wrapperCol={{ span: 24 }}
                                validateStatus={rule.freeAmountFlag ? 'success' : 'error'}
                                help={rule.freeAmountFlag ? null : '输入不大于购买数的值'}
                            >

                                <PriceInput
                                    addonBefore={'免'}
                                    addonAfter={'份最低价菜品'}
                                    className={styles.PriceInputContent}
                                    value={{ number: rule.freeAmount }}
                                    defaultValue={{ number: rule.freeAmount }}
                                    onChange={(val) => { this.onFreeAmountChange(val, idx) }}
                                    modal="int"
                                />

                            </FormItem>
                        </Col>
                    </Col>
                    <Col>
                        {this.renderOperationIcon(idx)}
                    </Col>
                </Row>
            )
        })
    }

    render() {
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <FormItem
                        label="活动方式"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <p>
                            任意或指定消费满或每满一定份数菜品,即可在已选购菜品中对一定分数的最低价商品进行免单
                        </p>
                    </FormItem>

                    {this.renderRules()}
                    {
                        this.state.ruleType == '0' || this.state.ruleType == '1' ?
                            null :
                            <PromotionDetailSetting />
                    }
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.steps.toJS(),
        fullCut: state.fullCut_NEW,
        promotionDetailInfo: state.promotionDetailInfo_NEW,
        promotionScopeInfo: state.promotionScopeInfo_NEW,
        user: state.user.toJS(),
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
)(Form.create()(BuyAFreeDetailInfo));
