import React from 'react';
import { connect } from 'react-redux';
import {
    Input
} from 'antd';
import styles from './style.less';

export default class DayHourMinPicker extends React.Component {
    constructor(props) {
        super(props)
        const value = this.props.value || {}
        this.state = {
            day: value.day,
            hour: value.hour,
            min: value.min,
        }
    }

    handleDayChange = (e) => {
        const newDay = e.target.value
        this.setState({
            day: newDay,
        })
        this.props.onChange && this.props.onChange({ ...this.state, day: newDay })
    }

    handleHourChange = (e) => {
        const newHour = e.target.value
        this.setState({
            hour: newHour,
        })
        this.props.onChange && this.props.onChange({ ...this.state, hour: newHour })
    }

    handleMinChange = (e) => {
        const newMin = e.target.value
        this.setState({
            min: newMin,
        })
        this.props.onChange && this.props.onChange({ ...this.state, min: newMin })
    }
    render() {
        const {
            day,
            hour,
            min,
        } = this.state
        return (
            <span>
                <Input type="number" className={styles.pickerInput} min={0} step={1} value={day} onChange={this.handleDayChange}></Input>
                <span className={styles.pickerSpan}>日</span>
                <Input type="number" className={styles.pickerInput} min={0} max={60} step={1} value={hour} onChange={this.handleHourChange}></Input>
                <span className={styles.pickerSpan}>时</span>
                <Input type="number" className={styles.pickerInput} min={0} max={60} value={min} onChange={this.handleMinChange}></Input>
                <span className={styles.pickerSpan}>分</span>
            </span>
        )
    }
}