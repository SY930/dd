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

const { TabPane } = Tabs;

export default class ExpasionGiftDecorationBoard extends Component {

    state = {
        tabKey: '1',
    }

    renderPhonePreview() {
        const { tabKey } = this.state;
        const {
            decorationInfo: {
                enterImg = defaultEnterImg,
                endImg = defaultEndImg,
                endColor = '#FF6125',
            },
        } = this.props;
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
    renderColorSettingPanel() {
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
            <div>
                <div style={{ margin: 0, borderBottom: '1px solid #EEE' }} className={style.sectionWrapper}>
                    <ColorSettingBlock
                        value={bgColor}
                        title={<span style={{color: '#333', fontSize: 14}}>请选择活动背景色或者自定义颜色</span>}
                        onChange={(value) => onChange({key: ['bgColor'], value})}
                    />
                </div>
                <div style={{ margin: 0, paddingBottom: 20, borderBottom: '1px solid #EEE' }} className={style.sectionWrapper}>
                    <div style={{color: '#333', fontSize: 14, margin: '20px 0 10px 0'}}>请选择文字及按钮颜色</div>
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
                <div style={{ margin: 0, paddingBottom: 20, borderBottom: '1px solid #EEE' }} className={style.sectionWrapper}>
                    <div style={{color: '#333', fontSize: 14, margin: '20px 0 10px 0'}}>标签颜色</div>
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
        const {
            decorationInfo: {
                enterImg,
            },
            onChange,
        } = this.props;
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({tabKey})} className={style.customTabWrapper}>
                        <TabPane tab="页面配图" key="1">
                            {this.renderIMGSettingPanel()}
                            {/* <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
                                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <DecorationUploader
                                            limit={1000}
                                            onChange={value => onChange({key: ['enterImg'], value})}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* 图片大小不要超过1000KB</p>
                                            <p>* 建议尺寸920x1346像素</p>
                                            <p>* 支持JPG、PNG、GIF图片文件</p>
                                        </div>
                                    </div>
                                </div>
                                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '2'})}>下一页</Button>
                            </div>  */}
                        </TabPane>
                        <TabPane tab="活动皮肤装修" key="2">
                            {this.renderColorSettingPanel()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
