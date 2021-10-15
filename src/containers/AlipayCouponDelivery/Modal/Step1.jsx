import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal } from 'antd'
import moment from 'moment'
import AuthorizeModalContent from './AuthorizeContent';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import styles from '../AlipayCoupon.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
// 生效方式
const EFFECT_TYPE_OPT = [
    { label: '相对有效期', value: '1' },
    { label: '固定有效期', value: '2' },
];

// 相对有效期
const COUNT_TYPE_OPT = [
    { label: '按小时', value: '0' },
    { label: '按天', value: '1' },
];
const EFFECT_TYPE_OPT_TWO = [
    { label: '相对有效期', value: 'qbc' },
    { label: '固定有效期', value: 'dfd' },
];

class Step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successStartEnd: [],
            couponValue: '',
            effectType: '1', // 相对有效期
            dayOrHour: '0', // 按天 按小时
            whenToEffect: '0', // 何时生效
            giftValidDays: '', // 有效天数
            giftValidRange: [], // 固定有效期
            linkWay: '0', // 支付宝链接方式
            authorizeModalVisible: false, // 代运营授权弹窗
        }
    }

    componentDidMount() {
        const { getForm = () => { }, form } = this.props;
        getForm(form);
    }

    // 日期
    handleRangeChange = (date, dateString) => {
        console.log('🚀 ~ file: SuccessModalContent.jsx ~ line 16 ~ SuccessModalContent ~ handleRangeChange ~ val', date, dateString)
        this.setState({
            successStartEnd: dateString,
        })
    }

    // 优惠券
    handleCouponChange = (value) => {
        console.log('🚀 ~ file: SuccessModalContent.jsx ~ line 49 ~ SuccessModalContent ~ value', value)
        this.setState({
            couponValue: value,
        })
    }

    // 生效方式
    handleEffectTypeChange = (e) => {
        this.setState({
            effectType: e.target.value,
        })
    }

    // 相对有效期
    handleDayOrHourChange = (e) => {
        const dayOrHour = e.target.value;
        let whenToEffect = '1';
        if (dayOrHour === '0') {
            whenToEffect = '0';
        }
        this.setState({
            dayOrHour,
            whenToEffect,
        })
    }

    // 何时生效
    handleWhenToEffectChange = (val) => {
        this.setState({
            whenToEffect: val,
        })
    }

    // 有效天数
    handleGiftValidDaysChange = (val) => {
        this.setState({
            giftValidDays: val.number,
        })
    }

    // 固定有效期
    handleGiftValidRangeChange = (val) => {
        this.setState({
            giftValidRange: val,
        })
    }

    handleLinkWay = (e) => {
        this.setState({
            linkWay: e.target.value,
        })
    }

    // 选择间连主体
    handleIndirectSelect = (value) => {

    }

    // 选择直连主体
    handleDirectSelect = () => {

    }

    handleAuthSubmit = (form) => {
        form.validateFields((err, values) => {
            if (!err) {
                console.log('handleAuthSubmit', values);
                // TODO:请求接口 关闭弹窗
            }
        })
    }

    handleAuthModalClose = () => {
        this.setState({
            authorizeModalVisible: false,
        })
    }

    goAuthorize = () => {
        this.setState({
            authorizeModalVisible: true,
        })
    }

    // 直连
    renderDirect = () => {
        return (
            <Row>
                <Col span={16} offset={4} className={styles.DirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.directSelect}
                    >
                        <Select onChange={this.handleDirectSelect} placeholder={'请选择支付宝pid号'}>
                            {
                                EFFECT_TYPE_OPT.map(({ label, value }) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        )
    }

    // 间连
    renderIndirect = () => {
        // const { form } = this.props;
        // const { getFieldDecorator } = form;
        const { authorizeModalVisible } = this.state;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.IndirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.indirectSelect}
                    >

                        <Select onChange={this.handleIndirectSelect}>
                            {
                                EFFECT_TYPE_OPT.map(({ label, value }) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))
                            }
                        </Select>
                        {/* <Icon type="close-circle" /> */}
                        <span className={styles.authorizeTip}> <Icon type="check-circle" /> 已授权</span>

                    </FormItem>
                    <p className={styles.authorizeBottomTip}>
                        <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                        商户完成支付宝代运营授权才可完成创建投放活动。
                        <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击去授权</span>
                    </p>
                </Col>
                <Col>
                    <Modal
                        title="代运营授权"
                        maskClosable={true}
                        width={520}
                        visible={authorizeModalVisible}
                        onCancel={this.handleAuthModalClose}
                    >
                        <AuthorizeModalContent
                            onCancel={this.handleAuthModalClose}
                            handleSubmit={this.handleAuthSubmit}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    // 优惠券
    renderCoupon = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.CouponGiftBox}>
                    <FormItem
                        label="投放数量"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('giftNo', {
                            // value: { number: this.state.giftNo },
                            // onChange: this.handleGiftNumChange,
                            rules: [
                                { required: true, message: '投放数量为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        v.number > 0 && v.number <= 50 ? cb() : cb(rule.message);
                                    },
                                    message: '礼品个数为1到50',
                                },
                            ],
                        })(<PriceInput
                            // addonBefore={'礼品个数:'}
                            addonAfter="个"
                            modal="int"
                        />)}
                    </FormItem>
                    <FormItem
                        label="生效方式"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <RadioGroup
                            value={this.state.effectType}
                            onChange={this.handleEffectTypeChange}
                        >
                            {
                                EFFECT_TYPE_OPT.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.effectType === '1' && (
                            <div>
                                <FormItem
                                    label="相对有效期"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <span className={styles.formLabel}></span>
                                    <RadioGroup
                                        className={styles.radioMargin}
                                        value={this.state.dayOrHour}
                                        onChange={this.handleDayOrHourChange}
                                    >
                                        {
                                            COUNT_TYPE_OPT.map((item, index) => {
                                                return <Radio value={item.value} key={index}>{item.label}</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem>
                                <FormItem
                                    label="何时生效"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <Select
                                        size="default"
                                        value={this.state.whenToEffect}
                                        onChange={this.handleWhenToEffectChange}
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
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    label={'有效天数'}
                                >
                                    {getFieldDecorator('giftValidDays', {
                                        value: { number: this.state.giftValidDays },
                                        onChange: this.handleGiftValidDaysChange,
                                        rules: [
                                            // { required: true, message: '有效天数为必填项' },
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v) {
                                                        return cb();
                                                    }
                                                    v.number > 0 ? cb() : cb(rule.message);
                                                },
                                                message: '有效天数必须大于0',
                                            },
                                        ],
                                    })(<PriceInput
                                        addonBefore=""
                                        addonAfter="天"
                                        maxNum={5}
                                        modal="int"
                                    />)}
                                </FormItem>
                            </div>
                        )
                    }
                    {
                        this.state.effectType === '2' && (
                            <FormItem
                                label="固定有效期"
                                className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 16 }}
                            >{getFieldDecorator('giftValidRange', {
                                    onChange: this.handleGiftValidRangeChange,
                                    rules: [
                                        { required: true, message: '请输入有效时间' },
                                    ],
                                })(
                                    <RangePicker
                                        format="YYYY-MM-DD"
                                        // disabledDate={
                                        // current => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                                        // }
                                    />
                                )}
                            </FormItem>
                        )
                    }
                </Col>
            </Row>
        )
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { couponValue, linkWay } = this.state;
        return (
            <Row>
                <Col span={24} offset={1}>
                    <Form className={styles.crmSuccessModalContentBox}>
                        <FormItem
                            label="活动名称"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {getFieldDecorator('title', {
                                rules: [
                                    { required: true, message: '请输入活动名称' },
                                ],
                            })(
                                <Input
                                    placeholder="请输入投放名称"
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="起止时间"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {getFieldDecorator('rangePicker', {
                                rules: [{ required: true, message: '请输入日期' }],
                                onchange: this.handleRangeChange,
                            })(
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabledDate={null}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="选择优惠券"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {
                                getFieldDecorator('Coupon', {
                                    onChange: this.handleCouponChange,
                                    rules: [
                                        { required: true, message: '请选择优惠券' },
                                    ],
                                })(
                                    <Select >
                                        {
                                            EFFECT_TYPE_OPT.map(({ label, value }) => (
                                                <Select.Option key={value} value={value}>{label}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        {couponValue && this.renderCoupon()}
                        <FormItem
                            label="支付宝链接方式"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                        // required={true}
                        >
                            {getFieldDecorator('linkWay', {
                                onChange: this.handleLinkWay,
                                initialValue: linkWay,
                                // rules: [{ required: true, message: '请输入活动名称' }],

                            })(
                                <RadioGroup>
                                    <RadioButton value="0">间连</RadioButton>
                                    <RadioButton value="1">直连</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        { linkWay === '0' && this.renderIndirect() }
                        { linkWay === '1' && this.renderDirect()}
                        <FormItem
                            label="跳转小程序"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {getFieldDecorator('title', {
                                rules: [
                                    { required: true, message: '请输入小程序appid' },
                                ],
                            })(
                                <Input
                                    placeholder="请输入小程序appid"
                                />
                            )}
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default Form.create()(Step1)
