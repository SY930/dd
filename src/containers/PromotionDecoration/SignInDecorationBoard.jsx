import React, { Component } from 'react';
import style from './style.less';
import ColorSettingBlock from './ColorSettingBlock'
import DecorationUploader from './DecorationUploader';
import {
    iphone,
    lotteryBtn,
    lotteryExample,
    lotteryMain,
    lotteryWheel,
    phoneTop,
} from './assets';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';
import ButtonSettingBlockMultiple from './ButtonSettingBlockMultiple'



@injectIntl()
export default class SignInDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#EDEDED',
                bgImg = "http://res.hualala.com/basicdoc/d855f874-1a0c-47b7-95af-87a8a763e95f.png",
                btnBgColor = 'linear-gradient(#FFDF88,#FFBB50)',
                btnColor = '#6F2800',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    {SALE_LABEL.k635s5a1}
                </div>
                <div className={style.typeTitle}>
                     每日签到
                </div>
                <img src={iphone} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor }} className={style.scrollArea}>
                    <img style={{width: '100%'}} src={bgImg}/>
                    <div style={styles.actRule}>
                        活动规则
                    </div>
                    <div style={styles.point}><div style={styles.pointText}>已获得积分 </div> <div style={styles.pointNum}>999</div></div>
                    <img style={styles.award} src="http://res.hualala.com/basicdoc/5327725a-f5e6-46d9-87d7-0e5942cc52d0.png"/>
                    <div style={{...styles.btn,background: btnBgColor,color: btnColor}}>立即签到</div>
                    <img style={styles.calendar} src="http://res.hualala.com/basicdoc/4c2b7def-a7d6-4121-b5b5-0aa44217087e.png"/>
                </div>
            </div>
        )
    }
    handleLinearGradientChange = (color1, color2) => {
        this.props.onChange({ key: ['btnBgColor'], value: `linear-gradient(${color1},${color2})` })
    }

    renderSettingPanel() {
        const {
            decorationInfo: {
                bgColor = '#EDEDED',
                bgImg,
                btnBgColor = 'linear-gradient(#FFDF88,#FFBB50)',
                btnColor = '#6F2800',
            },
            onChange,
        } = this.props;
        const [, color1, color2] = /\((.+),(.+)\)/.exec(btnBgColor);
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
        <div className={style.label}>{SALE_LABEL.k636p1no}</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({key: ['bgColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
        <div style={{ top: 30 }} className={style.label}>{SALE_LABEL.k6346c3s}</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({key: ['bgImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* {SALE_LABEL.k6346ckg}1000KB</p>
                            <p>* {SALE_LABEL.k6346css}750x252</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <ButtonSettingBlockMultiple
                            btnColor={btnColor}
                            btnBgColor={btnBgColor}
                            onChange={v => {
                                for (const key in v) {
                                    onChange({key: [key], value: v[key]})
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


var styles = {
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
        alignItems: 'center'
    },
    pointText: {
        fontSize: '12px',
        transform: 'scale(0.8)'
    },
    pointNum: {
        fontSize: '20px',
        left: '14px',
        top: '80px'
    },
    award: {
        width: '90%',
        display: 'inherit',
        margin: '0 auto',
        marginTop: '-36px'
    },
    btn: {
        width: '150px',
        height: '30px',
        borderRadius:'9px',
        // boxShadow:'0px 2px 5px 0px rgba(231,156,31,0.5)',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // background:'linear-gradient(#FFDF88, #FFBB50',
        position: 'relative',
        transform: 'translateX(-50%)',
        marginLeft: '50%',
        top: '-40px',
    },
    calendar: {
        width: '90%',
        margin: '0 auto',
        display: 'inherit',
    }

}
