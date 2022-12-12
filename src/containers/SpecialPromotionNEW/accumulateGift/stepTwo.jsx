import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Select,
    Radio,
    message,
    Switch,
    Checkbox
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
import NoShareBenifit from 'containers/SaleCenterNEW/common/NoShareBenifit.jsx';
import OnSaleNoShareBenifit from 'containers/SaleActives/NewPromotionCardPages/components/OnSaleNoShareBenifit.jsx';
import { BASIC_PROMOTION_MAP } from "../../../constants/promotionType";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const allowGroup = ['39932', '189702', '11157'];//集点卡活动与券互斥功能开放范围
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
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
//请求获取所有基础营销活动
async function fetchAllPromotionList(data) {
    const method = '/promotion/docPromotionService_query.ajax';
    const params = {
        service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
        type: 'post',
        data,
        method,
    };
    const response = await axios.post('/api/v1/universal?' + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        if(obj && obj.promotionLst && obj.promotionLst.length > 0){
            return obj.promotionLst.map(promotion => ({
                value: promotion.promotionIDStr,
                label: `${promotion.promotionName}`,
                type: `${promotion.promotionType}`,
                activityType: '10',
                activitySource: '1',
                basicType: `${promotion.promotionType}`,
              })).filter(item => AVAILABLE_PROMOTIONS.includes(item.type))
        } else{
            return []
        }
    }
    message.error(msg);
    return [];
}

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const consumeType = `${props.specialPromotionInfo.getIn(['$eventInfo', 'consumeType'], '8')}`;
        this.state = {
            radioType: consumeType >= 8 ? 0 : 1,
            amountType: props.specialPromotionInfo.getIn(['$eventInfo', 'amountType']) || 2,//集点卡金额核算字段
            foodScopeList: props.specialPromotionInfo.getIn(['$eventInfo', 'foodScopeList'], Immutable.fromJS([])).toJS(),
            needCount: props.specialPromotionInfo.getIn(['$eventInfo', 'needCount']) || undefined,
            groupID: props.groupID || undefined,
            consumeTotalAmount: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalAmount']) || undefined, // 不想显示0
            consumeTotalTimes: props.specialPromotionInfo.getIn(['$eventInfo', 'consumeTotalTimes']) || undefined,
            consumeType,
            shopIDList: props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList'], Immutable.fromJS([])).toJS() || [],
            isRequire: true,
            foodPriceType: props.specialPromotionInfo.getIn(['$eventInfo', 'foodPriceType']) || '0',
            isBenifitActive: false,
            eventMutexDependRuleInfos: !props.isNew && props.mySpecialActivities.getIn(['eventMutexDependRuleInfos'], Immutable.fromJS([])) ? props.mySpecialActivities.getIn(['eventMutexDependRuleInfos'], Immutable.fromJS([])).toJS() : [],
            benifitType: '1',
            benefitArr: [],
            isPromotionActive: false,//与促销活动不共享
            promotionType: '1',
            isRightActive: false,//与会员权益不共享
            isAssetActive: false,//与会员资产不共享
            promotionLst: [],
        }
        this.selectNoShareBenifit = this.selectNoShareBenifit.bind(this);
    }

    componentDidMount() {
        const { eventMutexDependRuleInfos, groupID } = this.state;
        if (eventMutexDependRuleInfos && eventMutexDependRuleInfos.length > 0) {
            const benefitArr = eventMutexDependRuleInfos.filter(item => item.ruleType == 10)
            const promotionArr = eventMutexDependRuleInfos.filter(item => item.ruleType == 20).map(item => item.targetID)
            const rightArr = eventMutexDependRuleInfos.filter(item => item.ruleType == 31 || item.ruleType == 32).map(item => item.ruleType)
            const assetArr = eventMutexDependRuleInfos.filter(item => item.ruleType == 33 || item.ruleType == 34).map(item => item.ruleType)
            if(benefitArr && benefitArr.length) {
                this.setState({
                    isBenifitActive: true,
                    benifitType: benefitArr[0].targetID == 0 ? '1' : '2',
                    benefitArr,
                })
            }
            if(promotionArr && promotionArr.length) {
                this.setState({
                    isPromotionActive: true,
                    promotionType: promotionArr[0] == 0 ? '1' : '2',
                    onSaleNoShareBenifit: promotionArr
                })
            }
            if(rightArr && rightArr.length) {
                this.setState({
                    isRightActive: true,
                    rightArr,
                })
            }
            if(assetArr && assetArr.length) {
                this.setState({
                    isAssetActive: true,
                    assetArr,
                })
            }
            if (benefitArr[0].targetID != 0) {
                this.props.setPromotionDetail({
                    mutexPromotions: benefitArr.map((promotion) => {
                        return {
                            promotionIDStr: promotion.targetID || '',
                            // sharedType: '10',
                            finalShowName: promotion.targetName || SALE_LABEL.k5m3onpk,
                        }
                    }),
                });
            }
        } else {
            this.setState({
                isBenifitActive: false,
                isPromotionActive: false,
                isRightActive: false,
                isAssetActive: false,
            })
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
        this.fetchAllPromotionListAC()
    }
    fetchAllPromotionListAC = () => {
        fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
            isActive: -1,
            pageNo: 1,
            pageSize: 20000,
        }).then((res) => {
            this.setState({
                promotionLst: res,
              })
        })
    }
    isShowFoodSelector() {
        const {
            consumeType,
        } = this.state;
        return Boolean([...CONSUME_AMOUNT_OPTIONS, ...CONSUME_TIMES_OPTIONS]
            .find(item => item.value === `${consumeType}`)
            .showFood);
    }

    handleSubmit = () => {
        let flag = true;
        let values = {}
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
            values = basicValues
        });
        let { foodScopeList } = this.state;
        const eventMutexDependRuleInfos = this.dealWithOtherRuleInfos(values)
        if (this.isShowFoodSelector() && !foodScopeList.length) {
            flag = false;
            message.warning('请设置适用菜品')
        }
        if (flag) {
            this.props.setSpecialBasicInfo({
                ...this.state,
                foodScopeList: this.isShowFoodSelector() ? foodScopeList : [],
                eventMutexDependRuleInfos,
            });
        }
        return flag;
    }

    dealWithOtherRuleInfos = (values) => {
        const { rightType, assetType, onSaleNoShareBenifit } = values
        const { benefitArr, isPromotionActive, promotionType, isRightActive, isAssetActive, promotionLst } = this.state;
        let newEventMutexDependRuleInfos = [].concat(benefitArr);
        if (isPromotionActive && promotionType == 1) { // 与所有促销活动不共享
            newEventMutexDependRuleInfos.push({ mutexDependType:1,ruleType: 20, targetID: 0 })
        }
        if (isPromotionActive && promotionType == 2) { // 与部分促销活动不共享
            newEventMutexDependRuleInfos =  onSaleNoShareBenifit.reduce((ret, shopID) => {
                const shopInfo = promotionLst.find(shop => shop.value === shopID);
                if (!shopInfo) return ret;
                return ret.concat({mutexDependType:1,  targetID: shopInfo.value, targetName: shopInfo.label, ruleType: 20,  });
            }, newEventMutexDependRuleInfos);
        }
        if (isRightActive) { // 与会员权益不共享
            newEventMutexDependRuleInfos =  rightType.reduce((ret, ruleType) => {
                return ret.concat({ mutexDependType:1, targetID: 0, ruleType });
            }, newEventMutexDependRuleInfos);
        }
        if (isAssetActive) { // 与会员权益不共享
            newEventMutexDependRuleInfos =  assetType.reduce((ret, ruleType) => {
                return ret.concat({  mutexDependType:1, targetID: 0, ruleType });
            }, newEventMutexDependRuleInfos);
        }

        return newEventMutexDependRuleInfos
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
            amountType: value === 1 ? null : 1,
        })
    }
    handleAmountTypeChange = ({ target: { value } }) => {
        this.setState({
            amountType: value,
        })
    }
    handleFoodPriceTypeChange = ({ target: { value } }) => {
        this.setState({
            foodPriceType: value,
        })
    }
    handleBenifitTypeChange = ({ target: { value } }) => {
        if (value == '1') {
            let allArr = [{
                mutexDependType: 1,
                ruleType: 10,
                targetID: 0,
                targetName: '',
                sharedType: '10'
            }]
            this.props.setPromotionDetail({
                mutexPromotions: []
            });
            this.setState({
                benefitArr: allArr
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
        if (value) {
            this.setState({
                benefitArr: [{
                    mutexDependType: 1,
                    ruleType: 10,
                    targetID: 0,
                    targetName: '',
                    sharedType: '10'
                }]
            })
        } else {
            this.setState({
                benefitArr: []
            })
        }
        this.props.setPromotionDetail({
            mutexPromotions: []
        });
        this.setState({
            isBenifitActive: value,
        })
    }
    selectNoShareBenifit(val) {
        if (val && val.length > 0) {
            let insertArr = [];
            val.forEach((item) => {
                insertArr.push({
                    mutexDependType: 1,
                    ruleType: 10,
                    targetID: item.promotionIDStr,
                    targetName: item.finalShowName,
                    sharedType: item.sharedType
                })
            })
            this.setState({
                benefitArr: insertArr,
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
                            v.number > 0 ? cb() : cb('必须大于0');
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
                        v.number > 0 ? cb() : cb('必须大于0');
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
        const { data } = await axios.post('/api/shopapi/schema', {});
        const { shops } = data;
        this.countIsRequire(shops);
    }
    countIsRequire(shopList) {
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
        if (!isOld) {
            if (length < size) {
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        } else {
            if (oldShops[0] && length < size) {
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        }
    }
    render() {
        const { isRequire, shopStatus, foodScopeList, shopIDList, groupID } = this.state;
        const convertShopIdList = shopIDList.length ? shopIDList.join(',').split(',') : [];
        let cardTypeList = this.props.crmCardTypeNew.get('cardTypeLst');
        cardTypeList = Immutable.List.isList(cardTypeList) ? cardTypeList.toJS().filter(({ regFromLimit }) => !!regFromLimit) : [];
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
                        initialValue: { number: this.state.needCount },
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
                {
                   this.state.radioType == 0 ?  
                        <FormItem
                            label={'金额核算'}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup onChange={this.handleAmountTypeChange} value={this.state.amountType}>
                                <Radio value={2}>实收金额</Radio>
                                <Radio value={1}>账单金额</Radio>
                            </RadioGroup>
                        </FormItem>
                        :null
                }
                <FormItem
                    label=" "
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.renderComboInput()}
                </FormItem>
                {
                    this.state.radioType == '1' ?
                        <FormItem
                            label={'数量核算'}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <RadioGroup onChange={this.handleFoodPriceTypeChange} value={String(this.state.foodPriceType)}>
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
                            this.setState({ shopIDList: v, shopStatus: v.length > 0 })
                        }}
                    // schemaData={this.props.shopSchema.toJS()}
                    />
                </FormItem>
                <div>
                    <FormItem
                        label={'与优惠券不共享'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ marginTop: '15' }}
                    >
                        <div className={styles.couponSwitch}>
                            <Switch checked={this.state.isBenifitActive} checkedChildren="开" unCheckedChildren="关" onChange={this.handleBenifitSwitchChange} />
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
                    {
                        this.state.isBenifitActive ?
                            <FormItem
                                label="不共享优惠"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                required={isRequire}
                                validateStatus={shopStatus ? 'success' : 'error'}
                                help={shopStatus ? null : '至少选择一项优惠'}
                                style={{ display: this.state.benifitType == '2' ? 'block' : 'none' }}
                            >
                                <NoShareBenifit onChange={(val) => {
                                    this.selectNoShareBenifit(val)
                                }}
                                />
                            </FormItem> : null
                    }
                </div>
                <div>
                    <FormItem
                        label={'与促销活动不共享'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <div className={styles.couponSwitch}>
                            <Switch
                                checked={this.state.isPromotionActive}
                                checkedChildren="开"
                                unCheckedChildren="关"
                                onChange={(e) => this.setState({ isPromotionActive: e })}
                            />
                        </div>
                    </FormItem>
                    {
                        this.state.isPromotionActive ?
                            <FormItem
                                label={' '}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <RadioGroup
                                    onChange={({ target: { value }}) => {
                                        this.setState({ promotionType: value, onSaleNoShareBenifit: [] })
                                        this.props.form.setFieldsValue({ onSaleNoShareBenifit: [] })
                                    }} 
                                    value={this.state.promotionType}
                                >
                                    <Radio value={'1'}>与所有促销活动不共享</Radio>
                                    <Radio value={'2'}>与部分促销活动不共享</Radio>
                                </RadioGroup>
                            </FormItem>
                        : null
                    }
                    {
                        this.state.isPromotionActive && this.state.promotionType == '2' ? 
                            <Form.Item
                                label={' '}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                {this.props.form.getFieldDecorator('onSaleNoShareBenifit', {
                                    rules: [
                                        { required: true, message: '至少选择一项活动' }
                                    ],
                                    initialValue: this.state.onSaleNoShareBenifit,
                                    onChange: (val) => this.setState({ onSaleNoShareBenifit: val }),
                                })(
                                    <OnSaleNoShareBenifit />
                                )}
                            </Form.Item>
                        : null
                    }
                </div>
                <div>
                    <FormItem
                        label={'与会员权益不共享'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <div className={styles.couponSwitch}>
                            <Switch checked={this.state.isRightActive} onChange={(e) => { this.setState({ isRightActive: e }) }} checkedChildren="开" unCheckedChildren="关" />
                        </div>
                    </FormItem>
                    {
                        this.state.isRightActive ?
                            <FormItem
                                label={' '}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                {this.props.form.getFieldDecorator('rightType', {
                                    rules: [
                                        { required: true, message: '至少选择一项会员权益' }
                                    ],
                                    initialValue: this.state.rightArr || [31,32],
                                    onChange: (val) => this.setState({ rightArr: val }),
                                })(
                                    <Checkbox.Group
                                        options={[{ label: '会员价', value: 31 }, { label: '会员折扣', value: 32 }]}
                                    />
                                )}
                            </FormItem>
                        : null
                    }
                </div>
                <div>
                    <FormItem
                        label={'与会员资产不共享'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <div className={styles.couponSwitch}>
                            <Switch checked={this.state.isAssetActive} onChange={(e) => { this.setState({ isAssetActive: e }) }} checkedChildren="开" unCheckedChildren="关" />
                        </div>
                    </FormItem>
                    {
                        this.state.isAssetActive ?
                            <FormItem
                                label={' '}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                 {this.props.form.getFieldDecorator('assetType', {
                                    rules: [
                                        { required: true, message: '至少选择一项会员资产' }
                                    ],
                                    initialValue: this.state.assetArr || [33,34],
                                    onChange: (val) => this.setState({ assetArr: val }),
                                })(
                                    <Checkbox.Group
                                        options={[{ label: '会员储值', value: 33 }, { label: '会员积分', value: 34 }]}
                                    />
                                )}
                            </FormItem>
                        : null
                    }
                </div>
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
        user: state.user.toJS(),
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
