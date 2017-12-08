/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-30T10:17:40+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: fullGiveDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T22:40:04+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react';
import { Row, Col, Form, Select, Radio } from 'antd';
import { connect } from 'react-redux';


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import AddGrade from "../../../containers/SaleCenter/common/AddGrade";  //可增删的输入框 组件
import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
let Immutable = require('immutable');


const client = [
    {key:'ALL_USER',value:'0', name:'不限制'},
    {key:'CUSTOMER_ONLY',value:'1', name:'仅会员'},
    {key:'CUSTOMER_EXCLUDED',value:'2', name:'非会员'}
];

const type = [
    {value:'0', name:'下单即赠送'},
    {value:'2', name:'任意菜品消费满'},
    {value:'1', name:'任意菜品消费每满'},
    {value:'3', name:'指定菜品消费满'},
    {value:'4', name:'指定菜品消费每满'},
];

class FullGiveDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            foodCategoryCollection:[],
            display:false,
            ruleType:'0',
            priceLst:[],
            foodMenuList:[],
            data:{
                0:{
                    stageAmount:'',
                    giftType:'0',
                    dishes:[],
                    giftName:null,
                    foodCount:'',
                    foodCountFlag:true,
                    dishesFlag:true,
                }
            }
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
    }

    componentDidMount() {
        var opts = {
            _groupID: this.props.user.accountInfo.groupID,
            // shopID: '77876'
        };
        this.props.getSubmitFn({
            finish: this.handleSubmit
        });
        this.props.promotionDetailInfo.getIn(["$foodCategoryListInfo", "initialized"]) ||
        this.props.fetchFoodCategoryInfo({
            ...opts
        });
        this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"]) ||
        this.props.fetchFoodMenuInfo({
            ...opts
        });

        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule  = Object.assign({}, _rule);

        let {data, ruleType, display} = this.state;
        display = !this.props.isNew;
        ruleType = _rule.stageType || '0';
        let _scopeLst=this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        if(_rule.stageType ==0){
            //下单即赠送
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
        }else if(_rule.stageType == '1'){
            if (_scopeLst.length==0){
                ruleType ='1'
            }else{
                ruleType ='4'
            }
            //每满
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
            data[0].stageAmount = _rule.stageAmount || '';
        }else{
            //满
            if (_scopeLst.length=='0'){
                ruleType ='2'
            }else{
                ruleType ='3'
            }
            _rule.stage&&_rule.stage.map((stage,index)=>{
                data[index]={
                    stageAmount:'',
                    giftType:'0',
                    dishes:[],
                    giftName:null,
                    foodCount:'',
                    foodCountFlag:true,
                    dishesFlag:true,
                };
                data[index].foodCount = stage.giveFoodCount || '';
                data[index].giftName = stage.giftName || '';
                data[index].stageAmount = stage.stageAmount || '';
            })
        }
        this.setState({
            data,
            ruleType,
            display,
            priceLst :this.props.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).toJS(),
            foodMenuList:this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records ?
                this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records:[]
        },()=>{
            this.sortData(this.state.priceLst,this.state.foodMenuList)
        });

    };
    componentWillReceiveProps(nextProps){
        if (nextProps.promotionDetailInfo.get('foodCategoryCollection')!=this.props.promotionDetailInfo.get('foodCategoryCollection')) {
            this.setState({
                foodCategoryCollection :nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS(),
                foodMenuList: nextProps.promotionDetailInfo.getIn(["$foodMenuListInfo", "data"]).toJS().records
            },()=>{
                this.sortData(this.state.priceLst,this.state.foodMenuList)
            });
        }

        if(nextProps.promotionDetailInfo.getIn(['$promotionDetail','priceLst']) !=
            this.props.promotionDetailInfo.getIn(['$promotionDetail','priceLst']) ){
            this.setState({
                priceLst :nextProps.promotionDetailInfo.getIn(['$promotionDetail','priceLst']).toJS()
            },()=>{
                this.sortData(this.state.priceLst,this.state.foodMenuList)
            });

        }

    }

    sortData(_priceLst, foodMenu){
        if(_priceLst.length == 0 || foodMenu.length == 0){
            return
        }
        let _dish = _priceLst.map((price)=>{
            let dish =  foodMenu.find((food)=>{
                return food.foodKey === price.foodUnitCode;
            });
            dish.stageNo = price.stageNo;
            return dish;
        });
        let {data} = this.state;
        let _dishes = {
            0:[],
            1:[],
            2:[]
        };
        _dish.forEach((dish)=>{
            _dishes[dish.stageNo].push(dish);
        });

        Object.keys(_dishes).map((key)=>{
            if( _dishes[key].length>0){
                if(!data[key]){
                    data[key]={
                        stageAmount:'',
                        giftType:'1',
                        dishes:[],
                        giftName:null,
                        foodCount:'',
                        foodCountFlag:true,
                        dishesFlag:true,
                    };
                }
                data[key].giftType = '1';
                data[key].dishes = _dishes[key];

            }

        });
        this.setState({
            data
        });
    }

    handleSubmit = (cbFn) => {
        let {data, dishes , ruleType} = this.state;
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }

            let stage = [{}];
            let priceLst = [];
            // save state to redux
            if(ruleType == '0'){
                if(data[0].foodCount==''||data[0].foodCount==null){
                    data[0].foodCountFlag = false;
                    nextFlag = false;
                }
                if(data[0].dishes.length==0){
                    data[0].dishesFlag = false;
                    nextFlag = false;
                }
                this.setState({data});
                stage[0].giveFoodCount = data[0].foodCount;
                stage[0].stageNum = 0;
                priceLst = data[0].dishes.map((dish,index)=>{
                    return {
                        foodUnitID:dish.itemID||index,
                        foodUnitCode:dish.foodKey,
                        foodName:dish.foodName,
                        foodUnitName:dish.unit,
                        price:dish.price,
                        stageNo:0
                    }
                });
            }else if(ruleType == '1'||ruleType =='4'){
                //每满
                if(data[0].foodCount==''||data[0].foodCount==null){
                    data[0].foodCountFlag = false;
                    nextFlag = false;
                }
                if(data[0].dishes.length==0){
                    data[0].dishesFlag = false;
                    nextFlag = false;
                }
                this.setState({data});
                stage[0].stageAmount = data[0].stageAmount;
                stage[0].giveFoodCount = data[0].foodCount;
                stage[0].stageNum = 0;
                priceLst = data[0].dishes.map((dish, index)=>{
                    return {
                        foodUnitID:dish.itemID||index,
                        foodUnitCode:dish.foodKey,
                        foodName:dish.foodName,
                        foodUnitName:dish.unit,
                        price:dish.price,
                        stageNo:0
                    }
                });
            }else{
                //满
                Object.keys(data).map((keys)=>{
                    if(data[keys].foodCount==''||data[keys].foodCount==null){
                        data[keys].foodCountFlag = false;
                        nextFlag = false;
                    }
                    if(data[keys].dishes.length==0){
                        data[keys].dishesFlag = false;
                        nextFlag = false;
                    }
                });
                this.setState({data});
                stage = Object.keys(data).map((keys, index)=>{
                    priceLst.push(data[keys].dishes.map((dish, index)=>{
                        return {
                            foodUnitID:dish.itemID||index,
                            foodUnitCode:dish.foodKey,
                            foodName:dish.foodName,
                            foodUnitName:dish.unit,
                            price:dish.price,
                            stageNo:keys
                        }
                    }));
                    return {
                        stageAmount:  data[keys].stageAmount,
                        giveFoodCount:  data[keys].foodCount,
                        stageNum : index
                    }
                })
            }
            let rule = (ruleType == '2'||ruleType =='3')?
                ({
                    stageType:'2',
                    stage
                }):(ruleType == '1'||ruleType =='4'?
                ({
                    stageType:'1',
                    ...stage[0]
                }):
                ({
                    stageType:'0',
                    ...stage[0]
                }));
            let newPrice = [];
            if(priceLst[0] && typeof priceLst[0] == 'object'){
                priceLst.forEach((price, index)=>{
                    newPrice = newPrice.concat(priceLst[index]);
                })
            }
            this.props.setPromotionDetail({
                rule ,priceLst: newPrice||priceLst
            });
        });
        return nextFlag;
    };

    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };


    renderPromotionRule(){
        const { getFieldDecorator,getFieldValue } = this.props.form;
        return (
            <div>

                <FormItem label="活动方式" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}}>

                    <Select placeholder='请选择活动类别'
                            className={styles.linkSelectorRight}
                            defaultValue={this.state.ruleType}
                            value={this.state.ruleType}
                            onChange={(val)=> {
                                let {ruleType} = this.state;
                                ruleType = val;
                                if(val=='0'||val=='1'||val=='2'){
                                    this.props.setPromotionDetail({
                                         //i清空已选,
                                         scopeLst:[],
                                         dishes:[],
                                         priceLst:[],
                                         foodCategory:[],
                                         excludeDishes:[]
                                    });
                                }
                                this.setState({ruleType});
                        }
                      }
                    >
                        {type
                            .map((type)=>{
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })}
                    </Select>
                </FormItem>
                {this.state.ruleType == 3||this.state.ruleType == 4 ?<PromotionDetailSetting />:null}
                <Row>
                    <Col span={19} offset={2}>
                        <AddGrade
                            foodCategoryCollection ={this.state.foodCategoryCollection}
                            getFieldDecorator = {getFieldDecorator}
                            getFieldValue = {getFieldValue}
                            form ={this.props.form}
                            ruleType={this.state.ruleType}
                            value ={this.state.data}
                            onChange={value=>{
                                    let {data} = this.state;
                                    data = value;
                                    this.setState({data});
                                }
                            }
                        />
                    </Col>
                </Row>

            </div>
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
        const payLimit = this.state.ruleType == 0 ? false : true;
        return(
            <div >
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting  payLimit={payLimit}/> : null}
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
)(Form.create()(FullGiveDetailInfo));
