import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {NEW_CUSTOMER_PROMOTION_TYPES} from "../../constants/promotionType";
import {NEW_CUSTOMER} from "../../constants/entryCodes";
import { axiosData } from '../../helpers/util';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const limitedTypes = [
    '67',
    '68',
]

@registerPage([NEW_CUSTOMER], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    state = {
        whiteList: [],
    }

    componentDidMount() {
        axiosData(
            'specialPromotion/queryOpenedEventTypes.ajax',
            {},
            { needThrow: true },
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(data => {
            const { eventTypeInfoList = [] } = data;
            this.setState({ whiteList: eventTypeInfoList });
        })
    }

    render() {
        const {whiteList} = this.state;
        const { intl } = this.props;
        const k6316hto = intl.formatMessage(SALE_STRING.k6316hto);
        return (
            // <BasePage
            //     categoryTitle={k6316hto}
            //     promotions={NEW_CUSTOMER_PROMOTION_TYPES}
            //     whiteList={whiteList}
            // />
            <div>
                debugger;
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
