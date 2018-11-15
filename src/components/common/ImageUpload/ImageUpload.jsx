import React from 'react';
import { Modal, Upload, Icon, Alert, message } from 'antd';

import ENV from '../../../helpers/env';
import {
    FILE_TYPE_IMAGE,
    FILE_TYPE_VIDEO,
    FILE_THUMBNAIL,
    getFileTypeByName,
} from './utils';

import styles from './style.less';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: this.getFileListFromValue(props.value),
            previewVisible: false,
            previewImage: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: this.getFileListFromValue(nextProps.value),
        });
    }

    getFileListFromValue(value = '') {
        const url = `${ENV.FILE_RESOURCE_DOMAIN}/${value.url || value}`;
        const type = getFileTypeByName(url);
        const thumbUrl = type === FILE_TYPE_IMAGE ? url : FILE_THUMBNAIL[type];
        return value ? [{
            uid: -1,
            status: 'done',
            url,
            thumbUrl,
        }] : [];
    }

    handleUpload = (file) => {
        if (!file) return true; // in case of browser compatibility
        const {
            limitType = '',
            limitSize = 0,
        } = this.props;
        const types = limitType ? limitType.split(',') : [];
        const sizes = Array.isArray(limitSize) ? limitSize : [limitSize];
        const matchedType = types.find((type) => {
            const regexp = new RegExp(`^.*${type.replace('.', '\\.')}$`);
            return file.name.match(regexp);
        });
        const matchIndex = types.indexOf(matchedType);
        const matchedSize = sizes[matchIndex] || sizes[0];
        if (types.length && !matchedType) {
            message.error('上传文件格式错误');
            return false;
        }
        if (matchedSize !== undefined && matchedSize !== 0 && file.size > matchedSize) {
            message.error('上传文件大小超过限制');
            return false;
        }
        return true;
    }

    handleChange = ({ file, fileList }) => {
        if (file.status !== 'done') return this.setState({ fileList });
        const response = file.response || {};
        const { url, imgHWP } = response;
        if (!url) {
            message.error(response.resultMsg || '图片上传失败，请稍后重试');
            return this.setState({ fileList: [] });
        }
        if (this.props.hwpName) {
            this.props.onChange({
                url,
                [this.props.hwpName]: imgHWP,
            });
        } else {
            this.props.onChange(url);
        }
        return this.setState({
            fileList: this.getFileListFromValue(url),
        });
    }

    handlePreview = (file) => {
        this.setState({
            previewVisible: true,
            previewImage: file.url || file.thumbUrl,
        });
    }

    handleRemove = () => {
        this.props.onChange('');
    }

    handleCancelPreview = () => {
        this.setState({
            previewVisible: false,
        });
    }

    renderPreviewContent(url) {
        const type = getFileTypeByName(url);
        switch (type) {
            case FILE_TYPE_IMAGE:
                return (<img alt="example" style={{ width: '100%' }} src={url} />);
            case FILE_TYPE_VIDEO:
                return (
                    <video src={url} controls={true} style={{ width: '100%' }}>
                        <track kind="captions" />
                        <source src={url} type="video/mp4" />
                        <object>
                            <embed src={url} />
                        </object>
                    </video>
                );
            default:
                return (
                    <Alert
                        type="warning"
                        showIcon={true}
                        message="抱歉"
                        description="该类型文件暂不支持预览"
                    />
                );
        }
    }

    render() {
        const {
            name = 'myFile',
            action = '/api/common/imageUpload',
            tips = '点击上传图片',
            // TODO: upload more than one file
            // limitCount = 1,
        } = this.props;
        const { fileList, previewVisible, previewImage } = this.state;
        return (
            <div className={styles.uploader}>
                <Upload
                    name={name}
                    action={action}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={this.handleUpload}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview}
                    onRemove={this.handleRemove}
                >
                    {fileList.length < 1 &&
                        <div>
                            <Icon type="plus" />
                            <div className="upload-tips">
                                {tips}
                            </div>
                        </div>
                    }
                </Upload>
                {previewVisible &&
                    <Modal
                        title="预览"
                        maskClosable={false}
                        footer={null}
                        className={styles.previewModal}
                        visible={previewVisible}
                        onCancel={this.handleCancelPreview}
                    >
                        {this.renderPreviewContent(previewImage)}
                    </Modal>
                }
            </div>
        );
    }
}

export default ImageUpload;
