import React from 'react'
import {
    Input,
    Form,
    Select,
    DatePicker,
    Row,
    Col,
    Tooltip,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import DayHourMinPicker from './DayHourMinPicker'

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const moment = require('moment');
const DATE_FORMAT = 'YYYYMMDD000000';
const disabledDate = (current) => {
    // Can not select days before today
    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
}

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.data && props.data.description,
            startTime: props.data && props.data.startTime,
            endTime: props.data && props.data.endTime,
            name: props.data && props.data.name,
            // 后端是分钟，前端是小时
            reservationTime: this.getReservationTime((props.data && props.data.reservationTime) || 0),
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
    }

    getReservationTime = (time) => {
        let reserve = Number(time)
        const day = Math.floor(reserve / (24 * 60))
        reserve %= (24 * 60)
        const hour = Math.floor(reserve / (60))
        const min = reserve % 60
        return {
            day,
            hour,
            min,
        }
    }

    handleSubmit = () => {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        if (nextFlag) {
            const time = this.state.reservationTime || {}
            const {
                day = 0,
                hour = 0,
                min = 0,
            } = time
            const minRate = (Number(day) * 24 * 60) + (Number(hour) * 60) + Number(min)
            this.props.onChange({
                ...this.state,
                reservationTime: minRate,
            });
        }
        return nextFlag;
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        });
    }
    handleReservationTimeChange = (data) => {
        this.setState({
            reservationTime: data,
        });
    }

    handleDateRangeChange = (value, dateString) => { // value: Selected Time, dateString: Formatted Selected Time
        if (value.length > 1) {
            const startTime = value[0].format(DATE_FORMAT);
            const endTime = value[1].format(DATE_FORMAT);
            this.setState({
                startTime,
                endTime,
            });
        }
    }

    getDateCount = () => {
        if (undefined == this.state.startTime || undefined == this.state.endTime) {
            return 0
        }
        return moment(this.state.endTime, DATE_FORMAT)
            .diff(moment(this.state.startTime, DATE_FORMAT), 'days') + 1;
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    }

    renderPromotionType() {
        return (
            <FormItem
                label={'活动类型'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{'拼团活动'}</p>
            </FormItem>
        )
    }

    getTimeDesc = () => {
        const {
            reservationTime: time,
        } = this.state;
        if (!time) return '0天0小时';
        const days = Math.floor(time / 24);
        const leftTime = time % 24;
        return `${days}天${leftTime}小时`
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className={styles.FormStyle}>
                {this.renderPromotionType()}
                <FormItem
                    label="活动名称"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }],
                        initialValue: this.state.name,
                    })(
                        <Input placeholder="请输入活动名称" onChange={this.handleNameChange} />
                    )}
                </FormItem>
                <FormItem
                    label="拼团有效期"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 12 }}
                    style={{ position: 'relative' }}
                >
                    {
                        getFieldDecorator('reservationTime', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        const day = Number(v.day || 0)
                                        const hour = Number(v.hour || 0)
                                        const min = Number(v.min || 0)
                                        if (day == 'NaN' || hour == 'NaN' || min == 'NaN') {
                                            return cb('请填写合规的时分秒数据');
                                        }
                                        if (day < 0 || hour < 0 || min < 0) {
                                            return cb('请填写合规的时分秒数据');
                                        }
                                        if (hour > 60 || min > 60) {
                                            return cb('请填写合规的时分秒数据');
                                        }
                                        if (day % 1 !== 0 || hour % 1 !== 0 || min % 1 !== 0) {
                                            return cb('请填写合规的时分秒数据');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: this.state.reservationTime,
                            onChange: this.handleReservationTimeChange,
                        })(
                            <DayHourMinPicker />
                        )
                    }
                    <span
                        style={{
                            position: 'absolute',
                            right: 10,
                            color: '#787878',
                            top: 6,
                        }}
                    >
                        {/* {this.getTimeDesc()} */}
                        &nbsp;
                        <Tooltip title={`若设置1日，用户开团后，需要在1日内成团，超时则拼团失败`}>
                            <Icon
                                type="question-circle"
                            />
                        </Tooltip>
                    </span>
                </FormItem>
                <FormItem
                    label="活动起止日期"
                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Row>
                        <Col span={21}>
                            {getFieldDecorator('rangePicker', {
                                rules: [{
                                    required: true,
                                    message: '请选择活动起止时间',
                                }],
                                onChange: this.handleDateRangeChange,
                                initialValue: this.state.startTime && this.state.endTime ? [moment(this.state.startTime, DATE_FORMAT), moment(this.state.endTime, DATE_FORMAT)] : [],
                            })(
                                <RangePicker
                                    className={styles.ActivityDateDayleft}
                                    disabledDate={disabledDate}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    placeholder={['开始日期', '结束日期']}
                                />
                            )}
                        </Col>
                        <Col offset={1} span={2}>
                            <div className={styles.ActivityDateDay}>
                                <span>
                                    {this.getDateCount()}
                                </span>
                                <span>天</span>
                            </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    label="活动说明"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [
                            { required: true, message: '活动说明不得为空' },
                            { max: 200, message: '最多200个字符' },
                        ],
                        initialValue: this.state.description,
                        onChange: this.handleDescriptionChange,
                    })(
                        <Input type="textarea" placeholder="活动说明最多200个字符" />
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(BasicInfo);
