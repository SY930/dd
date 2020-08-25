import React from 'react'
import { connect } from 'react-redux';
import { Row, Col, DatePicker, Tooltip, Icon, message, Select } from 'antd'
import _ from 'lodash'
import { formItems2, formKeys2 } from '../constant'
import  BaseForm  from '../../../../components/common/BaseForm';
import moment from 'moment'

const DATE_FORMAT = 'YYYYMMDD000000';
const { RangePicker } = DatePicker;
import styles from "../payHaveGift.less";
const Option = Select.Option;
@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    state = {
        formKeys2: _.cloneDeep(formKeys2)
    }
    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
            })
        }
    }

    handleFromChange = (key,value) => {

        const { formData } = this.props.createActiveCom
        const { formKeys2 } = this.state

        if(key === 'afterPayJumpType' && value === '4') {
            const { wxNickNameList } = this.props.createActiveCom
            formKeys2.splice(5,0,'miniProgramInfo')
            if(!wxNickNameList.length) {
                this.props.dispatch({
                    type: 'createActiveCom/getApps'
                })
            }
        }
        if(key === 'afterPayJumpType' && value === '3') {
            if(formKeys2.includes('miniProgramInfo')) {
                formKeys2.splice(5,1)
            }
        }

        formData[key] =value

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })
    }
    handleSubmit = () => {
        let flag = true
        const { giftForm } = this.props.createActiveCom
        giftForm.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            } else {
                const { formData } = this.props.createActiveCom
                this.props.dispatch({
                    type: 'createActiveCom/updateState',
                    payload: {
                        formData: {
                            ...formData,
                            mySendGift: v
                        }
                    }
                })
            }

        })
        if(!flag) {
            return flag
        }
        this.form.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            } else {

                const warnText = '投放日期必须在券有效期范围内，且投放周期不能超过90天'
                const eventDate = v.eventDate
                const diffDate = eventDate[1].diff(eventDate[0],'days') + 1
                if(diffDate > 90) {
                    message.warn(warnText)
                    flag = false
                }
                const { effectType, giftValidUntilDayCount, effectTime, validUntilDate } = v.mySendGift || {};


                // 校验投放日期
                if(effectType === '1' &&  diffDate > giftValidUntilDayCount) {
                    message.warn(warnText)
                    flag = false
                }
                if(effectType === '2' &&
                (!eventDate[0].isSameOrAfter(moment.unix(effectTime)) ||  !eventDate[1].isSameOrBefore(moment.unix(validUntilDate) )) ) {
                    message.warn(warnText)
                    flag = false
                }

            }

        })


        return flag
    }
    getDateCount = () => {
        const { formData } = this.props.createActiveCom;
        const {  eventDate, afterPayJumpType } = formData || {};
        const startTime = eventDate && eventDate[0]
        const endTime = eventDate && eventDate[1]
        if (undefined == startTime || undefined == endTime) {
            return 0
        }
        return moment(endTime, DATE_FORMAT)
            .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
    }
    eventDateRender = (d) => {
        const { formData } = this.props.createActiveCom;


        return (
            <Row style={{ display: "flex", alignItems: "center" }}>
                <Col>
                    {d({
                        rules: [
                            {
                                required: true,
                                message: "请选择活动起止时间",
                            },
                        ],
                    })(
                        <RangePicker
                            className={styles.ActivityDateDayleft}
                            style={{ width: "272px" }}
                            format="YYYY-MM-DD"
                            placeholder={["开始日期", "结束日期"]}
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
                            style={{ fontSize: "16px" }}
                            type="question-circle"
                        />
                    </Tooltip>
                </Col>
            </Row>
        );
    }
    afterPayJumpTypeRender = (d) => {
        const { formData } = this.props.createActiveCom;
        return (
            <div style={{ display: "flex" }}>
                {d({})(
                    <Select style={{ width: "272px" }}>
                        <Option value="3" key="3">
                            微信支付
                        </Option>
                        <Option value="4" key="4">
                            微信小程序
                        </Option>
                    </Select>
                )}
                <div style={{ marginLeft: "4px" }}>
                    <Tooltip
                        title={
                            formData.afterPayJumpType === "3"
                                ? "用户点击立即使用可拉起扫一扫/付款码直接支付"
                                : "用户点击立即使用可直接跳转至小程序支付"
                        }
                    >
                        <Icon
                            style={{ fontSize: "16px" }}
                            type="question-circle"
                        />
                    </Tooltip>
                </div>
            </div>
        );
    }
    render () {
        const { formKeys2 } = this.state
        const { wxNickNameList } = this.props.createActiveCom

        formItems2.eventDate.render = this.eventDateRender
        formItems2.mySendGift.render = formItems2.mySendGift.render.bind(this)
        formItems2.afterPayJumpType.render =  this.afterPayJumpTypeRender

        if(formKeys2.includes('miniProgramInfo')) {
            formItems2.miniProgramInfo.options = wxNickNameList
        }
        const { formData } = this.props.createActiveCom

        return (
            <div style={{marginRight: '20px'}}>
                 <BaseForm
                    getForm={this.getForm}
                    formItems={formItems2}
                    formData={formData}
                    formKeys={formKeys2}
                    onChange={this.handleFromChange}
                    formItemLayout={{
                    labelCol: { span: 3 },
                    wrapperCol: { span: 21 },
                    }}
                />
            </div>
        )
    }
}

export default Step2
