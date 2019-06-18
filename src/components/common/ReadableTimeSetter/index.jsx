import React, { Component } from 'react';
import {
    InputNumber,
} from 'antd';
import style from './style.less'

class ReadableTimeSetter extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleDayChange = (v) => {
        console.log('v', v)
    }
    handleHourChange = (v) => {
        console.log('v', v)
    }
    handleMinuteChange = (v) => {
        console.log('v', v)
    }

    render() {
        const {
            placeholder = '请设置时间',
            disabled,
            limitDays = 1,
        } = this.props;
        return (
            <div className={style.wrapper}>
                <InputNumber min={0} max={limitDays - 1}  onChange={this.handleDayChange} />日
                <InputNumber min={0} max={23}  onChange={this.handleHourChange} />时
                <InputNumber min={0} max={59} onChange={this.handleMinuteChange} />分
            </div>
        )
    }

}

export default ReadableTimeSetter;
