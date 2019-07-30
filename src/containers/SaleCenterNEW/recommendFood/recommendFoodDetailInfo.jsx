
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
import CollocationTable from '../common/CollocationTable';
import EditBoxForDishes from '../../../containers/SaleCenterNEW/common/EditBoxForDishes';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'
import selfStyle from './selfStyle.less'

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CollocationTableWithBrandID from '../common/CollocationTableWithBrandID';
import RecommendTimeInterval from './RecommendTimeInterval';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

// 推荐菜品只有集团可以设置,若以后门店也可设置，菜品选择组件需要仔细修改!important
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
                message.warning(`使用时段${i+1}中猜你喜欢和热销推荐不能全部为空`)
                return false;
            }
            const unCompleteIndex = data.findIndex(group => {
                return ((Object.keys(group.free[0]).length === 2 && Object.keys(group.foods[0]).length !== 2) || (
                    (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length === 2)
                    ))
            });
            if (unCompleteIndex > -1) {
                message.warning(`使用时段${i+1}中组合${unCompleteIndex + 1}没有搭配完整`)
                return false;
            }
            data.forEach((group, groupIdx) => {
                if (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                    group.free.forEach((free) => {
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
                    group.foods.forEach((food) => {
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
                } else {
                    nextFlag = false;
                }
            });
            priceListAuto.map((free) => {
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
    render() {
        const {
            foodRuleList,
        } = this.state;
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
                                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.removeRule(index)}>
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
                                        label={`使用时段${index + 1}`}
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
                                                                return cb('使用时段必须填写完整');
                                                            }
                                                            if (v.startTime > v.endTime) {
                                                                return cb('结束时间不能早于开始时间');
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
                                                                        return cb('时段设置不能有交叉');
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
                                        label="猜你喜欢"
                                        colon={false}
                                        labelCol={{ span: 3 }}
                                        wrapperCol={{ span: 20 }}
                                    >      
                                        <CollocationTableWithBrandID
                                            prices={item.priceList}
                                            scopes={item.scopeList}
                                            onChange={(val) => this.handDishesChange(val, index)}
                                        />             
                                    </FormItem>                  
                                    <FormItem
                                        label="热销推荐"
                                        colon={false}
                                        style={{marginTop: 12}}
                                        labelCol={{ span: 3 }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        {
                                            this.props.form.getFieldDecorator(`priceList${index}`, {
                                                initialValue: item.priceList.filter(item => item.stageNo == -1),
                                                onChange: (val) =>  this.autoDishesChange(val, index)
                                            })(<ConnectedPriceListSelector />)
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
