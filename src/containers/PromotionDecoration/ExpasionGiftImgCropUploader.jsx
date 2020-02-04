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
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
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

        const { intl } = this.props;
        const k636edit = intl.formatMessage(COMMON_STRING.edit);
        const k636delete = intl.formatMessage(COMMON_STRING.delete);

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
                                {SALE_LABEL.k636p0qc}
                            </Button>
                        }
                        onChange={this.handleBaseImgChange}
                    />
                    <div
                        className={style.fakeAchor}
                        onClick={this.handleReset}
                    >
                        {SALE_LABEL.k635s3np}
                    </div>
                </div>
                <div className={style.imgUploaderContainer}>
                    <div className={style.thumbImgWrapper}>
                        {
                            thumbImgUrl ? (
                                <img src={thumbImgUrl} ></img>
                            ) : (
                                <div className={style.tip}>
                                    {SALE_LABEL.k635s4td}
                                </div>
                            )
                        }
                        {
                            thumbImgUrl && (
                                <div className={style.actionModal}>
                                    <Icon
                                        type="edit"
                                        title={k636edit}
                                        className={style.actionIcon}
                                        onClick={() => this.setState({ thumbImgCropperVisible: true })}
                                    />
                                    <Icon
                                        title={k636delete}
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
                                    {SALE_LABEL.k635s51p}
                                </div>
                            )
                        }
                        {
                            imgUrl && (
                                <div className={style.actionModal}>
                                    <Icon
                                        type="edit"
                                        title={k636edit}
                                        className={style.actionIcon}
                                        onClick={() => this.setState({ imgCropperVisible: true })}
                                    />
                                    <Icon
                                        title={k636delete}
                                        type="delete"
                                        className={style.actionIcon}
                                        onClick={() => onImgUrlChange(undefined)}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className={commonStyle.uploaderTip}>
                        <p>* {SALE_LABEL.k636p09o}<span style={{ color: '#379FF1' }}>485*146</span></p>
                        <p>* {SALE_LABEL.k636p0i0}<span style={{ color: '#379FF1' }}>134*146</span></p>
    <p>* {SALE_LABEL.k6346ckg}1000KB，{SALE_LABEL.k6346d14}</p>
                    </div>
                </div>
            </div>
        )
    }
}
