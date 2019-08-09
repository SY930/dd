import React from 'react'
import {
    Col,
    Form,
    Select,
    message,
} from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import EditBoxForDishes from '../common/EditBoxForDishes';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'

class AddMoneyUpgradeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        const upGradeDishes = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType == "5") || [];
        let priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']);
        if (Immutable.List.isList(priceLst)) {
            priceLst = priceLst.toJS();
        } else {
            priceLst = [];
        }
        this.state = {
            display: false,
            foodMenuList: [],
            foodCategoryCollection: [],
            countType: 0,
            subjectType: 0,
            stageCondition: 0,
            stageAmount: '',
            upGradeDishes,
            isAddMoney: 0,
            freeAmount: '',
            dishes: priceLst,
            mostNewLimit: 0,
            giveFoodMax: '',
            singleNewLimit: 0,
            giveFoodCount: '',
        };

        this.renderFreeAmountInput = this.renderFreeAmountInput.bind(this);
        this.renderupGradeDishesBox = this.renderupGradeDishesBox.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.countTypeChange = this.countTypeChange.bind(this);
        this.subjectTypeChange = this.subjectTypeChange.bind(this);
        this.stageConditionChange = this.stageConditionChange.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onupGradeDishesChange = this.onupGradeDishesChange.bind(this);
        this.isAddMoneyChange = this.isAddMoneyChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.onAfterDishesChange = this.onAfterDishesChange.bind(this);
        this.renderNewLimit = this.renderNewLimit.bind(this);
        this.mostNewLimitChange = this.mostNewLimitChange.bind(this);
        this.giveFoodMaxChange = this.giveFoodMaxChange.bind(this);
        this.singleNewLimitChange = this.singleNewLimitChange.bind(this);
        this.giveFoodCountChange = this.giveFoodCountChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        let { display } = this.state;
        display = !this.props.isNew;
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        // 根据ruleJson填充页面
        const scope = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType != "5") || [];

        let subjectType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']);
        if (subjectType == 1) {
            subjectType = scope.length > 0 ? 3 : 1
        }
        if (subjectType == 0) {
            subjectType = scope.length > 0 ? 2 : 0
        }
        this.setState({
            display,
            countType: _rule.countType || 0,
            subjectType,
            stageCondition: _rule.stageCondition || 0,
            stageAmount: _rule.stageAmount > 0 ? _rule.stageAmount : 0,
            isAddMoney: _rule.freeAmount > 0 ? 1 : 0,
            freeAmount: _rule.freeAmount || '',
            mostNewLimit: _rule.giveFoodMax > 0 ? 1 : 0,
            giveFoodMax: _rule.giveFoodMax || '',
            singleNewLimit: _rule.giveFoodCount > 0 ? 1 : 0,
            giveFoodCount: _rule.giveFoodCount || '',
        });
    }

    handleSubmit = () => {
        let {
            countType,
            subjectType,
            stageCondition,
            stageAmount,
            upGradeDishes,
            isAddMoney,
            freeAmount,
            dishes,
            mostNewLimit,
            giveFoodMax,
            singleNewLimit,
            giveFoodCount,
        } = this.state;

        const rule = {
            stageType: countType == 0 ? undefined : 2,
            // stage: [
            //     {
            countType,
            stageCondition,
            stageAmount: countType != 0 && stageAmount < 1 ? 0 : stageAmount,
            freeAmount: countType != 0 && freeAmount < 1 ? 0 : freeAmount,
            giveFoodMax,
            giveFoodCount,
            //     },
            // ],
        }
        const priceLst = dishes.map((price) => {
            return {
                foodUnitID: price.itemID,
                foodUnitCode: price.foodKey,
                foodName: price.foodName,
                foodUnitName: price.unit,
                price: price.price,
                brandID: price.brandID || '0',
            }
        });
        let opts = {
            rule,
            priceLst,
            subjectType: subjectType != 1 && subjectType != 3 ? 0 : 1,
            upGradeDishes,
        }
        let scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        scopeLst = scopeLst ? scopeLst.toJS() : []
        countType == 0 || countType == 1 && subjectType < 2 ?
            opts = {// 切换为不选菜品时reset food
                ...opts,
                categoryOrDish: 0,
                dishes: [],
                foodCategory: [],
                excludeDishes: [],
                scopeLst: scopeLst.filter(scope => scope.scopeType == "5") || [],
            }
            : null
        let text = '';
        upGradeDishes.length === 0 ? text += '升级前菜品不可为空;' : null;
        dishes.length === 0 ? text += '升级后菜品不可为空;' : null;
        mostNewLimit == 1 && giveFoodMax < 1 ? text += '单笔订单最多升级换新数量限制不可为空;' : null;
        singleNewLimit == 1 && giveFoodCount < 1 ? text += '单笔订单同一菜品最多升级换新数量限制不可为空;' : null;
        mostNewLimit == 1 && singleNewLimit == 1 && giveFoodCount > giveFoodMax ? text += '同一菜品数量不能大于单笔订单最多数量;' : null;

        if (!text) {
            this.props.setPromotionDetail(opts);
            return true
        } else {
            const content = text.split(';').map(word => <p>{word}</p>)
            message.warning(content, 3)
            return false
        }
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    // 不限，金额，数量方式下拉框
    countTypeChange(val) {
        this.setState({ countType: val, subjectType: 0, stageCondition: 0, stageAmount: '' })
    }
    // 按金额下拉框
    subjectTypeChange(val) {
        this.setState({ subjectType: val, stageCondition: 0 });
    }
    // 按数量下拉框
    stageConditionChange(val) {
        this.setState({ stageCondition: val, subjectType: 0 })
    }
    // 满金额||份数input
    onStageAmountChange(value) {
        this.setState({ stageAmount: value.number });
    }
    // 换购前菜品Box  onchange
    onupGradeDishesChange(value) {
        this.setState({ upGradeDishes: value });
    }
    // 是否加价下拉框
    isAddMoneyChange(val) {
        this.setState({ isAddMoney: val, freeAmount: '' })
    }
    // 加价金额input
    handleFreeAmountChange(value) {
        this.setState({ freeAmount: value.number });
    }
    // 换购后菜品Box  onchange
    onAfterDishesChange(value) {
        this.setState({ dishes: value });
    }
    // 单笔订单最多升级换新数量限制下拉框
    mostNewLimitChange(val) {
        this.setState({ mostNewLimit: val, giveFoodMax: '' })
    }
    // 数量限制input
    giveFoodMaxChange(val) {
        this.setState({ giveFoodMax: val.number })
    }
    // 单笔订单同一菜品最多升级换新数量限制下拉框
    singleNewLimitChange(val) {
        this.setState({ singleNewLimit: val, giveFoodCount: '' })
    }
    // 数量限制input
    giveFoodCountChange(val) {
        this.setState({ giveFoodCount: val.number })
    }

    // render换购前菜品
    renderupGradeDishesBox() {
        return (
            <FormItem
                label={'升级前菜品'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {
                    this.props.isShopFoodSelectorMode ? (
                        <EditBoxForDishes type='1090'
                            value={this.state.upGradeDishes}
                            onChange={(value) => {
                                this.onupGradeDishesChange(value);
                            }}
                        />
                    ) : ( // 这里没有考虑到，其实不是priceLst而是scopeType为5的scopeLst, 最后是在组件内兼容的
                        <ConnectedPriceListSelector
                            value={this.state.upGradeDishes}
                            onChange={(value) => {
                                this.onupGradeDishesChange(value);
                            }}
                        />
                    )
                }
            </FormItem>
        )
    }
    // render加价方式
    renderFreeAmountInput() {
        const { isAddMoney, freeAmount } = this.state;
        return (
            <FormItem
                className={styles.FormItemStyle}
                label='加价方式'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Col span={isAddMoney == 0 ? 24 : 4}>
                    <Select onChange={this.isAddMoneyChange}
                            value={isAddMoney}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        <Option key="0" value={0}>不加价</Option>
                        <Option key="1" value={1}>加价</Option>
                    </Select>
                </Col>
                {
                    isAddMoney == 1 ?
                        <Col span={isAddMoney == 0 ? 0 : 20}>
                            <PriceInput
                                addonAfter={'元'}
                                value={{ number: freeAmount }}
                                defaultValue={{ number: freeAmount }}
                                onChange={this.handleFreeAmountChange}
                                modal="float"
                            />
                        </Col> : null
                }
            </FormItem>
        )
    }
    // render换购后菜品
    renderDishsSelectionBox() {
        return (
            <FormItem
                label={'升级后菜品'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {
                    this.props.isShopFoodSelectorMode ? (
                        <EditBoxForDishes type='1090'
                            value={this.state.dishes}
                            onChange={(value) => {
                                this.onAfterDishesChange(value);
                            }}
                        />
                    ) : (
                        <ConnectedPriceListSelector
                            value={this.state.dishes}
                            onChange={(value) => {
                                this.onAfterDishesChange(value);
                            }}
                        />
                    )
                }
            </FormItem>
        )
    }
    // render单笔订单最多升级换新数量限制
    renderNewLimit() {
        const { mostNewLimit, giveFoodMax, singleNewLimit, giveFoodCount, } = this.state;
        return (
            <div style={{ width: '80%', marginLeft: 49 }}>
                <FormItem
                    className={styles.FormItemStyle}
                    label='单笔订单最多升级换新数量限制'
                    labelCol={{ span: 13 }}
                    wrapperCol={{ span: 11 }}
                >
                    <Col span={mostNewLimit == 0 ? 24 : 8}>
                        <Select onChange={this.mostNewLimitChange}
                                value={mostNewLimit}
                                getPopupContainer={(node) => node.parentNode}
                        >
                            <Option key="0" value={0}>不限制</Option>
                            <Option key="1" value={1}>限制</Option>
                        </Select>
                    </Col>
                    {
                        mostNewLimit == 1 ?
                            <Col span={mostNewLimit == 0 ? 0 : 16}>
                                <FormItem
                                    style={{ marginTop: -6 }}
                                    validateStatus={giveFoodMax > 0 ? 'success' : 'error'}
                                    help={giveFoodMax > 0 ? null : '必须大于0'}
                                >
                                    <PriceInput
                                        addonAfter={'份'}
                                        value={{ number: giveFoodMax }}
                                        defaultValue={{ number: giveFoodMax }}
                                        onChange={this.giveFoodMaxChange}
                                        modal="int"
                                    />
                                </FormItem>
                            </Col> : null
                    }
                </FormItem>
                <FormItem
                    className={styles.FormItemStyle}
                    label='单笔订单同一菜品最多升级换新数量限制'
                    labelCol={{ span: 13 }}
                    wrapperCol={{ span: 11 }}
                >
                    <Col span={singleNewLimit == 0 ? 24 : 8}>
                        <Select onChange={this.singleNewLimitChange}
                                value={singleNewLimit}
                                getPopupContainer={(node) => node.parentNode}
                        >
                            <Option key="0" value={0}>不限制</Option>
                            <Option key="1" value={1}>限制</Option>
                        </Select>
                    </Col>
                    {
                        singleNewLimit == 1 ?
                            <Col span={singleNewLimit == 0 ? 0 : 16}>
                                <FormItem
                                    style={{ marginTop: -6 }}
                                    validateStatus={giveFoodCount > 0 ? (giveFoodCount > giveFoodMax && mostNewLimit == 1) ? 'error' : 'success' : 'error'}
                                    help={giveFoodCount > 0 ? (giveFoodCount > giveFoodMax && mostNewLimit == 1) ? '必须小于上面的数字' : null : '必须大于0'}
                                >
                                    <PriceInput
                                        addonAfter={'份'}
                                        value={{ number: giveFoodCount }}
                                        defaultValue={{ number: giveFoodCount }}
                                        onChange={this.giveFoodCountChange}
                                        modal="int"
                                    />
                                </FormItem>
                            </Col> : null
                    }
                </FormItem>
            </div>
        )
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
    render() {
        let { countType, subjectType, stageCondition, stageAmount, } = this.state;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <FormItem
                        className={styles.FormItemStyle}
                        label='活动条件限制'
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Col span={countType == 0 ? 24 : 4}>
                            <Select onChange={this.countTypeChange}
                                    value={countType}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value={0}>不限制</Option>
                                <Option key="1" value={1}>按金额</Option>
                                <Option key="2" value={2}>按数量</Option>
                            </Select>
                        </Col>
                        {
                            countType == 1 ?
                                <Col span={countType == 0 ? 0 : 20}>
                                    <PriceInput
                                        addonBefore={
                                            <Select size="default"
                                                defaultValue={0}
                                                    getPopupContainer={(node) => node.parentNode}
                                                onChange={this.subjectTypeChange}
                                                value={subjectType}
                                            >
                                                <Option key="0" value={0}>任意菜品售价满</Option>
                                                <Option key="1" value={1}>任意菜品实收满</Option>
                                                <Option key="3" value={2}>活动菜品售价满</Option>
                                                <Option key="4" value={3}>活动菜品实收满</Option>
                                            </Select>
                                        }
                                        addonAfter={'元'}
                                        value={{ number: stageAmount }}
                                        defaultValue={{ number: stageAmount }}
                                        onChange={this.onStageAmountChange}
                                        modal='float'
                                    />
                                </Col> : null
                        }
                        {
                            countType == 2 ?
                                <Col span={countType == 0 ? 0 : 20}>
                                    <PriceInput
                                        addonBefore={
                                            <Select size="default"
                                                defaultValue={0}
                                                    getPopupContainer={(node) => node.parentNode}
                                                onChange={this.stageConditionChange}
                                                value={stageCondition}
                                            >
                                                <Option key="0" value={0}>任意菜品数量满</Option>
                                                <Option key="1" value={1}>同一菜品数量满</Option>
                                            </Select>
                                        }
                                        addonAfter={'份'}
                                        value={{ number: stageAmount }}
                                        defaultValue={{ number: stageAmount }}
                                        onChange={this.onStageAmountChange}
                                        modal="int"
                                    />
                                </Col> : null
                        }
                    </FormItem>
                    {countType == 0 ? null :
                        countType == 2 || subjectType == 2 || subjectType == 3 ?
                            this.props.isShopFoodSelectorMode ? <PromotionDetailSetting /> :
                            <ConnectedScopeListSelector/>
                        : null /* 条件限制菜品 */}
                    {this.renderupGradeDishesBox()/*升级前菜品*/}
                    {this.renderFreeAmountInput()}
                    {this.renderDishsSelectionBox()/*升级后菜品*/}
                    {this.renderNewLimit()/*换新菜品数量限制*/}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AddMoneyUpgradeDetailInfo));
