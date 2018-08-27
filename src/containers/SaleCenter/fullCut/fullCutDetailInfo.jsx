/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T13:17:34+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, {Component} from 'react'
import {Row, Col, Form, Select, Radio, Icon} from 'antd';
import {connect} from 'react-redux'

if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import {Iconlist} from '../../../components/basic/IconsFont/IconsFont'; //引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenter/common/promotionDetailSetting';
import RangeInput from '../../../containers/SaleCenter/common/RangeInput';
import CustomRangeInput from '../../../containers/SaleCenter/common/CustomRangeInput';
const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenter/common/AdvancedPromotionDetailSetting';

import {saleCenterSetPromotionDetailAC} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
let Immutable = require('immutable');

const client = [
    {
        key: '0',
        value: '0',
        name: '不限制'
    }, {
        key: '1',
        value: '1',
        name: '仅会员'
    }, {
        key: '2',
        value: '2',
        name: '非会员'
    }
];

const type = [
    {
        value: '2',
        name: '任意菜品消费满'
    },
    {
        value: '1',
        name: '任意菜品消费每满'
    },
    {
        value: '3',
        name: '指定菜品消费满'
    },
    {
        value: '4',
        name: '指定菜品消费每满'
    }
];

class FullCutDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            ruleType:"2",
            // 最多创建的档
            maxCount: 3,
            ruleInfo: [
                {
                    validationStatus: 'success',
                    helpMsg: null,
                    start: null,
                    end: null

                }
            ]
        };

        this.renderPromotionRule = this.renderPromotionRule.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderRulesComponent = this.renderRulesComponent.bind(this);
        this.onCustomRangeInputChange = this.onCustomRangeInputChange.bind(this);
        this.addRule = this.addRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
    }

    componentDidMount() {

        // this.props.getSubmitFn(this.handleSubmit);
        this.props.getSubmitFn({
            finish: this.handleSubmit,
            prev: this.handlePrev
        });

        // restore data from redux to state
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        if (_rule === null || _rule === undefined) {
            return null;
        };
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule  = Object.assign({}, _rule);
        let {display,ruleType} = this.state;
        let ruleInfo, maxCount;
        display = !this.props.isNew;
        if (_rule.stage !== undefined &&  _rule.stage instanceof Array) {
            ruleInfo = _rule.stage.map((stageInfo)=>{
                return {
                    start: stageInfo.stageAmount,
                    end: stageInfo.freeAmount,
                    validationStatus: 'success',
                    helpMsg: null
                }
            });
            maxCount = 3;
        } else {
            // 初始值
            ruleInfo = [{
                start: _rule.stageAmount,
                end: _rule.freeAmount,
                validationStatus: 'success',
                helpMsg: null
            }];
            maxCount = 1
        }
        //根据菜单列表是否为空，将每满分为任意和指定，满分为任意和指定
        if (_rule.stageType=='1'){
            ruleType=_scopeLst.size==0?'1':'4';
        }else{
            ruleType=_scopeLst.size==0?'2':'3';
        }
        this.setState({
            display,
            ruleType,
            ruleInfo: ruleInfo,
            maxCount
        });

    };

    handlePrev(cb, index){
        return true
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.promotionDetailInfo.getIn(["$promotionDetail","rule"]))!==
            JSON.stringify(nextProps.promotionDetailInfo.getIn(["$promotionDetail","rule"]))){

            let _promotionDetail = nextProps.promotionDetailInfo.get("$promotionDetail").toJS();
            let _rule = Object.assign({}, _promotionDetail.rule);


            let ruleInfo, maxCount, ruleType = _rule.stageType;
            if (_rule.stage !== undefined &&  _rule.stage instanceof Array) {
                ruleInfo = _rule.stage.map((stageInfo)=>{
                    return {
                        start: stageInfo.stageAmount,
                        end: stageInfo.freeAmount,
                        validationStatus: 'success',
                        helpMsg: null
                    }
                });
                maxCount = 3;

            } else {
                // 初始值
                ruleInfo = [{
                    start: _rule.stageAmount,
                    end: _rule.freeAmount,
                    validationStatus: 'success',
                    helpMsg: null
                }];
                maxCount = 1;

            }

            // TODO: set state
            this.setState({
                ruleType,
                ruleInfo,
                maxCount
        });
        }
    }

    // next is 0, finish is 1
    handleSubmit(){
        let {ruleInfo, ruleType} = this.state;
        let  ruleValidation = ruleInfo.reduce((p, c) => {
            if(c.start === null ||c.end ===null ||c.start == '' ||c.end ==''||Number.isNaN(c.start)||Number.isNaN(c.end) ){
                c.validationStatus = 'error';
                c.helpMsg ='请输入正确金额范围';
            }
            return p && c.validationStatus === 'success';
        }, true);


        // construct state to specified format
        let rule ;
        if(ruleType=='2' || ruleType=='3'){
            rule = {
                stageType: 2,
                stage: this.state.ruleInfo.map((ruleInfo) => {
                    return {
                        stageAmount: ruleInfo.start,
                        freeAmount: ruleInfo.end
                    }
                })
            }
        }else{
            rule = {
                stageType: 1,
                stageAmount: ruleInfo[0].start,
                freeAmount: ruleInfo[0].end
            }
        }
        // save state to redux
        if (ruleValidation) {
            this.props.setPromotionDetail({
                rule
            });
            return true;
        } else {
            // TODO: add a message tips here
            this.setState({ruleInfo});

        }
    };

    componentWillUnmount() {};

    onChangeClick = () => {
        this.setState({
            display: !this.state.display
        });
    };
    onCustomRangeInputChange(value, index) {
        const _start = value.start;
        const _end = value.end;
        let _validationStatus, _helpMsg;
        //TODO:刚输入的时候就报错
        if (parseFloat(_start) >= parseFloat(_end) ||(_start==null &&_end!=null)|| (_start!=null &&_end==null)) {
            _validationStatus = 'success';
            _helpMsg = null
        } else {
            _validationStatus = 'error';
            _helpMsg = '请输入正确金额范围'
        }

        let _tmp = this.state.ruleInfo;
        _tmp[index] = {
            start: _start,
            end: _end,
            validationStatus: _validationStatus,
            helpMsg: _helpMsg
        };
        this.setState({ruleInfo : _tmp});

    }

    renderPromotionRule() {
        return (
            <div>
                <FormItem label="活动方式" className={styles.FormItemStyle} labelCol={{
                    span: 4
                }} wrapperCol={{
                    span: 17
                }}>
                    <p>任意或指定消费满或每满一定金额即可得到一定的减价优惠</p>
                </FormItem>

                {
                    this.renderRulesComponent()
                }

            </div>
        )

    }

    renderRulesComponent() {
        return (this.state.ruleInfo.map((ruleInfo, index) => {
            let _value = {
                start: null,
                end: null
            };
            if (ruleInfo.start){
                _value.start = ruleInfo.start;
            }
            if(ruleInfo.end) {
                _value.end = ruleInfo.end;
            }

            return (
                <Row key={index}>
                    <Col>
                        <FormItem label=" "
                                  className={styles.FormItemStyle}
                                  labelCol={{span: 4}}
                                  wrapperCol={{span: 17}}
                                  validateStatus={ruleInfo.validationStatus}
                                  help={ruleInfo.helpMsg}
                        >
                            <CustomRangeInput
                                // addonBefore = {this.state.ruleType == 1 ? '消费每满':'消费满'}
                                addonBefore = {
                                    <Select size='default'
                                            className={styles.linkSelectorRight}
                                            value={`${this.state.ruleType}`}
                                            onChange={(val) => {
                                                let {ruleType,maxCount} = this.state;
                                                ruleType = val;
                                                if(val=='1' || val=='4'){
                                                    maxCount = 1;
                                                    this.state.ruleInfo.length = 1;
                                                }else{
                                                    maxCount = 3
                                                }
                                                if(val=='1'||val=='2'){
                                                    this.props.setPromotionDetail({
                                                         //i清空已选,
                                                         scopeLst:[],
                                                         dishes:[],
                                                         priceLst:[],
                                                         foodCategory:[],
                                                         excludeDishes:[]
                                                    });
                                                }
                                                this.setState({ruleType,maxCount});}
                                            }
                                    >
                                        {type.map((type, index) => {
                                            return <Option key={`options-${index}`} value={type.value}>{type.name}</Option>
                                        })}
                                    </Select>
                                }
                                value={
                                    _value
                                }
                                onChange={(value) => {
                                    this.onCustomRangeInputChange(value, index);
                                }
                            }/>
                        </FormItem>
                    </Col>
                    <Col>
                        { this.renderOperationIcon(index)}
                    </Col>

                </Row>

            )
        }))
    }

    addRule(){
        let _tmp = this.state.ruleInfo;
        _tmp.push({
            validationStatus: 'success',
            helpMsg: null,
            start: null,
            end: null
        });

        this.setState({
            'ruleInfo': _tmp
        });
    }

    deleteRule(index, e){
        let _tmp = this.state.ruleInfo;
        _tmp.splice(index, 1);

        this.setState({
            'ruleInfo': _tmp
        });

    }

    renderOperationIcon(index){
        let _len = this.state.ruleInfo.length;
        //
        if (this.state.maxCount == 1){
            return null;
        }

        if(_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule}/>
                </span>
            )
        }

        if(_len == this.state.maxCount  && index == this.state.maxCount-1 ) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.deleteIconLeft} type="minus-circle-o" onClick={(e) => {
                        let _index = index;
                        this.deleteRule(_index, e)
                    }}/>
                </span>
            )
        } else {
            if (index == _len - 1 && _len == this.state.maxCount -1) {
                return (
                    <span className={styles.iconsStyle}>
                        <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addRule}/>
                        <Icon className={styles.deleteIcon} type="minus-circle-o" onClick={(e) => {
                            let _index = index;
                            this.deleteRule(_index, e)
                        }}/>
                    </span>
                )
            } else {
                return null;
            }
        }

    }

    renderAdvancedSettingButton() {
        return (
            <FormItem className={[styles.FormItemStyle,styles.formItemForMore].join(' ')} wrapperCol={{
                span: 17,
                offset: 4
            }}>
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px"/>}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px"/>}
                </span>
            </FormItem>
        )
    }

    // TODO: add value and onChange props to PromotionDetailSetting
    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.state.ruleType != "1" && this.state.ruleType != "2" && <PromotionDetailSetting/>}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display
                        ? <AdvancedPromotionDetailSetting payLimit={true}/>
                        : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_old_steps.toJS(),
        fullCut: state.sale_old_fullCut,
        promotionDetailInfo: state.sale_old_promotionDetailInfo,
        promotionScopeInfo: state.sale_old_promotionScopeInfo,
        PromotionBasicInfo: state.sale_old_promotionBasicInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FullCutDetailInfo));
