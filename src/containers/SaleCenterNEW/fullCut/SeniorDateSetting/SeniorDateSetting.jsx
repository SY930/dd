/**
 * Created by Zbl on 2016/12/26.
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-01-23T13:49:32+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: SeniorDateSetting.jsx
* @Last modified by:   xf
* @Last modified time: 2017-02-09T18:23:42+08:00
* @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
*/

import styles from './styles.less';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { connect } from 'react-redux'

import { Modal, Button, Checkbox, DatePicker, Tag } from 'antd';

const CheckboxGroup = Checkbox.Group;

import { WrappedAdvancedTimeSetting } from '../AdvancedTimeSetting';
import LinkSelector from '../../../../components/common/LinkSelector/LinkSelector'; // 下拉列表可以新建类别
import ProjectEditBox from '../../../../components/basic/ProjectEditBox/ProjectEditBox'; // ProjectEditBox 可以编辑的文本输入框——可以自定义内容
import {
    addExcludedDateOfFullCutActivityAC,
    delExcludedDateOfFullCutActivityAC,
    fullCutSetActivityPeriodAC,
    FULL_CUT_ACTIVITY_CYCLE_TYPE,

    MONTH_OPTIONS,
    CYCLE_TYPE,
    WEEK_OPTIONS,
} from '../../../../redux/actions/saleCenterNEW/fullCutActivity.action';

const date = CYCLE_TYPE;
const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;


class SeniorDateSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeSlot: [],
            excludeDateArray: Immutable.fromJS([]),
        };

        this.onChange = this._onChange.bind(this);
        this.excludeDatePicker = this._excludeDatePicker.bind(this);
        this.renderExcludedDate = this._renderExcludedDate.bind(this);
        this.unselectExcludeDate = this._unselectExcludeDate.bind(this);
    }


    componentDidMount() {

    }

    _onChange(checkedValues) {
        this.props.selectActivityPeriod({
            type: this.props.fullCut.getIn(['activityCycle', 'type']),
            selectValue: checkedValues,
        });
    }

    // select excluded date
    _excludeDatePicker(date, dateString) {
        if (date == null || dateString == '') {
            return
        }

        this.props.addExcludedDate({
            date,
            dateString,
        })
    }

    // TODO: fixed the bugger when the user delete a excluded date.
    // The Dom structure is diff with the date structure
    _renderExcludedDate() {
        const excludeDateArray = this.props.fullCut.get('excludedDate');
        return excludeDateArray.map((date, index) => {
            return (
                <Tag key={index} closable={true} onClose={() => { this.unselectExcludeDate(index) }}>{date.dateString}</Tag>
            )
        });
    }


    _unselectExcludeDate(index) {
    // delete
        this.props.delExcludedDate({
            index,
        })
    }

    render() {
        const self = this;
        const $activityCycle = this.props.fullCut.get('activityCycle');

        return (
            <div className={styles.SeniorDateMain}>
                <WrappedAdvancedTimeSetting />
                <LinkSelector
                    placeholder="请选择周期"
                    options={date}
                    linkable={false}
                    tit="活动周期"
                    handSelect={(arg) => {
                        this.props.selectActivityPeriod({
                            type: arg,
                            selectValue: ['1'],
                        });
                    }}
                />
                {$activityCycle.get('type') == FULL_CUT_ACTIVITY_CYCLE_TYPE.WEEKLY
                    ? <div className={styles.SeniorDateWeek}>
                        <CheckboxGroup options={options} defaultValue={$activityCycle.get('selectValue').toJS()} onChange={this.onChange} />
                    </div>
                    : null}
                {$activityCycle.get('type') == FULL_CUT_ACTIVITY_CYCLE_TYPE.MONTHLY
                    ? <div className={styles.SeniorDateMonth}>
                        <CheckboxGroup options={days} defaultValue={$activityCycle.get('selectValue').toJS()} onChange={this.onChange} />
                    </div>
                    : null}
                <div className={styles.SeniorDelDate}>
                    <div className={styles.timeSettingTitle}>活动排除日期</div>
                    <div className={styles.timePcDate}>
                        <DatePicker
                            size="large"
                            onChange={
                                (moment, dateString) => {
                                    self.excludeDatePicker(moment, dateString)
                                }
                            }
                        />
                        {self.renderExcludedDate()}
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addExcludedDate: (opts) => {
            dispatch(addExcludedDateOfFullCutActivityAC(opts))
        },
        delExcludedDate: (opts) => {
            dispatch(delExcludedDateOfFullCutActivityAC(opts))
        },
        selectActivityPeriod: (opts) => {
            dispatch(fullCutSetActivityPeriodAC(opts))
        },
        setTimeSlot: (opts) => {
            dispatch(fullCutSetTimeSlotAC(opts))
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SeniorDateSetting);
