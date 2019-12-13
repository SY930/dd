import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Select,
    Radio,
    message,
} from 'antd';
import {
    fetchPromotionScopeInfo,
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput'; // 编辑
import CategoryAndFoodSelector from 'containers/SaleCenterNEW/common/CategoryAndFoodSelector';
import ShopSelector from '../../../components/common/ShopSelector';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const CONSUME_AMOUNT_OPTIONS = [
    {
        label: '任意消费满',
        value: '8',
    },
    {
        label: '任意消费每满',
        value: '10',
    },
    {
        label: '活动菜品消费满',
        value: '9',
        showFood: true,
    },
    {
        label: '活动菜品消费每满',
        value: '11',
        showFood: true,
    },
];
const CONSUME_TIMES_OPTIONS = [
    {
        label: '任意菜品数量满',
        value: '4',
    },
    {
        label: '任意菜品数量每满',
        value: '6',
    },
    {
        label: '活动菜品数量满',
        value: '5',
        showFood: true,
    },
    {
        label: '活动菜品数量每满',
        value: '7',
        showFood: true,
    },
];

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const consumeType = `${props.specialPromotionInfo.getIn(['$eventInfo', 'consumeType'], '8')}`;
        this.state = {
            radioType: consumeType >= 8 ? 0 : 1,
            foodScopeList: props.specialPromotionInfo.getIn(['$eventInfo', 'foodScopeList'], Immutable.fromJS([])).toJS(),
            needCount: props.specialPromotionInfo.getIn(['$eventInfo', 'needCount']) || undefined,
            consumeTotalAmount: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalAmount']) || undefined, // 不想显示0
            consumeTotalTimes: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalTimes']) || undefined,
            consumeType,
            shopIDList: props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList'], Immutable.fromJS([])).toJS() || [],
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.getShopSchemaInfo();
        this.props.fetchFoodCategoryInfo();
        this.props.fetchFoodMenuInfo();
    }
    isShowFoodSelector() {
        const {
            consumeType,
        } = this.state;
        return Boolean([ ...CONSUME_AMOUNT_OPTIONS, ...CONSUME_TIMES_OPTIONS ]
        .find(item => item.value === `${consumeType}`)
        .showFood);
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        const { foodScopeList } = this.state;
        if (this.isShowFoodSelector() && !foodScopeList.length) {
            flag = false;
            message.warning('请设置适用菜品')
        }
        if (flag) {
            this.props.setSpecialBasicInfo({
                ...this.state,
                foodScopeList: this.isShowFoodSelector() ? foodScopeList : [],
            });
        }
        return flag;
    }

    handleDefaultCardTypeChange = (defaultCardType) => {
        this.setState({
            defaultCardType
        })
    }

    handlePartInTimesChange = ({ number }) => {
        this.setState({
            partInTimes: number,
        })
    }

    handlePointTotalNumberChange = ({ number }) => {
        this.setState({
            needCount: number,
        })
    }
    handleConsumeTypeChange = (value) => {
        this.setState({
            consumeType: value,
        })
    }
    handleRadioTypeChange = ({ target: { value } }) => {
        this.setState({
            radioType: value,
            consumeType: value === 0 ? '8' : '4',
        })
    }
    handleCategoryAndFoodChange = (val) => {
        const scopeList = [];
        val.foodCategory.forEach((item) => {
            scopeList.push({
                scopeType: '1',
                targetID: item.foodCategoryID,
                brandID: item.brandID,
                targetCode: item.foodCategoryKey,
                targetName: item.foodCategoryName,
            });
        });
        val.excludeDishes.forEach((item) => {
            scopeList.push({
                scopeType: '4',
                targetID: item.itemID,
                brandID: item.brandID,
                targetCode: item.foodKey,
                targetName: item.foodName,
                targetUnitName: item.unit,
            });
        });
        val.dishes.forEach((item) => {
            scopeList.push({
                scopeType: '2',
                targetID: item.itemID,
                brandID: item.brandID,
                targetCode: item.foodKey,
                targetName: item.foodName,
                targetUnitName: item.unit,
            });
        });
        this.setState({
            foodScopeList: scopeList,
        })
    }
    
    renderComboInput() {
        const { radioType, consumeTotalAmount, consumeTotalTimes, consumeType } = this.state;
        const { form: { getFieldDecorator } } = this.props;
        if (radioType === 0) { // 按金额
            return getFieldDecorator('consumeTotalAmount', {
                initialValue: { number: consumeTotalAmount },
                onChange: ({ number }) => this.setState({ consumeTotalAmount: number }),
                rules: [
                    {
                        validator: (rule, v, cb) => {
                            if (!v) {
                                return cb();
                            }
                            v.number > 0? cb() : cb('必须大于0');
                        },
                    }
                ]
            })(
                <PriceInput
                    addonBefore={
                        <Select
                            value={consumeType}
                            onChange={this.handleConsumeTypeChange}
                        >
                            {
                                CONSUME_AMOUNT_OPTIONS.map(({ value, label }) => (
                                    <Option key={value} value={value}>{label}</Option>
                                ))
                            }
                        </Select>
                    }
                    maxNum={5}
                    addonAfter="元，可集一个点"
                />
            )
        }
        return getFieldDecorator('consumeTotalTimes', {
            initialValue: { number: consumeTotalTimes },
            onChange: ({ number }) => this.setState({ consumeTotalTimes: number }),
            rules: [
                {
                    validator: (rule, v, cb) => {
                        if (!v) {
                            return cb();
                        }
                        v.number > 0? cb() : cb('必须大于0');
                    },
                }
            ]
        })(
            <PriceInput
                addonBefore={
                    <Select
                        value={consumeType}
                        onChange={this.handleConsumeTypeChange}
                    >
                        {
                            CONSUME_TIMES_OPTIONS.map(({ value, label }) => (
                                <Option key={value} value={value}>{label}</Option>
                            ))
                        }
                    </Select>
                }
                modal="int"
                maxNum={5}
                addonAfter="份，可集一个点"
            />
        )
    }

    render() {
        const { foodScopeList, shopIDList } = this.state;
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({regFromLimit}) => !!regFromLimit) : [];
        const userCount = this.props.specialPromotionInfo.getIn(['$eventInfo', 'userCount']);
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label={'总计点数'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator('needCount', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || (!v.number && v.number !== 0)) {
                                            return cb('总计点数为必填项');
                                        } else if (!(v.number > 0 && v.number <= 20)) {
                                            return cb('总计点数必须大于0, 不超过20');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: {number: this.state.needCount},
                            onChange: this.handlePointTotalNumberChange
                        })(
                            <PriceInput
                                addonAfter="个"
                                disabled={userCount > 0}
                                modal="int"
                                maxNum={3}
                            />
                        )
                    } 
                </FormItem>
                <FormItem
                    label={'获得方式'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleRadioTypeChange} value={this.state.radioType}>
                        <Radio value={0}>按金额</Radio>
                        <Radio value={1}>按数量</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label=" "
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    { this.renderComboInput() }
                </FormItem>
                {
                    this.isShowFoodSelector() && (
                        <CategoryAndFoodSelector showRequiredMark scopeLst={foodScopeList} onChange={this.handleCategoryAndFoodChange} />
                    )
                }
                <FormItem
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <ShopSelector
                        value={shopIDList}
                        onChange={v => this.setState({ shopIDList: v })}
                        schemaData={this.props.shopSchema.toJS()}
                    />
                </FormItem> 
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        crmCardTypeNew: state.sale_crmCardTypeNew,
        shopSchema: state.sale_shopSchema_New.getIn(['shopSchema']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
        fetchFoodCategoryInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoAC(opts, flag, id))
        },
        fetchFoodMenuInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoAC(opts, flag, id))
        },
        getShopSchemaInfo: opts => dispatch(fetchPromotionScopeInfo(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
