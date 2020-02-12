import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasePage from "./BasePage";
import registerPage from '../../../index';
import {REPEAT_PROMOTION_TYPES} from "../../constants/promotionType";
import {REPEAT_PROMOTION} from "../../constants/entryCodes";
import { axiosData } from '../../helpers/util';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';
const limitedTypes = [
    '75',
]
@registerPage([REPEAT_PROMOTION], {
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class NewCustomerPage extends Component {

    state = {
        whiteList: [],
    }

    componentDidMount() {
        axiosData(
            '/promotionWhiteList/queryAllData.ajax',
            { requestType: '10', },
            { needThrow: true },
            { path: 'allData' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(dataStr => {
            const dataArr = JSON.parse(dataStr);
            const { whiteList } = this.state;
            dataArr.forEach(item => {
                if (item.isWhiteList) {
                    whiteList.push(`${item.specialType}`)
                }
            })
            this.setState({ whiteList });
        })
    }

    promotionFilter = (promotionType) => {
        const index = limitedTypes.indexOf(promotionType);
        if (index === -1) return true;
        return this.state.whiteList.includes(promotionType);
    }

    render() {
        const { intl } = this.props;
        const k6316iac = intl.formatMessage(SALE_STRING.k6316iac);
        return (
            <BasePage
                categoryTitle={k6316iac}
                promotions={
                    REPEAT_PROMOTION_TYPES.filter(item => this.promotionFilter(item.key))
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
