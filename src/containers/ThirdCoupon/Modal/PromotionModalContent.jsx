import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Modal, Icon, message, Radio, TreeSelect } from 'antd'
import _ from 'lodash';
import { jumpPage } from '@hualala/platform-base';
import ImageUpload from 'components/common/ImageUpload';
import { getAlipayRecruitPlan, getBatchDetail, uploadImageUrl,
    getAlipayCouponList, isAuth, queryCityCodeQueryAC, queryAlipayListAC, getAlipayPromotionList, getSmid, goUpdateM4AC, goAuthorizeAC } from '../AxiosFactory'
import AuthorizeModalContent from './AuthorizeContent';
import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less';

const DOMAIN = 'http://res.hualala.com/';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class PromotionModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marketingType: '',
            marketingName: '', // 选择大促的名字
            recruitPlans: {}, // 报名活动原数据
            enrollRules: [], // 报名展示信息
            couponDetail: {}, // 优惠券详情
            materialData: [], // 报名素材
            resourceIds: [],
            description: '', // 活动描述
            confirmLoading: false,
            couponList: [],
            bindUserId: '',
            treeData: [],
            activeNames: { }, // 活动名称组
        }
    }

    componentDidMount() {
        getAlipayCouponList().then((res) => {
            this.setState({
                couponList: res,
            })
        })
        queryAlipayListAC().then((res) => {
            this.setState({
                aliAppList: res,
            })
        })
    }

    onCancel = () => {
        this.setState({
            promotionList: [],
        })
        this.props.onCancel()
    }

    getPromotionData = () => {
        const { bindUserId, couponDetail } = this.state // pid smid
        const merchantUid = couponDetail.merchantType == 2 ? bindUserId : couponDetail.merchantID
        getAlipayPromotionList({ enrollSceneType: 'VOUCHER', enrollMerchant: { merchantUid } }).then((res) => {
            this.setState({
                promotionList: res,
            })
        })
    }

    getAlipayRecruitPlans = (v) => {
        const { form } = this.props;
        const { getFieldsValue } = form;
        const { enrollSceneType: sceneType } = getFieldsValue();
        // 根据直连间连传入pid smid
        const { bindUserId, couponDetail, merchantID, merchantType } = this.state // pid smid
        let merchantUid = '';
        if (sceneType === 'MINI_APP') {
            if (merchantType == '1') { // 直连
                merchantUid = merchantID;
            } else { // 间连
                merchantUid = bindUserId
            }
        } else if (sceneType === 'VOUCHER') {
            merchantUid = couponDetail.merchantType == 2 ? this.state.bindUserId : couponDetail.merchantID; // 直连间连 pid smid
        }
        getAlipayRecruitPlan({ planId: v, enrollMerchant: { merchantUid } }).then((res) => {
            if (res) {
                // if ()
                const { enrollRules, enrollSceneType } = res;
                let materialData = [];
                // 取出schema进行处理
                enrollRules.map((item) => {
                    if (item.type === 'MATERIAL') {
                        const { ruleData = {} } = item;
                        const { schema } = ruleData;
                        if (schema) {
                            try {
                                materialData = JSON.parse(schema);
                                materialData = materialData.map((itm, index) => {
                                    return {
                                        ...itm,
                                        id: `${Date.now().toString(36)}_${index}`,
                                    }
                                })
                            } catch (error) {
                                materialData = [];
                            }
                        }
                    }
                })
                // console.log(res.enrollRules, 'res.enrollRules-----', materialData)
                this.setState({
                    recruitPlans: res,
                    enrollRules: res.enrollRules.length ? res.enrollRules : [],
                    description: res.description || '',
                    materialData,
                    sceneType: enrollSceneType, // 根据素材返回的场景type传入相应的subjectId
                })
            }
        })
    }

    getBindUserId = (id) => {
        isAuth(id).then((res) => {
            if (res) {
                const { bindUserId } = res;
                this.setState({
                    couponDetail: res,
                    bindUserId,
                }, () => {
                    this.getPromotionData()
                })
            } else {
                this.setState({
                    couponDetail: res,
                    bindUserId: '',
                }, () => {
                    this.getPromotionData()
                })
            }
        })
    }

    getVoucherID = (value) => {
        const { trdBatchID = '' } = this.state.couponList.find(item => item.itemID === value)
        return trdBatchID
    }

    getRules = (rule) => {
        if (rule.image_size && !_.isEmpty(rule.image_size) && _.isArray(rule.image_size)) {
            return <p>仅支持尺寸为{rule.image_size[0]}*{rule.image_size[1]}的图片, 且大小不超过{rule.file_size}kb,且格式为{this.getLimitType(rule)}</p>
        }
    }

    getLimitType = (rule) => {
        if (rule.file_type && !_.isEmpty(rule.file_type) && _.isArray(rule.file_type)) {
            return rule.file_type.join(',')
        }
        return '.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'
    }


    goCreateCoupon = () => {
        this.props.onCancel();
        jumpPage({ menuID: '100008992' })
    }


    goAuthorize = () => {
        this.setState({
            authorizeModalVisible: true,
        })
    }


    handlePromotionChange = (value) => {
        // 选择城市
        queryCityCodeQueryAC().then((data) => {
            this.setState({
                treeData: data,
            })
        })
        // 根据
        this.setState({
            marketingType: value.key,
            marketingName: value.label,
            resourceIds: [], // 清空上传的resourceIds--[编辑图片后的码]
        })
        this.getAlipayRecruitPlans(value.key)
    }

    handleCouponChange = (value) => {
        getBatchDetail(value).then((res) => {
            if (res.merchantType == 2) { // 券选的是间连的话，需要根据merchantID获取bindUserId
                this.getBindUserId(res.merchantID)
            } else {
                this.setState({
                    couponDetail: res,
                }, () => {
                    this.getPromotionData()
                })
            }
        })
    }

    handleChangeScene = ({ target }) => {
        // 清空选择支付宝大促选项
        const { form } = this.props;
        form.setFieldsValue({ marketingType: {} })
        // 小程序场景包含了直连间连
        this.setState({
            marketingType: '',
            marketingName: '',
            merchantType: '1', // 默认直连
            promotionList: [], // 支付宝大促选项清空，重新选择pid
            bindUserId: '', // 间连M4
            couponDetail: {}, // 券场景选的直连
            smidList: [], // 渠道商户号清空
            merchantID: '', // 小程序场景选的直连pid
            shopIsAuth: '0',
        })
    }

    handleImageChange = (value, item, index) => {
        const { url } = value;
        if (!url) return;
        const path = DOMAIN + url;
        const { resourceIds } = this.state;
        uploadImageUrl(path).then((res) => {
            if (res) {
                resourceIds[index] = {
                    [index]: res,
                    path,
                    field: item.field,
                };
                this.setState({
                    resourceIds,
                })
            }
        })
    }

    handleActiveNameChange = ({ target }, item) => {
        const { activeNames } = this.state
        // activeNames
        activeNames[item.field] = [];
        activeNames[item.field].push({
            mediaType: 'TEXT',
            text: target.value,
        })
        this.setState({
            activeNames,
        })
    }


    handleSmidSubmit = (smidList) => {
        const { bankMerchantCode } = smidList[0];
        // 去查看该主体有没有授权
        isAuth(bankMerchantCode).then((res) => {
            if (res) {
                const { bindUserId } = res;
                getAlipayPromotionList({ enrollSceneType: 'MINI_APP', enrollMerchant: { merchantUid: bindUserId } }).then((result) => {
                    this.setState({
                        promotionList: result,
                    })
                })
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


    // 选择间连主体
    handleIndirectSelect = (value) => {
        const { form } = this.props;
        form.setFieldsValue({ marketingType: {} })
        this.setState({
            merchantID: value,
            smidList: [],
            promotionList: [],
            marketingType: '',
            marketingName: '',
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
        // 清空选择支付宝大促选项
        const { form } = this.props;
        form.setFieldsValue({ marketingType: {} })
        this.setState({
            merchantID: value,
            promotionList: [],
            marketingType: '',
            marketingName: '',
        })
        isAuth(value).then((res) => {
            if (res) {
                this.setState({
                    shopIsAuth: '2',
                })
                getAlipayPromotionList({ enrollSceneType: 'MINI_APP', enrollMerchant: { merchantUid: value } }).then((result) => {
                    this.setState({
                        promotionList: result,
                    })
                })
            } else {
                this.setState({
                    shopIsAuth: '1', // 需要授权
                })
            }
        })
    }

    // 清空选择
    handleLinkWay = (e) => {
        // 清空选择支付宝大促选项
        const { form } = this.props;
        form.setFieldsValue({ marketingType: {} })
        // 回显时选择链接方式先清空
        this.setState({
            merchantType: e.target.value,
            shopIsAuth: '0',
            smidList: [],
            promotionList: [],
            couponDetail: {},
            merchantID: '',
            bindUserId: '',
            marketingType: '',
            marketingName: '',
        })
    }

    handleSubmit = () => {
        const { form } = this.props;
        const { resourceIds = [], couponDetail, enrollRules, couponList, activeNames, merchantID: appMerchantID, merchantType } = this.state;
        // appMerchantID 小程序场景下选择这个字段
        this.setState({
            confirmLoading: true,
        })
        form.validateFields((err, values) => {
            if (!err) {
                const { enrollSceneType, eventName } = values
                // https://opendocs.alipay.com/pre-open/02bhl8
                const deliveryInfoData = { // 报名素材对象，传给后端的数据格式
                    data: {
                        // activityImage: [],
                    },
                    activityUrl: [],
                };
                let materials = deliveryInfoData.data;
                resourceIds.map((cur) => {
                    materials[cur.field] = [];
                })
                resourceIds.map((item, index) => {
                    deliveryInfoData.activityUrl[index] = {
                        url: item.path,
                    };
                    materials[item.field].push({
                        aftsFileId: item[index],
                        mediaType: 'IMAGE',
                    });
                })
                if (!_.isEmpty(activeNames)) {
                    materials = { ...materials, ...activeNames }
                }
                // console.log(_.sortBy(enrollRules, ['type']), '_.sortBy(enrollRule')
                _.sortBy(enrollRules, ['type']).map((item) => {
                    const { type, required } = item;
                    if (required) {
                        if (type === 'MATERIAL') {
                            deliveryInfoData.name = values.name; // 选择第三方支付宝券id
                            deliveryInfoData.description = values.description;
                        } else if (type === 'MINI_APP') {
                            deliveryInfoData.miniAppId = values.appID;
                            // deliveryInfoData.subjectId = values.appID;
                        } else if (type === 'CITY') {
                            deliveryInfoData.cities = values.cities;
                        } else if (type === 'VOUCHER') {
                            const findCoupon = couponList.find(cur => cur.itemID === values.itemID) || {}
                            deliveryInfoData.activityId = findCoupon.trdBatchID; // 选择第三方支付宝券id
                            deliveryInfoData.subjectId = findCoupon.trdBatchID;
                        }
                    }
                })
                if (_.isEmpty(deliveryInfoData.activityUrl)) {
                    delete deliveryInfoData.activityUrl
                }
                if (_.isEmpty(deliveryInfoData.data)) {
                    delete deliveryInfoData.data
                }
                deliveryInfoData.data = JSON.stringify(deliveryInfoData.data)

                let merchantID = ''
                let merchantTypes = ''
                if (enrollSceneType === 'MINI_APP') {
                    if (merchantType == '1') { // 直连
                        merchantID = appMerchantID;
                    } else { // 间连
                        if (!this.state.bindUserId) {
                            return message.error('三方券间连账号没有关联M4');
                        }
                        merchantID = this.state.bindUserId
                    }
                    merchantTypes = merchantType
                } else if (enrollSceneType === 'VOUCHER') {
                    if (couponDetail.merchantType == 2 && !this.state.bindUserId) {
                        return message.error('三方券间连账号没有关联M4');
                    }
                    merchantID = couponDetail.merchantType == 2 ? this.state.bindUserId : couponDetail.merchantID; // 直连间连 pid smid
                    merchantTypes = couponDetail.merchantType
                }
                const data = {
                    enrollSceneType,
                    eventName,
                    eventWay: '20002', // 大促20002 成功 20001
                    platformType: '1',
                    deliveryType: 2, // 2代表大促活动  1代表成功页
                    marketingType: values.marketingType.key, // 大促的pid
                    marketingName: values.marketingType.label,
                    deliveryInfo: JSON.stringify(deliveryInfoData),
                    merchantID,
                    merchantType: merchantTypes, // 直连 间连
                    giftConfInfos: [
                        {
                            giftID: couponDetail.itemID,
                        },
                    ],
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
                            this.props.handleQuery(null, null, { eventWays: ['20002'] });
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
            } else {
                this.setState({
                    confirmLoading: false,
                })
            }
        })
    }

    handleAuthSubmit = (form) => {
        const { smidList = [] } = this.state;
        const { bankMerchantCode } = smidList[0];
        form.validateFields((err, values) => {
            if (!err) {
                values.merchantNo = bankMerchantCode;
                // 非M4完成M4的升级，调用接口
                goUpdateM4AC(values);
                goAuthorizeAC(values).then((res) => {
                    if (res) {
                        this.setState({
                            authorizeModalVisible: false,
                        })
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
                        this.setState({
                            authorizeModalVisible: false,
                        })
                    }
                })
            }
        })
    }


    // 活动素材
    renderPromotion = () => {
        const { form } = this.props;
        const { enrollRules } = this.state
        const { getFieldDecorator, getFieldsValue } = form;
        const tProps = {
            treeData: this.state.treeData || [],
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: '请选择城市',
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            multiple: true,
        };
        const { enrollSceneType } = getFieldsValue()
        const offset = enrollSceneType === 'MINI_APP' ? 4 : 5
        return (
            <Row>
                <Col span={16} offset={offset} className={styles.CouponGiftBox}>
                    {
                        enrollRules.map((item) => {
                            const { type, required } = item;
                            if (required) {
                                if (type === 'MATERIAL') {
                                    return (
                                        <div>
                                            <FormItem
                                                label="素材名称"
                                                labelCol={{ span: 5 }}
                                                wrapperCol={{ span: 18 }}
                                            >
                                                {getFieldDecorator('name', {
                                                    rules: [
                                                        { required: true, message: '请输入素材名称' },
                                                    ],
                                                })(<Input
                                                    placeholder="请输入素材名称"
                                                />)}
                                            </FormItem>
                                            <FormItem
                                                label="素材描述"
                                                labelCol={{ span: 5 }}
                                                wrapperCol={{ span: 18 }}
                                            >
                                                {getFieldDecorator('description', {
                                                    // initialValue: { number: editData.stock },
                                                    // onChange: this.handleGiftNumChange,
                                                    rules: [
                                                        { required: true, message: '请输入素材描述' },
                                                        { max: 1000, message: '主题不能超过1000个字' },
                                                    ],
                                                })(<Input
                                                    placeholder="请输入素材描述"
                                                    type="textarea"
                                                />)}
                                            </FormItem>
                                        </div>
                                    )
                                } else if (type === 'MINI_APP') {
                                    return (
                                        <FormItem
                                            label="选择小程序"
                                            labelCol={{ span: 5 }}
                                            wrapperCol={{ span: 18 }}
                                            required={true}
                                        >
                                            {
                                                getFieldDecorator('appID', {
                                                    rules: [
                                                        { required: true, message: '请选择小程序' },
                                                    ],
                                                })(
                                                    <Select placeholder={'请选择小程序'}>
                                                        {
                                                            this.state.aliAppList.map(({ value, key, label }) => (
                                                                <Select.Option key={key} value={value}>{label}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    )
                                } else if (type === 'CITY') {
                                    return (
                                        <FormItem
                                            label="选择城市"
                                            labelCol={{ span: 5 }}
                                            wrapperCol={{ span: 18 }}
                                        >
                                            {getFieldDecorator('cities', {
                                                rules: [
                                                    { required: true, message: '请选择城市' },
                                                ],
                                            })(
                                                <TreeSelect {...tProps} />
                                            )}
                                        </FormItem>
                                    )
                                }
                            }
                        })
                    }
                    {/*  */}
                    {
                        (this.state.materialData || []).map((item, index) => {
                            if (item.type === 'IMAGE') {
                                return (
                                    <FormItem
                                        label={item.label}
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 18 }}
                                        required={item.required}
                                        className={styles.imageUploadItem}
                                        key={item.id}
                                    >
                                        {getFieldDecorator(`eventImagePath_${item.id}`, {
                                            onChange: (value) => { this.handleImageChange(value, item, index) },
                                            rules: [
                                                { required: item.required, message: '必须有图片' },
                                            ],
                                        })(
                                            <ImageUpload
                                                className={styles.uploadCom}
                                                limitType={item.rules ? this.getLimitType(item.rules) : '.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                                                limitSize={2 * 1024 * 1024}
                                                getFileName={true}
                                                tips={'上传图片'}
                                                key={`eventImagePath_${item.id}`}
                                            />
                                        )}
                                        <p className={styles.textWrap}>
                                        {this.getRules(item.rules)}
                                            {item.tips}
                                        </p>
                                    </FormItem>
                                )
                            }
                            if (item.type === 'TEXT') {
                                return (
                                    <FormItem
                                    label="活动名称"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 18 }}
                                >
                                    {getFieldDecorator(`activeName_${index}`, {
                                        rules: [
                                            { required: true, message: '请输入活动名称' },
                                            { max: 10, message: '活动名称不能超过10个字' },
                                        ],
                                        onChange: (value) => { this.handleActiveNameChange(value, item) },
                                    })(<Input
                                        placeholder="请输入活动名称"
                                    />)}
                                </FormItem>
                                )
                            }
                        })
                    }
                    {
                        this.state.description &&
                        <div
                            style={{ wordBreak: 'break-all' }}
                            dangerouslySetInnerHTML={{ __html: this.state.description }}
                        ></div>
                    }
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
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { authorizeModalVisible = false, smidList = [], merchantType } = this.state;
        const { bankMerchantCode } = smidList[0] || {};
        return (
            <Row>
                <Col span={16} offset={4} className={styles.IndirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.indirectSelect}
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
                        footer={null}
                        onCancel={() => {
                            this.setState({
                                authorizeModalVisible: false,
                            })
                        }}
                    >
                        <AuthorizeModalContent
                            onCancel={() => {
                                this.setState({
                                    authorizeModalVisible: false,
                                })
                            }}
                            handleSubmit={this.handleAuthSubmit}
                            merchantType={merchantType}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    // 支付宝直连
    renderDirect = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { authorizeModalVisible } = this.state;
        return (
            <Row>
                <Col span={16} offset={4} className={styles.DirectBox}>
                    <FormItem
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                        className={styles.directSelect}
                    >
                        {getFieldDecorator('channelAccount', {
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
                        footer={null}
                        onCancel={() => {
                            this.setState({
                                authorizeModalVisible: false,
                            })
                        }}
                    >
                        <AuthorizeModalContent
                            onCancel={() => {
                                this.setState({
                                    authorizeModalVisible: false,
                                })
                            }}
                            handleSubmit={this.handleDirectAuthSubmit}
                        />
                    </Modal>
                </Col>
            </Row>
        )
    }

    renderZhifubaoContent = () => {
        const { merchantType = '1' } = this.state
        return (<div>
            {merchantType === '2' && this.renderIndirect()}
            {merchantType === '1' && this.renderDirect()}
        </div>)
    }

    render() {
        // const { marketingType } = this.state;
        const { form } = this.props;
        const { getFieldDecorator, getFieldsValue } = form;
        const { enrollSceneType } = getFieldsValue()
        const { confirmLoading, promotionList = [] } = this.state;
        const formItemLayout = enrollSceneType === 'MINI_APP' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        } : {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        }

        return (

            <Modal
                title="新建会场大促投放"
                maskClosable={true}
                width={750}
                visible={true}
                onCancel={this.onCancel}
                onOk={this.handleSubmit}
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={24} offset={1} className={styles.IndirectBox}>
                        <Form className={styles.crmSuccessModalContentBox}>
                            <FormItem
                                label="投放场景"
                                {...formItemLayout}
                                required={true}
                            >
                                {getFieldDecorator('enrollSceneType', {
                                    initialValue: 'VOUCHER',
                                    onChange: this.handleChangeScene,
                                })(
                                    <RadioGroup>
                                        <Radio value={'VOUCHER'}>券场景</Radio>
                                        <Radio value={'MINI_APP'}>小程序场景</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem
                                label="活动名称"
                                {...formItemLayout}
                                required={true}
                            >
                                {getFieldDecorator('eventName', {
                                    // initialValue: editData.batchName || '',
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
                            {
                                enrollSceneType === 'MINI_APP' && <FormItem
                                    label="链接方式"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('merchantType', {
                                        onChange: this.handleLinkWay,
                                        initialValue: '1',
                                    })(
                                        <RadioGroup>
                                            <RadioButton value="2">间连</RadioButton>
                                            <RadioButton value="1">直连</RadioButton>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            }
                            { enrollSceneType === 'MINI_APP' && this.renderZhifubaoContent()}
                            {
                                enrollSceneType === 'VOUCHER' && <FormItem
                                    label="选择第三方支付宝券"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator('itemID_VOUCHER', {
                                            onChange: this.handleCouponChange,
                                            rules: [
                                                { required: true, message: '请选择第三方支付宝券' },
                                            ],
                                        })(
                                            <Select placeholder={'请选择一个支付宝大促'}>
                                                {
                                                    this.state.couponList.map(({ batchName, itemID }) => (
                                                        <Select.Option key={itemID} value={itemID}>{batchName}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            }
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
                                label="选择支付宝大促"
                                {...formItemLayout}
                                required={true}
                            >
                                {
                                    getFieldDecorator('marketingType', {
                                        onChange: this.handlePromotionChange,
                                        rules: [
                                            { required: true, message: '请选择支付宝大促' },
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v || !v.label) {
                                                        return cb('请选择支付宝大促');
                                                    }
                                                    cb();
                                                },
                                            },
                                        ],
                                    })(
                                        <Select placeholder={'请选择一个支付宝大促'} labelInValue={true} disabled={!promotionList.length}>
                                            {
                                                promotionList.map(({ planId, planName }) => (
                                                    <Select.Option key={planId} value={planId}>{planName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {this.state.marketingType && this.renderPromotion()}
                        </Form>
                    </Col>
                </Row>

            </Modal>
        )
    }
}

export default Form.create()(PromotionModalContent)
