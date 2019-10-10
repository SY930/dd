import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
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

export default class ShareGiftDecorationBoard extends Component {

    renderPhonePreview() {
        return (
            <div className={style.previewArea}>
                <img src={phoneImg} alt=""/>
            </div>
        )
    }
    renderIMGSettingPanel() {
        const {
            decorationInfo: {
                endImg,
                endColor = '#FF6125',
            },
            onChange,
        } = this.props;
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动宣传图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['bannerImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品一缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftThumbImg1'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品一主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftImg1'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品二缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftThumbImg2'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品二主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftImg2'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品三缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftThumbImg3'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品三主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['giftImg3'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FF353B',
                buttonBgColor = '#FFC455',
                buttonColor = '#AD0701',
                tagColor1 = '#D639DE',
                tagColor2 = '#FB4273',
                tagColor3 = '#F9CD4D',
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
                            <p>* 建议尺寸750x666像素</p>
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
                                活动好礼
                            </div>
                            <div style={{ background: tagColor2 }} className={style.tagPreview}>
                                助力好友榜
                            </div>
                            <div style={{ background: tagColor3 }} className={style.tagPreview}>
                                活动规则
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
