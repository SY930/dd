import React, { Component } from 'react';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import style from './style.less';

const DEFAULT_SKIN_COLORS = [
    {
        skinColor: '#51a97d',
        skinColorName: '翡翠绿',
    },
    {
        skinColor: '#feae1b',
        skinColorName: '柠檬黄',
    },
    {
        skinColor: '#fd6631',
        skinColorName: '橘红色',
    },
    {
        skinColor: '#ac7e4f',
        skinColorName: '琥珀色',
    },
    {
        skinColor: '#49a3f8',
        skinColorName: '天空蓝',
    },
    {
        skinColor: '#e25049',
        skinColorName: '大红色',
    },
];


export default class ColorSettingBlock extends Component {
    render() {
        const { value: color, onChange } = this.props;
        const isCustomColor = !DEFAULT_SKIN_COLORS.map(item => item.skinColor).includes(color);
        return (
            <div className={style.colorPickersContainer}>
                <div className={style.colorPickersTip}>
                    请选择您喜欢的颜色或者自定义颜色
                </div>
                <div className={style.colorPickersWrapper}>
                    {
                        DEFAULT_SKIN_COLORS.map(({skinColor, skinColorName}) => (
                            <div
                                key={skinColor}
                                className={style.colorPickerWrapper}
                            >
                                <div
                                    className={`${style.colorBlockWrapper} ${skinColor === color ? style.isSelected : ''}`}
                                    onClick={() => onChange(skinColor)}
                                >
                                    <div className={style.fakePadding}>
                                        <div className={style.colorBlock} style={{ background: skinColor }} />
                                    </div>
                                </div>
                                <div className={style.labelBlock}>
                                    {skinColorName}
                                </div>
                            </div>
                        ))
                    }
                    <div
                        className={style.colorPickerWrapper}
                    >
                        <div
                            className={`${style.colorBlockWrapper} ${isCustomColor ? style.isSelected : ''}`}
                        >
                            <div className={style.fakePadding}>
                                <WrappedColorPicker
                                    alpha={100}
                                    color={isCustomColor ? color : '#DCDCDC'}
                                    onChange={({color: skinColor}) => onChange(skinColor)}
                                    placement="bottomRight"
                                />
                            </div>
                        </div>
                        <div className={style.labelBlock}>
                            自定义颜色
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
