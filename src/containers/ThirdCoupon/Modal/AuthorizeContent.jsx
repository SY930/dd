import React, { Component } from 'react'
import { Form, Input, Icon, Button } from 'antd'
import styles from '../AlipayCoupon.less';

class AuthorizeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {

    }


    render() {
        const { form, handleSubmit } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.AuthModalContentBox}>
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(form);
                }}
                >
                    <Form.Item
                        label="需授权支付宝账号"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    // required={true}
                    >
                        {getFieldDecorator('alipayAccount', {
                            rules: [
                                { required: true, message: '请输入需授权的支付宝账号' },
                            ],
                        })(
                            <Input
                                placeholder="请输入需授权的支付宝账号"
                            />
                        )}
                    </Form.Item>


                    <div className={styles.authTip}>
                        <span> <Icon type="exclamation-circle" style={{ color: '#FAAD14', marginRight: '3px' }} /></span>
                        <p>{
                            this.props.merchantType === '2' ? '确认授权后，对应账号将收到代运营授权信息，请根据收到信息提示文档授权，对于间连非M4代运营授权同步完成M4升级。' :
                                '确认授权后，对应账号将收到代运营授权信息，请根据收到信息提示文档授权。'
                        }</p>
                    </div>
                    <div className={styles.promotionFooter} style={{ overflow: 'hidden' }}>
                        <Button key="0" onClick={this.props.onCancel} style={{ marginRight: 10 }}>取消</Button>
                        <Button key="3" type="primary" htmlType="submit">确定</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
export default Form.create()(AuthorizeContent);
