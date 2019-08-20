import React, { Component } from 'react';
import style from './style.less';
import moment from 'moment';

export default class CalendarList extends Component {

    getMonthStr = () => {
        return `${moment().format('M')}月`
    }

    render() {
        return (
            <div className={style.calendarListWrapper}>
                <div className={style.buttonArea}>
                    <div className={style.monthButton}>
                        {this.getMonthStr()}
                    </div>
                </div>

                <div className={style.calendarMain}>

                </div>
            </div>
        )
    }
}
