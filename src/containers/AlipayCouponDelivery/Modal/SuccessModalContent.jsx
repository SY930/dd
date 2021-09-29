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

class SuccessModalContent extends Component {
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


    render() {
        const { form, couponList } = this.props;
        const { getFieldDecorator } = form;
        const { couponValue, linkWay } = this.state;
        return (
            <Modal
                title="新建支付成功页投放"
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.onCancel}
                onOk={this.handleSubmit}
            >
                <Row>
                    <Col span={24} offset={1} className={styles.IndirectBox}>
                        <Form className={styles.SuccessModalContentBox}>
                            <FormItem
                                label="活动名称"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('eventName', {
                                    rules: [
                                        { required: true, message: '请输入活动名称' },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入活动名称"
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="选择第三方支付宝券"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {/* TODO:根据itemID选出giftItemID */}
                                {
                                    getFieldDecorator('giftItemID', {
                                        // initialValue: editData.giftItemID || '',
                                        onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择第三方支付宝券' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择一个支付宝大促'}>
                                            {
                                                couponList.map(({ giftName, itemID }) => (
                                                    <Select.Option key={itemID} value={itemID}>{giftName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {/* TODO: 跳转 */}
                            {
                                !couponList.length && <FormItem
                                    style={{ padding: 0 }}
                                    label=""
                                    wrapperCol={{ offset: 5, span: 16 }}
                                >
                                    <p className={styles.authorizeBottomTip}>
                                        <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                                        没有可用第三方支付宝券？
                                        <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击创建</span>
                                    </p>
                                </FormItem>
                            }
                            {/* <FormItem
                                label="选择支付成功页"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('giftItemID', {
                                        // initialValue: editData.giftItemID || '',
                                        onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择支付成功页' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择支付成功页'}>
                                 
                                            <Select.Option key={itemID} value={itemID}>{giftName}</Select.Option>
                                        </Select>
                                    )
                                }
                            </FormItem> */}
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(SuccessModalContent)
