import React, { Component } from 'react';
import style from './coloredButton.less';

export default class ColoredButton extends Component {
    render() {
        const {
            label,
            isSelected,
            buttonColor,
            buttonBgColor,
            onChange,
        } = this.props;
        return (
            <div
                onClick={() => onChange({ buttonBgColor, buttonColor })}
                className={`${style.wrapper} ${isSelected ? style.isSelected : ''}`}
            >
                <div
                    className={style.roundButton}
                    style={{
                        background: buttonBgColor,
                        color: buttonColor,
                    }}
                >
                    {label}
                </div>
            </div>
        )
    }
}
