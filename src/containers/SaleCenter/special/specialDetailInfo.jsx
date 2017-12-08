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
import { Row, Col, Form, Select, Radio } from 'antd';
import { connect } from 'react-redux'

if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import SpecialDishesTable from "../common/SpecialDishesTable";  //表格

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

class SpecialDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            selections:[],
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [] ,
            data:[]
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
        this.dishesChange = this.dishesChange.bind(this);
    }

    componentDidMount(){
        var opts = {
            _groupID: this.props.user.accountInfo.groupID,
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
        let _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish']);
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            targetScope:_categoryOrDish
        });

    }

    handleSubmit = (cbFn) => {
        let {data} = this.state;
        let priceLst = data.map((data)=>{
            return {
                foodUnitID:data.itemID,
                foodUnitCode:data.foodKey,
                foodName:data.foodName,
                foodUnitName:data.unit,
                price:parseFloat(data.newPrice)
            }
        });
        this.props.setPromotionDetail({
            priceLst:priceLst
        });
        return true;
    };

    onChangeClick(){
        this.setState(
            {display:!this.state.display}
        )
    };
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
            <div >
                <Form className={styles.FormStyle}>
                    <SpecialDishesTable
                        onChange={this.dishesChange}
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
)(SpecialDetailInfo);
