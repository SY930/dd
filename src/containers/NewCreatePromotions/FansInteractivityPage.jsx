import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {FANS_INTERACTIVITY_PROMOTION_TYPES} from "../../constants/promotionType";
import {FANS_INTERACTIVITY} from "../../constants/entryCodes";

@registerPage([FANS_INTERACTIVITY], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="粉丝互动"
                promotions={
                    FANS_INTERACTIVITY_PROMOTION_TYPES
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
