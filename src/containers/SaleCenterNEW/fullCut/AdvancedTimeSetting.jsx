/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-02-09T13:04:56+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: AdvancedDateSetting.jsx
* @Last modified by:   xf
* @Last modified time: 2017-02-09T13:17:33+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import { Form, Input, Icon, Button, TimePicker } from 'antd';
import React from 'react';
import styles from './styles.less';

const FormItem = Form.Item;
import { fullCutSetTimeSlotAC } from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import { connect } from 'react-redux';
import Immutable from 'immutable';


// used to identify the FormItem
let uuid = 0;

// generate the time range
function range(start, end) {
    return Array(end - start + 1).fill(0).map((value, idx) => {
        return idx + start;
    })
}

class AdvancedTimeSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeSlot: [],
        };

        this.handleSubmit = this._handleSubmit.bind(this);
        this.remove = this._remove.bind(this);
        this.add = this._add.bind(this);
        this.onTimePickerChange = this._onTimePickerChange.bind(this);
    }

    _remove(k) {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');

        if (keys.length === 1) {
            return
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key != k),
        });
    }

    _add(k) {
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');

        // notify form to detect change
        form.setFieldsValue({
            keys: keys.concat(uuid),
        })
    }


    _handleSubmit(e) {
        e.preventDefault();
    // this.props.form.validateFields()
    }

    // time, timeString, index
    _onTimePickerChange(time, startOrEnd, index) {
    // set the start timeStamp
        (this.state.timeSlot[index] == undefined) && (this.state.timeSlot[index] = {
            start: {},
            end: {},
        });

        startOrEnd || (this.state.timeSlot[index].start = {
            hour: time.hour(),
            minute: time.minute(),
        });

        // set the end timeStamp
        startOrEnd && (this.state.timeSlot[index].end = {
            hour: time.hour(),
            minute: time.minute(),
        });

        this.props.setTimeSlot(Immutable.fromJS(this.state.timeSlot));
    }


    componentDidMount() {
        this.props.form.setFieldsValue(
            {
                keys: [0],
            }
        )
    }

    getDisableHours(index, startOrEnd) {
        if (index == 0) { // 第一个时间段
            if (startOrEnd) {
                return range(0, this.state.timeSlot[index].start.hour - 1)
            }
            return []
        }
        if (startOrEnd) {
            return range(0, this.state.timeSlot[index].start.hour - 1)
        }
        return range(0, this.state.timeSlot[index - 1].end.hour - 1)
    }

    getDisableMinutes(index, startOrEnd, hour) {
    // first timeSlot
        if (index == 0) {
            if (startOrEnd) {
                // return range(0, this.state.timeSlot[index].start.hour-1)
                if (this.state.timeSlot[index].start.hour == hour) { return range(0, this.state.timeSlot[index].start.minute); }
            } else {
                return []
            }
        } else if (startOrEnd) {
            if (hour == this.state.timeSlot[index].start.hour) { return range(0, this.state.timeSlot[index].start.minute) }
        } else if (hour == this.state.timeSlot[index - 1].end.hour) {
            return range(0, this.state.timeSlot[index - 1].end.minute)
        }
    }

    renderAddButton(index) {

    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        //
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 24, offset: 4 },
        };

        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');

        const length = keys.length;

        const config = {
            rules: [{ type: 'object', required: true, message: '请选择时间！' }],
        };
        const format = 'HH:mm';

        const formItems = keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    key={k}
                >
                    <TimePicker
                        className={styles.timePicker}
                        format={format}
                        onChange={(time, timeString) => this.onTimePickerChange(time, 0, index)}
                        disabledHours={() => { return this.getDisableHours(index, 0) }}
                        disabledMinutes={(h) => { return this.getDisableMinutes(index, 0, h) }}
                    />
                    <span className={styles.timePickerZj}>--</span>
                    <TimePicker
                        format={format}
                        onChange={(time, timeString) => this.onTimePickerChange(time, 1, index)}
                        disabledHours={() => { return this.getDisableHours(index, 1) }}
                        disabledMinutes={(h) => { return this.getDisableMinutes(index, 1, h) }}
                        className={styles.timePicker2}
                    />


                    {(index == length - 1) ? (<Icon className={styles.pulsIcon} type="plus-circle-o" onClick={this.add} />) : (null)}

                    <Icon className={styles.deleteIcon} type="minus-circle-o" disabled={keys.length === 1} onClick={() => this.remove(k)} />
                </FormItem>
            )
        });

        return (
            <div className={[styles.advancedTimeSetting, 'clearfix'].join(' ')}>
                <Form
                    onSubmit={this.handleSubmit}
                >
                    <div className={styles.timeSettingTitle}>活动时段</div>
                    <div className={styles.timeSettingCentent}>
                        {formItems}
                    </div>
                </Form>
            </div>
        )
    }
}

/** If the form has been decorated by Form.create then it has this.props.form property.
  *this.props.form provides some APIs as follows
* @fields {getFieldsValue} Get the specified fields' values. If you don't specify a parameter, you will get all fields' values.
* @fields {getFieldValue} Get the value of a field
*/

const mapStateToProps = (state) => {
    return {
        fullCut: state.fullCut_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setTimeSlot: (opts) => {
            dispatch(fullCutSetTimeSlotAC(opts))
        },
    }
};

export const WrappedAdvancedTimeSetting = connect(mapStateToProps, mapDispatchToProps)(Form.create()(AdvancedTimeSetting));
