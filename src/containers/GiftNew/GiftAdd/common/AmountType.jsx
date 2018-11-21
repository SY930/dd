import React, {Component} from 'react';
import { Radio } from 'antd';
import CloseableTip from "../../../../components/common/CloseableTip/index";

const RadioGroup = Radio.Group;

class AmountType extends Component {

    render() {
        const { value } = this.props;
        let _value = value == 1 ? 1 : 0;
        return (
            <div>
                <RadioGroup
                    value={_value}
                    onChange={e => {
                        this.props.onChange && this.props.onChange(e.target.value)
                    }}
                >
                    <Radio value={0}>老规则</Radio>
                    <Radio value={1}>新规则</Radio>
                </RadioGroup>
                <CloseableTip
                    content={
                        <div>
                            <p>老规则：</p>
                            <p style={{ textIndent: '2em' }}>按账单金额限制代金券能否使用, 如果选择了活动菜品当账单金额满足金额限制条件时, 可以使用代金券</p>
                            <p>新规则：</p>
                            <p style={{ textIndent: '2em' }}>可以按账单金额和活动菜品金额限制代金券能否使用, 如果选择了活动菜品, 只有活动菜品金额满足金额限制条件时, 代金券才能使用</p>
                        </div>
                    }
                    customStyle={{ top: -290 }}
                />
            </div>
        )
    }
}

export default AmountType
