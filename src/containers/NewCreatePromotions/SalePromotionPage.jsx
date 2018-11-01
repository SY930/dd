import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {SALE_PROMOTION_TYPES} from "../../constants/promotionType";
import {SALE_PROMOTION} from "../../constants/entryCodes";

@registerPage([SALE_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="促进销量"
                promotions={
                    SALE_PROMOTION_TYPES
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
