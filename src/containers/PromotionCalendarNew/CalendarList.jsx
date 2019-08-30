import React, { Component } from 'react';
import style from './style.less';
import moment from 'moment';
import {
    Popover,
} from 'antd';
import DetailCard from './DetailCard';
import CalendarModal from './CalendarModal';
import memoizeOne from 'memoize-one';

const isNameLengthLargerThanWidth = (item) => {
    const {
        left,
        right,
        eventName,
    } = item;
    const expectWidth = (12 * (eventName || '').length + 30);
    return {
        isOverflow: expectWidth > (right - left),
        expectWidth
    } 
}


const MONTH_FORMAT = 'YYYYMM';
const DAY_FORMAT = 'YYYYMMDD';
const DAY_LENGTH_IN_PX = 20;
let timer = 0;
class CalendarList extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            calendarModalVisible: false,
            /** 固定显示3个月的区间 */
            monthsCount: 3,
        }
        this.memoGetPromotionListPositionInfo = memoizeOne(this.getPromotionListPositionInfo);
        this.memoMap = {};
    }

    getMonthStr = () => {
        return `${moment().format('M')}月`
    }

    getIntervalInfo = () => {
        const { startMonth } = this.props;
        const { monthsCount } = this.state;
        if (this.memoMap[`${startMonth}${monthsCount}`]) {
            return this.memoMap[`${startMonth}${monthsCount}`]
        }
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
        const res = {
            monthsInfo,
            totalDaysCount,
        };
        this.memoMap[`${startMonth}${monthsCount}`] = res;
        return res;
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

    getPromotionListPositionInfo = (monthsInfo, totalDaysCount, list, startMonth) => {
        const startDate = `${startMonth}01`;
        const startMoment = moment(startDate, DAY_FORMAT);
        const endDate = `${monthsInfo[this.state.monthsCount - 1].monthMoment.format(MONTH_FORMAT)}${monthsInfo[this.state.monthsCount - 1].daysCount}`;
        const endMoment = moment(endDate, DAY_FORMAT);
        const today = moment().format(DAY_FORMAT);
        return list.map(item => {
            if (item.isCategoryPlaceHolder) return item;
            const { eventStartDate, eventEndDate } = item;
            /** 计算活动日期进度 */
            let process;
            if (eventStartDate == 20000101 && eventEndDate == 29991231) {
                process = '进行中';
            } else if (eventStartDate > today) {
                process = '0%';
            } else if (eventEndDate < today) {
                process = '100%';
            } else {
                const totalDuration = moment(`${eventEndDate}`, DAY_FORMAT).diff(moment(`${eventStartDate}`, DAY_FORMAT), 'days', true);
                const passedDuration = moment(today, DAY_FORMAT).diff(moment(`${eventStartDate}`, DAY_FORMAT), 'days', true);
                process = `${(100 * Math.ceil(passedDuration) / (Math.ceil(totalDuration) + 1)).toFixed(2)}%`
            }
            /** 计算活动起点位置 */
            let left;
            let isLeftOverflow;
            if (startDate > eventStartDate) {
                left = DAY_LENGTH_IN_PX;
                isLeftOverflow = true;
            } else if (startDate == eventStartDate) {
                left = DAY_LENGTH_IN_PX;
            } else {
                let daysFromStart = Math.ceil(moment(`${eventStartDate}`, DAY_FORMAT).diff(startMoment, 'days', true));
                left = 0;
                let i = 0;
                while (daysFromStart >= monthsInfo[i].daysCount) {
                    left += (monthsInfo[i].daysCount + 1) * DAY_LENGTH_IN_PX;
                    daysFromStart -= monthsInfo[i].daysCount;
                    i++;
                }
                left += (1 + daysFromStart) * DAY_LENGTH_IN_PX;
            }
            /** 计算活动终点位置 */
            let right;
            let isRightOverflow;
            if (eventEndDate >= endDate) {
                (eventEndDate > endDate) && (isRightOverflow = true);
                right = (totalDaysCount + monthsInfo.length) * DAY_LENGTH_IN_PX;
            } else {
                let daysFromStart = Math.ceil(moment(`${eventEndDate}`, DAY_FORMAT).diff(startMoment, 'days', true));
                right = 0;
                let i = 0;
                while (daysFromStart >= monthsInfo[i].daysCount) {
                    right += (monthsInfo[i].daysCount + 1) * DAY_LENGTH_IN_PX;
                    daysFromStart -= monthsInfo[i].daysCount;
                    i++;
                }
                right += (2 + daysFromStart) * DAY_LENGTH_IN_PX;
            }
            /** 计算活动条反色百分比 */
            // TODO: len 其实只用计算一次。。。
            let colorPercent;
            if (today > endDate) {
                colorPercent = '100%';
            } else if (today < startDate) {
                colorPercent = '0%';
            } else {
                let len;
                let daysFromStart = Math.ceil(moment(today, DAY_FORMAT).diff(startMoment, 'days', true));
                len = 0;
                let i = 0;
                while (daysFromStart >= monthsInfo[i].daysCount) {
                    len += (monthsInfo[i].daysCount + 1) * DAY_LENGTH_IN_PX;
                    daysFromStart -= monthsInfo[i].daysCount;
                    i++;
                }
                len += (1 + daysFromStart) * DAY_LENGTH_IN_PX;
                if (len >= right) {
                    colorPercent = '100%'
                } else if (len <= left) {
                    colorPercent = '0%'
                } else {
                    colorPercent = (100 * (len - left) / (right - left)).toFixed(2) + '%';
                }
            }
            return {
                ...item,
                left,
                right,
                isLeftOverflow,
                isRightOverflow,
                process,
                colorPercent,
            }
        })
    }


    render() {
        const { x, y, calendarModalVisible } = this.state;
        const { list, startMonth, onEditOrPreviewBtnClick } = this.props;
        const {
            monthsInfo,
            totalDaysCount,
        } = this.getIntervalInfo();
        const totalIntervalLength = DAY_LENGTH_IN_PX * (totalDaysCount + monthsInfo.length);
        return (
            <div className={style.calendarListWrapper}>
                {calendarModalVisible && (<CalendarModal onCancel={() => this.setState({ calendarModalVisible: false })} />)}
                <div className={style.buttonArea}>
                    <div onClick={() => this.setState({calendarModalVisible: true})} className={style.monthButton}>
                        {this.getMonthStr()}
                    </div>
                </div>
                <div className={style.menuWrapper}>
                    <div style={{ transform: `translateY(${-y}px)`}} className={style.menu}>
                        {
                            list.map(item => {
                                    return (
                                        <div
                                            className={item.isCategoryPlaceHolder ?
                                                style.categoryMenuItem : style.promotionMenuItem}
                                        >
                                            {item.title}
                                        </div>
                                    )
                            })
                        }
                    </div>
                </div>

                <div onScroll={this.handleCanlendarScroll} className={style.calendarMain}>
                    <div
                        className={style.canvas}
                        style={{
                            width: totalIntervalLength,
                        }}
                    >
                        {this.memoGetPromotionListPositionInfo(monthsInfo, totalDaysCount, list, startMonth)
                        .map(item => {
                            if (item.isCategoryPlaceHolder) {
                                return (<div className={style.categoryWrapper} />)
                            }
                            const {isOverflow: isNameOverflow, expectWidth} = isNameLengthLargerThanWidth(item);
                            return (
                                <div className={style.promotionWrapper}>
                                    <Popover
                                        content={<DetailCard onEditOrPreviewBtnClick={onEditOrPreviewBtnClick} data={item} />}
                                        title={false}
                                        trigger="click"
                                        placement="topLeft"
                                    >
                                        <div
                                            className={`${style.promotionBar} ${item.isLeftOverflow ? style.leftSquareBorder: ''} ${item.isRightOverflow ? style.rightSquareBorder: ''}`}
                                            style={{
                                                left: item.left,
                                                width: item.right - item.left,
                                                backgroundImage: `linear-gradient(to right, #379FF1 ${item.colorPercent}, #fff ${item.colorPercent})`
                                            }}
                                        >
                                            {
                                                isNameOverflow && item.left >= (totalIntervalLength - item.right) && (
                                                    <div style={{ width: expectWidth - 4, left: -expectWidth - 5 }} className={style.leftOverflowedName}>
                                                        {item.eventName}
                                                    </div>
                                                )
                                            }
                                            {
                                                isNameOverflow && item.left < (totalIntervalLength - item.right) && (
                                                    <div style={{ width: expectWidth - 4, right: -expectWidth - 5 }} className={style.rightOverflowedName}>
                                                        {item.eventName}
                                                    </div>
                                                )
                                            }
                                            <div
                                                className={style.textContent}
                                                style={{backgroundImage: `linear-gradient(to right, #fff ${item.colorPercent}, #666 ${item.colorPercent})`}}
                                            >
                                                {!isNameOverflow && item.eventName}
                                            </div>
                                        </div>
                                    </Popover>
                                    
                                </div>
                            )
                        })}
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
                                    <div className={style.monthLabel}>{monthInfo.monthDisplayStr}</div>
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
