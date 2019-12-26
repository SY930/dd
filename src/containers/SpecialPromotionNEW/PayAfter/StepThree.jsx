import React from 'react';
import { Button, Icon, Tabs, message } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { 
    addSpecialPromotion, 
    updateSpecialPromotion, 
    saleCenterLotteryLevelPrizeData, 
    saleCenterSetSpecialBasicInfoAC, 
    saleCenterSetSpecialGiftInfoAC, 
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    UpdateGiftLevel,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
import { axiosData } from '../../../helpers/util';
class StepThree extends React.Component{
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
    }
    render() {
        return (
            <div>这是一条测试数据</div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        levelPrize: state.sale_mySpecialActivities_NEW.getIn(['giftsLevel']),
        disabled: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'userCount']) > 0,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
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
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepThree);