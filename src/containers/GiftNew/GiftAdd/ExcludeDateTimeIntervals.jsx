import React, {Component} from 'react';
import {
    TimePicker,
    DatePicker,
    Icon,
    Tooltip,
    Checkbox
} from 'antd';
import moment from 'moment'
import styles from '../../SaleCenterNEW/ActivityPage.less'
const isOverlapped = (a, b) => {
    return (a.periodStart >= b.periodStart
        && a.periodStart <= b.periodEnd) || (
            a.periodEnd >= b.periodStart
            && a.periodEnd <= b.periodEnd
        ) || (b.periodStart >= a.periodStart
        && b.periodStart <= a.periodEnd) || (
            b.periodEnd >= a.periodStart
            && b.periodEnd <= a.periodEnd
        );
}

export const getExcludeDateItervalsErrorStatus = (intervals) => {
    const filteredIntervals = (intervals || []).filter(({periodStart, periodEnd}) => !!periodStart && !!periodEnd);
    if (!filteredIntervals.length) {
        return {
            hasError: true,
            errorMessage: '至少要设置一个完整时间段'
        }
    }
    if (filteredIntervals.length == 1){
        if (filteredIntervals[0].periodStart > filteredIntervals[0].periodEnd) {
            return {
                hasError: true,
                errorMessage: '起始时间应小于等于结束时间'
            }
        }
    }
    if (filteredIntervals.length > 1) {
        for (let i = 0; i < (filteredIntervals.length - 1); i += 1) {
            if (filteredIntervals[i].periodStart > filteredIntervals[i].periodEnd) {
                return {
                    hasError: true,
                    errorMessage: '起始时间应小于等于结束时间'
                }
            }
            for (let j = i + 1; j < filteredIntervals.length; j += 1) {
                if (filteredIntervals[i].periodStart <= filteredIntervals[i].periodEnd
                    &&
                    filteredIntervals[j].periodStart <= filteredIntervals[j].periodEnd
                ) { // i, j非跨天
                    if (isOverlapped(filteredIntervals[j], filteredIntervals[i])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置不能重复'
                        }
                    }
                }
                if (filteredIntervals[i].periodStart > filteredIntervals[i].periodEnd
                    &&
                    filteredIntervals[j].periodStart > filteredIntervals[j].periodEnd
                ) { // i, j都跨天
                    return {
                        hasError: true,
                        errorMessage: '时间段设置不能重复'
                    }
                }
                if (filteredIntervals[i].periodStart <= filteredIntervals[i].periodEnd
                    &&
                    filteredIntervals[j].periodStart > filteredIntervals[j].periodEnd
                ) { // i非跨天 j跨天
                    const beforeMidNightInterval = {...filteredIntervals[j], periodEnd: '235900'}
                    const afterMidNightInterval = {...filteredIntervals[j], periodStart: '000000'}
                    if (isOverlapped(beforeMidNightInterval, filteredIntervals[i]) || isOverlapped(afterMidNightInterval, filteredIntervals[i])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置不能重复'
                        }
                    }
                }
                if (filteredIntervals[j].periodStart <= filteredIntervals[j].periodEnd
                    &&
                    filteredIntervals[i].periodStart > filteredIntervals[i].periodEnd
                ) { // i跨天 j非跨天
                    const beforeMidNightInterval = {...filteredIntervals[i], periodEnd: '235900'}
                    const afterMidNightInterval = {...filteredIntervals[i], periodStart: '000000'}
                    if (isOverlapped(beforeMidNightInterval, filteredIntervals[j]) || isOverlapped(afterMidNightInterval, filteredIntervals[j])) {
                        return {
                            hasError: true,
                            errorMessage: '时间段设置不能重复'
                        }
                    }
                }
            }
        }
    }
    return {
        hasError: false,
        errorMessage: ''
    }
}

class ExcludeDateTimeIntervals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxIntervals: 5,
            // excludeDateList: props.excludeDateList,
            intervals: Array.isArray(props.value) ? props.value : [{periodStart: '0101', periodEnd: '1231', activeType: '1'}],
        }
    }

    componentDidMount() {
        if (!Array.isArray(this.props.value)) {
            this.props.onChange([{periodStart: '0101', periodEnd: '1231', activeType: '1'}])
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
        const formattedString = moment ? moment.format('MMDD') : '';
        const { intervals: original } = this.state;
        const intervals = JSON.parse(JSON.stringify(original));
        intervals[index].activeType = 1;
        intervals[index].periodType = 0;
        if(key == "periodStart"){
            intervals[index][key] = formattedString;
        }
        if(key == "periodEnd"){
            intervals[index][key] = formattedString;
        }
        this.setState({ intervals }, () => {
            this.props.onChange(intervals)
        })
    }

    renderIntervalItem({periodStart, periodEnd}, index) {
        const { maxIntervals, intervals } = this.state;
        return (
            <div key={`${index}`} className={`${styles.excludeDateIntervalItem} ${styles.giftTimeIntervalItem}`}>
                <div className={styles.timePickerWrapper}>
                    <DatePicker
                        style={{ width: 120 }}
                        placeholder="起始时间"
                        getPopupContainer={(node) => node.parentNode}
                        size="large"
                        value={periodStart ? moment(periodStart, 'MMDD') : null}
                        hideDisabledOptions
                        format="MM-DD"
                        allowEmpty={false}
                        onChange={(moment) => this.handleTimeChange(moment, index, 'periodStart')}
                    />
                    --
                    <DatePicker
                        style={{ width: 120 }}
                        allowEmpty={false}
                        getPopupContainer={(node) => node.parentNode}
                        size="large"
                        format="MM-DD"
                        value={periodEnd ? moment(periodEnd, 'MMDD') : null}
                        hideDisabledOptions
                        placeholder="结束时间"
                        onChange={(moment) => this.handleTimeChange(moment, index, 'periodEnd')}
                    />
                </div>
                <div className={styles.tipBlock}>
                    {
                        ((!periodStart && !!periodEnd) || (!!periodStart && !periodEnd)) && (
                            <Tooltip title="不完整的时段不会被保存">
                                <Icon style={{ color: 'orange' }} type="exclamation-circle-o" />
                            </Tooltip>
                        )
                    }
                </div>
                <div style={{ paddingTop: 5,float:'left' }}>
                    {
                        (index === (intervals.length - 1) && intervals.length < maxIntervals) && (
                        !!periodStart && !!periodEnd ? (
                            <Icon
                                onClick={this.add}
                                style={{ marginRight: 10 }}
                                className={styles.plusIcon}
                                type="plus-circle-o"
                            />
                            ) : (
                            <Tooltip title="将时段补充完整才可继续添加">
                                <Icon
                                    style={{ marginRight: 10, cursor: 'not-allowed', color: 'gray' }}
                                    className={styles.plusIcon}
                                    type="plus-circle-o"
                                />
                            </Tooltip>
                        ))
                    }
                    {intervals.length > 1 && <Icon onClick={() => this.removeIndex(index)} className={styles.deleteIcon} type="minus-circle-o"/>}
                </div>
            </div>
        )
    }

    render() {
        const { intervals } = this.state;
        const errorEntity = getExcludeDateItervalsErrorStatus(intervals);
        return (
            <div className={styles.timeIntervalContainer}>
                {
                    intervals.map((item, index) => this.renderIntervalItem(item, index))
                }
                {
                    !!errorEntity.errorMessage && (
                        <div className={styles.timeIntervalHelp}>
                            {errorEntity.errorMessage}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default ExcludeDateTimeIntervals
