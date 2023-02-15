import React, { Component } from 'react';
import { Switch } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    phoneTop,
    btnBg,
} from './assets';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';

const bgImg = 'http://res.hualala.com/basicdoc/8a484f97-712a-4ee2-9477-5a0184ce0aef.png'
const titleImg = 'http://res.hualala.com/basicdoc/f5000903-82e4-435c-a7cf-749d1093ef76.png'
const bottomImg = 'http://res.hualala.com/basicdoc/decbe584-8541-40b7-8edd-be9b2b1d569b.png'
const btnBgImg = 'http://res.hualala.com/basicdoc/fdb7b682-6adb-4322-a44f-aa4a35f13a2b.png'
const alreadyBtnBgImg = 'http://res.hualala.com/basicdoc/c0588025-620f-4fb7-bfa5-ba805f3a66fc.png'

@injectIntl()
export default class H5GiftDecorationBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            couponList: [
                {
                    title: '15元代金券',
                    price: '15',
                    city: '怀化',
                    date: '2020-05-30至06-01',
                    isGet: false
                },
                {
                    title: '8元迷你鸭脖兑换券',
                    price: '8',
                    city: '湖北',
                    date: '2020-05-30至06-01',
                    isGet: true
                },
                {
                    title: '6.5元芒果干抵扣券',
                    price: '6.5',
                    city: '北京',
                    date: '2020-06-01至06-30',
                    isGet: false
                },
                {
                    title: '5元蟹黄蚕豆抵扣券',
                    price: '5',
                    city: '湖北',
                    date: '2020-05-30至06-01',
                    isGet: true
                },
            ]
        }
    }

    renderPhonePreview() {
        const {
            decorationInfo: {
                activityTheme,
                btnTextColor = '#fff',
                btnActiveImg,
                alreadyBtnTextColor = '#fff',
                alreadyBtnActiveImg,
                bottomBgImg
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                    周黑鸭-领券中心
                </div>
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />

                <div style={{ background: `url(${activityTheme || bgImg}) no-repeat center /100% 100%` }} className={style.scrollArea}>
                    <div className={style.couponContainer}>
                        {this.state.couponList.map(item => (
                           <div className={style.couponWrap}>
                                <div className={style.couponTop}>
                                    <div className={style.couponTitle}>
                                        <img src={titleImg} alt="" />
                                    </div>
                                    <div className={style.couponContent}>
                                        <div className={style.couponT}>
                                            <div className={style.couponL}>
                                                <div style={{ fontWeight: 'bold', margin: '3px 0', marginBottom: '8px' }}>{item.title}</div>
                                                <div>
                                                    {/* <span className={style.couponReduce}>减</span> */}
                                                    <span style={{ color: '#FF6D2D' }}>¥{item.price}</span>
                                                </div>
                                            </div>
                                            <div className={style.couponR}>
                                                {!item.isGet && <div className={style.couponGet} style={{ background: `url(${btnActiveImg || btnBgImg}) no-repeat center /100% 100%`, color: btnTextColor }}>立即领取</div>}
                                                {item.isGet && <div className={style.couponGet} style={{ background: `url(${alreadyBtnActiveImg || alreadyBtnBgImg}) no-repeat center /100% 100%`, color: alreadyBtnTextColor }}>已领取</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.couponContentB}>
                                    <div className={style.couponTime}>
                                        有效期:{item.date}
                                    </div>
                                    <div>{item.city}专用</div>
                                </div>
                            </div> 
                        ))}
                    </div>
                    <div style={{ background: `url(${bottomBgImg || bottomImg}) no-repeat center /100% 100%` }} className={style.couponBottom}>
                         关闭页面后，可进入周黑鸭微信公众号底部菜单“会员中心”-“会员领券”打开次页面。
                    </div>
                </div>
            </div>
        )
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                activityTheme,
                btnTextColor = '#fff',
                btnActiveImg,
                alreadyBtnTextColor = '#fff',
                alreadyBtnActiveImg,
                bottomBgImg
            },
            onChange,
        } = this.props;
        return (
            <div className={style.h5GiftDecorationWrap} style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={activityTheme}
                            onChange={value => onChange({ key: ['activityTheme'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750x564像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>

                <div className={style.title}>领取按钮样式</div>

                <div className={style.sectionWrapper} style={{ left: '50px' }}>
                    <div style={{ top: 30 }} className={style.label}>背景图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={btnActiveImg}
                            onChange={value => onChange({ key: ['btnActiveImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750x564像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>

                <div className={style.sectionWrapper} style={{ left: '50px' }}>
                    <div className={style.label}>按钮文字颜色</div>
                    <div className={style.borderedColorWrapper}>
                        <WrappedColorPicker
                            alpha={100}
                            color={btnTextColor}
                            onChange={({ color }) => {
                                onChange({ key: ['btnTextColor'], value: color });
                            }}
                            placement="topLeft"
                        />
                    </div>
                </div>

                <div className={style.title}>已领取按钮样式</div>

                <div className={style.sectionWrapper} style={{ left: '50px' }}>
                    <div style={{ top: 30 }} className={style.label}>背景图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={alreadyBtnActiveImg}
                            onChange={value => onChange({ key: ['alreadyBtnActiveImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750x564像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
                        </div>
                    </div>
                </div>

                <div className={style.sectionWrapper} style={{ left: '50px' }}>
                    <div className={style.label}>按钮文字颜色</div>
                    <div className={style.borderedColorWrapper}>
                        <WrappedColorPicker
                            alpha={100}
                            color={alreadyBtnTextColor}
                            onChange={({ color }) => {
                                onChange({ key: ['alreadyBtnTextColor'], value: color });
                            }}
                            placement="topLeft"
                        />
                    </div>
                </div>

                <div className={style.title}>底部提示</div>

                <div className={style.sectionWrapper} style={{ left: '50px' }}>
                    <div style={{ top: 30 }} className={style.label}>背景图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bottomBgImg}
                            onChange={value => onChange({ key: ['bottomBgImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片建议尺寸750x564像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg、jpeg、gif</p>
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
                <div className={style.freeGiftTab} style={{ margin: '20px 0 0 40px' }}>
                    {this.renderSettingPanel()}
                </div>

            </div>
        )
    }
}
