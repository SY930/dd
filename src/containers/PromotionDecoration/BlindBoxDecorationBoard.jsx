import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    phoneTop,

    blindBoxBanner,
    blindBoxImg,
    blindBoxCoupon,
    blindBoxDes,
} from './assets';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class BlindBoxDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#FF3838',
                bgImg,
                btnBgColor = '#FF3C54',
                btnColor = '#fff',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    {'盲盒活动'}
                </div>
                <img src={iphone} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor, paddingTop: 80 }} className={style.scrollArea}>
                    <div className={style.blindBanner}>
                        <img style={{ width: '100%', height: '100%' }} src={bgImg || blindBoxBanner} alt=""/>
                        <p>活动时间：2019.12.01-2020.02.14</p>
                    </div>
                    <div className={style.blindCon} style={{backgroundColor: bgColor}}>
                        <div className={style.blindMainCon}>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>待领取活动礼包</span> 
                                </div>
                                <img style={{ width: '100%', height: '100%' }} src={blindBoxImg} alt=""/>
                            </div>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>你还可以得到以下奖品呦～</span> 
                                </div>
                                <div className={style.couponCon}>
                                    <img style={{ width: '100%', height: '100%' }} src={blindBoxCoupon} alt=""/>
                                </div>
                            </div>
                            <div className={style.blindBoxBtn} style={{background: btnBgColor, color: btnColor}}>拆盲盒</div>
                        </div>
                        <div className={style.blindMainCon}>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>活动说明</span> 
                                </div>
                                <div className={style.couponCon}>
                                    <img style={{ width: '100%', height: '100%' }} src={blindBoxDes} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
    handleLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FF3838',
                bgImg,
                btnBgColor = '#FF3C54',
                btnColor = '#fff',
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({key: ['bgImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸 750X544像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>{SALE_LABEL.k636p1no}</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({key: ['bgColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnBgColor}
                                onChange={({ color }) => onChange({key: ['btnBgColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }} className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bvg}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnColor}
                                onChange={({ color }) => onChange({key: ['btnColor'], value: color})}
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
