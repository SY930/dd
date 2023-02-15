/*
 * @Author: Songnana
 * @Date: 2022-05-17 16:37:37
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Form, Select, Input, Row, Col } from 'antd'
import ImageUpload from 'components/common/ImageUpload';
import styles from '../AlipayCoupon.less';
import { getBrands, uploadImageUrl } from '../AxiosFactory'

const DOMAIN = 'http://res.hualala.com/';
class AliContent extends Component {
    state = {
        brandsData: [],
    }

    componentDidMount() {
        getBrands().then((data) => {
            this.setState({
                brandsData: data,
            })
        })
    }

    onChange = (value = []) => {
        const { onChangeEntranceWords } = this.props;
        const entranceWords = value.map((item) => {
            const [shopId = '', shopName = ''] = item.split('_');
            return { shopId, shopName }
        })
        onChangeEntranceWords(JSON.stringify(entranceWords))
    }

    onChangeName = (value = []) => {
        const { brandLogo } = this.state;
        const [brandID = '', brandName] = value.split('_');
        this.setState({
            brandName,
        })
        this.props.onChangeBrand({ brandName, brandLogo })
    }

    handleImageChangne = ({ key, value = {} }) => {
        const { brandName } = this.state;
        const path = DOMAIN + value.url;
        const { form } = this.props;
        if (value.url) {
            uploadImageUrl(path, 'PROMO_BRAND_LOGO').then((res) => {
                if (res) {
                    this.props.onChangeBrand({ brandName, brandLogo: res })
                    this.setState({
                        brandLogo: res,
                        brandUrl: value.url,
                    })
                } else {
                    this.setState({
                        brandUrl: '',
                        brandLogo: '',
                    })
                    form && form.setFieldsValue({ brandLogo: '' })
                }
            })
        }
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { brandUrl } = this.state
        return (
            <div>
                <Form.Item
                    label="选择支付宝门店"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    // required={true}
                >
                    {getFieldDecorator('entranceWords', {
                        rules: [],
                        onChange: this.onChange,
                    })(
                        <Select
                            placeholder="请先选择已授权的直连或间连的商户"
                            tags={true}
                            tokenSeparators={[',']}
                        >
                            {
                                (this.props.aliShops || []).map(({ shopId, shopName }) => (
                                    <Select.Option key={shopId} value={`${shopId}_${shopName}`}>{shopName}</Select.Option>
                                ))
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
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
                            style={{ height: '30px' }}
                        />
                    )}
                </Form.Item>
                <Form.Item
                    label="选择品牌"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    required={true}
                >
                    {getFieldDecorator('brandName', {
                        rules: [
                            { required: true, message: '请选择品牌' },
                        ],
                        onChange: this.onChangeName,
                    })(
                        <Select placeholder="请选择品牌">
                            {
                                (this.state.brandsData || []).map(({ brandID, brandName }) => (
                                    <Select.Option key={brandID} value={`${brandID}_${brandName}`}>{brandName}</Select.Option>
                                ))
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label="品牌logo"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    required={true}
                >
                    {getFieldDecorator('brandLogo', {
                        rules: [
                            { required: true, message: '请选择品牌' },
                        ],
                    })(
                        <Row>
                            <Col span={8} >
                                <ImageUpload
                                    limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG,.bmp,.BMP'}
                                    limitSize={2 * 1024 * 1024}
                                    getFileName={true}
                                    tips={'上传图片'}
                                    value={brandUrl ? `${brandUrl}` : ''}
                                    onChange={value => this.handleImageChangne({ key: 'brandLogo', value })}
                                />
                            </Col>
                            <Col span={14} className={styles.grayFontPic} >
                                <p>上传图片尺寸：600*600<br />支持格式：png、jpg、jpeg、bmp<br />图片大小不超过2MB</p>
                            </Col>
                        </Row>
                    )}
                </Form.Item>
            </div>
        )
    }
}

export default AliContent
