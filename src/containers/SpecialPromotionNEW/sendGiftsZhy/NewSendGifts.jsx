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
import { connect } from 'react-redux';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

// import CustomProgressBar from './CustomProgressBar';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
// import SpecialDetailInfo from './SpecialPromotionDetailInfoInSendGifts';
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo';
import Three from './Three';
import StepTwo from './stepTwo';
// import StepOneWithDateRange from '../common/StepOneWithDateRange';
import StepOne from './StepOne';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class NewSendGiftsZhy extends NewPromotion {
    constructor(props) {
        super(props);
    }

    render() {
        const isBenefitJumpSendGift = this.props.specialPromotion.isBenefitJumpSendGift
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }

        const steps = [

            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}`,
                content: (<StepOne
                    type={this.props.promotionType}
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                    isNew={this.props.isNew}
                    isCopy={this.props.isCopy}
                    isBenefitJumpSendGift={isBenefitJumpSendGift}
                />),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g61177)}`,
                content: (
                    <StepTwo
                        type={this.props.promotionType}
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                        isNew={this.props.isNew}
                        isCopy={this.props.isCopy}
                        isBenefitJumpSendGift={isBenefitJumpSendGift}
                    />
                ),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g62158)}`,
                content: (
                    <SpecialDetailInfo
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                        isNew={this.props.isNew}
                        isBenefitJumpSendGift={isBenefitJumpSendGift}
                    />
                ),
                // content: (
                //     <Three />
                // )
            },
        ];
        // const { upperLimitVisible } = this.state;
        // console.log("🚀 ~ file: NewSendGiftsZhy.jsx ~ line 85 ~ NewSendGiftsZhy ~ render ~ upperLimitVisible", upperLimitVisible)
        return (
            <div>
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
                    upperLimitVisible={this.state.upperLimitVisible}
                    onUpperLimitCancel={this.onUpperLimitCancel}
                    data={this.state.data}
                    type={this.props.promotionType}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewSendGiftsZhy);
