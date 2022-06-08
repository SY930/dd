import React, {Component} from 'react';
import {
    TimePicker,
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

export const getItervalsErrorStatus = (intervals) => {
    const filteredIntervals = (intervals || []).filter(({periodStart, periodEnd}) => !!periodStart && !!periodEnd);
    if (!filteredIntervals.length) {
        return {
            hasError: true,
            errorMessage: '至少要设置一个完整时间段'
        }
    }

    if (filteredIntervals.length > 1) {
        for (let i = 0; i < (filteredIntervals.length - 1); i += 1) {
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

class GiftTimeIntervals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxIntervals: 5,
            crossDay:props.crossDay,
            intervals: Array.isArray(props.value) ? props.value : [{periodStart: '000000', periodEnd: '235900'}],
        }
    }

    componentDidMount() {
        if (!Array.isArray(this.props.value)) {
            this.props.onChange([{periodStart: '000000', periodEnd: '235900'}])
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Array.isArray(nextProps.value)) {
            this.setState({
                intervals: nextProps.value,
                // crossDay: nextProps.crossDay
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
        const { intervals: original,crossDay } = this.state;
        console.log(crossDay,'crossday------123')
        const intervals = JSON.parse(JSON.stringify(original));
        intervals[index][key] = formattedString;
        this.setState({ intervals }, () => {
            this.props.onChange(intervals)
        })
    }
    handleCrossDayChange = (e) => {
        const { checked } = e.target;
        const crossDay = checked ? 1 : 0;
        console.log(crossDay,'crossDay-------')
        this.setState({crossDay},() => {
            this.props.handleCrossDayChange(crossDay)
        })
        console.log(e,crossDay,'value00000000000')
    }
    renderIntervalItem({periodStart, periodEnd}, index) {
        const { maxIntervals, intervals, crossDay } = this.state;
        console.log(crossDay,'crossdataysdfdyyyyy')
        return (
            <div key={`${index}`} className={styles.giftTimeIntervalItem}>
                <div className={styles.timePickerWrapper}>
                    <TimePicker
                        style={{ width: 120 }}
                        placeholder="起始时间"
                        getPopupContainer={(node) => node.parentNode}
                        size="large"
                        value={periodStart ? moment(periodStart, 'HHmmss') : null}
                        hideDisabledOptions
                        format="HH:mm"
                        allowEmpty={false}
                        onChange={(moment) => this.handleTimeChange(moment, index, 'periodStart')}
                    />
                    --
                    <TimePicker
                        style={{ width: 120 }}
                        allowEmpty={false}
                        getPopupContainer={(node) => node.parentNode}
                        size="large"
                        format="HH:mm"
                        value={periodEnd ? moment(periodEnd, 'HHmmss') : null}
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
                    {
                        (!!periodStart && !!periodEnd && (periodEnd < periodStart)) && (
                            <Tooltip title="跨天时段">
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
                {
                    (!!periodStart && !!periodEnd && (periodEnd < periodStart)) && (
                        <div style={{width:'350px',float:'left',marginLeft:'10px'}}>
                            <span style={{marginRight:'10px'}}>将跨天时段00:00 - {(periodEnd || '').substring(0, 4).match(/\d{2}/g).join(':')}</span>
                            <Checkbox onChange={this.handleCrossDayChange} checked={this.state.crossDay === 1 ? true : false}>配置为次日可用时段</Checkbox>
                            <Tooltip title={
                                <p style={{fontSize:'12px', width:700}}>
                                    <b>配置为次日可用时段的定义：</b><br/>
                                    &nbsp;&nbsp;配置适用时段，起止时间跨00:00时，如果勾选【配置为次日使用】时段，则00:00至截止时间的时段，计算为次日可用时段。<br/>
                                    &nbsp;&nbsp;配置适用时段，起止时间跨00:00时，如果未勾选【配置为次日使用】时段，则00:00至截止时间的时段，计算为当日可用时段。<br/>
                                    <b>举例说明：</b><br/>
                                    ·&nbsp;&nbsp;勾选【配置为次日可用】：需要券可核销时间为当日的22:00开始至次日的05:00之间，可配置【使用时段】为22:00-05:00，勾选【配置为次日可用】后，保存成功，则券的可核销时间为当日的22:00开始至次日的05:00之间。<br/>
                                    ·&nbsp;&nbsp;未勾选【配置为次日可用】：需要券可核销时间为当日的00:00-05:00和当日22:00-23:59:59之间，可配置【使用时段】为22:00- &nbsp;&nbsp;05:00，不勾选【配置为次日可用】后，保存成功，则券的可核销时间为当日的00:00-05:00和当日22:00-23:59:59之间。<br/>
                                </p>
                            }>
                                <Icon style={{ color: '#333' }} type="question-circle-o" />
                            </Tooltip>
                        </div>
                    )
                }
            </div>
        )
    }

    render() {
        const { intervals } = this.state;
        const errorEntity = getItervalsErrorStatus(intervals)
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

export default GiftTimeIntervals
