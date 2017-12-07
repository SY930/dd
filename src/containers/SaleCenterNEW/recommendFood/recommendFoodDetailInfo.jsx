
import React, { Component } from 'react'
import { Form, Select, message, Checkbox } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import CollocationTable from '../common/CollocationTable'; // 表格
import EditBoxForDishes from '../../../containers/SaleCenterNEW/common/EditBoxForDishes';

const FormItem = Form.Item;
const Option = Select.Option;


import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

class RecommendFoodDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            priceLst: [],
            scopeLst: [],
            handSetChecked: true,
            autoSetChecked: false,
            priceLstHand: [],
            priceLstAuto: [],
            stageType: 1,
        };

        this.onHandSetChange = this.onHandSetChange.bind(this);
        this.onAutoSetChange = this.onAutoSetChange.bind(this);
        this.handDishesChange = this.handDishesChange.bind(this);
        this.autoDishesChange = this.autoDishesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        const _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        const stageType = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']) ?
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']).toJS().stageType : '1';
        let { display } = this.state;
        display = !this.props.isNew;
        const priceLstHand = _priceLst.filter((food) => { return food.stageNo > -1 })
        const priceLstAuto = _priceLst.filter((food) => { return food.stageNo == -1 })
        this.setState({
            display,
            // priceLst: _priceLst,
            priceLstHand,
            priceLstAuto,
            scopeLst: _scopeLst,
            handSetChecked: !!(stageType == 0 || stageType == 1),
            autoSetChecked: !!(stageType == 0 || stageType == 2),
        }, () => {
            this.props.form.setFieldsValue({ 'priceLst': this.state.priceLstAuto })
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.get('$promotionDetail') != this.props.promotionDetailInfo.get('$promotionDetail')) {
            const _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
            const _scopeLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
            const priceLstHand = _priceLst.filter((food) => { return food.stageNo > -1 })
            const priceLstAuto = _priceLst.filter((food) => { return food.stageNo == -1 })
            this.setState({
                // priceLst: _priceLst,
                priceLstHand,
                priceLstAuto,
                scopeLst: _scopeLst,
            });
        }
    }

    handleSubmit() {
        let { data, stageType, handSetChecked, autoSetChecked, priceLstAuto } = this.state;
        let priceLst = [],
            scopeLst = [],
            nextFlag = true,
            dataFalg = true;
        stageType = handSetChecked && !autoSetChecked ? 1 : !handSetChecked && autoSetChecked ? 2 : handSetChecked && autoSetChecked ? 0 : ''
        this.props.form.validateFields((err, values) => {
            if (err) {
                nextFlag = false;
            }
        })
        if (handSetChecked) {
            data ? data.forEach((group, groupIdx) => {
                if (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                    group.free.forEach((free) => {
                        priceLst.push({
                            foodUnitID: free.itemID,
                            foodUnitCode: free.foodKey,
                            foodName: free.foodName,
                            foodUnitName: free.unit,
                            price: parseFloat(free.price),
                            stageNo: groupIdx,
                            num: group.freeCountInfo[free.itemID],
                        })
                    });
                    group.foods.forEach((food) => {
                        scopeLst.push({
                            scopeType: 'FOOD_INCLUDED',
                            targetID: food.itemID,
                            targetCode: food.foodKey,
                            targetName: food.foodName,
                            targetUnitName: food.unit,
                            stageNo: groupIdx,
                            num: group.foodsCountInfo[food.itemID],
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
                    foodUnitName: free.unit || free.foodUnitName,
                    price: parseFloat(free.price),
                    stageNo: -1,
                    num: 1,
                })
            })
        }
        if (!handSetChecked && !autoSetChecked) {
            nextFlag = false;
            message.warning('请至少选择一种推荐方式')
        }
        if (nextFlag) {
            this.props.setPromotionDetail({
                priceLst,
                scopeLst,
                rule: { stageType },
            });
            return true;
        }
        handSetChecked && (!data || !dataFalg || data.length == 0) && message.warning('主菜、推荐菜数据不完整');
        autoSetChecked && priceLstAuto.length == 0 && message.warning('适用菜品不得为空');
        return false;
    }

    handDishesChange(val) {
        this.setState({
            data: val,
        })
    }
    autoDishesChange(val) {
        console.log(val)
        this.setState({
            priceLstAuto: val,
        })
    }
    onHandSetChange(e) {
        this.setState({ handSetChecked: e.target.checked })
    }
    onAutoSetChange(e) {
        this.setState({ autoSetChecked: e.target.checked })
    }
    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <FormItem style={{ marginLeft: 89 }}>
                        <Checkbox onChange={this.onHandSetChange} checked={this.state.handSetChecked}>手动设置推荐菜</Checkbox>
                    </FormItem>
                    {
                        this.state.handSetChecked ?
                            <FormItem label=" " colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} required={true}>
                                <CollocationTable
                                    onChange={this.handDishesChange}
                                    priceLst={this.state.priceLstHand}
                                    scopeLst={this.state.scopeLst}
                                    type="RECOMMEND_FOOD"
                                />
                            </FormItem> : null
                    }
                    <FormItem style={{ marginLeft: 89 }}>
                        <Checkbox
                            onChange={this.onAutoSetChange}
                            checked={this.state.autoSetChecked}
                            style={{ marginTop: 30 }}
                        >TOP-N智能推荐菜</Checkbox>
                    </FormItem>
                    {
                        this.state.autoSetChecked ?
                            <FormItem label=" " colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                {
                                    this.props.form.getFieldDecorator('priceLst', {
                                        rules: [{
                                            required: true,
                                            message: '适用菜品不得为空',
                                        }],
                                        initialValue: this.state.priceLstAuto,
                                    })(
                                        <EditBoxForDishes onChange={this.autoDishesChange} type="RECOMMEND_FOOD" />
                                    )}
                            </FormItem> : null
                    }
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.steps.toJS(),
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(RecommendFoodDetailInfo));
