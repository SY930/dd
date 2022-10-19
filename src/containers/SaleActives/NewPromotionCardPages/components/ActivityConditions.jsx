import { Checkbox, Row, Col, Form, Icon, Input, Select } from 'antd';
import _ from "lodash";
import { Component } from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../../components/common/BaseForm';
import { ALL_FORM_ITEMS, stageTypeOptions, stageAmountTypeOptions } from '../common/_formItemConfig';
import styles from './addGifts.less';
import AddGifts from './AddGifts';
import { getCardList } from "./AxiosFactory";

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
            conditionForms: {}
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

            nextProps.eventGiftConditionList.forEach(item => {
                let { gifts = [] } = item;
                let id = uuid++;
                let presentType = [...new Set(gifts.map(item => item.presentType))];
                conditionList.push({
                    id,
                    presentType,
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
                    presentType
                };
                // 积分/卡值
                let scoreList = gifts.filter(gift => gift.presentType == 2);
                scoreList = scoreList.map(item => {
                    if (item.giveAmountType == 1) {
                        item.presentValue = parseInt(item.presentValue * 100)
                    }
                    return item;
                })
                scoreformDatas[id + 'score'] = scoreList && scoreList[0];
                let cardNumList = gifts.filter(gift => gift.presentType == 5);
                cardNumList = cardNumList.map(item => {
                    if (item.giveAmountType == 1) {
                        item.presentValue = parseInt(item.presentValue * 100)
                    }
                    return item;
                })
                cardNumformDatas[id + 'cardNum'] = cardNumList && cardNumList[0];
            });

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

    resetFormItems = (data) => {
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

    renderAddGifts = (data) => {
        if (data.presentType && data.presentType.includes(1)) {
            if (data && data.giftList) {
                return <AddGifts
                    pid={data.id}
                    giftList={data.giftList}
                    onPlusGift={this.onPlusGift}
                    onMinusGift={this.onMinusGift}
                    treeData={this.state.treeData}
                    onRef={node => this.conditionForms[data.id + 'gift'] = node}
                    stageType={data.stageType}
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
            conditionList = conditionList.map(item => {
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
        const { conditionList, isShowConditionBtn } = this.state;
        const formKeys = ['stageType', 'presentType'];
        const currentPromotion = this.props.promotion[87];
        const { itemID } = currentPromotion;
        return (
            <Row className={styles.conditionListBox}>
                <Col span={3} style={{ textAlign: 'right', marginLeft: '20px', marginRight: '5px', marginTop: '30px' }}>
                    活动条件
                </Col>
                <Col span={19}>
                    {
                        conditionList.map((conditionItem, index) => (
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
                                    getForm={(form) => { this.conditionForms[conditionItem.id] = form }}
                                    formKeys={formKeys}
                                    formItems={this.resetFormItems(conditionItem)}
                                    formItemLayout={formItemLayout}
                                    onChange={(key, value) => this.onChangeConditionForms(key, value, conditionItem.id)}
                                    formData={this.state.formDatas[conditionItem.id]}
                                />
                                {
                                    this.renderAddGifts(conditionItem)
                                }
                                {
                                    this.renderScore(conditionItem)
                                }
                                {
                                    this.renderCardNum(conditionItem)
                                }
                            </Col>
                        ))
                    }
                </Col>
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
