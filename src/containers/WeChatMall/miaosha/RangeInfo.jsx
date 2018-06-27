import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, Radio } from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {queryGroupMembersList} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');
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

class RangeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservation: '',
            imgUrl: '',
            warmUpTime: '',
            dayOrHour: '小时',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImgUrlChange = this.handleImgUrlChange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
        this.handleWarmUpTimeChange = this.handleWarmUpTimeChange.bind(this);
        this.handleDayOrHourChange = this.handleDayOrHourChange.bind(this);
    }

    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        return flag;
    }
    onCardLevelChange(obj) {
        this.setState(obj)
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

    onReservationChange(value) {
        console.log(value);
    }

    handleImgUrlChange(value) {
        console.log(value);
    }

    handleWarmUpTimeChange(value) {
        console.log(value);
    }

    handleDayOrHourChange(value) {
        console.log(value);
        this.setState({
            warmUpTime: ''
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label="商品预留时间"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('promotionName', {
                        rules: [{
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }],
                        initialValue: this.state.reservation,
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
                    label=""
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('rangePicker', {
                        rules: [{
                            required: true,
                            message: '不得为空',
                        }],
                        initialValue: this.state.warmUpTime,
                        onChange: this.handleWarmUpTimeChange
                    })(
                        <PriceInput
                            modal={'int'}
                            placeholder={`提前宣传${this.state.dayOrHour}数`}
                        />
                    )}
                </FormItem>

                {/*<FormItem
                    label="宣传图"
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

                    })(
                        <Input type="textarea" placeholder="请输入活动说明"  />
                    )}
                </FormItem>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RangeInfo));
