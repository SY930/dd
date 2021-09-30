import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal, message } from 'antd'
import moment from 'moment'
import { getDeliveryChannel, getBatchDetail } from '../AxiosFactory'
import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less';

const FormItem = Form.Item;


class SuccessModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successStartEnd: [],
            deliveryChannelInfoList: props.deliveryChannelInfoList || [],
            couponDetail: {}, // 优惠券详情
            couponList: props.couponList || [],
        }
    }

    componentDidMount() {
        // getDeliveryChannel().then((res) => {
        //     if (res) {
        //         this.setState({
        //             deliveryChannelInfoList: res,
        //         })
        //     }
        // });
    }

    getDeliveryChannel = () => {

    }

    handleCouponChange = (value) => {
        getBatchDetail(value).then((res) => {
            this.setState({
                couponDetail: res,
            })
        })
    }

    handleSubmit = () => {
        const { form } = this.props;
        const { couponDetail } = this.state
        form.validateFields((err, values) => {
            if (!err) {
                console.log('handleSubmit', values);
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
                            // TODO: 关闭窗口 请求数据
                            return
                        }
                        message.error(msg);
                    }, (error) => {
                        console.log(error)
                        // 关闭窗口
                    })
                // TODO:请求接口 关闭弹窗
            }
        })
    }

    // handleAuthModalClose = () => {
    //     this.setState({
    //         authorizeModalVisible: false,
    //     })
    // }


    render() {
        const { form, couponList, editData = {} } = this.props;
        const { giftConfInfos = [] } = editData;
        console.log("🚀 ~ file: SuccessModalContent.jsx ~ line 97 ~ SuccessModalContent ~ render ~ editData", editData)
        const { getFieldDecorator } = form;
        // const { couponValue, linkWay } = this.state;
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
                                    getFieldDecorator('itemID', {
                                        initialValue: giftConfInfos[0] ? giftConfInfos[0].giftID : '',
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
                                        <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击创建</span>
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
                                        initialValue: editData.deliveryInfo || '',
                                        // onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择支付成功页' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择支付成功页'}>
                                            {
                                                (this.state.deliveryChannelInfoList || []).map(({ channel, channelName }) => (
                                                    <Select.Option key={channel} value={channel}>{channelName}</Select.Option>
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
