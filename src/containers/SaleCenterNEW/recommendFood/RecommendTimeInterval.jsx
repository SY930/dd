import React, { Component } from 'react'
import {
    TimePicker,
} from 'antd';
import moment from 'moment';

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
        return (
            <div>
                <TimePicker
                    style={{ width: 120 }}
                    placeholder="起始时间"
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
                    placeholder="结束时间"
                    onChange={(moment) => this.handleTimeChange(moment, 'endTime')}
                />
            </div>
        )
    }
}
