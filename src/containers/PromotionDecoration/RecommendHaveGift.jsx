import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    phoneTop,
} from './assets';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import ButtonSettingBlockMultiple from './ButtonSettingBlockMultiple'

const baseUrl = 'http://res.hualala.com/basicdoc'


export default class RecommendHaveGift extends Component {
    handleLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }
    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#FBB335',
                bgImg = `${baseUrl}/364c0698-6252-42c1-b54e-fbabfc162c08.png`,
                btnBgColor = 'linear-gradient(#FF4803,#FF7735)',
                btnColor = '#EBEBEB',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.typeTitle}>
                    推荐有礼
                </div>
                <img src={iphone} alt="" />
                <img className={style.fakeHeader} src={phoneTop} alt="" />
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{ width: '100%' }} src={bgImg} alt="" />
                    <div style={styles.tip}>每邀请一位新用户储值后可返还</div>
                    <img style={styles.award} src={`${baseUrl}/641e20de-c148-4f43-b51c-457273118466.png`} alt="" />
                    <div style={{ ...styles.btn, background: btnBgColor, color: btnColor }}>立即邀请</div>
                    <div style={{ ...styles.btn, ...styles.faceBtn }}>面对面邀请</div>
                </div>
            </div>
        )
    }
    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#FBB335',
                bgImg,
                btnBgColor = 'linear-gradient(#FF4803,#FF7735)',
                btnColor = '#EBEBEB',
            },
            onChange,
        } = this.props;

        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({ key: ['bgImg'], value })}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 建议图片尺寸 1080x716像素</p>
                            <p>* 不大于1000KB</p>
                            <p>* 支持png、jpg</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>主题颜色</div>
                    <ColorSettingBlock title="请选取一个你喜欢的颜色" value={bgColor} onChange={value => onChange({ key: ['bgColor'], value })} />
                </div>

                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <ButtonSettingBlockMultiple
                        btnColor={btnColor}
                        btnBgColor={btnBgColor}
                        onChange={(v) => {
                            for (const key in v) {
                                onChange({ key: [key], value: v[key] })
                            }
                        }}
                        handleLinearGradientChange={this.handleLinearGradientChange}
                    />

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


const styles = {
    actRule: {
        width: '65px',
        height: '24px',
        color: '#FFFFFF',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#F15F22',
        position: 'absolute',
        borderRadius: '19px 0px 0px 19px',
        top: '16px',
        right: 0,
    },
    point: {
        color: '#fff',
        position: 'absolute',
        top: '26px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    pointText: {
        fontSize: '12px',
        transform: 'scale(0.8)',
    },
    pointNum: {
        fontSize: '20px',
        left: '14px',
        top: '80px',
    },
    award: {
        width: '90%',
        display: 'inherit',
        margin: '0 auto',
        marginTop: '14px',
    },
    tip: {
        width: '190px',
        height: '20px',
        margin: '0 auto',
        borderRadius: '10px',
        marginTop: '-6px',
        background: '#fff',
        color: '#E57734',
        position: 'relative',
        zIndex: '9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: '230px',
        height: '30px',
        borderRadius: '15',
        // boxShadow:'0px 2px 5px 0px rgba(231,156,31,0.5)',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // background:'linear-gradient(#FFDF88, #FFBB50',
        position: 'relative',
        transform: 'translateX(-50%)',
        marginLeft: '50%',
        top: '16px',
    },
    faceBtn: {
        border: '1px solid #F7720B',
        color: '#F7720B',
        top: '32px',
    },

}
