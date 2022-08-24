import React, { Component } from 'react';
import {
    Icon,
    Upload,
    message,
} from 'antd';
import style from './style.less'

export default class DecorationUploader extends Component {

    onUrlChange = (info) => {
        const { file: { status } } = info;
        if (status === 'done' && info.file.response && info.file.response.url) {
            message.success(<span>{info.file.name} 上传成功</span>);
            this.props.onChange(`http://res.hualala.com/${info.file.response.url}`)
        } else if (status === 'error' || (info.file.response && !info.file.response.url)) {
            message.error(<span>{info.file.name}上传失败</span>);
        }
    }
    beforeUpload = (file) => {
        const { limit } = this.props;
        let isRightSize = true;
        if (limit) {
            isRightSize = file.size / 1024 <= limit;
            if (!isRightSize) {
                message.error(<span>图片大小不要超过 {limit}KB</span>);
            }
        }
        return isRightSize;
    }
    render() {
        const uploadProps = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            accept: 'image/png,image/jpeg,image/gif',
            beforeUpload: this.beforeUpload,
            onChange: this.onUrlChange,
        };
        const { value, onChange, trigger } = this.props;
        const displayTrigger = trigger || (
            <div className={style.uploaderTrigger} >
                <Icon style={{ color: '#999', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} type="plus" />
                <br />
                <span> 上传 </span>
            </div>
        )
        return (
            <Upload
                {...uploadProps}
            >
                {
                    value ? ( // 有value时默认回显，可重置
                        <div className={style.resetableTrigger}>
                            <div
                                className={style.actionBar}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(undefined);
                                }}
                            >
                                重置
                            </div>
                            <img src={value} alt="" />
                        </div>
                    ) : (// 无value时显示自定义trigger或默认trigger
                        displayTrigger
                    )
                }
            </Upload>
        )
    }
}
