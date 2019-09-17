import React, { Component } from 'react';
import {
    Icon,
} from 'antd';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import CropperUploader from '../../components/common/CropperUploader';
import phoneImg from './assets/iphone.png';
import onlineResGift from './assets/online-res.png'
import giftExample from './assets/gift-example.png'
import tagImg from './assets/tag.svg'

export default class SimpleDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                img = onlineResGift,
                color = '#fd6631',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <img src={phoneImg} alt=""/>
                <div className={style.simpleDisplayBlock}>
                    <div className={style.imgWrapper}>
                        <div className={style.tagWrapper}>
                            <img src={tagImg} alt=""/>
                            <span>活动主图</span>
                        </div>
                        <img src={img} style={{ width: '100%', height: '100%' }} alt=""/>
                    </div>
                    <div style={{ background: color }} className={style.bgWrapper}>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                        <img src={giftExample} alt=""/>
                    </div>
                    <Icon className={style.closeBtn}  type="close-circle-o" />
                </div>
            </div>
        )
    }
    renderSettingPanel() {
        const {
            decorationInfo: {
                img,
                color = '#FF6125',
            },
            onChange,
        } = this.props;
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 45 }} className={style.label}>弹窗背景色</div>
                    <ColorSettingBlock value={color} onChange={(value) => onChange({key: ['color'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            limit={0}
                            cropperRatio={92/36}
                            allowedType={['image/png', 'image/jpeg']}
                            onChange={url => onChange({key: ['img'], value: `http://res.hualala.com/${url}`})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 建议尺寸920x360像素</p>
                            <p>* 支持JPG、PNG图片文件</p>
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
                {this.renderSettingPanel()}
            </div>
        )
    }
}
