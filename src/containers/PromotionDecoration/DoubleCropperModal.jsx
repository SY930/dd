import React, {Component} from 'react';
import {
    Modal,
    message,
    Icon,
} from 'antd';
import axios from 'axios';
import Cropper from 'react-cropper';
import style from './doubleCropperModal.less'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

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
@injectIntl()
class DoubleCropperModal extends Component {

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
        let finalUri1;
        let finalUri2;
        try {
            finalUri1 = this.firstCropper.getCroppedCanvas(option).toDataURL();
            finalUri2 = this.secondCropper.getCroppedCanvas(option).toDataURL();
        } catch (e) {
            console.log('e', e)
            return message.warning(SALE_LABEL.k5dmw1z4)
        }
        this.setState({
            confirmLoading: true,
        })
        setTimeout(() => {
            const formData1 = new FormData();
            const blob1 = dataURLtoBlob(finalUri1);
            formData1.append('myFile', (new File([blob1], `myFile.${MIME_EXT_MAP[blob1.type] || 'png'}`, {type: blob1.type})));
            const formData2 = new FormData();
            const blob2 = dataURLtoBlob(finalUri2);
            formData2.append('myFile', (new File([blob2], `myFile.${MIME_EXT_MAP[blob2.type] || 'png'}`, {type: blob2.type})));
            Promise.all([
                axios({
                    url: '/api/common/imageUpload',
                    method: 'POST',
                    data: formData1,
                }),
                axios({
                    url: '/api/common/imageUpload',
                    method: 'POST',
                    data: formData2,
                }),
            ]).then(([res1, res2]) => {
                if ((res1 && res1.url) && (res2 && res2.url)) {
                    this.setState({
                        confirmLoading: false,
                    })
                    this.props.onChange([
                        `http://res.hualala.com/${res1.url}`,
                        `http://res.hualala.com/${res2.url}`,
                    ]);
                    onCancel && onCancel();
                } else {
                    message.warning(SALE_LABEL.k5doax7i);
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
            firstCropperRatio,
            secondCropperRatio,
        } = this.props;
        const { confirmLoading } = this.state;
        return (
            visible ? (
                <Modal
                    title={SALE_LABEL.k635s4l1}
                    visible={true}
                    width="700px"
                    onOk={this.handleOk}
                    onCancel={onCancel}
                    maskClosable={false}
                    confirmLoading={confirmLoading}
                >
                    {!!baseImgUrl && (
                        <div className={style.doubleCropperContainer}>
                            <div className={style.column}>
                                <div className={style.columnTitle}>
                                    {SALE_LABEL.k635s4td}
                                </div>
                                <Cropper
                                    ref={cropper => this.firstCropper = cropper}
                                    src={baseImgUrl}
                                    style={{height: 450, width: '100%'}}
                                    aspectRatio={firstCropperRatio || 9 / 16}
                                    guides={true}
                                />
                            </div>
                            <div className={style.column}>
                                <div className={style.columnTitle}>
                                    {SALE_LABEL.k635s51p}
                                </div>
                                <Cropper
                                    ref={cropper => this.secondCropper = cropper}
                                    src={baseImgUrl}
                                    style={{height: 450, width: '100%'}}
                                    aspectRatio={secondCropperRatio || 9 / 16}
                                    guides={true}
                                />
                            </div>
                        </div>
                    )}
                </Modal>
            ) : null
        )
    }
}

export default DoubleCropperModal
