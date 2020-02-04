import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {REPEAT_PROMOTION_TYPES} from "../../constants/promotionType";
import {REPEAT_PROMOTION} from "../../constants/entryCodes";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@registerPage([REPEAT_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    render() {
        const { intl } = this.props;
        const k6316iac = intl.formatMessage(SALE_STRING.k6316iac);
        return (
            <BasePage
                categoryTitle={k6316iac}
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
