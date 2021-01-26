import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import _ from 'lodash';
import PriceInput from 'containers/SaleCenterNEW/common/PriceInput';

const { Option } = Select;

/**
 * moneyLimitType:不限:0、每满:1、满:2
 * amountType 该字段来进行设置： 0-账单金额 1-代金券下账单金额 2-应付金额 
 * 通过以上两个字段组合来确定当前是哪个核销限制条件
 */
const SELECT_OPTIONS = [
    { label: '不限', value: JSON.stringify({moneyLimitType:'0',amountType:'0'})},
    { label: '账单金额满', value: JSON.stringify({moneyLimitType:'2',amountType:'0'})},
    { label: '账单金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'0'})},
    { label: '应付金额满', value: JSON.stringify({moneyLimitType:'2',amountType:'2'})},
    { label: '应付金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'2'})},
];

export default class MoneyLimitTypeAndValue extends Component {
    handleTypeAndValueChange = (v) => {
        this.props.onChange({
            ...this.props.value,
            ...v,
        })
    }
    getSelectOptions = () => {
        const {type,isActivityFoods} = this.props;
        if (type == 111 || type == 22) {//111为折扣券
            return [
                { label: '不限', value: JSON.stringify({moneyLimitType:'0',amountType:'0'})},
                { label: '账单金额满', value:JSON.stringify({moneyLimitType:'2',amountType:'0'})},
                { label: '应付金额满', value: JSON.stringify({moneyLimitType:'2',amountType:'2'})},
            ]
        }
        if (type == 10){//代金券下 amountType 设为固定值1,2
            if(isActivityFoods){
                return [
                    { label: '不限', value: JSON.stringify({moneyLimitType:'0',amountType:'0'})},
                    { label: '活动菜品金额满', value:JSON.stringify({moneyLimitType:'2',amountType:'1'})},
                    { label: '活动菜品金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'1'})},
                    { label: '活动菜品应付金额满', value: JSON.stringify({moneyLimitType:'2',amountType:'2'})},
                    { label: '活动菜品应付金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'2'})},
                ]
            }
            return [
                { label: '不限', value: JSON.stringify({moneyLimitType:'0',amountType:'0'})},
                { label: '账单金额满', value:JSON.stringify({moneyLimitType:'2',amountType:'1'})},
                { label: '账单金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'1'})},
                { label: '应付金额满', value: JSON.stringify({moneyLimitType:'2',amountType:'2'})},
                { label: '应付金额每满', value: JSON.stringify({moneyLimitType:'1',amountType:'2'})},
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
        const moneyLimitTypeVal = JSON.parse(moneyLimitType);
        const defaultLabelArr = _.filter(this.getSelectOptions(),function(o){
            const selectVal = JSON.parse(o.value);
            return selectVal.moneyLimitType == moneyLimitTypeVal.moneyLimitType  &&  selectVal.amountType == moneyLimitTypeVal.amountType;
        });
        const defaultLabel  = defaultLabelArr.length >  0 ? defaultLabelArr[0].label : '不限';
        
        if (moneyLimitTypeVal.moneyLimitType == '0') {
            return (
                <PriceInput
                    addonBefore={
                        <Select
                            style={{ width: 150 }}
                            value={defaultLabel}
                            onChange={(v) => this.handleTypeAndValueChange({ moneyLimitType: v })}
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
                    addonAfter='元'
                    disabled
                    value={{ number: '' }}
                />
            )
        }

        return (
            <PriceInput
                addonBefore={
                    <Select
                        style={{ width: 150 }}
                        value={defaultLabel}
                        onChange={(v) => this.handleTypeAndValueChange({ moneyLimitType: v })}
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
                onChange={({ number: v }) => this.handleTypeAndValueChange({ moenyLimitValue: v })}
                addonAfter='元，使用一张'
                value={{ number: moenyLimitValue }}
                maxNum={5}
                modal={'int'}
            />
        )
    }
}
