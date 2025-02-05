import React, { Component } from 'react'
import { Row, Col, Form, Select, Icon, Radio, Tooltip, Input } from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

const Immutable = require('immutable');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

//周黑鸭需求
import AdvancedPromotionDetailSettingNew from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSettingNew';
import { isCheckApproval, checkGoodsScopeListIsNotEmpty, isZhouheiya, businessTypesList } from '../../../constants/WhiteList';
import Approval from '../../../containers/SaleCenterNEW/common/Approval';
import GoodsRef from '@hualala/sc-goodsRef';

@injectIntl()
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
            subRule: 1,
            maxFreeLimitType: '0'
        };
        this.renderFoodNeedCalc = this.renderFoodNeedCalc.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSubRule = this.handleChangeSubRule.bind(this);
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
        let _scopeLst
        if (isZhouheiya(this.props.user.groupID)) {
            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            if (goodsScopeList.length > 0) {
                _scopeLst = goodsScopeList[0]
            }
        } else {
            _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        }

        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let { display, data } = this.state;
        display = !this.props.isNew;

        let _ruleType
        if (isZhouheiya(this.props.user.groupID)) {
            _ruleType = _rule.stage ? (
                checkGoodsScopeListIsNotEmpty(_scopeLst) ? '2' : '0'
            ) : (
                    checkGoodsScopeListIsNotEmpty(_scopeLst) ? '3' : '1'
                )
            if (_rule.stageType == '11') {
                _ruleType = '5'
            }
            if (_rule.stageType == '21') {
                _ruleType = '4'
            }
        } else {
            _ruleType = _rule.stage ? (
                _scopeLst.length > 0 ? '2' : '0'
            ) : (
                    _scopeLst.length > 0 ? '3' : '1'
                )
            if (_rule.stageType == '11') {
                _ruleType = '5'
            }
            if (_rule.stageType == '21') {
                _ruleType = '4'
            }
        }

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
            subRule: _rule.subRule === undefined ? 1 : _rule.subRule,

            //周黑鸭需求
            maxFreeLimitType: _rule.maxFreeLimitType ? _rule.maxFreeLimitType : '0',
            maxFreeAmount: _rule.maxFreeAmount,
        });

        if (isZhouheiya(this.props.user.groupID)) {
            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            if (goodsScopeList.length > 0) {
                this.goodsScopeList = goodsScopeList[0]
            }
        }

    }

    handleSubmit = () => {
        let { data, ruleType, subRule } = this.state;
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
            if (ruleType == '0' || ruleType == '2' || ruleType == '4') {
                rule = {
                    subRule,
                    stageType: ruleType == '4' ? 21 : 2,
                    stage: data.map((rule) => {
                        return {
                            stageAmount: rule.stageAmount,
                            freeAmount: rule.freeAmount,
                        }
                    }),
                    //周黑鸭需求
                    maxFreeLimitType: this.state.maxFreeLimitType,
                    maxFreeAmount: this.state.maxFreeAmount,
                }
            } else {
                rule = {
                    subRule,
                    stageType: ruleType == '5' ? 11 : 1,
                    stageAmount: data[0].stageAmount,
                    freeAmount: data[0].freeAmount,
                    //周黑鸭需求
                    maxFreeLimitType: this.state.maxFreeLimitType,
                    maxFreeAmount: this.state.maxFreeAmount,
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
                //周黑鸭需求
                this.props.setPromotionDetail({
                    goodsScopeList: [],
                });
            } else {
                this.props.setPromotionDetail({
                    rule,
                });
            }
        }

        //周黑鸭需求
	if (isZhouheiya(this.props.user.groupID)) {
    		if (this.state.maxFreeLimitType == 1 && !this.state.maxFreeAmount) {
	            nextFlag = false;
	        }
	        this.props.setPromotionDetail({
	            approval: this.state.approvalInfo,
	        });
	        if (isCheckApproval && (!this.state.approvalInfo.activityCost || !this.state.approvalInfo.estimatedSales || !this.state.approvalInfo.auditRemark)) {
	            return
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
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }
    renderFoodNeedCalc = () => {
        const { user:{groupID} } = this.props;
        const {subRule} = this.state;
        return (
            // groupID == '300452' || groupID == '11157' || groupID == '189702' ? 
            //     <FormItem
            //         label={'配菜是否参与计算'}
            //         className={styles.FormItemStyle}
            //         labelCol={{ span: 4 }}
            //         wrapperCol={{ span: 17 }}
            //     >
            //         <RadioGroup value={subRule} onChange={this.handleChangeSubRule} defaultValue={1}>
            //             <Radio key={1} value={1}>参与</Radio>
            //             <Radio key={0} value={0}>不参与</Radio>
            //             <Tooltip title={'配菜包括配菜、子菜、做法加价等'}>
            //                 <Icon
            //                     type="question-circle-o"
            //                     className={styles.question}
            //                 />
            //             </Tooltip>
            //         </RadioGroup>
            //     </FormItem> 
            //     : 
            //     ''
            <FormItem
                label={'配菜是否参与计算'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={subRule} onChange={this.handleChangeSubRule} defaultValue={1}>
                    <Radio key={1} value={1}>参与</Radio>
                    <Radio key={0} value={0}>不参与</Radio>
                    <Tooltip title={'配菜包括配菜、子菜、做法加价等'}>
                        <Icon
                            type="question-circle-o"
                            className={styles.question}
                        />
                    </Tooltip>
                </RadioGroup>
            </FormItem> 
        )
    }

    renderGoodRef() {
        return (
            <div>
                <FormItem
                    label={'活动范围'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <GoodsRef
                        defaultValue={this.goodsScopeList}
                        businessTypesList={businessTypesList}
                        onChange={(goods) => {
                            this.props.setPromotionDetail({
                                goodsScopeList: [goods],
                            });
                        }} ></GoodsRef>
                </FormItem>

            </div>
        )
    }

    renderMaxCount = () => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        return (

            <FormItem
                label={'最大减免份数'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                validateStatus={this.state.maxFreeLimitType == 1 && !this.state.maxFreeAmount ? 'error' : 'success'}
                help={this.state.maxFreeLimitType == 1 && !this.state.maxFreeAmount ? '最大减免份数需大于0' : null}
            >
                <PriceInput
                    disabled={this.state.maxFreeLimitType == '0'}
                    addonBefore={
                        <Select size="default"
                            onChange={(val) => {
                                this.setState({ maxFreeLimitType: val, maxFreeAmount: '' })
                            }}
                            value={String(this.state.maxFreeLimitType)}
                        >
                            <Option key={'0'} value={'0'}>不限制</Option>
                            <Option key={'1'} value={'1'}>限制</Option>
                        </Select>
                    }
                    addonAfter={k5ez4qy4}
                    maxNum={6}
                    value={{ number: this.state.maxFreeAmount }}
                    defaultValue={{ number: this.state.maxFreeAmount }}
                    onChange={(val) => {
                        this.setState({ maxFreeAmount: val.number })
                    }}
                    modal="int"
                />
            </FormItem>
        )
    }
    handleChangeSubRule(e) {
        const { target } = e;
        const { value } = target;
        this.setState({
            'subRule':value
        })
    }
    ruleTypeChange(val) {
        let data = this.state.data;
        if (val == '1' || val == '3' || val == '5') {
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
        if (this.state.ruleType == '0' || this.state.ruleType == '2' || this.state.ruleType == '4') {
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

    renderRules = () => {
        const { intl } = this.props;
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const RULE_TYPE = [
            { key: '0', value: k5ez4ovx },
            { key: '1', value: k5ez4pdf },
            { key: '2', value: k5ez4pvb },
            { key: '3', value: k5ez4qew },
            { key: '4', value: '同一菜品消费满' },
            { key: '5', value: '同一菜品消费每满' },
        ];
        return this.state.data.map((rule, idx) => {
            return (
                <Row key={`row${idx}`}>
                    <Col span={17} offset={4}>
                        <Col span={14}>
                            <FormItem
                                className={[styles.selectInInput, styles.FormItemStyle, styles.explainBack].join(' ')}
                                wrapperCol={{ span: 24 }}
                                validateStatus={rule.stageAmountFlag ? 'success' : 'error'}
                                help={rule.stageAmountFlag ? null : SALE_LABEL.k5keycn5}
                            >
                                <PriceInput
                                    addonBefore={
                                        idx == 0 ? (
                                            <Select size="default"
                                                    onChange={this.ruleTypeChange}
                                                    value={this.state.ruleType}
                                                    getPopupContainer={(node) => node.parentNode}
                                            >
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
                                    addonAfter={k5ez4qy4}
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
                                help={rule.freeAmountFlag ? null : SALE_LABEL.k5keycet}
                            >

                                <PriceInput
                                    addonBefore={SALE_LABEL.k5keyd3t}
                                    addonAfter={SALE_LABEL.k5keydc5}
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
                        label={SALE_LABEL.k5ez4n7x}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <p>
                            {SALE_LABEL.k5keycvh}
                        </p>
                    </FormItem>

                    {this.renderRules()}
                    {!isZhouheiya(this.props.user.groupID) &&
                        (this.state.ruleType == '0' || this.state.ruleType == '1' ?
                            null :
                            <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                        )
                    }
                    {isZhouheiya(this.props.user.groupID) &&
                        (this.state.ruleType == '0' || this.state.ruleType == '1' ?
                            null :
                            this.renderGoodRef()
                        )
                    }
                    {isZhouheiya(this.props.user.groupID) && this.renderMaxCount()}
                    {this.renderFoodNeedCalc()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display && !isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                    {this.state.display && isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSettingNew bizType={1} /> : null}
                    {isZhouheiya(this.props.user.groupID) ? <Approval onApprovalInfoChange={(val) => {
                        this.setState({
                            approvalInfo: {
                                ...val
                            }
                        })
                    }} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        myActivities: state.sale_myActivities_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        user: state.user.get('accountInfo').toJS()
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
