import React, { PureComponent as Component } from 'react';
import { Popover } from 'antd';
import ImageUpload from 'components/common/ImageUpload';
import styles from './addGifts.less';
// import QrModal from './QrModal';
import CropperUploader from 'components/common/CropperUploader'

const limitType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const fileSize = 3 * 1024 * 1024;
const DOMAIN = 'http://res.hualala.com/';
export default class PhotoFrame extends Component {
    state = {
        visible: false,
    }

    /** 表单内图片上传 */
    onUpload = (restaurantShareImagePath) => {
        const value = DOMAIN + restaurantShareImagePath;
        this.props.onChange({ key: 'restaurantShareImagePath', value });
    }
    /** 表单内图片上传 */
    onUpload2 = (shareImagePath) => {
        const value = DOMAIN + shareImagePath;
        this.props.onChange({ key: 'shareImagePath', value });
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    render() {
        /**
         * isMoveRestaurant || false  是否移除线上餐厅上传
         */
        const { restaurantShareImagePath = '', shareImagePath = '', type, isHideDining, isHideMiniPro } = this.props;
        const restPath = restaurantShareImagePath.substr(23);
        const shrPath = shareImagePath.substr(23);
        const { visible } = this.state;
        const srcMap = {
            21: 'http://res.hualala.com/basicdoc/39d60e84-ea60-413c-a986-e680a76c0000.png',
            68: 'http://res.hualala.com/basicdoc/6417e092-1fcd-46eb-becb-8dc8ba55efef.png',
            // 66: 'http://res.hualala.com/basicdoc/8ff25052-78a4-4be3-a043-347302ca9238.png',
            66: 'http://res.hualala.com/basicdoc/5c8317bc-3205-46af-b3a9-869bd0d9a553.png',
            65: 'http://res.hualala.com/basicdoc/87bfc2c7-c7b4-45b0-b78e-f2b29615d1db.png',
            79: 'http://res.hualala.com/basicdoc/2c9ef968-fc0a-4fed-bc39-61577857b7b2.png',
            82: 'http://res.hualala.com/basicdoc/fe6da1e3-d3da-4ce9-b420-3f135242a97b.png',
        }
        const content = (
            <img width="400px" src={srcMap[type]} />
        )
        return (
            <div className={styles.photoFrame}>
                <p>图片建议按如图所示用户端上传，支持格式jpg、png，大小不超过2M <Popover content={content} placement="right">
                    <a href="javascript:;">查看示例</a>
                </Popover></p>

                <ul>
                    {
                        isHideDining ? // true不显示线上餐厅
                            null :
                            <li>
                                <CropperUploader
                                    className={styles.uploadCom}
                                    width={120}
                                    height={110}
                                    cropperRatio={200 / 200}
                                    limit={fileSize}
                                    allowedType={['image/png', 'image/jpeg']}
                                    value={restPath}
                                    uploadTest='上传图片'
                                    onChange={this.onUpload}
                                />
                                {/* <ImageUpload
                                    value={restPath}
                                    limitType={limitType}
                                    limitSize={fileSize}
                                    onChange={this.onUpload}
                                /> */}
                                <div>
                                    <h5>线上餐厅展示图</h5>
                                    <p>
                                        {type=='82'?`图片建议尺寸：1040*832像素`:`图片建议尺寸：500*500像素`}
                                    </p>
                                </div>
                            </li>
                    }
                    {
                        isHideMiniPro ? // true不显示小程序
                            null : <li>
                                 <CropperUploader
                                    className={styles.uploadCom}
                                    width={120}
                                    height={110}
                                    cropperRatio={200 / 200}
                                    limit={2048}
                                    allowedType={['image/png', 'image/jpeg']}
                                    value={shrPath}
                                    uploadTest='上传图片'
                                    onChange={this.onUpload2}
                                />
                                {/* <ImageUpload
                                    value={shrPath}
                                    limitType={limitType}
                                    limitSize={fileSize}
                                    onChange={this.onUpload2}
                                /> */}
                                <div>
                                    <h5>小程序展示图</h5>
                                    <p>
                                        {type=='82'?`图片建议尺寸：1040*832像素`:`图片建议尺寸：500*500像素`}
                                    </p>
                                </div>
                            </li>
                    }

                </ul>
                {/* {visible && <QrModal type={type} onClose={this.toggleModal} />} */}
            </div>
        );
    }
}

