import React, { PureComponent as Component } from 'react';
import { Select } from 'antd';

export default class GiftPrice extends Component {

    onChange = (value) => {
        const { name, onChange } = this.props;
        onChange({ [name]: value });
    }

    render() {
        const { value = '0', disabled } = this.props;
        return (
            <Select disabled={disabled} style={{ width: 70 }} value={value} onChange={this.onChange}>
                <Option value="0">¥</Option>
                <Option value="1">$</Option>
                <Option value="2">€</Option>
                <Option value="3">£</Option>
                <Option value="4">RM</Option>
                <Option value="5">S$</Option>
                <Option value="6">DHS</Option>
                <Option value="7">MOP$</Option>
            </Select>
        );
    }
}

