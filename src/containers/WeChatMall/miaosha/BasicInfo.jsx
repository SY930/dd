import React from 'react'
import {
    Input,
    Form,
    Select,
    DatePicker,
    Checkbox,
    message,
    Tag,
    Row,
    Col,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import CustomTimeRangeInput from '../../../containers/SaleCenterNEW/common/CustomTimeRangeInput';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const moment = require('moment');
const DATE_FORMAT = 'YYYYMMDDHHmm00';
const disabledDate = (current) => {
    // Can not select days before today
    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
}
const ACTIVITY_CYCLE_TYPE = {
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
};

const WEEK_OPTIONS = [
    {
        label: '日',
        value: '7',
    },
    {
        label: '一',
        value: '1',
    },
    {
        label: '二',
        value: '2',
    },
    {
        label: '三',
        value: '3',
    },
    {
        label: '四',
        value: '4',
    },
    {
        label: '五',
        value: '5',
    },
    {
        label: '六',
        value: '6',
    },
];

const MONTH_OPTIONS = ((start, end) => {
    return Array(end - start).fill(0).map((v, index) => {
        return {
            label: `${index + 1}`,
            value: `${index + 1}`,
        };
    });
})(0, 31);
const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.data.description,
            startTime: props.data.startTime,
            endTime: props.data.endTime,
            name: props.data.name,
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
        const {
            description,
            startTime,
            endTime,
            name,
        } = this.state;
        
        if (nextFlag) {
            this.props.onChange({
                description,
                startTime,
                endTime,
                name,
            });
        }
        return nextFlag;
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value,
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
                <p>{'商城秒杀'}</p>
            </FormItem>
        )
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
                    {getFieldDecorator('promotionName', {
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
                    label="活动起止时间"
                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('rangePicker', {
                        rules: [
                            {
                                required: true,
                                message: '请选择活动起止时间',
                            },
                            {
                                validator: (rule, v, cb) => {
                                    if (v.length === 2) {
                                        const [startMoment, endMoment] = v;
                                        if (endMoment.diff(startMoment, 'days', true) > 90) {
                                            return cb(rule.message)
                                        }
                                    }
                                    cb();
                                },
                                message: '活动起止时间跨度最多为90天',
                            },
                        ],
                        onChange: this.handleDateRangeChange,
                        initialValue: this.state.startTime && this.state.endTime ?
                            [moment(this.state.startTime, DATE_FORMAT), moment(this.state.endTime, DATE_FORMAT)] : [],
                    })(
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            className={styles.ActivityDateDayleft}
                            disabledDate={disabledDate}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                        />
                    )}
                </FormItem>
                <FormItem
                    label="活动说明"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [
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

export default Form.create()(BasicInfo);
