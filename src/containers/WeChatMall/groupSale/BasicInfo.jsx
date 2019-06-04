import React from 'react'
import {
    Input,
    Form,
    Select,
    DatePicker,
} from 'antd';
import { connect } from 'react-redux';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {
    saleCenterAddPhrase,
} from "../../../redux/actions/saleCenterNEW/promotionBasicInfo.action";

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const moment = require('moment');

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
            const startTime = value[0].format('YYYYMMDDHHmmss');
            const endTime = value[1].format('YYYYMMDDHHmmss');
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
                        rules: [{
                            required: true,
                            message: '请选择活动起止时间',
                        }],
                        onChange: this.handleDateRangeChange,
                        initialValue: this.state.startTime && this.state.endTime ? [moment(this.state.startTime, 'YYYYMMDDHHmmss'), moment(this.state.endTime, 'YYYYMMDDHHmmss')] : [],
                    })(
                        <RangePicker
                            showTime={{ format: 'HH:mm:ss' }}
                            className={styles.ActivityDateDayleft}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
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
