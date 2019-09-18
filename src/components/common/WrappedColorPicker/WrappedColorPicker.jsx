import React from 'react';
import ColorPicker from 'rc-color-picker';
import './colorPickerTheme.less'


const WrappedColorPicker = (props) => {
    return (
        <ColorPicker
            {...props}
        >
            <span className="rc-color-picker-trigger" />
        </ColorPicker>
    )
}

export default WrappedColorPicker
