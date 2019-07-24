
import React, { Component } from 'react'
import { Form, Select, message, Checkbox, Input, Icon, Button } from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import CollocationTable from '../common/CollocationTable'; // 表格
import EditBoxForDishes from '../../../containers/SaleCenterNEW/common/EditBoxForDishes';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CollocationTableWithBrandID from '../common/CollocationTableWithBrandID';

// 推荐菜品只有集团可以设置,若以后门店也可设置，菜品选择组件需要仔细修改!important
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
        if (handSetChecked) {
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
            }) : nextFlag = false
        }
        if (autoSetChecked) {
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
        }
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
    render() {
        const { recommendNumStatus, recommendTopNumStatus } = this.state;
        const { isShopFoodSelectorMode } = this.props;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <FormItem label="猜你喜欢" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>      
                        <CollocationTableWithBrandID
                            onChange={this.handDishesChange}
                        />             
                    </FormItem>                  
                    <FormItem label="热销推荐" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                        {
                            this.props.form.getFieldDecorator('priceLst', {
                                initialValue: this.state.priceLstAuto,
                            })(                                           
                                <ConnectedPriceListSelector onChange={this.autoDishesChange} />                                        
                            )
                        }
                    </FormItem>       
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
