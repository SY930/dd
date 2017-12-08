
/**
 * @Author: chenshuang
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T13:46:08+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, InputNumber, Input, Icon } from 'antd';
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';
import CustomRangeInput from '../../../containers/SaleCenter/common/CustomRangeInput';
import PriceInput from '../../../containers/SaleCenter/common/PriceInput';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

let Immutable = require('immutable');


const unitTypeType = [
    {value:'1', name:'元'},
    {value:'10', name:'角'},
    {value:'100', name:'分'}
];
const RadioGroup = Radio.Group;

class RandomCutDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            maxCount: 1,
            ruleType:'0',
            priceRule: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null
                }
            ],
            billRule: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null
                }
            ],

            priceValue:null,
            billValue:null,
            unitType:'1'
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
        this.renderRulesComponent = this.renderRulesComponent.bind(this);
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.onPriceInputChange = this.onPriceInputChange.bind(this);
        this.onBillInputChange = this.onBillInputChange.bind(this);
        this.onRuleTypeChange = this.onRuleTypeChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule  = Object.assign({}, _rule);
        if(_rule.randomType == 'RATIO') {
            this.setState({
                ruleType: '1',
                billRule: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: _rule.randomMin || null,
                        end: _rule.randomMax || null
                    }
                ],
                billValue:_rule.stageAmount,
                unitType :_rule.randomUnit ||'1'
            });
        }else{
            this.setState({
                ruleType: '0',
                priceRule: [
                    {
                        validationStatus: 'success',
                        helpMsg: null,
                        start: _rule.randomMin|| null,
                        end: _rule.randomMax|| null
                    }
                ],
                priceValue:_rule.stageAmount,
                unitType:_rule.randomUnit|| '1'
            });
        }
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display
        });

    };
    componentWillReceiveProps(nextProps){
        if(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])!=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])){
            let _rule = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
            if (_rule === null || _rule === undefined) {
                return null;
            };
            _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
            // default value
            _rule  = Object.assign({}, _rule);
            if(_rule.randomType == 'RATIO') {
                this.setState({
                    ruleType: '1',
                    billRule: [
                        {
                            validationStatus: 'success',
                            helpMsg: null,
                            start: _rule.randomMin || null,
                            end: _rule.randomMax || null
                        }
                    ],
                    billValue:_rule.stageAmount,
                    unitType :_rule.randomUnit ||'1'
                });
            }else{
                this.setState({
                    ruleType: '0',
                    priceRule: [
                        {
                            validationStatus: 'success',
                            helpMsg: null,
                            start: _rule.randomMin|| null,
                            end: _rule.randomMax|| null
                        }
                    ],
                    priceValue:_rule.stageAmount,
                    unitType:_rule.randomUnit|| ''
                });
            }
        }
    }

    handleSubmit = (cbFn) => {
        let {priceRule,billRule,ruleType,priceValue,billValue,unitType} = this.state;
        let billRuleValidation = false;
        let priceRuleValidation = false;
        let rule ;
        if(ruleType == '1'){
            billRuleValidation = billRule.reduce((p, c) => {

                if(c.start === null ||c.end ===null||c.start === '' ||c.end ==='' ||Number.isNaN(c.start)||Number.isNaN(c.end)  ){
                    c.validationStatus = 'error';
                    c.helpMsg ='请输入正确金额范围';
                }
                return p && c.validationStatus === 'success';
            }, true);
            rule = {
                randomType:"RATIO",
                stageAmount:billValue== null ? 0 :parseFloat(billValue),
                randomMin:billRule[0].start,
                randomMax:billRule[0].end
            };

        }else{
            priceRuleValidation = priceRule.reduce((p, c) => {

                if(c.start === null ||c.end ===null||c.start === '' ||c.end ==='' ||Number.isNaN(c.start)||Number.isNaN(c.end) ){
                    c.validationStatus = 'error';
                    c.helpMsg ='请输入正确比例范围';
                }
                return p && c.validationStatus === 'success';
            }, true);
            rule = {
                randomType:"AMOUNT",
                stageAmount:priceValue == null ? 0 :parseFloat(priceValue),
                randomMin:priceRule[0].start,
                randomMax:priceRule[0].end,
                randomUnit:unitType
            };


        }
        if (billRuleValidation || priceRuleValidation) {
            this.props.setPromotionDetail({
                rule
            });
            return true;
        } else {
            // TODO: add a message tips here
            this.setState({billRule,priceRule});
        }

    };


    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };


    onPriceInputChange(value){
        this.setState({
            priceValue: value.number
        });

    }
    onBillInputChange(value){
        this.setState({
            billValue: value.number
        });
    }
    onRuleTypeChange(e){
        let {ruleType, priceRule, billRule} = this.state;
        ruleType = e.target.value;
        if(ruleType == '0'){
            billRule[0].validationStatus = 'success';
            billRule[0].helpMsg =null;
        }else{
            priceRule[0].validationStatus = 'success';
            priceRule[0].helpMsg =null;
        }
        this.setState({ruleType, priceRule, billRule});
    }
    renderPromotionRule(){

        const randomType = [
            {
                value:'0',
                name:'按金额随机减',
                content:(
                    <div className={styles.radioChild}>
                        <FormItem className={[styles.FormItemStyle,styles.priceInput].join(' ')} wrapperCol={{span: 21}}>
                            <PriceInput addonBefore={'消费满'}
                                        addonAfter={'元'}
                                        onChange={this.onPriceInputChange}
                                        value={{number:this.state.priceValue}}
                                        defaultValue = {{number:this.state.priceValue}}
                                        modal="float"
                            />
                        </FormItem>

                        {this.renderRulesComponent('priceRule', '至', '减免范围','元','元')}

                        <FormItem label="最小单位" className={[styles.FormItemStyle,styles.unitType].join(' ')} labelCol={{span:4}} wrapperCol={{offset:1,span: 18}}>
                            <RadioGroup value={this.state.unitType}
                                        onChange={(e)=>{
                                            let {unitType} = this.state;
                                            unitType = e.target.value
                                            this.setState({unitType});

                                        }}
                            >
                                {
                                    unitTypeType
                                        .map((unitType)=>{
                                            return <Radio key={unitType.value} value={unitType.value}>{unitType.name}</Radio>
                                        })
                                }
                            </RadioGroup>
                        </FormItem>
                    </div>
                )
            },
            {
                value:'1',
                name:'按账单金额比例随机折扣',
                content:(
                    <div className={styles.radioChild}>
                        <FormItem className={[styles.FormItemStyle,styles.priceInput].join(' ')} wrapperCol={{span: 21}}>
                            <PriceInput addonBefore={'消费满'}
                                        addonAfter={'元'}
                                        onChange={this.onBillInputChange}
                                        value={{number:this.state.billValue}}
                                        modal="float"
                            />
                        </FormItem>
                        {this.renderRulesComponent( 'billRule', '至', '比例范围','%', '%')}

                    </div>
                )
            }
        ];
        return (
            <div className={styles.randomRule}>
                <FormItem label="随机类型" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{span: 17}}>
                    <RadioGroup value={this.state.ruleType}
                                onChange={this.onRuleTypeChange}
                    >
                        {randomType
                            .map((type)=>{
                                return <Radio style={{display:'block'}}  key={type.value} value = {type.value}>
                                    {type.name}
                                    {type.content}
                                </Radio>
                            })
                        }
                    </RadioGroup>
                </FormItem>


            </div>
        )

    }

    onCustomRangeInputChange(value, index, ruleName) {
        const _start = value.start;
        const _end = value.end;
        let _tmp = this.state[ruleName];
        let condition =  ruleName == 'priceRule'?
            ((parseFloat(_start) <= parseFloat(_end)) && (!Number.isNaN(_start)) && (!Number.isNaN(_end))):
            ( (parseFloat(_start) <= parseFloat(_end) && parseFloat(_start) <=100 && parseFloat(_end)<=100)||
            (parseFloat(_start<=100) && Number.isNaN(_end))|| (Number.isNaN(_start )&& parseFloat(_end)<=100) );
        let _validationStatus, _helpMsg;
        //TODO:刚输入的时候就报错
        if (condition) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = '请输入正确范围'
        }

        _tmp[index] = {
            start: _start,
            end: _end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg
        };
        this.setState({[ruleName] : _tmp});
    }

    renderRulesComponent(ruleName, relation, addonBefore, addonAfter, addonAfterunitType) {
        return (this.state[ruleName].map((rule, index) => {

            let _value = {
                start: null,
                end: null
            };
            if (rule.start){
                _value.start = rule.start;
            }
            if(rule.end) {
                _value.end = rule.end;
            }

            return (

                <FormItem key={index} className={styles.FormItemStyle} wrapperCol={{span: 21}}
                          validateStatus={rule.validationStatus} help={rule.helpMsg}>

                    <CustomRangeInput
                        relation = {relation}
                        addonAfter={addonAfter}
                        addonBefore = {addonBefore}
                        addonAfterUnit = {addonAfterunitType}
                        value={
                            _value
                        }
                        onChange={(value) => {
                            let _index = index;
                            this.onCustomRangeInputChange(value, index, ruleName);
                        }
                }/>
                </FormItem>

            )
        }))
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
                    {this.renderPromotionRule()}
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(RandomCutDetailInfo));
