import React, {Component} from 'react';
import {
    Form,
    Row,
    Col,
    Upload,
    message,
    Icon,
} from 'antd';
import ENV from '../../../../helpers/env';
import styles from '../GiftAdd.less';
import ImageUpload from 'components/common/ImageUpload';

const FormItem = Form.Item;

class GiftImagePath extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
        }
    }

    render() {
        const modifierClassName = this.props.modifierClassName;
        const props = {
            name: 'myFile',
            disabled: this.props.disabled,
            showUploadList: false,
            action: '/api/common/ImageUpload',
            accept: 'image/png,image/jpeg',
            className: [styles.avatarUploader, styles[modifierClassName]].join(' '),
            beforeUpload: (file) => {
                let isRightSize = true;
                const limit = this.props.limit;
                if (limit) {
                    isRightSize = file.size / 1024 <= limit;
                    if (!isRightSize) {
                        message.error(`图片不要大于${Math.floor(limit / 1024)}MB`);
                    }
                }
                return isRightSize;
            },
            onChange: (info) => {
                if (info) {
                    this.props.onChange(`${ENV.FILE_RESOURCE_DOMAIN}/${info}`)
                    // this.props.onChange(`/${info}`)
                } else {
                    this.props.onChange('')
                }
            },
        };
        // debugger
        return (
            <Row>
                <Col>
                    <FormItem style={{ height: this.props.wrapperHeight - 60 }}>
                        <div style={{float: 'left', marginRight: '10px'}}>
                            {/* debugger */}
                            <ImageUpload
                                {...props}
                                value={this.props.value ? this.props.value.split('http://res.hualala.com')[1] : ''}
                                // value={shrPath}
                                // limitType={limitType}
                                // limitSize={fileSize}
                                // onChange={this.onUpload2}
                            />
                            {/* <Upload {...props}>
                                {
                                    this.props.value ?
                                        <img
                                            src={this.props.value}
                                            alt=""
                                            className={[styles.avatar, styles[modifierClassName]].join(' ')}
                                        /> :
                                        <Icon
                                            type="plus"
                                            className={[styles.avatarUploaderTrigger, styles[modifierClassName]].join(' ')}
                                        />
                                }
                            </Upload> */}
                        </div>
                        <div>
                            {
                                !this.props.hasSize && 
                                    <p className="ant-upload-hint">尺寸建议200*200</p>
                            }
                            <p className="ant-upload-hint">点击上传图片，图片格式为jpg、png</p>
                            <p className="ant-upload-hint">{this.props.hint}</p>
                        </div>
                    </FormItem>
                </Col>
            </Row>
        )
    }
}
GiftImagePath.defaultProps = {
    hint: '不上传则显示默认图片',
    wrapperHeight: 240,
    modifierClassName: ''
};

export default GiftImagePath;