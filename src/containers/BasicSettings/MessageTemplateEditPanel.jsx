import React from 'react';
import {connect} from 'react-redux';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { isEqual } from 'lodash';
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    message as messageService,
    Alert,
} from 'antd';
import {createMessageTemplate, updateMessageTemplate} from "./actions";
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
            this.setState({loading: true});
            if (this.props.templateEntity) {
                this.props.updateMessageTemplate({template: message, modifyBy: this.props.user.accountInfo.userName, itemID: this.props.templateEntity.itemID})
                    .then(() => {
                        messageService.success('修改成功');
                        this.setState({loading: false}, () => {
                            this.props.cancel && this.props.cancel()
                        })
                    }, err => {
                        this.setState({loading: false})
                    })
            } else {
                this.props.createMessageTemplate({template: message, createBy: this.props.user.accountInfo.userName})
                    .then(() => {
                        messageService.success('创建成功');
                        this.setState({loading: false}, () => {
                            this.props.cancel && this.props.cancel()
                        })
                    }, err => {
                        this.setState({loading: false})
                    })
            }


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
                <FormItem label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
                    <Button onClick={this.addMessageInfo}>会员姓名</Button>
                    <Button onClick={this.addMessageInfo}>先生/女士</Button>
                    <Button onClick={this.addMessageInfo}>卡名称</Button>
                    <Button onClick={this.addMessageInfo}>卡号后四位</Button>
                </FormItem>
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
                </Form>
                <FormItem label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
                    <Row>
                        <Col offset={1} span={22}>
                            <p className={styles.blockP}>
                                预计字数：{(this.state.message || '').length}字，{Math.ceil((this.state.message || '').length/67)}条短信, 67字为一条，最多500字（含标点空格）
                            </p>
                            <p className={styles.blockP}>
                                短信条数将由您选择的扣费账户短信余额中扣除, 请注意保证余额充足
                            </p>
                        </Col>
                    </Row>
                </FormItem>
                <Row>
                    <Col span={17} offset={4}>
                        <Alert showIcon message={`注: 请不要输入"【】" "[]"符号, 统计字数中含"回复TD退订【互联网餐厅】"; 字数以最终发出短信内容为准`} type="warning" />
                    </Col>
                </Row>
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

function mapDispatchToProps(dispatch) {
    return {
        updateMessageTemplate: opts => dispatch(updateMessageTemplate(opts)),
        createMessageTemplate: opts => dispatch(createMessageTemplate(opts)),
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MessageTemplateEditPanel));
