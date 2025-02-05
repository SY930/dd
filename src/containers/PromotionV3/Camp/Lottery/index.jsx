import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import MutliGift from './MutliGift';
import TicketBag from '../TicketBag';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class Lottery extends Component {
    state = {
        tabKey: '1',
        cardList: [],
        cardValueList: [],
    }
    count = 0;
    componentDidMount() {
        // this.add();
        this.getCardType();
    }
    onChange = (tabKey) => {
        this.setState({ tabKey });
    }
    onEdit = (targetKey, action) => {
        this[action](targetKey);
        this.setState({
            tabKey:targetKey - 1
        })
    }
    // presentType 礼品1， 积分为2，券包4
    add = () => {
        const { value, onChange } = this.props;
        if(value[6]) { return; }
        const list = [...value];
        const len = value.length;
        const id = `${len + 1}`; // 根据索引生成id，方便回显时遍历
        list.push({ id, giftOdds: '', presentValue: '', cardTypeID: '', cardValue: '', cardValueTypeID: '',giftTotalCount:'',
            isPoint: false, isTicket: true, isCardVal: false, presentType: '1', giftList: [{ id: '001', effectType: '1' }],  bagList: [] });
        this.setState({ tabKey: id });
        onChange(list);
    }

    remove = (tabKey) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const idx = tabKey - 1;
        list.splice(idx, 1);
        onChange(list);
    }

    getCardType() {
        getCardTypeList().then(cardList => {
        const cardValueList = (cardList || []).map((item) => ({ ...item, cardValueTypeID: item.cardTypeID}))
            this.setState({ cardList, cardValueList });
        });
    }
    onAllChange(data){
        const { tabKey } = this.state;
        const { value, onChange } = this.props;
        const list = [...value];
        const item = list[tabKey - 1];
        list[tabKey - 1] = { ...item, ...data };
        let count = 0;
        list.forEach(x=>{
            count += +x.giftOdds;
        });
        this.count = count;
        onChange(list);
    }
    onGiftOddsChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ giftOdds: value });
    }
    onPointChange = ({ target }) => {
        const { checked } = target;
        this.onAllChange({ isPoint: checked });
    }
    onCardChange = ({ target }) => {
        const { checked } = target;
        this.onAllChange({ isCardVal: checked });
    }
    onTicketChange = ({ target }) => {
        const { checked } = target;
        this.onAllChange({ isTicket: checked });
    }
    onTypeChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ presentType: value });
    }
    onPresentValueChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ presentValue: value });
    }
    onCardValueChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ cardValue: value });
    }
    onCardTypeIDChange = (cardTypeID) => {
        this.onAllChange({ cardTypeID });
    }
    onCardValueTypeIDChange = (cardValueTypeID) => {
        this.onAllChange({ cardValueTypeID }); 
    }
    onGiftChange = (giftList) => {
        this.onAllChange({ giftList });
    }
    onBagChange = (bagList) => {
        this.onAllChange({ bagList });
    }
    onGiftTotalCountChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ giftTotalCount: value ? Number(value) : '' });
    }

    render() {
        const { tabKey, cardList, cardValueList } = this.state;
        const { value, decorator } = this.props;
        if(!value[0]){ return null}
        const { length } = value;
        const disable = value[0].userCount > 0;    // 如果被用了，不能编辑
        return (
                <div className={css.mainBox}>
                    <div className={css.addBox}>
                        <Button type="primary" disabled={disable} onClick={this.add}>
                            <Icon type="plus" />添加奖项
                        </Button>
                        <p>最多可添加7个奖项</p>
                    </div>
                    <div>
                        <Tabs
                            hideAdd={1}
                            onChange={this.onChange}
                            activeKey={String(tabKey)}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >
                            {value.map((x, i)=>{
                                const close = (length === i + 1) && (i > 0);
                                const name = `奖项${i + 1}`;
                                let gifts = x.giftList;
                                // 防止回显没数据不显示礼品组件
                                if(!gifts[0]){
                                    gifts.push({ id: '001', effectType: '1' });
                                }
                                return (<TabPane tab={name} key={x.id} closable={ disable ? false : close}>
                                    <ul style={{ position: 'relative' }}>
                                        <li className={css.oddsBox}>
                                            <FormItem label="中奖概率">
                                            {
                                                decorator({
                                                    key: 'giftOdds' + i,
                                                    value: x.giftOdds,
                                                    defaultValue: x.giftOdds,
                                                    rules: [{
                                                        required: true,
                                                        validator: (rule, v, cb) => {
                                                            const reg = /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/;
                                                            if (!reg.test(v) || this.count > 100) {
                                                                return cb('奖品中奖概率之和应为0.01~100%');
                                                            }
                                                            cb();
                                                        },
                                                    }],
                                                })(
                                                    <p><Input disabled={disable} value={x.giftOdds} addonAfter="%" onChange={this.onGiftOddsChange}/></p>
                                                )
                                            }
                                            </FormItem>
                                        </li>
                                        <li className={css.oddsBox} style={{marginLeft:10}}>
                                            <FormItem label="奖品总数">
                                                {
                                                    decorator({
                                                        key: 'giftTotalCount' + i,
                                                        initialValue:!x.giftTotalCount || x.giftTotalCount === '0' ? undefined : x.giftTotalCount,
                                                        rules: [{
                                                            pattern: /^[1-9]\d{0,7}$/,
                                                            message: '请输入正整数',
                                                        }],
                                                        onChange : this.onGiftTotalCountChange
                                                    })(
                                                        <Input
                                                            
                                                            addonAfter={"个"}
                                                            placeholder="请输入数值"
                                                        />
                                                    )
                                                }
                                                <span>不填代表礼品个数不限制</span>
                                            </FormItem>
                                    </li>
                                    
                                        <li className={css.pointBox}>
                                            <Checkbox checked={x.isPoint} onChange={this.onPointChange}>赠送积分</Checkbox>
                                            {x.isPoint &&
                                                <div style={{ display: 'flex', width: 400 }}>
                                                    <FormItem label="">
                                                        {
                                                            decorator({
                                                                key: 'presentValue' + i,
                                                                value: x.presentValue,
                                                                defaultValue: x.presentValue,
                                                                rules: [{
                                                                    required: true,
                                                                    pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
                                                                    message: '请输入0.01~100000数字，支持两位小数',
                                                                }],
                                                            })(
                                                                <p style={{ width: 120 }}><Input value={x.presentValue} addonAfter="积分" onChange={this.onPresentValueChange}/></p>
                                                            )
                                                        }
                                                    </FormItem>
                                                    <FormItem label="充值到会员卡">
                                                        {
                                                            decorator({
                                                                key: 'cardTypeID' + i,
                                                                value: x.cardTypeID || '',
                                                                defaultValue: x.cardTypeID || '',
                                                                rules: [{
                                                                    required: true,
                                                                    message: '不能为空',
                                                                }],
                                                                onChange:this.onCardTypeIDChange,
                                                            })(
                                                                <Select style={{ width: 160 }} value={x.cardTypeID || ''} onChange={this.onCardTypeIDChange}>
                                                                {
                                                                    cardList.map(c => {
                                                                        return (<Option
                                                                                key={c.cardTypeID}
                                                                                value={c.cardTypeID}
                                                                                >
                                                                                {c.cardTypeName}
                                                                            </Option>)
                                                                    })
                                                                }
                                                                </Select>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            }
                                        </li>
                                        <li className={css.pointBox}>
                                            <Checkbox checked={x.isCardVal} onChange={this.onCardChange}>赠送卡值</Checkbox>
                                            {x.isCardVal &&
                                                <div style={{ display: 'flex', width: 400 }}>
                                                    <FormItem label="">
                                                        {
                                                            decorator({
                                                                key: 'cardValue' + i,
                                                                value: x.cardValue,
                                                                defaultValue: x.cardValue,
                                                                rules: [{
                                                                    required: true,
                                                                    pattern: /^([1-9]\d{0,4})(\.\d{1,2}){0,1}$/,
                                                                    message: '请输入1~10000的数字，支持两位小数',
                                                                }],
                                                            })(
                                                                <p style={{ width: 120 }}><Input value={x.cardValue} addonAfter="卡值" onChange={this.onCardValueChange}/></p>
                                                            )
                                                        }
                                                    </FormItem>
                                                    <FormItem label="充值到会员卡">
                                                        {
                                                            decorator({
                                                                key: 'cardValueTypeID' + i,
                                                                value: x.cardValueTypeID || '',
                                                                defaultValue: x.cardValueTypeID || '',
                                                                rules: [{
                                                                    required: true,
                                                                    message: '不能为空',
                                                                }],
                                                                onChange: this.onCardValueTypeIDChange,
                                                            })(
                                                                <Select style={{ width: 160 }} value={x.cardValueTypeID || ''} onChange={this.onCardValueTypeIDChange}>
                                                                {
                                                                    (cardValueList || []).map((c, idx) => {
                                                                        return (<Option
                                                                                key={`${c.cardValueTypeID}`}
                                                                                value={`${c.cardValueTypeID}`}
                                                                                >
                                                                                {c.cardTypeName}
                                                                            </Option>)
                                                                    })
                                                                }
                                                                </Select>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            }
                                        </li>
                                        <li>
                                            <Checkbox disabled={disable} checked={x.isTicket} onChange={this.onTicketChange}>赠送优惠券</Checkbox>
                                        </li>
                                        {x.isTicket &&
                                            <li>
                                                <p className={css.ticketBox}>
                                                <RadioGroup disabled={disable} value={x.presentType} onChange={this.onTypeChange}>
                                                    <RadioButton value="1">独立优惠券</RadioButton>
                                                    <RadioButton value="4">券包</RadioButton>
                                                </RadioGroup>
                                                </p>
                                                <div style={{ position: "relative" }}>
                                                {x.presentType === '1' ?
                                                    <MutliGift value={gifts} onChange={this.onGiftChange} /> :
                                                    <TicketBag value={x.bagList} onChange={this.onBagChange} />
                                                }
                                                </div>
                                            </li>
                                        }
                                        <p className={disable ? css.disBox: ''}></p>
                                    </ul>
                                </TabPane>)
                            })}
                        </Tabs>
                    </div>
                </div>

        )
    }
}

export default Lottery
