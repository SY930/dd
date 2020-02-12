import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone as phoneImg,
    shareGift as defaultShareBgImg,
    giftExample,
    phoneTop,
    shareGift1
} from './assets';
import ButtonSettingBlock from './ButtonSettingBlock'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class ShareGiftDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                bannerImg = defaultShareBgImg,
                bgColor = '#FF6248',
                buttonBgColor = '#FFC455',
                buttonColor = '#AD0701',
                tagColor1 = '#CF4CE4',
                tagColor2 = '#CF4CE4',
                tagColor3 = '#FB4171',
                tagColor4 = '#CF4CE4',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    {SALE_LABEL.k636p3a1}
                </div>
                <img src={phoneImg} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={bannerImg} alt=""/>
                    <div style={{ margin: '8px 0', textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
        {SALE_LABEL.k5dk4m5r}：2019.03.20-2019.04.20
                    </div>
                    <div className={style.shareCommonBlock}>
                        <div style={{ background: tagColor1 }} className={style.coloredTag}>
                            {SALE_LABEL.k636p3id}
                        </div>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <div className={style.buttonArea} style={{ background: buttonBgColor, color: buttonColor }}>
                            {SALE_LABEL.k636p3qp}
                        </div>
                    </div>
                    <div className={style.shareCommonBlock}>
                        <div style={{ background: tagColor2 }} className={style.coloredTag}>
                            {SALE_LABEL.k636p3z1}
                        </div>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <br/>
                    </div>
                    <div className={style.shareCommonBlock}>
                        <div style={{ background: tagColor3 }} className={style.coloredTag}>
                            {SALE_LABEL.k636qs8m}
                        </div>
                        <img src={shareGift1} alt=""/>
                        <br/>
                    </div>
                    <div className={style.ruleInfo}>
                        <div style={{ background: tagColor4 }} className={style.coloredTag}>
                            {SALE_LABEL.k636qsgy}
                        </div>
                        <div className={style.rule}>
                            <p className={style.ruleSubTitle}>{SALE_LABEL.k636qspa}</p>
                            <p style={{ paddingLeft: 10 }}>2018-11-17~2018-12.17</p>
                            <p className={style.ruleSubTitle}>{SALE_LABEL.k636qsxm}</p>
                            <p style={{ paddingLeft: 10 }}>{SALE_LABEL.k636qt5y}</p>
                            <p style={{ paddingLeft: 10 }}>{SALE_LABEL.k636qtea}</p>
                            <p className={style.ruleSubTitle}>{SALE_LABEL.k636qtmm}</p>
                            <p style={{ paddingLeft: 10 }}>{SALE_LABEL.k636qt5y}</p>
                            <p style={{ paddingLeft: 10 }}>{SALE_LABEL.k636qtea}</p>
                            <p className={style.ruleSubTitle}>{SALE_LABEL.k636qtuy}</p>
                            <p style={{ paddingLeft: 10 }}>1、{SALE_LABEL.k636qu3a}</p>
                            <p style={{ paddingLeft: 10 }}>2、{SALE_LABEL.k636qubm}</p>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FF6248',
                buttonBgColor = '#FFC455',
                buttonColor = '#AD0701',
                tagColor1 = '#CF4CE4',
                tagColor2 = '#CF4CE4',
                tagColor3 = '#FB4171',
                tagColor4 = '#CF4CE4',
                bannerImg,
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>{SALE_LABEL.k636p1no}</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({key: ['bgColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={bannerImg}
                            onChange={value => onChange({key: ['bannerImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}<span style={{ color: '#379FF1' }}>750*666</span></p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 8 }} className={style.label}>{SALE_LABEL.k636p2l0}</div>
                    <div>
                        <ButtonSettingBlock
                            buttonColor={buttonColor}
                            buttonBgColor={buttonBgColor}
                            onChange={v => {
                                for (const key in v) {
                                    onChange({key: [key], value: v[key]})
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 8 }} className={style.label}>{SALE_LABEL.k636qujy}</div>
                    <div style={{ height: 210 }} className={style.tagColorBlock}>
                        <div className={style.leftBlock}>
                            <div className={style.colorRow}>
                                <span>{SALE_LABEL.k5dlpi06}一</span>
                                <div className={style.borderedColorWrapper}>
                                    <WrappedColorPicker
                                        alpha={100}
                                        color={tagColor1}
                                        onChange={({ color }) => onChange({key: ['tagColor1'], value: color})}
                                        placement="topLeft"
                                    />
                                </div>
                            </div>
                            <div className={style.colorRow}>
                                <span>{SALE_LABEL.k5dlpi06}二</span>
                                <div className={style.borderedColorWrapper}>
                                    <WrappedColorPicker
                                        alpha={100}
                                        color={tagColor2}
                                        onChange={({ color }) => onChange({key: ['tagColor2'], value: color})}
                                        placement="topLeft"
                                    />
                                </div>
                            </div>
                            <div className={style.colorRow}>
                                <span>{SALE_LABEL.k5dlpi06}三</span>
                                <div className={style.borderedColorWrapper}>
                                    <WrappedColorPicker
                                        alpha={100}
                                        color={tagColor3}
                                        onChange={({ color }) => onChange({key: ['tagColor3'], value: color})}
                                        placement="topLeft"
                                    />
                                </div>
                            </div>
                            <div className={style.colorRow}>
                                <span>{SALE_LABEL.k5dlpi06}四</span>
                                <div className={style.borderedColorWrapper}>
                                    <WrappedColorPicker
                                        alpha={100}
                                        color={tagColor4}
                                        onChange={({ color }) => onChange({key: ['tagColor4'], value: color})}
                                        placement="topLeft"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.rightBlock}>
                            <h5>{SALE_LABEL.k636f59s}</h5>
                            <div style={{ background: tagColor1 }} className={style.tagPreview}>
                            {SALE_LABEL.k636p3id}
                            </div>
                            <div style={{ background: tagColor2 }} className={style.tagPreview}>
                            {SALE_LABEL.k636p3z1}
                            </div>
                            <div style={{ background: tagColor3 }} className={style.tagPreview}>
                            {SALE_LABEL.k636qs8m}
                            </div>
                            <div style={{ background: tagColor4 }} className={style.tagPreview}>
                            {SALE_LABEL.k636qsgy}
                            </div>
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
