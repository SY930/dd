import React, { Component } from 'react'
import {
    Modal,
    Button,
} from 'antd';
import moment from 'moment';
import { axiosData } from '../../helpers/util'
import Calendar from 'rc-calendar'
import style from './style.less';
import solarLunar from 'solarlunar'

const disabledDate = current => {
    const yearDiff = moment(moment().format('YYYY0101'), 'YYYYMMDD')
        .diff(moment(current.format('YYYY0101'), 'YYYYMMDD'), 'years', true);
    return Math.abs(yearDiff) > 1;
}

export default class CalendarModal extends Component {

    constructor() {
        super();
        this.state = {
            selectedMoment: moment(),
            festivalList: [],
        }
    }
    queryFestivalInfo = (monthStr) => {
        this.setState({
            lastQueryMonth: monthStr,
        })
        axiosData(
            '/calendar/eventCalendarService_queryCalendarInfo.ajax',
            { startDate: monthStr + '01' },
            { needThrow: true },
            { path: 'festivalList' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((festivalList) => {
            if (monthStr === this.state.lastQueryMonth) {
                this.setState({   
                    festivalList: Array.isArray(festivalList) ? festivalList : [],
                })
            }
        })
    }

    componentDidMount() {
        this.queryFestivalInfo(moment().format('YYYYMM'))
    }

    handleCalendarChange = (v) => {
        const monthStr = v.format('YYYYMM');
        if (monthStr !== this.state.lastQueryMonth) {
            this.setState({
                festivalList: [],
                lastQueryMonth: monthStr,
            });
            this.queryFestivalInfo(monthStr);
        }
        this.setState({
            selectedMoment: v,
        })
    }
    getProcessedFestivalInfo = (list) => {
        const specialDays = [];
        const festivalMap = {};
        list.forEach(item => {
            (item.dateList || []).forEach(day => {
                specialDays.push(`${day}`);
                festivalMap[`${day}`] = {
                    festivalName: item.festivalName,
                    festivalDescription: item.festivalDescription,
                }
            })
        })
        return {
            specialDays,
            festivalMap,
        }
    }

    renderCalendar() {
        const { selectedMoment, festivalList } = this.state;
        const selectedDateStr = selectedMoment.format('YYYYMMDD');
        const { specialDays, festivalMap } = this.getProcessedFestivalInfo(festivalList);
        const lunarInfo = solarLunar.solar2lunar(...selectedMoment.format('YYYY,MM,DD').split(',').map(v => +v))
        return (
            <div className={style.calendarWrapper}>
                <div className={style.dayDetail}>
                    <div style={{ width: 260 }}>
                        <div className={style.dateNumber}>
                            {selectedMoment.format('DD')}
                        </div>
                        <div className={style.lunarInfo}>
                            {lunarInfo.monthCn + lunarInfo.dayCn}
                        </div>
                        {
                            !!festivalMap[selectedDateStr] && (
                                <div className={style.festivalTitle}>
                                    {festivalMap[selectedDateStr].festivalName}
                                </div>
                            )
                        }
                        {
                            !!festivalMap[selectedDateStr] && (
                                <div className={style.festivalDesc}>
                                    {festivalMap[selectedDateStr].festivalDescription}
                                </div>
                            )
                        }
                    </div>

                </div>
                <div style={{ padding: 20 }}>
                    <Calendar
                        dateRender={(current, value) => (
                            <div className="rc-calendar-date">
                                {current.format('DD')}
                                {specialDays.includes(current.format('YYYYMMDD')) && <div className={style.redSpot}></div>}
                            </div>
                        )}
                        value={selectedMoment}
                        onChange={this.handleCalendarChange}
                        disabledDate={disabledDate}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { onCancel } = this.props;
        return (
            <Modal
                onCancel={onCancel}
                title="日历"
                width={920}
                visible={true}
                footer={[<Button type="ghost" onClick={onCancel}>关闭</Button>]}
            >
                {this.renderCalendar()}
            </Modal>
        )
    }
}
