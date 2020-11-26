
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
import {injectIntl} from '../IntlDecor';

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
                },
                priceList: [],
                scopeList: [],
            },)
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
                item.scopeList = Array.isArray(item.scopeList) ? item.scopeList : [];
                item.priceList = Array.isArray(item.priceList) ? item.priceList : [];
            })
        }
        this.state = {
            foodRuleList,
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleSubmit = () => {
        const { foodRuleList } = this.state;
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
        for (let i = 0; i < foodRuleList.length; i ++) {
            let priceList = [],
            scopeList = [];
            const {
                data = [],
                priceListAuto = []
            } = foodRuleList[i];
            if (!data.length && !priceListAuto.length) {
                message.warning(`${k6hdp74n}${i+1}${k6hdp8in}`)
                return false;
            }
            const unCompleteIndex = data.findIndex(group => {
                return ((Object.keys(group.free[0]).length === 2 && Object.keys(group.foods[0]).length !== 2) || (
                    (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length === 2)
                    ))
            });
            if (unCompleteIndex > -1) {
                message.warning(`${k6hdp74n}${i+1}${k6hdp8qz}${unCompleteIndex + 1}${k6hdp8zb}`)
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
        const rule = { stageType: 0 };
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
        foodRuleList[index].rule = {...val};
        this.setState({
            foodRuleList,
        })
        for (let i = 0; i < foodRuleList.length; i++) {
            if (i !== index) {
                const value = foodRuleList[i].rule
                this.props.form.setFields({
                    [`timeinfo${i}`]: {value,}
                })
            }
        }
    }
    handleFilterRecommendDishes = (index) => {
        let {foodRuleList} = this.state
        let {priceList} = foodRuleList[index]
        let filteredPriceList = priceList.filter(item => item.stageNo == -1)
        let curFoodRuleList = {...foodRuleList[index], priceList: filteredPriceList}

        return [curFoodRuleList]
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
                                        style={{marginTop: 12}}
                                        labelCol={{ span: 3 }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        {
                                            this.props.form.getFieldDecorator(`priceList${index}`, {
                                                initialValue: item.priceList.filter(item => item.stageNo == -1),
                                                onChange: (val) =>  this.autoDishesChange(val, index)
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

function mapStateToProps(state) {
    return {
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        $foodRuleList: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'foodRuleList']),
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
