/**
 * @Author: chenshuang
 * @Date:   2017-03-30T14:17:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T17:27:56+08:00
 */


import styles from '../ActivityPage.less';
import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Form, Select, Radio} from 'antd';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import {
    saleCenterSetPromotionDetailAC,
    fetchPromotionListAC,
    fetchRoleListInfoAC,
    fetchSubjectListInfoAC
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

import { ACTIVITY_CATEGORIES, CLIENT_CATEGORY, PAYMENTS_OPTIONS } from '../../../redux/actions/saleCenter/types.js';
import EditBoxForPromotion from './EditBoxForPromotion';
import EditBoxForSubject from './EditBoxForSubject';
import EditBoxForRole from './EditBoxForRole';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var Immutable = require("immutable");


class AdvancedPromotionDetailSetting extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            promotionList: {},
            mutexPromotions: [],
            mutexSubjects: [],
            selectedRole: [],
            userSetting:'0',
            subjectType:'0'
        };

        this.renderUserSetting = this.renderUserSetting.bind(this);
        this.renderPaymentSetting = this.renderPaymentSetting.bind(this);
        this.renderExcludedPromotionSelection = this.renderExcludedPromotionSelection.bind(this);
        this.renderExcludedPayTypeSelection = this.renderExcludedPayTypeSelection.bind(this);
        this.onPromotionChange = this.onPromotionChange.bind(this);
        this.onSubjectChange = this.onSubjectChange.bind(this);
        this.renderRoleOptions = this.renderRoleOptions.bind(this);

    }
    componentDidMount(){

        let userSetting = this.props.promotionDetailInfo.getIn(["$promotionDetail", "userSetting"]);
        let subjectType = this.props.promotionDetailInfo.getIn(["$promotionDetail", "subjectType"]);

        this.setState({
            userSetting:userSetting,
            subjectType:subjectType,
        });


    }
    componentWillReceiveProps(nextProps) {
        let {userSetting, subjectType} = this.state;
        if(nextProps.promotionDetailInfo.getIn(["$promotionDetail", "userSetting"])!=
            this.props.promotionDetailInfo.getIn(["$promotionDetail", "userSetting"])){
            userSetting = nextProps.promotionDetailInfo.getIn(["$promotionDetail", "userSetting"]);
        }
        if(nextProps.promotionDetailInfo.getIn(["$promotionDetail", "subjectType"])!=
            this.props.promotionDetailInfo.getIn(["$promotionDetail", "subjectType"])){
            subjectType = nextProps.promotionDetailInfo.getIn(["$promotionDetail", "subjectType"]);
        }
        this.setState({
            userSetting,
            subjectType
        });

    }


    renderUserSetting($promotionDetail){
        return (

            <FormItem label="活动适用用户" className={styles.FormItemStyle}  labelCol={{span:4}}
                      wrapperCol={{span:17}}>

                <Select  size='default' className={styles.linkSelectorRight}
                        value={this.state.userSetting}
                        onChange={(val)=> {
                            this.setState({
                                userSetting:val
                            });
                            this.props.setPromotionDetail({
                                userSetting: val
                            })
                        }
                        }
                >
                    {CLIENT_CATEGORY
                        .map((type)=>{
                            return <Option key={type.value} value={type.value}>{type.name}</Option>
                        })}
                </Select>
            </FormItem>
        )
    }

    renderPaymentSetting($promotionDetail){
        return (

            <FormItem label="支付限制" className={styles.FormItemStyle}  labelCol={{span:4}}
                      wrapperCol={{span:17}}>
                <RadioGroup value={this.state.subjectType}
                            onChange={(e)=> {
                                this.setState({
                                    subjectType:e.target.value
                                });
                                this.props.setPromotionDetail({
                                    subjectType: e.target.value
                                })
                            }
                            }
                >
                    {PAYMENTS_OPTIONS
                        .map((type)=>{
                            return <Radio key={type.value}  value={type.value}>{type.name}</Radio >
                        })}
                </RadioGroup >
            </FormItem>
        )
    }

    onPromotionChange(val){
        this.setState({
            mutexPromotions: val
        });

        this.props.setPromotionDetail({
            mutexPromotions: val.map((promotion) => {
                return promotion.promotionIDStr;
            })
        });
    }

    onSubjectChange(val){
        this.setState({
            mutexSubjects: val
        });

        this.props.setPromotionDetail({
            mutexSubjects: val.map((subject) => {
                return subject.subjectKey;
            })
        });
    }
    onRoleChange = (val) =>{
        this.setState({
            selectedRole: val
        });

        this.props.setPromotionDetail({
            role: val.map((role) => {
                return role.roleID;
            })
        });
    };

    renderExcludedPromotionSelection(){

        return (

            <FormItem
                label="营销活动共享" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>
                <EditBoxForPromotion onChange={(val)=>{
                    this.onPromotionChange(val)
                }}/>
            </FormItem>
        )
    }

    renderExcludedPayTypeSelection(){

        return (

            <FormItem
                label="结算方式互斥" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>
                <EditBoxForSubject onChange={(val)=>{
                    this.onSubjectChange(val)
                }}/>
            </FormItem>
        )
    }


    renderRoleOptions(){

        return(

            <FormItem
                label="活动执行角色" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>
                <EditBoxForRole onChange={(val)=>{
                    this.onRoleChange(val)
                }}/>
            </FormItem>
        )
    }

    render(){
        let $promotionDetail = this.props.promotionDetailInfo.get("$promotionDetail");
        let $promotionScope = this.props.promotionScopeInfo.get("$scopeInfo");
        return (
            <div>

                {this.renderUserSetting($promotionDetail)}
                {
                    this.props.payLimit ?
                        this.renderPaymentSetting($promotionDetail)
                    :null
                }
                {this.renderExcludedPromotionSelection()}
                {this.renderExcludedPayTypeSelection()}
                {
                    $promotionScope.toJS().auto==1? null:
                        this.renderRoleOptions()
                }
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
    return {
        promotionDetailInfo: state.sale_old_promotionDetailInfo,
        promotionScopeInfo: state.sale_old_promotionScopeInfo,
        user:state.user.toJS()
    }
};

const mapDispatchToProps = (dispatch)=>{
    return {
        setPromotionDetail: (opts)=>{
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionListAC(opts))
        },

        fetchRoleList: (opts) => {
            dispatch(fetchRoleListInfoAC(opts));
        },

        fetchSubjectListInfo: (opts) => {
            dispatch(fetchSubjectListInfoAC(opts));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPromotionDetailSetting);
