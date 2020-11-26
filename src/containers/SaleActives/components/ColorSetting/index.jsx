import React, { Component } from 'react';
import WrappedColorPicker from '../../../../components/common/WrappedColorPicker';
import style from './index.less';


export default class ColorSettingBlock extends Component {
    render() {

        const DEFAULT_SKIN_COLORS = [
            {
                skinColor: '#63B458',
            },
            {
                skinColor: '#2B9F66',
            },
            {
                skinColor: '#519FC8',
            },
            {
                skinColor: '#5785D0',
            },
            {
                skinColor: '#8E60BF',
            },
            {
                skinColor: '#D19A44',
            },
            {
                skinColor: '#E3B137',
            },
            {
                skinColor: '#EF903C',
            },
            {
                skinColor: '#DD654A',
            },
            {
                skinColor: '#CD453D',
            },
        ];
        const { value: color, onChange, title =  '请选择您喜欢的颜色或者自定义颜色' } = this.props;
        const isCustomColor = !DEFAULT_SKIN_COLORS.map(item => item.skinColor).includes(color);
        return (
            <div className={style.colorPickersContainer}>
                <div className={style.colorPickersTip}>
                    {title}
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
                                {/* <div className={style.labelBlock}>
                                    {skinColorName}
                                </div> */}
                            </div>
                        ))
                    }
                    {/* <div
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
                    </div> */}
                </div>
            </div>
        )
    }
}
