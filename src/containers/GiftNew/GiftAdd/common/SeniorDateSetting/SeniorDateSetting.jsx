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
import Moment from 'moment';

import { WrappedAdvancedTimeSetting } from '../../../../SaleCenterNEW/common/AdvancedTimeSetting';
import styles from './styles.less';
import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../../../redux/actions/saleCenterNEW/fullCutActivity.action';

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const CYCLE_TYPE = Object.freeze([
    {
        value: '-1',
        name: '不限制',
    },
    {
        value: '0',
        name: '每日',
    },
    {
        value: '1',
        name: '每周',
    },
    {
        value: '2',
        name: '每月',
    },
]);
const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;
window.Moment = Moment

class SeniorDateSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // timeSlot: [],
            selectType: '-1',
            couponPeriodSettings: [
                {
                    selectType: '',
                },
            ],
        };
        this.onChange = this._onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {

    }

    _onChange(checkedValues) {
        this.setState({

        }, () => {
            this.props.onChange && this.props.onChange(this.state.couponPeriodSettings)
        });
    }

    getTimeSLot(timeSlot) {
        const couponPeriodSettings = timeSlot.data.map((time) => {
            return {
                activeType: '0',
                periodType: '0',
                periodStart: time.start.format('HHmm'),
                periodEnd: time.end.format('HHmm'),
                periodLabel: '',
            }
        })
        this.setState({
            couponPeriodSettings,
        }, () => {
            this.props.onChange && this.props.onChange(couponPeriodSettings)
        });
    }

    onSelect(value) {
        this.setState({ selectType: value }, () => {
            this.props.onChange && this.props.onChange([])
        });
    }

    render() {
        const { selectType } = this.state;
        return (
            <div className={styles.SeniorDateMain}>
                <Select
                    style={{ marginBottom: 10 }}
                    defaultValue={selectType}
                    onSelect={this.onSelect}
                >
                    {CYCLE_TYPE.map(type => <Option key={type.value} value={type.value}>{type.name}</Option>)}
                </Select>
                {selectType === '0' ?
                    (
                        <div className={styles.SeniorDateMonth}>
                            <WrappedAdvancedTimeSetting onChange={
                                (timeSlot) => { this.getTimeSLot(timeSlot); }}
                            /></div>
                    )
                    : null
                }
                {selectType === '1' ?
                    (
                        <div className={styles.SeniorDateWeek}>
                            <CheckboxGroup options={options} onChange={this.onChange} />
                        </div>
                    )
                    : null}
                {selectType === '2' ?
                    (
                        <div className={styles.SeniorDateMonth}>
                            <CheckboxGroup options={days} onChange={this.onChange} />
                        </div>
                    )
                    : null
                }
            </div>
        );
    }
}


export default SeniorDateSetting;
