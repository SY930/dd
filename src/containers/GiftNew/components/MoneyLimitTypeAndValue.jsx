import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import PriceInput from 'containers/SaleCenterNEW/common/PriceInput';

const { Option } = Select;
const SELECT_OPTIONS = [
    { label: '不限', value: '0' },
    { label: '每满', value: '1' },
    { label: '满', value: '2' },
];

export default class MoneyLimitTypeAndValue extends Component {

    handleTypeAndValueChange = (v) => {
        this.props.onChange({
            ...this.props.value,
            ...v,
        })
    }
    getSelectOptions = () => {
        if (this.props.type == 111) {
            return [
                { label: '不限', value: '0' },
                { label: '满', value: '2' },
            ]
        }
        if (this.props.type == 114) {
            return [
                { label: '不限', value: '0' },
                { label: '满', value: '2' },
            ]
        }
        return SELECT_OPTIONS
    }
    render() {
        const {
            value: {
                moneyLimitType,
                moenyLimitValue,
            },
        } = this.props;
        if (moneyLimitType === '0') {
            return (
                <Select
                    value={moneyLimitType}
                    onChange={(v) => this.handleTypeAndValueChange({moneyLimitType: v})}
                >
                    {
                        this.getSelectOptions().map(({ value, label }) => (
                            <Option key={value} value={value}>
                                {label}
                            </Option>
                        ))
                    }
                </Select>
            )
        }
        return (
            <PriceInput
                addonBefore={
                    <Select
                        style={{ width: 120 }}
                        value={moneyLimitType}
                        onChange={(v) => this.handleTypeAndValueChange({moneyLimitType: v})}
                    >
                        {
                            this.getSelectOptions().map(({ value, label }) => (
                                <Option key={value} value={value}>
                                    {label}
                                </Option>
                            ))
                        }
                    </Select>
                }
                onChange={({ number: v }) => this.handleTypeAndValueChange({moenyLimitValue: v})}
                addonAfter="元，使用一张"
                value={{ number: moenyLimitValue }}
                maxNum={6}
            />
        )
    }
}
