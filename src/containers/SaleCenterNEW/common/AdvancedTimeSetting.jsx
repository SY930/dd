/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-09T13:04:56+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: AdvancedDateSetting.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-31T17:51:08+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import { Form, Input, Icon, Button, TimePicker, Col } from 'antd';
import React from 'react';
import styles from './SeniorDateSetting/styles.less';

const FormItem = Form.Item;
import { connect } from 'react-redux';


const uuid = 0;
const moment = require('moment');

// generate the time range
function range(start, end) {
    return Array(end - start + 1).fill(0).map((value, idx) => {
        return idx + start;
    });
}

class AdvancedTimeSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeSlot: [{
                start: moment('00:00', 'HH:mm'),
                end: moment('00:00', 'HH:mm'),
            }],
            maxCount: this.props.count || 3, // default is 3
        };

        this.remove = this._remove.bind(this);
        this.add = this._add.bind(this);
        this.onTimePickerChange = this._onTimePickerChange.bind(this);
    }

    _remove(index) {
        if (this.state.timeSlot.length === 1) {
            return null;
        }

        this.state.timeSlot.splice(index, 1);

        this.forceUpdate();
    }

    _add() {
        const length = this.state.timeSlot.length;
        if (length <= this.state.maxCount) {
            this.state.timeSlot.push({
                start: moment('00:00', 'HH:mm'),
                end: moment('00:00', 'HH:mm'),
            });

            this.forceUpdate();
        }
    }

    // time, timeString, index
    _onTimePickerChange(time, startOrEnd, index) {
        // set the start timeStamp
        if (this.state.timeSlot[index] === undefined) {
            this.state.timeSlot[index] = {
                start: {},
                end: {},
            };
        }

        if (startOrEnd) {
            this.state.timeSlot[index].end = time;
        } else {
            this.state.timeSlot[index].start = time;
        }

        this.forceUpdate();

        const _validate = this.state.timeSlot.reduce((preStatus, timeArr) => {
            const _status = timeArr.start.isBefore(timeArr.end);
            return preStatus && _status;
        }, true);

        if (this.props.onChange) {
            this.props.onChange({
                data: this.state.timeSlot,
                validateStatus: _validate ? 'success' : 'error',
            });
        }
    }


    componentDidMount() {

    }

    getDisableHours(index, startOrEnd) {
        return [];
        // if(index == 0) {          // 第一个时间段
        //     if(startOrEnd){
        //         return range(0, this.state.timeSlot[index].start.hour()-1)
        //     } else {
        //         return []
        //     }
        // } else {
        //     if(startOrEnd){
        //         return range(0, this.state.timeSlot[index].start.hour()-1)
        //     } else {
        //         return range(0, this.state.timeSlot[index-1].end.hour()-1)
        //     }
        // }
    }

    getDisableMinutes(index, startOrEnd, hour) {
        return [];
        // first timeSlot
        // if(index == 0) {
        //     if(startOrEnd){
        //         // return range(0, this.state.timeSlot[index].start.hour-1)
        //         if (this.state.timeSlot[index].start.hour() == hour)
        //             return range(0, this.state.timeSlot[index].start.minute());
        //     } else {
        //         return []
        //     }
        // } else {
        //     if(startOrEnd){
        //         if (hour == this.state.timeSlot[index].start.hour())
        //             return range(0, this.state.timeSlot[index].start.minute())
        //     } else {
        //         if (hour == this.state.timeSlot[index-1].end.hour()){
        //             return range(0, this.state.timeSlot[index-1].end.minute())
        //         }
        //     }
        // }
    }

    renderAddButton(index) {

    }

    render() {
        const length = this.state.timeSlot.length;
        const format = 'HH:mm';
        const formItems = this.state.timeSlot.map((k, index) => {
            return (
                <div>
                    <Col span={6}>
                        <TimePicker
                            className={styles.timePicker}
                            format={format}
                            value={this.state.timeSlot[index].start}
                            onChange={(time, timeString) => this.onTimePickerChange(time, 0, index)}
                            disabledHours={() => { return this.getDisableHours(index, 0); }}
                            disabledMinutes={(h) => { return this.getDisableMinutes(index, 0, h); }}
                        />
                    </Col>
                    <Col span={2} offset={2}>--</Col>
                    <Col span={6}>
                        <TimePicker
                            format={format}
                            value={this.state.timeSlot[index].end}
                            onChange={(time, timeString) => this.onTimePickerChange(time, 1, index)}
                            disabledHours={() => { return this.getDisableHours(index, 1); }}
                            disabledMinutes={(h) => { return this.getDisableMinutes(index, 1, h); }}
                            className={styles.timePicker2}
                        />
                    </Col>
                    {
                        this.props.noPlusIcon ? null :
                            (<Col span={2} offset={2}>
                                {(index == length - 1 && index < this.state.maxCount - 1)
                                    ? (<Icon className={styles.pulsIcon} type="plus-circle-o" onClick={this.add} />) : (null)}
                            </Col>)
                    }

                    {
                        this.props.noPlusIcon ? null :
                            (<Col span={2}>
                                <Icon className={styles.deleteIcon} type="minus-circle-o" disabled={length == 1} onClick={() => this.remove(index)} />

                            </Col>)
                    }
                </div>
            );
        });

        return (
            <div className={[styles.advancedTimeSetting, 'clearfix'].join(' ')}>
                {formItems}
            </div>
        );
    }
}

/** If the form has been decorated by Form.create then it has this.props.form property.
 *this.props.form provides some APIs as follows
 * @fields {getFieldsValue} Get the specified fields' values. If you don't specify a parameter, you will get all fields' values.
 * @fields {getFieldValue} Get the value of a field
 */


export const WrappedAdvancedTimeSetting = AdvancedTimeSetting;
