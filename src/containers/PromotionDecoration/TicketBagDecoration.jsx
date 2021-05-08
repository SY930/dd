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

import headPic from './assets/headPic.png'
import coupons1 from './assets/coupons1.png'
import coupons2 from './assets/coupons2.png'
import coupons3 from './assets/coupons3.png'
import coupons4 from './assets/coupons4.png'
import coupons5 from './assets/coupons5.png'
import coupons6 from './assets/coupons6.png'

import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { Radio, Button } from 'antd';
import { injectIntl } from './IntlDecor';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@injectIntl()
export default class TicketBagDecoration extends Component {
    constructor(props) {
        super(props)
    }
    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#fd6631',
                bgImg,
                btnBgColor = '#fd6631',
                btnColor = '#fff',
                decorateType = 1,
            },
        } = this.props;
        console.log('decorateType', decorateType)
        return (
            <div className={style.previewArea}>
                {/* <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div> */}
                <div className={style.typeTitle}>
                    {'券包详情'}
                </div>
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />
                <div style={{ background: '#DCDCDC', paddingTop: 80 }} className={style.scrollArea}>
                    {
                        decorateType === 1 ?
                            <div>
                                <div className={style.blindBanner}>
                                    <img style={{ width: '100%', height: '100%' }} src={bgImg || headPic} alt="" />
                                </div>
                                <div className={style.couponsBox}>
                                    <img src={coupons4} />
                                    <span  style={{ color: bgColor }} className={style.couponsExplainTxt1}>获得礼包后【每日X/每周X/每月XX日】连续【XX次】均可获得以下礼品！</span>
                                    <img src={coupons1} />
                                    <img src={coupons2} />
                                    <img className={style.couponsImgEmp1} src={coupons3} />
                                    <Button
                                        style={{
                                            background: `${btnBgColor}`,
                                            color: `${btnColor}`
                                        }}
                                        className={style.couponsBtn}
                                    >
                                        ￥100<span className={style.smallerBtnFonts}>原价：<s>￥200</s></span> 立即购买
                                    </Button>
                                </div>
                            </div> :
                            <div>
                                <div className={style.blindBanner}>
                                    <div style={{
                                        width: 13,
                                        height: 85,
                                        borderRadius: '0px 5px 5px 0px',
                                        display: 'inline-block',
                                        background: '#EF6D6D',
                                    }}></div>
                                    <img style={{
                                        height: 98,
                                        display: 'inline-block',
                                        position: 'relative',
                                        top: '-33px',
                                        left: 15
                                    }} src={bgImg || headPic} alt="" />
                                    <div style={{
                                        width: 13,
                                        height: 85,
                                        borderRadius: '5px 0px 0px 5px',
                                        display: 'inline-block',
                                        background: '#7EBD40',
                                        position: 'relative',
                                        left: 31,
                                    }}></div>
                                </div>
                                <div className={style.couponsBox} style={{ marginTop: 20 }}>
                                    <img src={coupons5} />
                                    <span  style={{ color: bgColor }} className={style.couponsExplainTxt2}>购买后立即赠送如下礼品，之后每日赠送，连购买后立即赠送如下礼品</span>
                                    <img src={coupons6} />
                                    <img className={style.couponsImgEmp2} src={coupons3} style={{ marginTop: 7 }} />
                                    <div className={style.couponsBtnWhiteBox}>
                                        <div className={style.couponsBtnDesBox}>购买记录</div>
                                        <Button
                                            style={{
                                                background: `${btnBgColor}`,
                                                color: `${btnColor}`
                                            }}
                                            className={style.couponsBtn2}
                                        >
                                            ￥100<span className={style.smallerBtnFonts}>原价：<s>￥200</s></span> 立即购买
                                        </Button>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div >
        )
    }
    handleLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#fd6631',
                bgImg,
                btnBgColor = '#fd6631',
                btnColor = '#fff',
                decorateType = 1
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>适用场景</div>
                    <RadioGroup value={decorateType} onChange={(e) => { onChange({ key: ['decorateType'], value: e.target.value }) }}>
                        <RadioButton value={1}>公众号</RadioButton>
                        <RadioButton value={2}>小程序</RadioButton>
                    </RadioGroup>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({ key: ['bgImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸 750X544像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>购买提示文本</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({ key: ['bgColor'], value })} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnBgColor}
                                onChange={({ color }) => onChange({ key: ['btnBgColor'], value: color })}
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
                                onChange={({ color }) => onChange({ key: ['btnColor'], value: color })}
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
