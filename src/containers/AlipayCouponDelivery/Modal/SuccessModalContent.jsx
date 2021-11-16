import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Icon, Modal, message } from 'antd'
import { jumpPage } from '@hualala/platform-base';
// import moment from 'moment'
import { getBatchDetail, getDeliveryChannel, getAlipayCouponList, isAuth } from '../AxiosFactory'
import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less';

const FormItem = Form.Item;


class SuccessModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successStartEnd: [],
            deliveryChannelInfoList: [],
            couponDetail: {}, // 优惠券详情
            couponList: [],
            confirmLoading: false,
        }
    }

    componentDidMount() {
        getAlipayCouponList().then((res) => {
            this.setState({
                couponList: res,
            })
        })
    }

    getDeliveryChannels = (record) => {
        getDeliveryChannel({ merchantId: record.merchantID, merchantIdType: record.merchantType }).then((res) => {
            if (res) {
                this.setState({
                    deliveryChannelInfoList: res,
                })
            }
        })
    }

    goCreateCoupon = () => {
        this.props.onCancel();
        jumpPage({ menuID: '100008992' })
    }

    handleCouponChange = (value) => {
        getBatchDetail(value).then((res) => {
            // const merchantID = res.merchantID;
            // 根据merchantID获取选择支付成功页
            this.getDeliveryChannels(res)
            this.setState({
                couponDetail: res,
            })
        })
    }

    handleSubmit = () => {
        const { form } = this.props;
        const { couponDetail } = this.state
        this.setState({
            confirmLoading: true,
        })
        form.validateFields((err, values) => {
            if (!err) {
                // console.log('handleSubmit', values);
                const data = {
                    eventName: values.eventName,
                    eventWay: '20001', // 大促20002 成功 20001
                    platformType: '1',
                    deliveryType: 1, // 2代表大促活动  1代表成功页
                    merchantID: couponDetail.merchantID, // 直连间连 pid smid
                    merchantType: couponDetail.merchantType, // 直连 间连
                    deliveryInfo: values.channelID,
                    giftConfInfos: [{
                        giftID: couponDetail.itemID,
                    }],
                }
                const params = { trdEventInfo: { ...data } };
                axiosData(
                    'trdEventService/addEvent.ajax',
                    params,
                    null,
                    { path: '' },
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                )
                    .then((res) => {
                        const { code, message: msg } = res;
                        if (code === '000') {
                            message.success('创建成功');
                            this.props.onCancel();
                            this.props.handleQuery(null, null, { eventWays: ['20001'] });
                            this.setState({
                                confirmLoading: false,
                            })
                            return
                        }
                        this.setState({
                            confirmLoading: false,
                        })
                        message.error(msg);
                    }, (error) => {
                        this.setState({
                            confirmLoading: false,
                        })
                        this.props.onCancel();
                        console.log(error)
                    })
            }
        })
    }

    render() {
        const { form, editData = {} } = this.props;
        const { giftConfInfos = [] } = editData;
        const { getFieldDecorator } = form;
        const { confirmLoading } = this.state;
        return (
            <Modal
                title="新建支付成功页投放"
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.onCancel}
                onOk={this.handleSubmit}
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={24} offset={1} className={styles.IndirectBox}>
                        <Form className={styles.crmSuccessModalContentBox}>
                            <FormItem
                                label="活动名称"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('eventName', {
                                    initialValue: editData.eventName || '',
                                    rules: [
                                        { required: true, message: '请输入活动名称' },
                                        { max: 20, message: '活动名称20字以内' },
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
                                {
                                    getFieldDecorator('itemID', {
                                        initialValue: giftConfInfos[0] ? giftConfInfos[0].giftID : undefined,
                                        onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择第三方支付宝券' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择第三方支付宝券'}>
                                            {
                                                (this.state.couponList || []).map(({ batchName, itemID }) => (
                                                    <Select.Option key={itemID} value={`${itemID}`}>{batchName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {/* TODO: 跳转 */}
                            {
                                !(this.state.couponList.length) && <FormItem
                                    style={{ padding: 0 }}
                                    label=""
                                    wrapperCol={{ offset: 5, span: 16 }}
                                >
                                    <p className={styles.authorizeBottomTip}>
                                        <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                                        没有可用第三方支付宝券？
                                        <span className={styles.goAuthorize} onClick={() => { this.goCreateCoupon() }}>点击创建</span>
                                    </p>
                                </FormItem>
                            }
                            <FormItem
                                label="选择支付成功页"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('channelID', {
                                        initialValue: editData.deliveryInfo || undefined,
                                        // onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择支付成功页' },
                                        ],
                                    })(
                                        <Select placeholder={'请先选择第三方支付宝券'}>
                                            {
                                                (this.state.deliveryChannelInfoList || []).map(({ channel, channelName }) => (
                                                    <Select.Option key={channel} value={channel}>{channelName} - {channel}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default Form.create()(SuccessModalContent)
