import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Checkbox, Radio, Select, Form, Row, Col } from 'antd';
import css from './style.less';
import { formItemLayout, formKeys, formItems, } from './Common';
import { getCardTypeList } from './AxiosFactory';
// import CropperUploader from 'components/common/CropperUploader'
import MutliGift from './MutliGift';
// import TicketBag from '../TicketBag';

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

    getCardType() {
        getCardTypeList().then(cardList => {
            this.setState({ cardList });
        });
    }
    onAllChange(data){
        const { tabKey } = this.state;
        const { value, onChange } = this.props;
        const list = { ...value, ...data };
        
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
    render() {
        const { value, decorator } = this.props;
        const disable = value && value.userCount > 0;    // 如果被用了，不能编辑
        let {giftList = []} = value
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
                                </div>
                            }
                        </li>
                        <li>
                            <Checkbox disabled={disable} checked={value.isTicket} onChange={this.onTicketChange}>赠送优惠券</Checkbox>
                        </li>
                        {value.isTicket &&
                            <li>
                                <p className={css.ticketBox}>
                                </p>
                                <div style={{ position: "relative" }}>
                                {value.presentType === '1' ?
                                    <MutliGift value={giftList} onChange={this.onGiftChange} /> : null
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
