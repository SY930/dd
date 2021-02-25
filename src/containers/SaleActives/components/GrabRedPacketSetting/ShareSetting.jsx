import React from 'react'
import { Input, Form,Select } from 'antd'
import styles from './ShareSetting.less'
import PhotoFrame from '../PhotoFrame'

const FormItem = Form.Item;

const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
}
// 是否发信息
const SEND_MSG = [
    {
        label: '不发送信息',
        value: "0",
    },
    {
        label: '仅推送短信',
        value: "1",
    },
    {
        label: '仅推送微信',
        value: "2",
    },
    {
        label: '同时发送短信和微信',
        value: "4",
    },
    {
        label: '微信推送不成功则发送短信',
        value: "3",
    },
];
const ShareForm = Form.create()(({
    form,
    optionData: {
        shareTitle = '请输入标题',
        shareTitlePL = '请输入标题',
        // shareSubtitle = '海吃海喝就靠你啦！',
        // shareSubtitlePL = '海吃海喝就靠你啦！',
        restaurantShareImagePath,
        shareImagePath,
        type,
        isHideDining,
    },
    onRestImg,
    getForm,
}) => {
    const { getFieldDecorator } = form
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
                    initialValue: shareTitle,
                })(<Input placeholder={shareTitlePL} />)}
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
        console.log(props,'props----------------------')
        super(props);
        this.state = {
            sendMsg: '1',
            // signID:props.specialPromotion.getIn(['$eventInfo', 'signID']) || '',
            
        };
        this.handleSendMsgChange = this.handleSendMsgChange.bind(this);
        
    }
    handleSendMsgChange(value) {
        this.setState({
            sendMsg: value,
        });
    }
    onRestImg = (e) => {
        this.props.onRestImg(e)
    }

    render() {
        const { value = {}, getForm } = this.props

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
                            value={this.state.sendMsg}
                            onChange={this.handleSendMsgChange}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            SEND_MSG.map((item) => {
                                return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                            })
                        }
                    </Select>
                </FormItem>
                {
                    (this.state.sendMsg == 1 || this.state.sendMsg == 3 || this.state.sendMsg == 4) && (
                        <FormItem
                            label='短信签名'
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <Select size="default"
                                    value={`${this.state.signID}`}
                                    // onChange={this.handleSignIDChange}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option value={''} key={''}>默认签名</Option>
                                <Option value='1' key='1'>互联网签名</Option>
                                {/* {
                                    this.props.specialPromotion.get('SMSSignList').toJS().map((item) => {
                                        return (<Option value={`${item.signID}`} key={`${item.signID}`}>{item.signName}</Option>)
                                    })
                                } */}
                            </Select>
                        </FormItem>
                    )
                }
            </div>
            
        )
    }
}

export default ShareSetting
