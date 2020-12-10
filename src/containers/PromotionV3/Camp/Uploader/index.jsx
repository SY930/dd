import React, { PureComponent as Component } from 'react';
import { Radio, Form, Row, Col } from 'antd';
import ImageUpload from 'components/common/ImageUpload';
import css from './style.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class Uploader extends Component {
    state= {
        
    }

    onAllChange = (data) => {
        const { value, onChange } = this.props;
        let list = {...value, ...data};
        onChange(list);
    }

    render() {
        const { value, decorator } = this.props;
        
        return (
            <div className={css.mainBox}>
                <div>
                    <p className={css.titleTip}>盲盒礼品</p>
                </div>
                <div className={css.uploadBox}>
                    <FormItem
                        label="盲盒图片"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Row>
                            <Col span={6} >
                                {decorator({
                                    key: 'eventImagePath',
                                    rules: [
                                        { required: false, message: '必须有图片' },
                                    ],
                                })(
                                    <ImageUpload
                                        className={css.uploadCom}
                                        limitType={'.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF'}
                                        limitSize={3 * 1024 * 1024}
                                        getFileName={true}
                                    />
                                )}
                            </Col>
                            <Col span={18} className={css.grayFontPic} >
                                <p style={{ position: 'relative', top: 20, left: 70,}}>图片建议尺寸750*500像素<br/>支持格式jpg、png、gif，大小不超过2M</p>
                            </Col>
                        </Row>
                    </FormItem>    
                </div>
            </div>
        )
    }
}

export default Uploader
