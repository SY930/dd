import React, { PureComponent as Component } from 'react';
import { Select } from 'antd';

export default class GiftPrice extends Component {

    onChange = (value) => {
        const { name, onChange } = this.props;
        onChange({ key: name, value });
    }

    render() {
        const { value = '¥', disabled } = this.props;
        return (
            <Select disabled={disabled} style={{ width: 70 }} value={value} onChange={this.onChange}>
                <Option value="¥">¥</Option>
                <Option value="$">$</Option>
                <Option value="€">€</Option>
                <Option value="£">£</Option>
                <Option value="RM">RM</Option>
                <Option value="S$">S$</Option>
                <Option value="DHS">DHS</Option>
                <Option value="MOP$">MOP$</Option>
            </Select>
        );
    }
}

