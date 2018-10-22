import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    queryWeChatMessageTemplates,
    saleCenterChangeWeChatMessageTemplateCurrentType,
    saleCenterChangeWeChatMessageTemplates,
    saveWeChatMessageTemplates,
    saleCenterResetWeChatMessageTemplates
} from "../../../redux/actions/actions";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';
import ENV from "../../../helpers/env";
import {
    Row,
    Col,
    Icon,
    Input,
    DatePicker,
    Tag,
    Modal,
    Radio,
    Form,
    Select,
    message,
    Spin,
    Upload,
    Checkbox,
    Button
} from 'antd';
import CloseableTip from "../../../components/common/CloseableTip/index";
import {DEFAULT_WECHAT_TEMPLATE_CONFIG} from "../../../constants/weChatTemplateConstants";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const validUrl = require('valid-url');

const availableMsgType = [
    {
        value: '2',
        label: '礼品领取成功通知',
    },
    {
        value: '1',
        label: '礼品到期提醒',
    },

];

const availableUrlType = [
    {
        value: '1',
        label: '我的优惠券',
    },
    {
        value: '2',
        label: '海报',
        disabled: HUALALA.ENVIRONMENT === 'production-release',
    },
    {
        value: '3',
        label: '自定义链接',
    },
];


class WeChatMessageFormWrapper extends Component {

    componentDidMount() {
        this.props.queryWeChatMessageTemplates();
    }

    handleMsgTypeChange = (value) => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!flag) return message.warning('请先通过表单校验');
        if (this.props.reDirectType == 2 && !this.props.reDirectUrl) return message.warning('请上传海报图片');
        this.props.handleCurrentTypeChange(Number(value));
    }

    renderFormItems(key) {
        const {
            form: {getFieldDecorator},
            title,
            remark,
            reDirectType,
            currentType: type,
            isPushMsg,
            reDirectUrl,
            isEditing,
            handleKeyValueChange
        } = this.props;
        return (
            <div
                key={key}
                style={{
                    width: '600px',
                }}
            >
                <FormItem
                    label="标题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    {getFieldDecorator(`title${key}`, {
                        initialValue: title,
                        rules: [{
                            message: '不多于50个字符',
                            pattern: /^.{0,50}$/,
                        }],
                    })(
                        <Input
                            placeholder={DEFAULT_WECHAT_TEMPLATE_CONFIG[type].title}
                            disabled={!isEditing}
                            onChange={(e) => handleKeyValueChange({key: 'title', value: e.target.value, type})}
                        />
                    )}
                </FormItem>
                <FormItem
                    label="备注"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    {getFieldDecorator(`remark${key}`, {
                        initialValue: remark,
                        rules: [{
                            message: '不多于50个字符',
                            pattern: /^.{0,50}$/,
                        }],
                    })(
                        <Input
                            placeholder={DEFAULT_WECHAT_TEMPLATE_CONFIG[type].remark}
                            disabled={!isEditing}
                            onChange={(e) => handleKeyValueChange({key: 'remark', value: e.target.value, type})}
                        />
                    )}
                </FormItem>
                <FormItem
                    label="跳转链接"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: 'relative' }}
                >
                    <Select
                        getPopupContainer={(node) => node.parentNode}
                        size="default"
                        value={String(reDirectType)}
                        disabled={type == 1 || !isEditing}
                        onChange={(value) => {
                            handleKeyValueChange({key: 'reDirectType', value, type});
                            handleKeyValueChange({key: 'reDirectUrl', value: '', type});
                        }}
                    >
                        {availableUrlType.map(type => (<Select.Option disabled={type.disabled} value={type.value} key={type.value}>{type.label}</Select.Option>))}
                    </Select>
                </FormItem>

                {Number(reDirectType) === 3 && (
                    <FormItem
                        label="链接地址"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ position: 'relative' }}
                    >
                        {getFieldDecorator(`reDirectUrl${key}`, {
                            initialValue: reDirectUrl,
                            rules: [
                                {
                                    required: true,
                                    message: '不多于255个字符',
                                    pattern: /^.{0,255}$/,
                                },
                                {
                                    validator: (rule, v, cb) => {
                                        validUrl.isWebUri(v) ? cb() : cb(rule.message);
                                    },
                                    message: '请输入有效的链接地址',
                                }
                            ],
                        })(
                            <Input
                                disabled={!isEditing}
                                placeholder="自定义链接请务必慎重填写"
                                onChange={(e) => handleKeyValueChange({key: 'reDirectUrl', value: e.target.value, type})}
                            />
                        )}
                    </FormItem>
                )}
                {Number(reDirectType) === 2 && (
                    <FormItem
                        label="上传海报图"
                        required
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ position: 'relative' }}
                    >
                        {this.renderImgUrl()}
                    </FormItem>
                )}
                {
                    Number(type) === 1 && (
                        <FormItem
                            label="是否推送消息"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                            style={{ position: 'relative' }}
                        >
                            <RadioGroup
                                onChange={(e) => handleKeyValueChange({key: 'isPushMsg', value: e.target.value, type})}
                                value={isPushMsg}
                                disabled={!isEditing}
                            >
                                <Radio key={'1'} value={1}>是</Radio>
                                <Radio key={'0'} value={0}>否</Radio>
                            </RadioGroup>
                        </FormItem>
                    )
                }
            </div>
        )
    }

    renderImgUrl = () => {
        const {
            form: {getFieldDecorator},
            title,
            remark,
            reDirectType,
            currentType: type,
            isPushMsg,
            reDirectUrl,
            handleKeyValueChange
        } = this.props;
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            className: [styles1.avatarUploader, styles1.thinAvatarUploader].join(' '),
            accept: 'image/*',
            beforeUpload: file => {
                const isAllowed = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isAllowed) {
                    message.error('仅支持png和jpeg/jpg格式的图片');
                }
                const isLt1M = file.size / 1024 / 1024 < 4;
                if (!isLt1M) {
                    message.error('图片不要大于4MB');
                }
                return isAllowed && isLt1M;
            },
            onChange: (info) => {
                const status = info.file.status;
                if (status === 'done' && info.file.response && info.file.response.url) {
                    message.success(`${info.file.name} 上传成功`);
                    this.props.handleKeyValueChange({key: 'reDirectUrl', value: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`, type})
                } else if (status === 'error' || (info.file.response && !info.file.response.url)) {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem>
                        <Upload {...props}>
                            {
                                this.props.reDirectUrl ?
                                    <img src={this.props.reDirectUrl} alt="" className={[styles1.avatar, styles1.thinAvatar].join(' ')} /> :
                                    <Icon
                                        type="plus"
                                        className={[styles1.avatarUploaderTrigger, styles1.thinAvatarUploaderTrigger].join(' ')}
                                    />
                            }
                        </Upload>
                        <p className="ant-upload-hint">
                            点击上传图片，图片格式为jpg、png, 小于4MB
                            <br/>
                            建议尺寸: 1080*1920像素
                            <br/>
                            注: 点击海报将跳转至我的优惠券页面
                        </p>
                    </FormItem>
                </Col>
            </Row>
        )
    }

    save = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!flag) return message.warning('请先通过表单校验');
        if (this.props.reDirectType == 2 && !this.props.reDirectUrl) return message.warning('请上传海报图片');
        this.props.saveWeChatMessageTemplates({wechatTemplates: this.props.wechatTemplates.toJS()} , this.props.isCreate);
    }

    reset = () => {
        this.props.saleCenterResetWeChatMessageTemplates();
        this.props.queryWeChatMessageTemplates();
        this.props.form.resetFields();
    }

    render() {
        const {
            currentType,
            isSaving,
            isEditing
        } = this.props;
        return (
            <div style={{
                margin: '180px 0 50px 100px'
            }}>
                <Form className={styles.FormStyle}>
                    <FormItem
                        label="通知类型"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ position: 'relative' }}
                    >
                        <Select
                            showSearch={true}
                            getPopupContainer={(node) => node.parentNode}
                            size="default"
                            value={String(currentType)}
                            onChange={this.handleMsgTypeChange}
                        >
                            {availableMsgType.map(type => (<Select.Option value={type.value} key={type.value}>{type.label}</Select.Option>))}
                        </Select>
                        {
                            String(currentType) === '1' && (
                                <CloseableTip
                                    style={{
                                        position: 'absolute',
                                        right: '-20px',
                                        top: '3px'
                                    }}
                                    content={
                                        <div>
                                            <p>礼品到期提醒：</p>
                                            <p style={{
                                                textIndent: '2em'
                                            }}
                                            >由于微信提供的可推送消息类型里没有礼品到期提醒，最接近的模板为：会员到期提醒，所以实际推送模板为会员到期提醒，如有异议，可以关闭推送</p>
                                        </div>
                                    }
                                />
                            )
                        }
                    </FormItem>
                    {this.renderFormItems(currentType)}
                </Form>
                <div style={{
                    visibility: isEditing ? 'visible' : 'hidden',
                    marginRight: '12.5%',
                    textAlign: 'right'

                }}>
                    <Button
                        type="ghost"
                        disabled={isSaving}
                        style={{
                            marginRight: '10px'
                        }}
                        onClick={this.reset}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        loading={isSaving}
                        onClick={this.save}
                    >
                        保存
                    </Button>
                </div>
            </div>


        )
    }
}



function mapStateToProps(state) {
    const templateToUpdate = state.sale_wechat_message_setting.get('wechatMessageTemplateList').find(listing => {
        return listing.get('msgType') === state.sale_wechat_message_setting.get('currentType');
    });
    return {
        remark : templateToUpdate.get('remark'),
        title : templateToUpdate.get('title'),
        reDirectType : templateToUpdate.get('reDirectType'),
        reDirectUrl : templateToUpdate.get('reDirectUrl'),
        isPushMsg : templateToUpdate.get('isPushMsg'),
        wechatTemplates: state.sale_wechat_message_setting.get('wechatMessageTemplateList'),
        currentType: state.sale_wechat_message_setting.get('currentType'),
        isSaving: state.sale_wechat_message_setting.get('isSaving'),
        isEditing: state.sale_wechat_message_setting.get('isEditing'),
        isCreate: state.sale_wechat_message_setting.get('isCreate'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handleKeyValueChange: opts => dispatch(saleCenterChangeWeChatMessageTemplates(opts)),
        saveWeChatMessageTemplates: (opts, isCreate) => dispatch(saveWeChatMessageTemplates(opts, isCreate)),
        queryWeChatMessageTemplates: opts => dispatch(queryWeChatMessageTemplates(opts)),
        saleCenterResetWeChatMessageTemplates: opts => dispatch(saleCenterResetWeChatMessageTemplates(opts)),
        handleCurrentTypeChange: opts => dispatch(saleCenterChangeWeChatMessageTemplateCurrentType(opts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WeChatMessageFormWrapper))
