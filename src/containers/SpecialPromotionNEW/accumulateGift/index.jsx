import React from 'react';
import { connect } from 'react-redux';
import StepTwo from './stepTwo'; // 活动范围
import StepFour from './StepFour'; // 投放场景
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo'; // 选择礼品

import NewPromotion from '../common/NewPromotion';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import StepOneWithDateRange from '../common/StepOneWithDateRange';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

class AccumulateGiftWrapper extends NewPromotion {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }
        const steps = [
            {
                title: '基本信息',
                content: (
                    <StepOneWithDateRange
                        type={`${this.props.specialPromotion.$eventInfo.eventWay || 70}`}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: '活动范围',
                content: (
                    <StepTwo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                    />
                ),
            },
            {
                title: '活动内容',
                content: (
                    <SpecialDetailInfo
                        isLast={false}
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        isNew={this.props.isNew}
                    />
                ),
            },
            {
                title: '场景设置',
                content: (
                    <StepFour
                        getSubmitFn={(handles) => {
                            this.handles[3] = handles;
                        }}
                    />
                ),
            },
        ];
        return (
            <CustomProgressBar
                loading={this.state.loading}
                steps={steps}
                callback={(arg) => {
                    arg === steps.length && this.props.callbacktwo(3);
                }}
                onNext={this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSpecialPromotion: (opts) => {
            dispatch(addSpecialPromotion(opts));
        },
        updateSpecialPromotion: (opts) => {
            dispatch(updateSpecialPromotion(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccumulateGiftWrapper);
