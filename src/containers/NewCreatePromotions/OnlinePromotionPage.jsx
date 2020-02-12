import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {ONLINE_PROMOTION_TYPES} from "../../constants/promotionType";
import {
    ONLINE_PROMOTION_CREATE_GROUP,
    ONLINE_PROMOTION_CREATE_SHOP,
} from '../../constants/entryCodes';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@registerPage([
    ONLINE_PROMOTION_CREATE_GROUP,
    ONLINE_PROMOTION_CREATE_SHOP,
], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    render() {
        const { intl } = this.props;
        const k6316i20 = intl.formatMessage(SALE_STRING.k6316i20);
        return (
            <BasePage
                categoryTitle={k6316i20}
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
