import React, { Component } from 'react';
import {
    Icon,
} from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import CropperUploader from 'components/common/CropperUploader'
import { iphone } from './assets';
import { onlineRes } from './assets'
import { giftExample } from './assets'
import tagImg from './assets/tag.svg'
import { btnBg } from './assets'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class SimpleDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                img = onlineRes,
                color = '#fd6631',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={iphone} alt=""/>
                <div className={style.simpleDisplayBlock}>
                    <div className={style.imgWrapper}>
                        <div className={style.tagWrapper}>
                            <img src={tagImg} alt=""/>
        <span>{SALE_LABEL.k6346c3s}</span>
                        </div>
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <img src={img} style={{ width: '100%' }} alt=""/>
                        </div>
                    </div>
                    <div style={{ background: color }} className={style.bgWrapper}>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <div className={style.btnWrapper}>
                            <img src={btnBg} alt="" />
                            <div>{SALE_LABEL.k5m3oov8}</div>
                        </div>
                    </div>
                    <Icon className={style.closeBtn}  type="close-circle-o" />
                </div>
            </div>
        )
    }
    renderSettingPanel() {
        const {
            decorationInfo: {
                img,
                color = '#FF6125',
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
        <div className={style.label}>{SALE_LABEL.k6346cc4}</div>
                    <ColorSettingBlock value={color} onChange={(value) => onChange({key: ['color'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 500 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            isAbsoluteUrl={true}
                            cropperRatio={920 / 360}
                            width={245}
                            limit={1000}
                            value={img}
                            onChange={value => onChange({key: ['img'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}920x360</p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    render() {
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                {this.renderSettingPanel()}
            </div>
        )
    }
}
