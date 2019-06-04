import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const RADIO_OPTIONS = Object.freeze([
    {
        key: '小时',
        value: '小时',
        name: '小时',
    }, {
        key: '天',
        value: '天',
        name: '天',
    },
]);

class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        const advancedAnnouncingTimeInHour = props.data.advancedAnnouncingTime;
        this.state = {
            reservationTime: props.data.reservationTime,
            bannerUrl: props.data.bannerUrl,
            advancedAnnouncingTime: advancedAnnouncingTimeInHour ? advancedAnnouncingTimeInHour >= 24 && advancedAnnouncingTimeInHour % 24 === 0 ? advancedAnnouncingTimeInHour / 24 : advancedAnnouncingTimeInHour : undefined,
            dayOrHour: advancedAnnouncingTimeInHour ? advancedAnnouncingTimeInHour >= 24 && advancedAnnouncingTimeInHour % 24 === 0 ? '天' : '小时' : '小时',
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: () => true,
            finish: this.handleSubmit,
            cancel: undefined,
        });
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        let {bannerUrl, dayOrHour, advancedAnnouncingTime, reservationTime} = this.state;
        if (dayOrHour === '天') {
            advancedAnnouncingTime *= 24;
        }
        this.props.onChange && this.props.onChange({
            bannerUrl,
            reservationTime,
            advancedAnnouncingTime,
        })
        return flag;
    }

    onReservationChange = (value) => {
        this.setState({reservationTime: value.number});
    }

    handleWarmUpTimeChange = (value) => {
        this.setState({advancedAnnouncingTime: value.number});
    }

    handleDayOrHourChange = (event) => {
        this.setState({
            dayOrHour: event.target.value,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label={
                        <span>
                           商品预留时间
                        </span>
                    }
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('reservation', {
                        rules: [
                            {
                                required: true,
                                message: '不得为空',
                            },
                            {
                                validator: (rule, v, cb) => {
                                    Number(v && v.number ? v.number : 0) >= 3 &&  Number(v && v.number ? v.number : 0) <= 120 ? cb() : cb(rule.message);
                                },
                                message: '预留时间为3 ~ 120 分钟',
                            },
                        ],
                        initialValue: this.state.reservationTime ? {number: this.state.reservationTime} : undefined,
                        onChange: this.onReservationChange,
                    })(
                        <PriceInput
                            addonAfter={'分钟'}
                            modal={'int'}
                            placeholder="预留时间为3 ~ 120 分钟"
                        />
                    )}
                </FormItem>
                <FormItem
                    label="首页提前宣传时长"
                    className={styles.FormItemStyle}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 17,
                    }}
                >
                    <RadioGroup
                        value={this.state.dayOrHour}
                        onChange={this.handleDayOrHourChange}
                    >
                        {RADIO_OPTIONS.map((type) => {
                            return (<Radio key={type.value} value={type.value}>{type.name}</Radio >);
                        })}
                    </RadioGroup >
                </FormItem>
                <FormItem
                    label="提前"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('advancedAnnouncingTime', {
                        rules: [
                            {
                                required: true,
                                message: '不得为空',
                            },
                            {
                                validator: (rule, v, cb) => {
                                    Number(v && v.number ? v.number : 0) > 0 ? cb() : cb(rule.message);
                                },
                                message: '必须大于0',
                            },
                        ],
                        initialValue: this.state.reservationTime ? {number: this.state.advancedAnnouncingTime} : undefined,
                        onChange: this.handleWarmUpTimeChange
                    })(
                        <PriceInput
                            addonAfter={`${this.state.dayOrHour}`}
                            modal={'int'}
                            placeholder={`提前宣传${this.state.dayOrHour}数`}
                        />
                    )}
                </FormItem>
            </Form>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SettingInfo));
