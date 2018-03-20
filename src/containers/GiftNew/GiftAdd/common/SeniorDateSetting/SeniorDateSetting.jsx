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
import { Checkbox, Select, Icon } from 'antd';

import { WrappedAdvancedTimeSetting } from '../../../../SaleCenterNEW/common/AdvancedTimeSetting';
import styles from './styles.less';
import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import { is } from 'immutable';

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

class SeniorDateSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectType: '-1',
            couponPeriodSettings: [
                {
                    activeType: '0',
                },
            ],
            errorIdxArr: [],
        };
        this.onChange = this._onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.add = this.add.bind(this);
    }

    componentDidMount() {
        let { selectType, couponPeriodSettings } = this.state
        const _couponPeriodSettings = this.props.couponPeriodSettings
        if (!_couponPeriodSettings) return;
        if (_couponPeriodSettings instanceof Array) {
            if (_couponPeriodSettings.length === 0) return
            selectType = String(_couponPeriodSettings[0].periodType)
            couponPeriodSettings = _couponPeriodSettings.map((setting) => {
                return {
                    activeType: '0',
                    periodType: String(setting.periodType),
                    periodStart: setting.periodStart.length === 3 ? "0" + setting.periodStart : String(setting.periodStart),
                    periodEnd: setting.periodEnd.length === 3 ? "0" + setting.periodEnd : String(setting.periodEnd),
                    periodLabel: String(setting.periodLabel),
                }
            })
        }
        this.setState({
            selectType,
            couponPeriodSettings,
        }, () => {
            this.props.onChange && this.props.onChange({ couponPeriodSettings, couponPeriodSettingsStatus: true })
        })
    }
    update(couponPeriodSettings) {
        const couponPeriodSettingsStatus = this.validatorTime(couponPeriodSettings)
        this.setState({
            couponPeriodSettings,
        }, () => {
            this.props.onChange && this.props.onChange({ couponPeriodSettings, couponPeriodSettingsStatus })
        });
    }
    validatorTime = (couponPeriodSettings) => {
        let couponPeriodSettingsStatus = true;
        const errorIdxArr = [];
        couponPeriodSettings.forEach((period, index) => {
            const { periodType, periodLabel, periodStart, periodEnd } = period
            if ((periodType == 1 || periodType == 2) && !periodLabel) {
                couponPeriodSettingsStatus = false
            }
            if (!periodStart || !periodEnd || periodStart > periodEnd) {
                couponPeriodSettingsStatus = false
            }
            const periodLabelArr = periodLabel.split(',')
            couponPeriodSettings.forEach((Otherperiod, idx) => {
                if (idx !== index) {
                    const { periodLabel: otherperiodLabel, periodStart: otherperiodStart, periodEnd: otherperiodEnd } = Otherperiod
                    const OtherperiodLabelArr = otherperiodLabel.split(',')
                    const repeat = _.intersection(periodLabelArr, OtherperiodLabelArr).length > 0;
                    if (periodType === 0 || repeat) {
                        if (!(otherperiodStart > periodEnd || otherperiodEnd < periodStart)) {
                            couponPeriodSettingsStatus = false
                            errorIdxArr[idx] = false
                        }
                    }
                }
            })
        })
        this.setState({
            errorIdxArr,
        })
        return couponPeriodSettingsStatus
    }
    onSelect(value) {
        this.setState({
            selectType: value,
            couponPeriodSettings: [{
                activeType: '0',
                periodType: value,
                periodStart: '',
                periodEnd: '',
                periodLabel: '1',
            }],
        }, () => {
            this.props.onChange && this.props.onChange({ couponPeriodSettings: [], couponPeriodSettingsStatus: value == -1 })
        });
    }
    // 每日
    getTimeSLot(timeSlot) {
        const couponPeriodSettings = timeSlot.data.map((time) => {
            return {
                activeType: '0',
                periodType: '0',
                periodStart: time.start ? time.start.format('HHmm') : '',
                periodEnd: time.end ? time.end.format('HHmm') : '',
                periodLabel: '',
            }
        })
        this.update(couponPeriodSettings);
    }
    // 每周或每月的天数的变化
    _onChange(checkedValues, idx) {
        const { couponPeriodSettings } = this.state;
        couponPeriodSettings[idx].periodLabel = checkedValues.join(',');
        this.update(couponPeriodSettings);
    }
    // 每周或每月的时间的变化
    getWeekOrMonthTimeSLot(timeSlot, idx) {
        const { couponPeriodSettings } = this.state;
        couponPeriodSettings[idx].periodStart = this.format(timeSlot.data[0].start);
        couponPeriodSettings[idx].periodEnd = this.format(timeSlot.data[0].end);
        this.update(couponPeriodSettings);
    }
    format(momentTime) {
        if (!momentTime) return ''
        return momentTime.format('HHmm')
    }
    add() {
        const { selectType, couponPeriodSettings } = this.state;
        if (couponPeriodSettings.length >= 5) return
        couponPeriodSettings.push({
            activeType: '0',
            periodType: selectType,
            periodStart: '',
            periodEnd: '',
            periodLabel: '1',
        })
        this.update(couponPeriodSettings);
    }
    remove(index) {
        const { couponPeriodSettings } = this.state;
        if (couponPeriodSettings.length === 1) return;
        couponPeriodSettings.splice(index, 1);
        this.update(couponPeriodSettings);
    }
    render() {
        const { selectType, couponPeriodSettings, errorIdxArr } = this.state;
        return (
            <div className={styles.SeniorDateMain}>
                <Select
                    style={{ marginBottom: 10 }}
                    defaultValue={selectType}
                    value={selectType}
                    onSelect={this.onSelect}
                >
                    {CYCLE_TYPE.map(type => <Option key={type.value} value={type.value}>{type.name}</Option>)}
                </Select>
                {selectType === '0' ?
                    (
                        <div className={styles.SeniorDateMonth}>
                            <WrappedAdvancedTimeSetting
                                onChange={
                                    (timeSlot) => { this.getTimeSLot(timeSlot); }}
                                count="5"
                                value={couponPeriodSettings}
                                errorIdxArr={this.state.errorIdxArr}
                            /></div>
                    )
                    : null
                }
                {selectType === '1' || selectType === '2' ?
                    couponPeriodSettings.map((setting, idx) => {
                        return (
                            <div className={selectType === '1' ? styles.SeniorDateWeek : styles.SeniorDateMonth} key={idx}>
                                <CheckboxGroup
                                    defaultValue={['1']}
                                    value={setting.periodLabel.split(',')}
                                    options={selectType === '1' ? options : days}
                                    onChange={checkedValues => this.onChange(checkedValues, idx)}
                                />

                                {
                                    (couponPeriodSettings.length === 1 || idx === couponPeriodSettings.length - 1) && idx !== 4 ?
                                        (<Icon className={styles.pulsIcon} type="plus-circle-o" onClick={this.add} />) : null
                                }
                                <Icon className={styles.deleteIcon} type="minus-circle-o" disabled={couponPeriodSettings.length === 1} onClick={() => this.remove(idx)} />
                                <WrappedAdvancedTimeSetting
                                    onChange={
                                        (timeSlot) => {
                                            this.getWeekOrMonthTimeSLot(timeSlot, idx);
                                        }}
                                    noPlusIcon={true}
                                    count="5"
                                    value={[setting]}
                                />
                                {
                                    errorIdxArr[idx] === false ? (<p style={{ color: 'orange', display: 'inline-block' }}>和其它档位时间段重合</p>) : null
                                }
                            </div>
                        )
                    })
                    : null}
            </div>
        );
    }
}


export default SeniorDateSetting;
