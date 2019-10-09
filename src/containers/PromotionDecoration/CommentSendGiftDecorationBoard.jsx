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

const { TabPane } = Tabs;

export default class CommentSendGiftDecorationBoard extends Component {

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
                {
                    tabKey === '2' ? (
                        <div className={style.simpleDisplayBlock}>
                            <div className={style.imgWrapper}>
                                <div style={{ width: '100%', height: '100%',  overflow: 'hidden' }}>
                                    <img src={endImg} style={{ width: '100%' }} alt=""/>
                                </div>
                                <div className={style.tagWrapper}>
                                    <img src={tagImg} alt=""/>
                                    <span>活动主图</span>
                                </div>
                            </div>
                            <div style={{ background: endColor }} className={style.bgWrapper}>
                                <img src={giftExample} alt="" />
                                <img src={giftExample} alt="" />
                                <img src={giftExample} alt="" />
                            </div>
                            <Icon className={style.closeBtn}  type="close-circle-o" />
                        </div>
                    ) : (
                        <div className={style.simpleDisplayBlock}>
                            <div className={style.tagWrapper}>
                                <img src={tagImg} alt=""/>
                                <span>活动主图</span>
                            </div>
                            <div style={{ borderRadius: 10, width: '100%', height: '100%', overflow: 'hidden' }}>
                                <img src={enterImg} style={{ width: '100%' }} alt=""/>
                            </div>
                            <Icon className={style.closeBtn}  type="close-circle-o" />
                        </div>
                    )
                }
            </div>
        )
    }
    renderPageOneSettingPanel() {
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
                    <div className={style.label}>弹窗背景色</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({key: ['endColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            onChange={value => onChange({key: ['endImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '1'})}>上一页</Button>
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
                        <TabPane tab="页面1" key="1">
                            <div style={{ paddingTop: 45 }}>
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
                            </div> 
                        </TabPane>
                        <TabPane tab="页面2" key="2">
                            {this.renderPageOneSettingPanel()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
