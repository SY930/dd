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
import PriceInput from '../common/PriceInput';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const moment = require('moment');
const DATE_FORMAT = 'YYYYMMDD000000';
const disabledDate = (current) => {
    // Can not select days before today
    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
}

class ActivityRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.data && props.data.description,
            startTime: props.data && props.data.startTime,
            endTime: props.data && props.data.endTime,
            name: props.data && props.data.name,
            // 后端是分钟，前端是小时
            reservationTime: Math.floor(((props.data && props.data.reservationTime) || 0) / 60),
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

    handleSubmit = () => {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        if (nextFlag) {
            this.props.onChange({
                ...this.state,
                reservationTime: this.state.reservationTime * 60,
            });
        }
        return nextFlag;
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        });
    }
    handleReservationTimeChange = ({ number }) => {
        this.setState({
            reservationTime: number,
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
        // debugger
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className={styles.FormStyle}>
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
                        <Input type="textarea" placeholder="活动说明最多200个字符"/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(ActivityRange);
