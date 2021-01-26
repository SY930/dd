import React, { Component } from 'react';
import { Tabs, Button, Icon } from 'antd';
import CropperUploader from 'components/common/CropperUploader'
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
import { injectIntl } from './IntlDecor';


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
                endColor = '#e25049',
                enterColor = '#e25049'
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={iphone} alt="" />
                {
                    tabKey === '2' ? (
                        <div className={style.simpleDisplayBlock}>
                            <div className={style.imgWrapper}>
                                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                    <img src={endImg} style={{ width: '100%' }} alt="" />
                                </div>
                                <div className={style.tagWrapper}>
                                    <img src={tagImg} alt="" />
                                    <span>活动主图</span>
                                </div>
                            </div>
                            <div style={{ background: endColor }} className={style.bgWrapper}>
                                <img src={giftExample} alt="" />
                                <img src={giftExample} alt="" />
                                <img src={giftExample} alt="" />
                            </div>
                            <Icon className={style.closeBtn} type="close-circle-o" />
                        </div>
                    ) : (
                            <div className={style.simpleDisplayBlock} style={{ top: 124 }}>
                                <div className={style.tagWrapper} style={{top: '20%'}}>
                                    <img src={tagImg} alt="" />
                                    <span>活动主图</span>
                                </div>
                                <div style={{ width: '100%', overflow: 'hidden' }}>
                                    <img src={enterImg} style={{ width: '100%' }} alt="" />
                                </div>
                                <div style={{ background: enterColor }} className={style.bgWrapper}>
                                    <img src={giftExample} alt="" />
                                    <img src={giftExample} alt="" />
                                    <img src={giftExample} alt="" />
                                </div>
                                <Icon className={style.closeBtn} type="close-circle-o" style={{ bottom: -109}}/>
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
                endColor = '#e25049',
            },
            onChange,
        } = this.props;
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 500 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            isAbsoluteUrl={true}
                            limit={1000}
                            value={endImg}
                            cropperRatio={920 / 360}
                            width={245}
                            onChange={value => onChange({ key: ['endImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}920x360</p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>{SALE_LABEL.k6346cc4}</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({ key: ['endColor'], value })} />
                </div>
                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({ tabKey: '1' })}>{SALE_LABEL.k635s2yp}</Button>
            </div>

        )
    }
    render() {
        const {
            decorationInfo: {
                enterImg,
                enterColor = '#e25049',
            },
            onChange,
        } = this.props;
        const { intl } = this.props;
        const k635s3fd = intl.formatMessage(SALE_STRING.k635s3fd);
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                    <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({ tabKey })} className={style.customTabWrapper}>
                        <TabPane tab={'领取前'} key="1">
                            <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
                                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <CropperUploader
                                            isAbsoluteUrl={true}
                                            cropperRatio={920 / 550}
                                            limit={1000}
                                            width={160}
                                            value={enterImg}
                                            onChange={value => onChange({ key: ['enterImg'], value })}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                                            <p>* {SALE_LABEL.k6346css}920x550像素</p>
                                            <p>* {SALE_LABEL.k6346d14}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.sectionWrapper}>
                                    <div className={style.label}>{SALE_LABEL.k6346cc4}</div>
                                    <ColorSettingBlock value={enterColor} onChange={(value) => onChange({ key: ['enterColor'], value })} />
                                </div>
                                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({ tabKey: '2' })}>{SALE_LABEL.k635s371}</Button>
                            </div>
                        </TabPane>
                        <TabPane tab={'领取后'} key="2">
                            {this.renderPageOneSettingPanel()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
