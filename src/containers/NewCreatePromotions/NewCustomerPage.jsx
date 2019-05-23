import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {NEW_CUSTOMER_PROMOTION_TYPES} from "../../constants/promotionType";
import {NEW_CUSTOMER} from "../../constants/entryCodes";

const preReleaseTypes = [
    '67',
    '68',
]

@registerPage([NEW_CUSTOMER], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="会员拉新"
                promotions={
                    NEW_CUSTOMER_PROMOTION_TYPES
                    .filter(item => HUALALA.ENVIRONMENT !== 'production-release'
                        || preReleaseTypes.indexOf(item.key) === -1)
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
