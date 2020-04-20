import React, { PureComponent as Component } from 'react';
import ImageUpload from 'components/common/ImageUpload';
import styles from './addGifts.less';
import QrModal from './QrModal';

const limitType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const fileSize = 3 * 1024 * 1024;
export default class PhotoFrame extends Component {
    state = {
        visible: false,
    }

    /** 表单内图片上传 */
    onUpload = (restaurantShareImagePath) => {
        this.props.onChange({ key: 'restaurantShareImagePath', value: restaurantShareImagePath });
    }
    /** 表单内图片上传 */
    onUpload2 = (shareImagePath) => {
        this.props.onChange({ key: 'shareImagePath', value: shareImagePath });
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    render() {
        const { restaurantShareImagePath, shareImagePath, type } = this.props;
        const { visible } = this.state;

        return (
            <div className={styles.photoFrame}>
                <p>图片建议按如图所示用户端上传，支持格式jpg、png，大小不超过2M</p>
                <a href="javascript:;" onClick={this.toggleModal}>查看示例</a>
                <ul>
                    <li>
                        <ImageUpload
                            value={restaurantShareImagePath}
                            limitType={limitType}
                            limitSize={fileSize}
                            onChange={this.onUpload}
                        />
                        <div>
                            <h5>线上餐厅展示图</h5>
                            <p>图片建议尺寸：500*500像素</p>
                        </div>
                    </li>
                    <li>
                        <ImageUpload
                            value={shareImagePath}
                            limitType={limitType}
                            limitSize={fileSize}
                            onChange={this.onUpload2}
                        />
                        <div>
                            <h5>小程序展示图</h5>
                            <p>图片建议尺寸：900*500像素</p>
                        </div>
                    </li>
                </ul>
                {visible && <QrModal type={type} onClose={this.toggleModal} />}
            </div>
        );
    }
}

