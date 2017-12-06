/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-01-23T13:49:32+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: SeniorDateSetting.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-14T13:42:04+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import styles from './styles.less';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Immutable from 'immutable';
import { connect } from 'react-redux'

import { Modal, Button, Checkbox, DatePicker, Tag, Icon } from 'antd';

const CheckboxGroup = Checkbox.Group;

import { WrappedAdvancedTimeSetting } from '../AdvancedTimeSetting';
import LinkSelector from '../../../../components/common/LinkSelector/LinkSelector'; // 下拉列表可以新建类别
import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../../redux/actions/saleCenterNEW/fullCutActivity.action';


import {
    CYCLE_TYPE,
    FULL_CUT_ACTIVITY_CYCLE_TYPE,
} from '../../../../redux/actions/saleCenterNEW/types';


const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;


class SeniorDateSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeSlot: [],
            excludeDateArray: Immutable.fromJS([]),
            activityCycle: {
                type: FULL_CUT_ACTIVITY_CYCLE_TYPE.EVERYDAY,
                selectValue: ['1'],
            },
        };

        this.onChange = this._onChange.bind(this);
        this.excludeDatePicker = this._excludeDatePicker.bind(this);
        this.renderExcludedDate = this._renderExcludedDate.bind(this);
        this.unselectExcludeDate = this._unselectExcludeDate.bind(this);
    }

    componentDidMount() {

    }

    _onChange(checkedValues) {
        this.setState({
            activityCycle: {
                type: this.state.activityCycle.type,
                selectValue: checkedValues,
            },
        });

        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    // select excluded date
    _excludeDatePicker(date, dateString) {
        if (date === null || dateString === '') {
            return null;
        }
        if (this.state.excludeDateArray.contains(date)) {
            return null;
        }
        this.setState({
            excludeDateArray: this.state.excludeDateArray.push(date),
        });

        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    // TODO: fixed the bugger when the user delete a excluded date.
    // The Dom structure is diff with the date structure
    //
    _renderExcludedDate() {
        const self = this;

        return this.state.excludeDateArray.map((date, index) => {
            const callback = (e) => {
                e.preventDefault();
                self.unselectExcludeDate(index);
            };

            return (
                <Tag key={index} closable={true} onClose={callback}>{date.format('YYYY-MM-DD')}</Tag>
            );
        });
    }


    _unselectExcludeDate(index) {
        this.setState({
            excludeDateArray: this.state.excludeDateArray.delete(index),
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    getTimeSLot(timeSlot) {
        this.setState({
            timeSlot,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    setPromotionCycle(value) {
        this.setState(value);

        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    // componentDidUpdate(){
    //     this.props.onCallback && this.props.onCallback(Object.assign({}, this.state));
    // }

    render() {
        const self = this;
        return (
            <div className={styles.SeniorDateMain}>
                <WrappedAdvancedTimeSetting onChange={
                    (timeSlot) => { this.getTimeSLot(timeSlot); }}
                />
                <LinkSelector
                    placeholder="请选择周期"
                    options={CYCLE_TYPE}
                    linkable={false}
                    tit="活动周期"
                    handSelect={(arg) => {
                        this.setPromotionCycle({
                            activityCycle: {
                                type: arg,
                                selectValue: ['1'],
                            },
                        });
                    }}
                />
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
                <div className={styles.SeniorDelDate}>
                    <div className={styles.timeSettingTitle}>活动排除日期</div>
                    <div className={styles.timePcDate}>
                        <DatePicker
                            size="large"
                            onChange={
                                (moment, dateString) => {
                                    self.excludeDatePicker(moment, dateString);
                                }
                            }
                        />
                        <div>
                            {self.renderExcludedDate()}
                        </div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>
        );
    }
}


export default SeniorDateSetting;
