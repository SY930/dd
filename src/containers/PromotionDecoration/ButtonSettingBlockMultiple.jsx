import React, { Component } from 'react';
import ColoredButton from './ColoredButton';
import style from './buttonSettingBlockMultiple.less';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class buttonSettingBlockMultiple extends Component {
    render() {
        const {
            btnBgColor,
            btnColor,
            onChange,
            handleLinearGradientChange
        } = this.props;
        const { intl } = this.props;
        const k63469k3 = intl.formatMessage(SALE_STRING.k63469k3);
        const k63469sf = intl.formatMessage(SALE_STRING.k63469sf);
        const k6346a0r = intl.formatMessage(SALE_STRING.k6346a0r);
        const DEFAULT_COLOR_THEME = [
            {
                label: k63469k3,
                btnBgColor: 'linear-gradient(#FFDF88,#FFBB50)',
                btnColor: '#6F2800',
            },
            {
                label: k63469sf,
                btnBgColor: 'linear-gradient(#E2C8A2,#A47E48)',
                btnColor: '#FFFFFF',
            },
            {
                label: k6346a0r,
                btnBgColor: 'linear-gradient(#F27267,#D24C41)',
                btnColor: '#FFFFFF',
            },
        ];
        const [, color1, color2] = /\((.+),(.+)\)/.exec(btnBgColor);
        return (
            <div>
                <div className={style.defaultRowWrapper}>
                    {
                        DEFAULT_COLOR_THEME.map(item => (
                            <ColoredButton
                                isSelected={btnColor === item.btnColor && item.btnBgColor === btnBgColor}
                                label={item.label}
                                buttonBgColor={item.btnBgColor}
                                buttonColor={item.btnColor}
                                onChange={(v) => onChange(v)}
                            />
                        ))
                    }
                </div>
                <div className={style.subTitle}>
                    {SALE_LABEL.k6346bes}
                </div>
                <div className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bn4}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={color1}
                                onChange={({ color }) => handleLinearGradientChange(color, color2)}
                                placement="topLeft"
                            />
                            <WrappedColorPicker
                                alpha={100}
                                color={color2}
                                onChange={({ color }) => handleLinearGradientChange(color1, color)}
                                placement="topLeft"
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }} className={style.inlineRow}>
                        <span>{SALE_LABEL.k6346bvg}</span>
                        <div className={style.borderedColorWrapper}>
                            <WrappedColorPicker
                                alpha={100}
                                color={btnColor}
                                onChange={({ color }) => onChange({key: ['btnColor'], value: color})}
                                placement="topLeft"
                            />
                        </div>
                    </div>
            </div>
        )
    }
}
