import React, { PureComponent as Component } from 'react';
import { Row, Col} from 'antd'
import css from './upload.less';
import CropperUploader from 'components/common/CropperUploader';
const imgURI = 'http://res.hualala.com/';
const imgType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const imgSize = 3 * 1024 * 1024;

class ImageUpload extends Component {
    handleGiftImgChange = (val) => {
        if(val){
            this.props.onChange(val);
        }
    }
    render() {
        const child = (
            <div>
                <p className="ant-upload-hint">尺寸建议750*318</p>
                <p className="ant-upload-hint">不大于1000KB</p>
                <p className="ant-upload-hint">支持PNG、JPG格式</p>
            </div>
        );
        const {
            defValue = '',
            value,
            width = 200, 
            height = 98, 
            children = child,
            limit = 1024,
            cropperRatio = 715 / 318,
        } = this.props;
        const imgUrl = value || defValue;
        // const text = value ? '更换' : '上传';
        return (
            <div>
                <div className={`${css.wrap} imgageUpload`} style={{ width: width}}>
                    <Row>
                        <Col span={6} >
                            <CropperUploader 
                                width={width}
                                height={height}
                                cropperRatio={cropperRatio}
                                limit={limit}
                                allowedType={['image/png', 'image/jpeg']}
                                value={imgUrl}
                                uploadTest='上传图片'
                                onChange={value=>this.handleGiftImgChange(value)}
                            />
                        </Col>
                    </Row>
                </div>
                {children}
            </div>
        )
    }
}

export default ImageUpload