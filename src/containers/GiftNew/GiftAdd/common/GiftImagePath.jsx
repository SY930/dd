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
const FormItem = Form.Item;

class GiftImagePath extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
        }
    }

    render() {
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            accept: 'image/png,image/jpeg',
            className: styles.avatarUploader,
            onChange: (info) => {
                const status = info.file.status;
                if (status === 'done') {
                    if (info.file.response.url) {
                        message.success(`${info.file.name} 上传成功`);
                        this.props.onChange(`${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`)
                    } else {
                        message.error(`${info.file.name} 上传失败`);
                    }
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem style={{ height: 240 }}>
                        <Upload {...props}>
                            {
                                this.props.value ?
                                    <img src={this.props.value} alt="" className={styles.avatar} /> :
                                    <Icon type="plus" className={styles.avatarUploaderTrigger} />
                            }
                        </Upload>
                        <p className="ant-upload-hint">点击上传图片，图片格式为jpg、png</p>
                        <p className="ant-upload-hint">不上传则显示默认图片</p>
                    </FormItem>
                </Col>
            </Row>
        )
    }
}

export default GiftImagePath;