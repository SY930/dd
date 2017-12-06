/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-08T11:20:45+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:44:14+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { Input, Icon } from 'antd';

class HualalaSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e) {
        this.props.onChange(e.target.value);
    }
    render() {
        return (
            <Input addonBefore={<Icon type="search" />} placeholder="请选择" onChange={this.handleInputChange} onFocus={this.props.onFocus} />
        );
    }
}

HualalaSearchInput.propTypes = {
    onChange: React.PropTypes.func,
}

HualalaSearchInput.defaultProps = {
    onChange: () => {},
}

export default HualalaSearchInput;
