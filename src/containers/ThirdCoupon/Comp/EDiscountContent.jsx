import React, { Component } from 'react'
import { Form, Row, Col, Modal, Input, Checkbox } from 'antd'
import { eZheAgreement } from '../config'
// import { getMpAppList, getDouyinShop } from '../AxiosFactory';
// import styles from '../AlipayCoupon.less';

// const RadioGroup = Radio.Group;

class EDiscountContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList: [],
            agreementVisible: false,
        };
    }
    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps() {
    }


    initData = () => {
    }

    handleEdiscountView = () => {
        this.setState({
            agreementVisible: true,
        })
    }

    handleEdiscountClose = () => {
        this.setState({
            agreementVisible: false,
        })
    }


    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="优惠券面值"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 7 }}
                            // required={true}
                        >
                            {getFieldDecorator('giftFaceValue', {
                                initialValue: this.props.giftValue,
                                rules: [
                                    // { required: true, message: '请输入优惠券面值' },
                                    { pattern: /(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/, message: '整数不能超过5位, 小数不能超过2位' },
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v) {
                                                return cb();
                                            }
                                            if (v <= 0) {
                                                return cb(rule.message);
                                            }
                                            cb();
                                        },
                                        message: '必须输入数字, 且大于0',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="请输入优惠券面值"
                                    type="number"
                                    min={0}
                                    style={{ height: '30px' }}
                                    addonAfter="元"
                                    // defaultValue={this.props.giftValue}
                                    disabled={!!this.props.giftValue}
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="投放价格"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {getFieldDecorator('deliveryValue', {
                                rules: [
                                    { required: true, message: '请输入投放价格' },
                                    { pattern: /(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/, message: '整数不能超过5位, 小数不能超过2位' },
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v) {
                                                return cb();
                                            }
                                            if (v <= 0) {
                                                return cb(rule.message);
                                            }
                                            cb();
                                        },
                                        message: '必须输入数字, 且大于0',
                                    },
                                ],
                            })(
                                <div style={{ display: 'flex' }}>
                                    <Input
                                        placeholder="请输入投放价格"
                                        type="number"
                                        min={0}
                                        style={{ height: '30px' }}
                                        addonAfter="元"
                                    />
                                    <span style={{ height: '30px', flex: '1 0 53%', marginLeft: '11.5px', fontSize: 12, color: '#999' }}> 投放价格是指E折平台与商户结算价格 </span>
                                </div>
                                
                            )}
                        </Form.Item>
                        <Form.Item
                            label=""
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 9, offset: 1 }}
                            required={true}
                        >
                            {getFieldDecorator('chekbox', {
                                // valuePropName: 'checked',
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v) {
                                                return cb(rule.message)
                                            }
                                            cb();
                                        },
                                        message: '请勾选《E折券投放协议》',
                                    },
                                ],
                            })(
                                <Checkbox >请阅读并同意<a href="javascript:;" onClick={this.handleEdiscountView} style={{ color: 'rgba(25, 145, 255, 1)' }}>《E折券投放协议》</a></Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Modal
                    title="E折券投放协议"
                    maskClosable={true}
                    width={520}
                    visible={this.state.agreementVisible}
                    onCancel={this.handleEdiscountClose}
                    footer={null}
                >
                    <div
                        style={{ wordBreak: 'break-all', paddingRight: 14 }}
                        dangerouslySetInnerHTML={{ __html: eZheAgreement }}
                    ></div>
                    {/* 这里是《E折券投放协议》
                     */}
                    {/* {eZheAgreement} */}
                </Modal>
            </div>
        )
    }
}
export default Form.create()(EDiscountContent);
