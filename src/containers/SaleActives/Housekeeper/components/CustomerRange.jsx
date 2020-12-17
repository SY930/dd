import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Form, Select, message, TreeSelect } from 'antd';
import styles from '../housekeeper.less'
import { axios, getStore } from '@hualala/platform-base';
import _ from 'lodash'

const giftTypeName = [
    { label: '全部', value: '' },
    { label: '代金券', value: '10' },
    { label: '菜品优惠券', value: '20' },
    { label: '菜品兑换券', value: '21' },
    { label: '实物礼品券', value: '30' },
    { label: '会员充值券', value: '40' },
    { label: '会员积分券', value: '42' },
    { label: '会员权益券', value: '80' },
    { label: '礼品定额卡', value: '90' },
    { label: '线上礼品卡', value: '91' },
    { label: '买赠券', value: '110' },
    { label: '折扣券', value: '111' },
    { label: '现金红包', value: '113' },
    { label: '配送券', value: '22' },
];
const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];

const Option = Select.Option;
const FormItem = Form.Item;
const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

class CustomerRange extends Component {
    state = {
        curId: 10,
        treeData: this.props.treeData || [],
    }
    
    componentDidMount() {
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        this.getCardList({groupID}).then((x) => {
            this.setState({ treeData: x });
        })
    }
    
    // componentWillReceiveProps(nextProps){
    //     let {value} = nextProps
    //     if(value != this.props.value){
    //         // this.setState({curId: value.length - 1})
    //     }
    // }

    getCardList = async (data) => {
        const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
        const params = { service, type, data, method };
        const response = await axios.post(url + method, params);
        const { code, message: msg, data: obj } = response;
        if (code === '000') {
            const { crmGiftTypes = [] } = obj;
            return this.proGiftTreeData(crmGiftTypes);
        }
        message.error(msg);
        return [];
    }

    proGiftTreeData = (giftTypes) => {
        const _giftTypes = _.filter(giftTypes, (giftItem) => {
            if (giftItem.giftType == 10 || giftItem.giftType == 20 || giftItem.giftType == 21 || giftItem.giftType == 30 || giftItem.giftType == 40 || giftItem.giftType == 42 || giftItem.giftType == 80 || giftItem.giftType == 110 || giftItem.giftType == 111 || giftItem.giftType == 22) return true;
            return false;
        });
        let treeData = [];
        const gifts = [];
        _giftTypes.map((gt, idx) => {
            const giftTypeItem = _.find(giftTypeName, { value: String(gt.giftType) }) || {};
            treeData.push({
                label: giftTypeItem.label || '--',
                key: gt.giftType,
                children: [],
            });
            gt.crmGifts.map((gift) => {
                treeData[idx].children.push({
                    label: gift.giftName,
                    value: String(gift.giftItemID),
                    key: gift.giftItemID,
                    giftValue: gift.giftValue,
                    giftType: gt.giftType,
                });
                gifts.push({
                    label: gift.giftName,
                    value: String(gift.giftItemID),
                });
            });
        });
        return treeData = _.sortBy(treeData, 'key');
    }
    
    addEventRule = () => {
        const { value = [], onChange } = this.props;
        let {curId} = this.state
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        // 数量限制
        // if(value[3]) { return; }
        const list = [...value];
        const len = value.length;
        const id = `${len + 1}`; // 根据索引生成id，方便回显时遍历
        // 保持循环id  key值唯一性
        let curIds = curId + 1
        list.push({ rangeIndex: curIds, groupID, amountStart: 0, amountEnd: 0, giftID: undefined, giftName: ''});
        this.setState({ curId: curIds });
        onChange(list);
    }

    delEventRule = (index) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const idx = index;
        list.splice(idx, 1);
        onChange(list);
    }

    onAllChange(data, index){
        const { value, onChange } = this.props;
        const list = [...value];
        const item = list[index];
        list[index] = { ...item, ...data };
        
        onChange(list);
    }

    amountStartChange = ({ target }, index) => {
        const { value } = target;
        this.onAllChange({ amountStart: value }, index);
    }

    amountEndChange = ({ target }, index) => {
        const { value } = target;
        this.onAllChange({ amountEnd: value }, index);
    }

    giftChange = (value, label, extra, index) => {
        let {treeData} = this.state
        let giftName = ''
        treeData.map(item => {
            let {children} = item
            children.map(i => {
                if(value == i.value){
                    giftName = i.label;
                }
            })
        });
        this.onAllChange({ giftName, giftID: value }, index);
    }

    render() {
        const { treeData, cardList } = this.state;
        const { value, decorator, form, getForm } = this.props;
        const { getFieldDecorator } = form

        if (typeof getForm === 'function') {
            getForm(form)
        }

        return (
            <div className={styles.mainBox}>
                <Form layout="inline">
                    {
                        value && value.map((item, index) => {
                            let {amountStart, amountEnd, giftID} = item
                            return (
                                <div className={styles.singleItem} key={item.rangeIndex}>
                                    <FormItem 
                                        label="单均消费"
                                    >
                                        {
                                            getFieldDecorator(`amountStart_${item.rangeIndex}`, {
                                                // key: 'amountStart',
                                                rules: [{
                                                    required: true, message: '数值不能为空',
                                                }, {
                                                    pattern: /^(([1-9]\d{0,7}))?$/,
                                                    message: '请输入大于零的8位以内整数',
                                                }],
                                                initialValue: amountStart,
                                            })(<Input onChange={(e)=>{this.amountStartChange(e, index)}} placeholder="请输入金额" addonAfter="元" />)
                                        }
                                    </FormItem>
                                    <FormItem 
                                        label="至"
                                    >
                                        {
                                            getFieldDecorator(`amountEnd_${item.rangeIndex}`, {
                                                rules: [{
                                                    required: true, message: '数值不能为空',
                                                }, {
                                                    pattern: /^(([1-9]\d{0,7}))?$/,
                                                    message: '请输入大于零的8位以内整数',
                                                }],
                                                initialValue: amountEnd,
                                            })(<Input  onChange={(e)=>{this.amountEndChange(e, index)}} placeholder="请输入金额" addonAfter="元" />)
                                        }
                                    </FormItem>
                                    <FormItem 
                                        label="赠送优惠券"
                                    >
                                        {
                                            getFieldDecorator(`giftID_${item.rangeIndex}`, {
                                                rules: [{
                                                    required: true, message: '不能为空',
                                                }],
                                                initialValue: giftID,
                                            })(
                                                <TreeSelect
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    style={{width: '230px'}}
                                                    treeData={treeData}
                                                    placeholder="请选择礼品名称"
                                                    showSearch={true}
                                                    treeNodeFilterProp="label"
                                                    allowClear={true}
                                                    onChange={(value, label, extra)=>{this.giftChange(value, label, extra, index)}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem  label=" " >
                                        <span className={styles.iconWrap}>
                                            {
                                                <Icon onClick={this.addEventRule} type="plus-circle-o" />
                                            }
                                            {
                                                <Icon onClick={()=>{this.delEventRule(index)}} type="minus-circle-o" />
                                            }
                                        </span>
                                    </FormItem>
                                </div>
                            )
                        })
                    }
                </Form>
            </div>

        )
    }
}

export default Form.create()(CustomerRange)
