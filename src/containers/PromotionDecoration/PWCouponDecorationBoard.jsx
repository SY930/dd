import React, { Component } from 'react';
import { Switch, Tabs, Input } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import CropperUploader from 'components/common/CropperUploader'
import {
    iphone,
    freeGift1,
    freeGift2,
    giftExample,
    phoneTop,
} from './assets';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const TabPane = Tabs.TabPane;

const freeGift = 'http://res.hualala.com/basicdoc/437d4ffb-aa5c-47c9-8285-c259b434375f.png'
const couponImg = 'http://res.hualala.com/basicdoc/c0ec5b4f-295c-4981-9e76-5a21269647b4.png'
const trumpetImg = 'http://res.hualala.com/basicdoc/d0a331dd-09aa-4081-b1b8-c88e7c867139.png'
const modalImg1 = 'http://res.hualala.com/basicdoc/cacbd1d3-6694-47e8-b17c-b71c3131b542.png'
const modalImg2 = 'http://res.hualala.com/basicdoc/20ddcef7-41e4-4ea5-a3d1-2025afade60c.png'

@injectIntl()
export default class PWCouponDecorationBoard extends Component {

    state = {
        activeTab: '1'
    }

    renderPhonePreview() {
        const {
            decorationInfo: {
                activeBg = '#feae1b',
                btnBg = '#FFEDC2',
                btnTextColor = '#AA7246',
                activeImg,
                alertBackgroundImage,
                canGetGiftTitleColor = '#AA7246',
                giftListTitleColor = '#AA7246',
                // successTip = '请前往商家公众号查看/使用',
                isShowGiftListContent = true,
                isShowCanGetGift = true,
                successBtnColor = '#FFE494',
                successBtnTextColor = '#A74818',
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
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />

                <div style={{ background: activeBg }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={activeImg || freeGift} alt="" />
                    <div style={{ width: '100%' }}>
                        <div className={style.freeGiftTimeText}  >活动时间：2019/09/08 - 2019/09/09</div>
                        {isShowGiftListContent ? <div style={{ color: giftListTitleColor }} className={style.freeGiftGetGift}>
                            <div><img style={{ width: '14px', height: '14px' }} src={trumpetImg} /> 用户 ****领取了优惠券</div>
                            <div>2019/09/08 09:03:00</div>
                        </div> : null}
                        {
                            isShowCanGetGift ? <div className={style.freeGiftcanGetGiftList}>
                                <div style={{ marginTop: '10px', color: canGetGiftTitleColor }}>可领礼品</div>
                            </div> : null
                        }

                        <div className={style.freeGiftBtnWrap}>
                            <div style={{ background: btnBg, color: btnTextColor }}>立即领取</div>
                        </div>
                    </div>

                </div>
                {this.state.activeTab === '2' ?
                    <div className={style.blindGiftSuccessModal}>
                        <div className={style.successAlertWrapper}>
                            <img className={style.freeGiftSuccessModalImg1} src={alertBackgroundImage || modalImg1} />
                            <div className={style.blindGiftSuccessModalCon}>
                                <div className={style.blindGiftSuccessTip} style={{ fontSize: 20 }}>领取成功!</div>
                                {/* <div className={style.blindGiftSuccessTip}>{successTip}</div> */}
                                <p className={style.blindSuccessBtnColor} style={{ backgroundColor: successBtnColor, color: successBtnTextColor }}>确定</p>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                activeBg = '#feae1b',
                btnBg = '#FFEDC2',
                btnTextColor = '#AA7246',
                canGetGiftTitleColor = '#AA7246',
                giftListTitleColor = '#AA7246',
                activeImg,
                isShowGiftListContent = true,
                isShowCanGetGift = true
            },
            onChange,
        } = this.props;
        return (
            <div className={style.freeGiftDecorationWrap} style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={activeImg}
                            onChange={value => onChange({ key: ['activeImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750x960像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>背景颜色</div>
                    <ColorSettingBlock title={"请选取一个你喜欢的颜色"} value={activeBg} onChange={(value) => onChange({ key: ['activeBg'], value })} />
                </div>

                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>{SALE_LABEL.k636p2l0}</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnBg}
                                onChange={({ color }) => onChange({ key: ['btnBg'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                        <span>按钮文字</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnTextColor}
                                onChange={({ color }) => onChange({ key: ['btnTextColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>可领礼品</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Switch checked={isShowCanGetGift} onChange={(e) => {
                            onChange({ key: ['isShowCanGetGift'], value: e });
                        }} style={{ width: '48px', height: '24px', borderRadius: '12px', marginRight: '16px' }} checkedChildren="开" unCheckedChildren="关" />
                        <div className={style.inlineRow}>
                            <span>标题文字</span>
                            <div className={style.borderedColorWrapper}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={canGetGiftTitleColor}
                                    onChange={({ color }) => {
                                        onChange({ key: ['canGetGiftTitleColor'], value: color });
                                    }}
                                    placement="topLeft"
                                />
                            </div>

                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>领取列表</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Switch checked={isShowGiftListContent} onChange={(e) => {
                            onChange({ key: ['isShowGiftListContent'], value: e });
                        }} style={{ width: '48px', height: '24px', borderRadius: '12px', marginRight: '16px' }} checkedChildren="开" unCheckedChildren="关" />
                        <div className={style.inlineRow}>
                            <span>显示文字</span>
                            <div className={style.borderedColorWrapper}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={giftListTitleColor}
                                    onChange={({ color }) => {
                                        onChange({ key: ['giftListTitleColor'], value: color });
                                    }}
                                    placement="topLeft"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderSuccessPage = () => {
        const {
            decorationInfo: {
                // successTip = '请前往商家公众号查看/使用',
                alertBackgroundImage,
                successBtnColor = '#FFE494',
                successBtnTextColor = '#A74818',
            },
            onChange
        } = this.props;
        return (
            <div>
                <div >
                    <div className={style.sectionWrapper}>
                        <div style={{ top: 30 }} className={style.label}>弹窗背景图</div>
                        <div style={{ width: 350 }} className={style.uploaderWrapper}>
                            <CropperUploader
                                isAbsoluteUrl={true}
                                limit={1000}
                                value={alertBackgroundImage}
                                cropperRatio={546 / 184}
                                // width={245}
                                onChange={value => onChange({ key: ['alertBackgroundImage'], value })}
                            />
                            <div className={style.uploaderTip}>
                                <p>* 图片建议尺寸546x184像素</p>
                                <p>* 不大于1000KB</p>
                                <p>* 支持png、jpg、jpeg、gif</p>
                            </div>
                        </div>
                    </div>
                    <div style={{overflow: 'hidden',height: 50, paddingTop: 10}}>
                        <span style={{ marginLeft:44,float:'left',color: '#333333', whiteSpace: 'nowrap',fontWeight:'bold',fontSize:14 }}>引导文案</span>
                        {/* <div style={{marginLeft:49,float:'left', width: '512px', marginTop: -6 }}> */}
                            {/* <Input value={successTip} maxLength={30} onChange={this.handleExplainChange} addonAfter={<div>{successTip.length}/30</div>} /> */}
                        {/* </div> */}
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

    // handleExplainChange = (e) => {
    //     const {
    //         onChange
    //     } = this.props;

    //     onChange({ key: ['successTip'], value: e.target.value })
    // }
    render() {
        const { activeTab } = this.state
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div className={style.freeGiftTab} style={{ margin: '46px 0 0 20px' }}>
                    <Tabs activeKey={activeTab} onChange={this.handelTabChange} className={style.customTabWrapper}  >
                        <TabPane tab="兑换页" key="1">{this.renderSettingPanel()}</TabPane>
                        <TabPane tab="兑换成功页" key="2">{this.renderSuccessPage()}</TabPane>
                    </Tabs>
                </div>

            </div>
        )
    }
}
