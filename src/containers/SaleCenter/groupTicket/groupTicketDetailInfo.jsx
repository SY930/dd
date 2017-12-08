/*
 Created by Zbl on 2016/12/08 。 添加 满减活动
 */

import React, { Component } from 'react'
import { Row, Col, Form, Input, InputNumber,Select } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
import PriceInput from '../../../containers/SaleCenter/common/PriceInput';
let Immutable = require('immutable');


class GroupTicketDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            giftPrice:'',
            giftValue:'',
            transFee:'',
            stageAmount:'',
            giftMaxUseNum:'',
            stageType:'2',
            targetScope:'0',
            giftPriceFlag:true,
            giftValueFlag:true

        };

        this.renderGroupTicket = this.renderGroupTicket.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onGiftPriceChange = this.onGiftPriceChange.bind(this);
        this.onGiftValueChange = this.onGiftValueChange.bind(this);
        this.onTransFeeChange = this.onTransFeeChange.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onGiftMaxUseNumChange =this.onGiftMaxUseNumChange.bind(this);
    }

    componentDidMount(){
        this.props.getSubmitFn({
            finish:this.handleSubmit,
        });
        let _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish']);

        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule  = Object.assign({}, _rule);
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            targetScope: _categoryOrDish|| '0',
            giftPrice:_rule.giftPrice,
            transFee:_rule.transFee,
            giftValue:_rule.giftValue,
            stageType:_rule.stageType || '2',
            stageAmount:_rule.stage?_rule.stage[0].stageAmount : _rule.stageAmount,
            giftMaxUseNum:_rule.stage?_rule.stage[0].giftMaxUseNum : _rule.giftMaxUseNum

        });
    }
    componentWillReceiveProps(nextProps){
        if(this.props.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])!=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])){
            this.setState({targetScope:nextProps.promotionDetailInfo.getIn(['$promotionDetail','categoryOrDish'])});
        }
    }

    handleSubmit = (cbFn) => {
        let _state = this.state;
        if(_state.giftPrice== null || _state.giftPrice== ''){
            _state.giftPriceFlag = false;
        }
        if(_state.giftValue== null || _state.giftValue==''){
            _state.giftValueFlag = false;
        }
        this.setState(_state);

        let nextFlag = true;

        if(_state.giftPriceFlag && _state.giftValueFlag){
            let rule;
            if(_state.stageType == '2'){
                rule = {
                    giftPrice:_state.giftPrice,
                    transFee:_state.transFee,
                    giftValue:_state.giftValue,
                    stageType:_state.stageType,
                    stage:[
                        {
                            stageAmount:_state.stageAmount,
                            giftMaxUseNum:_state.giftMaxUseNum
                        }
                    ],
                    targetScope:_state.targetScope
                };
            }else if(_state.stageType == '1'){
                rule = {
                    giftPrice:_state.giftPrice,
                    transFee:_state.transFee,
                    giftValue:_state.giftValue,
                    stageType:_state.stageType,
                    stageAmount:_state.stageAmount,
                    giftMaxUseNum:_state.giftMaxUseNum,
                    targetScope:_state.targetScope
                };
            }else{
                rule = {
                    giftPrice:_state.giftPrice,
                    transFee:_state.transFee,
                    giftValue:_state.giftValue,
                    stageType:_state.stageType,
                    giftMaxUseNum:_state.giftMaxUseNum,
                    targetScope:_state.targetScope
                };
            }

            // save state to redux
            this.props.setPromotionDetail({
                rule
            });
        }else{
            nextFlag = false;
        }

        return nextFlag;
    };

    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };

    onGiftPriceChange(value){
        let {giftPrice,giftPriceFlag} = this.state;
        if(value.number == null||value.number == ''){
            giftPriceFlag = false;
            giftPrice = value.number;
        }else{
            giftPriceFlag = true;
            giftPrice = value.number;
        }
        this.setState({giftPrice,giftPriceFlag});
    }
    onGiftValueChange(value){
        let {giftValue,giftValueFlag} = this.state;
        if(value.number == null||value.number == ''){
            giftValueFlag = false;
            giftValue = value.number;
        }else{
            giftValueFlag = true;
            giftValue = value.number;
        }
        this.setState({giftValue,giftValueFlag});

    }
    onTransFeeChange(value){
        let {transFee} = this.state;
        transFee = value.number;
        this.setState({transFee});
    }
    onStageAmountChange(value){
        let {stageAmount} = this.state;
        stageAmount = value.number;
        this.setState({stageAmount});

    }
    onGiftMaxUseNumChange(value){
        let {giftMaxUseNum} = this.state;
        giftMaxUseNum = value.number;
        this.setState({giftMaxUseNum});
    }

    renderGroupTicket(){
        return (
            <div>
                <FormItem label="券购买金额" className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')} labelCol={{span:4}}
                          wrapperCol={{span:17}} required={true} validateStatus={this.state.giftPriceFlag?'success':'error'}
                          help={this.state.giftPriceFlag ? null : "请输入券购买金额"}>
                        <PriceInput addonBefore={''}
                                    addonAfter={'元'}
                                    value ={{number:this.state.giftPrice}}
                                    defaultValue = {{number:this.state.giftPrice}}
                                    onChange={this.onGiftPriceChange}
                                    modal="float"
                        />
                </FormItem>

                <FormItem label="券面金额" className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')} labelCol={{span:4}}
                          wrapperCol={{span:17}} required={true}  validateStatus={this.state.giftValueFlag?'success':'error'} help={this.state.giftValueFlag ? null : "请输入券面金额"}>
                    <PriceInput addonBefore={''}
                                addonAfter={'元'}
                                value ={{number:this.state.giftValue}}
                                defaultValue = {{number:this.state.giftValue}}
                                onChange={this.onGiftValueChange}
                                modal="float"
                    />
                </FormItem>

                <FormItem label="券交易手续费" className={[styles.FormItemStyle,styles.priceInputSingle].join(' ')} labelCol={{span:4}}
                          wrapperCol={{span:17}}>
                    <PriceInput addonBefore={''}
                                addonAfter={'元'}
                                onChange={this.onTransFeeChange}
                                value={{number:this.state.transFee}}
                                defaultValue = {{number:this.state.transFee}}
                                modal="float"
                    />
                </FormItem>

                <FormItem label="团购券使用" className={[styles.FormItemStyle,styles.groupTicket,styles.priceInputSingle].join(' ')} labelCol={{span:4}} wrapperCol={{span:17}}>
                    <Select size='default' value={`${this.state.stageType}`} onChange={(value)=>{
                                    let {stageType} = this.state;
                                    stageType = value;
                                    this.setState({stageType});
                                }}>
                        <Option value="2" key="2">账单金额满</Option>
                        <Option value="1" key="1">账单金额每满</Option>
                    </Select>
                    <span className={styles.priceInLine}>
                        <PriceInput addonBefore={''}
                                    addonAfter={'元'}
                                    onChange={this.onStageAmountChange}
                                    value={{number:this.state.stageAmount}}
                                    defaultValue = {{number:this.state.stageAmount}}
                                    modal="float"
                        />
                    </span>
                    <span className={[styles.inputLabel,styles.inputLabelTwo].join(' ')}>最多使用团购券</span>
                    <span className={styles.priceInLine}>
                        <PriceInput addonBefore={''}
                                    addonAfter={'张'}
                                    onChange={this.onGiftMaxUseNumChange}
                                    value={{number:this.state.giftMaxUseNum}}
                                    defaultValue = {{number:this.state.giftMaxUseNum}}
                                    modal="int"
                        />
                    </span>
                </FormItem>
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
        return(
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderGroupTicket()}
                    <PromotionDetailSetting />
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting  payLimit={true}/> : null}
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
        promotionScopeInfo: state.promotionScopeInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts)=>{
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchGiftListInfo: (opts)=>{
            dispatch(fetchGiftListInfoAC(opts))
        },

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(GroupTicketDetailInfo));
