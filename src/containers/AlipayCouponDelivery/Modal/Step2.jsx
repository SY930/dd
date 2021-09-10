import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal } from 'antd'
// import moment from 'moment'
import ImageUpload from 'components/common/ImageUpload';
import AuthorizeModalContent from './AuthorizeContent';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import styles from '../AlipayCoupon.less';

const FormItem = Form.Item;
const { Option } = Select;

class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const { getForm = () => { }, form } = this.props;
        getForm(form);
    }

    onSubmit = () => {

    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { } = this.state;
        return (
            <Row className={styles.crmSignUpBox}>
                <Col span={24} offset={1} className={styles.signInfo}>
                    <h4>中秋哗啦啦中餐馆优惠活动</h4>
                    <div style={{ marginBottom: 12 }}>
                        <p>投放活动ID： <span>1136</span></p>
                        <p>关联优惠券： <span>西直门中餐馆30元代金券</span></p>
                    </div>
                    <div>
                        <p>投放时间： <span>2020.12.21 - 2022.1.31</span></p>
                        <p>投放数量： <span>1000</span></p>
                    </div>
                </Col>
                <Col span={24}>
                    <Form onSubmit={this.onSubmit}>
                        <FormItem
                            label="报名活动图片"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                            required={true}
                            className={styles.imageUploadItem}
                        >
                            {getFieldDecorator('eventImagePath', {
                                rules: [
                                    { required: false, message: '必须有图片' },
                                ],
                            })(
                                <ImageUpload
                                    className={styles.uploadCom}
                                    limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                                    limitSize={2 * 1024 * 1024}
                                    getFileName={true}
                                    tips={'上传图片'}
                                />
                            )}
                            <p className={styles.textWrap}>
                                <p> 图片格式为jpg、jpeg、png </p>
                                <p>文件大小建议不超过2M</p>
                                <p>图片尺寸：800*800</p>
                            </p>
                        </FormItem>
                        <FormItem
                            label="选择支付宝大促"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                            required={true}
                        >
                            {
                                getFieldDecorator('Coupon', {
                                    // onChange: this.handlePromotionChange,
                                    rules: [
                                        { required: true, message: '请选择一个支付宝大' },
                                    ],
                                })(
                                    <Select placeholder={'请选择一个支付宝大促'}>
                                        {
                                            [].map(({ label, value }) => (
                                                <Option key={value} value={value}>{label}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem
                            label="活动详情"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                            // required={true}
                        >
                            {getFieldDecorator('info', {
                                // rules: [
                                //     { required: true, message: '请输入活动名称' },
                                // ],
                            })(
                                <Input
                                    type="textarea"
                                    placeholder="请输入备注信息"
                                />
                            )}
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default Form.create()(Step2)
