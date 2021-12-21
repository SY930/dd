import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Select,
    Radio,
    message,
    Switch
} from 'antd';
import {
    fetchPromotionScopeInfo,
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterSetPromotionDetailAC
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput'; // 编辑
import CategoryAndFoodSelector from 'containers/SaleCenterNEW/common/CategoryAndFoodSelector';
import ShopSelector from '../../../components/ShopSelector';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';
import { axios } from '@hualala/platform-base';
import NoShareBenifit  from 'containers/SaleCenterNEW/common/NoShareBenifit.jsx';
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
            isRequire: true,
            foodPriceType: '0',
            isBenifitActive:false,
            eventMutexDependRuleInfos: props.mySpecialActivities.getIn(['eventMutexDependRuleInfos'], Immutable.fromJS([])).toJS() || [],
            benifitType:'1',
        }
        this.selectNoShareBenifit = this.selectNoShareBenifit.bind(this);
    }

    componentDidMount() {
        const {eventMutexDependRuleInfos} = this.state;
        console.log(eventMutexDependRuleInfos,'eventMutexDependRuleInfos---------------')
        if(eventMutexDependRuleInfos && eventMutexDependRuleInfos.length > 0){
            this.setState({
                isBenifitActive: true,
                benifitType: eventMutexDependRuleInfos[0].targetID == 0 ? '1' : '2'
            })
            if(eventMutexDependRuleInfos[0].targetID != 0){
                this.props.setPromotionDetail({
                    mutexPromotions: eventMutexDependRuleInfos.map((promotion) => {
                        return {
                            promotionIDStr: promotion.targetID || '',
                            // sharedType: '10',
                            finalShowName: promotion.targetName || SALE_LABEL.k5m3onpk,
                        }
                    }),
                });
            }
        }
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.getShopSchemaInfo();
        this.props.fetchFoodCategoryInfo();
        this.props.fetchFoodMenuInfo();
        this.loadShopSchema();
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
        const { foodScopeList,eventMutexDependRuleInfos } = this.state;
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
    handleFoodPriceTypeChange = ({ target: { value } }) => {
        this.setState({
            foodPriceType: value,
        })
    }
    handleBenifitTypeChange = ({ target: { value } }) => {
        if(value == '1'){
            let allArr = [{
                mutexDependType:1,
                ruleType:10,
                targetID:0,
                targetName:'',
                sharedType:'10'
            }]
            this.setState({
                eventMutexDependRuleInfos:allArr
            })
        }
        this.setState({
            benifitType: value,
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
    handleBenifitSwitchChange = (value) => {
        console.log(value,'vaalue00000000')
        if(value){
            this.setState({
                eventMutexDependRuleInfos:[{
                    mutexDependType:1,
                    ruleType:10,
                    targetID:0,
                    targetName:'',
                    sharedType:'10'
                }]
            })
        }
        this.setState({
            isBenifitActive: value,
        })
    }
    selectNoShareBenifit(val) {
        console.log(val,'val00000000000000000======')
        if(val && val.length > 0){
            let insertArr = [];
            val.forEach((item) => {
                insertArr.push({
                    mutexDependType:1,
                    ruleType:10,
                    targetID:item.promotionIDStr,
                    targetName:item.finalShowName,
                    sharedType:item.sharedType
                })
            })
            this.setState({
                eventMutexDependRuleInfos: insertArr,
            });
            this.props.setPromotionDetail({
                blackList: this.state.blackListRadio != '0',
                mutexPromotions: val.map((promotion) => {
                    return {
                        promotionIDStr: promotion.promotionIDStr || '',
                        sharedType: promotion.sharedType ? promotion.sharedType : '10',
                        finalShowName: promotion.finalShowName || SALE_LABEL.k5m3onpk,
                    }
                }),
            });
        }
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
    async loadShopSchema() {
        const { data } = await axios.post('/api/shopapi/schema',{});
        const { shops } = data;
        this.countIsRequire(shops);
    }
    countIsRequire(shopList){
        const { shopSchema, specialPromotionInfo } = this.props;
        const { size } = shopSchema.getIn(['shops']);       // 总店铺数
        const eventInfo = specialPromotionInfo.getIn(['$eventInfo']).toJS();
        const oldShops = eventInfo.shopIDList || []; // 存储的店铺数
        const isOld = eventInfo.itemID; // 有这个id 表明是 编辑数据
        const { length } = shopList;
        // a 新建营销活动，先获取此集团的所有店铺数据，如果此用户为全部店铺权限，表单内店铺组件非必选
        // 如果用户权限为某几个店铺的权限，组件为必选项。
        // b 编辑活动，全部店铺权限用户非必选
        // 店铺受限用户，首先判断历史数据是否是全部店铺的数据，如果是，店铺组件为非必选。
        // 反之，店铺为必选，用户必选一个用户权限之内的店铺选项。
        if(!isOld){
            if(length<size){
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        } else {
            if(oldShops[0] && length<size){
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        }
    }
    render() {
        const { isRequire, shopStatus, foodScopeList, shopIDList } = this.state;
        const convertShopIdList = shopIDList.length ? shopIDList.join(',').split(',') : [];
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({regFromLimit}) => !!regFromLimit) : [];
        const { isNew } = this.props;
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
                                disabled={!isNew}
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
                    this.state.radioType == '1' ? 
                        <FormItem
                            label={'数量核算'}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup onChange={this.handleFoodPriceTypeChange} value={this.state.foodPriceType}>
                                <Radio value={'0'}>无限制</Radio>
                                <Radio value={'1'}>仅原价菜品集点</Radio>
                            </RadioGroup>
                        </FormItem> : null
                }
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
                    required={isRequire}
                    validateStatus={shopStatus ? 'success' : 'error'}
                    help={shopStatus ? null : '不选默认所有店铺可用'}
                >
                    <ShopSelector
                        value={convertShopIdList}
                        onChange={v => {
                            this.setState({ shopIDList: v, shopStatus: v.length > 0 })}}
                        // schemaData={this.props.shopSchema.toJS()}
                    />
                </FormItem>
                <FormItem
                    label={'与优惠券不共享'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{marginTop:'15'}}
                >
                    <div className={styles.couponSwitch}>
                        <Switch checked={this.state.isBenifitActive} checkedChildren="开" unCheckedChildren="关" onChange={this.handleBenifitSwitchChange}  />
                        {/* <span style={{marginLeft:12}}>仅小程序订单执行优惠不共享,其他渠道的订单,用券后仍可正常集点</span> */}
                    </div>
                    
                </FormItem>
                {
                    this.state.isBenifitActive ? 
                        <FormItem
                            label={' '}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup onChange={this.handleBenifitTypeChange} value={this.state.benifitType}>
                                <Radio value={'1'}>与所有优惠券不共享</Radio>
                                <Radio value={'2'}>与部分优惠券不共享</Radio>
                            </RadioGroup>
                        </FormItem> 
                        : null
                }
                <FormItem
                    label="不共享优惠"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={isRequire}
                    validateStatus={shopStatus ? 'success' : 'error'}
                    help={shopStatus ? null : '至少选择一项优惠'}
                    style={{ display:this.state.benifitType == '2' ? 'block' : 'none' }}
                >
                    <NoShareBenifit onChange={(val) => {
                        this.selectNoShareBenifit(val)
                    }}
                    />
                </FormItem>
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        crmCardTypeNew: state.sale_crmCardTypeNew,
        shopSchema: state.sale_shopSchema_New.getIn(['shopSchema']),
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
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
