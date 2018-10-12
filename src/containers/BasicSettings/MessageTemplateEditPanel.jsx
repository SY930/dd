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
    Modal,
    message as messageService,
    Alert,
} from 'antd';
import {
    createMessageTemplate,
    updateMessageTemplate,
    getMessageTemplateList,
} from "./actions";
import {isBrandOfHuaTianGroupList, SMS_EDIT_DISABLED_TIP} from "../../constants/projectHuatianConf";
const FormItem = Form.Item;

class MessageTemplateEditPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: props.templateEntity ? props.templateEntity.template : '' ,
            pristineMessage: props.templateEntity ? props.templateEntity.template : '' ,
            loading: false,
            showPreview: false,
        };
        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.addMessageInfo = this.addMessageInfo.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.togglePreview = this.togglePreview.bind(this);
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
            showPreview: false,
            loading: false,
        });
        this.props.cancel && this.props.cancel();
        this.props.form.resetFields();
    }

    togglePreview() {
        this.setState((prevState, props) => ({
            showPreview: !prevState.showPreview
        }));
    }

    /** 新建/编辑 保存*/
    save() {
        if (this.props.templateEntity && isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
            messageService.warning(SMS_EDIT_DISABLED_TIP);
            return;
        }
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
                this.props.updateMessageTemplate({
                    template: message,
                    modifyBy: this.props.user.accountInfo.userName,
                    itemID: this.props.templateEntity.itemID,
                    groupName: this.props.user.accountInfo.groupName
                })
                    .then(() => {
                        messageService.success('修改成功');
                        this.props.getMessageTemplateList();
                        this.props.cancel && this.props.cancel();
                        this.setState({
                            loading: false,
                        });
                    }, err => {
                        this.setState({loading: false})
                    })
            } else {
                this.props.createMessageTemplate({
                    template: message,
                    createBy: this.props.user.accountInfo.userName,
                    groupName: this.props.user.accountInfo.groupName
                })
                    .then(() => {
                        messageService.success('创建成功');
                        this.props.getMessageTemplateList();
                        this.props.cancel && this.props.cancel();
                        this.setState({
                            loading: false,
                            message: '',
                            pristineMessage: '',
                        });
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
                <Modal
                    title="编辑短信模板"
                    visible={this.props.visible}
                    footer={
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
                    }
                    closable={false}
                    width="750px"
                >
                    {this.props.visible && this.renderModalBody()}
                </Modal>
            )
    }

    renderModalBody() {
        const previewMessage = this.state.message.replace(/(\[会员姓名])|(\[先生\/女士])|(\[卡名称])|(\[卡号后四位])/g, 'XX').concat('回复TD退订【互联网餐厅】');
        return (
            <div>
                <FormItem style={{padding: '0'}} label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
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
                    <p className={styles.smsRulesBox}>
                        预计字数：{(this.state.message || '').length + 13}字,&nbsp;&nbsp;67字为一条，最多500字（含标点空格）
                        <br/>
                        短信条数将由您选择的扣费账户短信余额中扣除, 请注意保证余额充足
                    </p>
                </FormItem>
                <Row>
                    <Col span={17} offset={4}>
                        <Alert showIcon message={
                            <div style={{
                                marginLeft: '2em',
                            }}>
                                <div><span style={{
                                    marginLeft: '-2em',
                                }}>注：</span>请不要输入"【】" "[]"符号，统计字数中含"回复TD退订【互联网餐厅】"；</div>
                                <div>输入链接后需要<span style={{color: 'red'}}>输入一个空格</span>，防止链接跟内容解析错误；</div>
                                <div>字数以最终发出短信内容为准；</div>
                            </div>
                        } type="warning" />
                    </Col>
                </Row>
                <Row>
                    <Col span={17} offset={4}>
                        <Button
                            type="ghost"
                            onClick={this.togglePreview}
                        >
                            短信预览
                        </Button>
                        {
                            this.state.showPreview &&
                                <p className={styles.smsPreview}>
                                    {previewMessage}
                                </p>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateMessageTemplate: opts => dispatch(updateMessageTemplate(opts)),
        createMessageTemplate: opts => dispatch(createMessageTemplate(opts)),
        getMessageTemplateList: opts => dispatch(getMessageTemplateList(opts)),
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MessageTemplateEditPanel));
