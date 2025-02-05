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
import {
    Form,
    Select,
    Radio,
    message,
    Col,
    Row,
    Input,
    Tooltip,
    Icon,
} from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';

const RadioGroup = Radio.Group;


import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../common/ConnectedScopeListSelector';
import AddMoneyTradeDishesTableWithBrand from './AddMoneyTradeDishesTableWithBrand'
import AddMoneyTradeDishesTableWithoutBrand from './AddMoneyTradeDishesTableWithoutBrand'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
//周黑鸭需求
import AdvancedPromotionDetailSettingNew from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSettingNew';
import { isCheckApproval, isZhouheiya, businessTypesList } from '../../../constants/WhiteList';
import Approval from '../../../containers/SaleCenterNEW/common/Approval';
import GoodsRef from '@hualala/sc-goodsRef';
const { GoodsSelector } = GoodsRef
import AddMoneyTradeDishesTableWithBrandNew from './AddMoneyTradeDishesTableWithBrandNew'

@injectIntl()
class AddfreeAmountTradeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previousRuleType: null, // 妥协后端奇妙的数据结构
            dishes: [],
            stageCountFlag: true,
            stageAmountFlag: true,
            ...this.getInitState(),
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onStageCountChange = this.onStageCountChange.bind(this);
        this.ruleTypeChange = this.ruleTypeChange.bind(this);
    }

    canLimitBeSet = () => {
        const { ruleType } = this.state;
        return ruleType === '2' || ruleType === '3';
    }

    getInitState = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        if (!_rule) {
            return {
                display: false,
                stageType: 2,
                calType: 0,
                stageAmount: '',
                stageCount: '',
                freeAmount: '',
                ruleType: '0',
                isLimited: '0',
                totalFoodMax: undefined,
            };
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        const display = !this.props.isNew;

        let ruleType
        if (isZhouheiya(this.props.user.groupID)) {
            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            ruleType = goodsScopeList.length > 0 ? 1 : 0
        } else {
            ruleType = _scopeLst.size > 0 ? 1 : 0;
        }
        if (Number(_rule.stageStyle) === 1) {
            ruleType += 2;
        }
        return {
            display,
            stageType: _rule.stageType || 2,
            calType: _rule.calType || 0,
            stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
            stageCount: _rule.stage ? _rule.stage[0].stageCount : '',
            freeAmount: _rule.stage ? _rule.stage[0].freeAmount : '',
            isLimited: _rule.totalFoodMax > 0 ? '1' : '0',
            totalFoodMax: _rule.totalFoodMax || undefined,
            ruleType: String(ruleType),
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        if (isZhouheiya(this.props.user.groupID)) {
            let stageGoodsList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'stageGoodsList']).toJS();
            if (stageGoodsList.length > 0) {
                this.setState({ stageGoodsList: stageGoodsList[0].goodsList, dishes: stageGoodsList[0].goodsList })
            }

            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            if (goodsScopeList.length > 0) {
                this.goodsScopeList = goodsScopeList[0]
            }
        }

    }

    handleSubmit() {
        let {
            stageAmount,
            stageType,
            calType,
            stageCount,
            dishes,
            stageCountFlag,
            stageAmountFlag,
            freeAmount,
            ruleType,
            isLimited,
            totalFoodMax,
        } = this.state;
        if (stageAmount == null || stageAmount == '') {
            stageAmountFlag = false;
        }
        if (stageCount == null || stageCount == '') {
            stageCountFlag = false;
        }
        if (dishes.length === 0) {
            message.warning(this.props.intl.formatMessage(SALE_STRING.k5kqf033))
            return false;
        }
        if (this.canLimitBeSet() && isLimited == '1' && !(totalFoodMax > 0 && totalFoodMax <= dishes.length)) {
            return false;
        }
        if (dishes.some(dish => !(dish.payPrice > 0))) {
            message.warning(SALE_LABEL.k5kqf0bf)
            return false;
        }
        if (dishes.some(dish => !(dish.maxNum > 0))) {
            message.warning('最大换购数量必填并且必须大于0')
            return false;
        }

        //周黑鸭去除活动价与原价的判断
        if (!isZhouheiya(this.props.user.groupID)) {
            if (dishes.some(dish => +dish.payPrice > +dish.price)) {
                message.warning(SALE_LABEL.k5kqf0jr)
                return false;
            }
        }
        this.setState({ stageAmountFlag, stageCountFlag });
        if (((stageType == 2 && stageAmountFlag) || (stageType == 1 && stageCountFlag))) {

            if (isZhouheiya(this.props.user.groupID)) {
                const priceLst = dishes.map((price) => {
                    return {
                        ...price,
                        payPrice: price.payPrice,
                        weightOffset: price.weightOffset,
                        maxNum: price.maxNum,
                    }
                });
                const rule = {
                    stageType,
                    calType,
                    totalFoodMax: this.canLimitBeSet() && isLimited == '1' ? totalFoodMax : undefined,
                    stageStyle: Number(ruleType) > 1 ? 1 : 2, // 1 每满XX加价（可加N次）  2 满XX加价（加1次）
                    stage: [
                        {
                            stageCount: stageCount || 0,
                            stageAmount: stageAmount || 0,
                            freeAmount: priceLst[0].payPrice,
                        },
                    ],
                }
                let stageGoodsList = []
                stageGoodsList.push({
                    stage: 0,
                    goodsList: priceLst
                })
                if (ruleType == '0' || ruleType == '2') {
                    this.props.setPromotionDetail({
                        rule,
                        stageGoodsList,
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
                        rule, stageGoodsList,
                    });
                }
            } else {
                const priceLst = dishes.map((price) => {
                    return {
                        foodUnitID: price.itemID,
                        foodUnitCode: price.foodKey,
                        foodName: price.foodName,
                        foodUnitName: price.unit,
                        brandID: price.brandID || '0',
                        price: price.price,
                        payPrice: price.payPrice,
                        imagePath: price.imgePath,
                        weightOffset: price.weightOffset,
                        maxNum: price.maxNum,
                    }
                });
                const rule = {
                    stageType,
                    calType,
                    totalFoodMax: this.canLimitBeSet() && isLimited == '1' ? totalFoodMax : undefined,
                    stageStyle: Number(ruleType) > 1 ? 1 : 2, // 1 每满XX加价（可加N次）  2 满XX加价（加1次）
                    stage: [
                        {
                            stageCount: stageCount || 0,
                            stageAmount: stageAmount || 0,
                            freeAmount: priceLst[0].payPrice,
                        },
                    ]
                }
                if (ruleType == '0' || ruleType == '2') {
                    this.props.setPromotionDetail({
                        rule,
                        priceLst,
                        scopeLst: [],
                        dishes: [],
                        excludeDishes: [],
                        foodCategory: [],
                    });
                } else {
                    this.props.setPromotionDetail({
                        rule, priceLst,
                    });
                }
            }

            //周黑鸭需求
            this.props.setPromotionDetail({
                approval: this.state.approvalInfo,
            });
            if (isCheckApproval && (!this.state.approvalInfo.activityCost || !this.state.approvalInfo.estimatedSales || !this.state.approvalInfo.auditRemark)) {
                return
            }

            return true
        }
        const errElement = document.querySelector('.ant-form-explain');
        errElement && errElement.scrollIntoView(false);
        return false
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    onRadioChange(event) {
        const stageType = Number(event.target.value);
        const previousRuleType = this.state.previousRuleType;
        const ruleType = this.state.ruleType;
        if (previousRuleType !== null) {
            this.setState({ stageType, ruleType: previousRuleType, previousRuleType: ruleType });
        } else {
            this.setState({ stageType, ruleType: '0', previousRuleType: ruleType });
        }

    }

    onCalTypeChange = (e) => {
        this.setState({ calType: Number(e.target.value) });
    }
    // 减免金额
    onStageAmountChange(e) {
        let { stageAmount, stageAmountFlag } = this.state;
        if (e.target.value == null || e.target.value == '' || e.target.value == '0') {
            stageAmountFlag = false;
            stageAmount = e.target.value;
        } else {
            const reg = /^(([1-9]\d{0,100})|0)(\.\d{0,2})?$/
            if (reg.test(e.target.value)) {
                stageAmountFlag = true;
                stageAmount = e.target.value;
            } else {
                stageAmountFlag = false;
                stageAmount = e.target.value;
            }

        }
        this.setState({ stageAmount, stageAmountFlag });
    }

    // 减免数量
    onStageCountChange(e) {
        let { stageCount, stageCountFlag } = this.state;
        if (e.target.value == null || e.target.value == '' || e.target.value == '0') {
            stageCountFlag = false;
            stageCount = e.target.value;
        } else {
            const reg = /^(([1-9]\d{0,100})|0)(\.\d{0,2})?$/
            if (reg.test(e.target.value)) {
                stageCountFlag = true;
                stageCount = e.target.value;
            } else {
                stageCountFlag = false;
                stageCount = e.target.value;
            }
        }
        this.setState({ stageCount, stageCountFlag });
    }

    renderZHYDishsSelectionBox(calType) {
        return (
            <div style={{ position: 'relative' }}>
                {!this.canLimitBeSet() && (
                    <div style={{ position: 'absolute', top: 12, left: 78 }}>
                        （{SALE_LABEL.k5kqf0s3}）
                    </div>
                )}
                {
                    <AddMoneyTradeDishesTableWithBrandNew
                        isLook={!this.props.isUpdate}
                        legacyPayPrice={this.state.freeAmount}
                        calType={calType}
                        onChange={(value) => {
                            this.onDishesChange(value);
                        }}
                        value={this.state.dishes}
                    />
                }
            </div>
        )
    }

    renderDishsSelectionBox(calType) {
        return (
            <div style={{ position: 'relative' }}>
                {!this.canLimitBeSet() && (
                    <div style={{ position: 'absolute', top: 12, left: 78 }}>
                        （{SALE_LABEL.k5kqf0s3}）
                    </div>
                )}
                {
                    this.props.isShopFoodSelectorMode ? (
                        <AddMoneyTradeDishesTableWithoutBrand
                            legacyPayPrice={this.state.freeAmount}
                            calType={calType}
                            onChange={(value) => {
                                this.onDishesChange(value);
                            }}
                        />
                    ) : (
                        <AddMoneyTradeDishesTableWithBrand
                            legacyPayPrice={this.state.freeAmount}
                            calType={calType}
                            onChange={(value) => {
                                this.onDishesChange(value);
                            }}
                        />
                    )
                }
            </div>
        )
    }
    // 换购菜品onchange
    onDishesChange(value) {
        let { dishes } = this.state;
        dishes = value;
        this.setState({
            dishes,
            dishsSelectionFlag: value.length != 0,
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

    ruleTypeChange(val) {
        this.setState({ ruleType: val })
    }
    handleIsLimitedChange = (value) => {
        this.setState({
            isLimited: value,
        })
    }
    handleTotalFoodMaxChange = ({ number: value }) => {
        this.setState({
            totalFoodMax: value,
        })
    }
    getTotalMaxValidateInfo = () => {
        const {
            totalFoodMax,
            dishes,
        } = this.state;
        if (!(totalFoodMax > 0)) {
            return {
                msg: SALE_LABEL.k5f4b1b9,
                status: 'error'
            }
        }
        if (totalFoodMax > dishes.length) {
            return {
                msg: SALE_LABEL.k5kqf10f,
                status: 'error'
            }
        }
        return {
            msg: undefined,
            status: 'success'
        }
    }
    renderTotalFoodMax = () => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const k5koakb3 = intl.formatMessage(SALE_STRING.k5koakb3);
        const k5kp4vhr = intl.formatMessage(SALE_STRING.k5kp4vhr);
        const {
            msg,
            status,
        } = this.getTotalMaxValidateInfo();
        return (
            <div style={{ height: '50px', marginTop: '8px' }} className={styles.flexContainer}>
                <div style={{ lineHeight: '28px', marginRight: '14px' }}>
                    {SALE_LABEL.k5kqf18r}
                </div>
                <div style={{ width: '300px' }}>
                    <Row>
                        <Col span={this.state.isLimited == 0 ? 24 : 8}>
                            <Select onChange={this.handleIsLimitedChange}
                                value={String(this.state.isLimited)}
                                getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value={'0'}>{k5koakb3}</Option>
                                <Option key="1" value={'1'}>{k5kp4vhr}</Option>
                            </Select>
                        </Col>
                        {
                            this.state.isLimited == '1' ?
                                <Col span={16}>
                                    <FormItem
                                        style={{ marginTop: -6 }}
                                        validateStatus={status}
                                        help={msg}
                                    >
                                        <PriceInput
                                            addonAfter={k5ez4qy4}
                                            maxNum={5}
                                            value={{ number: this.state.totalFoodMax }}
                                            onChange={this.handleTotalFoodMaxChange}
                                            modal="int"
                                        />
                                    </FormItem>
                                </Col> : null
                        }
                    </Row>
                </div>
            </div>
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

    render() {
        const { intl } = this.props;
        const k5koakjf = intl.formatMessage(SALE_STRING.k5koakjf);
        const k5koakrr = intl.formatMessage(SALE_STRING.k5koakrr);

        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5koalgr = intl.formatMessage(SALE_STRING.k5koalgr);
        const k5kqf1xr = intl.formatMessage(SALE_STRING.k5kqf1xr);

        const k5kqf2ef = intl.formatMessage(SALE_STRING.k5kqf2ef);
        const k5kqf2mr = intl.formatMessage(SALE_STRING.k5kqf2mr);
        const k5kqf2v3 = intl.formatMessage(SALE_STRING.k5kqf2v3);
        const k5kqf33f = intl.formatMessage(SALE_STRING.k5kqf33f);
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);

        return (
            <div id="_addMoneyTradeDetail">
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <FormItem
                        label={SALE_LABEL.k5ez4n7x}
                        required={true}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <p>
                            {SALE_LABEL.k5kqf1h3}
                        </p>
                        <RadioGroup onChange={this.onRadioChange} value={this.state.stageType}>
                            <Radio key={'2'} value={2}>{k5koakjf}</Radio>
                            <Radio key={'1'} value={1}>{k5koakrr}</Radio>
                            <Tooltip title='仅POS2.5支持数量为小数，POS2.0输入小数时向上取整，如输入2.3，则取为3份'>
                                <Icon style={{ marginLeft: -7, marginRight: -5 }} type="question-circle" />
                            </Tooltip>
                        </RadioGroup>
                    </FormItem>
                    {this.state.stageType == 2 ?
                        <FormItem
                            className={[styles.FormItemStyle, styles.explainBack].join(' ')}
                            wrapperCol={{ span: 17, offset: 3 }}
                            validateStatus={this.state.stageAmountFlag ? 'success' : 'error'}
                            help={this.state.stageAmountFlag ? null : SALE_LABEL.k5kqf1pf}
                        >
                            <Input
                                addonBefore={
                                    <Select size="default"
                                        onChange={this.ruleTypeChange}
                                        value={this.state.ruleType}
                                        getPopupContainer={(node) => node.parentNode}
                                    >
                                        <Option key="0" value="0">{k5ez4ovx}</Option>
                                        <Option key="2" value="2">{k5ez4pdf}</Option>
                                        <Option key="1" value="1">{k5koalgr}</Option>
                                        <Option key="3" value="3">{k5kqf1xr}</Option>
                                    </Select>
                                }
                                addonAfter={'元'}
                                value={this.state.stageAmount}
                                defaultValue={this.state.stageAmount}
                                onChange={this.onStageAmountChange}
                            // modal="int"
                            />
                        </FormItem> :
                        <FormItem
                            className={[styles.FormItemStyle, styles.explainBack].join(' ')}
                            wrapperCol={{ span: 17, offset: 3 }}
                            validateStatus={this.state.stageCountFlag ? 'success' : 'error'}
                            help={this.state.stageCountFlag ? null : SALE_LABEL.k5kqf263}>
                            <Input
                                addonBefore={
                                    <Select size="default"
                                        onChange={this.ruleTypeChange}
                                        value={this.state.ruleType}
                                        getPopupContainer={(node) => node.parentNode}
                                    >
                                        <Option key="0" value="0">{k5kqf2ef}</Option>
                                        <Option key="2" value="2">{k5kqf2mr}</Option>
                                        <Option key="1" value="1">{k5kqf2v3}</Option>
                                        <Option key="3" value="3">{k5kqf33f}</Option>
                                    </Select>
                                }
                                addonAfter={'份'}
                                value={this.state.stageCount}
                                defaultValue={this.state.stageCount}
                                onChange={this.onStageCountChange}
                            // modal="int"
                            />
                        </FormItem>
                    }
                    <FormItem
                        label={'换购方式'}
                        required={true}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <RadioGroup onChange={this.onCalTypeChange} value={this.state.calType}>
                            <Radio key={'0'} value={0}>按活动价格</Radio>
                            <Radio key={'1'} value={1}>按减免价格</Radio>
                        </RadioGroup>
                        <Tooltip title={'换购价格 = 门店菜品价格 － 减免价格'}>
                            <Icon type="question-circle" style={{ cursor: 'pointer' }} />
                        </Tooltip>
                    </FormItem>
                    {!isZhouheiya(this.props.user.groupID) &&
                        (this.state.ruleType == '0' || this.state.ruleType == '2' ?
                            null :
                            <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />)
                    }
                    {isZhouheiya(this.props.user.groupID) &&
                        (this.state.ruleType == '0' || this.state.ruleType == '2' ?
                            null :
                            this.renderGoodRef())
                    }
                    {!isZhouheiya(this.props.user.groupID) && this.renderDishsSelectionBox(this.state.calType)}
                    {isZhouheiya(this.props.user.groupID) && this.renderZHYDishsSelectionBox(this.state.calType)}
                    {this.canLimitBeSet() && this.renderTotalFoodMax()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display && !isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSetting payLimit={this.state.stageType == 2} /> : null}
                    {this.state.display && isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSettingNew bizType={1} payLimit={this.state.stageType == 2} /> : null}
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
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        user: state.user.get('accountInfo').toJS(),
        //周黑鸭新增
        isUpdate: state.sale_myActivities_NEW.get('isUpdate'),
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
)(Form.create()(AddfreeAmountTradeDetailInfo));
