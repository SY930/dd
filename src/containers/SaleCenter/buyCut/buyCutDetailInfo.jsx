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
import { Form, Radio } from 'antd';
import { connect } from 'react-redux'
import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import PriceInput from '../../../containers/SaleCenter/common/PriceInput';
import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}
let Immutable = require('immutable');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class BuyCutDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            display:false,
            stageAmount:"",
            freeAmount:"",
            discountRate:"",
            targetScope:0,
            stageAmountFlag:true,
            freeAmountFlag:true,
            discountRateFlag:true,
            cutWay:'0'
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderGiveDishNumInput = this.renderGiveDishNumInput.bind(this);
        this.renderCutWay = this.renderCutWay.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onDiscountRateChange = this.onDiscountRateChange.bind(this);
        this.onFreeAmountChange = this.onFreeAmountChange.bind(this);
        this.onCutWayChange = this.onCutWayChange.bind(this);
    }

    componentDidMount() {

        this.props.getSubmitFn({
            finish:this.handleSubmit,
        });

        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule  = Object.assign({}, _rule);
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            stageAmount:_rule.stageAmount,
            freeAmount:_rule.freeAmount || '',
            discountRate: _rule.discountRate *10 || '',
            cutWay: _rule.freeAmount? '0':'1'
        });
    };

    componentWillReceiveProps(nextProps){

        if(this.props.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])!=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])){
            this.setState({targetScope:nextProps.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])});
        }
    }

    handleSubmit = () => {
        let { cutWay, stageAmount, freeAmount, discountRate, targetScope, stageAmountFlag, freeAmountFlag, discountRateFlag} = this.state;
        if(stageAmount == null || stageAmount==''){
            stageAmountFlag = false;
        }
        if(freeAmount == null || freeAmount==''){
            freeAmountFlag = false;
        }
        if(discountRate == null || discountRate=='' || parseFloat(discountRate)>100){
            discountRateFlag = false;
        }
        this.setState({freeAmountFlag, discountRateFlag, stageAmountFlag});

        if(cutWay == '0'){
            if(stageAmountFlag && freeAmountFlag ){
                this.props.setPromotionDetail({
                    rule:{
                        disType: 1,
                        stageType: 0,
                        targetScope:targetScope,
                        stageAmount:stageAmount,
                        freeAmount:parseFloat(freeAmount)
                    }
                });
                return true;
            }else{
                return false;
            }
        }else{
            if(stageAmountFlag && discountRateFlag ){
                this.props.setPromotionDetail({
                    rule:{
                        disType: 2,
                        stageType:0,
                        targetScope:targetScope,
                        stageAmount:stageAmount,
                        discountRate:parseFloat(discountRate/10)
                    }
                });
                return true;
            }else{
                return false;
            }
        }

    };
    //优惠方式change
    onCutWayChange(e){
        let {cutWay} = this.state;
        cutWay = e.target.value;
        this.setState({cutWay});
    }
    //高级设置的显示隐藏
    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };
    //指定菜品的购买数量
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
    //减免金额change
    onFreeAmountChange(value){
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
    //折扣率change
    onDiscountRateChange(value){
        let {discountRate, discountRateFlag} = this.state;
        if(value.number == null || value.number == "" || parseFloat(value.number)>100){
            discountRateFlag = false;
            discountRate = value.number;
        }else{
            discountRateFlag = true;
            discountRate = value.number;
        }
        this.setState({discountRate, discountRateFlag});

    }

    renderBuyDishNumInput(){
        return (
            <FormItem className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')}
                      wrapperCol={{span:17,offset:4}} required={true} validateStatus={this.state.stageAmountFlag?'success':'error'}>

                    <PriceInput addonBefore={'购买指定菜品满'}
                                addonAfter={'份'}
                                value={{number:this.state.stageAmount}}
                                defaultValue = {{number:this.state.stageAmount}}
                                onChange = {this.onStageAmountChange}
                                modal="int"
                    />
                    <span className={[styles.gTip,styles.gTipInLine].join(' ')}>表示购买菜品的总数，如输入2，代表所有菜品任意购买满2份</span>
            </FormItem>
        )
    }

    renderGiveDishNumInput(){
        if(this.state.cutWay === '0'){
            return(<FormItem className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')}
                             wrapperCol={{span:17,offset:4}} required={true} validateStatus={this.state.freeAmountFlag?'success':'error'}>

                    <PriceInput addonBefore={'减免金额'}
                                addonAfter={'元'}
                                value={{number:this.state.freeAmount}}
                                defaultValue = {{number:this.state.freeAmount}}
                                onChange = {this.onFreeAmountChange}
                                modal="float"
                    />
                </FormItem>
            )
        }else{
            return(<FormItem className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')}
                             wrapperCol={{span:17,offset:4}} required={true} validateStatus={this.state.discountRateFlag?'success':'error'}>

                    <PriceInput addonBefore={'打折扣率'}
                                addonAfter={'%'}
                                value={{number:this.state.discountRate}}
                                defaultValue = {{number:this.state.discountRate}}
                                onChange = {this.onDiscountRateChange}
                                modal="float"
                    />
                </FormItem>
            )
        }
    }

    renderCutWay(){
        return (

            <FormItem
                label="优惠方式" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>
                <RadioGroup value={this.state.cutWay} onChange={this.onCutWayChange}>
                    <Radio value={'0'} key='0'>减金额</Radio>
                    <Radio value={'1'} key='1'>打折扣</Radio>
                </RadioGroup>
            </FormItem>
        )

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

    render(){
        return(
            <div>
                <Form className={[styles.FormStyle,styles.bugGive].join(' ')}>
                    <PromotionDetailSetting />
                    {this.renderBuyDishNumInput()}
                    {this.renderCutWay()}
                    {this.renderGiveDishNumInput()}
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
)(Form.create()(BuyCutDetailInfo));
