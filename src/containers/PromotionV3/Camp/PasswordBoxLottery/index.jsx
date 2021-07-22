import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
import CropperUploader from 'components/common/CropperUploader'
import MutliGift from './MutliGift';
import PriceInput from "../../../SaleCenterNEW/common/PriceInput";
// import TicketBag from '../TicketBag';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class Lottery extends Component {
    state = {
        tabKey: '1',
        cardList: [],
        passWordList:[]
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
        if(value[9]) { return; }
        const list = [...value];
        const len = value.length;
        const id = `${len + 1}`; // 根据索引生成id，方便回显时遍历
        list.push({ id, participateMark: '', giftTotalCount:'',presentValue: '', presentType: '1', giftList: [{ id: '001', effectType: '1' }] });
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
        this.setState({
            passWordList:list
        })
        onChange(list);
    }
    onGiftOddsChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ participateMark: value });
    }
    onGiftTotalCountChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ giftTotalCount: value ? Number(value) : '' });
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
        console.log(giftList,'giftList-------------')
        this.onAllChange({ giftList });
    }
    render() {
        const { tabKey, cardList,passWordList } = this.state;
        const { value = [], decorator } = this.props;
        // if(!value[0]){ return null}
        const { length } = value;
        const disable = value[0] && value[0].userCount > 0 ;    // 如果被用了，不能编辑
        let noUse = false;
        if(length == 10){
            noUse = true
        }
        return (
            <div className={css.mainBox}>
                <div className={css.addBox}>
                    <Button type="primary" disabled={disable || noUse} onClick={this.add}>
                        <Icon type="plus" />添加口令
                    </Button>
                    <p>最多可添加10个口令</p>
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
                            const name = `口令${i + 1}`;
                            let gifts = x.giftList;
                            // 防止回显没数据不显示礼品组件
                            if(!gifts[0]){
                                gifts.push({ id: '001', effectType: '1' });
                            }
                            return (<TabPane tab={name} key={x.id} closable={ disable ? false : close}>
                                <ul style={{ position: 'relative' }}>
                                    <li className={css.oddsBox} style={{marginLeft:24}}>
                                        <FormItem label="口令">
                                            {
                                                decorator({
                                                    key: 'participateMark' + i,
                                                    initialValue: x.participateMark||undefined,
                                                    rules: [{
                                                        required: true,
                                                        validator: (rule, v, cb) => {
                                                            if(!v){
                                                                return cb('请输入口令');
                                                            }
                                                            let isRepeat = passWordList.some((item) => item.participateMark == v);
                                                            if(isRepeat){
                                                                return cb('口令不可重复');
                                                            }
                                                            if (v && v.length > 20) {
                                                                return cb('最多可输入20个字符');
                                                            }
                                                            cb();
                                                        },
                                                    }],
                                                    onChange: this.onGiftOddsChange,

                                                })(
                                                    <Input
                                                        placeholder="请输入口令"
                                                        style={{width:175}}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </li>
                                    <li className={css.oddsBox} style={{marginLeft:10}}>
                                        <FormItem label="礼品总数">
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
                                    

                                    <li>
                                        <p className={css.ticketBox}>
                                            {/* <RadioGroup disabled={disable} value={x.presentType} onChange={this.onTypeChange}>
                                                <RadioButton value="1">独立优惠券</RadioButton>
                                                <RadioButton value="4">券包</RadioButton>
                                            </RadioGroup> */}
                                        </p>
                                        <div style={{ position: "relative" }}>
                                            {x.presentType === '1' ?
                                                <MutliGift value={gifts} onChange={this.onGiftChange} /> :null
                                            }
                                        </div>
                                    </li>

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