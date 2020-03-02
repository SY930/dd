import React, { PureComponent as Component } from 'react';
import { Upload, Icon, message } from 'antd'
import css from './upload.less';

const imgURI = 'http://res.hualala.com/';
const imgType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const imgSize = 3 * 1024 * 1024;

class ImageUpload extends Component {
    state = {
        percent: 100,
    }
    onUpload = (file) => {
        if (!file) return true // in case of browser compatibility
        const {
            limitType = imgType,
            limitSize = imgSize,
        } = this.props
        const types = limitType ? limitType.split(',') : []
        const sizes = Array.isArray(limitSize) ? limitSize : [limitSize]
        const matchedType = types.find((type) => {
            const regexp = new RegExp(`^.*${type.replace('.', '\\\.')}$`)
            return file.name.match(regexp)
        })
        const matchIndex = types.indexOf(matchedType)
        const matchedSize = sizes[matchIndex] || sizes[0]
        if (types.length && !matchedType) {
            message.error('上传文件格式错误')
            return false
        }
        if (matchedSize !== undefined && matchedSize !== 0 && file.size > matchedSize) {
            message.error('上传文件大小超过限制')
            return false
        }
        return true
    }

    onChange = ({ file }) => {
        const { status, response } = file;
        if (status === 'uploading') {
            const { percent } = file;
            this.setState({ percent });
        }
        if (status === 'error') {
            message.error('图片上传失败，请稍后重试');
            this.setState({ percent: 100 });
            return;
        }
        if (status === 'done') {
            const { url } = response;
            this.props.onChange(url);
        }
    }

    onReset = () => {
        const { defValue, onChange } = this.props;
        onChange(defValue);
    }

    render() {
        const { percent } = this.state;
        const { defValue = '', value } = this.props;
        const imgUrl = value || defValue;
        const isNotDef = defValue && value && (value !== defValue);
        const loading = (percent !== 100);
        const point = loading ? { pointerEvents: 'none' } : {};
        const text = value ? '更换' : '上传';
        return (
            <div className={`${css.wrap} imgageUpload`} style={point}>
                <Upload
                    name="myFile"
                    action="/api/common/imageUpload"
                    className={css.uploadBox}
                    showUploadList={false}
                    beforeUpload={this.onUpload}
                    onChange={this.onChange}
                >
                    {imgUrl ?
                        <img src={imgURI + imgUrl} alt="" className={css.img} /> :
                        <Icon type="plus" className={css.trigger} />
                    }
                    <p className={css.tip}>{text}图片</p>
                    {loading &&
                        <div className="ant-upload-list-item-progress">
                            <div className="ant-progress ant-progress-line ant-progress-status-normal">
                                <div className="ant-progress-outer">
                                    <div className="ant-progress-inner">
                                        <div className="ant-progress-bg" style={{ width: `${percent}%`, height: 2 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Upload>
                {isNotDef &&
                    <a href="javascript:;" className={css.reset} onClick={this.onReset}>重置</a>
                }
            </div>
        )
    }
}

export default ImageUpload
