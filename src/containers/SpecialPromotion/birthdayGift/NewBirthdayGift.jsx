/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-28T10:51:51+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: NewBuyGiveActivity.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-28T19:24:47+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import NewPromotion from '../common/NewPromotion';
import {connect} from 'react-redux';
import {addSpecialPromotion, updateSpecialPromotion} from '../../../redux/actions/saleCenter/specialPromotion.action'

import PromotionBasicInfo from "../common/BirthBasicInfo";
import CustomProgressBar from '../../SaleCenter/common/CustomProgressBar';
import SpecialDetailInfo from "../common/SpecialPromotionDetailInfo";
import SendMsgInfo from '../common/SendMsgInfo';
import StepTwo from './stepTwo';

class NewBirthdayGift extends NewPromotion {
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }

        const steps = [

            {
                title: '基本信息',
                content: (<PromotionBasicInfo
                    type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                    getSubmitFn={(handles) => {
                    this.handles[0] = handles;
                }}/>)
            },
            {
                title: '活动范围',
                content: (
                    <StepTwo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn ={(handles) => {
                            this.handles[1] = handles;
                        }}
                    />
                )
            },
            {
                title: '活动内容',
                content: (
                    <SpecialDetailInfo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn ={(handles) => {
                            this.handles[2] = handles;
                        }}
                        onChange = {(rule) =>{
                            this.setState({rule});
                        }}
                        isNew={this.props.isNew}
                    />
                )
            },
        ];
        return (
            <CustomProgressBar
                loading={this.state.loading}
                steps={steps}
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

const mapStateToProps = (state) => {
    return {
        specialPromotion:state.specialPromotion.toJS(),
        user: state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSpecialPromotion:(opts) => {
            dispatch(addSpecialPromotion(opts));
        },
        updateSpecialPromotion:(opts) => {
            dispatch(updateSpecialPromotion(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewBirthdayGift);
