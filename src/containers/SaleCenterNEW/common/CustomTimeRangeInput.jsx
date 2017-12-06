/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-16T17:54:18+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: CustomTimeRangeInput.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-16T19:38:08+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { PropTypes } from 'react';
import { TimePicker, Input, Button, Col, Row, InputNumber, Icon,
} from 'antd';
import styles from '../ActivityPage.less';

function range(start, end) {
    return Array(end - start).fill(0).map((value, idx) => {
        return idx + start;
    });
}

class CustomTimeRangeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            divider: '--',
            start: undefined,
            end: undefined,
            format: 'HH:mm',
        };

        this.onStartChange = this.onStartChange.bind(this);
        this.onEndChange = this.onEndChange.bind(this);
    }

    componentDidMount() {
        const _value = this.props.value;
        this.setState({
            start: _value.start,
            end: _value.end,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            start: nextProps.value.start,
            end: nextProps.value.end,
        });
    }

    onStartChange(value) {
        const start = value;
        let end = this.state.end;
        if (value > end || value === null || end === undefined) {
            end = value;
        }
        this.setState({
            end,
            start,

        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange({
                start: value,
                end,
            });
        }
    }

    onEndChange(value) {
        this.setState({
            end: value,
        });

        const onChange = this.props.onChange;
        //
        if (onChange) {
            onChange({
                start: this.state.start,
                end: value,
            });
        }
    }

    getDisableHours() {
        if (this.state.start) {
            return range(0, this.state.start.hour());
        }
        return [];
    }

    getDisableMinutes(h) {
        if (this.state.start) {
            if (h == this.state.start.hour()) {
                return range(0, this.state.start.minute());
            }
            return [];
        }
    }

    render() {
        const _end = !this.state.start ? null : this.state.end;
        return (
            <Row className={styles.rightInput}>
                <Col span={10}>
                    <TimePicker
                        size="default"
                        onChange={this.onStartChange}
                        value={this.state.start}
                        format={this.state.format}
                    />
                </Col>

                <Col span={4}>
                    <div>{this.state.divider}</div>
                </Col>

                <Col span={10}>
                    <TimePicker
                        size="ldefaultarge"
                        onChange={this.onEndChange}
                        value={this.state.end}
                        disabled={!this.state.start}
                        format={this.state.format}
                        disabledHours={() => { return this.getDisableHours(); }}
                        disabledMinutes={(h) => { return this.getDisableMinutes(h); }}
                    />
                </Col>
            </Row>
        );
    }
}

export default CustomTimeRangeInput;
