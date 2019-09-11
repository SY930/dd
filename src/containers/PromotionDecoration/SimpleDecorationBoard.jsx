import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import CropperUploader from '../../components/common/CropperUploader'

export default class SimpleDecorationBoard extends Component {

    renderPhonePreview() {
        return (
            <div style={{ width: 400, marginRight: 30, background: 'orange' }}>

            </div>
        )
    }
    renderSettingPanel() {
        return (
            <div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 45 }} className={style.label}>弹窗背景色</div>
                    <ColorSettingBlock value={'#000000'} onChange={(v) => console.log(v)} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <CropperUploader
                            limit={0}
                            cropperRatio={1}
                            allowedType={['image/png', 'image/jpeg']}
                            onChange={url => this.setState({cartImg: url})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片比例1:1，建议尺寸180x180像素</p>
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
