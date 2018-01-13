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
import { Row, Col, Form, Select, Radio, Input, InputNumber, message } from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

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
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';


const client = [
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];

class AddMoneyUpgradeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            foodMenuList: [],
            foodCategoryCollection: [],
            countType: 0,
            subjectType: 0,
            stageCondition: 0,
            stageAmount: '',
            upGradeDishes: [],
            isAddMoney: 0,
            freeAmount: '',
            dishes: [],
            mostNewLimit: 0,
            giveFoodMax: '',
            singleNewLimit: 0,
            giveFoodCount: '',
        };

        this.renderFreeAmountInput = this.renderFreeAmountInput.bind(this);
        this.renderupGradeDishesBox = this.renderupGradeDishesBox.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        if (this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized'])) {
            const foodMenuList = this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;
            this.setState({ foodMenuList })
        }
        let { display } = this.state;
        display = !this.props.isNew;
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        // 根据ruleJson填充页面
        const stage = _rule.stage ? _rule.stage[0] : {}
        const upGradeDishes = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType === "FOOD_UPGRADE") || [];
        const scope = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType !== "FOOD_UPGRADE") || [];
        const priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        let subjectType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']);
        if (subjectType == 1) {
            subjectType = scope.length > 0 ? 3 : 1
        }
        if (subjectType == 0) {
            subjectType = scope.length > 0 ? 2 : 0
        }
        this.setState({
            display,
            countType: stage.countType || 0,
            subjectType,
            stageCondition: stage.stageCondition || 0,
            stageAmount: stage.stageAmount > 0 ? stage.stageAmount : 0,
            upGradeDishes,
            isAddMoney: stage.freeAmount > 0 ? 1 : 0,
            freeAmount: stage.freeAmount || '',
            dishes: priceLst || [],
            mostNewLimit: stage.giveFoodMax > 0 ? 1 : 0,
            giveFoodMax: stage.giveFoodMax || '',
            singleNewLimit: stage.giveFoodCount > 0 ? 1 : 0,
            giveFoodCount: stage.giveFoodCount || '',
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
            nextProps.promotionDetailInfo.getIn(['$foodCategoryListInfo', 'initialized']) &&
            !this.state.hadFoodMenuList) {
            this.setState({
                foodMenuList: nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records,
                hadFoodMenuList: true,
            })
        }

        if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).size > 0 &&
            !this.state.hadSetWhenEdit) {
            const foodMenuList = nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;
            const _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) ?
                nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [];
            const _upGradeDishes = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType === "FOOD_UPGRADE") || [];
            const scope = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType !== "FOOD_UPGRADE") || [];
            let subjectType = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'subjectType']);

            if (subjectType == 1) {
                subjectType = scope.length > 0 ? 3 : 1
            }
            if (subjectType == 0) {
                subjectType = scope.length > 0 ? 2 : 0
            }
            let _rule = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
            _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
            _rule = Object.assign({}, _rule);
            const stage = _rule.stage ? _rule.stage[0] : {}
            const _dish = [];
            _priceLst.map((price) => {
                foodMenuList.map((food) => {
                    // if(food.foodKey === price.foodUnitCode){不唯一，一个菜会匹配多次，添加多次
                    if (food.itemID == price.foodUnitID) { // foodUnitID就是由itemID转换
                        _dish.push(food)
                    }
                });
            });
            _dish.map(((item) => {
                item.id = item.foodID;
                item.content = item.foodName;
                item.foodUnitID = item.itemID;
            }));
            const upGradeDishes = [];
            _upGradeDishes.map((price) => {
                foodMenuList.map((food) => {
                    if (food.itemID == price.targetID) { // foodUnitID就是由itemID转换
                        upGradeDishes.push(food)
                    }
                });
            });
            upGradeDishes.map(((item) => {
                item.id = item.foodID;
                item.content = item.foodName;
                item.foodUnitID = item.itemID;
            }));
            this.setState({
                countType: stage.countType || 0,
                subjectType,
                stageCondition: stage.stageCondition || 0,
                stageAmount: stage.stageAmount > 0 ? stage.stageAmount : 0,
                upGradeDishes,
                isAddMoney: stage.freeAmount > 0 ? 1 : 0,
                freeAmount: stage.freeAmount || '',
                dishes: _dish,
                mostNewLimit: stage.giveFoodMax > 0 ? 1 : 0,
                giveFoodMax: stage.giveFoodMax || '',
                singleNewLimit: stage.giveFoodCount > 0 ? 1 : 0,
                giveFoodCount: stage.giveFoodCount || '',
                hadSetWhenEdit: true,
            });
        }
    }

    handleSubmit = () => {
        let {
            foodMenuList,
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
            stage: [
                {
                    countType,
                    stageCondition,
                    stageAmount: countType != 0 && stageAmount < 1 ? 0 : stageAmount,
                    freeAmount: countType != 0 && freeAmount < 1 ? 0 : freeAmount,
                    giveFoodMax,
                    giveFoodCount,
                },
            ],
        }

        const dish = dishes.map((dish) => {
            return foodMenuList.find((menu) => {
                return dish.itemID == menu.itemID
            })
        });
        const priceLst = dish.map((price) => {
            return {
                foodUnitID: price.itemID,
                foodUnitCode: price.foodKey,
                foodName: price.foodName,
                foodUnitName: price.unit,
                price: price.price,
            }
        });
        let opts = {
            rule,
            priceLst,
            subjectType: subjectType != 1 && subjectType != 3 ? 0 : 1,
            upGradeDishes,
        }
        subjectType < 2 && stageCondition < 1 ?
            opts = {// reset food
                ...opts,
                categoryOrDish: 0,
                dishes: [],
                foodCategory: [],
                excludeDishes: [],
                scopeLst: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS().filter(scope => scope.scopeType == "FOOD_UPGRADE") || [],

            }
            : null
        let text = '';
        upGradeDishes.length === 0 ? text += '升级前菜品不可为空;' : null;
        dish.length === 0 ? text += '升级后菜品不可为空;' : null;
        mostNewLimit == 1 && giveFoodMax < 1 ? text += '单笔订单最多升级换新数量限制不可为空;' : null;
        singleNewLimit == 1 && giveFoodCount < 1 ? text += '单笔订单同一菜品最多升级换新数量限制不可为空;' : null;

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
        this.setState({ countType: val, subjectType: 0, stageCondition: 0, stageAmount: val == 0 ? '' : this.state.stageAmount })
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
                <EditBoxForDishes type='FOOD_PAY_MORE_THEN_UPGRADE'
                    value={this.state.upGradeDishes}
                    onChange={(value) => {
                        this.onupGradeDishesChange(value);
                    }}
                />
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
                    <Select onChange={this.isAddMoneyChange} value={isAddMoney}>
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
                                modal="int"
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
                <EditBoxForDishes type='FOOD_PAY_MORE_THEN_UPGRADE'
                    value={this.state.dishes}
                    onChange={(value) => {
                        this.onAfterDishesChange(value);
                    }}
                />
            </FormItem>
        )
    }
    // render单笔订单最多升级换新数量限制
    renderNewLimit() {
        const { mostNewLimit, giveFoodMax, singleNewLimit, giveFoodCount } = this.state;
        return (
            <FormItem
                label=' '
                colon={false}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <FormItem
                    className={styles.FormItemStyle}
                    label='单笔订单最多升级换新数量限制'
                    labelCol={{ span: 13 }}
                    wrapperCol={{ span: 11 }}
                >
                    <Col span={mostNewLimit == 0 ? 24 : 8}>
                        <Select onChange={this.mostNewLimitChange} value={mostNewLimit}>
                            <Option key="0" value={0}>不限制</Option>
                            <Option key="1" value={1}>限制</Option>
                        </Select>
                    </Col>
                    {
                        mostNewLimit == 1 ?
                            <Col span={mostNewLimit == 0 ? 0 : 16}>
                                <PriceInput
                                    addonAfter={'份'}
                                    value={{ number: giveFoodMax }}
                                    defaultValue={{ number: giveFoodMax }}
                                    onChange={this.giveFoodMaxChange}
                                    modal="int"
                                />
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
                        <Select onChange={this.singleNewLimitChange} value={singleNewLimit}>
                            <Option key="0" value={0}>不限制</Option>
                            <Option key="1" value={1}>限制</Option>
                        </Select>
                    </Col>
                    {
                        singleNewLimit == 1 ?
                            <Col span={singleNewLimit == 0 ? 0 : 16}>
                                <PriceInput
                                    addonAfter={'份'}
                                    value={{ number: giveFoodCount }}
                                    defaultValue={{ number: giveFoodCount }}
                                    onChange={this.giveFoodCountChange}
                                    modal="int"
                                />
                            </Col> : null
                    }
                </FormItem>
            </FormItem>
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
                            <Select onChange={this.countTypeChange} value={countType}>
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
                                        modal="int"
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
                        subjectType == 2 || subjectType == 3 || stageCondition == 1 ? <PromotionDetailSetting /> : null /* 条件限制菜品 */}
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
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AddMoneyUpgradeDetailInfo));
