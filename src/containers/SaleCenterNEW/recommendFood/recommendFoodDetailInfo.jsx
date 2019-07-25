
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
import CollocationTable from '../common/CollocationTable'; // 表格
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

// FIXME: 推荐菜品只有集团可以设置,若以后门店也可设置，菜品选择组件需要仔细修改!important
class RecommendFoodDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        let _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']);
        let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        _priceLst = Immutable.List.isList(_priceLst) ? _priceLst.toJS() : [];
        _scopeLst = Immutable.List.isList(_scopeLst) ? _scopeLst.toJS() : [];
        const priceLstHand = _priceLst.filter((food) => { return food.stageNo > -1 })
        const priceLstAuto = _priceLst.filter((food) => { return food.stageNo == -1 })   
        this.state = {
            priceLstHand,
            priceLstAuto,
            scopeLst: _scopeLst,
            stageType: 1,
            foodRuleList: [
                {
                    rule: {
                        startTime: '0000',
                        endTime: '2359',
                    },
                },
            ]
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleSubmit = () => {
        let { data, stageType, handSetChecked, autoSetChecked, priceLstAuto, recommendNum, recommendTopNum, recommendNumStatus, recommendTopNumStatus } = this.state;
        let priceLst = [],
            scopeLst = [],
            nextFlag = true,
            dataFalg = true;
        stageType = handSetChecked && !autoSetChecked ? 1 : !handSetChecked && autoSetChecked ? 2 : handSetChecked && autoSetChecked ? 0 : ''
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                nextFlag = false;
            }
        })
        if (!nextFlag) return false;
        if (Array.isArray(data)) {
            const unCompleteIndex = data.findIndex(group => {
                return ((Object.keys(group.free[0]).length === 2 && Object.keys(group.foods[0]).length !== 2) || (
                    (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length === 2)
                    ))
            });
            if (unCompleteIndex > -1) {
                message.warning(`组合${unCompleteIndex + 1}没有搭配完整`)
                return false;
            }
        }
        data ? data.forEach((group, groupIdx) => {
            if (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                group.free.forEach((free) => {
                    priceLst.push({
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
                    scopeLst.push({
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
                dataFalg = false;
            }
        }) : nextFlag = false;
        priceLstAuto.map((free) => {
            priceLst.push({
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
        
        const rule = { stageType };
        recommendNum ? rule.recommendNum = recommendNum : null;
        recommendTopNum ? rule.recommendTopNum = recommendTopNum : null;
        this.props.setPromotionDetail({
            priceLst,
            scopeLst,
            rule,
        });
        return true;
    }

    handDishesChange = (val) => {
        this.setState({
            data: val,
        })
    }
    autoDishesChange = (val) => {
        this.setState({
            priceLstAuto: val,
        })
    }
    addRule = () => {
        const { foodRuleList } = this.state;
        foodRuleList.push({
            rule: {
                startTime: undefined,
                endTime: undefined,
            },
            priceLst: [],
            scopeLst: [],
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
                this.props.form.validateFields([`timeinfo${i}`])
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
                                        label="使用时段"
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
                                            })(
                                                <RecommendTimeInterval />
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <FormItem
                                    label="猜你喜欢"
                                    colon={false}
                                    labelCol={{ span: 3 }}
                                    wrapperCol={{ span: 20 }}
                                >      
                                    <CollocationTableWithBrandID
                                        onChange={this.handDishesChange}
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
                                        this.props.form.getFieldDecorator(`priceLst${index}`, {
                                            initialValue: this.state.priceLstAuto,
                                        })(                                           
                                            <ConnectedPriceListSelector onChange={this.autoDishesChange} />                                        
                                        )
                                    }
                                </FormItem>
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
)(Form.create()(RecommendFoodDetailInfo));
