import React from 'react';
import { Tooltip, Icon } from 'antd';

export default function Tip(props) {
    const { style, title } = props;
    return (
        <Tooltip title={title}>
            <Icon style={style} type="question-circle" />
        </Tooltip>
    );
}
