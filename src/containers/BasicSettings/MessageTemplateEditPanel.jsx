import React from 'react';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { isEqual } from 'lodash';
import { Button, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

class MessageTemplateEditPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: props.templateEntity ? props.templateEntity.template : '' ,
            pristineMessage: props.templateEntity ? props.templateEntity.template : '' ,
            loading: false,
        };
        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.addMessageInfo = this.addMessageInfo.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.templateEntity, nextProps.templateEntity)) {
            const message = nextProps.templateEntity ? nextProps.templateEntity.template : '';
            this.setState({
                message,
                pristineMessage: message
            });
            nextProps.form.resetFields();
        }
    }

    cancel() {
        this.setState({
            message: '',
            loading: false,
        });
        this.props.cancel && this.props.cancel();
        this.props.form.resetFields();
    }

    /** 新建/编辑 保存*/
    save() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!flag) return;
        const { message } = this.state;
        const strippedMessage = message.replace(/(\[会员姓名])|(\[先生\/女士])|(\[卡名称])|(\[卡号后四位])/g, '');
        if (/[\[\]【】]/.test(strippedMessage)) { // 剔除模板字段(例如[会员姓名])后依然有"【】" "[]"符号, 不允许保存
            this.props.form.setFields({
                message: {
                    errors: [new Error('请不要输入"【】" "[]"符号, 或打乱模板字段结构')]
                }
            });
        } else { // 验证通过
            console.log('验证通过, 即将保存');

        }
    }

    handleMsgChange(e) {
        const value = e.target.value;
        this.setState({
            message: value
        })
    }

    addMessageInfo(e) {
        let { message } = this.state;
        message += ` [${e.target.textContent}] `;
        this.props.form.setFieldsValue({
            message
        });
        this.props.form.validateFields(['message']);
        this.setState({
            message,
        });
    }

    render() {
        return (
            <div>
                <Form>
                    <FormItem
                        label="短信模板"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {this.props.form.getFieldDecorator('message', {
                            rules: [
                                { required: true, message: '请输入短信模板' },
                                { max: 500, message: '最多500个字符' },
                            ],
                            initialValue: this.state.message,
                            onChange: this.handleMsgChange
                        })(
                            <Input rows={8} type="textarea" placeholder="请输入短信模板" />
                        )}

                    </FormItem>
                    <FormItem label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
                        <Button onClick={this.addMessageInfo}>会员姓名</Button>
                        <Button onClick={this.addMessageInfo}>先生/女士</Button>
                        <Button onClick={this.addMessageInfo}>卡名称</Button>
                        <Button onClick={this.addMessageInfo}>卡号后四位</Button>
                        <Row>
                            <Col span={2}> <span className={styles.titleHeight}>规则:</span></Col>
                            <Col span={22}>
                                <p className={styles.blockP}>
                                    {'请不要输入"【】" "[]"符号'}
                                </p>
                                <p className={styles.blockP}>
                                    预计字数：{(this.state.message || '').length}字，67字为一条，最多500字（含标点空格）
                                </p>
                                <p className={styles.blockP}>
                                    短信费用0.08元/条
                                </p>
                            </Col>
                            <Col span={2} ><span className={styles.titleHeight}>注:</span></Col>
                            <Col span={22}>
                                <p className={styles.blockP}>{'1.  统计字数中含"回复TD退订【互联网餐厅】"'}</p>
                                <p className={styles.blockP}>{'2.  字数以最终发出短信内容为准'}</p>
                            </Col>

                        </Row>
                    </FormItem>
                </Form>
                <div style={{textAlign: 'center'}}>
                    <Button type="ghost"
                            onClick={this.cancel}>关闭
                    </Button>
                    <Button
                        disabled={this.state.message === this.state.pristineMessage}
                        style={{marginLeft:8}}
                        type="primary"
                        loading={this.state.loading}
                        onClick={this.save}>
                        保存
                    </Button>
                </div>
            </div>
        )
    }
}

export default Form.create()(MessageTemplateEditPanel);
