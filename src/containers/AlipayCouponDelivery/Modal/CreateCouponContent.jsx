import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal, TreeSelect, message, Table } from 'antd'
import moment from 'moment'
import { axios } from '@hualala/platform-base';
import AuthorizeModalContent from './AuthorizeContent';
import { getSmid, isAuth } from '../AxiosFactory'
import { SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
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

class CreateCouponContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successStartEnd: [],
            consumeGiftID: '',
            effectType: '1', // 相对有效期
            // dayOrHour: '0', // 按天 按小时  默认按天
            whenToEffect: '0', // 何时生效
            validUntilDays: '', // 有效天数
            giftValidRange: [], // 固定有效期
            merchantType: '1', // 支付宝链接方式
            authorizeModalVisible: false, // 代运营授权弹窗
            merchantID: '', // 选择的间连和直连
            smidList: [], // smid列表
            smidUserSelect: [], // 用户选择的smid
            smidModalVisible: false,
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
            consumeGiftID: value,
        })
    }

    // 生效方式
    handleEffectTypeChange = (e) => {
        this.setState({
            effectType: e.target.value,
        })
    }

    // 相对有效期
    // handleDayOrHourChange = (e) => {
    //     const dayOrHour = e.target.value;
    //     let effectGiftTimeHours = '1';
    //     if (dayOrHour === '0') {
    //         effectGiftTimeHours = '0';
    //     }
    //     this.setState({
    //         dayOrHour,
    //         effectGiftTimeHours,
    //     })
    // }

    // 何时生效
    handleWhenToEffectChange = (val) => {
        this.setState({
            effectGiftTimeHours: val,
        })
    }

    // 有效天数
    handleGiftValidDaysChange = (val) => {
        this.setState({
            validUntilDays: val.number,
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
            merchantType: e.target.value,
        })
    }

    // 选择间连主体
    handleIndirectSelect = (value) => {
        this.setState({
            merchantID: value,
        })
        // 根据选择的主体获取smid
        getSmid(value).then((res) => {
            if (!res) {
                return message.warn('该结算主体没有绑定smid，请选择其他主体！')
            }
            this.setState({
                smidList: res,
                // smidModalVisible: true,
            }, () => {
                this.handleSmidSubmit();
            })
        })
    }

    // 选择直连主体
    handleDirectSelect = (value) => {
        this.setState({
            merchantID: value,
        })

    }

    handleAuthSubmit = (form) => {
        form.validateFields((err, values) => {
            if (!err) {
                console.log('handleAuthSubmit', values);
                // TODO:请求接口 关闭弹窗
            }
        })
    }

    handleCloseModal = () => {
        this.props.handleCloseModal();
    }

    handleCloseSmidModal = () => {
        this.setState({
            smidModalVisible: false,
        })
    }

    handleAuthModalClose = () => {
        this.setState({
            authorizeModalVisible: false,
        })
    }

    goAuthorize = () => {
        this.setState({
            authorizeModalVisible: true,
        })
    }

    handleSmidSubmit = () => {
        const { smidUserSelect } = this.state;
        const { settleID } = smidUserSelect[0];
        // 去查看该主体有没有授权
        isAuth(settleID).then((res) => {
        console.log("🚀 ~ file: CreateCouponContent.jsx ~ line 166 ~ CreateCouponContent ~ isAuth ~ res", res)
            
        })
    }

    handleSubmit = () => {
        const { form } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                console.log('handleAuthSubmit', values);
                const { effectType, effectGiftTimeHours, merchantID, giftValidRange = [] } = this.state;
                const res = {
                    batchName: values.batchName,
                    channelID: 60,
                    couponCodeDockingType: 2,
                    stock: values.stock.number,
                    effectType,
                    effectGiftTimeHours,
                    endTime: giftValidRange[1] ? giftValidRange[1] : '',
                    startTime: giftValidRange[0] ? giftValidRange[1] : '',
                    giftItemID: values.giftItemID,
                    giftType: 10,
                    jumpAppID: values.jumpAppID,
                    merchantID,
                    merchantType: values.merchantType,
                    platformType: 1,
                    validUntilDays: values.validUntilDays.number,
                }
                const url = '/api/v1/universal?';
                const mothod = 'couponCodeBatchService/addBatch.ajax';
                const params = {
                    service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
                    type: 'post',
                    data: res,
                    mothod,
                };
                axios.post(url + mothod, params).then((res) => {
                    if (res.code === '000') {
                        return message.success('创建成功')
                    }
                    message.error(res.message)

                }).catch((err) => {

                })

            }
        })
    }

    // 直连
    renderDirect = () => {
        return (
            <Row>
                <Col span={16} offset={4} className={styles.DirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.directSelect}
                    >
                        <Select onChange={this.handleDirectSelect} placeholder={'请选择支付宝pid号'}>
                            {
                                this.props.shopPid.map(({ channelAccount, channelName }) => (
                                    <Select.Option key={channelAccount} value={`${channelAccount}`}>{channelName}</Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        )
    }

    // 间连
    renderIndirect = () => {
        // const { form } = this.props;
        // const { getFieldDecorator } = form;
        const { authorizeModalVisible } = this.state;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.IndirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.indirectSelect}
                    >

                        <Select onChange={this.handleIndirectSelect}>
                            {
                                this.props.indirectList.map(({ settleUnitName, settleUnitID }) => (
                                    <Select.Option key={settleUnitID} value={`${settleUnitID}`}>{settleUnitName}</Select.Option>
                                ))
                            }
                        </Select>
                        {/* <Icon type="close-circle" /> */}
                        <span className={styles.authorizeTip}> <Icon type="check-circle" /> 已授权</span>

                    </FormItem>
                    <p className={styles.authorizeBottomTip}>
                        <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                        商户完成支付宝代运营授权才可完成创建投放活动。
                        <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击去授权</span>
                    </p>
                </Col>
                <Col>
                    <Modal
                        title="代运营授权"
                        maskClosable={true}
                        width={520}
                        visible={authorizeModalVisible}
                        onCancel={this.handleAuthModalClose}
                    >
                        <AuthorizeModalContent
                            onCancel={this.handleAuthModalClose}
                            handleSubmit={this.handleAuthSubmit}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    // 优惠券
    renderCoupon = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.CouponGiftBox}>
                    <FormItem
                        label="投放数量"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('stock', {
                            // value: { number: this.state.giftNo },
                            // onChange: this.handleGiftNumChange,
                            rules: [
                                { required: true, message: '投放数量为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        v.number > 0 && v.number <= 50 ? cb() : cb(rule.message);
                                    },
                                    message: '礼品个数为1到50',
                                },
                            ],
                        })(<PriceInput
                            // addonBefore={'礼品个数:'}
                            addonAfter="个"
                            modal="int"
                        />)}
                    </FormItem>
                    <FormItem
                        label="生效方式"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <RadioGroup
                            value={this.state.effectType}
                            onChange={this.handleEffectTypeChange}
                        >
                            {
                                EFFECT_TYPE_OPT.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.effectType === '1' && (
                            <div>
                                {/* <FormItem
                                    label="相对有效期"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <span className={styles.formLabel}></span>
                                    <RadioGroup
                                        className={styles.radioMargin}
                                        value={this.state.dayOrHour}
                                        onChange={this.handleDayOrHourChange}
                                    >
                                        {
                                            COUNT_TYPE_OPT.map((item, index) => {
                                                return <Radio value={item.value} key={index}>{item.label}</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem> */}
                                <FormItem
                                    label="生效时间"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <Select
                                        size="default"
                                        value={this.state.effectGiftTimeHours}
                                        onChange={this.handleWhenToEffectChange}
                                    >
                                        {
                                            (SALE_CENTER_GIFT_EFFICT_DAY)
                                                .map((item, index) => {
                                                    return (<Option value={item.value} key={index}>{item.label}</Option>);
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    label={'有效天数'}
                                >
                                    {getFieldDecorator('validUntilDays', {
                                        value: { number: this.state.validUntilDays },
                                        onChange: this.handleGiftValidDaysChange,
                                        rules: [
                                            // { required: true, message: '有效天数为必填项' },
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v) {
                                                        return cb();
                                                    }
                                                    v.number > 0 ? cb() : cb(rule.message);
                                                },
                                                message: '有效天数必须大于0',
                                            },
                                        ],
                                    })(<PriceInput
                                        addonBefore=""
                                        addonAfter="天"
                                        maxNum={5}
                                        modal="int"
                                    />)}
                                </FormItem>
                            </div>
                        )
                    }
                    {
                        this.state.effectType === '2' && (
                            <FormItem
                                label="固定有效期"
                                className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                            >{getFieldDecorator('giftValidRange', {
                                onChange: this.handleGiftValidRangeChange,
                                rules: [
                                    { required: true, message: '请输入有效时间' },
                                ],
                            })(
                                <RangePicker
                                    format="YYYY-MM-DD HH:mm"
                                // disabledDate={
                                // current => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                                // }
                                />
                            )}
                            </FormItem>
                        )
                    }
                </Col>
            </Row>
        )
    }

    renderSmidModal = () => {
        const rowRadioSelection = {
            type: 'radio',
            columnTitle: '选择',
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(selectedRowKeys, selectedRows)
                this.setState({
                    smidUserSelect: selectedRows,
                })
            },
        }
        const columns = [
            {
                title: 'channelNo',
                dataIndex: 'channelNo',
                key: 'channelNo',
                render: t => t,
            },
            {
                title: 'smid',
                key: 'settleID',
                dataIndex: 'settleID',
                render: text => text,
            },
        ];
        return (
            <Modal
                title="SMID列表"
                maskClosable={true}
                width={700}
                visible={this.state.smidModalVisible}
                onCancel={this.handleCloseSmidModal}
                onOk={this.handleSmidSubmit}
            >
                <Table
                    bordered={true}
                    rowSelection={rowRadioSelection}
                    columns={columns}
                    dataSource={this.state.smidList}
                    rowKey="bankChannelId"
                    pagination={false}
                />

            </Modal>
        )
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { consumeGiftID, merchantType } = this.state;
        return (
            <Modal
                title="新建第三方支付宝券"
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.handleCloseModal}
                onOk={this.handleSubmit}
            >
                <Row>
                    <Col span={24} offset={1} className={styles.IndirectBox}>
                        <Form className={styles.crmSuccessModalContentBox}>
                            <FormItem
                                label="第三方券名称"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('batchName', {
                                    rules: [
                                        { required: true, message: '请输入第三方券名称' },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入投放名称"
                                    />
                                )}
                            </FormItem>
                            {/* <FormItem
                            label="起止时间"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            required={true}
                        >
                            {getFieldDecorator('rangePicker', {
                                rules: [{ required: true, message: '请输入日期' }],
                                onchange: this.handleRangeChange,
                            })(
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabledDate={null}
                                />
                            )}
                        </FormItem> */}
                            <FormItem
                                label="选择优惠券"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('giftItemID', {
                                        onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择优惠券' },
                                        ],
                                    })(
                                        <TreeSelect
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.props.treeData}
                                            placeholder="请选择礼品名称"
                                            showSearch={true}
                                            treeNodeFilterProp="label"
                                            allowClear={true}
                                        />
                                    )
                                }
                            </FormItem>
                            {consumeGiftID && this.renderCoupon()}
                            <FormItem
                                label="支付宝链接方式"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 16 }}
                            // required={true}
                            >
                                {getFieldDecorator('merchantType', {
                                    onChange: this.handleLinkWay,
                                    initialValue: merchantType,
                                    // rules: [{ required: true, message: '请输入活动名称' }],

                                })(
                                    <RadioGroup>
                                        <RadioButton value="2">间连</RadioButton>
                                        <RadioButton value="1">直连</RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            {merchantType === '2' && this.renderIndirect()}
                            {merchantType === '1' && this.renderDirect()}
                            <FormItem
                                label="跳转小程序"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('jumpAppID', {
                                    rules: [
                                        { required: true, message: '请输入小程序appid' },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入小程序appid"
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                {/* {
                    this.renderSmidModal()
                } */}
            </Modal>
        )
    }
}

export default Form.create()(CreateCouponContent)
