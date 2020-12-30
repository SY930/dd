import React, { Component } from 'react';
import { Tabs, Button, Icon, Input, Select } from 'antd';
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

const limitType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const fileSize = 1 * 1024 * 1024;
const { TabPane } = Tabs;
const Option = Select.Option;
@injectIntl()
export default class GatherPointsDecorateBoard extends Component {

    state = {
        tabKey: '1',
        numErr: false,
    }

    handleNumChange = (e) => {
        const {
            onChange,
        } = this.props
        console.log('e.target.value', e.target.value)
        onChange({ key: ['pointsNum'], value: e.target.value })
    }

    renderOpts = () => {
        const { needCount } = this.props
        let begin = 2;
        let end = 6;
        if( needCount > 10 && needCount <= 15) {
            begin=3
        }
        if( needCount > 15 ) {
            begin=4
        }
        let children = [];
        for (let i = begin; i < end; i++) {
            children.push(<Option key={i}>{i}</Option>);
        }
        return children
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
                                    <span>活动背景图</span>
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
                            <div className={style.simpleDisplayBlock}>
                                <div className={style.tagWrapper}>
                                    <img src={tagImg} alt="" />
                                    <span>弹窗头图</span>
                                </div>
                                <div style={{ borderRadius: 10, width: '100%', height: '100%', overflow: 'hidden' }}>
                                    <img src={enterImg} style={{ width: '100%' }} alt="" />
                                </div>
                                <Icon className={style.closeBtn} type="close-circle-o" />
                            </div>
                        )
                }
            </div>
        )
    }
    renderPointsPositionPanel() {
        const {
            decorationInfo: {
                pointsNum = '3',
                endColor = '#FF6125',
                pointImg = '',
                pointLightUpImg = ''
            },
            onChange,
        } = this.props;
        const {
            numErr,
        } = this.state
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>集点单行点数</div>
                    <div style={{ width: 100 }} className={style.uploaderWrapper}>
                        <Select
                            value={pointsNum}
                            onChange={this.handleNumChange}
                        >
                            {this.renderOpts()}
                        </Select>
                        {/* {numErr && <span className={style.errorMsg}>请输入0到5的整数</span>} */}
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>集点图自定义</div>
                    <div style={{ width: 500 }} className={style.selfBox}>
                        <div className={style.titleLine}>
                            <div className={style.tabActiveDiv}>
                                基础样式
                            </div>
                        </div>
                        <div className={style.tabPanelDiv}>
                            <p className={style.explainP}>*可设置默认图样、获得点数图片和已兑换礼品图样 </p>
                            <div className={style.dotsArea}>
                                <div className={style.dotArea}>
                                    <div className={style.dotTitle}>集点图样</div>
                                    <div className={style.dotDefine}>
                                        <div className={style.uploadBox}>
                                            <CropperUploader
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                value={pointImg}
                                                cropperRatio={1/1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <Icon style={{
                                                        color: '#999',
                                                        fontSize: 24,
                                                        fontWeight: 'bold',
                                                        position: 'relative',
                                                        top: -20,
                                                    }} type="plus" />
                                                }
                                                onChange={value => onChange({ key: ['pointImg'], value })}
                                            />
                                        </div>
                                        <div className={style.uploadBox}>
                                            <CropperUploader
                                                isAbsoluteUrl={true}
                                                limit={1000}
                                                value={pointLightUpImg}
                                                cropperRatio={1/1}
                                                width={45}
                                                height={45}
                                                selfIcon={
                                                    <Icon style={{
                                                        color: '#999',
                                                        fontSize: 24,
                                                        fontWeight: 'bold',
                                                        position: 'relative',
                                                        top: -20,
                                                    }} type="plus" />
                                                }
                                                onChange={value => onChange({ key: ['pointLightUpImg'], value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div className={style.label}>活动背景色</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({ key: ['endColor'], value })} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动背景图</div>
                    <div style={{ width: 500 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            isAbsoluteUrl={true}
                            limit={1000}
                            value={endImg}
                            cropperRatio={1080 / 1920}
                            width={96}
                            onChange={value => onChange({ key: ['endImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346css}1080*1920</p>
                            <p>* {SALE_LABEL.k6346d14}</p>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                        </div>
                    </div>
                </div>
                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({ tabKey: '1' })}>{SALE_LABEL.k635s2yp}</Button>
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
                    <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({ tabKey })} className={style.customTabWrapper}>
                        <TabPane tab='集点配置' key='1'>
                            {this.renderPointsPositionPanel()}
                        </TabPane>
                        <TabPane tab='活动皮肤装修' key='2'>
                            {this.renderPageOneSettingPanel()}
                        </TabPane>
                        <TabPane tab='弹窗配置' key='3'>
                            <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
                                    <div style={{ top: 30 }} className={style.label}>弹窗头图</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <CropperUploader
                                            isAbsoluteUrl={true}
                                            cropperRatio={1080 / 248}
                                            limit={1000}
                                            value={enterImg}
                                            onChange={value => onChange({ key: ['enterImg'], value })}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* {SALE_LABEL.k6346css}1080*248像素</p>
                                            <p>* {SALE_LABEL.k6346d14}</p>
                                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                                        </div>
                                    </div>
                                </div>
                                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({ tabKey: '2' })}>{SALE_LABEL.k635s371}</Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
