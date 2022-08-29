
import React, { PureComponent as Component } from 'react';
import { Checkbox, Icon } from 'antd';
import css from './style.less';

class Advance extends Component {
    render() {
        const { value, text } = this.props;
        const icontype = value ? 'caret-down' : 'caret-up';
        return (<p className={`${css.advance} ${!text ? '' : css.textPositoon}`} >
            {!text && <span>更多活动日期与时间设置请使用</span>}
            <Checkbox
                checked={value}
                onChange={this.props.onChange}
            >
                <span className={`${!text ? '' : css.textPosColor}`}>高级日期设置</span>
                {!text && <Icon type={icontype} />}
            </Checkbox>
        </p>
        )
    }
}

export default Advance
