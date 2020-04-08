import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {FANS_INTERACTIVITY_PROMOTION_TYPES} from "../../constants/promotionType";
import {FANS_INTERACTIVITY} from "../../constants/entryCodes";
import { axiosData } from '../../helpers/util';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const limitedTypes = [
    '77',
    '76',
]
@registerPage([FANS_INTERACTIVITY], {
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
        const k6316hd0 = intl.formatMessage(SALE_STRING.k6316hd0);
        return (
            <BasePage
                categoryTitle={k6316hd0}
                promotions={
                    FANS_INTERACTIVITY_PROMOTION_TYPES
                }
                whiteList={whiteList}
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
