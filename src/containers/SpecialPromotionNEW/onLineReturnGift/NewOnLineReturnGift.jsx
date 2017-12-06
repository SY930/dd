import React from 'react';
import { connect } from 'react-redux';
import SpecialRangeInfo from '../common/SpecialRangeInfo'; // 活动范围
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo'; // 选择礼品
import NewPromotion from '../common/NewPromotion';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import StepOneWithDateRange from '../common/StepOneWithDateRange';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

class NewOnLineReturnGift extends NewPromotion {
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
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: '活动范围',
                content: (
                    <SpecialRangeInfo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
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
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                        onChange={(rule) => {
                            this.setState({ rule });
                        }}
                        isNew={this.props.isNew}
                    />
                ),
            },
        ];
        return (
            <CustomProgressBar
                loading={this.state.loading}
                steps={steps}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
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
        specialPromotion: state.specialPromotion_NEW.toJS(),
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

export default connect(mapStateToProps, mapDispatchToProps)(NewOnLineReturnGift);
