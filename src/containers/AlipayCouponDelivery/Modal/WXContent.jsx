import React, { Component } from 'react'
import { Form, Row, Col, Select } from 'antd'
import { getWeChatMpAndAppInfo } from '../AxiosFactory';
import styles from '../AlipayCoupon.less';

class WXContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mpAndAppList: [],
        };
    }
    componentDidMount() {
        this.initData();
    }

    initData = () => {
        getWeChatMpAndAppInfo().then((res) => {
            if (res) {
                this.setState({
                    mpAndAppList: res,
                })
            }
        })
    }


    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.DirectBox}>
                    <Form.Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        required={true}
                        className={styles.directSelect}
                        label={'选择公众号/小程序'}
                    >
                        {getFieldDecorator('jumpAppID', {
                            // initialValue: value || undefined,
                            rules: [
                                { required: true, message: '请选择公众号/小程序' },
                            ],
                        })(<Select placeholder={'请选择公众号/小程序'}>
                            {
                                this.state.mpAndAppList.map(({ channelAccount, channelName }) => (
                                    <Select.Option key={channelAccount} value={`${channelAccount}`}>{channelAccount} - {channelName}</Select.Option>
                                ))
                            }
                        </Select>)}
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        required={true}
                        className={styles.directSelect}
                        label={'账务主体'}
                    >
                        {getFieldDecorator('jumpAppID', {
                            // initialValue: value || undefined,
                            rules: [
                                { required: true, message: '请选择账务主体' },
                            ],
                        })(<Select placeholder={'请选择账务主体'}>
                            {
                                this.props.shopPid.map(({ channelAccount, channelName }) => (
                                    <Select.Option key={channelAccount} value={`${channelAccount}`}>{channelAccount} - {channelName}</Select.Option>
                                ))
                            }
                        </Select>)}
                    </Form.Item>
                </Col>
            </Row>
        )
    }
}
export default Form.create()(WXContent);
