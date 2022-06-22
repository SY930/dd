import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal, TreeSelect, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { axios, getStore } from '@hualala/platform-base';
import AuthorizeModalContent from './AuthorizeContent';
import { getSmid, isAuth, goAuthorizeAC, queryAliShopsAC, goUpdateM4AC } from '../AxiosFactory'
import { SALE_CENTER_GIFT_EFFICT_DAY_ALIPAY } from '../../../redux/actions/saleCenterNEW/types';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import WXContent from '../Comp/WXContent';
import DouyinContent from '../Comp/DouyinContent'
import AliContent from '../Comp/AliContent';
import EDiscountContent from '../Comp/EDiscountContent';
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
const DATE_FORMAT = 'YYYYMMDD000000';
const END_DATE_FORMAT = 'YYYYMMDD235959';

class CreateCouponContent extends Component {
    constructor(props) {
        super(props);
        const { editData } = props;
        this.state = {
            successStartEnd: [], // 开始时间 结束时间
            giftItemID: editData.giftItemID ? editData.giftItemID : '', // 优惠券id
            effectType: editData.effectType ? `${editData.effectType}` : '3', // 相对有效期
            effectGiftTimeHours: editData.effectGiftTimeHours ? `${editData.effectGiftTimeHours}` : '0', // 生效时间
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
            giftType: '',
            aliShops: [],
            entranceWords: [], // 支付宝门店
            douyinGift: null,
            giftValue: '', // 券面值
            stockLimit: editData.stock == '-1' ? '-1' : '0',
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

    // 处理选择的门店数据
    onChangeEntranceWords = (value) => {
        this.setState({
            entranceWords: value,
        })
    }



    // 根据getGiftItemID拼接回显的值
    getGiftItemIDs = ({ giftItemID, giftType, giftValue }) => {
        const { treeData } = this.props;
        const child = treeData.find(item => item.key === giftType).children
        const findItem = child.find(item => item.key === giftItemID) || {}
        if (_.isEmpty(findItem)) {
            return ''
        }
        return `${giftItemID}_${giftType}_${findItem.giftValue}`
    }

    queryAliShops = (smid) => {
        queryAliShopsAC(smid).then((res) => {
            this.setState({
                aliShops: res,
            })
        })
    }

    // 日期
    handleRangeChange = (date, dateString) => {
        this.setState({
            successStartEnd: dateString,
        })
    }

    handlePromotionTypeChange = (promotionType) => {
        this.props.form.setFieldsValue({
            promotionType,
            giftItemID: undefined,
            giftValidRange: [],
        })
        this.setState({
            giftItemID: undefined,
            effectType: '2',
            douyinGift: null,
        })
    }

    // 优惠券
    handleCouponChange = (value) => {
        const { form } = this.props
        const [v, type, giftValue, name] = value.split('_');
        // if ()
        // const gift = this.state.
        form.setFieldsValue({ giftFaceValue: giftValue })
        this.setState({
            giftItemID: v,
            giftType: type,
            giftValue: type == '10' ? giftValue : null,
        })

        if (this.props.form.getFieldValue('promotionType') === 2) { // 零售
            const targetGift = this.props.treeDataX.map(item => item.children).flat().find((g) => {
                return g.giftValue === v
            });

            this.setState({
                effectType: targetGift.promotionDictType === 1 ? '2' : '3',
                douyinGift: targetGift,
                promotionName: name,
            }, () => {
                if (targetGift.promotionDictType === 1) {
                    this.props.form.setFieldsValue({
                        giftValidRange: [
                            moment(targetGift.promotionStartTime, 'YYYYMMDD'),
                            moment(targetGift.promotionEndTime, 'YYYYMMDD'),
                        ],
                    })
                } else {
                    this.props.form.setFieldsValue({
                        validUntilDays: { number: targetGift.validityDays, modal: 'int', maxNum: 5 }
                    })
                }
            });
        } else {
            this.setState({
                douyinGift: null,
            })
        }
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
        const { form } = this.props;
        // editData.merchantID = '';
        form.setFieldsValue({ shopId: [] })
        this.setState({
            merchantType: e.target.value,
            shopIsAuth: '0',
            smidList: [],
            aliShops: [],
            // editData,

        })
    }

    // 选择间连主体
    handleIndirectSelect = (value) => {
        this.setState({
            merchantID: value,
            smidList: [],
        }, () => {
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
        })
    }

    // 选择直连主体
    handleDirectSelect = (value) => {
        this.setState({
            merchantID: value,
        })
        isAuth(value).then((res) => {
            if (res) {
                this.queryAliShops(value);
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
                // 非M4完成M4的升级，调用接口
                goUpdateM4AC(values);
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
        this.setState({
            giftValue: null,
        })
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

    handleStockLimitChange = ({ target }) => {
        const { value } = target;
        this.setState({
            stockLimit: value,
        })
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
                this.queryAliShops(bindUserId) // 支付宝门店
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

    handleEdiscountSubmit = (values, groupId, groupShortName) => {
        const { giftValidRange = [] } = values;
        const { effectGiftTimeHours, giftType, giftItemID, effectType } = this.state;
        const EGiftEffectTime = giftValidRange[0] ? giftValidRange[0].format(DATE_FORMAT) : ''
        const validUntilDate = giftValidRange[1] ? giftValidRange[1].format(END_DATE_FORMAT) : '';
        const data = {
            ...values,
            validUntilDays: values.validUntilDays ? values.validUntilDays.number : '',
            stock: values.stock ? values.stock.number : '',
            channelID: this.props.channelID,
            couponCodeDockingType: 1,
            groupId,
            giftType,
            effectGiftTimeHours,
            giftItemID,
            effectType,
            platformType: this.props.platformType,
            groupShortName,
            EGiftEffectTime,
            validUntilDate,
        };
        const startTime = moment().format(DATE_FORMAT);
        const endTime = moment().add(3, 'years').format(END_DATE_FORMAT) // 定时任务需要时间传值
        const url = '/api/v1/universal?';
        const method = '/couponCodeBatchService/addBatch.ajax';
        const params = {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            type: 'post',
            // couponCodeBatchInfo: res,
            data: {
                // couponCodeBatchInfo,
                couponCodeBatchInfo: { ...data, startTime, endTime },
                groupID: groupId,
                groupShortName,
            },
            method,
        };
        axios.post(url + method, params).then((res) => {
            const { code, message: msg } = res;
            if (code === '000') {
                message.success('创建成功');
                this.props.handleCloseModal();
                this.props.handleQuery();
                this.props.onParentCancel();
                this.setState({ confirmLoading: false })
                return
            }
            this.setState({ confirmLoading: false })
            message.error(msg);
        }).catch((error) => {
            this.setState({ confirmLoading: false })
            console.log(error)
        })
    }

    handleDouyinSubmit = (values, groupId) => {
        const { giftValidRange = [], batchName, stock = {}, shopId, promotionType } = values;
        const { effectGiftTimeHours, giftType, giftItemID, effectType, promotionName = '' } = this.state
        const EGiftEffectTime = giftValidRange[0] ? giftValidRange[0].format(DATE_FORMAT) : ''
        const validUntilDate = giftValidRange[1] ? giftValidRange[1].format(END_DATE_FORMAT) : '';
        if (!effectGiftTimeHours && effectType === '3') {
            this.setState({ confirmLoading: false })
            return message.error('请输入生效时间')
        }
        const startTime = moment().format(DATE_FORMAT);
        const endTime = moment().add(3, 'years').format(END_DATE_FORMAT) // 定时任务需要时间传值
        const couponCodeBatchInfo = {
            promotionType,
            trdPromotionCode: +giftItemID,
            batchName,
            giftItemID,
            EGiftEffectTime, // 固定有效期生效时间
            validUntilDate, // 固定有效期失效时间
            startTime,
            endTime,
            effectType,
            groupId,
            platformType: this.props.platformType,
            effectGiftTimeHours,
            validUntilDays: values.validUntilDays ? values.validUntilDays.number : '',
            stock: stock.number ? stock.number : '-1',
            shopId,
            channelID: this.props.channelID,
            couponCodeDockingType: 1,
            giftType,
            giftName: promotionName,
        };
        const url = '/api/v1/universal?';
        const method = '/couponCodeBatchService/addBatch.ajax';
        const params = {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            type: 'post',
            // couponCodeBatchInfo: res,
            data: {
                couponCodeBatchInfo,
                groupID: groupId,
            },
            method,
        };
        axios.post(url + method, params).then((res) => {
            const { code, message: msg } = res;
            if (code === '000') {
                // message.success('创建成功');
                this.props.handleCloseModal();
                this.props.handleQuery();
                this.props.onParentCancel();
                this.setState({ confirmLoading: false })
                return
            }
            this.setState({ confirmLoading: false })
            message.error(msg);
        }).catch((error) => {
            this.setState({ confirmLoading: false })
            console.log(error)
        })
    }

    handleSubmit = () => {
        const { form, channelID, platformType, type } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true })
                const { effectType, effectGiftTimeHours, merchantID, editData, giftType, giftItemID, entranceWords } = this.state;
                const { user } = getStore().getState();
                const { groupID, groupName } = user.get('accountInfo').toJS()
                const rangePicker = values.rangePicker || [];
                const giftValidRange = values.giftValidRange || [];
                if (type == 3 || type == 4) { // 抖音
                    this.handleDouyinSubmit(values, groupID)
                    return null
                }
                if (type == 5) { // e折
                    this.handleEdiscountSubmit(values, groupID, groupName)
                    return null
                }
                if (!effectGiftTimeHours && values.effectType === '3') {
                    this.setState({ confirmLoading: false })
                    return message.error('请输入生效时间')
                }
                if (!merchantID) {
                    this.setState({ confirmLoading: false })
                    return message.error('请输入支付宝链接方式')
                }
                if (values.merchantType === '2' && !this.state.bindUserId && type == 1) { // 支付宝间连需要关联M4
                    this.setState({ confirmLoading: false })
                    return message.error('间连的支付宝账号未关联M4')
                }
                const startTime = rangePicker[0].format(DATE_FORMAT);
                const endTime = rangePicker[1].format(END_DATE_FORMAT);
                const datas = {
                    batchName: values.batchName,
                    jumpAppID: values.jumpAppID,
                    merchantType: values.merchantType,
                    // ...values,
                    couponCodeDockingType: 2, // 支付宝默认传2批量预存，微信需要用户手动选择1，3
                    channelID,
                    effectType,
                    stock: values.stock.number,
                    validUntilDays: values.validUntilDays ? values.validUntilDays.number : '',
                    effectGiftTimeHours,
                    endTime,
                    startTime,
                    giftItemID,
                    giftType,
                    merchantID,
                    platformType,
                }
                if (giftValidRange[0]) {
                    datas.EGiftEffectTime = giftValidRange[0].format(DATE_FORMAT);
                    datas.validUntilDate = giftValidRange[1].format(END_DATE_FORMAT);
                }
                if (values.merchantType == '2' && type === 1) { // 间连传smid && 支付宝
                    const { smidList } = this.state;
                    const { bankMerchantCode } = smidList[0];
                    datas.merchantID = bankMerchantCode;
                }
                if (type === 1) { // 支付宝
                    if (entranceWords.length) { datas.entranceWords = entranceWords; }
                }
                if (type === 2) { // 微信
                    datas.merchantID = this.state.WXMerchantID;
                    datas.masterMerchantID = this.state.masterMerchantID;
                    datas.jumpAppID = this.state.WXJumpAppID;
                    datas.maxCouponsPerUser = values.maxCouponsPerUser;
                    datas.couponCodeDockingType = values.couponCodeDockingType;
                    datas.miniProgramsAppId = values.miniProgramsAppId;
                    datas.miniProgramsPath = values.miniProgramsPath;
                    datas.validateWay = values.validateWay;
                    datas.joinWay = values.joinWay;
                    datas.entranceMiniProgramsAppId = values.entranceMiniProgramsAppId;
                    datas.entranceMiniProgramsPath = values.entranceMiniProgramsPath;
                    datas.entranceWords = values.entranceWords
                }
                const url = '/api/v1/universal?';
                let method = 'couponCodeBatchService/addBatch.ajax';

                if (editData.batchName) {
                    // if (editData.batchStatus != '2') {
                    //     return message.warn('已shi效的状态才可以更新')
                    // }
                    method = 'couponCodeBatchService/updateBatch.ajax';
                    datas.itemID = editData.itemID;
                    datas.groupID = groupID
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
                    this.setState({ confirmLoading: false })
                    message.error(msg);
                }).catch((error) => {
                    this.setState({ confirmLoading: false })
                    console.log(error)
                })
            }
        })
    }

    // 支付宝直连
    renderDirect = () => {
        const { form, type } = this.props;
        const { getFieldDecorator } = form;
        const { editData, authorizeModalVisible } = this.state;
        const offset = type == 3 ? 5 : 4
        // if (editData.merchantType == )
        const value = editData.merchantType && editData.merchantType == '1' ? editData.merchantID : '';
        return (
            <Row>
                <Col span={16} offset={offset} className={styles.DirectBox}>
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
                        })(<Select
                            onChange={this.handleDirectSelect}
                            placeholder={'请选择支付宝pid号 - 账号名称'}
                            showSearch={true}
                            allowClear={true}
                            filterOption={(input, option) => {
                                const [chlid, t, child2] = option.props.children;
                                return chlid.includes(input.toLowerCase()) || child2.includes(input.toLowerCase())
                            }}
                        >
                            {
                                (this.props.shopPid || []).map(({ channelAccount, channelName }) => (
                                    <Select.Option key={channelAccount} value={`${channelAccount}`}>{channelName} - {channelAccount}</Select.Option>
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
        const { shopIsAuth, merchantType } = this.state;
        if (shopIsAuth === '1') {
            return (
                <p className={styles.authorizeBottomTip}>
                    <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} />
                    {
                        merchantType === '2' ? '商户完成支付宝代运营才能完成创建活动，对于间连非M4代运营授权同步完成M4升级' : '商户完成支付宝代运营授权才可完成创建投放活动。'
                    }
                    <span className={styles.goAuthorize} onClick={() => { this.goAuthorize() }}>点击去授权</span>
                </p>
            )
        }
        return null
    }

    // 支付宝间连
    renderIndirect = () => {
        const { form, type } = this.props;
        const { getFieldDecorator } = form;
        const { authorizeModalVisible, smidList = [], merchantType } = this.state;
        const { bankMerchantCode } = smidList[0] || {};
        // const { editData } = this.state;
        // const value = editData.merchantType && editData.merchantType == '2' ? editData.merchantID : '';
        const offset = type == 2 ? 5 : 4
        return (
            <Row>
                <Col span={16} offset={offset} className={styles.IndirectBox}>
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
                        })(<Select
                            onChange={this.handleIndirectSelect}
                            placeholder={'请输入结算主体'}
                            showSearch={true}
                            allowClear={true}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                (this.props.indirectList || []).map(({ settleUnitName, settleUnitID }) => (
                                    <Select.Option key={settleUnitID} value={`${settleUnitID}`}>{settleUnitName}</Select.Option>
                                ))
                            }
                        </Select>)}
                        {/* <Icon type="close-circle" /> */}
                        {
                            this.renderTip()
                        }
                    </FormItem>
                    {bankMerchantCode && <span style={{ marginLeft: '15px' }}>渠道商户号：{bankMerchantCode}</span>}
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
                            merchantType={merchantType}
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

    renderOther = () => {
        const { form, type } = this.props;
        const { getFieldDecorator } = form;
        const { editData } = this.state;
        return (
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
        )
    }

    // 风车库存增加不限制
    renderFengChe = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { editData, stockLimit } = this.state;
        return (
            <div>
                <FormItem
                    label="库存"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={true}
                >
                    <RadioGroup
                        defaultValue={'0'}
                        value={stockLimit}
                        onChange={this.handleStockLimitChange}
                    >
                        <Radio value={'0'}>限制</Radio>
                        <Radio value={'-1'}>不限制</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    stockLimit == '0' && <FormItem
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17, offset: 4 }}
                    >
                        {getFieldDecorator('stock', {
                            initialValue: { number: editData.stock },
                            onChange: this.handleStockNumChange,
                            rules: [
                                { required: true, message: '库存为必填项' },
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
                    </FormItem>
                }
            </div>
        )
    }

    // 优惠券
    renderCoupon = () => {
        const { form, type } = this.props;
        const { getFieldDecorator } = form;
        const { editData } = this.state;
        const offset = type == 2 ? 5 : 4;
        return (
            <Row>
                <Col span={16} offset={offset} className={styles.CouponGiftBox}>
                    {/* 总数量 库存 */}
                    { type == 4 ? this.renderFengChe() : this.renderOther() }
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
                                    return <Radio disabled={!!this.state.douyinGift} value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.effectType === '3' && (
                            <div>
                                <FormItem
                                    label="生效时间"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 17 }}
                                    required={true}
                                >
                                    <Select
                                        size="default"
                                        disabled={!!this.state.douyinGift}
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
                                        disabled={!!this.state.douyinGift}
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
                            >
                                {getFieldDecorator('giftValidRange', {
                                    initialValue: editData.EGiftEffectTime > 0 ? [moment(editData.EGiftEffectTime, 'YYYYMMDD'), moment(editData.validUntilDate, 'YYYYMMDD')] : [],
                                    onChange: this.handleGiftValidRangeChange,
                                    rules: [
                                        { required: true, message: '请输入有效时间' },
                                    ],
                                })(
                                    <RangePicker
                                        disabled={!!this.state.douyinGift}
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

    render() {
        const { form, title, type } = this.props;
        const { getFieldDecorator } = form;
        const { giftItemID, merchantType, editData, aliShops } = this.state;
        // console.log("🚀 ~ file: CreateCouponContent.jsx ~ line 885 ~ CreateCouponContent ~ render ~ editData", editData, merchantType)
        // let title = '新建第三方支付宝券';
        // if (editData.batchName) {
        //     title = '编辑第三方支付宝券';
        // }
        const giftItemIDs = editData.giftItemID && this.getGiftItemIDs(editData)
        const formItemLayout = type == 2 ? {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        } : {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }

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
                        <Form form={form} className={styles.crmSuccessModalContentBox}>
                            {((type === 3) || (type === 4)) && <FormItem
                                label="业态选择"
                                {...formItemLayout}
                                required={true}
                            >
                                {getFieldDecorator('promotionType', {
                                    onChange: this.handlePromotionTypeChange,
                                    initialValue: 1,
                                })(
                                    <RadioGroup>
                                        <Radio key={'1'} value={1}>餐饮</Radio>
                                        <Radio key={'2'} value={2}>零售</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>}
                            <FormItem
                                label="第三方券名称"
                                {...formItemLayout}
                                required={true}
                            >
                                {getFieldDecorator('batchName', {
                                    initialValue: editData.batchName || '',
                                    rules: [
                                        { required: true, message: '请输入第三方券名称,最大20个字符', max: 20 },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入投放名称"
                                        style={{ height: '30px' }}
                                    />
                                )}
                            </FormItem>
                            {
                                // 微信和支付宝需要用户输入投放时间
                                (type === 1 || type === 2) && <FormItem
                                    label="投放时间"
                                    {...formItemLayout}
                                    required={true}
                                >
                                    {getFieldDecorator('rangePicker', {
                                        initialValue: editData.startTime ? [moment(editData.startTime, 'YYYYMMDD'), moment(editData.endTime, 'YYYYMMDD')] : [],
                                        rules: [
                                            { required: true, message: '请输入日期' },
                                        ],
                                    })(
                                        <RangePicker
                                            style={{ width: '100%', height: 30 }}
                                            format="YYYY-MM-DD"
                                        />
                                    )}
                                </FormItem>
                            }

                            <FormItem
                                noStyle={true}
                                shouldUpdate={(prevValue, curValue) => {
                                    return prevValue.promotionType !== curValue.promotionType;
                                }}
                            >
                                <FormItem
                                    label="选择优惠券"
                                    {...formItemLayout}
                                    required={true}
                                >
                                    {
                                        getFieldDecorator('giftItemID', {
                                            initialValue: editData.giftItemID ? giftItemIDs : '',
                                            onChange: this.handleCouponChange,
                                            rules: [
                                                { required: true, message: '请选择优惠券' },
                                            ],
                                        })(
                                            <TreeSelect
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={form.getFieldValue('promotionType') === 2 ? this.props.treeDataX : this.props.treeData}
                                                placeholder="请选择礼品名称"
                                                showSearch={true}
                                                treeNodeFilterProp="label"
                                                allowClear={true}
                                            />
                                        )
                                    }
                                </FormItem>
                            </FormItem>


                            {giftItemID && this.renderCoupon()}
                            {
                                // 微信和支付宝
                                (type === 1 || type === 2) && <FormItem
                                    label="链接方式"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('merchantType', {
                                        onChange: this.handleLinkWay,
                                        initialValue: `${editData.merchantType ? editData.merchantType : merchantType}`,
                                        // rules: [{ required: true, message: '请输入活动名称' }],
                                    })(
                                        <RadioGroup>
                                            <RadioButton value="2">间连</RadioButton>
                                            <RadioButton value="1">直连</RadioButton>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            }
                            {type === 1 && this.renderZhifubaoContent(merchantType)}
                            {type === 1 && <AliContent form={form} merchantType={merchantType} aliShops={aliShops} onChangeEntranceWords={this.onChangeEntranceWords} />}
                            {type === 2 && <WXContent form={form} merchantType={merchantType} editData={editData} onChangeWXMerchantID={this.onChangeWXMerchantID} onChangeWXJumpAppID={this.onChangeWXJumpAppID} />}
                            {type === 3 && <DouyinContent form={form} merchantType={merchantType} />}
                            {type === 5 && <EDiscountContent form={form} merchantType={merchantType} giftValue={this.state.giftValue} />}
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
