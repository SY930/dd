import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    giftExample,
    recommend1 as defaultEnterImg,
    recommend2 as defaultEndImg,
} from './assets';
import tagImg from './assets/tag.svg'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';


const { TabPane } = Tabs;
@injectIntl()
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
                <img src={iphone} alt=""/>
                {
                    tabKey === '2' ? (
                        <div className={style.simpleDisplayBlock}>
                            <div className={style.imgWrapper}>
                                <div style={{ width: '100%', height: '100%',  overflow: 'hidden' }}>
                                    <img src={endImg} style={{ width: '100%' }} alt=""/>
                                </div>
                                <div className={style.tagWrapper}>
                                    <img src={tagImg} alt=""/>
                                    <span>{SALE_LABEL.k6346c3s}</span>
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
                                <span>{SALE_LABEL.k6346c3s}</span>
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
                    <div className={style.label}>{SALE_LABEL.k6346cc4}</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({key: ['endColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={1000}
                            value={endImg}
                            onChange={value => onChange({key: ['endImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}920x360</p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
        <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '1'})}>{SALE_LABEL.k635s2yp}</Button>
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
        const { intl } = this.props;
        const k635s3fd = intl.formatMessage(SALE_STRING.k635s3fd);
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({tabKey})} className={style.customTabWrapper}>
                        <TabPane tab={k635s3fd + '1'} key="1">
                            <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
        <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <DecorationUploader
                                            limit={1000}
                                            value={enterImg}
                                            onChange={value => onChange({key: ['enterImg'], value})}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                                            <p>* {SALE_LABEL.k6346css}920x1346像素</p>
                                            <p>* {SALE_LABEL.k6346d14}</p>
                                        </div>
                                    </div>
                                </div>
        <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '2'})}>{SALE_LABEL.k635s371}</Button>
                            </div>
                        </TabPane>
                        <TabPane tab={k635s3fd + '2'} key="2">
                            {this.renderPageOneSettingPanel()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
