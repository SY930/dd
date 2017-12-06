/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-02-07T14:14:49+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: index.jsx
* @Last modified by:   xf
* @Last modified time: 2017-02-08T14:37:00+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

// Add or remove form items dynamically.

import { Form, Input, Icon, Button, TimePicker } from 'antd';
import React from 'react';

require('./dynamicForm.less');

const FormItem = Form.Item;


// used to identify the FormItem
let uuid = 0;

// generate the time range
function range(start, end) {
    return Array(end - start + 1).fill(0).map((value, idx) => {
        return idx + start;
    })
}

class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeSlot: [],
        }

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


    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        //
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 20, offset: 4 },
        };

        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');

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
                    <div>{`区间 ${index + 1}`}</div>
                    <TimePicker
                        format={format}
                        onChange={(time, timeString) => this.onTimePickerChange(time, 0, index)}
                        disabledHours={() => { return this.getDisableHours(index, 0) }}
                        disabledMinutes={(h) => { return this.getDisableMinutes(index, 0, h) }}
                    />
                    <TimePicker
                        format={format}
                        onChange={(time, timeString) => this.onTimePickerChange(time, 1, index)}
                        disabledHours={() => { return this.getDisableHours(index, 1) }}
                        disabledMinutes={(h) => { return this.getDisableMinutes(index, 1, h) }}
                    />
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                </FormItem>
            )
        });

        return (
            <Form
                onSubmit={this.handleSubmit}
            >
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加时间设置
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

/** If the form has been deocrated by Form.create then it has this.props.form property.
  *this.props.form provides some APIs as follows
* @fields {getFieldsValue} Get the specified fields' values. If you don't specify a parameter, you will get all fields' values.
* @fields {getFieldValue} Get the value of a field
*/

export const WrapperDynamicFieldSet = Form.create()(DynamicFieldSet);
