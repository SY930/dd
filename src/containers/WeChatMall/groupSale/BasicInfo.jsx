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
import { connect } from 'react-redux';
import ReadableTimeSetter from '../../../components/common/ReadableTimeSetter'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {
    saleCenterAddPhrase,
} from "../../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import PriceInput from '../../SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const moment = require('moment');
const DATE_FORMAT = 'YYYYMMDD';

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
        if (nextFlag) {
            const {description, name, endTime, startTime} = this.state;
            this.props.onChange && this.props.onChange({startTime, endTime, name, description});
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
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                                placeholder={['开始日期', '结束日期']}
                            />
                        )}
                        </Col>
                        <Col offset={1} span={2}>
                            <div className={styles.ActivityDateDay}>
                                <span>
                                    {
                                        this.getDateCount()
                                    }
                                </span>
                                <span>天</span>
                            </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    label="拼团有效期"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <PriceInput
                        modal="int"
                        addonAfter="分钟"
                        placeholder="请输入拼团有效期"
                        maxNum={6}
                    />
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

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPhrase: (opts) => {
            dispatch(saleCenterAddPhrase(opts))
        },  
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BasicInfo));
