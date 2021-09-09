import React, { Component } from 'react'
import { Form, Input, Icon } from 'antd'
import styles from '../AlipayCoupon.less';

class AuthorizeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {

    }


    render() {
        const { form,  handleSubmit } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.AuthModalContentBox}>
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(form);
                }}
                >
                    <Form.Item
                        label="需授权支付宝手机账号"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        // required={true}
                    >
                        {getFieldDecorator('title', {
                            // rules: [
                            //     { required: true, message: '请输入活动名称' },
                            // ],
                        })(
                            <Input
                                placeholder="请输入投放名称"
                            />
                        )}
                    </Form.Item>
                </Form>
                <div className={styles.authTip}>
                    <span> <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} /></span>
                    <p>确认授权后，对应账号手机将收到代运营授权短信息，请根据收到的短信提示完成授权。</p>
                </div>
            </div>
        )
    }
}
export default Form.create()(AuthorizeContent);
