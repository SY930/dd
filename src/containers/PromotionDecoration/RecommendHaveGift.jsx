import React, { Component } from 'react';
import { Tabs } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    phoneTop,
} from './assets';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import ButtonSettingBlockMultiple from './ButtonSettingBlockMultiple'

const baseUrl = 'http://res.hualala.com/basicdoc'

const TabPane = Tabs.TabPane;

export default class RecommendHaveGift extends Component {
    state = {
        // activeTab: '1',
    }
    handleLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }

    handleBtnInvitedChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColorInvited'], value: `linear-gradient(${color1},${color2})` })
    }
    handleFaceLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['faceToFaceBtnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }
    handelTabChange = (e) => {
        this.props.handelTabRecommendChange(e)
    }
    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#FBB335',
                bgImg,
                btnBgColor = 'linear-gradient(#F27267,#D24C41)',
                btnColor = '#FFFFFF',
                faceToFaceBtnBgColor = 'linear-gradient(#F27267,#D24C41)',
                faceToFaceBtnColor = '#FFFFFF',
                bgColorInvited = '#FBB335',
                bgImgInvited,
                btnBgColorInvited = 'linear-gradient(#F27267,#D24C41)',
                btnColorInvited = '#FFFFFF',
            },
        } = this.props;

        return (
            <div>
                {
                    this.props.activeTab === '1' ? (<div className={style.previewArea}>
                        <div className={style.typeTitle}>
                            推荐有礼
                        </div>
                        <img src={iphone} alt="" />
                        <img className={style.fakeHeader} src={phoneTop} alt="" />
                        <div style={{ background: bgColor }} className={style.scrollArea}>
                            <img style={{ width: '100%' }} src={bgImg || `${baseUrl}/364c0698-6252-42c1-b54e-fbabfc162c08.png`} alt="" />
                            <div style={styles.tip}>每邀请一位新用户储值后可返还</div>
                            <img style={styles.award} src={`${baseUrl}/641e20de-c148-4f43-b51c-457273118466.png`} alt="" />
                            <div style={styles.center}>
                                <div style={{ ...styles.btn, background: btnBgColor, color: btnColor }}>立即邀请</div>
                                <div style={{ ...styles.btn, ...styles.faceBtn, background: faceToFaceBtnBgColor, color: faceToFaceBtnColor }}>面对面邀请</div>
                            </div>
                        </div>
                    </div>) : (
                        <div className={style.previewArea}>
                            <div className={style.typeTitle}>
                                推荐有礼
                            </div>
                            <img src={iphone} alt="" />
                            <img className={style.fakeHeader} src={phoneTop} alt="" />
                            <div style={{ background: bgColorInvited }} className={style.scrollArea}>
                                <img style={{ width: '100%' }} src={bgImgInvited || `${baseUrl}/364c0698-6252-42c1-b54e-fbabfc162c08.png`} alt="" />
                                <div style={styles.centerFlex}><img src={`${baseUrl}/090c6330-cf50-45ea-9da7-904cf4152819.png`} alt="" style={{ width: '105px' }} /></div>
                                <img style={styles.award} src={`${baseUrl}/5f51bb71-0c37-4de6-8b91-c720d5cbd2cc.png`} alt="" />
                                <div style={styles.center}>
                                    <div style={{ ...styles.btn, background: btnBgColorInvited, color: btnColorInvited }}>立即领取</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FBB335',
                bgImg,
                btnBgColor = 'linear-gradient(#F27267,#D24C41)',
                btnColor = '#FFFFFF',
                faceToFaceBtnBgColor = 'linear-gradient(#F27267,#D24C41)',
                faceToFaceBtnColor = '#FFFFFF',
            },
            onChange,
        } = this.props;

        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper} style={{ marginLeft: '112px' }}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({ key: ['bgImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 建议图片尺寸 1080x716像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper} style={{ marginLeft: '112px' }}>
                    <div className={style.label}>主题颜色</div>
                    <ColorSettingBlock title="请选取一个你喜欢的颜色" value={bgColor} onChange={value => onChange({ key: ['bgColor'], value })} />
                </div>

                <div className={style.sectionWrapper} key="btn1" style={{ marginLeft: '112px' }}>
                    <div style={{ top: 5 }} >
                        <p className={style.label}> 按钮样式</p>
                        <p className={style.subLabel} style={{ left: '-150px' }}>(立即邀请)</p>
                    </div>
                    <ButtonSettingBlockMultiple
                        btnColor={btnColor}
                        btnBgColor={btnBgColor}
                        onChange={(v) => {
                            for (const key in v) {
                                onChange({ key: [key], value: v[key] })
                            }
                        }}
                        handleLinearGradientChange={this.handleLinearGradientChange}
                        key="btn1"
                        keys="btn1"
                    />

                </div>
                <div className={style.sectionWrapper} key="btn2" style={{ marginLeft: '112px' }}>
                    <div style={{ top: 5 }} >
                        <p className={style.label}>按钮样式</p>
                        <p className={style.subLabel}>(面对面邀请)</p>
                    </div>
                    <ButtonSettingBlockMultiple
                        btnColor={faceToFaceBtnColor}
                        btnBgColor={faceToFaceBtnBgColor}
                        onChange={(v) => {
                            if (v.btnBgColor) {
                                onChange({ key: ['faceToFaceBtnBgColor'], value: v.btnBgColor })
                                onChange({ key: ['faceToFaceBtnColor'], value: v.btnColor })
                            } else {
                                onChange({ key: ['faceToFaceBtnColor'], value: v.btnColor })
                            }
                        }}
                        handleLinearGradientChange={this.handleFaceLinearGradientChange}
                        key="btn2"
                        keys="btn2"
                    />

                </div>
            </div>
        )
    }

    renderSettingedPage = () => {
        const {
            decorationInfo: {
                bgColorInvited = '#FBB335',
                bgImgInvited,
                btnBgColorInvited = 'linear-gradient(#F27267,#D24C41)',
                btnColorInvited = '#FFFFFF',
            },
            onChange,
        } = this.props;

        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper} style={{ marginLeft: '112px' }}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImgInvited}
                            onChange={value => onChange({ key: ['bgImgInvited'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 建议图片尺寸 1080x716像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper} style={{ marginLeft: '112px' }}>
                    <div className={style.label}>主题颜色</div>
                    <ColorSettingBlock title="请选取一个你喜欢的颜色" value={bgColorInvited} onChange={value => onChange({ key: ['bgColorInvited'], value })} />
                </div>

                <div className={style.sectionWrapper} key="btn1" style={{ marginLeft: '112px' }}>
                    <div style={{ top: 5 }} >
                        <p className={style.label}> 按钮样式</p>
                        <p className={style.subLabel} style={{ left: '-150px' }}>(立即领取)</p>
                    </div>
                    <ButtonSettingBlockMultiple
                        btnColor={btnColorInvited}
                        btnBgColor={btnBgColorInvited}
                        onChange={(v) => {
                            onChange({ key: ['btnColorInvited'], value: v.btnColor })
                            // onChange({ key: ['btnBgColorInvited'], value: v.btnBgColor })
                        }}
                        handleLinearGradientChange={this.handleBtnInvitedChange}
                        key="btn3"
                        keys="btn3"
                    />

                </div>
            </div>
        )
    }

    render() {
        const { activeTab } = this.props
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                {/* {this.renderSettingPanel()} */}
                <div className={style.freeGiftTab} style={{ margin: '46px 0 0 20px' }}>
                    <Tabs activeKey={activeTab} onChange={this.handelTabChange} className={style.customTabWrapper} >
                        <TabPane tab="推荐页" key="1">{this.renderSettingPanel()}</TabPane>
                        <TabPane tab="被推荐页" key="2">{this.renderSettingedPage()}</TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}


const styles = {
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    centerFlex: {
        display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-19px',
    },
    actRule: {
        width: '65px',
        height: '24px',
        color: '#FFFFFF',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#F15F22',
        position: 'absolute',
        borderRadius: '19px 0px 0px 19px',
        top: '16px',
        right: 0,
    },
    point: {
        color: '#fff',
        position: 'absolute',
        top: '26px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    pointText: {
        fontSize: '12px',
        transform: 'scale(0.8)',
    },
    pointNum: {
        fontSize: '20px',
        left: '14px',
        top: '80px',
    },
    award: {
        width: '90%',
        display: 'inherit',
        margin: '0 auto',
        marginTop: '14px',
    },
    tip: {
        width: '190px',
        height: '20px',
        margin: '0 auto',
        borderRadius: '10px',
        marginTop: '-6px',
        background: '#fff',
        color: '#E57734',
        position: 'relative',
        zIndex: '9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: '230px',
        height: '30px',
        borderRadius: '15',
        // boxShadow:'0px 2px 5px 0px rgba(231,156,31,0.5)',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // background:'linear-gradient(#FFDF88, #FFBB50',
        position: 'relative',
        // transform: 'translateX(-50%)',
        // marginLeft: '50%',
        top: '16px',
    },
    faceBtn: {
        // border: '1px solid #F7720B',
        color: '#F7720B',
        top: '32px',
    },

}
