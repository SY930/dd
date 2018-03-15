/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-01-23T13:49:32+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: SeniorDateSetting.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-14T13:42:04+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import React from 'react';
import { Checkbox, Select } from 'antd';
const Option = Select.Option;

import { WrappedAdvancedTimeSetting } from '../../../../SaleCenterNEW/common/AdvancedTimeSetting';
import styles from './styles.less';
import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import {
    CYCLE_TYPE,
    FULL_CUT_ACTIVITY_CYCLE_TYPE,
} from '../../../../../redux/actions/saleCenterNEW/types';


const CheckboxGroup = Checkbox.Group;
const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;


class SeniorDateSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeSlot: [],
            activityCycle: {
                type: '0',
                selectValue: ['1'],
            },
        };
        this.onChange = this._onChange.bind(this);
    }

    componentDidMount() {

    }

    _onChange(checkedValues) {
        this.setState({
            activityCycle: {
                type: this.state.activityCycle.type,
                selectValue: checkedValues,
            },
        }, () => {
            this.props.onChange && this.props.onChange(this.state)
        });
    }

    getTimeSLot(timeSlot) {
        this.setState({
            timeSlot,
        }, () => {
            this.props.onChange && this.props.onChange(this.state)
        });
    }

    setPromotionCycle(value) {
        this.setState(value, () => {
            this.props.onChange && this.props.onChange(this.state)
        });
    }

    render() {
        return (
            <div className={styles.SeniorDateMain}>
                <Select
                    style={{marginBottom: 10}}
                    defaultValue={this.state.activityCycle.type}
                    onSelect={(value) => {
                        this.setPromotionCycle({
                            activityCycle: {
                                type: value,
                                selectValue: ['1'],
                            },
                        });
                    }}
                >
                    {CYCLE_TYPE.map(type => <Option key={type.value} value={type.value}>{type.name}</Option>)}
                </Select>
                {this.state.activityCycle.type == FULL_CUT_ACTIVITY_CYCLE_TYPE.WEEKLY ?
                    (
                        <div className={styles.SeniorDateWeek}>
                            <CheckboxGroup options={options} defaultValue={this.state.activityCycle.selectValue} onChange={this.onChange} />
                        </div>
                    )
                    : null}
                {this.state.activityCycle.type == FULL_CUT_ACTIVITY_CYCLE_TYPE.MONTHLY ?
                    (
                        <div className={styles.SeniorDateMonth}>
                            <CheckboxGroup options={days} defaultValue={this.state.activityCycle.selectValue} onChange={this.onChange} />
                        </div>
                    )
                    : null
                }
                <WrappedAdvancedTimeSetting onChange={
                    (timeSlot) => { this.getTimeSLot(timeSlot); }}
                />
            </div>
        );
    }
}


export default SeniorDateSetting;
