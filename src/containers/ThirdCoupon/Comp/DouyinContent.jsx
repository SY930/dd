import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Radio } from 'antd'
import { getMpAppList, getPayChannel } from '../AxiosFactory';
import styles from '../AlipayCoupon.less';

const RadioGroup = Radio.Group;

class DouyinContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
    }


    initData = () => {
    }


    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={24}>
                    <Form.Item
                        label="抖音店铺ID"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 9 }}
                        required={true}
                    >
                        {getFieldDecorator('shopId', {
                            rules: [
                                { required: true, message: '请输入抖音店铺ID' },
                            ],
                        })(
                            <Input
                                placeholder="请输入抖音店铺ID"
                                style={{ height: '30px' }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="是否需要兑换"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 9 }}
                        required={true}
                    >
                        {getFieldDecorator('isExchange', {
                            initialValue: '1',
                            rules: [
                                { required: true },
                            ],
                        })(
                            <RadioGroup>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>
                    {/*  */}
                </Col>
            </Row>
        )
    }
}
export default Form.create()(DouyinContent);
