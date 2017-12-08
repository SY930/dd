/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-23T17:02:39+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: returnGiftDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T22:47:55+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, TreeSelect } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import  {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库
import ReturnGift from "./returnGift";  //可增删的输入框 组件
import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

let Immutable = require('immutable');
var moment = require('moment');
const type = [
    {value:'2', name:'消费满一定金额即赠送相应礼品'},
    {value:'1', name:'消费每满一定金额即赠送相应礼品'},
];

class ReturnGiftDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.defaultRun='0';
        this.state={
            display:false,
            rule: {
                type:'2',
                data:[{
                        stageAmount: {
                            value: null,
                            validateStatus: 'success',
                            msg: null,
                        },
                        giftNum: {
                            value: 1,
                            validateStatus: 'success',
                            msg: null
                        },

                        giftInfo: {
                            giftName: null,
                            giftItemID: null,
                            validateStatus: 'success',
                            msg: null
                        },
                        // 使用张数
                        giftMaxNum: {
                            value: 1,
                            validateStatus: 'success',
                            msg: null,
                        },

                        giftValidType: '0',

                        giftEffectiveTime: {
                            value: 0,
                            validateStatus: 'success',
                            msg: null
                        },

                        giftValidDays: {
                            value: 1,
                            validateStatus: 'success',
                            msg: null,
                        }
                    }]
            },
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.renderRuleDetail = this.renderRuleDetail.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.handlePre = this.handlePre.bind(this);
        this.getRule = this.getRule.bind(this);
    }


    componentDidMount(){
        this.props.getSubmitFn({
            finish: this.handleFinish,
        });
        let {display} = this.state;
        display = !this.props.isNew;
        this.setState({
            display
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule  = Object.assign({}, _rule);
        let {rule} = this.state;
        if(Object.keys(_rule).length>0){
            rule.type = _rule.stageType;
            if(_rule.stageType == '2'){
                _rule.stage.map((stage, index)=>{
                    if(rule.data[index] == undefined){
                        rule.data.push({
                            stageAmount: {
                                value: null,
                                validateStatus: 'success',
                                msg: null,
                            },
                            giftNum: {
                                value: 1,
                                validateStatus: 'success',
                                msg: null
                            },

                            giftInfo: {
                                giftName: null,
                                giftItemID: null,
                                validateStatus: 'success',
                                msg: null
                            },
                            // 使用张数
                            giftMaxNum: {
                                value: 1,
                                validateStatus: 'success',
                                msg: null,
                            },

                            giftValidType: '0',

                            giftEffectiveTime: {
                                value: 0,
                                validateStatus: 'success',
                                msg: null
                            },

                            giftValidDays: {
                                value: 1,
                                validateStatus: 'success',
                                msg: null,
                            }
                        });
                    }
                    rule.data[index].stageAmount.value=stage.stageAmount;
                    rule.data[index].giftNum.value=stage.giftNum;
                    rule.data[index].giftInfo.giftName=stage.giftName;
                    rule.data[index].giftInfo.giftItemID=stage.giftItemID;
                    rule.data[index].giftValidDays.value=stage.giftValidDays||'0';
                    rule.data[index].giftValidType=stage.giftStartTime?'1':'0';
                    rule.data[index].giftEffectiveTime.value=stage.giftEffectiveTime/60||[moment(stage.giftStartTime,'YYYYMMDDHHmmss'),moment(stage.giftEndTime,'YYYYMMDDHHmmss')];

                })
            }else{
                rule.data[0].stageAmount.value=_rule.stageAmount;
                rule.data[0].giftNum.value=_rule.giftNum;
                rule.data[0].giftInfo.giftName=_rule.giftName;
                rule.data[0].giftInfo.giftItemID=_rule.giftItemID;
                rule.data[0].giftValidDays.value=_rule.giftValidDays||'0';
                rule.data[0].giftMaxNum.value=_rule.giftMaxNum;
                rule.data[0].giftValidType=_rule.giftStartTime?'1':'0';
                rule.data[0].giftEffectiveTime.value=_rule.giftEffectiveTime/60||[moment(_rule.giftStartTime,'YYYYMMDDHHmmss'),moment(_rule.giftEndTime,'YYYYMMDDHHmmss')];

            }
            this.setState({
                rule:rule
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])!=
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])){
            let _rule = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
            if (_rule === null || _rule === undefined) {
                return null;
            };
            _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
            // default value
            _rule  = Object.assign({}, _rule);
            let {rule} = this.state;

            if(Object.keys(_rule).length>0){
                rule.type = _rule.stageType;
                if(_rule.stageType == '2'){
                    _rule.stage.map((stage, index)=>{
                        if(rule.data[index] == undefined){
                            rule.data.push({
                                stageAmount: {
                                    value: null,
                                    validateStatus: 'success',
                                    msg: null,
                                },
                                giftNum: {
                                    value: 1,
                                    validateStatus: 'success',
                                    msg: null
                                },

                                giftInfo: {
                                    giftName: null,
                                    giftItemID: null,
                                    validateStatus: 'success',
                                    msg: null
                                },
                                // 使用张数
                                giftMaxNum: {
                                    value: 1,
                                    validateStatus: 'success',
                                    msg: null,
                                },

                                giftValidType: '0',

                                giftEffectiveTime: {
                                    value: 0,
                                    validateStatus: 'success',
                                    msg: null
                                },

                                giftValidDays: {
                                    value: 1,
                                    validateStatus: 'success',
                                    msg: null,
                                }
                            });
                        }
                        rule.data[index].stageAmount.value=stage.stageAmount;
                        rule.data[index].giftNum.value=stage.giftNum;
                        rule.data[index].giftInfo.giftName=stage.giftName;
                        rule.data[index].giftInfo.giftItemID=stage.giftItemID;
                        rule.data[index].giftValidDays.value=stage.giftValidDays||'0';
                        rule.data[index].giftValidType=stage.giftStartTime?'1':'0';
                        rule.data[index].giftEffectiveTime.value=stage.giftEffectiveTime/60||[moment(stage.giftStartTime,'YYYYMMDDHHmmss'),moment(stage.giftEndTime,'YYYYMMDDHHmmss')];

                    })
                }else{
                    rule.data[0].stageAmount.value=_rule.stageAmount;
                    rule.data[0].giftNum.value=_rule.giftNum;
                    rule.data[0].giftInfo.giftName=_rule.giftName;
                    rule.data[0].giftInfo.giftItemID=_rule.giftItemID;
                    rule.data[0].giftValidDays.value=_rule.giftValidDays||'0';
                    rule.data[0].giftMaxNum.value=_rule.giftMaxNum;
                    rule.data[0].giftValidType=_rule.giftStartTime?'1':'0';
                    rule.data[0].giftEffectiveTime.value=_rule.giftEffectiveTime/60||[moment(_rule.giftStartTime,'YYYYMMDDHHmmss'),moment(_rule.giftEndTime,'YYYYMMDDHHmmss')];

                }
                this.setState({
                    rule:rule
                })
            }
        }

    }

    /**
     * @param {Object} rule : rule stored in state
     * @return {Object} rule will be stored in redux, compatiable with server.
     * {
     *     stageType: 1,
     *     stage : [{
     *         stageAmount: 100,
     *         giftItemID: 129399,
     *         giftName: "10元代金券",
     *         giftNum: 2,
     *         giftEffectiveTime: 10,
     *         giftValidDays: 60,
     *         giftMaxNum: 6
     *     }]
     * }
     */
    getRule(){
        if(this.state.rule.type=='2'){
            return {
                stageType: this.state.rule.type,
                stage: this.state.rule.data.map((item, index)=>{
                    if(item.giftValidType=='0'){
                        return {
                            stageAmount: item.stageAmount.value,
                            giftValidDays: item.giftValidDays.value,
                            giftEffectiveTime: item.giftEffectiveTime.value*60,
                            giftNum: item.giftNum.value,
                            giftName: item.giftInfo.giftName,
                            giftItemID: item.giftInfo.giftItemID
                        }
                    }else{
                        return {
                            stageAmount: item.stageAmount.value,
                            giftStartTime: parseInt(item.giftEffectiveTime.value[0].format('YYYYMMDDHHmmss')),
                            giftEndTime: parseInt(item.giftEffectiveTime.value[1].format('YYYYMMDDHHmmss')),
                            giftNum: item.giftNum.value,
                            giftName: item.giftInfo.giftName,
                            giftItemID: item.giftInfo.giftItemID
                        }
                    }

                })
            }
        }else{
            if(this.state.rule.data[0].giftValidType=='0'){
                return {
                    stageType: this.state.rule.type,
                    stageAmount: this.state.rule.data[0].stageAmount.value,
                    giftMaxNum: this.state.rule.data[0].giftMaxNum.value,
                    giftValidDays: this.state.rule.data[0].giftValidDays.value,
                    giftEffectiveTime: this.state.rule.data[0].giftEffectiveTime.value*60,
                    giftNum: this.state.rule.data[0].giftNum.value,
                    giftName: this.state.rule.data[0].giftInfo.giftName,
                    giftItemID: this.state.rule.data[0].giftInfo.giftItemID
                }
            }else{
                return {
                    stageType: this.state.rule.type,
                    stageAmount: this.state.rule.data[0].stageAmount.value,
                    giftMaxNum: this.state.rule.data[0].giftMaxNum.value,
                    giftStartTime: parseInt(this.state.rule.data[0].giftEffectiveTime.value[0].format('YYYYMMDDHHmmss')),
                    giftEndTime: parseInt(this.state.rule.data[0].giftEffectiveTime.value[1].format('YYYYMMDDHHmmss')),
                    giftNum: this.state.rule.data[0].giftNum.value,
                    giftName: this.state.rule.data[0].giftInfo.giftName,
                    giftItemID: this.state.rule.data[0].giftInfo.giftItemID
                }
            }

        }

    }


    handleFinish(){
        let {rule} = this.state;
        function checkStageAmount(stageAmount){
            let _value = parseFloat(stageAmount.value);
            if (_value > 0) {
                return stageAmount;
            } else {
                return {
                    msg: "消费金额必须大于0",
                    validateStatus: 'error',
                    value: ""
                }
            }
        }

        function checkGiftInfo(giftInfo){
            if(giftInfo.giftItemID === null || giftInfo.giftName === null){
                return {
                    giftItemID: null,
                    giftName: null,
                    validateStatus: 'error',
                    msg: "必须选择礼券"
                }
            } else {
                return giftInfo;
            }
        }

        let validatedRuleData = rule.data.map((ruleInfo, index)=>{
            return Object.assign(ruleInfo, {
                stageAmount: checkStageAmount(ruleInfo.stageAmount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
            });
        });



        let validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
            let _validStatusOfCurrentIndex = Object.keys(ruleInfo).
                reduce((flag, key)=>{
                    if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')){
                        let _valid = ruleInfo[key].validateStatus === 'success';
                        return flag && _valid;
                    } else {
                        return flag
                    }
                }, true);
            return p && _validStatusOfCurrentIndex;
        }, true);
        if(validateFlag){

            this.props.setPromotionDetail({
                rule: this.getRule()
            });
            return true;
        } else {
            let {rule} = this.state;
            rule.data = validatedRuleData;
            this.setState({rule}, ()=>{
                this.props.setPromotionDetail({
                    rule: this.getRule()
                });
            });
            return false;
        }
    }

    handlePre(){
        this.props.setPromotionDetail({
            rule: this.state.rule
        });
        return true;
    }

    onChangeClick = () =>{
        this.setState(
            {display:!this.state.display}
        )
    };


    renderPromotionRule(){
        return (
            <div>
                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{span:4}}
                    wrapperCol={{span:17}}>
                    <Select
                        size="default"
                        placeholder='请选择活动类别'
                        className={styles.linkSelectorRight}
                        value={this.state.rule.type}
                        onChange={(val)=> {
                           let {rule} = this.state;
                           rule.type = val;
                           this.setState({rule},()=>{
                               const onChange = this.props.onChange;
                               if (onChange) {
                                   onChange(Object.assign({}, this.state.rule));
                               }
                           });}
                       }
                    >
                        {type
                            .map((type)=>{
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })}
                    </Select>
                </FormItem>

                <Row>
                    <Col span={17} offset={4}>
                        {this.renderRuleDetail()}
                    </Col>
                </Row>

            </div>
        )

    }

    renderRuleDetail(){
        return (
            <ReturnGift
                maxCount = {this.state.rule.type == '2' ? 3:1}
                value = {this.state.rule.data}
                onChange={(val)=> {
                    let {rule} = this.state;
                    if(val!==undefined){
                        rule.data = val;
                        this.setState({rule});
                    }else{
                        return;
                    }
                }
                }/>
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
                    {this.renderPromotionRule()}
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
        stepInfo : state.sale_old_steps.toJS(),
        fullCut: state.sale_old_fullCut,
        promotionDetailInfo: state.sale_old_promotionDetailInfo,
        promotionScopeInfo: state.sale_old_promotionScopeInfo
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
)(ReturnGiftDetailInfo);
