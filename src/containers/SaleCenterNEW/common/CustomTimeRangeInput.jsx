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
import {
    TimePicker, Input, Button, Col, Row, InputNumber, Icon,
} from 'antd';
import styles from '../ActivityPage.less';
const moment = require('moment');

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
        const {type} = this.props;
        let start = value;
        if (start !== null && start !== undefined) {
            let startString = start.format('YYYYMMDDHHmm');
            let startMM = start.format('mm');
            if(type != '1010'){
                if (startMM < 30) {
                    startString = startString.slice(0, 10) + '00'
                } else {
                    startString = startString.slice(0, 10) + '30'
                }
            }
            start = moment(startString, 'YYYYMMDDHHmm')
        }

        this.setState({
            start,
        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange({
                start,
                // end,
            });
        }
    }

    onEndChange(value) {
        let end = value;
        const {type} = this.props;
        if (end !== null && end !== undefined) {
            let start = this.state.start;
            // 最小限度修复结束时间能选到比开始时间早的bug
            if (start.format('HH') > end.format('HH')) {
                end.set('hour', start.format('HH'))
            }
            let endString = end.format('YYYYMMDDHHmm');
            let startMM = start.format('mm');
            let endMM = end.format('mm');
            if(type != '1010' ){//不是特价菜
                if (start.format('HH') == end.format('HH') && startMM == '30') {
                    endString = endString.slice(0, 10) + '59';
                } else {
                    endMM = endMM <= 29 ? '29' : '59';
                    endString = endString.slice(0, 10) + endMM;
                }
            }
            end = moment(endString, 'YYYYMMDDHHmm')
        }
        this.setState({
            end,
        });

        const onChange = this.props.onChange;
        //
        if (onChange) {
            onChange({
                start: this.state.start,
                end,
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
    getMinutesWithSpace(space,type,h){
        let minutesArr = [];
        let usedArr = [];
        let len = Math.floor(60/Number(space));
        for(let i = 0;i < 60;i++){
            minutesArr.push(i)
        }
        if(type == '0'){
            for(let j = 0;j<len;j++){
                usedArr.push(space * j)
            }
        }else{
            for(let j = 0;j<60;j++){
                if(j % 10 == '4' || j % 10 == '9'){
                    if(h == this.state.start.hour()){//当前小时下，截止分钟数应大于起始分钟数
                        if(j > this.state.start.minute()){
                            usedArr.push(j)
                        }
                    }else{
                        usedArr.push(j)
                    }
                }
            }
        }
        let diabledArr = minutesArr.filter(item => !usedArr.includes(item))
        return diabledArr
    }
    render() {
        const _end = !this.state.start ? null : this.state.end;
        const {type} = this.props;
        return (
            <Row className={styles.rightInput}>
                <Col span={10}>
                    <TimePicker
                        size="default"
                        onChange={this.onStartChange}
                        value={this.state.start}
                        format={this.state.format}
                        disabledMinutes={(h) => {
                                if(type == '1010'){
                                    return this.getMinutesWithSpace(5,'0')//5分钟时间间隔
                                }else{
                                    return range(1, 30).concat(range(31, 60))
                                }
                            }
                        }
                        hideDisabledOptions
                    // minuteStep={30}
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
                        // disabledMinutes={(h) => { return this.getDisableMinutes(h); }}
                        disabledMinutes={
                            (h) => {
                                if(type == '1010'){
                                    return this.getMinutesWithSpace(5,'1',h)
                                }else{
                                    return range(0, 29).concat(range(30, 59))
                                }
                            }
                        }
                        hideDisabledOptions
                    />
                </Col>
            </Row>
        );
    }
}

export default CustomTimeRangeInput;
