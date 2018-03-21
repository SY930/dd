/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-09T13:04:56+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: AdvancedDateSetting.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-31T17:51:08+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import React from 'react';
// import { connect } from 'react-redux';
import { Icon, TimePicker, Col, Form } from 'antd';
import styles from './SeniorDateSetting/styles.less';

// const FormItem = Form.Item;


// const uuid = 0;
const moment = require('moment');
const FormItem = Form.Item;

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
        if (this.props.onChange) {
            this.props.onChange({
                data: this.state.timeSlot,
                validateStatus: 'success',
            });
        }

        this.forceUpdate();
    }

    _add() {
        const length = this.state.timeSlot.length;
        if (length <= this.state.maxCount) {
            this.state.timeSlot.push({
                start: '',
                end: '',
            });
            if (this.props.onChange) {
                this.props.onChange({
                    data: this.state.timeSlot,
                    validateStatus: 'success',
                });
            }

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
            if (time) {
                if (!this.state.timeSlot[index].end || this.state.timeSlot[index].end.hour() <= this.state.timeSlot[index].start.hour()) {
                    this.state.timeSlot[index].end = time.clone().add(1, 'm'); // +1 minute
                }
            }
        }

        this.forceUpdate();

        if (this.props.onChange) {
            this.props.onChange({
                data: this.state.timeSlot,
                validateStatus: 'success',
            });
        }
    }


    componentDidMount() {
        let timeSlot = this.props.value;
        timeSlot = timeSlot.map((time) => {
            return {
                start: this.format(time.periodStart, 'HH:mm'),
                end: this.format(time.periodEnd, 'HH:mm'),
            }
        })
        this.setState({ timeSlot })
    }
    componentWillReceiveProps(nextProps) {
        // if(this.props.value, nextProps.value){

        // }
    }
    format(timeStr) {
        if (!timeStr) return ''
        if (timeStr.length === 3) return moment('0' + timeStr, 'HH:mm')
        if (timeStr.length === 4) return moment(timeStr, 'HH:mm')
    }

    getDisableHours(index, startOrEnd) {
        return range(0, this.state.timeSlot[index].start.hour() - 1)
    }

    getDisableMinutes(index, startOrEnd, hour) {
        if (hour == this.state.timeSlot[index].start.hour()) {
            return range(0, this.state.timeSlot[index].start.minute())
        }
    }

    renderAddButton(index) {

    }

    render() {
        const { errorIdxArr = [] } = this.props;
        const length = this.state.timeSlot.length;
        const format = 'HH:mm';
        const formItems = this.state.timeSlot.map((k, index) => {
            return (
                <div>
                    <Col span={7}>
                        <TimePicker
                            className={styles.timePicker}
                            format={format}
                            value={k.start}
                            onChange={(time, timeString) => this.onTimePickerChange(time, 0, index)}
                        />
                    </Col>
                    <Col span={2} offset={2} style={{ position: 'relative', left: -16 }}>--</Col>
                    <Col span={7}>
                        <TimePicker
                            format={format}
                            value={k.end}
                            onChange={(time, timeString) => this.onTimePickerChange(time, 1, index)}
                            disabledHours={() => { return this.getDisableHours(index, 1); }}
                            disabledMinutes={(h) => { return this.getDisableMinutes(index, 1, h); }}
                            disabled={!k.start}
                            className={styles.timePicker2}
                        />
                    </Col>
                    {
                        this.props.noPlusIcon ? null :
                            (<Col span={2} offset={2}>
                                {(index === length - 1 && index < this.state.maxCount - 1)
                                    ? (<Icon className={styles.pulsIcon} type="plus-circle-o" onClick={this.add} />) : (null)}
                            </Col>)
                    }

                    {
                        this.props.noPlusIcon ? null :
                            (<Col span={2}>
                                <Icon className={styles.deleteIcon} type="minus-circle-o" disabled={length === 1} onClick={() => this.remove(index)} />

                            </Col>)
                    }

                    {
                        errorIdxArr[index] === false ? (<p style={{ color: 'orange', display: 'inline-block' }}>和其它档位时间段重合</p>) : null
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

export const WrappedAdvancedTimeSetting = AdvancedTimeSetting;
