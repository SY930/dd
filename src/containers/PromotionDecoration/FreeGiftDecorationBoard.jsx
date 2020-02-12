import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    freeGift,
    freeGift1,
    freeGift2,
    giftExample,
    phoneTop,
} from './assets';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class FreeGiftDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                activeBg = '#FFE7DC',
                btnBg = '#FCEAAA',
                btnTextColor = '#BD5914',
                tagBg = '#FF7E60',
                tagTextColor = '#FDFDFF',
                listBorderColor = '#FC988A',
                activeImg,
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    {SALE_LABEL.k636p0yo}
                </div>
                <img src={iphone} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: activeBg, paddingTop: 80 }} className={style.scrollArea}>
                    <img style={{ width: '100%', position: 'absolute', top: 0 }} src={activeImg || freeGift} alt=""/>
                    <div style={{ position: 'relative', zIndex: 1, margin: '8px 0', textAlign: 'center', color: '#ED6648' }}>
        {SALE_LABEL.k636p170}：2019.09.10~2019.11.12
                    </div>
                    <img style={{ position: 'relative', zIndex: 1, display: 'block', margin: '10px auto', width: 254 }} src={freeGift1} alt=""/>
                    <img style={{ position: 'absolute', zIndex: 1, display: 'block', top: 196, left: 49, width: 185 }} src={giftExample} alt=""/>
                    <div style={{ borderRadius: 20, background: btnBg, color: btnTextColor}} className={style.freeButton}>
                        {SALE_LABEL.k636p0yo}
                    </div>
                    <div style={{ position: 'relative', borderColor: listBorderColor }} className={style.friendZone}>
                        <div
                            style={{
                                transform: 'scale(0.25)',
                                transformOrigin: 'top left',
                                position: 'absolute',
                                top: -5,
                                left: 54,
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="594" height="95" viewBox="0 0 594 95">
                                <path fill={tagBg} d="M3203,1613v43a30,30,0,0,1-30,30H2659a30,30,0,0,1-30-30v-43h-10l10-22h574l10,22h-10Z" transform="translate(-2619 -1591)"/>
                            </svg>
                        </div>
                        <div
                            style={{
                                color: tagTextColor,
                                position: 'absolute',
                                top: -1,
                                left: 97,
                            }}
                        >
                            {SALE_LABEL.k636p1fc}
                        </div>
                        <img
                            src={freeGift2}
                            alt=""
                            style={{
                                display: 'block',
                                width: 210,
                                margin: '35px auto 0',
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                activeBg = '#FFE7DC',
                btnBg = '#FCEAAA',
                btnTextColor = '#BD5914',
                tagBg = '#FF7E60',
                tagTextColor = '#FDFDFF',
                listBorderColor = '#FC988A',
                activeImg,
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
        <div className={style.label}>{SALE_LABEL.k636p1no}</div>
                    <ColorSettingBlock value={activeBg} onChange={(value) => onChange({key: ['activeBg'], value})} />
                </div>
                <div className={style.sectionWrapper}>
        <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={activeImg}
                            onChange={value => onChange({key: ['activeImg'], value})}
                        />
                        <div className={style.uploaderTip}>
        <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}750x666</p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
        <div style={{ top: 5 }} className={style.label}>{SALE_LABEL.k636p2l0}</div>
                    <div className={style.inlineRow}>
        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnBg}
                                onChange={({ color }) => onChange({key: ['btnBg'], value: color})}
                                placement="topLeft"
                            />
                        </div>
        <span>{SALE_LABEL.k6346bvg}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnTextColor}
                                onChange={({ color }) => onChange({key: ['btnTextColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
        <div style={{ top: 5 }} className={style.label}>{SALE_LABEL.k636p2co}</div>
                    <div className={style.inlineRow}>
        <span>{SALE_LABEL.k636p1w0}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={tagBg}
                                onChange={({ color }) => {
                                    onChange({key: ['tagBg'], value: color});
                                    onChange({key: ['listBorderColor'], value: color})
                                }}
                                placement="topLeft"
                            />
                        </div>
                            <span>{SALE_LABEL.k636p24c}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={listBorderColor}
                                onChange={({ color }) => onChange({key: ['listBorderColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                            <span>{SALE_LABEL.k6346bvg}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={tagTextColor}
                                onChange={({ color }) => onChange({key: ['tagTextColor'], value: color})}
                                placement="topLeft"
                            />
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
