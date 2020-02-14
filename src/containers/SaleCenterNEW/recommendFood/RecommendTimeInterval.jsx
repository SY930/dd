import React, { Component } from 'react'
import {
    TimePicker,
} from 'antd';
import moment from 'moment';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
@injectIntl()
export default class RecommendTimeInterval extends Component {

    handleTimeChange = (timeMoment, propertyName) => {
        this.props.onChange({
            ...this.props.value,
            [propertyName]: timeMoment.format('HHmm'),
        })
    }

    render() {
        const {
            startTime,
            endTime,
        } = this.props.value;
        const { intl } = this.props;
        const k6hdp97n = intl.formatMessage(SALE_STRING.k6hdp97n);
        const k6hdpsvl = intl.formatMessage(SALE_STRING.k6hdpsvl);
        return (
            <div>
                <TimePicker
                    style={{ width: 120 }}
                    placeholder={k6hdp97n}
                    getPopupContainer={(node) => node.parentNode}
                    value={startTime ? moment(startTime, 'HHmm') : null}
                    hideDisabledOptions
                    format="HH:mm"
                    allowEmpty={false}
                    onChange={(moment) => this.handleTimeChange(moment, 'startTime')}
                />
                &nbsp;&nbsp;~&nbsp;&nbsp;
                <TimePicker
                    style={{ width: 120 }}
                    allowEmpty={false}
                    getPopupContainer={(node) => node.parentNode}
                    format="HH:mm"
                    value={endTime ? moment(endTime, 'HHmm') : null}
                    hideDisabledOptions
                    placeholder={k6hdpsvl}
                    onChange={(moment) => this.handleTimeChange(moment, 'endTime')}
                />
            </div>
        )
    }
}
