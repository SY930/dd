import React, { PureComponent as Component } from 'react';
import { Checkbox, Radio, Select } from 'antd'
import css from './style.less';
import {  } from './Common';

const { RadioGroup, Button } = Radio;
class Ticket extends Component {
    onChange = ({ target }) => {
        const { checked } = target;
    }
    onRadioChange = ({ target }) => {
        const { value } = target;
    }
    render() {
        const { type, value, disabled } = this.props;
        return (
            <div className={css.pointBox}>
                <Checkbox onChange={this.onChange}>赠送优惠券</Checkbox>
                <RadioGroup defaultValue={1} onChange={this.onRadioChange}>
                    <Button value={1}>独立优惠券</Button>
                    <Button value={2}>券包</Button>
                </RadioGroup>

            </div>
        )
    }
}

export default Ticket
