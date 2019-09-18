import React, {Component} from 'react';
import {
    Upload,
    Modal,
    message,
    Icon,
} from 'antd';
import axios from 'axios';
import Cropper from 'react-cropper';
import style from './cropper.less';

function dataURLtoBlob(dataurl, mimeType) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mimeType || mime});
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
            formData.append('file', (new File([blob], `croppedImage.${MIME_EXT_MAP[blob.type] || 'png'}`, {type: blob.type})));
            axios({
                url: '/api/shopcenter/upload',
                method: 'POST',
                data: formData,
            }).then((res) => {
                if (res.data && res.data.url) {
                    this.setState({
                        confirmLoading: false,
                    })
                    this.cancel()
                    this.props.onChange(res.data.url)
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

    render() {
        const {
            allowedType,
            cropperRatio,
            uploadTrigger,
            isMaskClosable = true
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
        return (
            <div>
                <Upload
                    {...uploadProps}
                >
                    {
                        uploadTrigger ? uploadTrigger()
                            : (
                            <div className={style.cropperUploaderTrigger} >
                                <Icon style={{ color: '#999', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} type="plus" />
                                <br/>
                                <span>
                                    上传
                                </span>
                            </div>
                        )
                    }
                </Upload>
                {
                    cropperVisible && (
                        <Modal
                            title="图片编辑"
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
                                    style={{height: 450, width: '100%'}}
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

export default CropperUploader
