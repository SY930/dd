import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import MutliGift from './MutliGift';
import TicketBag from '../TicketBag';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class Lottery extends Component {
    state = {
        tabKey: '1',
        cardList: [],
    }
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
        const { value } = this.props;
        if(!value[0]){ return null}
        const { length } = value;
        return (
                <div className={css.mainBox}>
                    <div className={css.addBox}>
                        <Button type="primary" onClick={this.add}>
                            <Icon type="plus" />添加奖项
                        </Button>
                        <p>最多可添加7项</p>
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
                                return (<TabPane tab={name} key={x.id} closable={close}>
                                    <ul>
                                        <li style={{ display: 'flex' }}>
                                            <label>中奖概率</label>
                                            <p><Input value={x.giftOdds} addonAfter="%" onChange={this.onGiftOddsChange} style={{ width: 100 }} /></p>
                                        </li>
                                        <li style={{ display: 'flex' }}>
                                            <Checkbox checked={x.isPoint} onChange={this.onPointChange}>赠送积分</Checkbox>
                                            {x.isPoint &&
                                                <div style={{ display: 'flex' }}>
                                                    <p><Input value={x.presentValue} style={{ width: 60 }} addonAfter="积分" onChange={this.onPresentValueChange} /></p>
                                                    <label style={{ width: 100 }}>充值到会员卡</label>
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
                                            <Checkbox checked={x.isTicket} onChange={this.onTicketChange}>赠送优惠券</Checkbox>
                                        </li>
                                        {x.isTicket &&
                                            <li>
                                                <p className={css.ticketBox}>
                                                <RadioGroup value={x.presentType} onChange={this.onTypeChange}>
                                                    <RadioButton value="1">独立优惠券</RadioButton>
                                                    <RadioButton value="4">券包</RadioButton>
                                                </RadioGroup>
                                                </p>
                                                {x.presentType === '1' ?
                                                    <MutliGift value={x.giftList} onChange={this.onGiftChange} /> :
                                                    <TicketBag value={x.bagList} onChange={this.onBagChange} />
                                                }
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
