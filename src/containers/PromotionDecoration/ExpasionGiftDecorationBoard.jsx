import React, { Component } from 'react';
import { Tabs, Button, Icon, Input } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone as phoneImg,
    expansionBg as defaultExpansionBgImg,
    giftExample,
    giftExampleThumb,
    phoneTop,
    progress as progressImg,
} from './assets';
import ButtonSettingBlock from './ButtonSettingBlock'
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import giftBg1 from './assets/1-1.png'
import giftBg2 from './assets/1-2.png'
import giftBg3 from './assets/2-1.png'
import giftBg4 from './assets/2-2.png'
import ExpasionGiftImgCropUploader from './ExpasionGiftImgCropUploader'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const { TabPane } = Tabs;

@injectIntl()
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
                giftThumbImg4,
                giftImg4,
                giftThumbImg5,
                giftImg5,
                bgColor = '#FF353B',
                buttonBgColor = '#FFC455',
                buttonColor = '#AD0701',
                tagColor1 = '#D639DE',
                tagColor2 = '#FB4273',
                tagColor3 = '#F9CD4D',
                shareBtnText='喊好友帮忙',
                shareBtnColor="#ff0000",
                shareTextColor="#ffffff"
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                {this.state.tabKey == '3' ? <div className={style.ExpasionGiftWrapper}>
                    <div className={style.imgWrapper}>
                        <img src={require('./assets/shareModalImg.png')} alt=""/>
                        <div className={style.contentWrapper}>
                            <div className={style.text}>参与成功</div>
                            <span className={style.shareBtn} style={{ background: shareBtnColor, color: shareTextColor }}>{shareBtnText}</span>
                        </div>
                    </div>
                    <Icon className={style.closeBtn}  type="close-circle-o" />
                </div> : null}
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    {SALE_LABEL.k635s5id}
                </div>
                <img src={phoneImg} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={bannerImg} alt=""/>
                    <div className={style.timer}>
                        {SALE_LABEL.k635s5qq}
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
                            {SALE_LABEL.k635s5z2}
                        </div>
                    </div>
                    <div className={style.detailBlock}>
                        <div style={{ background: tagColor1 }} className={style.coloredTag}>
                            {SALE_LABEL.k635s67e}
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
                                    {SALE_LABEL.k635s6fq}
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
                                    {SALE_LABEL.k635s6o2}
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
                                    {SALE_LABEL.k635s6we}
                                </div>
                            </div>

                        </div>
                        <div className={style.detailTxt}>
                            {SALE_LABEL.k636f213}
                        </div>
                    </div>
                    <div className={style.friendsInfo}>
                        <div style={{ background: tagColor2 }} className={style.coloredTag}>
                            {SALE_LABEL.k636f29f}
                        </div>
                        <div className={style.tip}>
                            {SALE_LABEL.k636f2hr}
                        </div>
                    </div>
                    <div className={style.ruleInfo}>
                        <div style={{ background: tagColor3 }} className={style.coloredTag}>
                            {SALE_LABEL.k636f2q3}
                        </div>
                        <div className={style.rule}>
                            <p>{SALE_LABEL.k636f2yf}：</p>
                            <p>1、{SALE_LABEL.k636f36s}</p>
                            <p>2、{SALE_LABEL.k636f3f4}</p>
                            <p style={{ marginTop: 10 }}>{SALE_LABEL.k636f3ng}：</p>
                            <p>1、{SALE_LABEL.k636f3vs}</p>
                            <p>2、{SALE_LABEL.k636f444}</p>
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
                __giftBaseImg1,
                giftThumbImg2,
                giftImg2,
                __giftBaseImg2,
                giftThumbImg3,
                giftImg3,
                __giftBaseImg3,
                giftThumbImg4,
                giftImg4,
                __giftBaseImg4,
                giftThumbImg5,
                giftImg5,
                __giftBaseImg5,
            }
        } = this.props;
        const { intl } = this.props;
        const k636f4cg = intl.formatMessage(SALE_STRING.k636f4cg);
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 50, fontSize: 12, fontWeight: 'normal' }} className={style.label}>活动宣传图</div>
                    <div
                        style={{
                            width: 350,
                            padding: '15px 0 15px 20px',
                            border: '1px solid #eee',
                            borderRadius: 10
                        }}
                        className={style.uploaderWrapper}
                    >
                        <DecorationUploader
                            limit={1000}
                            value={bannerImg}
                            onChange={value => onChange({key: ['bannerImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                    <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}<span style={{ color: '#379FF1' }}>750*666</span></p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
                <ExpasionGiftImgCropUploader
                    title={k636f4cg + '一'}
                    baseImgUrl={__giftBaseImg1}
                    thumbImgUrl={giftThumbImg1}
                    imgUrl={giftImg1}
                    onBaseImgUrlChange={value => onChange({key: ['__giftBaseImg1'], value})}
                    onThumbImgUrlChange={value => onChange({key: ['giftThumbImg1'], value})}
                    onImgUrlChange={value => onChange({key: ['giftImg1'], value})}
                />
                <ExpasionGiftImgCropUploader
                    title={k636f4cg + '二'}
                    baseImgUrl={__giftBaseImg2}
                    thumbImgUrl={giftThumbImg2}
                    imgUrl={giftImg2}
                    onBaseImgUrlChange={value => onChange({key: ['__giftBaseImg2'], value})}
                    onThumbImgUrlChange={value => onChange({key: ['giftThumbImg2'], value})}
                    onImgUrlChange={value => onChange({key: ['giftImg2'], value})}
                />
                <ExpasionGiftImgCropUploader
                    title={k636f4cg + '三'}
                    baseImgUrl={__giftBaseImg3}
                    thumbImgUrl={giftThumbImg3}
                    imgUrl={giftImg3}
                    onBaseImgUrlChange={value => onChange({key: ['__giftBaseImg3'], value})}
                    onThumbImgUrlChange={value => onChange({key: ['giftThumbImg3'], value})}
                    onImgUrlChange={value => onChange({key: ['giftImg3'], value})}
                />
                <ExpasionGiftImgCropUploader
                    title={k636f4cg + '四'}
                    baseImgUrl={__giftBaseImg4}
                    thumbImgUrl={giftThumbImg4}
                    imgUrl={giftImg4}
                    onBaseImgUrlChange={value => onChange({key: ['__giftBaseImg4'], value})}
                    onThumbImgUrlChange={value => onChange({key: ['giftThumbImg4'], value})}
                    onImgUrlChange={value => onChange({key: ['giftImg4'], value})}
                />
                <ExpasionGiftImgCropUploader
                    title={k636f4cg + '五'}
                    baseImgUrl={__giftBaseImg5}
                    thumbImgUrl={giftThumbImg5}
                    imgUrl={giftImg5}
                    onBaseImgUrlChange={value => onChange({key: ['__giftBaseImg5'], value})}
                    onThumbImgUrlChange={value => onChange({key: ['giftThumbImg5'], value})}
                    onImgUrlChange={value => onChange({key: ['giftImg5'], value})}
                />
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
        title={<span style={{color: '#333', fontSize: 14}}>{SALE_LABEL.k636f4ks}</span>}
                        onChange={(value) => onChange({key: ['bgColor'], value})}
                    />
                </div>
                <div style={{ margin: 0, paddingBottom: 20, borderBottom: '1px solid #EEE' }} className={style.sectionWrapper}>
        <div style={{color: '#333', fontSize: 14, margin: '20px 0 10px 0'}}>{SALE_LABEL.k636f4t4}</div>
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
                        <div style={{color: '#333', fontSize: 14, margin: '20px 0 10px 0'}}>{SALE_LABEL.k636f51g}</div>
                    <div className={style.tagColorBlock}>
                        <div className={style.leftBlock}>
                            <div className={style.colorRow}>
                        <span>{SALE_LABEL.k5dlpi06}一</span>
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
                                <span>{SALE_LABEL.k5dlpi06}二</span>
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
                                <span>{SALE_LABEL.k5dlpi06}三</span>
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
                        <h5>{SALE_LABEL.k636f59s}</h5>
                            <div style={{ background: tagColor1 }} className={style.tagPreview}>
                                {SALE_LABEL.k635s67e}
                            </div>
                            <div style={{ background: tagColor2 }} className={style.tagPreview}>
                                {SALE_LABEL.k636f5i4}
                            </div>
                            <div style={{ background: tagColor3 }} className={style.tagPreview}>
                                {SALE_LABEL.k636f2q3}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    renderShareModal() {
        const {
            decorationInfo: {
                modalImg,
                shareBtnText='喊好友帮忙',
                shareBtnColor="ff0000",
                shareTextColor="ffffff"
            },
            onChange,
        } = this.props;
        return (
            <div>
                {/* <h4 style={{ marginBottom: 30 }}>弹窗背景图</h4>
                <div style={{ display: 'flex', marginLeft: 60 }}>
                    <DecorationUploader
                        limit={1000}
                        value={modalImg}
                        onChange={value => onChange({key: ['modalImg'], value})}
                    />
                    <div className={style.uploaderTip}>
                        <p>* 图片大小不要超过1000KB</p>
                        <p>* 建议尺寸<span style={{ color: '#379FF1' }}>750*666</span></p>
                        <p>* 支持JPG、PNG、GIF图片文件</p>
                    </div>
                </div> */}
                <h4 style={{ marginBottom: 30 }}>分享按钮</h4>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30, position: 'relative' }}>
                    <div style={{ width: 130, textAlign: 'right', marginRight: 20 }}>按钮文案</div>
                    <Input value={shareBtnText} onChange={e => {
                        if(e.target.value) {
                            if(e.target.value.length) {
                                return
                            }
                        }
                        onChange({key: ['shareBtnText'], value: e.target.value})
                    }} style={{ width: 300 }} />
                    <span style={{ position: 'absolute', left: 415, top: 6 }}>{shareBtnText.length}/10</span>
                </div>
                <div className={style.colorPickersWrapper} style={{ alignItems: 'center', width: 700 }}>
                    <div style={{ width: 130, textAlign: 'right', marginRight: 20 }}>文字及按钮颜色</div>
                    <div className={style.inlineRow} style={{ border: '1px solid #e9e9e9', padding: '11px 20px', borderRadius: 5 }}>
                        <span>按钮底色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={shareBtnColor}
                                onChange={({ color }) => onChange({ key: ['shareBtnColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                        <span>文字颜色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={shareTextColor}
                                onChange={({ color }) => onChange({ key: ['shareTextColor'], value: color })}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        const { intl } = this.props;
        const k636f5ys = intl.formatMessage(SALE_STRING.k636f5ys);
        const k636p01c = intl.formatMessage(SALE_STRING.k636p01c);
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                <Tabs
                    activeKey={this.state.tabKey}
                    onTabClick={(tabKey) => this.setState({tabKey})}
                    className={style.customTabWrapper}
                    tabBarExtraContent={
                        <div
                            style={{
                                position: 'absolute',
                                right: 50,
                                top: 10,
                                zIndex: 10,
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={this.props.onReset}
                            >
                                {SALE_LABEL.k636f5qg}
                            </Button>
                        </div>

                    }
                >
                        <TabPane tab={k636f5ys} key="1">
                            {this.renderIMGSettingPanel()}
                        </TabPane>
                        <TabPane tab={'分享弹窗'} key="3">
                            {this.renderShareModal()}
                        </TabPane>
                        <TabPane tab={k636p01c} key="2">
                            {this.renderColorSettingPanel()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
