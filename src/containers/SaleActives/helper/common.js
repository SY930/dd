import React from 'react'
import { Input, Row, Col, DatePicker, Tooltip, Icon, Select } from 'antd'
import styles from '../CreateActive.less'
import moment from 'moment'

const { RangePicker } = DatePicker;
const Option = Select.Option;
const DATE_FORMAT = 'YYYYMMDD000000';

// 活动说明的render函数
export function renderEventRemark(d) {
    const { formData } = this.props.createActiveCom;
    return (
        <div className={styles.textAreaWrap}>
            {d({})(
                <Input
                    placeholder="请输入活动说明，至多1000字"
                    type="textarea"
                    maxLength={1000}
                    style={{ height: '117px' }}
                />
            )}
            <div className={styles.textNumCount}>
                {formData.eventRemark ? formData.eventRemark.length : 0}
                /1000
            </div>
        </div>
    );
}

// 投放日期的render函数

export function eventDateRender(d) {
    return (
        <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col>
                {d({
                    rules: [
                        {
                            required: true,
                            message: '请选择活动起止时间',
                        },
                    ],
                })(
                    <RangePicker
                        className={styles.ActivityDateDayleft}
                        style={{ width: '272px' }}
                        format="YYYY-MM-DD"
                        placeholder={['开始日期', '结束日期']}
                        allowClear={false}

                    />
                )}
            </Col>
            <Col>
                <div className={styles.ActivityDateDay}>
                    <span>{this.getDateCount()}</span>
                    <span>天</span>
                </div>
            </Col>
            <Col>
                <Tooltip title="投放日期必须在券有效期范围内，且投放周期不能超过90天">
                    <Icon
                        style={{ fontSize: '16px' }}
                        type="question-circle"
                    />
                </Tooltip>
            </Col>
        </Row>
    );
}

// 计算天数
export function getDateCount() {
    const { formData } = this.props.createActiveCom;
    const { eventLimitDate: eventDate } = formData || {};
    const startTime = eventDate && eventDate[0]
    const endTime = eventDate && eventDate[1]
    if (undefined == startTime || undefined == endTime) {
        return 0
    }
    return moment(endTime, DATE_FORMAT)
        .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
}

// 起止日期的render函数
export function eventLimitDateRender(d) {
    this.getDateCount = getDateCount.bind(this)
    return (
        <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col>
                {d({
                    rules: [
                        {
                            required: true,
                            message: '请选择活动起止时间',
                        },
                    ],
                })(
                    <RangePicker
                        className={styles.ActivityDateDayleft}
                        style={{ width: '272px' }}
                        format="YYYY-MM-DD"
                        placeholder={['开始日期', '结束日期']}
                        allowClear={false}

                    />
                )}
            </Col>
            <Col>
                <div className={styles.ActivityDateDay}>
                    <span>{this.getDateCount()}</span>
                    <span>天</span>
                </div>
            </Col>
        </Row>
    );
}

// 跳转路径的render函数

export function afterPayJumpTypeRender(d) {
    const { formData } = this.props.createActiveCom;
    return (
        <div style={{ display: 'flex' }}>
            {d({})(
                <Select style={{ width: '272px' }}>
                    <Option value="3" key="3">
                        微信支付
                    </Option>
                    <Option value="4" key="4">
                        微信小程序
                    </Option>
                </Select>
            )}
            <div style={{ marginLeft: '4px' }}>
                <Tooltip
                    title={
                        formData.afterPayJumpType === '3'
                            ? '用户点击立即使用可拉起扫一扫/付款码直接支付'
                            : '用户点击立即使用可直接跳转至小程序支付'
                    }
                >
                    <Icon
                        style={{ fontSize: '16px' }}
                        type="question-circle"
                    />
                </Tooltip>
            </div>
        </div>
    );
}
