import React from 'react';
import {connect} from 'react-redux';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';
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
@injectIntl()
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
        const { intl } = this.props;
        const k6d9lmo3 = intl.formatMessage(SALE_STRING.k6d9lmo3);
        const k6d9lmwf = intl.formatMessage(SALE_STRING.k6d9lmwf);
        const k6d9ln4r = intl.formatMessage(SALE_STRING.k6d9ln4r);
        const k6h90qcx = intl.formatMessage(SALE_STRING.k6h90qcx);
        const myStr = '\\['+k6d9lmwf+'\\]\|\\['+k6d9ln4r+'\/'+k6h90qcx+'\\]';
        var rex = new RegExp(myStr, 'g');
        const strippedMessage = message.replace(rex, '');
        if (/[\[\]【】]/.test(strippedMessage)) { // 剔除模板字段(例如[会员姓名])后依然有"【】" "[]"符号, 不允许保存
            this.props.form.setFields({
                message: {
                    errors: [new Error(k6d9lmo3)]
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
                        messageService.success(SALE_STRING.k5do0ps6);
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
                        messageService.success(SALE_STRING.k5do0ps6);
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
        console.dir(e.target);
        message += `[${e.target.textContent}]`;
        console.log('message', message);
        this.props.form.setFieldsValue({
            message
        });
        this.props.form.validateFields(['message']);
        this.setState({
            message,
        });
    }

    render() {
        const title = <span>{COMMON_LABEL.edit} {SALE_LABEL.k6d9ll1r}</span>
        return (
                <Modal
                    title={title}
                    visible={this.props.visible}
                    footer={
                        <div style={{textAlign: 'center'}}>
                            <Button type="ghost"
                                    onClick={this.cancel}>{COMMON_LABEL.close}
                            </Button>
                            <Button
                                disabled={this.state.message === this.state.pristineMessage}
                                style={{marginLeft:8}}
                                type="primary"
                                loading={this.state.loading}
                                onClick={this.save}>
                                {COMMON_LABEL.save}
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
        const { intl } = this.props;
        const k6d9lmwf = intl.formatMessage(SALE_STRING.k6d9lmwf);
        const k6d9ln4r = intl.formatMessage(SALE_STRING.k6d9ln4r);
        const k6h90qcx = intl.formatMessage(SALE_STRING.k6h90qcx);
        const k6h90ql9 = intl.formatMessage(SALE_STRING.k6h90ql9);
        const k6h90qtl = intl.formatMessage(SALE_STRING.k6h90qtl);
        const k6h90t4x = intl.formatMessage(SALE_STRING.k6h90t4x);
        const btnTxt = k6d9ln4r + '/' + k6h90qcx;
        const myStr = '\\['+k6d9lmwf+'\\]\|\\['+k6d9ln4r+'\/'+k6h90qcx+'\\]';
        var rex = new RegExp(myStr, 'g');
        const previewMessage = this.state.message.replace(rex, 'XX').concat(k6h90t4x);
        return (
            <div>
                <FormItem style={{padding: '0'}} label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
                    <Button onClick={this.addMessageInfo}>{k6d9lmwf}</Button>
                    <Button onClick={this.addMessageInfo}>{btnTxt}</Button>
                </FormItem>
                <Form>
                    <FormItem
                        label={SALE_LABEL.k6d9ll1r}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {this.props.form.getFieldDecorator('message', {
                            rules: [
                                { required: true, message: k6h90ql9 },
                                { max: 500, message: k6h90qtl },
                            ],
                            initialValue: this.state.message,
                            onChange: this.handleMsgChange
                        })(
                            <Input rows={8} type="textarea" placeholder={k6h90ql9} />
                        )}

                    </FormItem>
                </Form>
                <FormItem label="" className={styles.FormItemStyle} wrapperCol={{ span: 17, offset: 4 }} >
                    <p className={styles.smsRulesBox}>
                    {SALE_LABEL.k6h90r1x}：{(this.state.message || '').length + 13}{SALE_LABEL.k6h90ril}
                        <br/>
                        {SALE_LABEL.k6h90ra9}
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
                                }}>{SALE_LABEL.k5m6e3pr}：</span>{SALE_LABEL.k6h90rqx}；</div>
                                <div>{SALE_LABEL.k6h90s7l}<span style={{color: 'red'}}>{SALE_LABEL.k6h90sfx}</span>，{SALE_LABEL.k6h90so9}；</div>
                                <div>{SALE_LABEL.k6h90rz9}；</div>
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
                            {SALE_LABEL.k6h90swl}
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
