import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import phoneImg from './assets/iphone.png';
import defaultShareBgImg from './assets/shareGift.png';
import shareGift1 from './assets/shareGift1.png';
import phoneTop from './assets/phoneTop.png'
import giftExample from './assets/gift-example.png'
import ButtonSettingBlock from './ButtonSettingBlock'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';

export default class ShareGiftDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                bannerImg = defaultShareBgImg,
                bgColor = '#FF6248',
                buttonBgColor = '#FFC655',
                buttonColor = '#FFFFFF',
                tagColor1 = '#CF4CE4',
                tagColor2 = '#CF4CE4',
                tagColor3 = '#FB4171',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    滚动鼠标查看活动
                </div>
                <div className={style.typeTitle}>
                    分享裂变
                </div>
                <img src={phoneImg} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={bannerImg} alt=""/>
                    <div style={{ margin: '8px 0', textAlign: 'center', color: 'rgba(255,255,255,0.9)' }}>
                        活动时间：2019.03.20-2019.04.20
                    </div>
                    <div className={style.shareCommonBlock}>
                        <div style={{ background: tagColor1 }} className={style.coloredTag}>
                            我的礼品
                        </div>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <div className={style.buttonArea} style={{ background: buttonBgColor, color: buttonColor }}>
                            邀请好友领壕礼
                        </div>
                    </div>
                    <div className={style.shareCommonBlock}>
                        <div style={{ background: tagColor2 }} className={style.coloredTag}>
                            好友的礼品
                        </div>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <br/>
                    </div>
                    <div style={{ background: '#FDA956' }} className={style.shareCommonBlock}>
                        <div style={{ background: tagColor3 }} className={style.coloredTag}>
                            邀请的好友
                        </div>
                        <img src={shareGift1} alt=""/>
                        <br/>
                    </div>
                    
                </div>
            </div>
        )
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FF6248',
                buttonBgColor = '#FFC655',
                buttonColor = '#FFFFFF',
                tagColor1 = '#CF4CE4',
                tagColor2 = '#CF4CE4',
                tagColor3 = '#FB4171',
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>活动背景色</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({key: ['bgColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['bannerImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>750*666</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 8 }} className={style.label}>按钮样式</div>
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
                    <div style={{ top: 8 }} className={style.label}>标签样式</div>
                    <div className={style.tagColorBlock}>
                        <div className={style.leftBlock}>
                            <div className={style.colorRow}>
                                <span>标签一</span>
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
                                <span>标签二</span>
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
                                <span>标签三</span>
                                <div className={style.borderedColorWrapper}>
                                    <WrappedColorPicker
                                        alpha={100}
                                        color={tagColor3}
                                        onChange={({ color }) => onChange({key: ['tagColor3'], value: color})}
                                        placement="topLeft"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.rightBlock}>
                            <h5>图例</h5>
                            <div style={{ background: tagColor1 }} className={style.tagPreview}>
                                我的礼品
                            </div>
                            <div style={{ background: tagColor2 }} className={style.tagPreview}>
                                好友的礼品
                            </div>
                            <div style={{ background: tagColor3 }} className={style.tagPreview}>
                                邀请的好友
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
