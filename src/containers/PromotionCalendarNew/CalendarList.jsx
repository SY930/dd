import React, { Component } from 'react';
import style from './style.less';
import moment from 'moment';

const MONTH_FORMAT = 'YYYYMM';
const DAY_FORMAT = 'YYYYMMDD';
const DAY_LENGTH_IN_PX = 20;
class CalendarList extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            /** 固定显示3个月的区间 */
            monthsCount: 3,
        }
    }

    getMonthStr = () => {
        return `${moment().format('M')}月`
    }

    getIntervalInfo = () => {
        const { startMonth } = this.props;
        const { monthsCount } = this.state;
        const monthsInfo = [];
        let totalDaysCount = 0;
        for (let i = 0; i < monthsCount; i ++) {
            const monthMoment = moment(startMonth, MONTH_FORMAT).add(i, 'M');
            const monthDisplayStr = monthMoment.format('YYYY年MM月');
            const daysCount = monthMoment.daysInMonth();
            totalDaysCount += daysCount;
            monthsInfo.push({
                monthMoment,
                monthDisplayStr,
                daysCount,
            })
        }
        return {
            monthsInfo,
            totalDaysCount,
        };
    }


    handleCanlendarScroll = (e) => {
        const {
            scrollTop,
            scrollLeft,
        } = e.target;
        this.setState({
            x: scrollLeft,
            y: scrollTop,
        })
    }

    render() {
        const { x, y } = this.state;
        const {
            monthsInfo,
            totalDaysCount,
        } = this.getIntervalInfo();
        const totalIntervalLength = DAY_LENGTH_IN_PX * (totalDaysCount + monthsInfo.length);
        return (
            <div className={style.calendarListWrapper}>
                <div className={style.buttonArea}>
                    <div className={style.monthButton}>
                        {this.getMonthStr()}
                    </div>
                </div>
                <div className={style.menuWrapper}>
                    <div style={{ transform: `translateY(${-y}px)`}} className={style.menu}>
                    
                    </div>
                </div>

                <div onScroll={this.handleCanlendarScroll} className={style.calendarMain}>
                    <div
                        className={style.canvas}
                        style={{
                            width: totalIntervalLength,
                        }}
                    >
                    </div>
                </div>
                <div className={style.timelineWrapper}>
                    <div
                        style={{
                            transform: `translateX(${-x}px)`,
                            width: totalIntervalLength,
                        }}
                        className={style.timeline}
                    >
                        {
                            monthsInfo.map(monthInfo => (
                                <div
                                    className={style.monthBlock}
                                    style={{ width: (monthInfo.daysCount + 1) * DAY_LENGTH_IN_PX }}
                                >
                                    {monthInfo.monthDisplayStr}
                                    {
                                        new Array(monthInfo.daysCount).fill(0).map((_, index, arr) => {
                                            const isToday = moment().format(DAY_FORMAT) ===
                                                monthInfo.monthMoment.set('date', index + 1).format(DAY_FORMAT);
                                            return (
                                                <div
                                                    key={`${index}`}
                                                    className={style.dayMark}
                                                    style={{
                                                        width: (index + 1) % 5 === 0 ? 10 : 6,
                                                        height: (index + 1) % 5 === 0 ? 10 : 6,
                                                        left: (index + 1) * DAY_LENGTH_IN_PX,
                                                        background: isToday ? '#379FF1' : '#C2C2C2'
                                                    }}
                                                >
                                                    {isToday && <div className={style.todayTag}>{index + 1}</div>}
                                                    {isToday && <div className={style.todayLine}></div>}
                                                    {index === 0 && <div className={style.startOfMonthLine}></div>}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

CalendarList.defaultProps = {
    startMonth: '201908',
};

export default CalendarList;
