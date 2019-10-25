import React, { Component } from 'react';
import {
    Button,
    Icon,
} from 'antd'
import style from './expansionGiftImgCropUploader.less';
import commonStyle from './style.less';
import { CropperModal } from 'components/common/CropperUploader'
import DecorationUploader from './DecorationUploader';
import DoubleCropperModal from './DoubleCropperModal';

export default class ExpasionGiftImgCropUploader extends Component {

    state = {
        baseCropperVisible: false,
        thumbImgCropperVisible: false,
        imgCropperVisible: false,
    }

    handleBaseImgChange = (url) => {
        this.props.onBaseImgUrlChange(url);
        this.setState({
            baseCropperVisible: true,
        })
    }
    handleReset = () => {
        const {
            onBaseImgUrlChange,
            onThumbImgUrlChange,
            onImgUrlChange,
        } = this.props;
        onBaseImgUrlChange(undefined); // 我知道undefined不用传
        onThumbImgUrlChange(undefined);
        onImgUrlChange(undefined);
    }
    handleBothImgChange = ([thumbImgUrl, imgUrl]) => {
        this.props.onThumbImgUrlChange(thumbImgUrl);
        this.props.onImgUrlChange(imgUrl);
    }
    render() {
        const {
            baseImgUrl,
            thumbImgUrl,
            imgUrl,
            onThumbImgUrlChange,
            onImgUrlChange,
            title,
        } = this.props;
        const {
            baseCropperVisible,
            thumbImgCropperVisible,
            imgCropperVisible,
        } = this.state;
        return (
            <div className={style.componentWrapper}>
                <DoubleCropperModal
                    visible={baseCropperVisible}
                    baseImgUrl={baseImgUrl}
                    firstCropperRatio={134/146}
                    secondCropperRatio={485/146}
                    onCancel={() => this.setState({ baseCropperVisible: false })}
                    onChange={this.handleBothImgChange}
                />
                <CropperModal
                    visible={thumbImgCropperVisible}
                    cropperRatio={134/146}
                    onChange={onThumbImgUrlChange}
                    baseImgUrl={baseImgUrl || thumbImgUrl}
                    onCancel={() => this.setState({ thumbImgCropperVisible: false })}
                />
                <CropperModal
                    visible={imgCropperVisible}
                    cropperRatio={485/146}
                    onChange={onImgUrlChange}
                    baseImgUrl={baseImgUrl || imgUrl}
                    onCancel={() => this.setState({ imgCropperVisible: false })}
                />
                <div className={style.buttonArea}>
                    <div>
                        {title}
                    </div>
                    <DecorationUploader
                        limit={1000}
                        trigger={
                            <Button type="ghost">
                                上传图片
                            </Button>
                        }
                        onChange={this.handleBaseImgChange}
                    />
                    <div
                        className={style.fakeAchor}
                        onClick={this.handleReset}
                    >
                        一键重置
                    </div>
                </div>
                <div className={style.imgUploaderContainer}>
                    <div className={style.thumbImgWrapper}>
                        {
                            thumbImgUrl ? (
                                <img src={thumbImgUrl} ></img>
                            ) : (
                                <div className={style.tip}>
                                    奖品缩略图
                                </div>
                            )
                        }
                        {
                            thumbImgUrl && (
                                <div className={style.actionModal}>
                                    <Icon
                                        type="edit"
                                        title="编辑"
                                        className={style.actionIcon}
                                        onClick={() => this.setState({ thumbImgCropperVisible: true })}
                                    />
                                    <Icon
                                        title="删除"
                                        type="delete"
                                        className={style.actionIcon}
                                        onClick={() => onThumbImgUrlChange(undefined)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className={style.imgWrapper}>
                        {
                            imgUrl ? (
                                <img src={imgUrl} ></img>
                            ) : (
                                <div className={style.tip}>
                                    奖品展示图
                                </div>
                            )
                        }
                        {
                            imgUrl && (
                                <div className={style.actionModal}>
                                    <Icon
                                        type="edit"
                                        title="编辑"
                                        className={style.actionIcon}
                                        onClick={() => this.setState({ imgCropperVisible: true })}
                                    />
                                    <Icon
                                        title="删除"
                                        type="delete"
                                        className={style.actionIcon}
                                        onClick={() => onImgUrlChange(undefined)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className={commonStyle.uploaderTip}>
                        <p>* 展示图建议尺寸<span style={{ color: '#379FF1' }}>485*146</span>像素</p>
                        <p>* 缩略图建议尺寸<span style={{ color: '#379FF1' }}>134*146</span>像素</p>
                        <p>* 图片大小不要超过1000KB，支持JPG、PNG图片文件</p>
                    </div>
                </div>
            </div>
        )
    }
}
