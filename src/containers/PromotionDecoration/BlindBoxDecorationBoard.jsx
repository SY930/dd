import React, { Component } from 'react';
import { Tabs } from 'antd';
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
import { injectIntl } from './IntlDecor';
const TabPane = Tabs.TabPane;
const modalImg1 = 'http://res.hualala.com/basicdoc/cacbd1d3-6694-47e8-b17c-b71c3131b542.png';
const modalImg2 = 'http://res.hualala.com/basicdoc/20ddcef7-41e4-4ea5-a3d1-2025afade60c.png'
@injectIntl()
export default class BlindBoxDecorationBoard extends Component {
    state = {
        activeTab: '1'
    }
    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#FF3838',
                windowBgColor = '#FFCA45',
                bgImg,
                btnBgColor = '#FF3C54',
                successBtnColor = '#FF3C54',
                successBtnTextColor = '#fff',
                btnColor = '#fff',
                alertBackgroundImage,
                successTip = '实物礼品券-ldd×1份',
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
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />
                <div style={{ background: bgColor, paddingTop: 80 }} className={style.scrollArea}>
                    <div className={style.blindBanner}>
                        <img style={{ width: '100%', height: '100%' }} src={bgImg || blindBoxBanner} alt="" />
                        <p>活动时间：2019.12.01-2020.02.14</p>
                    </div>
                    <div className={style.blindCon} style={{ backgroundColor: bgColor }}>
                        <div className={style.blindMainCon} style={{ background: windowBgColor }}>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>待领取活动礼包</span>
                                </div>
                                <img style={{ width: '100%', height: '100%' }} src={blindBoxImg} alt="" />
                            </div>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>你还可以得到以下奖品呦～</span>
                                </div>
                                <div className={style.couponCon}>
                                    <img style={{ width: '100%', height: '100%' }} src={blindBoxCoupon} alt="" />
                                </div>
                            </div>
                            <div className={style.blindBoxBtn} style={{ background: btnBgColor, color: btnColor }}>拆盲盒</div>
                        </div>
                        <div className={style.blindMainCon} style={{ background: windowBgColor }}>
                            <div className={style.blindImg}>
                                <div className={style.blindTit}>
                                    <span>活动说明</span>
                                </div>
                                <div className={style.couponCon}>
                                    <img style={{ width: '100%', height: '100%' }} src={blindBoxDes} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {this.state.activeTab === '2' ?
                    <div className={style.blindGiftSuccessModal}>
                        <div className={style.successAlertWrapper}>
                            <img className={style.freeGiftSuccessModalImg1} src={alertBackgroundImage || modalImg1} />
                            <div className={style.blindGiftSuccessModalCon}>
                                <div className={style.blindGiftSuccessTip} style={{ fontSize: 20 }}>Surprise!</div>
                                <div className={style.blindGiftSuccessTip} style={{ fontSize: 14 }}>恭喜你获得以下礼品</div>
                                <div className={style.blindGiftSuccessTip}>{successTip}</div>
                                <p className={style.blindSuccessBtnColor} style={{ backgroundColor: successBtnColor, color: successBtnTextColor }}>邀好友拆盲盒享惊喜吧！</p>
                            </div>
                        </div>
                    </div>
                    : null
                }
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
                windowBgColor = '#FFCA45',
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
                    <div className={style.label}>{SALE_LABEL.k636p1no}</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({ key: ['bgColor'], value })} />
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>窗口背景色</div>
                    <ColorSettingBlock value={windowBgColor} onChange={(value) => onChange({ key: ['windowBgColor'], value })} />
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
    renderSuccessPage = () => {
        const {
            decorationInfo: {
                alertBackgroundImage,
                successBtnColor = '#FF3C54',
                successBtnTextColor = '#fff',
            },
            onChange
        } = this.props;
        return (
            <div>
                <div >
                    <div className={style.sectionWrapper}>
                        <div style={{ top: 30 }} className={style.label}>弹窗背景图</div>
                        <div style={{ width: 350 }} className={style.uploaderWrapper}>
                            <DecorationUploader
                                limit={0}
                                value={alertBackgroundImage}
                                onChange={value => onChange({ key: ['alertBackgroundImage'], value })}
                            />
                            <div className={style.uploaderTip}>
                                <p>* 图片建议尺寸230x180像素</p>
                                <p>* 不大于1000KB</p>
                                <p>* 支持png、jpg、jpeg、gif</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.sectionWrapper}>
                        <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                        <div className={style.inlineRow}>
                            <span>{SALE_LABEL.k6346bn4}</span>
                            <div className={style.borderedColorWrapper}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={successBtnColor}
                                    onChange={({ color }) => onChange({ key: ['successBtnColor'], value: color })}
                                    placement="topLeft"
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }} className={style.inlineRow}>
                            <span>{SALE_LABEL.k6346bvg}</span>
                            <div className={style.borderedColorWrapper}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={successBtnTextColor}
                                    onChange={({ color }) => onChange({ key: ['successBtnTextColor'], value: color })}
                                    placement="topLeft"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    handelTabChange = (e) => {
        this.setState({
            activeTab: e
        })
    }
    render() {
        const { activeTab } = this.state
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div className={style.freeGiftTab} style={{ margin: '46px 0 0 20px' }}>
                    <Tabs activeKey={activeTab} onChange={this.handelTabChange} className={style.customTabWrapper}  >
                        <TabPane tab="领奖页" key="1">{this.renderSettingPanel()}</TabPane>
                        <TabPane tab="参与成功页" key="2">{this.renderSuccessPage()}</TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
