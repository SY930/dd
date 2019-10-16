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
        if (status === 'done' && info.file.response && (info.file.response.data && info.file.response.data.url)) {
            message.success(`${info.file.name} 上传成功`);
            this.props.onChange(`http://res.hualala.com/${info.file.response.data.url}`)
        } else if (status === 'error' || (info.file.response && !(info.file.response.data && info.file.response.data.url))) {
            message.error(`${info.file.name} 上传失败`);
        }
    }
    beforeUpload = (file) => {
        const { limit } = this.props;
        let isRightSize = true;
        if (limit) {
            isRightSize = file.size / 1024 <= limit;
            if (!isRightSize) {
                message.error(`图片不要大于${limit}KB`);
            }
        }
        return isRightSize;
    }
    render() {
        const uploadProps = {
            name: 'file',
            showUploadList: false,
            action: '/api/shopcenter/upload',
            accept: 'image/png,image/jpeg,image/gif',
            beforeUpload: this.beforeUpload,
            onChange: this.onUrlChange,
        };
        const { value, onChange } = this.props;
        return (
            <Upload
                {...uploadProps}
            >
                {
                    value ? (
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
                            <img src={value} alt=""/>
                        </div>
                    ) : (
                        <div className={style.uploaderTrigger} >
                            <Icon style={{ color: '#999', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} type="plus" />
                            <br/>
                            <span>
                                上传
                            </span>
                        </div> 
                    )
                }                               
            </Upload>
        )
    }
}
