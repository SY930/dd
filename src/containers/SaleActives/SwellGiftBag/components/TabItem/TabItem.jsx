import React from 'react'
import { Form } from 'antd'
import PriceInput from 'components/common/PriceInput/PriceInput'
import MutliGift from 'components/common/MutliGift/MutliGift'

const FormItem = Form.Item
const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

class TabItem extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} label="膨胀所需人数" required={true}>
                    {
                        getFieldDecorator('peopleNUm', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (
                                            v.number === '' ||
                                        v.number === undefined
                                        ) {
                                            return cb(
                                                '请输入0-1000之间的整数'
                                            );
                                        }
                                        if (!v || (v.number < 0)) {
                                            return cb(
                                                '请输入0-1000之间的整数'
                                            );
                                        } else if (v.number > 1000) {
                                            return cb(
                                                '请输入0-1000之间的整数'
                                            );
                                        }
                                        cb();
                                    },
                                },
                            ],
                        })(<PriceInput mode="int" addonAfter="人" />)
                    }

                </FormItem>
                <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} label="膨胀所需人数" required={true}>
                    {
                        getFieldDecorator('peopleNUm', {

                        })(<MutliGift />)
                    }
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(TabItem)
