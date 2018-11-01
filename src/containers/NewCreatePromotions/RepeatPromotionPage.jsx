import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {REPEAT_PROMOTION_TYPES} from "../../constants/promotionType";
import {REPEAT_PROMOTION} from "../../constants/entryCodes";

@registerPage([REPEAT_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="促进复购"
                promotions={
                    REPEAT_PROMOTION_TYPES
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
