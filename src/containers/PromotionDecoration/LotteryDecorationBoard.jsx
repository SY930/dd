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

export default class LotteryDecorationBoard extends Component {

    renderPhonePreview() {
        const {
            decorationInfo: {
                bgColor = '#FCDD9B',
                bgImg,
                btnBgColor = 'linear-gradient(#FAE300,#F8C100)',
                btColor = '#7A320F',
            },
        } = this.props;
        return (
            <div className={style.previewArea}>
                <div className={style.scrollTip}>
                    滚动鼠标查看活动
                </div>
                <div className={style.typeTitle}>
                    摇奖活动
                </div>
                <img src={iphone} alt=""/>
                <img className={style.fakeHeader} src={phoneTop} alt=""/>
                <div style={{ background: bgColor, paddingTop: 80 }} className={style.scrollArea}>
                    <img style={{ width: '100%', position: 'absolute', top: 0 }} src={bgImg || lotteryMain} alt=""/>
                    <img style={{ width: '90%', margin: '0 5%', position: 'relative', zIndex: 10 }} src={lotteryWheel} alt=""/>
                    {/* 大按钮 */}
                    <div
                        className={style.lotteryLargeBtn}
                        style={{
                            zIndex: 11,
                            background: btnBgColor,
                        }}
                    >
                        {/* 点击抽奖文字 */}
                        <svg width="180.656" height="194" viewBox="0 0 180.656 194">
                            <path fill={btColor} fillRule="evenodd" id="点击_抽奖" data-name="点击 抽奖" d="M123.542,150.795H191.4V117.568H161.84v-7h36.637V99.556H161.84V92.211H149.424v25.357H123.542v33.227Zm55.087-10.667H136.308V128.236h42.321v11.892Zm0.524,16.963q4.46,9.006,9.706,20.9l10.93-4.285q-4.635-10.581-10.143-20.985Zm-65.492,16.7,10.231,5.421q6.645-12.067,10.842-21.248l-10.755-4.547q-4.285,9.707-10.318,20.374h0Zm45.119-16.351q3.759,8.917,7,18.449l11.455-3.5q-3.849-9.88-7.695-18.363Zm-20.811.437q2.623,7.082,6.209,18.712l11.367-2.886q-2.536-7.958-6.646-18.8Zm148.315,20.2V144.325H273.867v17.837h-16.7v-23.7h36.375V126.749H257.166v-10.58h31.741V104.452H257.166V92.124H244.4v12.328H213.01v11.717H244.4v10.58H207.938v11.717H244.4v23.7H227.874V144.325H215.458V173.7h58.409v4.372h12.417ZM156.244,285.7v-4.547h29.03v4.372h11.367V215.745H176.618V199.656H164.813v16.089H144.877V285.7h11.367Zm29.03-43.02h-8.656V226.238h8.656v16.438Zm-29.03-16.438h8.569v16.438h-8.569V226.238Zm20.374,26.931h8.656v17.488h-8.656V253.169Zm-20.374,0h8.569v17.488h-8.569V253.169Zm-42.32-27.019h9.443v15.433q-5.028.787-9.881,1.443l0.7,12.416,9.181-1.923v17.138q0,3.41-2.711,3.41h-6.47q1.4,6.033,2.186,11.192,11.979,0.174,15.127-2.142t3.148-8.788v-23l8.132-1.487q-0.525-7.606-.525-11.542l-7.607,1.4V226.15h7.869V215.22h-7.869V199.656h-11.28V215.22h-9.443v10.93Zm134.324,3.76A97.468,97.468,0,0,0,258,218.018h22.428a32.734,32.734,0,0,1-8.875,10.187q-6.3-5.421-10.361-8.525l-7,6.82q4.239,3.279,8.569,7.214a90.48,90.48,0,0,1-13.379,5.465q1.793,2.229,3.192,4.2h-6.165a36.859,36.859,0,0,1-1.836,8.744H208.813v10.317H238.28q-8.4,8.832-30.866,11.805,2.36,5.857,4.2,11.8,26.843-4.459,38.429-19.543,11.543,17.051,38.167,19.63,3.847-8.83,5.946-12.591-24.221-1.485-33.27-11.1H293.1V252.12H257.035q0.568-1.968,1.006-4.066,26.406-9.444,34.1-30.735V208.75h-28.2q2.142-3.629,4.153-7.607l-11.367-2.186a75.084,75.084,0,0,1-16.089,23.608q4.46,4.023,7.608,7.345h0ZM228.4,236.381v12.941h11.28V199.481H228.4v15.7q-8.613-7.957-12.5-11.324l-6.908,6.471q4.809,4.633,12.067,12.241l7.345-7.082v9.093q-9.094,3.8-20.636,7.87l3.585,11.279q8.044-3.715,17.051-7.344h0Z" transform="translate(-113.5 -92.125)"/>
                        </svg>
                        <img src={lotteryBtn} alt=""/>
                    </div>
                    <img style={{ width: '90%', margin: '15px 5%', position: 'relative', zIndex: 10 }} src={lotteryExample} alt=""/>                       
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
                bgColor = '#FCDD9B',
                bgImg,
                btnBgColor = 'linear-gradient(#F8C100,#FAE300)',
                btColor = '#7A320F',
            },
            onChange,
        } = this.props;
        const [, color1, color2] = /\((.+),(.+)\)/.exec(btnBgColor);
        return (
            <div style={{ paddingTop: 35 }}>
                <div className={style.sectionWrapper}>
                    <div className={style.label}>活动背景色</div>
                    <ColorSettingBlock value={bgColor} onChange={(value) => onChange({key: ['bgColor'], value})} />
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 30 }} className={style.label}>活动主图</div>
                    <div style={{ width: 350 }} className={style.uploaderWrapper}>
                        <DecorationUploader
                            limit={0}
                            value={bgImg}
                            onChange={value => onChange({key: ['bgImg'], value})}
                        />
                        <div className={style.uploaderTip}>
                            <p>* 图片大小不要超过1000KB</p>
                            <p>* 建议尺寸750x666像素</p>
                            <p>* 支持JPG、PNG、GIF图片文件</p>
                        </div>
                    </div>
                </div>
                <div className={style.sectionWrapper}>
                    <div style={{ top: 5 }} className={style.label}>按钮样式</div>
                    <div className={style.inlineRow}>
                        <span>按钮底色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={color1}
                                onChange={({ color }) => this.handleLinearGradientChange(color, color2)}
                                placement="topLeft"
                            />
                            <WrappedColorPicker
                                alpha={100}
                                color={color2}
                                onChange={({ color }) => this.handleLinearGradientChange(color1, color)}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }} className={style.inlineRow}>
                        <span>文字颜色</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btColor}
                                onChange={({ color }) => onChange({key: ['btColor'], value: color})}
                                placement="topLeft"
                            />
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
