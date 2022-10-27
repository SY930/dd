import { Checkbox, Row, Col, Form, Icon, Input, Select, Radio, Button, Modal } from 'antd';
import _ from "lodash";
import { Component } from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../../components/common/BaseForm';
import AddModal from '../../../../containers/BasicModules/TicketBag/AddModal';
import { ALL_FORM_ITEMS, stageTypeOptions, stageAmountTypeOptions } from '../common/_formItemConfig';
import styles from './addGifts.less';
import AddGifts from './AddGifts';
import { getCardList } from "./AxiosFactory";
import { getAccountInfo } from '../../../../helpers/util'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
}

let uuid = 0;
let giftUuid = 99999;

class ActivityConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditionList: [
                {
                    id: uuid++,
                    presentType: [],
                    stageType: 1,
                    giftPresentType: [],
                    giftList: [
                        {
                            id: giftUuid--,
                        }
                    ],
                },
            ],
            treeData: [],
            loading: false,
            formDatas: {},
            scoreformDatas: {},
            cardNumformDatas: {},
            isShowConditionBtn: true,
            conditionForms: {},
            formKeys: ['stageType', 'presentType', 'giftPresentType', 'couponName', 'totalValue'],
            flag: false,
        }
        this.conditionForms = {};
        this.giftFormRef = ''
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        this.getTreeData();
    }

    componentWillReceiveProps(nextProps) {
        const { eventGiftConditionList } = this.props;
        if (!_.isEqual(eventGiftConditionList, nextProps.eventGiftConditionList)) {
            let conditionList = [];
            let formDatas = {};
            let scoreformDatas = {};
            let cardNumformDatas = {};
            // console.log(nextProps.eventGiftConditionList, 'nextProps.eventGiftConditionList')
            nextProps.eventGiftConditionList.forEach((item) => {
                let { gifts = [] } = item;
                let id = uuid++;
                const presentType = [...new Set(_.cloneDeep(gifts).map((item) => {
                    if (item.presentType == 4) { // 4为券包是优惠券的一种，所以映射为1
                        item.presentType = 1;
                    }
                    return item.presentType
                }))];
                let giftPresentType = ''
                let couponInfo = {};
                const couponType = [...new Set(gifts.filter(itm => itm.presentType == 1 || itm.presentType == 4))]
                if (couponType.length) {
                    giftPresentType = couponType[0].presentType;
                    couponInfo = (couponType || []).find(cur => cur.presentType == 4);
                }

                conditionList.push({
                    id,
                    presentType,
                    giftPresentType,
                    giftList: gifts.map(gift => {
                        return {
                            ...gift,
                            id: giftUuid--
                        }
                    }).filter(item => item.presentType == 1)
                })
                const { stageAmount, stageAmountType, stageType } = item;

                formDatas[id] = {
                    stageAmount,
                    stageAmountType,
                    stageType,
                    presentType,
                    giftPresentType,
                    couponName: {
                        couponPackageID: couponInfo ? couponInfo.giftID : '',
                        couponPackageName: couponInfo ? couponInfo.giftName : '',
                    },
                    totalValue: couponInfo ? couponInfo.totalValue : '',
                };
                // 积分/卡值
                let scoreList = gifts.filter(gift => gift.presentType == 2);
                scoreList = scoreList.map((item) => {
                    if (item.giveAmountType == 1) {
                        item.presentValue = parseInt(item.presentValue * 100)
                    }
                    return item;
                })
                scoreformDatas[id + 'score'] = scoreList && scoreList[0];
                let cardNumList = gifts.filter(gift => gift.presentType == 5);
                cardNumList = cardNumList.map((item) => {
                    if (item.giveAmountType == 1) {
                        item.presentValue = parseInt(item.presentValue * 100)
                    }
                    return item;
                })
                cardNumformDatas[id + 'cardNum'] = cardNumList && cardNumList[0];
            });
            // console.log(formDatas, 'formDatas')
            this.setState({
                conditionList,
                formDatas,
                scoreformDatas,
                cardNumformDatas
            });
        }
    }

    getTreeData() {
        this.setState({
            loading: true
        });
        getCardList({}).then(treeData => {
            this.setState({
                treeData,
                loading: false
            });
        }).catch(error => {
            this.setState({
                loading: false
            });
        })
    }

    onPlus = () => {
        this.setState({
            conditionList: [
                ...this.state.conditionList,
                {
                    id: uuid++,
                    stageType: '',
                    giftList: [
                        {
                            id: giftUuid--,
                        }
                    ]
                }
            ]
        })
    }

    onMinus = (data) => {
        delete this.conditionForms[data.id];
        let conditionList = this.state.conditionList.filter(item => item.id != data.id);
        this.setState({
            conditionList
        });
        Object.keys(this.conditionForms).forEach(key => {
            let form = this.conditionForms[key];
            const { getFieldsValue, setFieldsValue, resetFields } = form;
            let values = _.cloneDeep(getFieldsValue());
            resetFields();
            setFieldsValue(values);
        })
    }

    onSelectBag = (item, id) => {
        if (item.limitStockForEvent == '1') {
            Modal.info({
                title: '注意',
                content: "当前选择券包为历史券包，历史券包库存与活动库存冲突。活动可使用券包库存数为当前活动设置奖品数。",
                iconType: "exclamation-circle",
                okText: "我知道了",
                onOk: () => {
                    const { couponForm } = this.state;
                    couponForm.setFieldsValue({ couponName: item })
                    this.onToggleModal();
                },
            });
            return
        }
        const { couponForm } = this.state;
        couponForm.setFieldsValue({ couponName: item })
        this.onToggleModal();
    }

    onToggleModal = () => {
        this.setState(ps => ({ couponVisible: !ps.couponVisible }));
    }

    showAddModal = (e, form) => {
        this.setState({ couponVisible: true, couponForm: form })
    }

    onChangeGiftPresentType = ({ target }, id) => {
        const { value } = target;
        const form = this.conditionForms[id]
        form.setFieldsValue({ giftPresentType: value })
        this.setState({
            flag: !this.state.flag,
        })
    }


    resetFormItems = (data, id) => {
        let formItems = ALL_FORM_ITEMS;
        formItems.stageType = {
            type: 'custom',
            label: '',
            render: (decorator, form) => {
                let key = this.state.conditionList.map(item => item.id)[0];
                let firstConditionForm = this.conditionForms[key];
                let stageTypeValue = '';
                if (firstConditionForm) {
                    const { getFieldsValue } = firstConditionForm;
                    stageTypeValue = getFieldsValue().stageType
                }
                return (
                    <Col>
                        {
                            decorator({
                                key: 'stageAmount',
                                rules: [
                                    {
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            if (!/^\d+$/.test(value)) {
                                                return callback('请输入数字');
                                            }
                                            if (+value < 1) {
                                                return callback('必须大于0');
                                            }
                                            return callback();
                                        },
                                    },
                                ]
                            })(
                                <Input
                                    addonBefore={
                                        decorator({
                                            key: 'stageType',
                                            defaultValue: stageTypeValue || 1
                                        })(
                                            <Select style={{ width: '140px' }}>
                                                {
                                                    stageTypeOptions.map(item => (
                                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                    addonAfter={
                                        decorator({
                                            key: 'stageAmountType',
                                            defaultValue: 1
                                        })(
                                            <Select style={{ width: '60px' }}>
                                                {
                                                    stageAmountTypeOptions.map(item => (
                                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                />
                            )
                        }
                    </Col>
                )
            },
        }
        formItems.giftPresentType = {
            ...formItems.giftPresentType,
            render: (d, form) => {
                const { presentType = [] } = form.getFieldsValue()
                return presentType.includes(1) ? <FormItem style={{ marginTop: '-6px' }}>
                    {d({
                        onChange: (e) => { this.onChangeGiftPresentType(e, id) },
                    })(
                        <Radio.Group>
                            <Radio value={1}>优惠券</Radio>
                            <Radio value={4}>券包</Radio>
                        </Radio.Group>
                    )}
                </FormItem> : null
            },
        }
        formItems.couponName = {
            ...formItems.couponName,
            render: (d, form) => {
                const { giftPresentType = 1, couponName: formCouponName } = form ? form.getFieldsValue() : {};
                if (giftPresentType == 1) { return null }
                return (
                    <FormItem>
                        {d({
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    if (!value) {
                                        return callback('请选择券包')
                                    }
                                    return callback();
                                },
                            }],
                        })(
                            <div className={styles.couponBox}>
                                <span>{formCouponName && formCouponName.couponPackageName}</span>
                                {formCouponName && formCouponName.couponPackageName && <a data-id={form} href="javascript:;" onClick={(e) => { this.showAddModal(e, form) }}>修改</a>}
                                {!formCouponName && <Button data-id={form} onClick={(e) => { this.showAddModal(e, form) }}>添加券包</Button>}
                            </div>

                        )}
                    </FormItem>
                )
            },
        }
        return formItems;
    }

    onPlusGift = (data) => {
        console.log('onPlusGift', data);
    }

    onMinusGift = (pid) => {
        let presentType = this.state.conditionList[pid].presentType.filter(item => item != 1);
        this.state.conditionList[pid].presentType = presentType;
        this.setState({
            conditionList: this.state.conditionList
        })
        this.conditionForms[pid].setFieldsValue({
            presentType
        })
    }

    renderAddGifts = (data, id) => {
        const form = this.conditionForms[id]
        const { giftPresentType = 1 } = form ? form.getFieldsValue() : {}

        if (data.presentType && data.presentType.includes(1) && giftPresentType == 1) {
            if (data && data.giftList) {
                return <AddGifts
                    pid={data.id}
                    giftList={data.giftList}
                    onPlusGift={this.onPlusGift}
                    onMinusGift={this.onMinusGift}
                    treeData={this.state.treeData}
                    onRef={node => this.conditionForms[data.id + 'gift'] = node}
                    stageType={data.stageType}
                    giftPresentType={giftPresentType}
                />
            }
        }
    }

    renderScore = (data) => {
        if (data.presentType && data.presentType.includes(2)) {
            let formItems = {
                score: {
                    type: 'custom',
                    label: '赠送积分',
                    labelCol: { span: 4 },
                    render: (decorator, form) => {
                        const { getFieldsValue } = form;
                        const giveAmountTypeValue = getFieldsValue() && getFieldsValue().giveAmountType;
                        return decorator({
                            key: 'presentValue',
                            rules: [
                                { pattern: /^([1-9]\d{0,1}|100)$/, message: '赠送积分请输入1-100的整数' },
                                { required: true, message: '赠送积分必填' }
                            ]
                        })(
                            <Input
                                addonBefore={
                                    decorator({
                                        key: 'giveAmountType',
                                        defaultValue: 1
                                    })(
                                        <Select style={{ width: '110px' }}>
                                            <Option key={0} value={1}>按比例返积分</Option>
                                            <Option key={1} value={2}>返固定积分</Option>
                                        </Select>
                                    )
                                }
                                addonAfter={giveAmountTypeValue == 2 ? '' : '%'} />
                        )
                    }
                }
            }
            return (
                <Col span={24}>
                    <BaseForm
                        key={data.id + 'score'}
                        getForm={(form) => { this.conditionForms[data.id + 'score'] = form }}
                        formKeys={['score']}
                        formItems={formItems}
                        formItemLayout={formItemLayout}
                        formData={this.state.scoreformDatas[data.id + 'score']}
                    />
                </Col>

            )
        }
    }


    renderCardNum = (data) => {
        if (data.presentType && data.presentType.includes(5)) {
            let formItems = {
                cardNum: {
                    type: 'custom',
                    label: '赠送卡值',
                    labelCol: { span: 4 },
                    render: (decorator, form) => {
                        const { getFieldsValue } = form;
                        const giveAmountTypeValue = getFieldsValue() && getFieldsValue().giveAmountType;
                        return decorator({
                            key: 'presentValue',
                            rules: [
                                { pattern: /^([1-9]\d{0,1}|100)$/, message: '赠送卡值请输入1-100的整数' },
                                { required: true, message: '赠送卡值必填' }
                            ]
                        })(
                            <Input
                                addonBefore={
                                    decorator({
                                        key: 'giveAmountType',
                                        defaultValue: 1
                                    })(
                                        <Select style={{ width: '110px' }}>
                                            <Option key={1} value={1}>按比例返卡值</Option>
                                            <Option key={2} value={2}>返固定卡值</Option>
                                        </Select>
                                    )
                                }
                                addonAfter={giveAmountTypeValue == 2 ? '' : '%'} />
                        )
                    }
                }
            }
            return (
                <Col span={24}>
                    <BaseForm
                        key={data.id + 'cardNum'}
                        getForm={(form) => { this.conditionForms[data.id + 'cardNum'] = form }}
                        formKeys={['cardNum']}
                        formItems={formItems}
                        formItemLayout={formItemLayout}
                        formData={this.state.cardNumformDatas[data.id + 'cardNum']}
                    />
                </Col>
            )
        }
    }

    onChangeConditionForms = (key, value, id, formKeys) => {
        if (key == 'presentType') {
            let conditionList = this.state.conditionList;
            conditionList = conditionList.map((item) => {
                if (item.id == id) {
                    item.presentType = value || [];
                }
                return item
            });
            this.setState({
                conditionList
            })
        } else if (key == 'stageType') { // 活动方式
            let singleConditionItem = this.state.conditionList[0];
            singleConditionItem.stageType = value;
            this.conditionForms[singleConditionItem.id].setFieldsValue({
                stageType: value
            })
            this.setState({
                conditionList: [singleConditionItem]
            });
            // 每满
            if (value == 3 || value == 4) {
                this.props.showActivityRange(true);
            } else {
                this.props.showActivityRange(false);
            }
            if (value == 2 || value == 4) {
                const form = this.conditionForms[singleConditionItem.id];
                this.setState({
                    isShowConditionBtn: false,
                });
                form.setFieldsValue({
                    stageType: value
                });
            } else {
                this.setState({
                    isShowConditionBtn: true
                })
            }
        }
    }

    render() {
        const { conditionList, isShowConditionBtn, formKeys, couponForm } = this.state;
        const currentPromotion = this.props.promotion[87];
        const { itemID } = currentPromotion;
        return (
            <Row className={styles.conditionListBox}>
                <Col span={3} style={{ textAlign: 'right', marginLeft: '20px', marginRight: '5px', marginTop: '30px' }}>
                    活动条件
                </Col>
                <Col span={19}>
                    {
                        conditionList.map((conditionItem, index) => {
                            const conditionItemId = conditionItem.id;
                            return (
                                <Col className={styles.conditionItemBox} key={conditionItem.id} span={24}>
                                    {
                                        (isShowConditionBtn && !itemID) && <span className={styles.btnBox}>
                                            {
                                                (conditionList.length == index + 1 && conditionList.length < 5) &&
                                                <span className={styles.plusBtn} onClick={this.onPlus}></span>
                                            }
                                            {
                                                (conditionList.length > 1) &&
                                                <span className={styles.minusBtn} onClick={() => this.onMinus(conditionItem)}></span>
                                            }
                                        </span>
                                    }
                                    <BaseForm
                                        key={conditionItem.id}
                                        getForm={(form) => { this.conditionForms[conditionItemId] = form }}
                                        formKeys={formKeys}
                                        formItems={this.resetFormItems(conditionItem, conditionItemId)}
                                        formItemLayout={formItemLayout}
                                        onChange={(key, value) => this.onChangeConditionForms(key, value, conditionItem.id)}
                                        formData={this.state.formDatas[conditionItem.id]}
                                    />
                                    {
                                        this.renderAddGifts(conditionItem, conditionItem.id)
                                    }
                                    {
                                        this.renderScore(conditionItem)
                                    }
                                    {
                                        this.renderCardNum(conditionItem)
                                    }
                                </Col>
                            )
                        })
                    }
                </Col>
                {this.state.couponVisible &&
                    <AddModal
                        groupID={getAccountInfo().groupID}
                        onAdd={(value) => { this.onSelectBag(value, couponForm) }}
                        onClose={this.onToggleModal}
                    />}
                {
                    itemID && <Col className={styles.conditionListBoxPop}></Col>
                }
            </Row>
        )
    }
}

const mapStateToProps = ({ newPromotionCardPagesReducer }) => {
    return {
        promotion: newPromotionCardPagesReducer.get('promotion').toJS(),
    }
};

export default connect(mapStateToProps, null)(ActivityConditions)

