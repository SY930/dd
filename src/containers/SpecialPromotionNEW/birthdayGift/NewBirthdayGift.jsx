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
import { connect } from 'react-redux';
import NewPromotion from '../common/NewPromotion';
import { addSpecialPromotion, updateSpecialPromotion } from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import PromotionBasicInfo from '../common/BirthBasicInfo';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo';
import StepTwo from './stepTwo';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class NewBirthdayGift extends NewPromotion {
    constructor(props) {
        super(props);
        this.steps = [

            {
                title: `${props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}`,
                content: (<PromotionBasicInfo
                    type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                    isNew={this.props.isNew}
                />),
            },
            {
                title: `${props.intl.formatMessage(STRING_SPE.du37x82g61177)}`,
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
                title: `${props.intl.formatMessage(STRING_SPE.du37x82g62158)}`,
                content: (
                    <SpecialDetailInfo
                        type={`${props.specialPromotion.$eventInfo.eventWay}`}
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
    }
    render() {
        return (
            <CustomProgressBar
                loading={this.state.loading}
                steps={this.steps}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewBirthdayGift);
