import React, {Component} from 'react';
import {
    Modal,
    Button,
    Input,
    Upload,
    Icon,
    Form,
    message,
} from 'antd'
import style from './style.less'
import {axiosData} from "../../helpers/util";

const FormItem = Form.Item;

class PayAccountModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSaving: false,
            shaSecretKey: undefined,
            subMchID: undefined,
            fileList: [],
        }
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll({scroll: {offsetBottom: 20}}, err => {
            if (err) flag = false;
        });
        if (!flag) {
            return;
        }
        const {
            fileList,
            shaSecretKey,
            subMchID,
        } = this.state;
        if (!fileList.length) {
            return message.warning('请上传API证书')
        }
        let apiCertificateUrl;
        try {
            apiCertificateUrl = fileList[0].response.data.url
        } catch (e) {
            message.warning('证书未能上传成功,请重新上传或刷新重试');
            return;
        }
        this.setState({ isSaving: true });
        axiosData(
            '/payCoupon/createAccount',
            {
                shaSecretKey,
                subMchID,
                apiCertificateUrl: `http://res.hualala.com/${apiCertificateUrl}`,
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({ isSaving: false });
            this.props.onOk();
            message.success('添加成功')
        }).catch(err => {
            this.setState({ isSaving: false });
        })
    }

    handleSubMchIDChange = ({ target: { value } }) => {
        this.setState({ subMchID: value })
    }

    handleShaSecretKeyChange = ({ target: { value } }) => {
        this.setState({ shaSecretKey: value })
    }

    renderUploadButton() {
        const props = {
            name: 'file',
            action: '/api/shopcenter/upload',
            accept: '.p12',
            onChange: (info) => {
                const status = info.file.status;
                let fileList = info.fileList;
                fileList = fileList.filter((file) => {
                    if (file.response) {
                        return file.response.status !== 'error';
                    }
                    if (status) {
                        return status !== 'error'
                    }
                    return true;
                });
                fileList = fileList.length ? [fileList[fileList.length - 1]] : []
                this.setState({ fileList });
            },
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                <Button>
                    <Icon type="upload" /> 上传证书
                </Button>
            </Upload>
        )
    }

    render() {
        const {
            onCancel,
            form: {
                getFieldDecorator,
            },
        } = this.props;
        return (
            <Modal
                title="新增制券方"
                maskClosable={false}
                width={'500px'}
                visible={true}
                onCancel={onCancel}
                footer={[
                    <Button onClick={onCancel} type="ghost">取消</Button>,
                    <Button onClick={this.handleSubmit} type="primary" loading={this.state.isSaving}>确定</Button>
                ]}
            >
                <div>
                    <FormItem
                        label="商户号"
                        wrapperCol={{span: 18}}
                        labelCol={{span: 4, offset: 1}}
                        required={true}
                    >
                        {getFieldDecorator('subMchID', {
                            onChange: this.handleSubMchIDChange,
                            rules: [
                                { required: true, message: '商户号不得为空' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        if ((!/^\d{1,20}$/g.test(v))) {
                                            return cb(rule.message);
                                        }
                                        cb();
                                    },
                                    message: '必须输入数字, 且长度不超过20位',
                                }
                            ]
                        })(<Input
                            placeholder="请输入正确的商户号"
                            style={{ width: 320, marginRight: 20 }}
                        />)}
                    </FormItem>
                    <FormItem
                        label="密钥"
                        wrapperCol={{span: 18}}
                        labelCol={{span: 4, offset: 1}}
                        required={true}
                    >
                        {getFieldDecorator('shaSecretKey', {
                            onChange: this.handleShaSecretKeyChange,
                            rules: [
                                { required: true, message: '密钥不得为空' },
                                { len: 32, message: '密钥长度为32位'},
                                { pattern: /^\S*$/, message: '不要输入空格'}
                            ]
                        })(<Input
                            placeholder="请输入正确的密钥"
                            style={{ width: 320, marginRight: 20 }}
                        />)}
                    </FormItem>
                    <FormItem
                        label="API 证书"
                        wrapperCol={{span: 18}}
                        labelCol={{span: 4, offset: 1}}
                        required={true}
                        className={style.customUploaderRow}
                    >
                        {this.renderUploadButton()}
                        <span className={style.positionedUploaderTip} >
                            请上传对应的API证书,例如:api_cert.p12
                        </span>
                    </FormItem>
                </div>
            </Modal>
        )
    }
}

export default Form.create()(PayAccountModal)
