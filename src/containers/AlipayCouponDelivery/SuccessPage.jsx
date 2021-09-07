import React, { Component } from 'react'
import { Form, Input, Button, Icon } from 'antd';
import styles from './AlipayCoupon.less'

const FormItem = Form.Item;

export class SuccessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {

    }

    handleSubmit = () => {}

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.SuccessPageBox}>
                <Form onSubmit={this.handleSubmit} layout="inline">
                    <FormItem
                        label="投放名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('title', {
                        })(
                            <Input
                                placeholder="请输入投放名称"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="投放ID"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('title', {
                        })(
                            <Input
                                placeholder="请输入ID"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" className={styles.speBtn} htmlType="submit">
                            <Icon type="search" />
                            搜索
                        </Button>
                    </FormItem>
                </Form>
                <div className={styles.bottomLine}></div>
                <div className={styles.launchActiveTableBox} style={{ height: 'calc(100% - 204px)' }}>
                    <div className={styles.activeCardItem}>

                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(SuccessPage);

