import React, { PureComponent as Component } from 'react';
import { Checkbox, Input, Select } from 'antd'
import css from './style.less';
import {  } from './Common';

const { Option } = Select;
class Point extends Component {
    onChange = ({ target }) => {
        const { checked } = target;
    }
    onSltChange = (value) => {
        const { checked } = target;
    }
    render() {
        const { type, value, disabled } = this.props;
        return (
            <div className={css.pointBox}>
                <Checkbox onChange={this.onChange}>赠送积分</Checkbox>
                <Input addonAfter="%" defaultValue="" />
                <em>充值到会员卡</em>
                <Select defaultValue="lucy" onChange={this.onSltChange}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled">Disabled</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
            </div>
        )
    }
}

export default Point
