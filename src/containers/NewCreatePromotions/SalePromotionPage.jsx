import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {SALE_PROMOTION_TYPES} from "../../constants/promotionType";
import {SALE_PROMOTION} from "../../constants/entryCodes";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@registerPage([SALE_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    render() {
        const { intl } = this.props;
        const k6316iio = intl.formatMessage(SALE_STRING.k6316iio);
        return (
            <BasePage
                categoryTitle={k6316iio}
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
