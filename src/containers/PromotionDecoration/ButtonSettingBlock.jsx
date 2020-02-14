import React, { Component } from 'react';
import ColoredButton from './ColoredButton';
import style from './buttonSettingBlock.less';
import WrappedColorPicker from '../../components/common/WrappedColorPicker';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@injectIntl()
export default class ButtonSettingBlock extends Component {
    render() {
        const {
            buttonBgColor,
            buttonColor,
            onChange,
        } = this.props;
        const { intl } = this.props;
        const k63469k3 = intl.formatMessage(SALE_STRING.k63469k3);
        const k63469sf = intl.formatMessage(SALE_STRING.k63469sf);
        const k6346a0r = intl.formatMessage(SALE_STRING.k6346a0r);
        const DEFAULT_COLOR_THEME = [
            {
                label: k63469k3,
                buttonBgColor: '#FFC455',
                buttonColor: '#AD0701',
            },
            {
                label: k63469sf,
                buttonBgColor: '#D14C41',
                buttonColor: '#FFFFFF',
            },
            {
                label: k6346a0r,
                buttonBgColor: '#A47E48',
                buttonColor: '#FFFFFF',
            },
        ];
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
                    {SALE_LABEL.k6346bes}
                </div>
                <div className={style.colorPickerWrapper}>
                    <span>{SALE_LABEL.k6346bn4}</span>
                    <div className={style.borderWrapper}>
                        <WrappedColorPicker
                            alpha={100}
                            color={buttonBgColor}
                            onChange={({ color: buttonBgColor }) => onChange({ buttonBgColor })}
                            placement="topLeft"
                        />
                    </div>

                    <span>{SALE_LABEL.k6346bvg}</span>
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
