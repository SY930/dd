
import React, { Component } from 'react'
import {
    Form,
    Select,
    message,
    Checkbox,
    Input,
    Icon,
    Button,
    Popconfirm,
    Tooltip,
    Row,
    Col,
} from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'
import selfStyle from './selfStyle.less'

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CollocationTableWithBrandID from '../common/CollocationTableWithBrandID';
import CollocationTableWithoutBrandID from '../common/CollocationTableWithoutBrandID';
import RecommendTimeInterval from './RecommendTimeInterval';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import NoThresholdDiscountFoodSelector from './NoThresholdDiscountFoodSelector'
import NoThresholdDiscountFoodSelectorForShop from './NoThresholdDiscountFoodSelectorForShop'
import CustomRangeInput from '../../../containers/SaleCenterNEW/common/CustomRangeInput';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

// 推荐菜品只有集团可以设置,若以后门店也可设置，菜品选择组件需要仔细修改!important
@injectIntl()
class RecommendFoodDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        const { $foodRuleList } = this.props;
        const foodRuleList = Immutable.List.isList($foodRuleList) ? $foodRuleList.toJS() : [];
        if (!foodRuleList.length) { // 新建，给一组默认值
            foodRuleList.push({
                rule: {
                    ruleType: 1,
                    startTime: '0000',
                    endTime: '2359',
                    items: [{
                        num: 0,
                        count: 0,
                        validationStatus: 'success',
                        helpMsg: null,
                    }]
                },
                priceList: [],
                scopeList: [],
            })
        } else { // 编辑，已经查询并存到了store，rule字段在后端存储是json string
            foodRuleList.forEach(item => {
                let rule;
                try {
                    rule = JSON.parse(item.rule);
                } catch (e) {
                    rule = {
                        ruleType: 1,
                        startTime: '0000',
                        endTime: '2359',
                    };
                }
                item.rule = rule;
                if (!item.rule.items) {
                    item.rule.items = [{
                        num: 0,
                        count: 0,
                        validationStatus: 'success',
                        helpMsg: null,
                    }]
                }
                item.scopeList = Array.isArray(item.scopeList) ? item.scopeList : [];
                item.priceList = Array.isArray(item.priceList) ? item.priceList : [];
            })
            const RecomendFoodRule = foodRuleList.filter((item) => {
                return item.rule.recommendType !== 2
            })
            let tempItems = []
            RecomendFoodRule.forEach((item) => {
                tempItems.push({
                    ...item.rule.recommendRule,
                    validationStatus: 'success',
                    helpMsg: null
                })
            })
            foodRuleList[0].rule.items = tempItems
        }
        this.state = {
            foodRuleList,
            maxCount: 10,
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    componentWillReceiveProps(nextProps) {
        const foodRuleList1 = Immutable.List.isList(this.props.$foodRuleList) ? this.props.$foodRuleList.toJS() : [];
        const foodRuleList = Immutable.List.isList(nextProps.$foodRuleList) ? nextProps.$foodRuleList.toJS() : [];
        if (JSON.stringify(foodRuleList) !== JSON.stringify(foodRuleList1)) {
            if (!foodRuleList.length) { // 新建，给一组默认值
                foodRuleList.push({
                    rule: {
                        ruleType: 1,
                        startTime: '0000',
                        endTime: '2359',
                        items: [{
                            num: 0,
                            count: 0,
                            validationStatus: 'success',
                            helpMsg: null,
                        }]
                    },
                    priceList: [],
                    scopeList: [],
                })
            } else { // 编辑，已经查询并存到了store，rule字段在后端存储是json string
                foodRuleList.forEach(item => {
                    let rule;
                    try {
                        rule = JSON.parse(item.rule);
                    } catch (e) {
                        rule = {
                            ruleType: 1,
                            startTime: '0000',
                            endTime: '2359',
                        };
                    }
                    item.rule = rule;
                    if (!item.rule.items) {
                        item.rule.items = [{
                            num: 0,
                            count: 0,
                            validationStatus: 'success',
                            helpMsg: null,
                        }]
                    }
                    item.scopeList = Array.isArray(item.scopeList) ? item.scopeList : [];
                    item.priceList = Array.isArray(item.priceList) ? item.priceList : [];
                })
                const RecomendFoodRule = foodRuleList.filter((item) => {
                    return item.rule.recommendType !== 2
                })
                let items = []
                RecomendFoodRule.forEach((item) => {
                    items.push(item.rule.recommendRule)
                })
                foodRuleList[0].rule.items = items
            }
            this.setState({
                foodRuleList,
            });
        }
    }

    handleSubmit = () => {
        let { foodRuleList } = this.state;
        let nextFlag = true;
        const { intl } = this.props;
        const k6hdp74n = intl.formatMessage(SALE_STRING.k6hdp74n);
        const k6hdp8in = intl.formatMessage(SALE_STRING.k6hdp8in);
        const k6hdp8qz = intl.formatMessage(SALE_STRING.k6hdp8qz);
        const k6hdp8zb = intl.formatMessage(SALE_STRING.k6hdp8zb);

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                nextFlag = false;
            }
        })
        if (!nextFlag) return false;
        // 在这边做区分 
        const { promotionDetailInfo = {} } = this.props
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
        const promotionDetail = promotionDetailInfo.toJS()
        if (isSelDefined) {
            let tempFoodList = [_.cloneDeep(foodRuleList[0])]
            const {
                rule = {}
            } = foodRuleList[0];
            const ruleItem = rule.items || [{}]
            for (let i = 0; i < ruleItem.length; i++) {
                if (i !== 0) {
                    tempFoodList.push(_.cloneDeep(foodRuleList[0]))
                }
                let priceList = [],
                    scopeList = [];
                let flagSuccess = false
                ruleItem.forEach((every) => {
                    if (every.validationStatus == 'error') {
                        flagSuccess = true
                    }
                    if (!every.num || !every.count) {
                        flagSuccess = true
                    }
                })
                if (flagSuccess) {
                    message.warning(`添加的推荐规则请正确填写`)
                    return false;
                }
                delete ruleItem[i].validationStatus
                delete ruleItem[i].helpMsg
                tempFoodList[i].rule.recommendRule = ruleItem[i]
                tempFoodList[i].rule.recommendType = 1
                let replacePriceLst = []
                if (!promotionDetail.dishes[i] || !promotionDetail.dishes[i].length) {
                    if(promotionDetail.dishes[i]&&!promotionDetail.dishes[i].length) {
                        message.warning(`请对第${i + 1}档位，选择推荐菜品`)
                        return false;
                    } else {
                        const RecomendFoodRule = foodRuleList.filter((item) => {
                            return item.rule.recommendType !== 2
                        })
                        if(RecomendFoodRule[i].priceList.length) {
                            replacePriceLst = RecomendFoodRule[i].priceList
                        }
                    }
                }
                if (promotionDetail.dishes[i] && promotionDetail.dishes[i].length > 100) {
                    message.warning(`最多添加100道推荐菜品, 第${i + 1}档位添加多与100道菜品`)
                    return false;
                }
                console.log(tempFoodList,)
                if(replacePriceLst.length) {
                    priceList = replacePriceLst
                } else {
                    if(!promotionDetail.dishes[i] || !promotionDetail.dishes[i].length) {
                        message.warning(`请对第${i + 1}档位，选择推荐菜品`)
                        return false;
                    }
                    promotionDetail.dishes[i].forEach((group, groupIdx) => {
                        priceList.push({
                            foodUnitID: group.itemID,
                            foodUnitCode: group.foodKey,
                            foodName: group.foodName,
                            foodUnitName: group.unit,
                            foodCategoryName: group.foodCategoryName,
                            brandID: group.brandID || '0',
                            price: parseFloat(group.price),
                            stageNo: 0,
                            num: 0,
                        })
                    });
                } 
                delete tempFoodList[i].rule.items
                tempFoodList[i].priceList = priceList;
                tempFoodList[i].scopeList = scopeList;
            }
            //排除菜品单独算
            const ExcludeFoodRule = foodRuleList.filter((item) => {
                return item.rule.recommendType === 2
            })
            if(promotionDetail.excludeDishesData && promotionDetail.excludeDishesData.length) {
                let tempFood = _.cloneDeep(foodRuleList[0])
                let priceList = []
                promotionDetail.excludeDishesData.forEach((group) => {
                    priceList.push({
                        foodUnitID: group.itemID,
                        foodUnitCode: group.foodKey,
                        foodName: group.foodName,
                        foodUnitName: group.unit,
                        foodCategoryName: group.foodCategoryName,
                        brandID: group.brandID || '0',
                        price: parseFloat(group.price),
                        stageNo: -2,
                        num: 0,
                    })
                })
                tempFood.priceList = priceList
                delete tempFood.rule.items
                delete tempFood.rule.recommendRule
                tempFood.rule.recommendType = 2
                tempFoodList.push(tempFood)
            } else if(ExcludeFoodRule.length && ExcludeFoodRule[0].priceList.length&& !promotionDetail.excludeDishesData) {
                let tempFood = ExcludeFoodRule[0]
                tempFoodList.push(tempFood)
            }
            if (!nextFlag) return false;
            const tempRule = { stageType: isSelDefined ? 1 : 0 };
            this.props.setPromotionDetail({
                foodRuleList: tempFoodList.map(item => ({
                    rule: JSON.stringify(item.rule),
                    scopeList: item.scopeList,
                    priceList: item.priceList,
                })),
                rule: tempRule,
            });
            return true;
        } else {
            for (let i = 0; i < foodRuleList.length; i++) {
                let priceList = [],
                    scopeList = [];
                const {
                    data = [],
                    priceListAuto = []
                } = foodRuleList[i];
                const {
                    rule = {}
                } = foodRuleList[i];
                rule.recommendType = 0
                if (!data.length && !priceListAuto.length) {
                    message.warning(`${k6hdp74n}${i + 1}${k6hdp8in}`)
                    return false;
                }
                const unCompleteIndex = data.findIndex(group => {
                    return ((Object.keys(group.free[0]).length === 2 && Object.keys(group.foods[0]).length !== 2) || (
                        (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length === 2)
                    ))
                });
                if (unCompleteIndex > -1) {
                    message.warning(`${k6hdp74n}${i + 1}${k6hdp8qz}${unCompleteIndex + 1}${k6hdp8zb}`)
                    return false;
                }
                data.forEach((group, groupIdx) => {
                    if (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                        group.free.filter(item => Object.keys(item).length !== 2).forEach((free) => {
                            priceList.push({
                                foodUnitID: free.itemID,
                                foodUnitCode: free.foodKey,
                                foodName: free.foodName,
                                foodUnitName: free.unit,
                                brandID: free.brandID || '0',
                                price: parseFloat(free.price),
                                stageNo: groupIdx,
                                num: group.freeCountInfo[free.value || free.itemID],
                            })
                        });
                        group.foods.filter(item => Object.keys(item).length !== 2).forEach((food) => {
                            scopeList.push({
                                scopeType: '2',
                                targetID: food.itemID,
                                targetCode: food.foodKey,
                                brandID: food.brandID || '0',
                                targetName: food.foodName,
                                targetUnitName: food.unit,
                                stageNo: groupIdx,
                                num: group.foodsCountInfo[food.value || food.itemID],
                            })
                        });
                    }
                });
                priceListAuto.forEach((free) => {
                    priceList.push({
                        foodUnitID: free.foodUnitID || free.itemID,
                        foodUnitCode: free.foodKey || free.foodUnitCode,
                        foodName: free.foodName,
                        brandID: free.brandID || '0',
                        foodUnitName: free.unit || free.foodUnitName,
                        price: parseFloat(free.price),
                        stageNo: -1,
                        num: 1,
                    })
                })
                foodRuleList[i].priceList = priceList;
                foodRuleList[i].scopeList = scopeList;
            }
            if (!nextFlag) return false;
            const rule = { stageType: isSelDefined ? 1 : 0 };
            this.props.setPromotionDetail({
                foodRuleList: foodRuleList.map(item => ({
                    rule: JSON.stringify(item.rule),
                    scopeList: item.scopeList,
                    priceList: item.priceList,
                })),
                rule,
            });
            return true;
        }

    }

    handDishesChange = (val, index) => {
        const { foodRuleList } = this.state;
        foodRuleList[index].data = val;
        this.setState({
            foodRuleList
        })
    }
    autoDishesChange = (val, index) => {
        const { foodRuleList } = this.state;
        foodRuleList[index].priceListAuto = val;
        this.setState({
            foodRuleList
        })
    }
    addRule = () => {
        const { foodRuleList } = this.state;
        foodRuleList.push({
            rule: {
                startTime: undefined,
                endTime: undefined,
                ruleType: 1,
            },
            priceList: [],
            scopeList: [],
        })
        this.setState({
            foodRuleList
        })
    }
    removeRule = (index) => {
        const { foodRuleList } = this.state;
        foodRuleList.splice(index, 1)
        this.setState({
            foodRuleList
        })
    }
    handleTimeIntervalChange = (val, index) => {
        const { foodRuleList } = this.state;
        foodRuleList[index].rule = { ...val };
        this.setState({
            foodRuleList,
        })
        for (let i = 0; i < foodRuleList.length; i++) {
            if (i !== index) {
                const value = foodRuleList[i].rule
                this.props.form.setFields({
                    [`timeinfo${i}`]: { value, }
                })
            }
        }
    }
    handleFilterRecommendDishes = (index) => {
        let { foodRuleList } = this.state
        let { priceList } = foodRuleList[index]
        let filteredPriceList = priceList.filter(item => item.stageNo == -1)
        let curFoodRuleList = { ...foodRuleList[index], priceList: filteredPriceList }

        return [curFoodRuleList]
    }

    onCustomRangeInputChange = (value, index) => {
        const {
            foodRuleList = [{}]
        } = this.state
        const rule = foodRuleList[0] ? foodRuleList[0].rule : {}
        const {
            items = []
        } = rule
        const _start = value.start;
        const _end = value.end;
        let _validationStatus,
            _helpMsg;
        if (_start && _end) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = '请完整填写添加的推荐规则'
        }
        const _tmp = items
        if (
            _validationStatus === 'success' &&
            _start && _end &&
            index > 0 &&
            (Number(_start) <= Number(_tmp[index - 1].num) || Number(_end) <= Number(_tmp[index - 1].count))
        ) {
            _validationStatus = 'error';
            _helpMsg = '人数需大于上一档位人数，份数需大于上一档位份数'
        }
        if (
            _validationStatus === 'success' &&
            (_tmp.length > index + 1) &&
            _start && _end && _tmp[index + 1].num && _tmp[index + 1].count &&
            (Number(_start) >= Number(_tmp[index + 1].num) || Number(_end) >= Number(_tmp[index + 1].count))
        ) {
            _validationStatus = 'error';
            _helpMsg = '人数需每个档位递增，份数需每个档位递增'
        }
        _tmp[index] = {
            num: Number(_start),
            count: Number(_end),
            validationStatus: _validationStatus,
            helpMsg: _helpMsg,
        };
        foodRuleList[0].rule.items = _tmp
        this.setState({ foodRuleList, });
    }

    addRuleItem = () => {
        const {
            foodRuleList = [{}]
        } = this.state
        const rule = foodRuleList[0] ? foodRuleList[0].rule : {}
        const {
            items = []
        } = rule
        const _tmp = items;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            num: 0,
            count: 0,
        });
        foodRuleList[0].rule.items = _tmp
        this.setState({
            foodRuleList,
        });
    }

    deleteRule = (index, e) => {
        const {
            foodRuleList = [{}]
        } = this.state
        const rule = foodRuleList[0] ? foodRuleList[0].rule : {}
        const {
            items = []
        } = rule
        const _tmp = items;
        _tmp.splice(index, 1);
        foodRuleList[0].rule.items = _tmp
        this.setState({
            foodRuleList,
        });
    }

    renderOperationIcon = (index) => {
        const {
            foodRuleList = [{}]
        } = this.state
        if (!foodRuleList[0]) {
            return
        }
        const {
            rule = {}
        } = foodRuleList[0]
        const {
            items = []
        } = rule
        const _len = items.length;
        if (this.state.maxCount == 1) {
            return null;
        }
        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} style={{ marginTop: 20 }} disabled={false} type="plus-circle-o" onClick={this.addRuleItem} />
                </span>
            )
        }
        if (_len == this.state.maxCount && index == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon
                        className={styles.deleteIconLeft}
                        style={{ marginTop: 20 }}
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
                    <Icon style={{ marginTop: 20 }} className={styles.pulsIcon} type="plus-circle-o" onClick={this.addRuleItem} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        style={{ marginTop: 20 }}
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

    renderRulesComponent = () => {
        const {
            foodRuleList = [{}]
        } = this.state
        if (!foodRuleList[0]) {
            return
        } 
        const { rule={} } = foodRuleList[0]
        const { items=[] } = rule
        let component = this.props.isShopFoodSelectorMode ? NoThresholdDiscountFoodSelectorForShop :
            NoThresholdDiscountFoodSelector;
        return (items.map((ruleInfo, index) => {
            const _value = {
                start: null,
                end: null,
            };
            if (ruleInfo.num) {
                _value.start = ruleInfo.num;
            }
            if (ruleInfo.count) {
                _value.end = ruleInfo.count;
            }

            return (
                <Row key={index} style={{ marginBottom: 13, background: '#80808024', padding: '20px 0px', borderRadius: 7 }}>
                    <Col>
                        <FormItem
                            label="推荐规则"
                            className={styles.FormItemStyle}
                            validateStatus={ruleInfo.validationStatus}
                            help={ruleInfo.helpMsg}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 20,
                            }}
                            style={{
                                marginBottom: 10
                            }}
                        >
                            <CustomRangeInput
                                value={
                                    _value
                                }
                                firstInputAppend={true}
                                relation={'人就餐，点菜份数不足'}
                                onChange={(value) => {
                                    this.onCustomRangeInputChange(value, index);
                                }
                                }
                            />
                            <span className={styles.appenOnSpan}>{',则推荐如下菜品'}</span>
                        </FormItem>
                        <ConnectedScopeListSelector
                            component={component}
                            isShopMode={this.props.isShopFoodSelectorMode}
                            priceList={foodRuleList[index] && foodRuleList[index].priceList}
                            noExclude={true}
                            dishIndex={index}
                        />
                    </Col>
                    <Col>
                        {this.renderOperationIcon(index)}
                    </Col>

                </Row>

            )
        }))
    }

    render() {
        const {
            foodRuleList,
        } = this.state;
        const { intl } = this.props;
        const k6hdp7cz = intl.formatMessage(SALE_STRING.k6hdp7cz);
        const k6hdp7lb = intl.formatMessage(SALE_STRING.k6hdp7lb);
        const k6hdp7tn = intl.formatMessage(SALE_STRING.k6hdp7tn);
        const k6hdp74n = intl.formatMessage(SALE_STRING.k6hdp74n);
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
        const ExcludeFoodRule = foodRuleList.filter((item) => {
            return item.rule.recommendType === 2
        })
        if (isSelDefined) {
            let component = this.props.isShopFoodSelectorMode ? NoThresholdDiscountFoodSelectorForShop :
                NoThresholdDiscountFoodSelector;
            return (
                <div>
                    <Form className={styles.FormStyle}>
                        <FormItem
                            // label={'推荐规则'}
                            className={styles.FormItemStyle}
                            // labelCol={{
                            //     span: 4,
                            // }}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            {
                                this.renderRulesComponent()
                            }
                        </FormItem>
                    </Form>
                    <Form className={styles.FormStyle}>
                        <ConnectedScopeListSelector
                            component={component}
                            noDish={true}
                            isShopMode={this.props.isShopFoodSelectorMode}
                            priceList={ExcludeFoodRule[0] &&ExcludeFoodRule[0].priceList}
                        />
                    </Form>
                </div>
            )
        } else {
            return (
                <div>
                    <Form className={styles.FormStyle}>
                        {
                            foodRuleList.map((item, index) => (
                                <div className={selfStyle.blockWrapper}>
                                    <div className={selfStyle.iconArea}>
                                        {
                                            (index === foodRuleList.length - 1 && index < 99) && (
                                                <Icon
                                                    onClick={this.addRule}
                                                    style={{ marginRight: 10 }}
                                                    className={selfStyle.plusIcon}
                                                    type="plus-circle-o"
                                                />
                                            )
                                        }
                                        {
                                            (foodRuleList.length > 1) && (
                                                <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.removeRule(index)}>
                                                    <Icon
                                                        style={{ marginRight: 10 }}
                                                        className={selfStyle.deleteIcon}
                                                        type="minus-circle-o"
                                                    />
                                                </Popconfirm>
                                            )
                                        }
                                    </div>
                                    <div className={selfStyle.blockHeader}>
                                        <FormItem
                                            label={k6hdp74n + `${index + 1}`}
                                            colon={false}
                                            required={true}
                                            labelCol={{ span: 3 }}
                                            wrapperCol={{ span: 20 }}
                                        >
                                            {
                                                this.props.form.getFieldDecorator(`timeinfo${index}`, {
                                                    initialValue: item.rule, // {startTime: 'HHmm', endTime: 'HHmm'}
                                                    onChange: (val) => this.handleTimeIntervalChange(val, index),
                                                    rules: [
                                                        {
                                                            validator: (rule, v, cb) => {
                                                                if (!v || !v.startTime || !v.endTime) {
                                                                    return cb(k6hdp7cz);
                                                                }
                                                                if (v.startTime > v.endTime) {
                                                                    return cb(k6hdp7lb);
                                                                }
                                                                for (let i = 0; i < index; i++) {
                                                                    const rule = foodRuleList[i].rule;
                                                                    if (!!rule.startTime && !!rule.endTime) {
                                                                        // 时间段设置不可以重叠
                                                                        if ((v.startTime >= rule.startTime
                                                                            && v.startTime <= rule.endTime) || (
                                                                                v.endTime >= rule.startTime
                                                                                && v.endTime <= rule.endTime
                                                                            ) || (rule.startTime >= v.startTime
                                                                                && rule.startTime <= v.endTime) || (
                                                                                rule.endTime >= v.startTime
                                                                                && rule.endTime <= v.endTime
                                                                            )) {
                                                                            return cb(k6hdp7tn);
                                                                        }
                                                                    }
                                                                }
                                                                cb()
                                                            },
                                                        },
                                                    ],
                                                })(<RecommendTimeInterval />)
                                            }
                                        </FormItem>
                                    </div>
                                    <div className={selfStyle.blockContent}>
                                        <FormItem
                                            label={SALE_LABEL.k6hdp81z}
                                            colon={false}
                                            labelCol={{ span: 3 }}
                                            wrapperCol={{ span: 20 }}
                                        >
                                            {
                                                this.props.isShopFoodSelectorMode ? (
                                                    <CollocationTableWithoutBrandID
                                                        prices={item.priceList}
                                                        scopes={item.scopeList}
                                                        onChange={(val) => this.handDishesChange(val, index)}
                                                    />
                                                ) : (
                                                    <CollocationTableWithBrandID
                                                        prices={item.priceList}
                                                        scopes={item.scopeList}
                                                        onChange={(val) => this.handDishesChange(val, index)}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem
                                            label={SALE_LABEL.k6hdp8ab}
                                            colon={false}
                                            style={{ marginTop: 12 }}
                                            labelCol={{ span: 3 }}
                                            wrapperCol={{ span: 20 }}
                                        >
                                            {
                                                this.props.form.getFieldDecorator(`priceList${index}`, {
                                                    initialValue: item.priceList.filter(item => item.stageNo == -1),
                                                    onChange: (val) => this.autoDishesChange(val, index)
                                                })(<ConnectedPriceListSelector foodRuleList={this.handleFilterRecommendDishes(index)} index={0} isShopMode={this.props.isShopFoodSelectorMode} />)
                                            }
                                        </FormItem>
                                    </div>
                                </div>
                            ))
                        }
                    </Form>
                </div>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        $foodRuleList: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'foodRuleList']),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail']),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
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
)(Form.create()(RecommendFoodDetailInfo));
