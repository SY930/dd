import React, { Component } from 'react';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import style from './style.less';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class ColorSettingBlock extends Component {
    render() {
        const { intl } = this.props;
        const k63469k3 = intl.formatMessage(SALE_STRING.k63469k3);
        const k63469sf = intl.formatMessage(SALE_STRING.k63469sf);
        const k6346a0r = intl.formatMessage(SALE_STRING.k6346a0r);
        const k6346a93 = intl.formatMessage(SALE_STRING.k6346a93);
        const k6346ahf = intl.formatMessage(SALE_STRING.k6346ahf);
        const k6346apr = intl.formatMessage(SALE_STRING.k6346apr);
        const DEFAULT_SKIN_COLORS = [
            {
                skinColor: '#51a97d',
                skinColorName: k6346a93,
            },
            {
                skinColor: '#feae1b',
                skinColorName: k63469k3,
            },
            {
                skinColor: '#fd6631',
                skinColorName: k6346ahf,
            },
            {
                skinColor: '#ac7e4f',
                skinColorName: k6346a0r,
            },
            {
                skinColor: '#49a3f8',
                skinColorName: k6346apr,
            },
            {
                skinColor: '#e25049',
                skinColorName: k63469sf,
            },
        ];
        const { value: color, onChange, title = SALE_LABEL.k6346ay4 } = this.props;
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
                            {SALE_LABEL.k6346b6g}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
