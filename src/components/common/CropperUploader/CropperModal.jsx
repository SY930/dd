import React, {Component} from 'react';
import {
    Modal,
    message,
    Icon,
} from 'antd';
import axios from 'axios';
import Cropper from 'react-cropper';

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

class CropperModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
        }
    }

    handleOk = () => {
        const {
            croppedCanvasOption: option,
            onCancel,
        } = this.props;
        let finalUri;
        try {
            finalUri = this.cropper.getCroppedCanvas(option).toDataURL();
        } catch (e) {
            console.log('e', e)
            return message.warning('剪切出现了点问题, 请重试')
        }
        this.setState({
            confirmLoading: true,
        })
        setTimeout(() => {
            const formData = new FormData();
            const blob = dataURLtoBlob(finalUri);
            formData.append('myFile', (new File([blob], `myFile.${MIME_EXT_MAP[blob.type] || 'png'}`, {type: blob.type})));
            axios({
                url: '/api/common/imageUpload',
                method: 'POST',
                data: formData,
            }).then((res) => {
                if (res && res.url) {
                    this.setState({
                        confirmLoading: false,
                    })
                    this.props.onChange(`http://res.hualala.com/${res.url}`)
                    onCancel && onCancel();
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

    render() {
        const {
            onCancel,
            visible,
            baseImgUrl,
            cropperRatio,
        } = this.props;
        const { confirmLoading } = this.state;
        return (
            visible ? (
                <Modal
                    title="图片裁切"
                    visible={true}
                    width="700px"
                    onOk={this.handleOk}
                    onCancel={onCancel}
                    maskClosable={false}
                    confirmLoading={confirmLoading}
                >
                    {!!baseImgUrl && (
                        <Cropper
                            ref={cropper => this.cropper = cropper}
                            src={baseImgUrl}
                            style={{height: 450, width: '100%'}}
                            aspectRatio={cropperRatio || 9 / 16}
                            guides={true}
                        />
                    )}
                </Modal>
            ) : null
        )
    }
}

export default CropperModal
