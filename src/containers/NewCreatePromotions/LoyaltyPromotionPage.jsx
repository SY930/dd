import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {LOYALTY_PROMOTION_TYPES} from "../../constants/promotionType";
import {LOYALTY_PROMOTION} from "../../constants/entryCodes";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@registerPage([LOYALTY_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    render() {
        const { intl } = this.props;
        const k6316hlc = intl.formatMessage(SALE_STRING.k6316hlc);
        return (
            <BasePage
                categoryTitle={k6316hlc}
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
