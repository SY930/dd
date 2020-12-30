import React, { Component } from 'react';
import {
    Upload,
    Modal,
    message,
    Icon,
} from 'antd';
import axios from 'axios';
import Cropper from 'react-cropper';
import PropTypes from 'prop-types';
import style from './cropper.less';

function dataURLtoBlob(dataurl, mimeType) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mimeType || mime });
}

const MIME_EXT_MAP = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

class CropperUploader extends Component {

    constructor(props) {
        super(props)
        this.fileReader = null;
        this.state = {
            dataUri: '',
            cropperVisible: false,
            confirmLoading: false,
        }
    }

    componentDidMount() {
        this.fileReader = new FileReader();
        this.fileReader.addEventListener('load', () => {
            this.setState({
                dataUri: this.fileReader.result,
                cropperVisible: true,
            });
        }, false);
    }

    componentWillUnmount() {
        this.fileReader = null;
    }

    beforeUpload = (file) => {
        const {
            limit,
            allowedType,
        } = this.props;
        let isAllowed = true;
        if (Array.isArray(allowedType) && allowedType.length) {
            isAllowed = allowedType.includes(file.type);
            if (!isAllowed) {
                message.error(`仅支持${allowedType.join('，')}格式的图片`);
            }
        }
        let isRightSize = true;
        if (limit) {
            isRightSize = file.size / 1024 <= limit;
            if (!isRightSize) {
                message.error(`图片不要大于${limit}KB`);
            }
        }
        if (isAllowed && isRightSize) {
            this.fileReader.readAsDataURL(file);
        }
        return false;
    }

    handleOk = () => {
        const {
            croppedCanvasOption: option,
            isAbsoluteUrl,
        } = this.props;
        let finalUri;
        try {
            finalUri = this.cropper.getCroppedCanvas(option).toDataURL();
        } catch (e) {
            return message.warning('剪切出现了点问题, 请重试')
        }
        this.setState({
            confirmLoading: true,
        })
        setTimeout(() => {
            const formData = new FormData();
            const blob = dataURLtoBlob(finalUri);
            formData.append('myFile', (new File([blob], `myFile.${MIME_EXT_MAP[blob.type] || 'png'}`, { type: blob.type })));
            axios({
                url: '/api/common/imageUpload',
                method: 'POST',
                data: formData,
            }).then((res) => {
                if (res && res.url) {
                    this.setState({
                        confirmLoading: false,
                    });
                    this.props.onChange(isAbsoluteUrl ? `http://res.hualala.com/${res.url}` : res.url)
                    this.cancel();
                } else {
                    message.warning('剪切后的图片上传失败, 请重试');
                    this.setState({
                        confirmLoading: false,
                    })
                }
            }, () => {
                this.setState({
                    confirmLoading: false,
                })
            })
        }, 100);
    }

    cancel = () => {
        this.setState({
            dataUri: '',
            cropperVisible: false,
            confirmLoading: false,
        })
    }
    getRealUrl = (url) => {
        const { isAbsoluteUrl } = this.props;
        if (isAbsoluteUrl) return url;
        return `http://res.hualala.com/${url}`
    }

    render() {
        const {
            allowedType,
            cropperRatio,
            uploadTrigger,
            isMaskClosable = true,
            value,
            onChange,
            width,
            height,
        } = this.props;
        const { dataUri, cropperVisible, confirmLoading } = this.state;
        const uploadProps = {
            name: 'file',
            showUploadList: false,
            action: '/api/shopcenter/upload',
            accept: Array.isArray(allowedType) && allowedType.length ? allowedType.join(',') : 'image/*',
            beforeUpload: this.beforeUpload,
            onChange: () => {
                // no need for onChange
                return false;
            },
        };
        const displayTrigger = typeof uploadTrigger === 'function' ? uploadTrigger() : (
            <div style={{ width, height }} className={style.cropperUploaderTrigger} >
                {
                    this.props.selfIcon ?
                        this.props.selfIcon :
                        <Icon style={{ color: '#999', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} type="plus" />
                }
                <br />
                <span>
                    {
                        this.props.uploadTest ?
                            this.props.uploadTest :
                            this.props.selfIcon ?
                                '' :
                                '上传'
                    }
                </span>
            </div>
        )
        return (
            <div>
                <Upload
                    {...uploadProps}
                >
                    {
                        value ? ( // 有value时默认回显，可重置
                            <div style={{ width, height }} className={style.resetableTrigger}>
                                <div
                                    className={style.actionBar}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(undefined);
                                    }}
                                >
                                    重置
                                </div>
                                <img style={{ width: width - 2, height: height - 2 }} src={this.getRealUrl(value)} alt="" />
                            </div>
                        ) : (// 无value时显示自定义trigger或默认trigger
                                displayTrigger
                            )
                    }
                </Upload>
                {
                    cropperVisible && (
                        <Modal
                            title="图片裁切"
                            visible={true}
                            width="700px"
                            onOk={this.handleOk}
                            onCancel={this.cancel}
                            maskClosable={isMaskClosable}
                            confirmLoading={confirmLoading}
                        >
                            {!!dataUri && (
                                <Cropper
                                    ref={cropper => this.cropper = cropper}
                                    src={dataUri}
                                    style={{ height: 450, width: '100%' }}
                                    aspectRatio={cropperRatio || 9 / 16}
                                    guides={true}
                                />
                            )}
                        </Modal>
                    )
                }
            </div>
        )
    }
}

CropperUploader.propTypes = {
    /** 涉及到的图片路径是否是绝对路径 */
    isAbsoluteUrl: PropTypes.bool,
    /** 默认trigger的宽 */
    width: PropTypes.number,
    /** 默认trigger的高 */
    height: PropTypes.number,
    /** 初始/回显时的图片路径地址  */
    value: PropTypes.string,
    /** 裁剪后的图片上传完成时的回调 */
    onChange: PropTypes.func,
    /** 裁剪框比例 */
    cropperRatio: PropTypes.number,
    /** 裁剪弹窗是否可点击外部遮罩关闭 */
    isMaskClosable: PropTypes.bool,
    /** 可接受的图片类型 ['image/png', 'image/jpeg', 'image/gif']  */
    allowedType: PropTypes.arrayOf(PropTypes.string),
    /** 原始图片大小限制，单位为KB, 0 或不设置表示不限制  */
    limit: PropTypes.number,
};
CropperUploader.defaultProps = {
    isAbsoluteUrl: false,
    value: undefined,
    onChange() { },
    cropperRatio: 9 / 16,
    isMaskClosable: false,
    width: 96,
    height: 96,
};

export default CropperUploader
