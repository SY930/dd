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
import SpecialRangeInfo from '../common/SpecialRangeInfo'; // 活动范围
import SpecialDetailInfo from '../common/SpecialPromotionDetailInfo'; // 选择礼品

import NewPromotion from '../common/NewPromotion';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import StepOneWithDateRange from '../common/StepOneWithDateRange';
import { addSpecialPromotion, updateSpecialPromotion, saleCenterLotteryLevelPrizeData } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from 'redux/actions/saleCenterNEW/promotionDetailInfo.action';
import LotteryThirdStep from './LotteryThirdStep'
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class NewShackGift extends NewPromotion {
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
                        isCopy={this.props.isCopy}
                        isNew={this.props.isNew}
                        type={`${specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g61177)}`,
                content: (
                    <SpecialRangeInfo
                        type={`${specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                    />
                ),
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du37x82g62158)}`,
                //注掉的是之前的逻辑,参考完去除
                // content: (
                //     <SpecialDetailInfo
                //         type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                //         getSubmitFn={(handles) => {
                //             this.handles[2] = handles;
                //         }}
                //         onChange={(rule) => {
                //             this.setState({ rule });
                //         }}
                //         isNew={this.props.isNew}
                //     />
                // ),
                content: (
                    <LotteryThirdStep
                        levelPrize = {levelPrize}
                        updateLevelPrize={saleCenterLotteryLevelPrizeData}
                        isNew={this.props.isNew}
                        isCopy={this.props.isCopy}
                        type={`${this.props.specialPromotion.$eventInfo.eventWay}`}
                        getSubmitFn={(handles) => {
                            this.handles[2] = handles;
                        }}
                        onChange={(rule) => {
                           this.setState({ rule });
                       }}
                    ></LotteryThirdStep>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewShackGift);
