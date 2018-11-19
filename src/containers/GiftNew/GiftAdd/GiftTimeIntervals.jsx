import React, {Component} from 'react';
import { TimePicker, Icon } from 'antd';
import moment from 'moment'
import styles from '../../SaleCenterNEW/ActivityPage.less'

class GiftTimeIntervals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxIntervals: 5,
            intervals: props.value || [{periodStart: '', periodEnd: ''}],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Array.isArray(nextProps.value)) {
            this.setState({
                intervals: nextProps.value,
            })
        }
    }
    add = () => {
        const {intervals: original, maxIntervals: max} = this.state;
        const intervals = original.slice();
        if (intervals.length < max) {
            intervals.push({periodStart: '', periodEnd: ''})
            this.setState({
                intervals
            }, () => {
                this.props.onChange(intervals)
            })
        }
    }

    removeIndex(index) {
        const {intervals: original} = this.state;
        const intervals = original.slice();
        if (intervals.length > 1) {
            intervals.splice(index, 1)
            this.setState({
                intervals
            }, () => {
                this.props.onChange(intervals)
            })
        }
    }

    handleTimeChange = (moment, index, key) => {
        const formattedString = moment.format('HHmm') + '00';
        const { intervals: original } = this.state;
        const intervals = JSON.parse(JSON.stringify(original));
        intervals[index][key] = formattedString;
        this.setState({ intervals }, () => {
            this.props.onChange(intervals)
        })
    }


    renderIntervalItem({periodStart, periodEnd}, index) {
        const { maxIntervals, intervals } = this.state;
        return (
            <div className={styles.giftTimeIntervalItem}>
                <div className={styles.timePickerWrapper}>
                    <TimePicker
                        placeholder="起始时间"
                        size="large"
                        defaultValue={periodStart ? moment(periodStart, 'HHmmss') : null}
                        hideDisabledOptions
                        format="HH:mm"
                        allowEmpty={false}
                        onChange={(moment) => this.handleTimeChange(moment, index, 'periodStart')}
                    />
                    --
                    <TimePicker
                        allowEmpty={false}
                        size="large"
                        format="HH:mm"
                        defaultValue={periodEnd ? moment(periodEnd, 'HHmmss') : null}
                        hideDisabledOptions
                        placeholder="结束时间"
                        onChange={(moment) => this.handleTimeChange(moment, index, 'periodEnd')}
                    />
                </div>

                <div>
                    {(index === (intervals.length - 1) && intervals.length < maxIntervals) && <Icon onClick={this.add}  style={{ marginRight: 10 }} className={styles.plusIcon} type="plus-circle-o" />}
                    {intervals.length > 1 && <Icon onClick={() => this.removeIndex(index)} className={styles.deleteIcon} type="minus-circle-o"/>}
                </div>
            </div>
        )
    }

    render() {
        const { intervals } = this.state;
        return (
            <div>
                {
                    intervals.map((item, index) => this.renderIntervalItem(item, index))
                }
            </div>
        )
    }
}

export default GiftTimeIntervals
