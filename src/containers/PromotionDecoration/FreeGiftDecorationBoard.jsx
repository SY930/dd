import React, { Component } from 'react';
import { InputNumber } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import phoneImg from './assets/iphone.png';
import freeGift from './assets/freeGift.png';
import freeGift1 from './assets/freeGift1.png';
import freeGift2 from './assets/freeGift2.png';
import giftExample from './assets/gift-example.png';
import phoneTop from './assets/phoneTop.png'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';

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
                btnRadius = 50,
                activeImg,
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.typeTitle}>
                    免费领取
                </div>
                <img src={phoneImg} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: activeBg, paddingTop: 80 }} className={style.scrollArea}>
                    <img style={{ width: '100%', position: 'absolute', top: 0 }} src={activeImg || freeGift} alt=""/>
                    <div style={{ position: 'relative', zIndex: 1, margin: '8px 0', textAlign: 'center', color: '#ED6648' }}>
                        活动日期：2019.09.10~2019.11.12
                    </div>
                    <img style={{ position: 'relative', zIndex: 1, display: 'block', margin: '10px auto', width: 254 }} src={freeGift1} alt=""/>
                    <img style={{ position: 'absolute', zIndex: 1, display: 'block', top: 195, left: 60, width: 170 }} src={giftExample} alt=""/>
                    <div style={{ borderRadius: 40 *(btnRadius / 100), background: btnBg, color: btnTextColor}} className={style.freeButton}>
                        免费领取
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
                            其他小伙伴
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
                btnRadius = 50,
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>活动背景色</div>
                    <ColorSettingBlock value={activeBg} onChange={(value) => onChange({key: ['activeBg'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['activeImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸750x666像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <div className={style.inlineRow}>
                        <span>按钮底色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnBg}
                                onChange={({ color }) => onChange({key: ['btnBg'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                        <span>文字颜色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnTextColor}
                                onChange={({ color }) => onChange({key: ['btnTextColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                        <span>圆角弧度</span>
                        <InputNumber
                            style={{ width: 82 }}
                            min={0}
                            max={50}
                            value={btnRadius}
                            onChange={(value) => onChange({key: ['btnRadius'], value})}
                        />
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>领取列表</div>
                    <div className={style.inlineRow}>
                        <span>标签底色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={tagBg}
                                onChange={({ color }) => onChange({key: ['tagBg'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                        <span>文字颜色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={tagTextColor}
                                onChange={({ color }) => onChange({key: ['tagTextColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                        <span>边框颜色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={listBorderColor}
                                onChange={({ color }) => onChange({key: ['listBorderColor'], value: color})}
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
