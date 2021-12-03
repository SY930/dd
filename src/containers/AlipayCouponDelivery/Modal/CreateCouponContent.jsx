import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal, TreeSelect, message, Table } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { axios, getStore } from '@hualala/platform-base';
import AuthorizeModalContent from './AuthorizeContent';
import { getSmid, isAuth, goAuthorizeAC } from '../AxiosFactory'
import { SALE_CENTER_GIFT_EFFICT_DAY_ALIPAY } from '../../../redux/actions/saleCenterNEW/types';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import WXContent from './WXContent';
// import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
// 生效方式
const EFFECT_TYPE_OPT = [
    { label: '相对有效期', value: '3' },
    { label: '固定有效期', value: '2' },
];

class CreateCouponContent extends Component {
    constructor(props) {
        super(props);
        const { editData } = props;
        this.state = {
            successStartEnd: [], // 开始时间 结束时间
            giftItemID: editData.giftItemID ? editData.giftItemID : '', // 优惠券id
            effectType: editData.effectType ? `${editData.effectType}` : '3', // 相对有效期
            effectGiftTimeHours: editData.effectGiftTimeHours ? `${editData.effectGiftTimeHours}` : '', // 生效时间
            validUntilDays: editData.validUntilDays ? `${editData.validUntilDays}` : '', // 有效天数
            giftValidRange: [], // 固定有效期
            merchantType: '1', // 支付宝链接方式  1 直连 | 2 间连
            authorizeModalVisible: false, // 代运营授权弹窗
            merchantID: `${props.editData.merchantID}` || '', // 选择的间连和直连
            smidList: [], // smid列表
            smidModalVisible: false,
            shopIsAuth: '0', // 0不显示  1未授权 2已授权 商家是否授权
            editData: _.cloneDeep(editData),
            WXMerchantID: '', // 微信的MerchantID
            masterMerchantID: '', // 微信的masterMerchantID
            WXMerchantIDName: '', // 微信账务主体名字
            WXJumpAppID: '',
            WXJumpAppIDName: '',
            confirmLoading: false,
            tips: false,
        }
    }

    // 选择微信的财务主体后改变MerchantID
    onChangeWXMerchantID = (record) => {
        this.setState({
            WXMerchantID: record.merchantID,
            masterMerchantID: record.masterMerchantID,
            WXMerchantIDName: record.settleName,
        })
    }

    // 微信跳转公众号和小程
    onChangeWXJumpAppID = ({ key, label }) => {
        this.setState({
            WXJumpAppID: key,
            WXJumpAppIDName: label,
        })
    }

    // 日期
    handleRangeChange = (date, dateString) => {
        this.setState({
            successStartEnd: dateString,
        })
    }

    // 优惠券
    handleCouponChange = (value) => {
        this.setState({
            giftItemID: value,
        })
    }

    // 生效方式
    handleEffectTypeChange = (e) => {
        this.setState({
            effectType: e.target.value,
        })
    }

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
        // 回显时选择链接方式先清空
        // const { editData } = this.state;
        // editData.merchantID = '';
        this.setState({
            merchantType: e.target.value,
            shopIsAuth: '0',
            // editData,

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
                this.setState({
                    shopIsAuth: '0',
                })
                return message.warn('该结算主体没有绑定smid，请选择其他主体！')
            }
            this.setState({
                smidList: res,
            })
            this.handleSmidSubmit(res);
        })
    }

    // 选择直连主体
    handleDirectSelect = (value) => {
        this.setState({
            merchantID: value,
        })
        isAuth(value).then((res) => {
            if (res) {
                this.setState({
                    shopIsAuth: '2',
                })
            } else {
                this.setState({
                    shopIsAuth: '1', // 需要授权
                })
            }
        })
    }

    handleAuthSubmit = (form) => {
        const { smidList } = this.state;
        const { bankMerchantCode } = smidList[0];
        form.validateFields((err, values) => {
            if (!err) {
                values.merchantNo = bankMerchantCode;
                goAuthorizeAC(values).then((res) => {
                    if (res) {
                        this.handleAuthModalClose()
                    }
                })
            }
        })
    }

    handleDirectAuthSubmit = (form) => {
        form.validateFields((err, values) => {
            if (!err) {
                values.merchantNo = this.state.merchantID;
                goAuthorizeAC(values).then((res) => {
                    if (res) {
                        this.handleAuthModalClose()
                    }
                })
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

    handleStockNumChange = (value) => {
        if (value.number && value.number > 200) {
            this.setState({
                tips: true,
            })
        } else {
            this.setState({
                tips: false,
            })
        }
    }

    goAuthorize = () => {
        this.setState({
            authorizeModalVisible: true,
        })
    }


    handleSmidSubmit = (smidList) => {
        const { bankMerchantCode } = smidList[0];
        // 去查看该主体有没有授权
        isAuth(bankMerchantCode).then((res) => {
            if (res) {
                const { bindUserId } = res;
                this.setState({
                    shopIsAuth: '2',
                    bindUserId, // 间连主体关联M4
                })
            } else {
                this.setState({
                    shopIsAuth: '1', // 需要授权
                    bindUserId: '', // 间连主体未联M4
                })
            }
        })
    }

    handleSubmit = () => {
        const { form, channelID, platformType, type } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                // console.log('handleAuthSubmit', values);
                this.setState({ confirmLoading: true })
                const { effectType, effectGiftTimeHours, merchantID, editData } = this.state;
                const { user } = getStore().getState();
                const { groupID } = user.get('accountInfo').toJS()
                const rangePicker = values.rangePicker;
                const giftValidRange = values.giftValidRange || [];
                if (!effectGiftTimeHours && values.effectType === '3') {
                    this.setState({ confirmLoading: false })
                    return message.error('请输入生效时间')
                }
                if (!merchantID) {
                    this.setState({ confirmLoading: false })
                    return message.error('请输入支付宝链接方式')
                }
                if (values.merchantType === '2' && !this.state.bindUserId && type != 2) { // 间连需要关联M4
                    this.setState({ confirmLoading: false })
                    return message.error('间连的支付宝账号未关联M4')
                }
                const endTime = rangePicker[1].format('YYYYMMDD');
                const startTime = rangePicker[0].format('YYYYMMDD')
                const datas = {
                    batchName: values.batchName,
                    channelID,
                    couponCodeDockingType: 1,
                    stock: values.stock.number,
                    effectType,
                    effectGiftTimeHours,
                    endTime: `${endTime}235959`,
                    EGiftEffectTime: giftValidRange[0] ? giftValidRange[0].format('YYYYMMDDHHmmss') : '',
                    validUntilDate: giftValidRange[1] ? giftValidRange[1].format('YYYYMMDDHHmmss') : '',
                    startTime: `${startTime}000000`,
                    giftItemID: values.giftItemID,
                    giftType: 10,
                    jumpAppID: values.jumpAppID,
                    merchantID,
                    merchantType: values.merchantType,
                    platformType,
                    validUntilDays: values.validUntilDays ? values.validUntilDays.number : '',
                }
                if (giftValidRange[0]) {
                    datas.EGiftEffectTime = giftValidRange[0] ? giftValidRange[0].format('YYYYMMDDHHmmss') : '';
                    datas.validUntilDate = giftValidRange[1] ? giftValidRange[1].format('YYYYMMDDHHmmss') : ''
                }
                if (values.merchantType == '2' && type === 1) { // 间连传smid && 支付宝
                    const { smidList } = this.state;
                    const { bankMerchantCode } = smidList[0];
                    datas.merchantID = bankMerchantCode;
                }
                if (type === 2) { // 微信
                    datas.merchantID = this.state.WXMerchantID;
                    datas.maxCouponsPerUser = values.maxCouponsPerUser;
                    datas.masterMerchantID = this.state.masterMerchantID;
                    datas.jumpAppID = this.state.WXJumpAppID;
                }
                const url = '/api/v1/universal?';
                let method = 'couponCodeBatchService/addBatch.ajax';

                if (editData.batchName) {
                    if (editData.batchStatus != '1') {
                        return message.warn('已生效的状态才可以更新')
                    }
                    method = 'couponCodeBatchService/updateBatch.ajax';
                    datas.itemID = editData.itemID;
                }
                const params = {
                    service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
                    type: 'post',
                    // couponCodeBatchInfo: res,
                    data: {
                        couponCodeBatchInfo: datas,
                        groupID,
                    },
                    method,
                };
                axios.post(url + method, params).then((res) => {
                    const { code, message: msg } = res;
                    if (code === '000') {
                        if (editData.batchName) {
                            message.success('更新成功');
                            this.props.handleCloseModal();
                            this.props.handleQuery();
                            this.props.onParentCancel();
                            return
                        }
                        message.success('创建成功');
                        this.props.handleCloseModal();
                        this.props.handleQuery();
                        this.props.onParentCancel();
                        this.setState({ confirmLoading: false })
                        return
                    }
                    // this.props.handleCloseModal();
                    this.setState({ confirmLoading: false })
                    message.error(msg);
                }).catch((error) => {
                    // this.props.handleCloseModal();
                    this.setState({ confirmLoading: false })
                    console.log(error)
                })
            }
        })
    }

    // 支付宝直连
    renderDirect = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { editData, authorizeModalVisible } = this.state;
        // if (editData.merchantType == )
        const value = editData.merchantType && editData.merchantType == '1' ? editData.merchantID : '';
        return (
            <Row>
                <Col span={16} offset={5} className={styles.DirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.directSelect}
                    >
                        {getFieldDecorator('channelAccount', {
                            initialValue: value || undefined,
                            rules: [
                                { required: true, message: '请选择支付宝pid号' },
                            ],
                        })(<Select onChange={this.handleDirectSelect} placeholder={'请选择支付宝pid号 - 账号名称'}>
                            {
                                (this.props.shopPid || []).map(({ channelAccount, channelName }) => (
                                    <Select.Option key={channelAccount} value={`${channelAccount}`}>{channelAccount} - {channelName}</Select.Option>
                                ))
                            }
                        </Select>)}
                        {
                            this.renderTip()
                        }
                    </FormItem>
                    {
                        this.renderGoAuth()
                    }
                </Col>
                <Col>
                    <Modal
                        title="代运营授权"
                        maskClosable={true}
                        width={520}
                        visible={authorizeModalVisible}
                        // onOk={this.handleAuthSubmit}
                        footer={null}
                        onCancel={this.handleAuthModalClose}
                    >
                        <AuthorizeModalContent
                            onCancel={this.handleAuthModalClose}
                            // value={merchantID}
                            // form={form}
                            handleSubmit={this.handleDirectAuthSubmit}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    renderTip = () => {
        const { shopIsAuth, merchantID } = this.state;
        if (!merchantID) return null;
        if (shopIsAuth === '1') {
            return (<span className={[styles.authorizeTip, styles.noAuth].join(' ')}> <Icon type="close-circle-o" style={{ color: '#FF2D2D' }} /> 未授权</span>)
        } else if (shopIsAuth === '2') {
            return (<span className={[styles.authorizeTip, styles.authed].join(' ')}> <Icon type="check-circle" style={{ color: '#12B493' }} /> 已授权</span>)
        }
        return null
    }

    renderGoAuth = () => {
        const { shopIsAuth } = this.state;
        if (shopIsAuth === '1') {
            return (
                <p className={styles.authorizeBottomTip}>
                    <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                    商户完成支付宝代运营授权才可完成创建投放活动。
                    <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击去授权</span>
                </p>
            )
        }
        return null
    }

    // 支付宝间连
    renderIndirect = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { authorizeModalVisible } = this.state;
        // const { editData } = this.state;
        // const value = editData.merchantType && editData.merchantType == '2' ? editData.merchantID : '';
        return (
            <Row>
                <Col span={16} offset={5} className={styles.IndirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.indirectSelect}
                    // label="账务主体"
                    >
                        {getFieldDecorator('settleUnitID', {
                            rules: [
                                { required: true, message: '请输入结算主体' },
                            ],
                        })(<Select onChange={this.handleIndirectSelect} placeholder={'请输入结算主体'}>
                            {
                                (this.props.indirectList || []).map(({ settleUnitName, settleUnitID }) => (
                                    <Select.Option key={settleUnitID} value={`${settleUnitID}`}>{settleUnitID} - {settleUnitName}</Select.Option>
                                ))
                            }
                        </Select>)}
                        {/* <Icon type="close-circle" /> */}
                        {
                            this.renderTip()
                        }
                    </FormItem>
                    {
                        this.renderGoAuth()
                    }
                </Col>
                <Col>
                    <Modal
                        title="代运营授权"
                        maskClosable={true}
                        width={520}
                        visible={authorizeModalVisible}
                        // onOk={this.handleAuthSubmit}
                        footer={null}
                        onCancel={this.handleAuthModalClose}
                    >
                        <AuthorizeModalContent
                            onCancel={this.handleAuthModalClose}
                            // form={form}
                            handleSubmit={this.handleAuthSubmit}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    renderZhifubaoContent = (merchantType) => {
        return (<div>
            {merchantType === '2' && this.renderIndirect()}
            {merchantType === '1' && this.renderDirect()}
        </div>)
    }

    // 优惠券
    renderCoupon = () => {
        const { form, type } = this.props;
        const { getFieldDecorator } = form;
        const { editData } = this.state;
        return (
            <Row>
                <Col span={16} offset={5} className={styles.CouponGiftBox}>
                    <FormItem
                        label="总数量"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('stock', {
                            initialValue: { number: editData.stock },
                            onChange: this.handleStockNumChange,
                            rules: [
                                { required: true, message: '总数量为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        v.number > 0 && v.number <= 999999 ? cb() : cb(rule.message);
                                    },
                                    message: '礼品个数为1到999999',
                                },
                            ],
                        })(<PriceInput
                            // addonBefore={'礼品个数:'}
                            addonAfter="个"
                            modal="int"
                        />)}
                        {
                            type === 1 && this.state.tips &&
                            (<div className={styles.authorizeBottomTip} style={{ padding: 0, textAlign: 'center' }}>如券用于支付宝会场大促投放，其总数量应大于200</div>)
                        }
                    </FormItem>
                    <FormItem
                        label="生效方式"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
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
                        this.state.effectType === '3' && (
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
                                    wrapperCol={{ span: 17 }}
                                    required={true}
                                >
                                    <Select
                                        size="default"
                                        defaultValue={this.state.effectGiftTimeHours}
                                        onChange={this.handleWhenToEffectChange}
                                    >
                                        {
                                            (SALE_CENTER_GIFT_EFFICT_DAY_ALIPAY)
                                                .map((item, index) => {
                                                    return (<Option value={item.value} key={index}>{item.label}</Option>);
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 17 }}
                                    label={'有效天数'}
                                    required={true}
                                >
                                    {getFieldDecorator('validUntilDays', {
                                        initialValue: { number: this.state.validUntilDays },
                                        onChange: this.handleGiftValidDaysChange,
                                        rules: [
                                            { required: true, message: '有效天数为必填项' },
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
                                required={true}
                            >{getFieldDecorator('giftValidRange', {
                                    initialValue: editData.eGiftEffectTime > 0 ? [moment(editData.eGiftEffectTime, 'YYYYMMDD'), moment(editData.validUntilDate, 'YYYYMMDD')] : [],
                                    onChange: this.handleGiftValidRangeChange,
                                    rules: [
                                        { required: true, message: '请输入有效时间' },
                                    ],
                                })(
                                    <RangePicker
                                        format="YYYY-MM-DD"
                                        showTime="HH:mm:ss"
                                    />
                                )}
                            </FormItem>
                        )
                    }
                </Col>
            </Row>
        )
    }

    // renderSmidModal = () => {
    //     const rowRadioSelection = {
    //         type: 'radio',
    //         columnTitle: '选择',
    //         onChange: (selectedRowKeys, selectedRows) => {
    //             this.setState({
    //                 smidUserSelect: selectedRows,
    //             })
    //         },
    //     }
    //     const columns = [
    //         {
    //             title: 'channelNo',
    //             dataIndex: 'channelNo',
    //             key: 'channelNo',
    //             render: t => t,
    //         },
    //         {
    //             title: 'smid',
    //             key: 'settleID',
    //             dataIndex: 'settleID',
    //             render: text => text,
    //         },
    //     ];
    //     return (
    //         <Modal
    //             title="SMID列表"
    //             maskClosable={true}
    //             width={700}
    //             visible={this.state.smidModalVisible}
    //             onCancel={this.handleCloseSmidModal}
    //             onOk={this.handleSmidSubmit}
    //         >
    //             <Table
    //                 bordered={true}
    //                 rowSelection={rowRadioSelection}
    //                 columns={columns}
    //                 dataSource={this.state.smidList}
    //                 rowKey="bankChannelId"
    //                 pagination={false}
    //             />

    //         </Modal>
    //     )
    // }

    render() {
        const { form, title, type } = this.props;
        const { getFieldDecorator } = form;
        const { giftItemID, merchantType, editData } = this.state;
        // let title = '新建第三方支付宝券';
        // if (editData.batchName) {
        //     title = '编辑第三方支付宝券';
        // }
        return (
            <Modal
                title={title}
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.handleCloseModal}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
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
                                    initialValue: editData.batchName || '',
                                    rules: [
                                        { required: true, message: '请输入第三方券名称' },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入投放名称"
                                        style={{ height: '30px' }}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="投放时间"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {getFieldDecorator('rangePicker', {
                                    // initialValue: editData.startTime > 0 ? [moment(editData.startTime, 'YYYYMMDD'), moment(editData.endTime, 'YYYYMMDD')] : [],
                                    rules: [
                                        { required: true, message: '请输入日期' },
                                    ],
                                    // onchange: this.handleRangeChange,
                                })(
                                    <RangePicker
                                        style={{ width: '100%', height: 30 }}
                                        format="YYYY-MM-DD"
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="选择优惠券"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('giftItemID', {
                                        initialValue: editData.giftItemID || '',
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
                            {giftItemID && this.renderCoupon()}
                            <FormItem
                                label="链接方式"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                            >
                                {getFieldDecorator('merchantType', {
                                    onChange: this.handleLinkWay,
                                    initialValue: editData.merchantType ? `${editData.merchantType}` : merchantType,
                                    // rules: [{ required: true, message: '请输入活动名称' }],

                                })(
                                    <RadioGroup>
                                        <RadioButton value="2">间连</RadioButton>
                                        <RadioButton value="1">直连</RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            { type === 1 && this.renderZhifubaoContent(merchantType) }
                            { type === 2 && <WXContent form={form} merchantType={merchantType} onChangeWXMerchantID={this.onChangeWXMerchantID} onChangeWXJumpAppID={this.onChangeWXJumpAppID} />}
                            {
                                type === 1 && <FormItem
                                    label="跳转小程序"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}
                                    required={true}
                                >
                                    {getFieldDecorator('jumpAppID', {
                                        initialValue: editData.jumpAppID,
                                        rules: [
                                            { required: true, message: '请输入小程序appid' },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请输入小程序appid"
                                            style={{ height: '30px' }}
                                        />
                                    )}
                                </FormItem>
                            }
                            {
                                type === 2 && <FormItem
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
                                                    if (v > 10 || v < 0) {
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
                                </FormItem>
                            }
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
