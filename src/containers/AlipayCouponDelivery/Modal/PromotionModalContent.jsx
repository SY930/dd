import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Steps, Button, Modal, Icon, message } from 'antd'
import ImageUpload from 'components/common/ImageUpload';
import { getAlipayRecruitPlan, getBatchDetail, uploadImageUrl } from '../AxiosFactory'
import { axiosData } from '../../../helpers/util'
import Step1 from './Step1'
import Step2 from './Step2'
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';

import styles from '../AlipayCoupon.less';
const DOMAIN = 'http://res.hualala.com/';

const { Step } = Steps;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
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
        }
    }

    getAlipayRecruitPlans = (v) => {
        getAlipayRecruitPlan(v).then((res) => {
            if (res) {
                // if ()
                const { enrollRules } = res;
                let materialData = [];
                // 取出schema进行处理
                enrollRules.map((item) => {
                    if (item.type === 'MATERIAL') {
                        const { ruleData = {} } = item;
                        const { schema } = ruleData;
                        if (schema) {
                            try {
                                // materialData[0] = JSON.parse(schema)[0];
                                // materialData[1] = JSON.parse(schema)[0];
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
                this.setState({
                    recruitPlans: res,
                    enrollRules: res.enrollRules.length ? res.enrollRules : [],
                    materialData,
                })
            }
        })
    }

    handlePromotionChange = (value) => {
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
            this.setState({
                couponDetail: res,
            })
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
                };
                this.setState({
                    resourceIds,
                })
            }
        })
    }

    handleSubmit = () => {
        const { form } = this.props;
        const { resourceIds, couponDetail } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                const deliveryInfoData = { // 报名素材对象，传给后端的数据格式
                    data: {
                        activityImage: [],
                    },
                    activityUrl: [],
                    description: values.description,
                    name: values.name,
                };
                const materials = deliveryInfoData.data;
                resourceIds.map((item, index) => {
                    // deliveryInfoData[`url${index}`] = item.path;
                    deliveryInfoData.activityUrl[index] = {
                        url: item.path,
                    };
                    materials.activityImage[index] = {
                        aftsFileId: item[index],
                        mediaType: 'IMAGE',
                    };
                    // console.log(JSON.stringify(imageData), '-----JSON.stringify(imageData)')
                })
                deliveryInfoData.data = JSON.stringify(deliveryInfoData.data)
                // JSON.stringify(materials.activityImage);
                // console.log(deliveryInfoData, 'deliveryInfoData>>>>>>>>>>>', JSON.stringify(deliveryInfoData))
                const data = {
                    eventName: values.eventName,
                    eventWay: '20002', // 大促20002 成功 20001
                    platformType: '1',
                    deliveryType: 2, // 2代表大促活动  1代表成功页
                    marketingType: values.marketingType.key, // 大促的pid
                    marketingName: values.marketingType.label,
                    deliveryInfo: JSON.stringify(deliveryInfoData),
                    merchantID: couponDetail.merchantID, // 直连间连 pid smid
                    merchantType: couponDetail.merchantType, // 直连 间连
                    giftConfInfos: [
                        {
                            giftID: couponDetail.itemID,
                        },
                    ],
                }
                console.log(data, 'data_________')
                const params = { trdEventInfo: { ...data } };
                axiosData(
                    'trdEventService/addEvent.ajax',
                    params,
                    null,
                    { path: '' },
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                )
                    .then((res) => {
                        console.log("🚀 ~ file: PromotionModalContent.jsx ~ line 153 ~ PromotionModalContent ~ .then ~ res", res)
                        const { code, message: msg } = res;
                        if (code === '000') {
                            message.success('创建成功');
                            this.props.onCancel();
                            this.props.handleQuery();
                            // TODO: 关闭窗口 请求数据
                            return
                        }
                        message.error(msg);
                    }, (error) => {
                        console.log(error)
                        // 关闭窗口
                    })
            }
        })
    }

    // 活动素材
    renderPromotion = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Row>
                <Col span={16} offset={5} className={styles.CouponGiftBox}>
                    <FormItem
                        label="素材名称"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('name', {
                            // initialValue: { number: editData.stock },
                            // onChange: this.handleGiftNumChange,
                            rules: [
                                { required: true, message: '请输入素材名称' },
                            ],
                        })(<Input
                            placeholder="请输入素材名称"
                        />)}
                    </FormItem>
                    <FormItem
                        label="素材描述"
                        labelCol={{ span: 4 }}
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
                    {
                        (this.state.materialData || []).map((item, index) => {
                            return (
                                <FormItem
                                    label={item.label}
                                    labelCol={{ span: 4 }}
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
                                            // style={{ float: 'left' }}
                                            limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                                            limitSize={2 * 1024 * 1024}
                                            getFileName={true}
                                            tips={'上传图片'}
                                            key={`eventImagePath_${item.id}`}
                                        />
                                    )}
                                    <p className={styles.textWrap}>
                                        {
                                            item.tips
                                        }
                                        {/* <p> 图片格式为jpg、jpeg、png </p>
                                        <p>文件大小建议不超过2M</p>
                                        <p>图片尺寸：800*800</p> */}
                                    </p>
                                </FormItem>
                            )
                        })
                    }
                </Col>
            </Row>
        )
    }


    render() {
        // const { marketingType } = this.state;
        const { form, couponList, promotionList } = this.props;
        const { getFieldDecorator } = form;
        return (

            <Modal
                title="新建会场大促投放"
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
                                    // initialValue: editData.batchName || '',
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
                                    getFieldDecorator('giftItemID', {
                                        // initialValue: editData.giftItemID || '',
                                        onChange: this.handleCouponChange,
                                        rules: [
                                            { required: true, message: '请选择第三方支付宝券' },
                                        ],
                                    })(
                                        <Select placeholder={'请选择一个支付宝大促'}>
                                            {
                                                couponList.map(({ giftName, itemID }) => (
                                                    <Select.Option key={itemID} value={itemID}>{giftName}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {/* TODO: 跳转 */}
                            {
                                !couponList.length && <FormItem
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
                            {/* <FormItem
                                label="活动详情"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 16 }}
                            // required={true}
                            >
                                {getFieldDecorator('jumpAppID', {
                                    // initialValue: editData.jumpAppID,
                                })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入活动详情"
                                    />
                                )}
                            </FormItem> */}
                        </Form>
                    </Col>
                </Row>

            </Modal>
        )
    }
}

export default Form.create()(PromotionModalContent)
