import React from 'react';
import { connect, Provider } from 'react-redux';
import AlipayCouponDeliveryPage from './AlipayCouponDeliveryPage';
import registerPage from '../../index';
import { ACTIVITY_LAUNCH } from '../../constants/entryCodes';
// @registerPage([PROMOTION_WECHAT_COUPON_LIST]);
// @connect(mapStateToProps)

const getProvider = (props) => {
    return (<Provider><AlipayCouponDeliveryPage {...props} /></Provider>)
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

export default registerPage([ACTIVITY_LAUNCH], {})(connect(mapStateToProps)(getProvider))
