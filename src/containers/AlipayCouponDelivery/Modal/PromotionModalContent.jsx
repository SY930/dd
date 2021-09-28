import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Steps, Button, Modal } from 'antd'
import { getAlipayRecruitPlan, getBatchDetail } from '../AxiosFactory'
import Step1 from './Step1'
import Step2 from './Step2'
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';

import styles from '../AlipayCoupon.less';

const { Step } = Steps;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class PromotionModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: '',
            recruitPlans: {}, // 报名活动原数据
            enrollRules: [], // 报名展示信息
            couponDetail: {}, // 优惠券详情
        }
    }

    getAlipayRecruitPlans = (v) => {
        getAlipayRecruitPlan(v).then((res) => {
            if (res) {
                // if ()
                this.setState({
                    recruitPlans: res,
                    enrollRules: res.enrollRules.length ? res.enrollRules : [],
                })
            }
        })
    }

    handlePromotionChange = (value) => {
        this.setState({
            planId: value,
        })
        this.getAlipayRecruitPlans(value)
    }

    handleCouponChange = (value) => {
        getBatchDetail(value).then((res) => {
            this.setState({
                couponDetail: res,
            })
        })
    }


    render() {
        // const { planId } = this.state;
        const { form, couponList, promotionList } = this.props;
        const { getFieldDecorator } = form;
        return (

            <Modal
                title="新建会场大促投放"
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.onCancel}
                onOk={this.handleSubmit}
            >
                <Row>
                    <Col span={24} offset={1} className={styles.IndirectBox}>
                        <Form className={styles.crmSuccessModalContentBox}>
                            <FormItem
                                label="第三方券名称"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('batchName', {
                                    // initialValue: editData.batchName || '',
                                    rules: [
                                        { required: true, message: '请输入第三方券名称' },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入投放名称"
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="选择第三方支付宝券"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
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
                                                couponList.map(({ giftItemID, giftName }) => (
                                                    <Select.Option key={giftItemID} value={giftItemID}>{giftName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="选择支付宝大促"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('planId', {
                                        // initialValue: editData.giftItemID || '',
                                        onChange: this.handlePromotionChange,
                                        rules: [
                                            { required: true, message: '请选择支付宝大促' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择一个支付宝大促'}>
                                            {
                                                promotionList.map(({ planId, planName }) => (
                                                    <Select.Option key={planId} value={planId}>{planName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {/* {planId && this.renderPromotion()} */}
                            <FormItem
                                label="活动详情"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                // required={true}
                            >
                                {getFieldDecorator('jumpAppID', {
                                    // initialValue: editData.jumpAppID,
                                })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入活动详情"
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                </Row>

            </Modal>
        )
    }
}

export default Form.create()(PromotionModalContent)
