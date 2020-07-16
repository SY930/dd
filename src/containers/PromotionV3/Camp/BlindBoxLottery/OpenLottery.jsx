import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import CropperUploader from 'components/common/CropperUploader'
import MutliGift from './MutliGift';
import TicketBag from '../TicketBag';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class OpenLottery extends Component {
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
        if(value[9]) { return; }
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
            count += +value.giftOdds;
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
        const { tabKey, cardList, disable } = this.state;
        const { value, decorator } = this.props;
        return (
                <div className={css.mainBox}>
                    <div>
                        <ul style={{ position: 'relative' }}>
                            <li className={css.pointBox}>
                                <Checkbox checked={value.isPoint} onChange={this.onPointChange}>赠送积分</Checkbox>
                                {value.isPoint &&
                                    <div style={{ display: 'flex', width: 400 }}>
                                        <FormItem label="">
                                            {
                                                decorator({
                                                    key: 'presentValue',
                                                    value: value.presentValue,
                                                    defaultValue: value.presentValue,
                                                    rules: [{
                                                        required: true,
                                                        pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
                                                        message: '请输入0.01~100000数字，支持两位小数',
                                                    }],
                                                })(
                                                    <p style={{ width: 120 }}><Input value={value.presentValue} addonAfter="积分" onChange={this.onPresentValueChange}/></p>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem label="充值到会员卡">
                                            {
                                                decorator({
                                                    key: 'cardTypeID',
                                                    value: value.cardTypeID || '',
                                                    defaultValue: value.cardTypeID || '',
                                                    rules: [{
                                                        required: true,
                                                        message: '不能为空',
                                                    }],
                                                    onChange:this.onCardTypeIDChange,
                                                })(
                                                    <Select style={{ width: 160 }} value={value.cardTypeID || ''} onChange={this.onCardTypeIDChange}>
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
                            <li>
                                <Checkbox disabled={disable} checked={value.isTicket} onChange={this.onTicketChange}>赠送优惠券</Checkbox>
                            </li>
                            {value.isTicket &&
                                <li>
                                    <p className={css.ticketBox}>
                                    <RadioGroup disabled={disable} value={value.presentType} onChange={this.onTypeChange}>
                                        <RadioButton value="1">独立优惠券</RadioButton>
                                        <RadioButton value="4">券包</RadioButton>
                                    </RadioGroup>
                                    </p>
                                    <div style={{ position: "relative" }}>
                                    {value.presentType === '1' ?
                                        <MutliGift value={gifts} onChange={this.onGiftChange} /> :
                                        <TicketBag value={value.bagList} onChange={this.onBagChange} />
                                    }
                                    </div>
                                </li>
                            }
                            <p className={disable ? css.disBox: ''}></p>
                        </ul>
                    </div>
                </div>

        )
    }
}

export default OpenLottery
