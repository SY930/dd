import React from 'react'
import { Input, Form } from 'antd'
import styles from './ShareSetting.less'
import PhotoFrame from '../PhotoFrame'

const FormItem = Form.Item;

const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
}

const ShareForm = Form.create()(({
    form,
    optionData: {
        shareTitle = '亲爱的朋友，帮我助力赢大礼。',
        shareTitlePL = '亲爱的朋友，帮我助力赢大礼。',
        shareSubtitle = '海吃海喝就靠你啦！',
        shareSubtitlePL = '海吃海喝就靠你啦！',
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
                label="分享副标题"
                className={styles.FormItemStyle}
                {...formItemStyle}
            >
                {getFieldDecorator('shareSubtitle', {
                    rules: [{ max: 35, message: '最多35个字符' }],
                    initialValue: shareSubtitle,
                })(<Input placeholder={shareSubtitlePL} />)}
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
    onRestImg = (e) => {
        this.props.onRestImg(e)
    }

    render() {
        const { value = {} } = this.props

        return (
            <div className={styles.shareSetting}>
                <div className={styles.title}>
                    <div className={styles.line}></div>
                    分享设置
                </div>

                <ShareForm
                    onRestImg={this.onRestImg}
                    optionData={value}
                    getForm={this.props.getForm}
                />
            </div>
        )
    }
}

export default ShareSetting
