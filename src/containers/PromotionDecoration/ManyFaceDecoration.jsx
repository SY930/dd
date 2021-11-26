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
export default class ManyFaceDecoration extends Component {

    state = {
        tabKey: '1',
    }

    renderPhonePreview() {
        const { tabKey } = this.state;
        const {
            decorationInfo: {
                enterImg = defaultEnterImg,
                endImg = defaultEndImg,
                endColor = '#FF5752',
                enterColor = '#EA0327'
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={iphone} alt="" />

                <div className={style.simpleDisplayBlock}>
                    <div className={style.imgWrapper} style={{ height: '100%'}}>
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <img src={endImg} style={{ width: '100%', height: '100%' }} alt="" />
                        </div>
                        <div className={style.tagWrapper}>
                            <img src={tagImg} alt="" />
                            <span>活动主图</span>
                        </div>
                    </div>
                    {/* <div style={{ background: endColor }} className={style.bgWrapper}>
                        <img src={giftExample} alt="" />
                        <img src={giftExample} alt="" />
                        <img src={giftExample} alt="" />
                    </div> */}
                    <Icon className={style.closeBtn} type="close-circle-o" />
                </div>
            </div>
        )
    }
    render() {
        const {
            decorationInfo: {
                enterImg,
                enterColor = '#EA0327',
            },
            faceArr,
            onChange,
        } = this.props;
        return (
            <div className={style.boardWrapper}>
                {this.renderPhonePreview()}
                <div>
                    <Tabs activeKey={this.state.tabKey} onTabClick={(tabKey) => this.setState({ tabKey })} className={style.customTabWrapper}>
                        <TabPane tab={'点餐页弹窗海报图'} key="1">
                            <div style={{ paddingTop: 45 }}>
                                {/* <div className={style.sectionWrapper}>
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
                                            <p>* {SALE_LABEL.k6346css}920x1346像素</p>
                                            <p>* 支持JPG、PNG图片文件</p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </TabPane>
                        {/* <TabPane tab={'领取后'} key="2">
                            {this.renderPageOneSettingPanel()}
                        </TabPane> */}
                    </Tabs>
                </div>
            </div>
        )
    }
}
