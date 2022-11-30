import React from 'react'
import {
    Row,
    Col,
    Form,
    Select,
    Radio,
    Button,
    Checkbox,
    Icon,
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

import consumeGiveGiftStyle from "./consumeGiveGift.less";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import AddGifts from "../common/AddGifts";
import GoodsRef from '@hualala/sc-goodsRef';
import { businessTypesList } from "../../../constants/WhiteList";

const activityOption = [
    {
        label: '任意商品消费满',
        value: '1'
    },
    {
        label: '任意商品消费每满',
        value: '2'
    },
    {
        label: '指定商品消费满',
        value: '3'
    },
    {
        label: '指定商品消费每满',
        value: '4'
    },
]

let giveTypeOption = [
    {
        label: '优惠券',
        value: '1'
    },
    {
        label: '积分',
        value: '2'
    },
    {
        label: '卡值',
        value: '3'
    },
]

//消费送礼礼第三步
export const consumeGiveGiftStep3Render = function consumeGiveGiftStep3Render() {
    const { data, consumeCondition, consumeUnit, activityList, amountType, goodScopeRequest } = this.state;
    const { type, isNew, user, promotionDetailInfo, specialPromotion } = this.props;
    const { groupID } = user.accountInfo;

    if(this.rightControl && this.rightControl.activityList && this.rightControl.activityList.giveTypeOption && this.rightControl.activityList.giveTypeOption.length > 0) {
        giveTypeOption = giveTypeOption.filter(item => this.rightControl.activityList.giveTypeOption.includes(item.value));
    }

    const initItems = () => {
        return {
            id: Date.now().toString(36),
            conditionValue: '',//消费满
            giveType: [],
            couponList: [this.getDefaultGiftData()],
            integrate: {
                returnWay: 7,
                returnVal: ''
            },
            card: {
                returnWay: 7,
                returnVal: ''
            },
            couponShow: true,
            integrateShow: true,
            cardShow: true,
        }
    }

    const onChangeField = (val, index, field, subField) => {
        const list = [...activityList];
        if(subField) {
            if(subField == 'returnWay') {
                list[index][field].returnVal = '';
            }
            list[index][field][subField] = val;
        } else {
            list[index][field] = val;
        }
        this.setState({ activityList: list });
        setTimeout(() => {
            console.log(activityList);
        }, 600)
    }

    const validateRequired = (couponList) => {
        let flag = true;
        couponList.forEach(item => {
            if(!item.giftCount.value || !item.giftInfo.giftName || (item.effectType == '1' && !item.giftValidDays.value) || (item.effectType == '2' && item.giftEffectiveTime.value.length != 2)) {
                flag = false;
            }
        })
        return flag;
    }

    const reduceItem = (index) => {
        let list = [...activityList];
        list.splice(index, 1);
        this.setState({ activityList: list })
    }

    const addItem = (index) => {
        let list = [...activityList];
        list.push(initItems())
        this.setState({ activityList: list })
    }

    const onGoodsChange = (data) => {
        this.props.setSpecialBasicInfo({
            _newGoodsCompData: data
        })
    }

    return (
        <div style={{ position: 'relative' }}>
            <FormItem
                label='活动条件'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Select
                    style={{ width: '200px' }}
                    value={consumeCondition}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={(val) => {
                        console.log(val);
                        this.setState({ consumeCondition: val, activityList: [initItems()] })
                    }}
                >
                    {activityOption.map(item => (
                        <Select.Option value={item.value}>{item.label}</Select.Option>
                    ))}
                </Select>
                <Select
                    style={{ width: '100px' }}
                    value={consumeUnit}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={(val) => {
                        this.setState({ amountType: '0', consumeUnit: val, activityList: [initItems()] })
                    }}
                >
                    <Select.Option value='1'>金额</Select.Option>
                    <Select.Option value='2'>份</Select.Option>
                </Select>
            </FormItem>
            {activityList.map((item, index) => {
                // console.log(item.giveType);
                return (
                    <div key={item.id} className={consumeGiveGiftStyle.giftWrap}>
                        <div className={consumeGiveGiftStyle.giftList}>
                            <div className={consumeGiveGiftStyle.header}>
                                <FormItem
                                    label={'消费满'}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 15 }}
                                    validateStatus={(!(item.conditionValue > 0) || activityList.findIndex(row => row.conditionValue === item.conditionValue) != index) ? "error" : "success"}
                                    required={true}
                                    help={(!(item.conditionValue > 0) || (activityList.findIndex(row => row.conditionValue === item.conditionValue)) != index) ? '大于0且各层级消费满不能重复' : ''}
                                >
                                    <PriceInput
                                        maxNum={8}
                                        addonAfter={consumeUnit == '1' ? "元" : '份'}
                                        modal={consumeUnit == '1' ? "float" : "int"}
                                        value={{number: item.conditionValue}}
                                        onChange={(val) => onChangeField(val.number, index, 'conditionValue')}
                                    />
                                    <div className={consumeGiveGiftStyle.operation}>
                                        {activityList.length - 1 == index && index < 4 && ['1', '3'].includes(consumeCondition) && <Button style={{ marginRight: '5px' }} type="primary" onClick={() => addItem()} shape="circle" icon="plus" />}    
                                        {!(activityList.length == 1 && index == 0) && ['1', '3'].includes(consumeCondition) && <Button shape="circle" onClick={() => reduceItem(index)} icon="minus" />}
                                    </div>
                                </FormItem> 
                            </div>
                            <div></div>
                            <div className={consumeGiveGiftStyle.content}>
                                <FormItem
                                    label='赠送类型'
                                    labelCol={{
                                        span: 4,
                                    }}
                                    required={true}
                                    validateStatus={item.giveType.length
                                        ? 'success'
                                        : 'error'}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                    help={!item.giveType.length ? '请选择' : ''}
                                >
                                    <CheckboxGroup
                                        onChange={(val) => onChangeField(val, index, 'giveType')}
                                        options={giveTypeOption}
                                        value={item.giveType}
                                        defaultValue={item.giveType}
                                    />
                                </FormItem>
                                {item.giveType.includes('1') && <div className={consumeGiveGiftStyle.itemWrap}>
                                    <div className={consumeGiveGiftStyle.itemHeader}>
                                        <span>优惠券</span>
                                        {item.couponShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-down" onClick={() => onChangeField(!item.couponShow, index, 'couponShow')} />}
                                        {!item.couponShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-up" onClick={() => onChangeField(!item.couponShow, index, 'couponShow')} />}
                                    </div>
                                    <div className={consumeGiveGiftStyle.itemContent}>
                                        {item.couponShow && <div>
                                            <AddGifts
                                                maxCount={10}
                                                type={type}
                                                isNew={isNew}
                                                value={item.couponList}
                                                onChange={(val) => onChangeField(val, index, 'couponList')}
                                            />
                                        </div>}
                                        {!item.couponShow && <div style={{ textAlign: 'center' }}>
                                            已添加返礼品规则：{item.couponList.length}个礼品 
                                            {!validateRequired(item.couponList) && <span style={{ color: 'red' }}> （必填项未填写）</span>}
                                        </div>}
                                    </div>
                                </div>}
                                {item.giveType.includes('2') && <div className={consumeGiveGiftStyle.itemWrap}>
                                    <div className={consumeGiveGiftStyle.itemHeader}>
                                        <span>积分</span>
                                        {item.integrateShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-down" onClick={() => onChangeField(!item.integrateShow, index, 'integrateShow')} />}
                                        {!item.integrateShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-up" onClick={() => onChangeField(!item.integrateShow, index, 'integrateShow')} />}
                                    </div>
                                    <div className={consumeGiveGiftStyle.itemContent}>
                                        {item.integrateShow && <div>
                                            <FormItem
                                                label="返还方式"
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 17 }}
                                            >
                                                <RadioGroup
                                                    onChange={(val) => onChangeField(val.target.value, index, 'integrate', 'returnWay')}
                                                    value={item.integrate.returnWay}
                                                >
                                                    <Radio value={7}>
                                                        按比例返积分
                                                    </Radio>
                                                    <Radio value={6}>
                                                        返固定积分
                                                    </Radio>
                                                </RadioGroup>
                                            </FormItem>
                                            <FormItem
                                                label=''
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 15 }}
                                                validateStatus={item.integrate.returnVal > 0 ? "success" : "error"}
                                                required={true}
                                                help={!(item.integrate.returnVal > 0) ? '大于0' : ''}
                                            >
                                                <PriceInput
                                                    maxNum={8}
                                                    addonAfter={item.integrate.returnWay == 7 ? "%" : "分"}
                                                    value={{number: item.integrate.returnVal}}
                                                    modal={item.integrate.returnWay == 7 ? "float" : "int"}
                                                    onChange={(val) => onChangeField(val.number, index, 'integrate', 'returnVal')}
                                                />
                                            </FormItem> 
                                        </div>}
                                        {!item.integrateShow && <div style={{ textAlign: 'center' }}>
                                            {item.integrate.returnVal > 0 && <span>已添加返积分规则：{item.integrate.returnVal}{item.integrate.returnWay == 7 ? '%' : '分'}</span>}
                                            {!(item.integrate.returnVal > 0) && <span style={{ color: 'red' }}> （必填项未填写）</span>}
                                        </div>}
                                    </div>
                                </div>}
                                {item.giveType.includes('3') && <div className={consumeGiveGiftStyle.itemWrap}>
                                    <div className={consumeGiveGiftStyle.itemHeader}>
                                        <span>卡值</span>
                                        {item.cardShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-down" onClick={() => onChangeField(!item.cardShow, index, 'cardShow')} />}
                                        {!item.cardShow && <Icon className={consumeGiveGiftStyle.upDown} type="caret-up" onClick={() => onChangeField(!item.cardShow, index, 'cardShow')} />}
                                    </div>
                                    <div className={consumeGiveGiftStyle.itemContent}>
                                        {item.cardShow && <div>
                                            <FormItem
                                                label="返还方式"
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 17 }}
                                            >
                                                <RadioGroup
                                                    onChange={(val) => onChangeField(val.target.value, index, 'card', 'returnWay')}
                                                    value={item.card.returnWay}
                                                >
                                                    <Radio value={7}>
                                                        按比例返卡值
                                                    </Radio>
                                                    <Radio value={6}>
                                                        返固定赠送卡值
                                                    </Radio>
                                                </RadioGroup>
                                            </FormItem>
                                            <FormItem
                                                label=''
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 15 }}
                                                validateStatus={item.card.returnVal > 0 ? "success" : "error"}
                                                required={true}
                                                help={!(item.card.returnVal > 0) ? '大于0' : ''}
                                            >
                                                <PriceInput
                                                    maxNum={8}
                                                    addonAfter={item.card.returnWay == 7 ? "%" : "元"}
                                                    value={{number: item.card.returnVal}}
                                                    modal={item.card.returnWay == 7 ? "float" : "int"}
                                                    onChange={(val) => onChangeField(val.number, index, 'card', 'returnVal')}
                                                />
                                            </FormItem> 
                                        </div>}
                                        {!item.cardShow && <div style={{ textAlign: 'center' }}>
                                            {item.card.returnVal > 0 && <span>已添加返卡值规则：{item.card.returnVal}{item.card.returnWay == 7 ? '%' : '元'}</span>}
                                            {!(item.card.returnVal > 0) && <span style={{ color: 'red' }}> （必填项未填写）</span>}
                                        </div>}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                )
            })}

            {['3', '4'].includes(consumeCondition) && <div style={{ padding: '10px 50px 10px 108px' }}>
                <GoodsRef
                    // containLabel=''
                    // exclusiveLabel=''
                    businessTypesList={businessTypesList}
                    onChange={onGoodsChange}
                    defaultValue={goodScopeRequest}
                />
            </div>}
            {consumeUnit == '1' && <FormItem
                label="金额核算"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup
                    onChange={(e) => {
                        this.setState({
                            amountType: e.target.value
                        })
                    }}
                    value={amountType}
                >
                    <Radio value={'0'}>
                        账单金额
                    </Radio>
                    <Radio value={'1'}>
                        实收金额
                    </Radio>
                </RadioGroup>
            </FormItem>}
        </div>
    )
}
