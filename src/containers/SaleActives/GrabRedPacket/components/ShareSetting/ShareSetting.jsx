import React from 'react'
import { Input, Form, Select, Col, Button, Icon,Card } from 'antd'
import styles from './ShareSetting.less'
import PhotoFrame from '../../../components/PhotoFrame'
import MsgTpl from './MsgTpl'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
}
// 是否发信息
const SEND_MSG = [
    { label: '不发送', value: "0" },
    { label: '仅推送短信', value: "1" },
    { label: '仅推送微信', value: "2" },
    { label: '同时发送短信和微信', value: "4" },
    { label: '微信推送不成功则发送短信', value: "3" },
];
const ShareForm = Form.create()(({
    form,
    optionData: {
        shareTitle = '请输入标题',
        shareTitlePL = '请输入标题',
        restaurantShareImagePath,
        shareImagePath,
        type,
        isHideDining,
    },
    onRestImg,
    getForm,
    onChangeShareTitle
}) => {
    const { getFieldDecorator } = form;
    if (typeof getForm === 'function') {
        getForm(form)
    }
    return (
        <Form>
            <FormItem
                label="分享标题"
                className={styles.FormItemStyle}
                {...formItemStyle}
            >
                {getFieldDecorator('shareTitle', {
                    rules: [{ max: 35, message: '最多35个字符' }],
                    initialValue: '',
                })(<Input placeholder={shareTitlePL} onChange={onChangeShareTitle} />)}
            </FormItem>

            <FormItem
                label="分享图片"
                className={styles.FormItemStyle}
                {...formItemStyle}
                style={{ position: 'relative' }}
            >
                <PhotoFrame
                    restaurantShareImagePath={restaurantShareImagePath}
                    shareImagePath={shareImagePath}
                    onChange={onRestImg}
                    type={type}
                    isHideDining={isHideDining}
                />
            </FormItem>
        </Form>
    )
})

class ShareSetting extends React.Component {
    constructor(props) {
        console.log(props, 'props----------------------')
        super(props);
        this.state = {
            smsGate: '0',
            signID: '',
            accountNo: '',
            message: '',
            isMsgShow: false,
            selectedMessage: {},
            isShowMsgTxt:false

        };
        this.handleSendMsgChange = this.handleSendMsgChange.bind(this);
        this.handleAccountNoChange = this.handleAccountNoChange.bind(this);
        this.handleSignIDChange = this.handleSignIDChange.bind(this);
        this.handleSelectMsgShow = this.handleSelectMsgShow.bind(this);
        this.onSelectMsgShow = this.onSelectMsgShow.bind(this);
        this.handleSelectMsgShow = this.handleSelectMsgShow.bind(this);
        this.cancelMsgTpl = this.cancelMsgTpl.bind(this)

    }
    componentWillReceiveProps() {
        const { formData,msgTplList=[] } = this.props;
        console.log(this.props,'thisprops-------sdfsd-f-sdf-dsf-ds')
        const {smsTemplate} = formData
        console.log(smsTemplate,'smsTemplatesfdfdsfdsf')
        const selectedMsg = msgTplList.filter((item,index)=>{
            return item.template == smsTemplate
        })
        console.log(selectedMsg,'selectedMsg----------====------')
        this.setState({
            smsGate: formData.smsGate,
            signID: formData.signID,
            accountNo: formData.accountNo,
            selectedMessage:selectedMsg.length > 0 ? selectedMsg[0] : [],
            isShowMsgTxt:selectedMsg.length > 0 ? true : false
        })
    }
    handleSendMsgChange(value) {
        this.setState({
            smsGate: value,
        }, () => {
            this.props.onChange && this.props.onChange(value == 0 ? { smsGate: this.state.smsGate, signID: '', accountNo: '' } : { smsGate: this.state.smsGate });
        });
    }
    handleSignIDChange = (val) => {
        console.log(val, 'vaalu--------------')
        this.setState({
            signID: val,
        }, () => {
            this.props.onChange && this.props.onChange({ signID: this.state.signID });
        })
    }
    handleAccountNoChange(value) {
        console.log(value, 'value111111111111111')
        this.setState({
            accountNo: value,
        }
            , () => {
                this.props.onChange && this.props.onChange({ accountNo: this.state.accountNo });
            }
        )
    }
    onRestImg = (e) => {
        this.props.onRestImg(e)
    }
    getSendMsgLabel = () => {
        const { smsGate } = this.props.formData;
        let label = '不发送消息';
        SEND_MSG.map((v, i) => {
            if (v.value == smsGate) {
                label = v.label
            }
        })
        return label
    }
    onSelectMsgShow(e) {
        const {isMsgShow} = this.state;
        this.setState({
            selectedMessage: e,
            isMsgShow:!isMsgShow,
            isShowMsgTxt:true
        },
            () => {
                this.props.onChange && this.props.onChange({ smsTemplate: e.template })
            }
        )
    }
    handleSelectMsgShow(e) {
        this.setState({
            isMsgShow: true,
        })
    }
    cancelMsgTpl(e){
        this.setState({
            isMsgShow: false,
            isShowMsgTxt:false
        },
            () => {
                this.props.onChange && this.props.onChange({ smsTemplate: '' })
            }
        )
    }
    render() {
        const { value = {}, getForm, messageSignList, queryFsmGroupList, msgTplList = [],formData } = this.props;
        const { smsTemplate } =  formData;
        const { accountNo, message, isMsgShow, selectedMessage ,isShowMsgTxt} = this.state;
        return (
            <div className={styles.shareSetting}>
                <div className={styles.title}>
                    <div className={styles.line}></div>
                    分享设置
                </div>
                <ShareForm
                    onRestImg={this.onRestImg}
                    optionData={value}
                    getForm={getForm}
                />
                <div className={styles.title}>
                    <div className={styles.line}></div>
                    消息推送
                </div>
                <FormItem
                    label='消息推送'
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select size="default"
                        value={this.getSendMsgLabel()}
                        onChange={this.handleSendMsgChange}
                        getPopupContainer={(node) => node.parentNode}
                        defaultValue='不发送'
                    >
                        {
                            SEND_MSG.map((item) => {
                                return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                            })
                        }
                    </Select>
                </FormItem>
                {
                    (this.state.smsGate == 1 || this.state.smsGate == 3 || this.state.smsGate == 4) && (
                        <Col>
                            <FormItem
                                label='短信签名'
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select size="default"
                                    value={this.state.signID ? '互联网签名' : '默认签名'}
                                    onChange={this.handleSignIDChange}
                                    getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option value={''} key={''}>默认签名</Option>
                                    {
                                        messageSignList.map((item) => {
                                            return (<Option value={`${item.signID}`} key={`${item.signID}`}>{item.signName}</Option>)
                                        })
                                    }

                                </Select>
                            </FormItem>
                            <FormItem
                                label='短信权益账户'
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                required
                                validateStatus={accountNo > 0 ? 'success' : 'error'}
                                help={accountNo > 0 ? '' : '短信权益账户不得为空'}
                            >
                                <Select
                                    onChange={this.handleAccountNoChange}
                                    value={accountNo || undefined}
                                    placeholder='请选择权益账户'
                                    getPopupContainer={(node) => node.parentNode}
                                >
                                    {(queryFsmGroupList || []).map((accountInfo) => {
                                        return (
                                            <Option
                                                key={accountInfo.accountNo}
                                                disabled={!accountInfo.hasPermission}
                                            >
                                                {accountInfo.accountName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <div>
                                    {
                                        (queryFsmGroupList || []).map((accountInfo) => {
                                            if (accountInfo.accountNo == accountNo) {
                                                return (
                                                    <div key={accountInfo.accountNo} style={{ margin: '8px 8px 0', color: accountInfo.smsCount ? 'inherit' : 'red' }}>{`短信可用条数：${accountInfo.smsCount || 0}条`}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </FormItem>
                            <FormItem
                                label='短信模板'
                                required
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                className={styles.msgTplWrapper}
                            >
                                {
                                    isMsgShow
                                    ?
                                    <MsgTpl
                                        onChange={this.onSelectMsgShow}
                                        msgTplList={msgTplList}
                                        selectedMessage={selectedMessage}
                                    />
                                    : isShowMsgTxt
                                    ?
                                    <Card title="模板内容" extra={<a href="#" onClick={this.cancelMsgTpl}>删除</a>}  className={styles.messageTpl}>
                                        <p>{smsTemplate}</p>
                                    </Card>
                                    :
                                    <Button onClick={this.handleSelectMsgShow}>
                                        <Icon type="plus" /> 选择短信模板
                                    </Button>
                                }
                            </FormItem>
                        </Col>

                    )
                }
            </div>

        )
    }
}

export default ShareSetting
