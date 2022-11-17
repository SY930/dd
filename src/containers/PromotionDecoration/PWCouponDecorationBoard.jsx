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
                activeImg = 'http://res.hualala.com/basicdoc/7f17bec7-d01d-464b-a0c6-6e8837b3f988.png',
                exchangeBtnImg='http://res.hualala.com/basicdoc/2d63a0a3-b64f-4a34-bc96-e461a7602ce2.png',
                homeBtnBgColor='#F2CF9E',
                homeTextColor='#6E441A',
                ruleBtnBgColor='#F2CF9E',
                ruleBtnTextColor='#6E441A',
                activeTimeColor='#87580E',
                alertBgImg='http://res.hualala.com/basicdoc/7cde3a57-17f3-4b55-a915-e6c24022db2c.png',
                successBtnBgColor='#FD6E5B',
                successTextColor='#fff',
                isShowAcitveTime=true,            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    口令领券
                    {/* {SALE_LABEL.k636p0yo} */}
                </div>
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />
            <div className={style.PWCouponDecorationBox}>
                <div style={{ backgroundImage: `url(${activeImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} className={style.pwCouponscrollArea}>
                    <p style={{ background: `${ruleBtnBgColor}` }}><span style={{color: `${ruleBtnTextColor}`}}>规则</span></p><p style={{ background: `${homeBtnBgColor}`,}}><span style={{ color: `${homeTextColor}`}}>首页</span></p>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <div className={style.PWCouponGiftTimeText} style={{ color: `${activeTimeColor}`}} > { isShowAcitveTime &&  <span>活动时间7.1~7.30</span>}</div>
                        {/* <img style={{ width: '230px' }} src={"http://res.hualala.com/basicdoc/2fe87748-309d-4636-a646-128d6f8d4c6d.png"} alt="" /> */}
                        <img src='http://res.hualala.com/basicdoc/ed00ca7d-c65a-4c67-a39a-e280d71cf36a.png'alt='' className={style.pwCouponImg} style={{  width: 154, height: 39 }}/>
                        <img src={`${exchangeBtnImg}`} alt='' className={style.pwCouponImg} style={{ top: '404', left: '48', width: 185, height: 37}}/>
                    </div>

                </div>
                </div>
                {this.state.activeTab === '2' ?
                    <div className={style.blindGiftSuccessModal}>
                        <div className={style.pwCouponSuccessAlertBox}>
                            <img className={style.pwCouponSuccessModalImg} src={`${alertBgImg}`} />
                            <div className={style.pwCouponSuccessModalCon}>
                                <div className={style.blindGiftSuccessTip} >恭喜您获得以下礼品</div>
                                <img src='http://res.hualala.com/basicdoc/e369f935-dc48-430b-8726-25566274004d.png' alt='' />
                                <img src='http://res.hualala.com/basicdoc/e369f935-dc48-430b-8726-25566274004d.png' alt='' />
                                <img src='http://res.hualala.com/basicdoc/e369f935-dc48-430b-8726-25566274004d.png' alt='' />
                                {/* <div className={style.blindGiftSuccessTip}>{successTip}</div> */}
                                <p className={style.blindSuccessBtnColor} style={{ background: `${successBtnBgColor}`, color: `${successTextColor}`, marginTop: 19 }}>查看我的优惠券</p>
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
                activeImg,
                exchangeBtnImg,
                homeBtnBgColor='#F2CF9E',
                homeTextColor='#6E441A',
                ruleBtnBgColor='#F2CF9E',
                ruleBtnTextColor='#6E441A',
                activeTimeColor='#87580E',
                isShowAcitveTime = true,
            },
            onChange,
        } = this.props;
        return (
            <div className={style.freeGiftDecorationWrap} style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动背景</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={activeImg}
                            onChange={value => onChange({ key: ['activeImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750X1532像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>兑换按钮</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={exchangeBtnImg}
                            onChange={value => onChange({ key: ['exchangeBtnImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸240x48像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>

                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>首页按钮</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={homeBtnBgColor}
                                onChange={({ color }) => onChange({ key: ['homeBtnBgColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                        <span>按钮文字</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={homeTextColor}
                                onChange={({ color }) => onChange({ key: ['homeTextColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>规则按钮</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={ruleBtnBgColor}
                                onChange={({ color }) => onChange({ key: ['ruleBtnBgColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                        <span>按钮文字</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={ruleBtnTextColor}
                                onChange={({ color }) => onChange({ key: ['ruleBtnTextColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>活动时间</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Switch checked={isShowAcitveTime} onChange={(e) => {
                            onChange({ key: ['isShowAcitveTime'], value: e });
                        }} style={{ width: '48px', height: '24px', borderRadius: '12px', marginRight: '16px' }} checkedChildren="开" unCheckedChildren="关" />
                        <div className={style.inlineRow}>
                            <span>文字颜色</span>
                            <div className={style.borderedColorWrapper}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={activeTimeColor}
                                    onChange={({ color }) => {
                                        onChange({ key: ['activeTimeColor'], value: color });
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
                alertBgImg,
                successBtnBgColor='#FD6E5B',
                successTextColor='#fff',
            },
            onChange
        } = this.props;
        return (
            <div>
                <div >
                    <div className={style.sectionWrapper}>
                        <div style={{ top: 30 }} className={style.label}>弹窗主图</div>
                        <div style={{ width: 350 }} className={style.uploaderWrapper}>
                            <CropperUploader
                                isAbsoluteUrl={true}
                                limit={1000}
                                value={alertBgImg}
                                cropperRatio={546 / 184}
                                // width={245}
                                onChange={value => onChange({ key: ['alertBgImg'], value })}
                            />
                            <div className={style.uploaderTip}>
                                <p>* 图片建议尺寸222x122像素</p>
                                <p>* 不大于1000KB</p>
                                <p>* 支持png、jpg、jpeg、gif</p>
                            </div>
                        </div>
                    </div>
                    {/* <div style={{overflow: 'hidden',height: 50, paddingTop: 10}}> */}
                        {/* <span style={{ marginLeft:44,float:'left',color: '#333333', whiteSpace: 'nowrap',fontWeight:'bold',fontSize:14 }}>引导文案</span> */}
                        {/* <div style={{marginLeft:49,float:'left', width: '512px', marginTop: -6 }}> */}
                            {/* <Input value={successTip} maxLength={30} onChange={this.handleExplainChange} addonAfter={<div>{successTip.length}/30</div>} /> */}
                        {/* </div> */}
                    {/* </div> */}
                    
                    <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={successBtnBgColor}
                                onChange={({ color }) => onChange({ key: ['successBtnBgColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                        <span>按钮文字</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={successTextColor}
                                onChange={({ color }) => onChange({ key: ['successTextColor'], value: color })}
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
