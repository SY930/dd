/**
 * @Author: Sen Wang  <ws>
 * @Date:   2017-09-27
 * @Email:  wangsen@hualala.com
 * @Filename: PerfectReturnGift.jsx
 */

import React from 'react';
import { connect } from 'react-redux';
import StepTwo from './StepTwo'; // 活动范围
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo'; // 选择礼品

import NewPromotion from '../common/NewPromotion';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import StepOneWithDateRange from '../common/StepOneWithDateRange';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class NewPerfectReturnGift extends NewPromotion {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }
        const steps = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}`,
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
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g61177)}`,
                content: (
                    <StepTwo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                    />
                ),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g62158)}`,
                content: (
                    <SpecialDetailInfo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        isNew={this.props.isNew}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewPerfectReturnGift);
