import React, { PureComponent as Component } from 'react';
import { Checkbox, Icon } from 'antd';
import css from './style.less';

class Advance extends Component {

    render() {
        const { value } = this.props;
        const icontype = value ? 'caret-down' : 'caret-up';
        return (<p className={css.advance}>
                更多活动日期与时间设置请使用
                <Checkbox
                    checked={value}
                    onChange={this.props.onChange}
                >
                    高级日期设置<Icon type={icontype} />
                </Checkbox>
            </p>
        )
    }
}

export default Advance
