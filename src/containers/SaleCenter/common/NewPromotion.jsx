/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-06T10:27:57+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: NewPromotion.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T12:39:07+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import {message} from 'antd';
import PromotionBasicInfo from "./promotionBasicInfo";
import PromotionScopeInfo from "./promotionScopeInfo";
import CustomProgressBar from './CustomProgressBar';
import {saleCenterAddNewActivityAC, saleCenterUpdateNewActivityAC} from '../../../redux/actions/saleCenter/promotion.action';
import {
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter
} from '../../../redux/actions/saleCenter/types';


class NewPromotion extends React.Component{

    constructor(props) {
        super(props);

        this.handles = [];  // store the callback
        this.state = {
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    onFinish(cb){
        const {promotionBasicInfo, promotionScopeInfo, promotionDetailInfo, user} = this.props;

        const basicInfo = promotionBasicDataAdapter(promotionBasicInfo.get("$basicInfo").toJS(), true);
        const scopeInfo = promotionScopeInfoAdapter(promotionScopeInfo.get("$scopeInfo").toJS(), true);
        const _detailInfo = promotionDetailInfoAdapter(promotionDetailInfo.get("$promotionDetail").toJS(), true);

        const detailInfo = promotionDetailInfo.get("$promotionDetail").toJS();


        let userType = detailInfo.userSetting=='0' ?  '0':(detailInfo.userSetting == '1' ? '1' : '2') ;
        let subjectType = detailInfo.subjectType=='0' ? '0' : '1';
        let sharedPromotionIDLst =typeof detailInfo.mutexPromotions=='object'?detailInfo.mutexPromotions.join(','):detailInfo.mutexPromotions;
        let excludedSubjectLst = typeof detailInfo.mutexSubjects=='object'?detailInfo.mutexSubjects.join(','):detailInfo.mutexSubjects;
        let roleIDLst = typeof detailInfo.role =='object'?detailInfo.role.join(','):detailInfo.role;
        const opts = {
            _groupID: this.props.user.toJS().accountInfo.groupID,
            ...basicInfo,
            ...scopeInfo,
            ..._detailInfo,  // include rule and priceLst
            // rule
            userType,
            sharedPromotionIDLst,
            excludedSubjectLst,
            subjectType,
            roleIDLst,
        };
        if (this.props.isNew === false){
            this.props.updateNewPromotion({
                data: {...opts,modifiedBy:this.props.user.toJS().accountInfo.userName},
                success: ()=>{
                    message.success('活动更新成功');
                    this.setState({
                        loading: false
                    });
                    cb();
                    this.props.clear();
                },
                fail: ()=>{
                    message.error('活动更新失败');
                    this.setState({
                        loading: false
                    });
                },
                complete: ()=>{
                    // TODO:
                }
            });
        } else {
            this.props.addNewPromotion({
                data: {...opts,createBy:this.props.user.toJS().accountInfo.userName},
                success: ()=>{
                    cb();
                    message.success('活动创建成功');
                    this.setState({
                        loading: false
                    });
                    this.props.clear();
                },
                fail:()=>{
                    message.error('活动创建失败');
                    this.setState({
                        loading: false
                    });
                },
                sameCode :()=>{
                    message.error('活动编码重复');
                    this.setState({
                        loading: false
                    });
                }
            });
        }
    }


    handleNext(cb, index){
        let flag = true;
        if (undefined !== this.handles[index].next && typeof this.handles[index].next === 'function'){
            flag = this.handles[index].next();
        }
        if (flag) {
            cb();
        }
    }

    handlePrev(cb, index) {
        // cb is CustomProgressBar's onPrev which is just modify the state of it.
        // do extra
        let flag = true;
        if (undefined !== this.handles[index].prev && typeof this.handles[index].prev === 'function'){
            flag = this.handles[index].prev();
        }
        if (flag) {
            cb();
        }
    }

    handleCancel(cb, index){
        this.props.callbacktwo(3);
        this.props.clear();
    }

    handleFinish(cb, index){
        let flag = true;

        if (undefined !== this.handles[index].finish && typeof this.handles[index].finish === 'function'){
            flag = this.handles[index].finish();
        }
        if (flag) {
            this.setState({
                loading: true
            });
            setTimeout(()=>{
                this.onFinish(()=>{
                    cb();
                    this.props.callbacktwo(3);
                });
            }, 0);
        }
    }

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }

        const steps = [


            {
                title: '基本信息',
                content: (<PromotionBasicInfo
                    isNew= {this.props.isNew}
                    getSubmitFn={(handles) => {
                    this.handles[0] = handles;
                }}/>)
            },
            {
                title: '活动范围',
                content: (<PromotionScopeInfo getSubmitFn={(handles) =>
                {
                    this.handles[1] = handles;
                }}/>)
            },
            {
                title: '活动内容',
                content: React.createElement(
                    this.props.component,
                    {
                        getSubmitFn: (handles) => {
                            this.handles[2] = handles;
                        },
                        onChange: (rule) =>{
                            this.setState({rule});
                        },
                        isNew:this.props.isNew,
                    }
                )
            },
        ];

        return (
            <CustomProgressBar
                steps={steps}
                loading={this.state.loading}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
                }}
                onNext= {this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

export default NewPromotion;
