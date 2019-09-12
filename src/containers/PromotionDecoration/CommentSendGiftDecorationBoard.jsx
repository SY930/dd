import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import CropperUploader from '../../components/common/CropperUploader'

const { TabPane } = Tabs;

export default class CommentSendGiftDecorationBoard extends Component {

    state = {
        tabKey: '1',
    }

    renderPhonePreview() {
        return (
            <div style={{ width: 400, marginRight: 30, background: 'orange' }}>

            </div>
        )
    }
    renderPageOneSettingPanel() {
        const {
            decorationInfo: {
                endImg,
                endColor = '#ac7e4f',
            },
            onChange,
        } = this.props;
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 45 }} className={style.label}>弹窗背景色</div>
                    <ColorSettingBlock value={endColor} onChange={(value) => onChange({key: ['endColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            limit={0}
                            cropperRatio={92/36}
                            allowedType={['image/png', 'image/jpeg']}
                            onChange={url => onChange({key: ['endImg'], value: `http://res.hualala.com/${url}`})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG图片文件</p>
                        </div>
                    </div>
                </div>
                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '2'})}>下一页</Button>
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
                            {this.renderPageOneSettingPanel()}
                        </TabPane>
                        <TabPane tab="页面2" key="2">
                            <div style={{ paddingTop: 45 }}>
                                <div className={style.sectionWrapper}>
                                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                                        <CropperUploader
                                            limit={0}
                                            cropperRatio={92/36}
                                            allowedType={['image/png', 'image/jpeg']}
                                            onChange={url => onChange({key: ['enterImg'], value: `http://res.hualala.com/${url}`})}
                                        />
                                        <div className={style.uploaderTip}>
                                            <p>* 建议尺寸920x360像素</p>
                                            <p>* 支持JPG、PNG图片文件</p>
                                        </div>
                                    </div>
                                </div>
                                <Button style={{ marginLeft: 150 }} type="primary" onClick={() => this.setState({tabKey: '1'})}>上一页</Button>
                            </div> 
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
