import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {NEW_CUSTOMER_PROMOTION_TYPES} from "../../constants/promotionType";
import {NEW_CUSTOMER} from "../../constants/entryCodes";

@registerPage([NEW_CUSTOMER], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <div>
                <BasePage
                    categoryTitle="会员拉新"
                    promotions={
                        NEW_CUSTOMER_PROMOTION_TYPES
                    }
                />
            </div>
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
