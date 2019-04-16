import React, {createRef} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { axiosData } from '../../../helpers/util';
import { Row, Spin, Col, Modal, Form, Select, Input, message, TreeSelect, Checkbox, Radio } from 'antd';
import styles from './GiftAdd.less';
import styles2 from './Crm.less';
import BaseForm from '../../../components/common/BaseForm';
import { FORMITEMS, FIRST_KEYS, SECOND_KEYS } from './_formItemConfig';
import InputTreeForGift from './InputTreeForGift';
import FoodBox from './FoodBox';
import MoreFoodBox from './MoreFoodBox';
import GiftPromotion from './GiftPromotion';
import GiftCfg from '../../../constants/Gift';
import {
    FetchGiftList,
    FetchGiftSort,
    cancelCreateOrEditGift,
    changeGiftFormKeyValue,
    startSaving,
    endSaving,
} from '../_action';
import {
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {getPromotionShopSchema} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import TrdTemplate from './common/TrdTemplate';
import CouponTrdChannelStockNums from './common/CouponTrdChannelStockNums';
import ShopSelector from "../../../components/common/ShopSelector";
import IsSync from "./common/IsSync";
import {debounce} from 'lodash';
import SelectBrands from "../components/SelectBrands";
import PushMessageMpID from "../components/PushMessageMpID";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import AmountType from "./common/AmountType";
import GiftTimeIntervals, {getItervalsErrorStatus} from "./GiftTimeIntervals";
import {isHuaTian, isMine} from "../../../constants/projectHuatianConf";
import SelectCardTypes from "../components/SelectCardTypes";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class GiftAddModalStep extends React.PureComponent {
    constructor(props) {
        super(props);
        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();
        this.state = {
            current: 0,
            shopsData: [],
            values: {},
            finishLoading: false,
            numberOfTimeValueDisabled: true,
            moneyTopLimitValueDisabled: true,
            shopSchema, // 后台请求来的值
            // modalKey:1,
            firstKeys: { ...FIRST_KEYS },
            secondKeys: { ...JSON.parse(JSON.stringify(SECOND_KEYS)) },
            groupTypes: [],
            giftData: [],
            sharedGifts: [],
            isFoodCatNameList: '1',
            foodNameList: [],
            scopeLst: [],
            foodNameListStatus: 'success',
            buyGiveSecondaryFoodsStatus: 'success',
            buyGiveFoodsStatus: 'success',
            // transferType:0
        };
        this.firstForm = null;
        this.secondForm = null;
        this.firstFormRefMap = null;
        this.handleNameChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleRemarkChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleDiscountRateChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleLimitValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleStageAmountChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleGiveFoodCountChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
    }

    componentDidMount() {
        const { FetchGiftSort, type, gift: thisGift } = this.props;
        // console.log('gift:', thisGift);
        const { getPromotionShopSchema} = this.props;

        getPromotionShopSchema({groupID: this.props.accountInfo.toJS().groupID});
        const { name, data, value } = thisGift;
        const { values } = this.state;
        if (type === 'edit' && value == '111') {
            values.discountType = data.discountType
            values.discountRate = data.discountRate
        }
        if ((type === 'add' && value == '10') || (type !== 'add' && value == '10' && data.amountType == 1)) {
            const {secondKeys} = this.state
            const index = secondKeys[name][0].keys.findIndex(item => item === 'amountType')
            if (index >= 0) {
                secondKeys[name][0].keys.splice(index, 1);
                this.setState({secondKeys})
            }
        }
        this.setState({
            values
        });
        FetchGiftSort({});
        // 礼品名称 auto focus
        try {
            this.firstFormRefMap.giftName.focus()
        } catch (e) {
            // oops
        }
    }

    componentWillReceiveProps(nextProps) {
        const { sharedGifts } = nextProps;
        const _sharedGifts = sharedGifts && sharedGifts.toJS();
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
        this.setState({
            sharedGifts: this.proSharedGifts(_sharedGifts.crmGiftShareList),
        });
    }

    isHuaTianSpecificCoupon = () => {
        const { type, gift: { value, data } } = this.props;
        if (value != 10) return false;
        if (type === 'add') {
            return isHuaTian()
        }
        return isHuaTian() && isMine(data)
    }

    proSharedGifts = (sharedGifts = []) => {
        if (sharedGifts instanceof Array) {
            if (sharedGifts.length === 0) {
                return [];
            }
            const proSharedGifts = [];
            sharedGifts.forEach((sharedGift) => {
                proSharedGifts.push({
                    itemID: sharedGift.sID,
                    giftItemID: sharedGift.sID,
                    giftName: sharedGift.sName,
                })
            });
            return proSharedGifts;
        }
        return [];
    }

    handleFormChange(key, value) {
        const { gift: { name: describe, data }, type } = this.props;
        const { firstKeys, secondKeys, values } = this.state;
        const newKeys = [...secondKeys[describe][0].keys];
        const index = _.findIndex(newKeys, item => item == key);
        if (key === 'shareIDs') {
            this.props.changeGiftFormKeyValue({key, value});
        } else if (JSON.stringify(values[key]) !== JSON.stringify(value)) {
            switch (key) { // 这三个字段是靠手动输入的, 不加debounce的话在一般机器上有卡顿
                case 'giftName':    this.handleNameChangeDebounced({key, value});
                                    break;
                case 'giftRemark':    this.handleRemarkChangeDebounced({key, value});
                                    break;
                case 'giftValue':    this.handleValueChangeDebounced({key, value});
                                    break;
                case 'moenyLimitValue':    this.handleLimitValueChangeDebounced({key, value});
                                    break;
                case 'discountRate':    this.handleDiscountRateChangeDebounced({key, value});
                                    break;
                case 'stageAmount':    this.handleStageAmountChangeDebounced({key, value});
                                    break;
                case 'giveFoodCount':    this.handleGiveFoodCountChangeDebounced({key, value});
                                    break;
                default: this.props.changeGiftFormKeyValue({key, value});
            }
        }

        if (key !== 'foodNameList') {
            values[key] = value;
        }
        switch (key) {
            case 'moneyLimitType':
                // 从newKeys里找到moenyLimitValue的key加到secondKeys的对应位置
                const moenyLimitValueIndex = _.findIndex(newKeys, item => item == 'moenyLimitValue');
                if (value != 0) {
                    moenyLimitValueIndex == -1 && newKeys.splice(index + 1, 0, 'moenyLimitValue');
                } else {
                    moenyLimitValueIndex !== -1 && newKeys.splice(moenyLimitValueIndex, 1);
                }
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys });
                break;
            case 'discountType':
                // 从newKeys里找到moenyLimitValue的key加到secondKeys的对应位置
                const keys = [...firstKeys[describe][0].keys];
                const discountTypeIndex = _.findIndex(keys, item => item == 'disCountTypeAndValue');
                const foodSelectorIndex = _.findIndex(keys, item => item == 'foodsboxs');
                if (value != 0) {
                    foodSelectorIndex == -1 && keys.splice(discountTypeIndex + 1, 0, 'foodsboxs');
                } else {
                    foodSelectorIndex !== -1 && keys.splice(foodSelectorIndex, 1);
                }
                firstKeys[describe][0].keys = [...keys];
                this.setState({ firstKeys });
                break;
            case 'isDiscountRate':
                const discountRateIndex = _.findIndex(newKeys, item => item == 'discountRate');
                if (value == true) {
                    discountRateIndex === -1 && newKeys.splice(index + 1, 0, 'discountRate');
                } else {
                    discountRateIndex !== -1 && newKeys.splice(discountRateIndex, 1);
                }
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys });
                break;
            case 'isPointRate':
                const pointRateIndex = _.findIndex(newKeys, item => item == 'pointRate');
                if (value == true) {
                    pointRateIndex == -1 && newKeys.splice(index + 1, 0, 'pointRate');
                } else {
                    pointRateIndex !== -1 && newKeys.splice(pointRateIndex, 1);
                }
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys });
                break;
            case 'numberOfTimeType':
                if (value == '0') {
                    values.numberOfTimeValue = 0;
                    this.secondForm.setFieldsValue({ numberOfTimeValue: 0 });
                }
                this.setState({
                    numberOfTimeValueDisabled: value != '1',
                })
                if (value === undefined) {
                    values.numberOfTimeType = '0';
                    values.numberOfTimeValue = 0;
                    this.secondForm.setFieldsValue({ numberOfTimeType: '0', numberOfTimeValue: 0 });
                }
                break;
            case 'moneyTopLimitType':
                if (value == '0') {
                    values.moneyTopLimitValue = 0;
                    this.secondForm.setFieldsValue({ moneyTopLimitValue: 0 });
                }
                this.setState({
                    moneyTopLimitValueDisabled: value != '1',
                })
                if (value === undefined) {
                    values.moneyTopLimitType = '0';
                    values.moneyTopLimitValue = 0;
                    this.secondForm.setFieldsValue({ moneyTopLimitType: '0', moneyTopLimitValue: 0 });
                }
                break;
            case 'giftShareType':
                const giftShareTypeIdx = _.findIndex(newKeys, item => item == 'shareIDs');
                if (value === '2') {
                    giftShareTypeIdx === -1 && newKeys.splice(index + 1, 0, 'shareIDs');
                } else {
                    giftShareTypeIdx !== -1 && newKeys.splice(giftShareTypeIdx, 1);
                }
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys });
                break;
            case 'shareIDs':
                this.setState({
                    sharedGifts: value,
                })
                break;
            case 'buyGiveFoods':
                {
                    if (!value) break;
                    const {  dishes = [] } = value;
                    if (dishes.length) {
                        this.setState({ buyGiveFoodsStatus: 'success' });
                    } else {
                        this.setState({ buyGiveFoodsStatus: 'error' });
                    }
                    break;
                }
            case 'buyGiveSecondaryFoods':
                {
                    if (!value) break;
                    const {  dishes = [] } = value;
                    if (dishes.length) {
                        this.setState({ buyGiveSecondaryFoodsStatus: 'success' });
                    } else {
                        this.setState({ buyGiveSecondaryFoodsStatus: 'error' });
                    }
                    break;
                }
            case 'foodNameList':
                if (value instanceof Array && value.length > 0 && typeof (value[0]) === 'string') {// Array<T: String>
                    // values.isFoodCatNameList = data.isFoodCatNameList;
                    break;
                }
                if (value) {
                    const { foodCategory = [], dishes = [], categoryOrDish = '1' } = value;
                    if (foodCategory.length || dishes.length) {
                        this.setState({ foodNameListStatus: 'success' });
                    } else {
                        this.setState({ foodNameListStatus: 'error' });
                    }
                    // 多存一份菜品, 菜品名与规格分开
                    values.foodScopes = {
                        foodCategory,
                        dishes,
                        categoryOrDish
                    };
                    const _foodCategory = foodCategory.map(cat => cat.foodCategoryName)
                    const _dishes = dishes.map(dish => dish.foodName + dish.unit || dish.foodNameWithUnit)
                    values.isFoodCatNameList = categoryOrDish;
                    values.foodNameList = categoryOrDish == '1' ? _foodCategory : _dishes;
                } else {
                    this.setState({
                        isFoodCatNameList: '1',
                        foodNameList: [],
                    })
                }
                break;

            case 'TrdTemplate':
                // FIXME: 先按以前格式临时支持上折扣券, 以后改成type判断
                if (describe === '代金券' || describe === '菜品优惠券' || describe === '菜品兑换券' || describe === '折扣券' || describe === '活动券') {
                    if (value) {
                        newKeys.includes('validityDays') ? null : newKeys.splice(-1, 0, 'validityDays')
                    } else {
                        newKeys.includes('validityDays') ? newKeys.splice(-2, 1) : null
                        delete values.validityDays
                    }
                    secondKeys[describe][0].keys = [...newKeys];
                    this.setState({ secondKeys });
                }
                break;

            default:
                break;
        }
        this.setState({ values });
    }

    handleCancel = (cb) => {
        this.props.onCancel();
        this.setState({
            current: 0,
            values: {},
            firstKeys: FIRST_KEYS,
            secondKeys: SECOND_KEYS,
            finishLoading: false,
            foodNameListStatus: 'success',
            /*buyGiveSecondaryFoods: 'success',
            foodNameListStatus: 'success'*/
        });
        cb && cb();
    }

    validateFoodList = (basicValues) => {
        if (!this.state.values.foodNameList || !this.state.values.foodNameList.length/* || !basicValues.foodNameList
            || (basicValues.foodNameList.categoryOrDish == 1 && basicValues.foodNameList.foodCategory.length == 0)
            || (basicValues.foodNameList.categoryOrDish == 0 && basicValues.foodNameList.dishes.length == 0)*/) {
            message.warning('请至少选择一个菜品');
            this.setState({ foodNameListStatus: 'error' });
            return false;
        }
        this.setState({ foodNameListStatus: 'success' });
        return true;
    }
    handleSubmit = () => {
        this.firstForm.validateFieldsAndScroll((error, basicValues) => {
            if (basicValues.TrdTemplate) {
                const { TrdTemplateStatus } = basicValues.TrdTemplate;
                if (!TrdTemplateStatus) {
                    return false
                }
            }
            if (this.props.gift.value == '20' || this.props.gift.value == '21') {
                if (this.validateFoodList(basicValues) === false) {
                    return false;
                }
            }
            if (this.props.gift.value == '110') {

                if (!this.state.values.buyGiveFoods || !this.state.values.buyGiveFoods.dishes.length) {
                    this.setState({ buyGiveFoodsStatus: 'error' });
                    return false;
                }
                if (!this.state.values.buyGiveSecondaryFoods || !this.state.values.buyGiveSecondaryFoods.dishes.length) {
                    this.setState({ buyGiveSecondaryFoodsStatus: 'error' });
                    return false;
                }
                this.setState({
                    buyGiveSecondaryFoodsStatus: 'success',
                    buyGiveFoodsStatus: 'success',
                });
            }
            if (error) return false;
            this.handleFinish();
        })
    }
    handlePrev = (cb) => {
        cb();
    }
    formatFormData = (params) => {
        return _.mapValues(params, (value, key) => {
            switch (key) {
                case 'numberOfTimeType':
                case 'moneyTopLimitType':
                    return Number(value);
                case 'numberOfTimeValue':
                case 'moneyTopLimitValue':
                    return value == '' || value == undefined ? 0 : Number(value);
                case 'usingTimeType':
                    return value && value.join();
                case 'promotionID':
                    return value && value instanceof Array && value[0] && value[0].promotionIDStr;

                default:
                    return value !== undefined ? value : '';
            }
        })
    }
    handleFinish = () => {
        const { values, groupTypes } = this.state;
        const { type, gift: { value, data } } = this.props;
        this.secondForm.validateFieldsAndScroll((err, formValues) => {
            if (err) return;
            // console.log('表单value：', formValues);
            let params = _.assign({}, values, formValues, { giftType: value });
            params = this.formatFormData(params);
            let shopNames = '',
                shopIDs = '',
                callServer;
            try {
                if (params.shopNames) {
                    const shops = this.state.shopSchema.shops;
                    const selectedShopEntities = shops.filter(item => params.shopNames.includes(item.shopID)).map(shop => ({content: shop.shopName, id: shop.shopID}));
                    selectedShopEntities.forEach((shop) => {
                        shopNames += `${shop.content + ',' || ''}`;
                        shopIDs += `${shop.id + ',' || ''}`;
                    });
                }
            } catch (e) {
                console.log('no shop info');
            }
            params.shopNames = shopNames || ',';
            params.shopIDs = shopIDs || ',';
            if (params.giftShareType == '2') {
                let shareIDs = '';
                params.shareIDs && params.shareIDs.forEach((share) => {
                    shareIDs += `${share.giftItemID},`;
                });
                params.shareIDs = shareIDs.substring(0, shareIDs.lastIndexOf(','));
            } else {
                params.shareIDs = '';
            }
            if (params.giftShareType != '0' && params.giftShareType != '1' && params.giftShareType != '2') {
                // 不传值0,1,2创建会报错
                params.giftShareType = '0'
            }
            if (params.giftShareType != '0' && params.giftShareType != '1' && params.giftShareType != '2') {
                // 不传值0,1,2创建会报错
                params.giftShareType = '0'
            }
            if (!params.isDiscountRate && value != '111') {
                params.discountRate = 1
            }
            if (!params.isPointRate) {
                params.pointRate = 0
            }
            if (formValues.couponTrdChannelStockNums) {
                // 线上礼品卡
                const issueChannel = []
                const couponTrdChannelStockNums = [];
                formValues.couponTrdChannelStockNums.forEach((channel) => {
                    if (channel.trdStockNum > 0) {
                        issueChannel.push(channel.trdPartyPlatformID);
                        couponTrdChannelStockNums.push(channel);
                    }
                })
                if (couponTrdChannelStockNums.length == 0) {
                    message.warning('必须至少选择一种投放渠道');
                    return;
                } else {
                    params.issueChannel = issueChannel.join(',');
                    params.couponTrdChannelStockNums = couponTrdChannelStockNums;
                }
            }
            if (params.TrdTemplate) {
                const { TrdTemplateStatus } = params.TrdTemplate;
                if (!TrdTemplateStatus) {
                    return
                }
                params = { ...params, ...params.TrdTemplate }
            }
            if (params.discountRate_111 && value == '111') {
                params.discountRate = (params.discountRate_111 / 100).toFixed(2)
            }
            if (!params.discountOffMax && value == '111') {
                params.discountOffMax = '0' // 0标识不限制
            }
            if (value == '110') {
                if (params.ismaxGiveCountPerBill == 0) {
                    params.maxGiveCountPerBill = 0 // 0标识不限制
                }
                if (params.ismaxGiveCountPerFoodPerBill == 0) {
                    params.maxGiveCountPerFoodPerBill = 0 // 0标识不限制
                }
            }
            if (value == '110' || value == '111') {
                params.giftValue = 0 // 不传会报错，后台说传0
            }
            params.usingTimeType = Array.isArray(data.usingTimeType) ? data.usingTimeType.join(',') : data.usingTimeType ? data.usingTimeType : '1,2,3,4,5';
            // foodbxs数据,目前代金券和折扣券用
            if (params.hasOwnProperty('foodsboxs')) {
                if (!params.foodsboxs) { // 用户没选择，默认全部信息
                    params.foodSelectType = 2;
                    params.isExcludeFood = '0';
                    params.excludeFoodScopes = [];
                    params.couponFoodScopes = [];
                }
                if (params.foodsboxs && params.foodsboxs instanceof Object) {
                    const { foodSelectType, isExcludeFood, foodCategory = [], excludeDishes = [], dishes = [] } = params.foodsboxs;
                    if (foodSelectType == 1 && foodCategory.length === 0 && excludeDishes.length === 0) { // 不选认为是全选, 全选为2
                        params.foodSelectType = 2
                    } else if (foodSelectType == 0 && dishes.length === 0) { // 不选认为是全选
                        params.foodSelectType = 2
                    } else {
                        params.foodSelectType = foodSelectType
                    }
                    params.isExcludeFood = excludeDishes && excludeDishes.length > 0 ? '1' : '0';
                    // 菜品限制范围类型：1,包含菜品分类;2,包含菜品;3,不包含菜品分类;4不包含菜品
                    params.couponFoodScopes = foodCategory.map((cat) => {
                        return {
                            targetID: cat.foodCategoryID,
                            targetCode: cat.foodCategoryCode,
                            targetName: cat.foodCategoryName,
                        }
                    }).concat(dishes.map((food) => {
                        return {
                            targetID: food.itemID,
                            targetCode: food.foodCode,
                            targetName: food.foodName,
                            targetUnitName: food.unit || '',
                        }
                    }));
                    params.excludeFoodScopes = excludeDishes.map((food) => {
                        return {
                            targetID: food.itemID,
                            targetCode: food.foodCode,
                            targetName: food.foodName,
                            targetUnitName: food.unit || '',
                        }
                    })
                }
                delete params.foodsboxs;
            }
            // foodbxs数据,目前代金券和折扣券用
            if (params.hasOwnProperty('foodScopes')) {
                const { foodCategory = [], dishes = [], categoryOrDish = '1' } = params.foodScopes;
                params.foodSelectType = Number(categoryOrDish);
                params.excludeFoodScopes = [];
                params.couponFoodScopes = foodCategory.map((cat) => {
                    return {
                        targetID: cat.foodCategoryID,
                        targetCode: cat.foodCategoryCode,
                        targetName: cat.foodCategoryName,
                    }
                }).concat(dishes.map((food) => {
                    return {
                        targetID: food.itemID,
                        targetCode: food.foodCode,
                        targetName: food.foodName,
                        targetUnitName: food.unit || '',
                    }
                }));
                delete params.foodScopes;
            }
            if (value == '111') { // 折扣券
                params.discountRate = params.discountRate.number;
                if (Number(params.discountType) === 0) {
                    params.foodSelectType = 2;
                    params.couponFoodScopes = [];
                    params.excludeFoodScopes = [];
                }
            }
            if (value == '110') {// 买赠券
                params.stageAmount = params.stageAmount.number;
                params.foodSelectType = 0;
                params.giveFoodCount = params.giveFoodCount.number;
                params.couponFoodScopes = (params.buyGiveFoods.dishes || []).map((food) => {
                    return {
                        targetID: food.itemID,
                        targetCode: food.foodCode,
                        targetName: food.foodName,
                        targetUnitName: food.unit || '',
                    }
                });
                params.couponFoodOffers = (params.buyGiveSecondaryFoods.dishes || []).map((food) => {
                    return {
                        foodUnitID: food.foodUnitID,
                        foodUnitCode: food.foodUnitCode,
                        foodPrice: food.price,
                        foodName: food.foodName,
                        foodUnitName: food.unit || '',
                    }
                });
                delete params.buyGiveFoods;
                delete params.buyGiveSecondaryFoods;
            }
            if (params.couponPeriodSettings && Array.isArray(params.couponPeriodSettings)) {
                const { hasError, errorMessage } = getItervalsErrorStatus(params.couponPeriodSettings)
                if (hasError) {
                    message.warning(errorMessage)
                    return
                }
                params.couponPeriodSettings = params.couponPeriodSettings.filter(({periodStart, periodEnd}) => !!periodStart && !!periodEnd)
            }
            if (type === 'add') {
                callServer = '/coupon/couponService_addBoard.ajax';
                if (values.brandID == '-1') {
                    params = _.omit(params, 'brandID');
                } else {
                    const brandJSON = _.find(groupTypes, { value: values.brandID }) || {};
                    params.giftName = `${brandJSON.label || ''}${values.giftName}`;
                }
            } else if (type === 'edit') {
                callServer = '/coupon/couponService_updateBoard.ajax';
                params.giftItemID = data.giftItemID;
                data.supportOrderTypes !== undefined && (params.supportOrderTypes = data.supportOrderTypes);
                data.supportOrderType !== undefined && (params.supportOrderType = data.supportOrderType);
            }
            if (value == 10) {
                if (type === 'add') {
                    params.amountType = 1;
                } else if (!Number(params.amountType || 0)) {
                    params.amountType = 0;
                }
            }
            if (formValues.transferLimitType == -1) {
                params.transferLimitType = formValues.transferLimitTypeValue
            }
            params.foodNameList = values.foodNameList instanceof Array ? values.foodNameList.join(',') : values.foodNameList;
            params.isFoodCatNameList = values.isFoodCatNameList;
            params.brandSelectType = (params.selectBrands || []).length ? 0 : 1;
            Array.isArray(params.supportOrderTypeLst) && (params.supportOrderTypeLst = params.supportOrderTypeLst.join(','))
            this.setState({
                finishLoading: true,
            });
            const { accountInfo, startSaving, endSaving } = this.props;
            const groupName = accountInfo.get('groupName');
            startSaving();
            delete params.operateTime; // 就, 很烦
            delete params.couponFoodScopeList; // 后台返回的已选菜品数据
            axiosData(callServer, { ...params, groupName }, null, { path: '' }).then((data) => {
                endSaving();
                message.success('成功', 3);
                this.props.cancelCreateOrEditGift()
            }).catch(err => {
                endSaving();
            });
        });
    }

    renderDiscountTypeAndValue(decorator) {
        const { discountType, discountRate } = this.props.gift.data;
        return decorator({
            key: 'discountRate',
            rules: [
                {
                    required: true,
                    message: '不得为空',
                },
                {
                    validator: (rule, v, cb) => {
                        Number(v && v.number ? v.number : 0) > 0 &&  Number(v && v.number ? v.number : 0) <= 10 ? cb() : cb(rule.message);
                    },
                    message: '折扣要大于0, 小于等于10',
                },
            ],
            initialValue: discountRate && discountRate.hasOwnProperty('number')  ? discountRate : {number: discountRate},
        })(
            <PriceInput
                addonBefore={
                    decorator({
                        key: 'discountType',
                        initialValue: String(discountType || 0),
                    })(<Select
                        style={{
                            width: 150,
                        }}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            [{ label: '整单折扣', value: '0' }, { label: '指定菜品折扣', value: '1' }].map((t) => {
                                return <Option key={t.label} value={t.value}>{t.label}</Option>
                            })
                        }
                    </Select>)
                }
                addonAfter="折"
                placeholder="例如8.8折, 9.5折"
                discountMode={true}
                discountFloat={1}
                maxNum={2}
            />
        )
    }

    renderStageAmount(decorator) {
        const { stageAmount } = this.props.gift.data;
        return decorator({
            key: 'stageAmount',
            rules: [
                {
                    required: true,
                    message: '不得为空',
                },
                {
                    validator: (rule, v, cb) => {
                        Number(v && v.number ? v.number : 0) > 0  ? cb() : cb(rule.message);
                    },
                    message: '菜品份数要大于0',
                },
            ],
            initialValue: stageAmount && stageAmount.hasOwnProperty('number')  ? stageAmount : {number: stageAmount},
        })(
            <PriceInput
                /*addonBefore="购买指定菜品满"*/
                addonAfter="份"
                placeholder="表示购买菜品的总数"
                modal="int"
                maxNum={4}
            />
        )
    }

    renderGiveFoodCount(decorator) {
        const { giveFoodCount } = this.props.gift.data;
        return decorator({
            key: 'giveFoodCount',
            rules: [
                {
                    required: true,
                    message: '不得为空',
                },
                {
                    validator: (rule, v, cb) => {
                        Number(v && v.number ? v.number : 0) > 0  ? cb() : cb(rule.message);
                    },
                    message: '菜品份数要大于0',
                },
            ],
            initialValue: giveFoodCount && giveFoodCount.hasOwnProperty('number')  ? giveFoodCount : {number: giveFoodCount},
        })(
            <PriceInput
                /*addonBefore="菜品赠送数量"*/
                addonAfter="份"
                placeholder="表示赠送菜品的总数"
                modal="int"
                maxNum={4}
            />
        )
    }

    renderDisCountStages(decorator) {
        const { discountType } = this.state.values
        return (
            <Row style={{ marginTop: -6 }}>
                <Col span={discountType == 0 ? 24 : 12}>
                    <FormItem>
                        {decorator({
                            key: 'discountType',
                            initialValue: discountType || 0,
                        })(<Select getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                [{ label: '无门槛折扣', value: 0 }, { label: '指定菜品消费满', value: 1 }].map((t) => {
                                    return <Option key={t.label} value={t.value}>{t.label}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Col>
                {
                    discountType == 0 ? null :
                        <Col span={12}>
                            <FormItem style={{ marginTop: 2 }}>
                                {decorator({
                                    key: 'discountRate',
                                    rules: [{ required: true, message: '不得为空' }, {
                                        validator: (rule, v, cb) => {
                                            if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                                                cb(rule.message);
                                            }
                                            cb();
                                        },
                                        message: '整数不超过8位，小数不超过2位',
                                    }],
                                })(<Input size="large" addonAfter="元" />)}
                            </FormItem>
                        </Col>
                }
            </Row>
        )
    }
    renderDisCountRate(decorator) {
        const { discountOffMax, isDiscountOffMax, discountRate_111 } = this.state.values
        return (
            <Row style={{ marginTop: -6 }}>
                <Col span={3} style={{ marginTop: 5 }}>折扣率</Col>
                <Col span={5}>
                    <FormItem>
                        {decorator({
                            key: 'discountRate_111',
                            initialValue: discountRate_111 || '',
                            rules: [{ required: true, message: '不得为空' }, {
                                validator: (rule, v, cb) => {
                                    if (!/^\+?\d{0,2}$/.test(Number(v))) {
                                        cb(rule.message);
                                    }
                                    cb();
                                },
                                message: '整数不超过2位',
                            }],
                        })(<Input size="large" addonAfter="%" />)}
                    </FormItem>
                </Col>
                <Col span={1}></Col>
                <Col span={5} style={{ marginTop: 5 }}>最大折扣上限</Col>
                <Col span={isDiscountOffMax == 0 ? 10 : 5} style={{ marginTop: -2 }}>
                    <FormItem>
                        {decorator({
                            key: 'isDiscountOffMax',
                            initialValue: isDiscountOffMax || 0,
                        })(<Select getPopupContainer={(node) => node.parentNode}>
                            {
                                [{ label: '不限制', value: 0 }, { label: '限制', value: 1 }].map((t) => {
                                    return <Option key={t.label} value={t.value}>{t.label}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Col>
                {
                    isDiscountOffMax == 0 ? null :
                        <Col span={5}>
                            <FormItem>
                                {decorator({
                                    key: 'discountOffMax',
                                    rules: [{ required: true, message: '不能为空' }, {
                                        validator: (rule, v, cb) => {
                                            if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                                                cb(rule.message);
                                            }
                                            cb();
                                        },
                                        message: '整数不超过8位，小数不超过2位',
                                    }],
                                    initialValue: discountOffMax > 0 ? discountOffMax : '',
                                })(<Input size="large" addonAfter="元" />)}
                            </FormItem>
                        </Col>
                }
            </Row>
        )
    }
    renderStages(decorator) {
        return (
            <Row>
                <Col span={7}>购买同一编码菜品满</Col>
                <Col span={5} style={{ margin: '-4px 13px 0 0' }}>
                    <FormItem>
                        {decorator({
                            key: 'stageAmount',
                            rules: [{ required: true, message: '不能为空' }, {
                                validator: (rule, v, cb) => {
                                    const lt = Number(this.state.values.giveFoodCount) > Number(v);
                                    if (!/^\+?\d{0,8}$/.test(Number(v)) || lt) {
                                        cb(rule.message);
                                    }
                                    cb();
                                },
                                message: '整数不超过8位 要大于赠送数量',
                            }],
                        })(<Input
                            addonAfter='份'
                        />)}
                    </FormItem>
                </Col>
                <Col span={2}>赠送</Col>
                <Col span={5} style={{ margin: '-4px 12px 0 0' }}>
                    <FormItem>
                        {decorator({
                            key: 'giveFoodCount',
                            rules: [{ required: true, message: '不能为空' }, {
                                validator: (rule, v, cb) => {
                                    this.secondForm.validateFieldsAndScroll(['stageAmount'], { force: true })
                                    if (!/^\+?\d{0,8}$/.test(Number(v))) {
                                        cb(rule.message);
                                    }
                                    cb();
                                },
                                message: '整数不超过8位',
                            }],
                        })(<Input
                            addonAfter="份"
                        />)}
                    </FormItem>
                </Col>
                <Col span={4} style={{ marginRight: -10 }}>本编码菜品</Col>
            </Row>
        )
    }
    renderGiveLimits(decorator) {
        // 一笔订单最多赠送菜品 maxGiveCountPerBill
        // 一笔订单同一菜品最多赠送菜品 maxGiveCountPerFoodPerBill
        //    一笔订单同时满足多个单品，优惠金额按照 BOGOdiscountWay 1 高价单品优先 2 低价单品优先
        const { ismaxGiveCountPerBill = 0, maxGiveCountPerBill = '', ismaxGiveCountPerFoodPerBill = 0, maxGiveCountPerFoodPerBill = '', BOGOdiscountWay = 1 } = this.state.values;
        return (
            <div>
                <Row style={{ marginBottom: 12 }}>
                    <Col span={4}></Col>
                    <Col span={10}>一笔订单最多赠送菜品</Col>
                    <Col span={ismaxGiveCountPerBill == 0 ? 10 : 5} style={{ marginTop: -8 }}>
                        <FormItem>
                            {decorator({
                                key: 'ismaxGiveCountPerBill',
                                initialValue: ismaxGiveCountPerBill || 0,
                            })(<Select getPopupContainer={(node) => node.parentNode}>
                                {
                                    [{ label: '不限制', value: 0 }, { label: '限制', value: 1 }].map((t) => {
                                        return <Option key={t.label} value={t.value}>{t.label}</Option>
                                    })
                                }
                            </Select>)}
                        </FormItem>
                    </Col>
                    {
                        ismaxGiveCountPerBill == 0 ? null :
                            <Col span={5} style={{ marginTop: -6 }}>
                                <FormItem>
                                    {decorator({
                                        key: 'maxGiveCountPerBill',
                                        rules: [{ required: true, message: '不能为空' }, {
                                            validator: (rule, v, cb) => {
                                                if (!/(^\+?\d{0,8}$)/.test(Number(v))) {
                                                    cb(rule.message);
                                                }
                                                cb();
                                            },
                                            message: '整数不超过8位',
                                        }],
                                        initialValue: maxGiveCountPerBill > 0 ? maxGiveCountPerBill : '',
                                    })(<Input size="large" addonAfter="份" />)}
                                </FormItem>
                            </Col>
                    }
                </Row>
                <Row style={{ marginBottom: 12 }}>
                    <Col span={3}></Col>
                    <Col span={11}>一笔订单同一菜品最多赠送菜品</Col>
                    <Col span={ismaxGiveCountPerFoodPerBill == 0 ? 10 : 5} style={{ marginTop: -8 }}>
                        <FormItem>
                            {decorator({
                                key: 'ismaxGiveCountPerFoodPerBill',
                                initialValue: ismaxGiveCountPerFoodPerBill || 0,
                            })(<Select getPopupContainer={(node) => node.parentNode}>
                                {
                                    [{ label: '不限制', value: 0 }, { label: '限制', value: 1 }].map((t) => {
                                        return <Option key={t.label} value={t.value}>{t.label}</Option>
                                    })
                                }
                            </Select>)}
                        </FormItem>
                    </Col>
                    {
                        ismaxGiveCountPerFoodPerBill == 0 ? null :
                            <Col span={5} style={{ marginTop: -6 }}>
                                <FormItem>
                                    {decorator({
                                        key: 'maxGiveCountPerFoodPerBill',
                                        rules: [{ required: true, message: '不能为空' }, {
                                            validator: (rule, v, cb) => {
                                                if (!/(^\+?\d{0,8}$)/.test(Number(v))) {
                                                    cb(rule.message);
                                                }
                                                cb();
                                            },
                                            message: '整数不超过8位',
                                        }],
                                        initialValue: maxGiveCountPerFoodPerBill > 0 ? maxGiveCountPerFoodPerBill : '',
                                    })(<Input size="large" addonAfter="份" />)}
                                </FormItem>
                            </Col>
                    }
                </Row>
                <Row style={{ marginBottom: 12 }}>
                    <Col span={14}>一笔订单同时满足多个单品，优惠金额按照</Col>
                    <Col span={10} style={{ marginTop: -6 }}>
                        <FormItem>
                            {decorator({
                                key: 'BOGOdiscountWay',
                                initialValue: BOGOdiscountWay || 1,
                            })(<Select getPopupContainer={(node) => node.parentNode}>
                                {
                                    [{ label: '高价单品优先', value: 1 }, { label: '低价单品优先', value: 2 }].map((t) => {
                                        return <Option key={t.label} value={t.value}>{t.label}</Option>
                                    })
                                }
                            </Select>)}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
    renderCouponPeriodSettings(decorator) {
        const { gift: { data } } = this.props;
        return (
            <Row>
                <Col>
                    {decorator({
                        rules: [{ required: true, message: ' ' }]
                    })(<GiftTimeIntervals />)}
                </Col>
            </Row>
        )
    }
    renderGiftTree(decorator, giftItemID) {
        return (
            <Row>
                <Col>
                    {decorator({
                        rules: [{ required: true, message: '可共用礼品券不能为空' }],
                    })(<InputTreeForGift
                        key="inputTreeForGift"
                        type={this.props.type}
                        giftItemID={giftItemID}
                        thisGiftItem={this.props.gift.data.giftItemID ? this.props.gift.data : null}
                    />)}
                </Col>
            </Row>
        )
    }

    handleShopSelectorChange(values) {
        this.setState({
            values: {...this.state.values, shopNames: values}
        });
    }

    renderShopNames(decorator) {
        const { shopNames = [] } = this.state.values;
        return (
            <Row style={{ marginBottom: shopNames.length === 0 ? -15 : 0 }}>
                <Col>
                    {decorator({})(
                            <ShopSelector
                                onChange={
                                    this.handleShopSelectorChange
                                }
                                schemaData={this.state.shopSchema}
                            />
                        )}
                </Col>
                <p style={{ color: 'orange', display: shopNames.length > 0 ? 'none' : 'block' }}>未选择门店时默认所有门店通用</p>
            </Row>
        )
    }

    renderFoodName(decorator, form) {
        // const { getFieldValue } = form;
        const formItemLayout = { labelCol: { span: 1 }, wrapperCol: { span: 23 } };
        let _scopeLst = [];
        if (this.props.type === 'edit') {
            let { isFoodCatNameList = '1', foodNameList = [] } = this.props.gift.data;
            if (this.state.values.foodNameList) {
                foodNameList = this.state.values.foodNameList;
            }
            const _foodNameList = foodNameList instanceof Array ? foodNameList : foodNameList.split(',');
            _scopeLst = _foodNameList.map((name) => {
                return isFoodCatNameList == '1' ? {
                    'scopeType': '1',
                    'foodCategoryName': name,
                } :
                    {
                        'scopeType': '2',
                        'foodNameWithUnit': name,
                    }
            })
        }
        const {isFoodCatNameList, subGroupID} = this.props.gift.data;
        return (
            <FormItem
                {...formItemLayout}
                label={''}
                className={styles.foodBox}
                validateStatus={this.state.foodNameListStatus}
                help={this.state.foodNameListStatus === 'success' ? null : '不可为空'}
            >
                {
                    decorator({})(
                        <FoodBox
                            categoryOrDish={Number(isFoodCatNameList)}
                            radioLabel={'抵扣方式'}
                            subGroupID={subGroupID}
                            noExclude={true}
                            catOrFoodValue={_scopeLst}
                            autoFetch={true}
                        />
                    )
                }
            </FormItem>

        )
    }
    renderisNeedCustomerInfo = (decorator) => {
        return (
            <FormItem style={{ marginLeft: 20 }}>
                <Col span={11}>券核销时是否校验会员注册信息</Col>
                <Col span={11}>
                    {
                        decorator({})(
                            <RadioGroup>
                                {
                                    GiftCfg.isNeedCustomerInfo.map(r => {
                                        return (<Radio key={r.value} value={r.value}>{r.label}</Radio>)
                                    })
                                }
                            </RadioGroup>
                        )
                    }
                </Col>
            </FormItem>)
    }

    renderGiftPromotion(decorator) {
        const { gift: { data }, type } = this.props;
        const promotionID = type === 'edit' ? (data.promotionID ? [{ sharedIDStr: data.promotionID }] : [])
            : this.state.values.promotionID
        return (
            <FormItem>
                {
                    decorator({})(<GiftPromotion promotionID={promotionID} type={type} />)
                }
            </FormItem>
        )
    }
    renderFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        let { couponFoodScopeList = [], excludeFoodScopes = [], foodSelectType = 2} = data;
        let scopeList;
        if (foodSelectType == 2) { // 全部菜品
            scopeList = [];
            foodSelectType = 1;
        } else if (foodSelectType == 1) { // 按分类
            scopeList = couponFoodScopeList.map(cat => ({scopeType: 1, ...cat})).concat(excludeFoodScopes.map(food => ({scopeType: 4, ...food})));
            foodSelectType = 1;
        } else { // 按单品
            scopeList = couponFoodScopeList.map(food => ({scopeType: 2, ...food}));
            foodSelectType = 0;
        }
        return (
            <FormItem style={{ marginTop: -12, marginBottom: 0, display: this.isHuaTianSpecificCoupon() ? 'none' : 'block' }}>
                {
                    decorator({})(
                        <MoreFoodBox
                            key="foodsboxs"
                            subGroupID={data.subGroupID}
                            scopeLst={scopeList}
                            foodSelectType={foodSelectType}
                            isExcludeFood={'1'}
                        />)
                }
            </FormItem>
        )
    }

    renderBuyGiveFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        let { couponFoodScopeList = [], foodSelectType} = data;
        const scopeList = couponFoodScopeList.map(food => ({scopeType: 2, ...food}));
        foodSelectType = 0;

        return (
            <FormItem
                style={{ marginTop: -12, marginBottom: 0 }}
                validateStatus={this.state.buyGiveFoodsStatus}
                help={this.state.buyGiveFoodsStatus === 'success' ? null : '不可为空'}
            >
                {
                    decorator({})(
                        <MoreFoodBox
                            subGroupID={data.subGroupID}
                            isBuyGive={true}
                            key="buyGiveFoodsboxs"
                            scopeLst={scopeList}
                            foodSelectType={foodSelectType}
                            isExcludeFood={'1'}
                        />)
                }
            </FormItem>
        )
    }

    renderBuyGiveSecondaryFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        let { couponFoodOfferList = [], foodSelectType} = data;
        const scopeList = couponFoodOfferList.map(food => ({scopeType: 2, targetName: food.foodName, targetUnitName:food.foodUnitName,  ...food}));
        foodSelectType = 0;

        return (
            <FormItem
                style={{ marginTop: -12, marginBottom: 0 }}
                validateStatus={this.state.buyGiveSecondaryFoodsStatus}
                help={this.state.buyGiveSecondaryFoodsStatus === 'success' ? null : '不可为空'}
            >
                {
                    decorator({})(
                        <MoreFoodBox
                            subGroupID={data.subGroupID}
                            isBuyGive={true}
                            isSecondary={true}
                            key="buyGiveSecondaryFoodsboxs"
                            scopeLst={scopeList}
                            foodSelectType={foodSelectType}
                            isExcludeFood={'1'}
                        />)
                }
            </FormItem>
        )
    }


    renderCouponTrdChannelStockNums(decorator, form) {
        return (
            decorator({})(<CouponTrdChannelStockNums form={form} giftItemID={this.props.gift.data.giftItemID} />)
        )
    }
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props,
            { firstKeys, secondKeys, values, } = this.state;
        const dates = Object.assign({}, data);
        const displayFirstKeys = firstKeys[describe];
        const displaySecondKeys = secondKeys[describe];
        if (dates.shopNames && dates.shopNames.length > 0 && dates.shopNames[0].id) {
            dates.shopNames = dates.shopNames.map(shop => shop.id);
        }
        if (dates.moneyTopLimitValue) {
            dates.moneyTopLimitType = '1'
        } else {
            dates.moneyTopLimitType = '0'
        }
        if (dates.numberOfTimeValue) {
            dates.numberOfTimeType = '1'
        } else {
            dates.numberOfTimeType = '0'
        }
        // 折扣上限显示
        if (value == '111' && dates.discountOffMax == 0) {
            dates.discountOffMax = ''
        }
        let giftValueLabel = '可抵扣金额';
        if (value == '10' || value == '91') {
            giftValueLabel = '礼品价值';
        }
        if (value == '21') {
            giftValueLabel = '兑换金额';
        }
        const formItems = {
            ...FORMITEMS,
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            pushMessageMpID: {
                label: '消息推送公众号',
                rules: [{ required: true, message: '请绑定消息推送微信公众号' }],
                type: 'custom',
                render: decorator => decorator({})(<PushMessageMpID/>),
            },
            selectBrands: {
                label: '所属品牌',
                type: 'custom',
                render: decorator => decorator({})(<SelectBrands/>),
            },
            cardTypeList: {
                label: '适用卡类',
                type: 'custom',
                render: decorator => decorator({})(<SelectCardTypes/>),
            },
            giftValue: {
                label: giftValueLabel,
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add',
                surfix: '元',
                rules: [
                    { required: true, message: `${value === '10' ? '礼品价值' : '可抵扣金额'}不能为空` },
                    {
                        validator: (rule, v, cb) => {
                            if (!/(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/.test(v)) {
                                cb(rule.message);
                            }
                            cb();
                        },
                        message: '整数不能超过5位, 小数不能超过2位',
                    },
                    {
                        validator: (rule, v, cb) => {
                            if (['10', '20', '40'].includes(value) && v !== undefined && v !== '' && v == 0) {
                                cb(rule.message);
                            }
                            cb()
                        },
                        message: '金额不得为0',
                    },
                ],
            },
            discountOffMax: {
                label: '折扣金额上限',
                type: 'text',
                placeholder: '输入0或者不输入表示不限制',
                surfix: '元',
                defaultValue: '',
                rules: [{
                    validator: (rule, v, cb) => {
                        if (!/(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/.test(v)) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '整数不能超过5位, 小数不能超过2位',
                }],
            },
            giftName: {
                label: `礼品名称`,
                type: 'text',
                placeholder: '请输入礼品名称',
                size: 'large',
                rules: [
                    { required: true, message: '礼品名称不能为空' },
                    { max: 50, message: '不能超过50个字符' },
                    /*{
                        message: '汉字、字母、数字、小数点，50个字符以内',
                        pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.]{1,50}$/,
                    },*/
                ],
                disabled: type !== 'add',
            },
            shopNames: {
                type: 'custom',
                label: '可使用店铺',
                defaultValue: [],
                render: decorator => this.renderShopNames(decorator),
            },
            shareIDs: {
                type: 'custom',
                label: '可共用礼品券',
                defaultValue: [],
                render: decorator => this.renderGiftTree(decorator, data.giftItemID),
            },
            foodNameList: {
                type: 'custom',
                labelCol: { span: 0 },
                wrapperCol: { span: 24 },
                rules: [{ required: true, message: '不能为空' }],
                render: (decorator, form) => this.renderFoodName(decorator, form),
            },
            numberOfTimeType: {
                // label: '使用次数限制',
                type: 'custom',
                render: (decorator, form) => {
                    return (
                        <Row style={{ display: 'none' }}>
                            <Col span={12}>
                                <FormItem>
                                    {decorator({
                                        key: 'numberOfTimeType',
                                        initialValue: this.props.type === 'edit' ? `${this.props.gift.data.numberOfTimeType}` : '0',
                                    })(<Select getPopupContainer={(node) => node.parentNode}>
                                        <Option value="0">不限制</Option>
                                        <Option value="1">限制</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {decorator({
                                        key: 'numberOfTimeValue',
                                        rules: this.state.numberOfTimeValueDisabled ? [] : [{
                                            required: true,
                                            pattern: /^[1-9]\d{0,7}$/,
                                            message: '请输入1-99999999间的整数',
                                        }],
                                    })(<Input
                                        placeholder={'请输入限定次数数值'}
                                        disabled={this.state.numberOfTimeValueDisabled}
                                    />)}
                                </FormItem>
                            </Col>
                        </Row>
                    )
                },
            },
            moneyTopLimitType: {
                // label: '使用金额限制',
                type: 'custom',
                render: decorator => (
                    <Row style={{ display: 'none' }}>
                        <Col span={12}>
                            <FormItem>
                                {decorator({
                                    key: 'moneyTopLimitType',
                                    initialValue: this.props.type === 'edit' ? `${this.props.gift.data.moneyTopLimitType}` : '0',
                                })(<Select getPopupContainer={(node) => node.parentNode}>
                                    <Option value="0">不限制</Option>
                                    <Option value="1">限制</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                {decorator({
                                    key: 'moneyTopLimitValue',
                                    rules: this.state.moneyTopLimitValueDisabled ? [] : [{
                                        required: true,
                                        pattern: /(^\+?[1-9]\d{0,7}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                                        message: '整数不超8位小数不超2位',
                                    }],
                                })(<Input
                                    placeholder={'请输入限定金额数值'}
                                    disabled={this.state.moneyTopLimitValueDisabled}
                                    addonBefore={<div>满</div>}
                                    addonAfter={<div>元使用</div>}
                                />)}
                            </FormItem>
                        </Col>
                    </Row>
                ),
            },
            TrdTemplate: {
                label: ' ',
                labelCol: { span: 3 },
                wrapperCol: { span: 21 },
                type: 'custom',
                render: (decorator) => decorator({})(
                    <TrdTemplate
                        type={type}
                        describe={describe}
                        clearPromotion={() => {
                            values.promotionID = [] // 清空已选活动
                            this.secondForm.setFieldsValue({ promotionID: [] })
                            this.setState({ values })
                        }}
                        data={(data.extraInfo && data.extraInfo !== '0') ? { extraInfo: data.extraInfo, trdChannelID: data.trdChannelID, trdTemplateID: data.trdTemplateID } : undefined}
                    />
                )
            },
            promotionID: {
                label: '对应基础营销活动',
                type: 'custom',
                rules: [{ required: true, message: '不能为空' }],
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                render: (decorator, form) => this.renderGiftPromotion(decorator, form), // <GiftPromotion></GiftPromotion>,
            },
            // 线上礼品卡(91) 和其他的券类 price字段有微弱不同
            price: {
                label: value == '91' ? '礼品售价' : '建议售价',
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add',
                surfix: '元',
                rules: value == '91' ?
                    [
                        { required: true, message: `礼品售价不能为空` },
                        {
                            validator: (rule, v, cb) => {
                                if (type !== 'add') {
                                    return cb();
                                }
                                if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(String(v)) || Number(v) > values.giftValue) {
                                    cb(rule.message);
                                }
                                cb();
                            },
                            message: '整数不超过8位，小数不超过2位, 且不允许大于礼品价值',
                        },
                    ] : [
                        {
                            validator: (rule, v, cb) => {
                                if (type !== 'add') {
                                    return cb();
                                }
                                if(String(v || '').includes(' ')) {
                                    cb(rule.message);
                                }
                                cb();
                            },
                            message: '请不要输入空格',
                        },
                        {
                            validator: (rule, v, cb) => {
                                if (type !== 'add') {
                                    return cb();
                                }
                                if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(String(v)) && v !== undefined && v !== '') {
                                    cb(rule.message);
                                }
                                cb();
                            },
                            message: '整数不超过8位，小数不超过2位',
                        }
                    ],
            },
            validityDays: {
                label: '有效期',
                type: 'text',
                placeholder: '不填则默认有效期为36525天（100年）',
                surfix: '天',
                rules: [{
                    validator: (rule, v, cb) => {
                        if (v === '' || v == undefined) { // 可不填，填了就校验
                            return cb();
                        } else if (/^[1-9]\d*$/.test(v) && v > 0 && v <= 36525) {
                            return cb();
                        }
                        cb(rule.message);
                    },
                    message: '请输入整数，大于等于1, 小于等于36525',
                }],
            },
            transferLimitType: {
                label: '转赠设置',
                type: 'custom',
                render: (decorator, form) => {
                    // 转赠限制类型 -1不限制 0不可转赠 大于0表示可转赠次数
                    return (
                        <Row>
                            <Col span={this.state.values.transferLimitType == 0 ? 24 : 11} style={{ marginTop: -6 }}>
                                <FormItem>
                                    {decorator({
                                        key: 'transferLimitType',
                                        defaultValue: '-1',
                                    })(<Select getPopupContainer={(node) => node.parentNode}>
                                        <Option value="-1">可转赠</Option>
                                        <Option value="0">不可转赠</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            {
                                this.state.values.transferLimitType == 0 ? null :
                                    <div>
                                        <Col span={1}></Col>
                                        <Col span={12} style={{ marginTop: -4 }}>
                                            <FormItem>
                                                {decorator({
                                                    key: 'transferLimitTypeValue',
                                                    defaultValue: '',
                                                    rules: [{
                                                        required: true,
                                                        pattern: /^[1-9]\d{0,9}$/,
                                                        message: '转赠次数必须大于0, 且不可大于9999999999',
                                                    }],
                                                })(<Input
                                                    placeholder={'请输入限定次数'}
                                                    addonAfter="次"
                                                />)}
                                            </FormItem>
                                        </Col>

                                    </div>
                            }
                        </Row>
                    )
                },
            },
            couponTrdChannelStockNums: {
                label: '投放渠道',
                type: 'custom',
                render: (decorator, form, formData) => this.renderCouponTrdChannelStockNums(decorator, form, formData),
            },
            stages: {
                label: '买赠条件',
                type: 'custom',
                render: decorator => this.renderStages(decorator),
            },
            disCountStages: {
                label: '活动条件',
                type: 'custom',
                render: decorator => this.renderDisCountStages(decorator),
            },
            disCountTypeAndValue: {
                label: '折扣',
                type: 'custom',
                render: decorator => this.renderDiscountTypeAndValue(decorator),
            },
            stageAmount: {
                label: '购买指定菜品满',
                type: 'custom',
                render: decorator => this.renderStageAmount(decorator),
            },
            giveFoodCount: {
                label: '菜品赠送数量',
                type: 'custom',
                render: decorator => this.renderGiveFoodCount(decorator),
            },
            disCountRate_Max: {
                label: ' ',
                type: 'custom',
                render: decorator => this.renderDisCountRate(decorator),
            },
            foodsboxs: {
                label: this.isHuaTianSpecificCoupon() ? '' : '选择菜品',
                type: 'custom',
                render: decorator => this.renderFoodsboxs(decorator),
            },
            buyGiveFoods: {
                type: 'custom',
                label: ' ',
                render: decorator => this.renderBuyGiveFoodsboxs(decorator),
            },
            buyGiveSecondaryFoods: {
                type: 'custom',
                label: ' ',
                render: decorator => this.renderBuyGiveSecondaryFoodsboxs(decorator),
            },
            giveLimits: {
                label: '赠送菜品数量限制',
                type: 'custom',
                render: decorator => this.renderGiveLimits(decorator),
            },
            couponPeriodSettings: {
                label: '使用时段',
                type: 'custom',
                defaultValue: [{periodStart: '000000', periodEnd: '235900'}],
                render: decorator => this.renderCouponPeriodSettings(decorator),
            },
            isNeedCustomerInfo: {
                //label: `券核销时是否校验会员注册信息`,
                type: 'custom',
                defaultValue: false,
                //options: GiftCfg.isNeedCustomerInfo,
                render: decorator => this.renderisNeedCustomerInfo(decorator),
            },
            isSynch: {
                label: ` `,
                type: 'custom',
                defaultValue: false,
                render: decorator => decorator({})(<IsSync/>),
            },
            amountType: {
                label: `规则设置`,
                type: 'custom',
                render: decorator => decorator({})(<AmountType/>),
            },
        };
        // 菜品券金额限制暂时不可用每满选项
        formItems.moneyLimitType.options[1].disabled = this.props.gift.value == '21';

        let formData = data === undefined ? dates : values;
        if (type === 'edit') {
            formData = dates;
            if (typeof(formData.foodNameList) === 'string') {
                formData.foodNameList = formData.foodNameList.split(',')
            }
        }
        if (this.props.gift.value == '20') {
            formItems.moneyLimitType.label = '账单金额';
        } else {
            formItems.moneyLimitType.label = '金额限制';
        }
        if (this.props.gift.value == '10' && (type === 'add' || values.amountType == 1)) {
            const {
                dishes = [],
                excludeDishes = [],
                foodCategory = [],
            } = values.foodsboxs || {};
            if (dishes.length || excludeDishes.length || foodCategory.length) {
                formItems.moneyLimitType.label = '活动菜品金额限制'
            } else {
                formItems.moneyLimitType.label = '账单金额限制'
            }
        }
        formData.shareIDs = this.state.sharedGifts;
        formData.giftShareType = String(formData.giftShareType);
        formData.couponPeriodSettings = formData.couponPeriodSettingList

        return (
            <div>
                <div
                    style={{
                        margin: '20px 0 10px 94px'
                    }}
                    className={styles2.logoGroupHeader}
                >基本信息</div>
                <BaseForm
                    getForm={(form) => {
                        this.firstForm = form
                    }}
                    getRefs={refs => this.firstFormRefMap = refs}
                    formItems={formItems}
                    formData={formData}
                    formKeys={displayFirstKeys}
                    onChange={(key, value) => this.handleFormChange(key, value, this.firstForm)}
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                    key={`${describe}-${type}1`}
                />
                <div
                    style={{
                        margin: '20px 0 10px 94px'
                    }}
                    className={styles2.logoGroupHeader
                }>使用规则</div>
                <BaseForm
                    getForm={form => this.secondForm = form}
                    formItems={formItems}
                    formData={formData}
                    formKeys={displaySecondKeys}
                    onChange={(key, value) => this.handleFormChange(key, value, this.secondForm)}
                    getSubmitFn={(handles) => {
                        this.handles[1] = handles;
                    }}
                    key={`${describe}-${type}2`}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        params: state.sale_giftInfoNew.get('listParams'),
        giftData: state.sale_giftInfoNew.get('giftSort'),
        shopSchema: state.sale_shopSchema_New,
        accountInfo: state.user.get('accountInfo'),
        menuList: state.user.get('menuList'),
        sharedGifts: state.sale_giftInfoNew.get('sharedGifts'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        cancelCreateOrEditGift: opts => dispatch(cancelCreateOrEditGift(opts)),
        changeGiftFormKeyValue: opts => dispatch(changeGiftFormKeyValue(opts)),
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        FetchGiftSort: opts => dispatch(FetchGiftSort(opts)),
        startSaving: opts => dispatch(startSaving(opts)),
        endSaving: opts => dispatch(endSaving(opts)),
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(GiftAddModalStep)

