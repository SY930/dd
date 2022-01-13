import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Radio, Icon, Tooltip } from 'antd'
import styles from '../AlipayCoupon.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

class AliContent extends Component {
    onChange = (value = []) => {
        const { onChangeEntranceWords } = this.props;
        const entranceWords = value.map((item) => {
            const [shopId = '', shopName = ''] = item.split('_');
            return { shopId, shopName }
        })
        onChangeEntranceWords(JSON.stringify(entranceWords))
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Form.Item
                    label="选择支付宝门店"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    // required={true}
                >
                    {getFieldDecorator('entranceWords', {
                        rules: [
                            // { required: true, message: '请先选择已授权的直连或间连的商户,再选择支付宝门店' },
                        ],
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
                    // required={true}
                >
                    {getFieldDecorator('jumpAppID', {
                        rules: [
                            // { required: true, message: '请输入小程序appid' },
                        ],
                    })(
                        <Input
                            placeholder="请输入小程序appid"
                            style={{ height: '30px' }}
                        />
                    )}
                </Form.Item>
            </div>
        )
    }
}

export default AliContent
