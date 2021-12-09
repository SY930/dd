import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Radio, Icon, Tooltip } from 'antd'
import { getMpAppList, getPayChannel, getLinks } from '../AxiosFactory';
import styles from '../AlipayCoupon.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

const validateWayList = [
    {
        value: 'OFF_LINE',
        label: '出示二维码核销',
    },
    {
        value: 'MINI_PROGRAMS',
        label: '跳转小程序使用',
    },
]
class WXContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mpAndAppList: [],
            payChannelList: [],
            validateWay: 'OFF_LINE',
            linksList: [],
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
        getLinks().then((res) => {
            this.setState({
                linksList: res,
            })
        })
        // getlinks = () => {
        //     axiosData('/link/getlinks', {
        //         type: 'mini_menu_type',
        //     }, null, {
        //         path: '',
        //     }, 'HTTP_SERVICE_URL_WECHAT')
        //         .then((res) => {
        //             const { result, linkList } = res
        //             const code = (result || {}).code
        //             if (code === '000') {
        //                 this.setState({
        //                     linksList: linkList || []
        //                 })
        //             }
        //         })
        // }
    }

    handleChangeValidateWay = ({ target: x }) => {
        this.setState({
            validateWay: x.value,
        })
    }


    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const icon = (<span>小程序名称<Tooltip title="用户领取微信商家券后，同步在小程序/公众号个人中心展示。"><Icon type="question-circle-o" style={{ marginLeft: 5 }} /></Tooltip></span>)
        return (
            <div>
                <Row>
                    <Col span={16} offset={5} className={styles.DirectBox}>
                        <Form.Item
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                            className={styles.directSelect}
                            label={icon}
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
                            labelCol={{ span: 6 }}
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
                <Form.Item
                    label="用户最大领取数量"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 9 }}
                    required={true}
                >
                    {getFieldDecorator('maxCouponsPerUser', {
                        rules: [
                            { required: true, message: '请输入用户最大领取数量' },
                            {
                                validator: (rule, v, cb) => {
                                    if (!v) {
                                        return cb();
                                    }
                                    if (v > 10 || v <= 0) {
                                        return cb(rule.message);
                                    }
                                    cb();
                                },
                                message: '必须输入数字, 且大于0小于10',
                            },
                        ],
                    })(
                        <Input
                            placeholder="请输入用户最大领取数量"
                            addonAfter="个"
                            type="number"
                            min={0}
                            style={{ height: '30px' }}
                        />
                    )}
                </Form.Item>
                <Form.Item
                    label="券code模式"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    required={true}
                >
                    {getFieldDecorator('couponCodeDockingType', {
                        initialValue: '1',
                        rules: [
                            { required: true },
                        ],
                    })(
                        <RadioGroup>
                            <Radio value="3">WECHATPAY_MODE</Radio>
                            <Radio value="1">MERCHANT_API</Radio>
                        </RadioGroup>
                    )}
                </Form.Item>
                <Form.Item
                    label="核销方式"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    required={true}
                >
                    {getFieldDecorator('validateWay', {
                        initialValue: 'OFF_LINE',
                        onChange: this.handleChangeValidateWay,
                        rules: [
                            { required: true },
                        ],
                    })(
                        <RadioGroup>
                            <RadioButton value="OFF_LINE">线下二维码核销</RadioButton>
                            <RadioButton value="MINI_PROGRAMS">跳转小程序使用</RadioButton>
                        </RadioGroup>
                    )}
                </Form.Item>
                {
                    this.state.validateWay === 'MINI_PROGRAMS' && <Row>
                        <Col span={16} offset={5} className={styles.DirectBox}>
                            <Form.Item
                                label={icon}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                                className={styles.directSelect}
                            >
                                {getFieldDecorator('miniProgramsAppId', {
                                    rules: [
                                        { required: true, message: '请选择小程序名称' },
                                    ],
                                })(
                                    <Select
                                        placeholder="请选择小程序名称"
                                    >
                                        {
                                            this.state.mpAndAppList.map(({ appID, nickName }) => (
                                                <Select.Option key={appID} value={`${appID}`}>{nickName}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label="页面路径"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                className={styles.directSelect}
                            >
                                {getFieldDecorator('miniProgramsPath', {
                                    rules: [
                                        { required: true, message: '请选择页面路径' },
                                    ],
                                })(
                                    <Select
                                        placeholder="请选择页面路径"
                                    >
                                        {
                                            this.state.linksList.map((mp) => {
                                                const data = mp.value || {}
                                                return <Option key={data.urlTpl} value={data.urlTpl}>{data.title}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}
export default Form.create()(WXContent);
