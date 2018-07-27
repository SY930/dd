import React, { Component } from 'react';
import {
    Form,
    Button,
    Input,
    Select,
    Radio,

} from 'antd';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {SALE_CENTER_GIFT_EFFICT_DAY, SALE_CENTER_GIFT_EFFICT_TIME} from "../../../redux/actions/saleCenterNEW/types";


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SEND_MSG = [
    {
        label:'不发送',
        value:'0'
    },{
        label:'仅发送短信',
        value:'1'
    },{
        label:'仅推送微信',
        value:'2'
    },{
        label:'微信推送不成功则发送短信',
        value:'3'
    }
];
const VALIDATE_TYPE = [
    { key: 0, value: '1', name: '相对有效期' },
    { key: 1, value: '2', name: '固定有效期' }
];

class SendGiftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smsGate: '0',           // 消息推送方式
            giftNo: 1,              // 礼品个数
            effectType: '1',        // 相对有效期
            dayOrHour: '1',         // 按天 按小时
            effectTime: '1',        // 何时生效
            cellNo: '',             // 用户手机号
            template: '',           // 所选短信模板
        };
        this.handleGiftNumChange = this.handleGiftNumChange.bind(this);
        this.handleEffectTypeChange = this.handleEffectTypeChange.bind(this);
    }

    handleGiftNumChange(val) {
        this.setState({
            giftNo: val.number,
        })
    }

    handleEffectTypeChange(val) {
        this.setState({
            effectType: val,
        })
    }

    renderCellNo() {
        return <Input/>
    }

    renderGift() {
        return (
            <Form className={styles.addGrade}>
                <div className={styles.CategoryBody}>
                    {/* 礼品个数 */}
                    <FormItem
                        className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        validateStatus={validateStatus}
                        help={help}
                    >
                        <PriceInput
                            addonBefore={'礼品个数:'}
                            value={{ number: this.state.giftNo }}
                            onChange={this.handleGiftNumChange}
                            addonAfter="个"
                            modal="int"
                        />
                    </FormItem>
                    {/* ....... */}
                    <FormItem
                        className={styles.FormItemStyle}
                    >
                        <span className={styles.formLabel}>生效方式:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={this.state.effectType}
                            onChange={this.handleEffectTypeChange}
                        >
                            {
                                VALIDATE_TYPE.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.name}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        className={[styles.FormItemStyle].join(' ')}
                    >
                        <span className={styles.formLabel}>相对有效期:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={this.state.dayOrHour}
                            onChange={this}
                        >
                            {
                                [{ value: '0', label: '按小时' }, { value: '1', label: '按天' }].map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label="何时生效"
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Select
                            size="default"
                            value={}
                            onChange={(val) => { this.handleGiftEffectiveTimeChange(val, index) }}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                (String(this.state.dayOrHour) === '0' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
                                    .map((item, index) => {
                                        return (<Option value={item.value} key={index}>{item.label}</Option>);
                                    })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect, styles.priceInputSingle].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={'有效天数'}
                        required={true}
                        validateStatus={info.giftValidDays.validateStatus}
                        help={info.giftValidDays.msg}
                    >
                        <PriceInput
                            addonBefore=""
                            addonAfter="天"
                            modal="int"
                            value={{ number: info.giftValidDays.value }}
                            onChange={(val) => { this.handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                </div>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.renderCellNo()}
                {this.renderGift()}
                <FormItem
                    label="是否发送消息"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select size="default"
                            value={`${this.state.smsGate}`}
                            onChange={this.handlesmsGateChange}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            SEND_MSG.map((item) => {
                                return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                            })
                        }
                    </Select>
                </FormItem>
            </div>
        )
    }
}
