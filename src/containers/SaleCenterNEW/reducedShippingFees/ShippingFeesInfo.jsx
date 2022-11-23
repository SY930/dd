/*
 * @Author: Songnana
 * @Date: 2022-11-22 18:30:19
 * @Modified By: modifier Songnana
 * @Descripttion:
 */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, Input, Radio, Row, Col } from 'antd'
import BaseForm from '../../../components/common/BaseForm';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import styles from '../ActivityPage.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItems = {
    targetScope: {
        type: 'radio',
        label: '活动门槛',
        defaultValue: '0',
        rules: ['required'],
        options: [
            { label: '无门槛', value: '0' },
            { label: '按金额', value: '1' },
            { label: '按件数', value: '2' },
        ],
    },
    orderAmount: {
        type: 'custom',
        label: '',
        render: (d, form) => {
            const { targetScope } = form.getFieldsValue()
            if (targetScope === '1') {
                return (<Row className={styles.shippingFeesInfo_orderAmount}>
                    <Col>
                        <FormItem
                            label="订单金额满"
                            wrapperCol={{ span: 18 }}
                            labelCol={{ span: 6 }}
                        >
                            {
                                d({
                                    initialValue: 1,
                                    rules: [{
                                        // /^([0-9]\d{0,3}|(^\+?\d{0,3}\.\d{0,1}$))$/
                                        pattern: /^([0-9]\d{0,6}|(^\+?\d{0,6}\.\d{0,1}$))$/,
                                        message: '金额输入框支持大于0的正数,支持1位小数，最大值999999',
                                    }],
                                })(<Input suffix="元" />)
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem
                            label="是否包含打包费"
                            wrapperCol={{ span: 14 }}
                            labelCol={{ span: 8 }}
                        >
                            {
                                d({
                                    key: 'pakckageAmountInclude',
                                    initialValue: '0',
                                })(<RadioGroup>
                                    <Radio key={'0'} value={'0'}>不包含</Radio>
                                    <Radio key={'1'} value={'1'}>包含</Radio>
                                </RadioGroup>)
                            }
                        </FormItem>
                    </Col>
                </Row>
                )
            }
            return null
        },
    },
    thresholdAmount: {
        type: 'custom',
        label: '',
        render: (d, form) => {
            const { targetScope } = form.getFieldsValue()
            if (targetScope === '2') {
                return (<Row>
                    <Col offset={5}>
                        <FormItem
                            label="件数满"
                            wrapperCol={{ span: 19 }}
                            labelCol={{ span: 5 }}
                        >
                            {
                                d({
                                    key: 'thresholdAmount',
                                    initialValue: 1,
                                    rules: [{
                                        pattern: /^[0-9]\d{0,3}$/,
                                        message: '支持大于0的正整数，最大值999',
                                    }],
                                })(<Input suffix="元" />)
                            }
                        </FormItem>
                    </Col>
                </Row>)
            }
            return null
        },
    },
    stageType: {
        type: 'radio',
        label: '优惠金额',
        defaultValue: '0',
        rules: ['required'],
        options: [
            { label: '免费', value: '0' },
            { label: '立减', value: '1' },
        ],
    },
    freeAmount: {
        type: 'custom',
        label: '',
        render: (d, form) => {
            const { stageType } = form.getFieldsValue()
            if (stageType === '1') {
                return (
                    <FormItem
                        label=""
                        className={styles.freeAmountBox}
                        wrapperCol={{ span: 24 }}
                    >
                        {
                            d({
                                initialValue: 1,
                                rules: [{
                                    pattern: /^[0-9]\d{0,3}$/,
                                    message: '支持大于0的正整数，最大值999',
                                }],
                            })(<Input suffix="元" />)
                        }
                    </FormItem>
                )
            }
            return null
        },
    },
    useCountMaxLimit: {
        type: 'radio',
        label: '每人参与总次数',
        defaultValue: '0',
        rules: ['required'],
        options: [
            { label: '不限', value: '0' },
            { label: '限制', value: '1' },
        ],
    },
    customerUseCountMaxLimit: {
        type: 'custom',
        label: '',
        render: (d, form) => {
            const { useCountMaxLimit } = form.getFieldsValue()
            if (useCountMaxLimit === '1') {
                return (<Row>
                    <Col offset={5}>
                        <FormItem
                            label=""
                            wrapperCol={{ span: 24 }}
                            className={styles.useCountMaxLimitBox}
                        >
                            {
                                d({
                                    initialValue: 1,
                                    rules: [{
                                        pattern: /^[0-9]\d{0,3}$/,
                                        message: '支持大于0的正整数，最大值999',
                                    }],
                                })(<Input suffix="次/活动" />)
                            }
                        </FormItem>
                    </Col>
                </Row>)
            }
            return null
        },
    },
    useCountLimit: {
        type: 'radio',
        label: '每人每天参与次数',
        defaultValue: '0',
        rules: ['required'],
        options: [
            { label: '不限', value: '0' },
            { label: '限制', value: '1' },
        ],
    },
    customerUseCountLimit: {
        type: 'custom',
        label: '',
        render: (d, form) => {
            const { useCountLimit } = form.getFieldsValue()
            if (useCountLimit === '1') {
                return (<Row>
                    <Col offset={5}>
                        <FormItem
                            label=""
                            wrapperCol={{ span: 20 }}
                            className={styles.useCountMaxLimitBox}
                        >
                            {
                                d({
                                    initialValue: 1,
                                    rules: [{
                                        pattern: /^[0-9]\d{0,3}$/,
                                        message: '支持大于0的正整数，最大值999',
                                    }],
                                })(<Input suffix="次/活动" />)
                            }
                        </FormItem>
                    </Col>
                </Row>)
            }
            return null
        },
    },
}

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

class ShippingFeesInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {},
        }
        this.formKeys = ['targetScope', 'orderAmount', 'thresholdAmount', 'stageType', 'freeAmount', 'useCountMaxLimit', 'customerUseCountMaxLimit', 'useCountLimit', 'customerUseCountLimit']
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleSubmit = () => {
        this.shippingFeeForm.validateFields((err, values) => {
            if (!err) {
                const { targetScope, useCountMaxLimit, useCountLimit } = values
                const rule = { ...values };
                if (targetScope == '1') {
                    rule.stageAmount = values.orderAmount
                }
                if (targetScope == '2') {
                    rule.stageAmount = values.thresholdAmount
                }
                console.log("🚀 ~ file: ShippingFeesInfo.jsx ~ line 252 ~ ShippingFeesInfo ~ this.shippingFeeForm.validateFields ~ rule", rule)
                this.props.setPromotionDetail({
                    rule, // 为黑白名单而设
                    shippingFees: 2090,
                });
                return true;
            }
        })
    }
    render() {
        return (
            <div className={styles.shippingFeesInfoBox}>
                <BaseForm
                    getForm={(form) => { this.shippingFeeForm = form }}
                    formKeys={this.formKeys}
                    formItems={formItems}
                    formData={this.state.formData}
                    formItemLayout={formItemLayout}
                    // className={sty}
                // onChange={this.onChangeForm}
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShippingFeesInfo);
