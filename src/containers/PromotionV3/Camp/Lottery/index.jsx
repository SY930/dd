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
    }
    // presentType 礼品1， 积分为2，券包4
    add = () => {
        const { value, onChange } = this.props;
        if(value[6]) { return; }
        const list = [...value];
        const len = value.length;
        const id = `${len + 1}`; // 根据索引生成id，方便回显时遍历
        list.push({ id, giftOdds: '', presentValue: '', cardTypeID: '',
            isPoint: false, isTicket: true, presentType: '1', giftList: [{ id: '001', effectType: '1' }],  bagList: [] });
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
            this.setState({ cardList });
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
    onCardTypeIDChange = (cardTypeID) => {
        this.onAllChange({ cardTypeID });
    }
    onGiftChange = (giftList) => {
        this.onAllChange({ giftList });
    }
    onBagChange = (bagList) => {
        this.onAllChange({ bagList });
    }
    render() {
        const { tabKey, cardList } = this.state;
        const { value, decorator } = this.props;
        if(!value[0]){ return null}
        const { length } = value;
        return (
                <div className={css.mainBox}>
                    <div className={css.addBox}>
                        <Button type="primary" onClick={this.add}>
                            <Icon type="plus" />添加奖品
                        </Button>
                        <p>最多可添加7个奖品</p>
                    </div>
                    <div>
                        <Tabs
                            hideAdd={1}
                            onChange={this.onChange}
                            activeKey={tabKey}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >
                            {value.map((x, i)=>{
                                const close = (length === i + 1) && (i > 0);
                                const name = `奖项${i + 1}`;
                                const disable = x.userCount > 0;    // 如果被用了，不能编辑
                                let gifts = x.giftList;
                                // 防止回显没数据不显示礼品组件
                                if(!gifts[0]){
                                    gifts.push({ id: '001', effectType: '1' });
                                }
                                return (<TabPane tab={name} key={x.id} closable={close}>
                                    <ul>
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
                                                            const reg = /^\d+$/;
                                                            if(!reg.test(v)) {
                                                                return cb('请输入数字');
                                                            }
                                                            if (this.count > 100) {
                                                                return cb('奖品中奖概率之和应为0.01~100%');
                                                            }
                                                            cb();
                                                        },
                                                    }],
                                                })(
                                                    <p><Input value={x.giftOdds} addonAfter="%" onChange={this.onGiftOddsChange}/></p>
                                                )
                                            }
                                            </FormItem>
                                        </li>
                                        <li className={css.pointBox}>
                                            <Checkbox checked={x.isPoint} onChange={this.onPointChange}>赠送积分</Checkbox>
                                            {x.isPoint &&
                                                <div style={{ display: 'flex' }}>
                                                    <FormItem label="">
                                                        {
                                                            decorator({
                                                                key: 'presentValue' + i,
                                                                value: x.presentValue,
                                                                defaultValue: x.presentValue,
                                                                rules: [{
                                                                    pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
                                                                    message: '请输入0~100000数字，支持两位小数',
                                                                }],
                                                            })(
                                                                <p><Input value={x.presentValue} addonAfter="积分" onChange={this.onPresentValueChange}/></p>
                                                            )
                                                        }
                                                    </FormItem>
                                                    <label className={css.cardLabel}>充值到会员卡</label>
                                                    <p style={{ width: 160 }}>
                                                        <Select value={x.cardTypeID} onChange={this.onCardTypeIDChange}>
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
                                                    </p>
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
                                                <p className={disable ? css.disBox: ''}></p>
                                                </div>
                                            </li>
                                        }
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
