import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Modal, Icon, message, Radio, TreeSelect } from 'antd'
import _ from 'lodash';
import { jumpPage } from '@hualala/platform-base';
import ImageUpload from 'components/common/ImageUpload';
import { getAlipayRecruitPlan, getBatchDetail, uploadImageUrl,
    getAlipayCouponList, isAuth, queryCityCodeQueryAC, queryAlipayListAC } from '../AxiosFactory'
import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less';

const DOMAIN = 'http://res.hualala.com/';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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

    getAlipayRecruitPlans = (v) => {
        getAlipayRecruitPlan(v).then((res) => {
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
                    bindUserId,
                })
            } else {
                this.setState({
                    bindUserId: '',
                })
            }
        })
    }

    goCreateCoupon = () => {
        this.props.onCancel();
        jumpPage({ menuID: '100008992' })
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
            }
            this.setState({
                couponDetail: res,
            })
        })
    }

    handleChangeScene = ({ target }) => {
        // 清空选择支付宝大促选项
        const { form } = this.props;
        form.setFieldsValue({ marketingType: {} })
        this.setState({
            marketingType: '',
            marketingName: '',
        })
        this.props.getPromotionData(target.value)
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

    handleSubmit = () => {
        const { form } = this.props;
        const { resourceIds = [], couponDetail, enrollRules, couponList, activeNames } = this.state;
        this.setState({
            confirmLoading: true,
        })
        form.validateFields((err, values) => {
            if (!err) {
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
                // JSON.stringify(materials.activityImage);
                if (couponDetail.merchantType == 2 && !this.state.bindUserId) {
                    return message.error('三方券间连账号没有关联M4');
                }
                const data = {
                    enrollSceneType: values.enrollSceneType,
                    eventName: values.eventName,
                    eventWay: '20002', // 大促20002 成功 20001
                    platformType: '1',
                    deliveryType: 2, // 2代表大促活动  1代表成功页
                    marketingType: values.marketingType.key, // 大促的pid
                    marketingName: values.marketingType.label,
                    deliveryInfo: JSON.stringify(deliveryInfoData),
                    merchantID: couponDetail.merchantType == 2 ? this.state.bindUserId : couponDetail.merchantID, // 直连间连 pid smid
                    merchantType: couponDetail.merchantType, // 直连 间连
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

    // 活动素材
    renderPromotion = () => {
        const { form } = this.props;
        const { enrollRules } = this.state
        const { getFieldDecorator } = form;
        const tProps = {
            treeData: this.state.treeData || [],
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: '请选择城市',
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            multiple: true,
        };
        return (
            <Row>
                <Col span={16} offset={5} className={styles.CouponGiftBox}>
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


    render() {
        // const { marketingType } = this.state;
        const { form, promotionList = [] } = this.props;
        const { getFieldDecorator, getFieldsValue } = form;
        const { enrollSceneType } = getFieldsValue()
        const { confirmLoading } = this.state;
        return (

            <Modal
                title="新建会场大促投放"
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
                                label="投放场景"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
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
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
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
                                    label="选择第三方支付宝券"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}>
                                    {
                                        getFieldDecorator('itemID', {
                                            onChange: this.handleCouponChange,
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
                                enrollSceneType === 'VOUCHER' && <FormItem
                                    label="选择第三方支付宝券"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16 }}>
                                    {
                                        getFieldDecorator('itemID_VOUCHER', {
                                            onChange: this.handleCouponChange,
                                            rules: [
                                                { required: true, message: '请选择第三方支付宝券' }
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
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                                required={true}
                            >
                                {
                                    getFieldDecorator('marketingType', {
                                        // initialValue: editData.giftItemID || '',
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
                                            }

                                        ],
                                    })(
                                        <Select placeholder={'请选择一个支付宝大促'} labelInValue >
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
