import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {LOYALTY_PROMOTION_TYPES} from "../../constants/promotionType";
import {LOYALTY_PROMOTION} from "../../constants/entryCodes";

@registerPage([LOYALTY_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="会员关怀"
                promotions={
                    LOYALTY_PROMOTION_TYPES
                }
            />
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default NewCustomerPage
