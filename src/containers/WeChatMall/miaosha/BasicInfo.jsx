import React from 'react'
import {
    Input,
    Form,
    Select,
    Icon,
    Button,
    DatePicker,
} from 'antd';
import { connect } from 'react-redux';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterGetExcludeCardLevelIds,
    saleCenterQueryFsmGroupSettleUnit,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

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
            // tag: props.data.tag,
            name: props.data.name,
            tipDisplay: 'none',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.renderPromotionType = this.renderPromotionType.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    handleSubmit() {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        if (nextFlag) {
            const {tipDisplay, ...usefulData} = this.state;
            this.props.onChange && this.props.onChange(usefulData);
        }
        return nextFlag;
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }

    handleDateRangeChange(value, dateString) { // value: Selected Time, dateString: Formatted Selected Time
        if (value.length > 1) {
            const startTime = value[0].format('YYYYMMDDHHmm');
            const endTime = value[1].format('YYYYMMDDHHmm');
            this.setState({
                startTime,
                endTime,
            })
        }
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    renderPromotionType() {
        const tip = (
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{'同一时间一个商城的秒杀活动只能有一个，即不允许同一时间一个商城存在两个都处于启用状态的秒杀活动'}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label={'活动类型'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{'商城秒杀'}</p>
                {
                    <Icon
                        type="question-circle-o"
                        className={styles.question}
                        style={{ marginLeft: 6 }}
                        onMouseOver={() => {
                            this.setState({ tipDisplay: 'block' })
                        }}
                    />
                }
                {tip}
            </FormItem>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
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
                        initialValue: this.state.startTime && this.state.endTime ? [moment(this.state.startTime, 'YYYYMMDDHHmm'), moment(this.state.endTime, 'YYYYMMDDHHmm')] : [],
                    })(
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            className={styles.ActivityDateDayleft}
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
                        rules: [{
                            required: true,
                            message: '不得为空, 不多于200个字符',
                            pattern: /.{1,200}/,
                        }],
                        initialValue: this.state.description,
                    })(
                        <Input type="textarea" placeholder="请输入活动说明" onChange={this.handleDescriptionChange} />
                    )}
                </FormItem>

            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
        saleCenterQueryFsmGroupSettleUnit: (opts) => {
            dispatch(saleCenterQueryFsmGroupSettleUnit(opts));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BasicInfo));
