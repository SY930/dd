import React, { Component } from 'react';
import ColoredButton from './ColoredButton';
import style from './buttonSettingBlock.less';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';

const DEFAULT_COLOR_THEME = [
    {
        label: '柠檬黄',
        buttonBgColor: '#FFC455',
        buttonColor: '#AD0701',
    },
    {
        label: '大红色',
        buttonBgColor: '#D14C41',
        buttonColor: '#FFFFFF',
    },
    {
        label: '琥珀色',
        buttonBgColor: '#A47E48',
        buttonColor: '#FFFFFF',
    },
]

export default class ButtonSettingBlock extends Component {
    render() {
        const {
            buttonBgColor,
            buttonColor,
            onChange,
        } = this.props;
        return (
            <div>
                <div className={style.defaultRowWrapper}>
                    {
                        DEFAULT_COLOR_THEME.map(item => (
                            <ColoredButton
                                isSelected={buttonColor === item.buttonColor && item.buttonBgColor === buttonBgColor}
                                label={item.label}
                                buttonBgColor={item.buttonBgColor}
                                buttonColor={item.buttonColor}
                                onChange={(v) => onChange(v)}
                            />
                        ))
                    }
                </div>
                <div className={style.subTitle}>
                    自定义样式
                </div>
                <div className={style.colorPickerWrapper}>
                    <span>按钮底色</span>
                    <div className={style.borderWrapper}>
                        <WrappedColorPicker
                            alpha={100}
                            color={buttonBgColor}
                            onChange={({ color: buttonBgColor }) => onChange({ buttonBgColor })}
                            placement="topLeft"
                        />
                    </div>
                    
                    <span>文字颜色</span>
                    <div className={style.borderWrapper}>
                        <WrappedColorPicker
                            alpha={100}
                            color={buttonColor}
                            onChange={({ color: buttonColor }) => onChange({ buttonColor })}
                            placement="topLeft"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
