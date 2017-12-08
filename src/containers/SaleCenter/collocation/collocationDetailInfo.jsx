/**
 * @Author: chenshuang
 * @Date:   2017-04-01T10:37:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:57:47+08:00
 */



/*
 update by Cs on 2017/03/02 。 添加特价
 */

import React, { Component } from 'react'
import { Form, Select, message } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import CollocationTable from "../common/CollocationTable";  //表格

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

class CollocationDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            priceLst: [],
            scopeLst: []
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
        this.dishesChange = this.dishesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){

        this.props.getSubmitFn({
            finish:this.handleSubmit,
        });
        let _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).toJS();
        let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail','scopeLst']).toJS();
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            priceLst: _priceLst,
            scopeLst: _scopeLst
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.promotionDetailInfo.get('$promotionDetail') != this.props.promotionDetailInfo.get('$promotionDetail')){
            let _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).toJS();
            let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail','scopeLst']).toJS();
            this.setState({
                priceLst: _priceLst,
                scopeLst: _scopeLst,
            });
        }
    }

    handleSubmit(){
        let {data} = this.state;
        let priceLst = [],
            scopeLst = [],
            nextFlag = true;
        data.forEach((group, groupIdx)=>{
            if(Object.keys(group.free[0]).length!== 2&& Object.keys(group.foods[0]).length !== 2){
                group.free.forEach((free)=>{
                    priceLst.push({
                        foodUnitID:free.itemID,
                        foodUnitCode:free.foodKey,
                        foodName:free.foodName,
                        foodUnitName:free.unit,
                        price:parseFloat(free.price),
                        stageNo: groupIdx,
                        num: group.freeCountInfo[free.itemID]
                    })
                });
                group.foods.forEach((food)=>{
                    scopeLst.push({
                        scopeType: "FOOD_INCLUDED",
                        targetID: food.itemID,
                        targetCode: food.foodKey,
                        targetName: food.foodName,
                        targetUnitName: food.unit,
                        stageNo: groupIdx,
                        num: group.foodsCountInfo[food.itemID]
                    })
                });
            }else{
                nextFlag = false;
            }

        });
        if(nextFlag){
            this.props.setPromotionDetail({
                priceLst,
                scopeLst
            });
            return true;
        }else{
            message.warning('菜品、赠菜数据不完整');
            return false;
        }
    }

    onChangeClick(){
        this.setState(
            {display:!this.state.display}
        )
    }

    dishesChange(val){
        this.setState({
            data:val
        })
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
                <Form className={styles.FormStyle}>
                    <CollocationTable
                        onChange={this.dishesChange}
                        priceLst ={this.state.priceLst}
                        scopeLst ={this.state.scopeLst}
                    />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit = {false}/> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo : state.steps.toJS(),
        fullCut: state.fullCut,
        promotionDetailInfo: state.promotionDetailInfo,
        promotionScopeInfo: state.promotionScopeInfo,
        user:state.user.toJS()
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts)=>{
            dispatch(saleCenterSetPromotionDetailAC(opts))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CollocationDetailInfo);
