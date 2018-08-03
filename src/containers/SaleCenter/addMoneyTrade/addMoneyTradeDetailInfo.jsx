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
import { Row, Col, Form, Select, Radio, Input, InputNumber } from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';
let Immutable = require('immutable');
import EditBoxForDishes from '../common/EditBoxForDishes';

import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';


const client = [
    {key:'0',value:'0', name:'不限制'},
    {key:'1',value:'1', name:'仅会员'},
    {key:'2',value:'2', name:'非会员'}
];

class AddfreeAmountTradeDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            foodMenuList:[],
            foodCategoryCollection:[],
            freeAmount:'',
            stageAmount: '',
            dishes:[],
            freeAmountFlag:true,
            stageAmountFlag:true,
            ruleType:'0'
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.ruleTypeChange = this.ruleTypeChange.bind(this);
    }

    componentDidMount() {
        var opts = {
            _groupID: this.props.user.accountInfo.groupID,
            // shopID: '77876'
        };
        this.props.promotionDetailInfo.getIn(["$foodCategoryListInfo", "initialized"]) ||
        this.props.fetchFoodCategoryInfo({
            ...opts
        });
        this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"]) ||
        this.props.fetchFoodMenuInfo({
            ...opts
        });
        this.props.getSubmitFn({
            finish:this.handleSubmit,
        });

        if(this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"])){
            let foodMenuList = this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records;

            this.setState({
                foodMenuList:foodMenuList,
            })
        }
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail','scopeLst']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule  = Object.assign({}, _rule);
        let {display} = this.state;
        display = !this.props.isNew;
        //根据ruleJson填充页面
        this.setState({
            display,
            stageAmount:_rule.stage ? _rule.stage[0].stageAmount : '',
            freeAmount:_rule.stage ? _rule.stage[0].freeAmount : '',
            ruleType: _scopeLst.size>0? '1' : '0'

        });
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"])&&
        nextProps.promotionDetailInfo.getIn(["$foodCategoryListInfo", "initialized"])){
            this.setState({
                foodMenuList:nextProps.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records,
                foodCategoryCollection:nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS()
            })
        }

        if(nextProps.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"]) &&
            nextProps.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).size>0){
            let foodMenuList = nextProps.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records;
            let _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail','priceLst'])?
                nextProps.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).toJS():[];
            let _dish = _priceLst.map((price)=>{
                return foodMenuList.find((food)=>{
                    return food.foodKey === price.foodUnitCode;
                });
            });
            _dish.map((item=>{
                item.id = item.foodID;
                item.content = item.foodName;
            }));
            this.setState({
                foodMenuList:foodMenuList,
                dishes:_dish
            });
        }
    }

    handleSubmit = () => {
        let {stageAmount, dishes, stageAmountFlag, foodMenuList, freeAmount, freeAmountFlag, ruleType} = this.state;
        if(stageAmount == null || stageAmount==''){
            stageAmountFlag = false;
        }
        if(freeAmount == null || freeAmount==''){
            freeAmountFlag = false;
        }
        this.setState({freeAmountFlag, stageAmountFlag});

        if(stageAmountFlag && freeAmountFlag){
            let rule = {
                stageType:2,
                stage:[
                    {
                        stageAmount:stageAmount,
                        freeAmount:freeAmount
                    }
                ]
            }

            let dish = dishes.map((dish)=>{
                return foodMenuList.find((menu)=>{
                    return dish.id === menu.foodID
                })
            });
            let priceLst = dish.map((price)=>{
                return {
                    foodUnitID:price.itemID,
                    foodUnitCode:price.foodKey,
                    foodName:price.foodName,
                    foodUnitName:price.unit,
                    price:price.price
                }

            });
            if(ruleType == '0'){
                this.props.setPromotionDetail({
                    rule,
                    priceLst,
                    scopeLst:[],
                    dishes:[],
                    excludeDishes:[],
                    foodCategory: []
                });
            }else{
                this.props.setPromotionDetail({
                    rule,priceLst
                });
            }

            return true
        }else{
            return false
        }

    };


    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };
    //减免金额
    onStageAmountChange(value){
        let {stageAmount, stageAmountFlag} = this.state;
        if(value.number == null || value.number == ""){
            stageAmountFlag = false;
            stageAmount = value.number;
        }else{
            stageAmountFlag = true;
            stageAmount = value.number;
        }
        this.setState({stageAmount, stageAmountFlag});

    }
    //满金额
    handleFreeAmountChange(value){
        let {freeAmount, freeAmountFlag} = this.state;
        if(value.number == null || value.number == ""){
            freeAmountFlag = false;
            freeAmount = value.number;
        }else{
            freeAmountFlag = true;
            freeAmount = value.number;
        }
        this.setState({freeAmount, freeAmountFlag});

    }

    renderBuyDishNumInput(){
        return (
            <FormItem className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')}
                      wrapperCol={{span:17,offset:4}} required={true} validateStatus={this.state.freeAmountFlag?'success':'error'}
                      help={this.state.freeAmountFlag ? null:'请输入加价金额'}
            >
                <PriceInput addonBefore={'加价'}
                            addonAfter={'元'}
                            value={{number:this.state.freeAmount}}
                            defaultValue = {{number:this.state.freeAmount}}
                            onChange = {this.handleFreeAmountChange}
                            modal="int"
                />
            </FormItem>
        )
    }

    renderDishsSelectionBox(){
        return (

            <FormItem
                label="换购菜品" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>
                <EditBoxForDishes onChange={(value)=>{
                    this.onDishesChange(value);
                }}/>
            </FormItem>
        )

    }
    //换购菜品onchange
    onDishesChange(value){
        let {dishes} = this.state;
        dishes = value;
        this.setState({dishes});
    }

    renderAdvancedSettingButton(){
        return (

            <FormItem className={[styles.FormItemStyle,styles.formItemForMore].join(' ')} wrapperCol={{span: 17,offset:4}} >
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px"/>}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px"/>}
                </span>
            </FormItem>
        )
    }

    ruleTypeChange(val){
        this.setState({ruleType: val})
    }

    render(){
        return(
            <div>
                <Form className={[styles.FormStyle,styles.bugGive].join(' ')}>
                    <FormItem
                        label="活动方式" className={styles.FormItemStyle}  labelCol={{span:4}}
                        wrapperCol={{span:17}}  >
                        <p>
                            任意或指定消费满一定金额后再加价一定金额即可换购指定菜品
                        </p>
                    </FormItem>
                    <FormItem
                        className={[styles.FormItemStyle, styles.explainBack].join(' ')} wrapperCol={{span:17, offset:4}}
                        validateStatus={this.state.stageAmountFlag?'success':'error'}
                        help={this.state.stageAmountFlag?null:'请输入消费金额'}
                    >
                        <PriceInput addonBefore={
                            <Select size="default" onChange={this.ruleTypeChange} value={this.state.ruleType}>
                                <Option key="0" value='0'>任意消费满</Option>
                                <Option key="1" value='1'>活动菜品消费满</Option>
                            </Select>
                            }
                            addonAfter={'元'}
                            value={{number: this.state.stageAmount}}
                            defaultValue={{number: this.state.stageAmount}}
                            onChange={this.onStageAmountChange}
                            modal="int"
                        />
                    </FormItem>
                    {
                        this.state.ruleType == '0' ?
                            null:
                            <PromotionDetailSetting />
                    }
                    {this.renderBuyDishNumInput()}
                    {this.renderDishsSelectionBox()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit = {false}/> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo : state.sale_old_steps.toJS(),
        fullCut: state.sale_old_fullCut,
        promotionDetailInfo: state.sale_old_promotionDetailInfo,
        promotionScopeInfo: state.sale_old_promotionScopeInfo,
        user:state.user.toJS()
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts)=>{
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
        fetchFoodCategoryInfo: (opts)=>{
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AddfreeAmountTradeDetailInfo));
