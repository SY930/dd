import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import phoneImg from './assets/iphone.png';
import defaultExpansionBgImg from './assets/expansionBg.png'
import giftExample from './assets/gift-example.png'
import giftExampleThumb from './assets/giftExampleThumb.png'
import phoneTop from './assets/phoneTop.png'
import ButtonSettingBlock from './ButtonSettingBlock'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import giftBg1 from './assets/1-1.png'
import giftBg2 from './assets/1-2.png'
import progressImg from './assets/progress.png'
import giftBg3 from './assets/2-1.png'
import giftBg4 from './assets/2-2.png'

const { TabPane } = Tabs;

export default class ExpasionGiftDecorationBoard extends Component {

    state = {
        tabKey: '1',
    }

    renderPhonePreview() {
        const {
            decorationInfo: {
                bannerImg = defaultExpansionBgImg,
                giftThumbImg1,
                giftImg1,
                giftThumbImg2,
                giftImg2,
                giftThumbImg3,
                giftImg3,
                bgColor = '#FF353B',
                buttonBgColor = '#FFC455',
                buttonColor = '#AD0701',
                tagColor1 = '#D639DE',
                tagColor2 = '#FB4273',
                tagColor3 = '#F9CD4D',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    滚动鼠标查看活动
                </div>
                <div className={style.typeTitle}>
                    膨胀大礼包
                </div>
                <img src={phoneImg} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={bannerImg} alt=""/>
                    <div className={style.timer}>
                        活动还剩：2天17小时10分30秒
                    </div>
                    <div className={style.giftContainer}>
                        <div className={style.giftWrapper}>
                            <img
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    top: 0,
                                }}
                                src={giftBg1}
                                alt=""
                            />
                            <img
                                src={giftImg1 || giftExample}
                                alt=""
                                style={{
                                    width: 186,
                                    height: 59,
                                    position: 'absolute',
                                    top: 7,
                                    left: 13,
                                }}
                            />
                            <img
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    bottom: 0,
                                }}
                                src={giftBg2}
                                alt=""
                            />
                        </div>
                        <div
                            className={style.buttonArea}
                            style={{
                                color: buttonColor,
                                background: buttonBgColor,
                            }}
                        >
                            立即参与
                        </div>
                    </div>
                    <div className={style.detailBlock}>
                        <div style={{ background: tagColor1 }} className={style.coloredTag}>
                            活动好礼
                        </div>
                        <img className={style.progressBar} src={progressImg} alt=""/>
                        <div className={style.giftRow}>
                            <div className={style.subWrapper}>
                                <div className={style.giftItem}>
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        top: 0,
                                    }}
                                    src={giftBg3}
                                    alt=""
                                />
                                <img
                                    src={giftThumbImg1 || giftExampleThumb}
                                    alt=""
                                    style={{
                                        width: 51,
                                        height: 59,
                                        position: 'absolute',
                                        top: 8.5,
                                        left: 7,
                                    }}
                                />
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                    src={giftBg4}
                                    alt=""
                                />
                                </div>
                                <div
                                    className={style.action}
                                    style={{
                                        background: buttonBgColor,
                                        color: buttonColor,
                                    }}
                                >
                                    参与即领
                                </div>
                            </div>
                            <div className={style.subWrapper}>
                                <div className={style.giftItem}>
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        top: 0,
                                    }}
                                    src={giftBg3}
                                    alt=""
                                />
                                <img
                                    src={giftThumbImg2 || giftExampleThumb}
                                    alt=""
                                    style={{
                                        width: 51,
                                        height: 59,
                                        position: 'absolute',
                                        top: 8.5,
                                        left: 7,
                                    }}
                                />
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                    src={giftBg4}
                                    alt=""
                                />
                                </div>
                                <div className={style.action}>
                                    邀3人领取
                                </div>
                            </div>
                            <div className={style.subWrapper}>
                                <div className={style.giftItem}>
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        top: 0,
                                    }}
                                    src={giftBg3}
                                    alt=""
                                />
                                <img
                                    src={giftThumbImg3 || giftExampleThumb}
                                    alt=""
                                    style={{
                                        width: 51,
                                        height: 59,
                                        position: 'absolute',
                                        top: 8.5,
                                        left: 7,
                                    }}
                                />
                                <img
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                    src={giftBg4}
                                    alt=""
                                />
                                </div>
                                <div className={style.action}>
                                    邀5人领取
                                </div>
                            </div>
                                    
                        </div>
                        <div className={style.detailTxt}>
                            免费领取礼包，更多美味更多实惠等你来！邀请好友，更能升级礼包，更多惊喜等你哦！
                        </div>
                    </div>
                    <div className={style.friendsInfo}>
                        <div style={{ background: tagColor2 }} className={style.coloredTag}>
                            助力好友榜
                        </div>
                        <div className={style.tip}>
                            暂无好友助力，快去邀请好友助你升级礼包吧
                        </div>
                    </div>
                    <div className={style.ruleInfo}>
                        <div style={{ background: tagColor3 }} className={style.coloredTag}>
                            活动规则
                        </div>
                        <div className={style.rule}>
                            <p>发起人规则：</p>
                            <p>1、同一位用户在一个活动中，只能发起一次膨胀大礼包活动</p>
                            <p>2、兑换奖品后活动立即终止</p>
                            <p style={{ marginTop: 10 }}>助力规则：</p>
                            <p>1、同一位助力用户只能为同一位发起者膨胀一次，不可多次膨胀</p>
                            <p>2、同一位助力用户可为不同发起者各膨胀一次</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderIMGSettingPanel() {
        const {
            onChange,
            decorationInfo: {
                bannerImg,
                giftThumbImg1,
                giftImg1,
                giftThumbImg2,
                giftImg2,
                giftThumbImg3,
                giftImg3,
            }
        } = this.props;
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动宣传图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={bannerImg}
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
                    <div style={{ top: 30 }} className={style.label}>奖品一缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftThumbImg1}
                            onChange={value => onChange({key: ['giftThumbImg1'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>134*146</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品一主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftImg1}
                            onChange={value => onChange({key: ['giftImg1'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>485*146</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品二缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftThumbImg2}
                            onChange={value => onChange({key: ['giftThumbImg2'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>134*146</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品二主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftImg2}
                            onChange={value => onChange({key: ['giftImg2'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>485*146</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品三缩略图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftThumbImg3}
                            onChange={value => onChange({key: ['giftThumbImg3'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>134*146</span>像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>奖品三主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={giftImg3}
                            onChange={value => onChange({key: ['giftImg3'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸<span style={{ color: '#379FF1' }}>485*146</span>像素</p>
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
                <div style={{ margin: 0, paddingBottom: 20 }} className={style.sectionWrapper}>
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
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({tabKey})} className={style.customTabWrapper}>
                        <TabPane tab="页面配图" key="1">
                            {this.renderIMGSettingPanel()}
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
