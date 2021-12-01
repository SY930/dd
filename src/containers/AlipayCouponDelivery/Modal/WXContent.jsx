import React, { Component } from 'react'
import { Form, Row, Col, Select } from 'antd'
import { getMpAppList, getPayChannel } from '../AxiosFactory';
import styles from '../AlipayCoupon.less';

class WXContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mpAndAppList: [],
            payChannelList: [],
        };
    }
    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
        const { form } = this.props;
        if (nextProps.merchantType !== this.props.merchantType) {
            const channelCode = nextProps.merchantType == '1' ? 'wechat' : 'hualalaAinong';
            form.setFieldsValue({ settleID: '' })
            getPayChannel(channelCode).then((res) => {
                this.setState({
                    payChannelList: res,
                })
            })
        }
    }


    onChangeWXMerchantID = (value) => {
        const findItem = this.state.payChannelList.find(item => value === `${item.settleID}`) || {}
        this.props.onChangeWXMerchantID(findItem)
    }

    onChangeWXJumpAppID = ({ key, label }) => {
        this.props.onChangeWXJumpAppID({ key, label })
    }

    initData = () => {
        getMpAppList().then((res) => {
            if (res) {
                this.setState({
                    mpAndAppList: res,
                })
            }
        })
        getPayChannel('wechat').then((res) => {
            this.setState({
                payChannelList: res,
            })
        })
    }


    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={16} offset={5} className={styles.DirectBox}>
                    <Form.Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        required={true}
                        className={styles.directSelect}
                        label={'选择小程序'}
                    >
                        {getFieldDecorator('jumpAppID', {
                            // initialValue: value || undefined,
                            onChange: this.onChangeWXJumpAppID,
                            rules: [
                                { required: true, message: '请选择小程序' },
                            ],
                        })(<Select placeholder={'请选择小程序'} labelInValue>
                            {
                                this.state.mpAndAppList.map(({ appID, nickName }) => (
                                    <Select.Option key={appID} value={`${appID}`}>{nickName}</Select.Option>
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
                        {getFieldDecorator('settleID', {
                            // initialValue: value || undefined,
                            onChange: this.onChangeWXMerchantID,
                            rules: [
                                { required: true, message: '请选择账务主体' },
                            ],
                        })(<Select placeholder={'请选择账务主体'}>
                            {
                                (this.state.payChannelList || []).map(item => (
                                    <Select.Option key={item.settleID} value={`${item.settleID}`}>{item.settleName}</Select.Option>
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