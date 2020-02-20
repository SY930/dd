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
import StepFour from '../accumulateGift/StepFour';
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo'; // 选择礼品

import NewPromotion from '../common/NewPromotion';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import StepOneWithDateRange from '../common/StepOneWithDateRange';
import { addSpecialPromotion, updateSpecialPromotion, saleCenterLotteryLevelPrizeData } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from 'redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CheckInSecondStep from './CheckInSecondStep'
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class NewCheckGift extends NewPromotion {
    constructor(props) {
        super(props);
        this.state = {
            levelPrize: props.mySpecialActivities.getIn(['giftsLevel']),
            data: [],
        }
    }

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }
        const { saleCenterLotteryLevelPrizeData, specialPromotion } = this.props;
        const { levelPrize } = this.state;
        const steps = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}`,
                content: (
                    <StepOneWithDateRange
                        type={`${specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g62158)}`,
                content: (
                    <CheckInSecondStep
                        isLast={false}
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        isNew={this.props.isNew}
                    ></CheckInSecondStep>
                ),
            },
            {
                title: `场景设置`,
                content: (
                    <StepFour
                        getSubmitFn={(handles) => {
                            this.handles[3] = handles;
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
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
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
        saleCenterLotteryLevelPrizeData: (opts) => {
            dispatch(saleCenterLotteryLevelPrizeData(opts));
        },
        fetchGiftListInfoAC: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCheckGift);
