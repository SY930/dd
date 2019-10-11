import React, { Component } from 'react';
import { InputNumber } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import phoneImg from './assets/iphone.png';
import defaultEnterImg from './assets/recommend1.png'
import defaultEndImg from './assets/recommend2.png'
import giftExample from './assets/gift-example.png'
import tagImg from './assets/tag.svg'
import ButtonSettingBlock from './ButtonSettingBlock'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';

export default class FreeGiftDecorationBoard extends Component {

    renderPhonePreview() {
        return (
            <div className={style.previewArea}>
                <img src={phoneImg} alt=""/>
            </div>
        )
    }
    
    renderSettingPanel() {
        const {
            decorationInfo: {
                activeBg = '#FD6631',
                btnBg = '#FFC455',
                btnTextColor = '#CB4408',
                tagBg = '#FA5F3F',
                tagTextColor = '#DCDCDC',
                listBorderColor = '#DCDCDC',
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
