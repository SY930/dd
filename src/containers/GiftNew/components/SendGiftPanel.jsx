import React, { Component } from 'react';
import {
    Form,
    Button,
    Input,
    Select,
    Radio,
    Row,
    Col,

} from 'antd';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {SALE_CENTER_GIFT_EFFICT_DAY, SALE_CENTER_GIFT_EFFICT_TIME} from "../../../redux/actions/saleCenterNEW/types";


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SEND_MSG = [
    {
        label:'不发送',
        value:'0'
    },{
        label:'仅发送短信',
        value:'1'
    },{
        label:'仅推送微信',
        value:'2'
    },{
        label:'微信推送不成功则发送短信',
        value:'3'
    }
];
const VALIDATE_TYPE = [
    { key: 0, value: '1', name: '相对有效期' },
    { key: 1, value: '2', name: '固定有效期' }
];

class SendGiftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smsGate: '0',           // 消息推送方式
            giftNo: 1,              // 礼品个数
            effectType: '1',        // 相对有效期
            dayOrHour: '0',         // 按天 按小时
            whenToEffect: '0',        // 何时生效
            giftValidDays: 1,        // 有效天数
            cellNo: '',             // 用户手机号
            template: '',           // 所选短信模板
        };
        this.handleGiftNumChange = this.handleGiftNumChange.bind(this);
        this.handleEffectTypeChange = this.handleEffectTypeChange.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleDayOrHourChange = this.handleDayOrHourChange.bind(this);
        this.handleWhenToEffectChange = this.handleWhenToEffectChange.bind(this);
        this.handleSmsGateChange = this.handleSmsGateChange.bind(this);
    }

    handleGiftNumChange(val) {
        this.setState({
            giftNo: val.number,
        })
    }

    handleWhenToEffectChange(val) {
        this.setState({
            whenToEffect: val,
        })
    }

    handleSmsGateChange(val) {
        this.setState({
            smsGate: val,
        })
    }

    handleGiftValidDaysChange(val) {
        this.setState({
            giftValidDays: val.number,
        })
    }

    handleEffectTypeChange(val) {
        this.setState({
            effectType: val.target.value,
        })
    }

    handleDayOrHourChange(val) {
        this.setState({
            dayOrHour: val.target.value,
        })
    }

    renderCellNo() {
        return (<FormItem
                    label="手机号"
                    className={styles.FormItemStyle}
                    style={{
                        margin: '1em 0'
                    }}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                >
                    <Input/>
                </FormItem>);
    }

    renderGift() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className={styles.addGrade}>
                <div className={styles.CategoryBody}>
                    <FormItem
                        className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                    >
                        {getFieldDecorator('giftNo', {
                            value: { number: this.state.giftNo },
                            onChange: this.handleGiftNumChange,
                            rules: [
                                { required: true, message: '礼品个数为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) cb();
                                        v.number > 0 && v.number <= 50 ? cb() : cb(rule.message);
                                    },
                                    message: '礼品个数为1到50'
                                },
                            ]
                        })(<PriceInput
                            addonBefore={'礼品个数:'}
                            addonAfter="个"
                            modal="int"
                        />)}
                    </FormItem>
                    <FormItem
                        className={styles.FormItemStyle}
                    >
                        <span className={styles.formLabel}>生效方式:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={this.state.effectType}
                            onChange={this.handleEffectTypeChange}
                        >
                            {
                                VALIDATE_TYPE.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.name}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        className={[styles.FormItemStyle].join(' ')}
                    >
                        <span className={styles.formLabel}>相对有效期:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={this.state.dayOrHour}
                            onChange={this.handleDayOrHourChange}
                        >
                            {
                                [{ value: '0', label: '按小时' }, { value: '1', label: '按天' }].map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label="何时生效"
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Select
                            size="default"
                            value={this.state.whenToEffect}
                            onChange={this.handleWhenToEffectChange}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                (String(this.state.dayOrHour) === '0' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
                                    .map((item, index) => {
                                        return (<Option value={item.value} key={index}>{item.label}</Option>);
                                    })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect, styles.priceInputSingle].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={'有效天数'}
                        required={true}
                    >
                        {getFieldDecorator('giftValidDays', {
                            value: { number: this.state.giftValidDays },
                            onChange: this.handleGiftValidDaysChange,
                            rules: [
                                { required: true, message: '有效天数为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) cb();
                                        v.number > 0 && v.number <= 9999 ? cb() : cb(rule.message);
                                    },
                                    message: '有效天数为1到9999'
                                },
                            ]
                        })(<PriceInput
                            addonBefore=""
                            addonAfter="天"
                            modal="int"
                        />)}
                    </FormItem>
                </div>
            </Form>
        )
    }

    render() {
        return (
            <Row>
                <Col span={12} offset={6}>
                    {this.renderCellNo()}
                    {this.renderGift()}
                    <FormItem
                        label="是否发送消息"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                    >
                        <Select size="default"
                                value={`${this.state.smsGate}`}
                                onChange={this.handleSmsGateChange}
                                getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                SEND_MSG.map((item) => {
                                    return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                                })
                            }
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        )
    }
}

export default Form.create()(SendGiftPanel);
