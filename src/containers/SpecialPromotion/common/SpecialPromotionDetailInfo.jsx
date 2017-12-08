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
import { Row, Col, Form, message, Radio, Input, InputNumber} from 'antd';
import { connect } from 'react-redux'

import {saleCenterSetSpecialBasicInfoAC, saleCenterSetSpecialGiftInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'

if (process.env.__CLIENT__ === true) {
    require('../../../components/common/components.less')
}

import AddGifts from '../common/AddGifts';
let Immutable = require('immutable');



class SpecialDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        this.state ={
            data:[
                {
                    //礼品数量
                    giftCount: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    },
                    //礼品ID和name
                    giftInfo: {
                        giftName: null,
                        giftItemID: null,
                        validateStatus: 'success',
                        msg: null
                    },
                    //礼品生效时间
                    giftEffectiveTime: {
                        value: '0',
                        validateStatus: 'success',
                        msg: null
                    },
                    //礼品有效期
                    giftValidDays: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    },

                    giftOdds: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    }
                }
            ]
        }

    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined
        });
        let giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
        let {data} = this.state;
        giftInfo.forEach((gift, index)=>{
            if(data[index] !== undefined){
                data[index].giftEffectiveTime.value = gift.giftEffectTimeHours;
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID= gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                data[index].giftCount.value = gift.giftCount;
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            }else{
                data[index] = {

                    //礼品数量
                    giftCount: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    },
                    //礼品ID和name
                    giftInfo: {
                        giftName: null,
                        giftItemID: null,
                        validateStatus: 'success',
                        msg: null
                    },
                    //礼品生效时间
                    giftEffectiveTime: {
                        value: '',
                        validateStatus: 'success',
                        msg: null
                    },
                    //礼品有效期
                    giftValidDays: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    },

                    giftOdds: {
                        value: '',
                        validateStatus: 'success',
                        msg: null,
                    }
                };
                data[index].giftEffectiveTime.value = gift.giftEffectTimeHours;
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID= gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                data[index].giftCount.value = gift.giftCount;
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);

            }
        })
        this.setState({
            data
        })
    };


    componentWillReceiveProps(nextProps) {
        // 是否更新礼品信息
        if((this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo'))&&
            nextProps.specialPromotion.get('$giftInfo').size > 0
        ){
            let giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
            let {data} = this.state;
            giftInfo.forEach((gift, index)=>{
                if(data[index] !== undefined){
                    data[index].giftEffectiveTime.value = gift.giftEffectTimeHours;
                    data[index].giftInfo.giftName = gift.giftName;
                    data[index].giftInfo.giftItemID= gift.giftID;
                    data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                    data[index].giftCount.value = gift.giftCount;
                    data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
                }else{
                    data[index] = {

                        //礼品数量
                        giftCount: {
                            value: '',
                            validateStatus: 'success',
                            msg: null,
                        },
                        //礼品ID和name
                        giftInfo: {
                            giftName: null,
                            giftItemID: null,
                            validateStatus: 'success',
                            msg: null
                        },
                        //礼品生效时间
                        giftEffectiveTime: {
                            value: '',
                            validateStatus: 'success',
                            msg: null
                        },
                        //礼品有效期
                        giftValidDays: {
                            value: '',
                            validateStatus: 'success',
                            msg: null,
                        },

                        giftOdds: {
                            value: '',
                            validateStatus: 'success',
                            msg: null,
                        }
                    };
                    data[index].giftEffectiveTime.value = gift.giftEffectTimeHours;
                    data[index].giftInfo.giftName = gift.giftName;
                    data[index].giftInfo.giftItemID= gift.giftID;
                    data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                    data[index].giftCount.value = gift.giftCount;
                    data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);

                }
            })
            this.setState({
                data
            })
        }

    };


    //拼出礼品信息
    getGiftInfo(data){
        let giftObj = data.map((giftInfo, index)=>{
            let gifts = {
                giftEffectTimeHours: giftInfo.giftEffectiveTime.value,
                giftValidUntilDayCount: giftInfo.giftValidDays.value,
                giftID: giftInfo.giftInfo.giftItemID,
                giftName: giftInfo.giftInfo.giftName,
                giftCount: giftInfo.giftCount.value,
            };
            if(this.props.type == '20'){
                gifts.giftOdds = giftInfo.giftOdds.value;
            }
            return gifts
        });
        return giftObj;

    }

    handleSubmit() {

        let {data} = this.state;
        let {type} = this.props;

        //校验礼品数量
        function checkGiftCount(giftCount){
            let _value = parseFloat(giftCount.value);
            if (_value > 0) {
                return giftCount;
            } else {
                return {
                    msg: "消费金额必须大于0",
                    validateStatus: 'error',
                    value: ''
                }
            }
        }

        //有效天数
        function checkGiftValidDays(giftValidDays){
            let _value = parseFloat(giftValidDays.value);
            if (_value > 0) {
                return giftValidDays;
            } else {
                return {
                    msg: "中奖比率必须在0~100之间",
                    validateStatus: 'error',
                    value: ''
                }
            }
        }

        //校验中奖比率
        function checkGiftOdds(giftOdds){
            let _value = parseFloat(giftOdds.value);
            if(type == '20'){
                if (_value > 0) {
                    return giftOdds;
                } else {
                    return {
                        msg: "中奖比率必须在0~100之间",
                        validateStatus: 'error',
                        value: ''
                    }
                }
            }else{
                return giftOdds;
            }

        }

        //校验礼品信息
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

        let validatedRuleData = data.map((ruleInfo, index)=>{
            return Object.assign(ruleInfo, {
                giftCount: checkGiftCount(ruleInfo.giftCount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                giftValidDays: checkGiftValidDays(ruleInfo.giftValidDays),
                giftOdds: checkGiftOdds(ruleInfo.giftOdds),
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
        //把中奖率累加,判断总和是否满足小于等于100
        let validOdds = data.reduce((res, cur)=>{
            return res + parseFloat(cur.giftOdds.value)
        },0);
        data = validatedRuleData;
        this.setState({data});
        if(validateFlag){
            if(validOdds > 100){
                message.warning('中奖比率之和不能大于100!');
                return false;
            }
            let giftInfo = this.getGiftInfo(data);
            //this.props.setSpecialBasicInfo(giftInfo);
            this.props.setSpecialGiftInfo(giftInfo);
            return true;
        }else{
            return false;
        }

        return validateFlag;
    }

    gradeChange(val){
        let {data} = this.state;
        if(val!==undefined){
            data = val;
            this.setState({data});
        }else{
            return;
        }
    }
    render(){
        return(
            <div >
                <Row >
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount = {10}
                            type={this.props.type}
                            value = {this.state.data}
                            onChange={this.gradeChange}/>
                    </Col>
                </Row>

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
        user:state.user.toJS(),
        specialPromotion: state.sale_old_specialPromotion

    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        setSpecialGiftInfo:(opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
