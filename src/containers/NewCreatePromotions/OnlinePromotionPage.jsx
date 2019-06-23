import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {ONLINE_PROMOTION_TYPES} from "../../constants/promotionType";
import {
    ONLINE_PROMOTION_CREATE_GROUP,
    ONLINE_PROMOTION_CREATE_SHOP,
} from '../../constants/entryCodes';

@registerPage([
    ONLINE_PROMOTION_CREATE_GROUP,
    ONLINE_PROMOTION_CREATE_SHOP,
], {
})
@connect(mapStateToProps, mapDispatchToProps)
class NewCustomerPage extends Component {

    render() {
        return (
            <BasePage
                categoryTitle="线上营销"
                promotions={
                    ONLINE_PROMOTION_TYPES
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
