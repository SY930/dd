﻿/**
 * @TODO 应该将该页面业务进行彻底重构。借鉴后端思维，将数据进行分层
 * 1 DO 为后端通信的数据模型
 * 2 DTO 为表单数据模型
 * 3 VO 为页面数据模型（其实这层可以忽略，不设计）
 * 目前的痛点是后端数据和前端数据不统一，另外还有字段复用的情况，多业务复用，所以导致很多的if判断。代码理解起来晦涩难懂。
 * 按照目前垒代码的方式，项目是无法进行维护，没有任何的结构化和设计而言。
*/
import React, {createRef} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { axiosData, isFilterShopType } from '../../../helpers/util';
import {
    Row,
    Col,
    Form,
    Select,
    Input,
    message,
    Radio,
    Tooltip,
    Icon,
    Modal,
    Checkbox,
    Switch
} from 'antd';
import styles from './GiftAdd.less';
import styles2 from './Crm.less';
import BaseForm from '../../../components/common/BaseForm';
import {
    FORMITEMS,
    FIRST_KEYS,
    SECOND_KEYS,
    THIRD_KEYS,
    FOURTH_KEYS,
    FORM_ITEMS_GIFTS_RULES_TO_EXCLUDE_IN_MALL_SCENE,
    MALL_COUPON_BASIC_SETTING_FORM_ITEMS,   // 基础设置项
    MALL_COUPON_APPLY_SETTING_FORM_ITEMS,   // 高级设置项
 } from './_formItemConfig';

import PhotoFrame from "./common/PhotoFrame"
import InputTreeForGift from './InputTreeForGift';
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
import ShopSelector from "components/ShopSelector";
import IsSync from "./common/IsSync";
import GiftImagePath from './common/GiftImagePath';
import {debounce} from 'lodash';
import SelectBrands from "../components/SelectBrands";
import PushMessageMpID from "../components/PushMessageMpID";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import AmountType from "./common/AmountType";
import MoneyLimitTypeAndValue from '../components/MoneyLimitTypeAndValue';
import GiftTimeIntervals, {getItervalsErrorStatus} from "./GiftTimeIntervals";
import {isHuaTian, isMine} from "../../../constants/projectHuatianConf";
import SelectCardTypes from "../components/SelectCardTypes";
import SelectMall from '../components/SelectMall';      // 选择适用店铺组件
import SelectMallCategory from '../components/SelectMallCategory';  // 选择商城分类，入参为商城 shopID

import { MultipleGoodSelector } from '../../../components/common/GoodSelector'

import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoLightAC,
    fetchFoodCategoryInfoLightAC,
    fetchFoodMenuInfoAC,
    getMallGoodsAndCategories,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { CategoryAndFoodSelectors } from '../../SaleCenterNEW/common/GiftCategoryAndFoodSelectors';
import { GiftCategoryAndFoodSelector } from '../../SaleCenterNEW/common/CategoryAndFoodSelector';
import AddMoneyTradeDishesTableWithBrand from 'containers/SaleCenterNEW/addMoneyTrade/AddMoneyTradeDishesTableWithBrand';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const hasMallArr = ['10','20','21'];
const processFinalCategoryAndDishData = (params, property,value) => {
    if (params.hasOwnProperty(property)) {
        if (!params[property]) { // 用户没选择，默认全部信息
            params.foodSelectType = 2;
            params.isExcludeFood = '0';
            params.excludeFoodScopes = [];
            params.couponFoodScopes = [];
        }
        let foodCategory=[],excludeDishes=[],dishes=[],mallScope='',categoryOrDish='',foodSelectType;
        if (params[property] && params[property] instanceof Object) {
            if(hasMallArr.includes(value)){
                mallScope = params.mallScope;
                foodCategory = params[property].foodCategory;
                excludeDishes = params[property].excludeDishes;
                dishes = params[property].dishes;
               
                // mallScope 0 分类， 1 菜品
                // foodSelectType 1 分类， 0 菜品， 2 全选
                foodSelectType = 1 - mallScope;
                if (foodSelectType == 1 && foodCategory.length === 0 && excludeDishes.length === 0) { // 不选认为是全选, 全选为2
                    params.foodSelectType = 2
                } else if (foodSelectType == 0 && dishes.length === 0) { // 不选认为是全选
                    params.foodSelectType = 2
                } else {
                    params.foodSelectType = foodSelectType
                }
            }else{
                categoryOrDish = params[property].categoryOrDish;
                foodCategory = params[property].foodCategory || [];
                excludeDishes = params[property].excludeDishes || [];
                dishes = params[property].dishes || [];
                // categoryOrDish 0 分类， 1 菜品
                // foodSelectType 1 分类， 0 菜品， 2 全选
                foodSelectType = 1 - categoryOrDish;
                if (foodSelectType == 1 && foodCategory.length === 0 && excludeDishes.length === 0) { // 不选认为是全选, 全选为2
                    params.foodSelectType = 2
                } else if (foodSelectType == 0 && dishes.length === 0) { // 不选认为是全选
                    params.foodSelectType = 2
                } else {
                    params.foodSelectType = foodSelectType
                }
                params.isExcludeFood = excludeDishes && excludeDishes.length > 0 ? '1' : '0';
            }
            params.isExcludeFood = excludeDishes && excludeDishes.length > 0 ? '1' : '0';
            // 菜品限制范围类型：1,包含菜品分类;2,包含菜品;3,不包含菜品分类;4不包含菜品
            params.couponFoodScopes = (foodCategory || []).map((cat) => {
                return {
                    targetID: cat.foodCategoryID,
                    targetCode: cat.foodCategoryCode,
                    targetName: cat.foodCategoryName,
                    brandID: cat.brandID || '0',
                    isShop:true
                }
            }).concat((dishes|| []).map((food) => {
                return {
                    targetID: food.itemID,
                    targetCode: food.foodCode,
                    targetName: food.foodName,
                    targetUnitName: food.unit || '',
                    brandID: food.brandID || '0',
                    isShop:true
                }
            }));
            params.excludeFoodScopes = (excludeDishes|| []).map((food) => {
                return {
                    targetID: food.itemID,
                    targetCode: food.foodCode,
                    targetName: food.foodName,
                    targetUnitName: food.unit || '',
                    brandID: food.brandID || '0',
                    isShop:true
                }
            })
        }
        delete params[property];
    }
}

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
            firstKeys: { ...JSON.parse(JSON.stringify(FIRST_KEYS)) },
            secondKeys: { ...JSON.parse(JSON.stringify(SECOND_KEYS)) },
            thirdKeys: { ...JSON.parse(JSON.stringify(THIRD_KEYS)) },
            fourthKeys: { ...JSON.parse(JSON.stringify(FOURTH_KEYS)) },
            groupTypes: [],
            giftData: [],
            sharedGifts: [],
            isFoodCatNameList: '1',
            scopeLst: [],
            unit: '¥',
            isActivityFoods:false,//是否选择了菜品分类
            groupID:'',
        };
        this.firstForm = null;
        this.secondForm = null;
        this.firstFormRefMap = null;
        this.secondFormRefMap = null;
        this.handleNameChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleRemarkChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleDiscountRateChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleLimitValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleStageAmountChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleGiveFoodCountChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        // this.handleMallCategoryDebounced = debounce(this.props.handleMallCategory.bind(this), 400);

    }

    componentDidMount() {
        const {
            FetchGiftSort,
            type,
            gift: thisGift,
            getPromotionShopSchema,
            fetchFoodCategoryInfo,
            fetchFoodMenuInfo,
            fetchFoodCategoryLightInfo,
            fetchFoodMenuLightInfo,
            accountInfo,
        } = this.props;
        const groupID = accountInfo.get('groupID');
        let params = {
            groupID:groupID
        };
        this.setState({
            groupID:groupID
        })
        if(isFilterShopType()){
            params = {...params, productCode: 'HLL_CRM_License'}
        }
        fetchFoodCategoryLightInfo(params, isHuaTian(), thisGift.data.subGroupID); // 菜品分类轻量级接口
        // fetchFoodCategoryInfo(params, isHuaTian(), thisGift.data.subGroupID);
        // fetchFoodMenuInfo(params, isHuaTian(), thisGift.data.subGroupID);
        fetchFoodMenuLightInfo(params, isHuaTian(), thisGift.data.subGroupID); // 轻量级接口
        getPromotionShopSchema(params);
        const { name, data, value } = thisGift;
        const { values } = this.state;
        if (type === 'edit' && value == '111') {
            values.discountType = data.discountType
            values.discountRate = data.discountRate
        }
        if(thisGift.data !== undefined) {
            let justifiedData = this.justifyServerEndKeyToFormKeys(JSON.parse(JSON.stringify(thisGift.data)));
            let values = Object.assign({}, this.state.values, justifiedData);
            this.setState({
                values
            })
        }

        FetchGiftSort({});

        // 表单和redux数据同步，解决左侧 phonePreview 券显示不对bug
        const { sharedGifts } = this.props;
        const _sharedGifts = sharedGifts && sharedGifts.toJS();
        this.setState({
            sharedGifts: this.proSharedGifts(_sharedGifts.crmGiftShareList),
        }, ()=>{
            this.props.changeGiftFormKeyValue({
                key:'shareIDs',
                value: this.state.sharedGifts
            });
        });


        // 礼品名称 auto focus
        try {
            this.firstFormRefMap.giftName.focus()
        } catch (e) {
            // oops
        }
    }

    componentWillReceiveProps(nextProps) {

        // 从redux里获取 shareGifts （共享券列表）。从列表页点击编辑的时候触发的网络请求，根据券id去获取共享券列表
        const { sharedGifts } = nextProps;
        const _sharedGifts = sharedGifts && sharedGifts.toJS();
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            let shopSchema = nextProps.shopSchema.getIn(['shopSchema']).toJS();
            let malls = [];
            if(shopSchema.hasOwnProperty('shops') && shopSchema.shops instanceof Array) {
                malls = shopSchema.shops.filter((shop, idx)=>{
                    return shop.operationMode == '3';   // operationMode  = 3 为积分商城
                    // 后端字段调整为 operationMode 3
                    // if(values.operationMode == '3') {
                    //     initialValue = values.selectMall;
                    // }
                });
            }
            this.setState({
                shopSchema,// 后台请求来的值
                malls,
            });
        }

        // 传入的表单值
        // let needUpdate = false;
        // if(this.props.gift.data.== undefined) {

        // }

        if(this.props.gift.data.giftItemID !== nextProps.gift.data.giftItemID) {
            const { data } = nextProps.gift;
            if(data !== undefined) {
                let justifiedData = this.justifyServerEndKeyToFormKeys(JSON.parse(JSON.stringify(data)));
                let values = Object.assign({}, this.state.values, justifiedData);
                this.setState({
                    values
                })
            }
        }

        /**
         * @Notice 因为获取共享券列表后，无法触发BaseForm表单onChange事件，
         * 从而handleFormChange里的 this.props.changeGiftFormKeyValue({key, value}); 存到redux里的方法无法执行。
         * 所以在setState的回调里进行一个赋值
         * @TODO 优化这块逻辑
         */
        // if(JSON.stringify(this.state.sharedGifts) != JSON.stringify(this.this.proSharedGifts(_sharedGifts.crmGiftShareList))) {
        if(!_.isEqual(this.props.sharedGifts, nextProps.sharedGifts)){
            this.setState({
                sharedGifts: this.proSharedGifts(_sharedGifts.crmGiftShareList),
            }, ()=>{
                this.props.changeGiftFormKeyValue({
                    key:'shareIDs',
                    value: this.state.sharedGifts
                });
            });
        }

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


    handleFoodUnitTypeChange = (val) => {

        this.setState({
            foodUnitType: val
        })

    }

    // 买赠券，处理优惠规则变更，动态调整表结构
    handleDiscountRuleChange = (val) => {
        // const { gift: { name: describe, data }, type } = this.props;
        // const { firstKeys } = this.state;
        // let keys = [...firstKeys[describe][0].keys];
        // // 1 特价， 2 折扣， 3 立减
        // // Caution: 如果修改配置文件 ——formItemConfig.jsx中买赠券的表单排序，则必须调整 splice 参数
        // if (val == '1') {
        //     keys.splice(9, 1, 'specialPriceVolSetting');
        // } else if(val == '2') {
        //     keys.splice(9, 1, 'discountRateSetting');
        // } else if(val == '3') {
        //     keys.splice(9, 1, 'discountDecreaseVolSetting');
        // }
        // firstKeys[describe][0].keys = [...keys];
        // this.setState({ firstKeys });
    }

    resetMallDataInRedux = ()=>{
        this.props.changeGiftFormKeyValue({
            key: 'mallCategory',
            value:  []}
        );
        this.props.changeGiftFormKeyValue({
            key: 'mallExcludedGood',
            value:  []}
        );
        this.props.changeGiftFormKeyValue({
            key: 'mallIncludeGood',
            value:  []}
        );
    }

    // 处理表单数据变化
    handleFormChange(key, value, formRef) {
        const { gift: { name: describe, data,value:giftType }, type } = this.props;
        const { firstKeys, secondKeys, values } = this.state;
        const newKeys = [...secondKeys[describe][0].keys];
        const index = _.findIndex(newKeys, item => item == key);
        if(key == 'applyScene'){
            if(value && value.length > 0) {
                if(value.length == 1){
                    value = value[0]
                }
                if(value.length == 2){
                    value = '2'
                }
            }else{
                value = '0'
            }
        }
        if (key === 'shareIDs') {
            this.props.changeGiftFormKeyValue({key, value});
        } else if (JSON.stringify(values[key]) !== JSON.stringify(value)) {
            switch (key) { // 这几个个字段是靠手动输入的, 不加debounce的话在一般机器上有卡顿
                case 'giftName':    this.handleNameChangeDebounced({key, value});
                                    break;
                case 'giftRemark':    this.handleRemarkChangeDebounced({key, value});
                                    break;
                case 'giftValue':    this.handleValueChangeDebounced({key, value});
                                    break;
                case 'moenyLimitValue':    this.handleLimitValueChangeDebounced({key, value});
                                    break;
                case 'discountRate':       this.handleDiscountRateChangeDebounced({key, value});
                                    break;
                case 'stageAmount':
                    this.handleStageAmountChangeDebounced({key, value});
                    break;
                case 'giveFoodCount':
                    this.handleGiveFoodCountChangeDebounced({key, value});
                    break;
                // case 'mallCategory':
                //     this.handleMallCategoryDebounced({key, value});
                //     break;
                default: this.props.changeGiftFormKeyValue({key, value});
            }
        }
        
        values[key] = value;
        switch (key) {
            case 'discountType':
                if(firstKeys[describe][1] != undefined && firstKeys[describe][1].hasOwnProperty('keys')) {
                    let keys = [...firstKeys[describe][1].keys];
                    if (value != 0) {
                        // keys.push('foodsboxs','subRule')
                        keys.push('foodsboxs')
                    } else {
                        keys = []
                    }
                    firstKeys[describe][1].keys = [...keys];
                    this.setState({ firstKeys });
                }
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

            case 'selectMall': // 商城发生变化，改变表单中其他几项相互关联数据。 重置数据
                const isMallChanged = formRef.getFieldValue('selectMall') != value;
                if(isMallChanged) {
                    formRef.setFieldsValue({
                        mallCategory: [],
                        mallExcludedGood: [],
                        mallIncludeGood: []
                    });
                    this.resetMallDataInRedux();
                }
                break;

            // 分类进行切换时，对redux里数据进行清空处理
            case 'mallScope':
                if(hasMallArr.includes(giftType)){
                    if(value == '0') {
                        formRef.setFieldsValue({
                            mallIncludeGood: []
                        });
                    } else if(value == '1') {
                        formRef.setFieldsValue({
                            shopIDs:[],
                            shopNames:[],
                            mallCategory: [],
                            mallExcludedGood: [],
                        });
                    }
                }
                break;
            case 'foodUnitType':
                this.handleFoodUnitTypeChange(value);
                break;
            case 'discountRule':
                // 买赠券，处理优惠规则变更，动态调整表结构
                this.handleDiscountRuleChange(value);
                break;

            case 'compositeDiscount':
                // 买赠券，数据初始化
                let {reduceType, reduceValue} = value
                values.specialPriceVolSetting = reduceValue
                values.discountRateSetting = reduceValue
                values.discountDecreaseVolSetting = reduceValue
                break;
            case 'delivery':
                if(giftType == '22'){
                    values.giftValue = value;
                }
                break;
            default:
                break;
        }
        if(key==='giftValueCurrencyType') {
            this.setState({ unit: value });
        }
        if(key==='delivery') {
            this.setState({ delivery: value });
        }

        if(key == 'foodUnitType'){
            if(value == 1){
                formRef.setFieldsValue({
                    mallScope :'1'
                });
                this.handleFormChange('mallScope','1', formRef)
            }     
                
        }
        
    }

    handleCancel = (cb) => {
        this.props.onCancel();
        this.setState({
            current: 0,
            values: {},
            firstKeys: FIRST_KEYS,
            secondKeys: SECOND_KEYS,
            finishLoading: false,
        });
        cb && cb();
    }

    handleSubmit = () => {
        this.firstForm.validateFieldsAndScroll((error, basicValues) => {
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
                case 'promotionID':
                    return value && value instanceof Array && value[0] && value[0].promotionIDStr;
                default:
                    return value !== undefined ? value : '';
            }
        })
    }


    /**
     * @description 处理买赠券参数
     *  'discountRateSetting',              // 折扣设置 表单字段
     *  'specialPriceVolSetting',           // 特价设置 表单字段名称
     *  'discountDecreaseVolSetting'
    */
    justifyParamsForCouponOfBuyGiven(params) {
        // 后端字段名称为reduceType, 对应前端字段 discountType
        switch(params.discountRule) {
            case '1':  // 特价
            params.reduceValue = params.specialPriceVolSetting;
            delete params.specialPriceVolSetting;
            break;
            case '2':  // 折扣
            params.reduceValue = params.discountRateSetting;
            delete params.discountRateSetting;
            break;
            case '3':   // 立减
            params.reduceValue = params.discountDecreaseVolSetting;
            delete params.discountDecreaseVolSetting;
            break;
        }

        params.reduceType = `${params.discountRule}`;
        delete params.discountRule;

        // 优惠规则，后端之前的字段为BOGOdiscountWay, 暂不做调整。新的前端表单字段为discountSortRule
        params.priceSortRule = params.discountSortRule;
        delete params.discountSortRule;

        params.stageAmount = params.stageAmount.number;
        params.foodSelectType = 0;
        params.giveFoodCount = params.giveFoodCount.number;
        params.couponFoodScopes = (params.buyGiveFoods.dishes || []).map((food) => {
            return {
                targetID: food.itemID,
                targetCode: food.foodCode,
                targetName: food.foodName,
                targetUnitName: food.unit || '',
                brandID: food.brandID || '0',
            }
        });
        params.couponFoodOffers = (params.buyGiveSecondaryFoods.dishes || []).map((food) => {
            return {
                foodUnitID: food.foodUnitID,
                foodUnitCode: food.foodUnitCode,
                foodPrice: food.price,
                foodName: food.foodName,
                foodUnitName: food.unit || '',
                brandID: food.brandID || '0',
            }
        });
        delete params.buyGiveFoods;
        delete params.buyGiveSecondaryFoods;
        return params;
    }

    /**
     * @description 调整商城券参数。 后端没有新增相关商城券字段，复用原来的菜品券字段。但是前段是新增的，所以上传的时候要对参数进行调整
     * @ref http://wiki.hualala.com/pages/viewpage.action?pageId=19224682
    */
    adjustParamsOfMallGift = (params)=>{
        // 只处理商城券的情景. 其他场景删除冗余字段 （也可以通过场景去判断）
        const { type } = this.props;
        if(params.applyScene == '0') {
            if(params.hasOwnProperty('mallCategory')){
                delete params.mallCategory;
            }
            if(params.hasOwnProperty('mallIncludeGood')){
                delete params.mallIncludeGood;
            }
            if(params.hasOwnProperty('mallExcludedGood')){
                delete params.mallExcludedGood;
            }
            return;
        };

        const {goodCategories = [], goods = [],gift:{ value }} = this.props;
        const { malls } = this.state;

        // 当商城券是，brandSelectType 需要传1。 默认适用所有品牌（虽然商城没有品牌概念）
        if(params.applyScene == '1') {
            params.brandSelectType = 1;
        }
        if(params.applyScene == '1') {
            delete params.selectBrands
        }
        let shopIds = null,shopNames = null;
        if(params.shopIDs){
            shopIds = params.shopIDs;
        }
        if(params.shopNames){
            shopNames = params.shopNames;
        }
        params.shopIDs = '';
        params.shopNames = '';

        if(params.hasOwnProperty('selectMall') && params.selectMall !== undefined) {
            if(params.selectMall instanceof Array && params.selectMall.length == 1) {
                params.shopIDs = params.selectMall[0];
            } else {
                params.shopIDs = params.selectMall;
            }
            let selectMall = malls.filter((mall, idx)=>{
                return mall.shopID == params.selectMall
            });

            if(selectMall instanceof Array && selectMall.length == 1) {
                params.shopNames = selectMall[0].shopName;
            }
        }else{
            message.warning('请选择适用商城')
            return
        }

        
        if(params.applyScene == '2'){
            if(shopIds){
                if(shopIds.indexOf(params.shopIDs) < 0){
                    params.shopIDs = shopIds + params.shopIDs
                }else{
                    params.shopIDs = shopIds
                }
            }
            if(shopNames){
                if(shopNames.indexOf(params.shopNames) < 0){
                    params.shopNames = shopNames + params.shopNames
                }else{
                    params.shopNames = shopNames
                }
            }
        }
        delete params.selectMall;

        // 适用菜品方式 0：按菜品单品 1：按菜品分类 2：不限制
        // mallScope : 0 按分类， 1 按菜品
        // 商城分类模式
        if(params.mallScope == '0' || params.mallScope == undefined) {
            let existCouponFoodScopes = params.couponFoodScopes;
            let mallCategorySet = new Set(params.mallCategory);
            // 分类
            params.couponFoodScopes = goodCategories.filter((item, idx)=>{
                return mallCategorySet.has(item.value);
            }).map((item, idx)=>{
                return {
                    targetID: item.value,
                    targetCode: '',
                    targetName: item.categoryName,
                    targetUnitName: '',
                    brandID: '0',
                    isShop:false
                }
            });
            if( params.applyScene == '2' && existCouponFoodScopes && existCouponFoodScopes.length > 0){//当商城券和店铺券都选的时候，组合参数
                params.couponFoodScopes = existCouponFoodScopes.concat(params.couponFoodScopes)
            }
            // 商品信息
            // 是否包含排除菜品 true：包含 false：不包含
            let excludeFoodScopes = params.applyScene == '2' ? params.excludeFoodScopes : [];
            // params.excludeFoodScopes = [];
            if(params.mallExcludedGood instanceof Array && params.mallExcludedGood.length > 0) {
                params.isExcludeFood = true;
                let mallExcludeGoodSet = new Set(params.mallExcludedGood);
                params.excludeFoodScopes = goods.filter((item)=>{
                    return mallExcludeGoodSet.has(item.goodID);
                }).map((item, idx)=>{
                    return {
                        targetID: item.goodID,
                        targetCode: item.goodCode,
                        targetName: item.goodName,
                        targetUnitName: '',
                        brandID: '0',
                        isShop:false
                    }
                })
                params.excludeFoodScopes = excludeFoodScopes.concat(params.excludeFoodScopes);
            } else {
                params.isExcludeFood = false;
            }
            if(params.applyScene == '2' && params.excludeFoodScopes && params.excludeFoodScopes.length > 0){//店铺商城都选中，且有排除店铺时
                params.isExcludeFood = true;
            }
        } else if(params.mallScope == '1') {    // 商品模式
            params.isExcludeFood = false;
            // params.couponFoodScopes = [];
            let couponFoodScopes = params.applyScene == '2' ? params.couponFoodScopes : [];
            if(params.mallIncludeGood instanceof Array && params.mallIncludeGood.length > 0) {
                let mallIncludeGoodSet = new Set(params.mallIncludeGood);
                params.couponFoodScopes = goods.filter((item)=>{
                    return mallIncludeGoodSet.has(item.goodID);
                }).map((item)=>{
                    return {
                        targetID: item.goodID,
                        targetCode: item.goodCode,
                        targetName: item.goodName,
                        targetUnitName: '',
                        brandID: '0',
                        isShop:false
                    }
                })
                params.couponFoodScopes = couponFoodScopes.concat(params.couponFoodScopes)
            }
        }

        // 删除已经转换后的前端自定义表单字段
        delete params.mallScope;
        delete params.mallExcludedGood;
        delete params.mallIncludeGood;
        delete params.mallCategory;
    }

    handleFinish = () => {
        const { values, groupTypes, delivery} = this.state;
        const { type, gift: { value, data } } = this.props;
        this.secondForm.validateFieldsAndScroll((err, formValues) => {
            if (err) return;
            if (formValues.TrdTemplate) {
                const { TrdTemplateStatus } = formValues.TrdTemplate;
                if (!TrdTemplateStatus) {
                    try {
                        this.secondFormRefMap.TrdTemplate.wrappedInstance.popIntoView()
                    } catch (e) {
                    }
                    return false
                }
            }
            let params = _.assign(
                {
                    effectTime: data.effectTime,
                    validityDays: data.validityDays,
                },
                values,
                formValues,
                { giftType: value },
            );
            params = this.formatFormData(params);
            // 券转赠  图片信息
            if(formValues.transferType){
                let {transferTitle, transferImage = {}, transferringAvailable} = formValues
                let {transferImagePath = '', transferThumbnailImagePath = ''} = transferImage
                params = {...params, transferInfo: JSON.stringify({transferTitle, transferringAvailable, transferImagePath, transferThumbnailImagePath}) }
                delete params.transferImage;
            }

            let shopNames = '',
                shopIDs = '',
                callServer;
            // if(values && values.shopIDs && values.shopIDs.length > 0){
            //     params.shopNames = values.shopIDs;
            // }
            if(values.selectedShops && values.selectedShops.length > 0){
                params.shopNames = values.selectedShops;
            }
            if(values.excludeShops && values.excludeShops.length > 0){
                params.shopNames = values.excludeShops;
            }
            if(values.selectedShops && values.excludeShops){
                if(values.selectedShops.length == 0 && values.excludeShops.length == 0  ){
                    params.shopNames = [];
                    params.shopScopeType = 1;
                }
            }
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
                console.log(e);
            }
            // 授权门店过滤
            if(isFilterShopType()){
                let dynamicShopSchema = Object.assign({}, this.props.shopSchema.toJS());
                let {shopSchema = {}} = dynamicShopSchema
                let {shops = []} = shopSchema
                let shopsInfo = shopIDs.split(',')
                params.shopIDs = shopsInfo.filter((item) => shops.some(i => i.shopID == item)).join(',')
            }
            params.shopNames = shopNames || '';
            params.shopIDs = shopIDs || '';
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
            if (value == '110' || value == '111' || value == '115') {
                params.giftValue = 0 // 不传会报错，后台说传0
            }
            if (value == '22') {
                params.giftValue = delivery;
                params.supportOrderTypeLst = '31,20,21,11,10';
                params.isOfflineCanUsing = '0';
            }

            Array.isArray(params.usingDateType) && (params.usingDateType = params.usingDateType.join(','));
            Array.isArray(params.usingWeekType) && (params.usingWeekType = params.usingWeekType.join(','));
            
            // 对旧字段的兼容透传
            params.usingTimeType = Array.isArray(data.usingTimeType) ? data.usingTimeType.join(',') : data.usingTimeType ? data.usingTimeType : '1,2,3,4,5';
            if (value == '20' || value == '21') {
                processFinalCategoryAndDishData(params, 'foodScopes',value);
                if(params.couponFoodScopes && params.couponFoodScopes.length > 0){
                    params.foodNameList = params.couponFoodScopes
                    .map(target => `${target.targetName}${target.targetUnitName || ''}`)
                    .join(',');
                }else{
                    params.foodNameList = []
                }
                params.isFoodCatNameList = params.foodSelectType;
            } else { // foodbxs数据,目前代金券和折扣券用
                processFinalCategoryAndDishData(params, 'foodsboxs',value);
            }
            if (value == '111') { // 折扣券
                let {discountRate:{number:discountNumber}} = data;
                params.discountRate = params.discountRate.number ? params.discountRate.number : discountNumber ? discountNumber : '' ;
                if (Number(params.discountType) === 0) {
                    params.foodSelectType = 2;
                    params.couponFoodScopes = [];
                    params.excludeFoodScopes = [];
                }
            }
            if (value == '110') {// 买赠券
                params = this.justifyParamsForCouponOfBuyGiven(params);
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
            } else if (type === 'copy') {
                callServer = '/coupon/couponService_addBoard.ajax';
                // 复制 关闭关联第三方券 不传这几个字段
                if (!params.TrdTemplate) {
                    if (params.trdChannelID) delete params.trdChannelID
                    if (params.trdTemplateID) delete params.trdTemplateID
                    if (params.extraInfo) delete params.extraInfo
                    if (params.trdTemplateInfo) delete params.trdTemplateInfo
                }
            }
            
            if (formValues.transferLimitType == -1) {
                params.transferLimitType = formValues.transferLimitTypeValue
            }
            if(hasMallArr.includes(value)){
                params.foodSelectType = params.mallScope == '0' ? '1' : '0';
            }else{
                params.foodSelectType = params.foodSelectType;
            }
            
            params.brandSelectType = (params.selectBrands || []).length > 0 ? 0 : 1;
            params.maxUseLimit = params.maxUseLimit || '0';
            params.customerUseCountLimit = params.customerUseCountLimit || '0';
            params.goldGift = Number((params.aggregationChannels || []).includes('goldGift'));
            params.vivoChannel = Number((params.aggregationChannels|| []).includes('vivoChannel'));
            params.moneyLimitType = '0';
            params.moenyLimitValue = '100';
            params.amountType = '';
            //核销限制参数处理
            
            if(params.moneyLimitTypeAndValue && params.moneyLimitTypeAndValue.moneyLimitType){
                const moneyLimitTypeData = JSON.parse(params.moneyLimitTypeAndValue.moneyLimitType);
                if(moneyLimitTypeData && moneyLimitTypeData.moneyLimitType){
                    params.moneyLimitType = moneyLimitTypeData.moneyLimitType;
                    
                    if(params.moneyLimitTypeAndValue.moenyLimitValue){
                        params.moenyLimitValue = params.moneyLimitType == '0' ? '100' : params.moneyLimitTypeAndValue.moenyLimitValue;
                    }
                }
                if(moneyLimitTypeData && moneyLimitTypeData.amountType){
                    params.amountType = moneyLimitTypeData.amountType;
                }
            }
            params.openPushMessageMpID = 1;
            params.openPushSms = params.pushMessage && params.pushMessage.sendType.indexOf('msg') !== -1 ? 1 : 0
            params.reminderTime = params.pushMessage && params.pushMessage.reminderTime
            params.pushMessageMpID = params.pushMessage && params.pushMessage.pushMessageMpID
            params.pushMimiAppMsg = params.pushMessage && params.pushMessage.pushMimiAppMsg
            // 商城券参数调整
            if(hasMallArr.includes(value)){
                this.adjustParamsOfMallGift(params);
            }
            if(hasMallArr.includes(value) && params.applyScene != '0'){
                if(!params.shopIDs){
                    message.warning('请选择适用商城')
                    return
                }
            }
            Array.isArray(params.supportOrderTypeLst) && (params.supportOrderTypeLst = params.supportOrderTypeLst.join(','))
            this.setState({
                finishLoading: true,
            });

            const { accountInfo, startSaving, endSaving } = this.props;
            const groupName = accountInfo.get('groupName');
            startSaving();
            delete params.operateTime;
            delete params.aggregationChannels;
            delete params.couponFoodScopeList; // 后台返回的已选菜品数据
            this.checkShopWechatData(params,callServer,groupName,this.submitData);
           
        });
    }
    // 最后提交数据
    submitData(callServer,params,groupName,that){
        const { endSaving,cancelCreateOrEditGift } = that.props;
        axiosData(callServer, { ...params, groupName }, null, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW').then((data) => {
            endSaving();
            message.success('成功', 3);
            cancelCreateOrEditGift()
        }).catch(err => {
            endSaving();
        });
    }
    // 判断选择的小程序或者公众号与微信支付商家券下账务主体是否绑定关系
    checkShopWechatData(params,callServer,groupName,cb) {
        const _that = this;
        const { endSaving } = this.props;
        const groupID = params.groupID;
        const trdChannelID =  params.trdChannelID;
        if(params.trdTemplateInfo && JSON.stringify(params.trdTemplateInfo) != '{}'){//关联第三方券
            const trdTemplateInfoData = JSON.parse(params.trdTemplateInfo); 
            let appId = trdTemplateInfoData.appID ? trdTemplateInfoData.appID : '';
            let merchantInfo = {};
            let settleId = '';
            let mpType = trdTemplateInfoData.mpType;
            if(trdTemplateInfoData.merchantInfo){
                merchantInfo = trdTemplateInfoData.merchantInfo;
                settleId = merchantInfo.settleId ? merchantInfo.settleId : '';
            }
            if(trdChannelID == '50'){
                axiosData('/wxpay/appMatchPayChannel', {
                    'groupID':groupID,
                    'appID':appId,
                    'settleID':settleId
                }, null, {
                    path: '',
                }, 'HTTP_SERVICE_URL_ISV_API')
                    .then((res) => {
                        const {matchSettle} = res;
                        if( matchSettle ){
                            cb(callServer,params,groupName,_that)
                            return true
                        }else{
                            if(mpType === "SERVICE_AUTH"){
                                Modal.error({
                                    title: '选择的公众号与账务主体未绑定',
                                    content: '请联系商务绑定后再操作',
                                });
                            }
                            if(mpType === "MINI_PROGRAM_AUTH"){
                                Modal.error({
                                    title: '选择的小程序与账务主体未绑定',
                                    content: '请前往 顾客管理端>微信及支付宝小程序>微信商家独立小程序>更多>绑定账务主体 进行绑定操作',
                                });
                            } 
                            endSaving();
                            return false
                        }
                    })
            }else{
                cb(callServer,params,groupName,_that)
            }
            
        }else{
            cb(callServer,params,groupName,_that)
        }
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
                        initialValue: discountType ? String(discountType) : '0',
                    })(<Select
                        style={{
                            width: 150,
                        }}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            [
                            { label: '整单折扣', value: '0' },
                            { label: '指定菜品折扣', value: '1' },
                            { label: '单品折扣', value: '2' },
                        ].map((t) => {
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

    renderGiveFoodCount(decorator, form) {
        const { giveFoodCount } = this.props.gift.data;
        return (
            <Row>
                <Col span={10}>
                    <FormItem style={{marginBottom: 0}}>
                        {
                            decorator({
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
                    </FormItem>
                </Col>
                <Col span={14}>
                    { this.renderDiscountSettingWrapper(decorator, form)}
                </Col>
            </Row>
        )

    }

    renderSpecifiedDiscountSetting = (decorator, type)=>{
        switch(type) {
            case '2':
               return this.renderDiscountRateSetting(decorator);
            case '3':
                return this.renderDiscountDecreaseVolSetting(decorator);
            case '1':
                return this.renderSpecialPriceVolSetting(decorator);
        }
    }

    renderDiscountSettingWrapper = (decorator, form)=>{
        const { getFieldValue } = form;
        let discountRule = getFieldValue('discountRule');
        let lableArray = ['特价','折扣','立减']
        return (
            <Row type="flex" justify="space-around" align="middle">
                <Col span={6}>
                    <div style={{textAlign: 'right'}}>
                        <span style={{marginRight: 10}}>
                            {lableArray[Number(discountRule)-1]}
                        </span>
                    </div>
                </Col>
                <Col span={18}>
                    {
                        this.renderSpecifiedDiscountSetting(decorator, discountRule)
                        //this.renderDiscountRateSetting(decorator)
                    }
                </Col>
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

    // 折扣设置
    renderDiscountRateSetting(decorator) {
        // 数据回显
        const { gift : { data }} = this.props;
        let val = data.reduceValue;
        return (
            <FormItem style={{marginBottom: 0}}>
                {decorator({
                    key: 'discountRateSetting',
                    rules: [{required: true, message: '不能为空'}, {
                        validator: (rule, num, cb) => {
                            Number(num) > 0 &&  Number(num) < 100 ? cb() : cb(rule.message);
                        },
                        message: '请输入1-99之间的整数',
                    },{
                        validator: (rule, v, cb) => {
                            // if (!/^\+?\d{0,2}$/.test(Number(v))) {
                            //     cb(rule.message);
                            // }
                            // cb();
                            if (!/^[1-9]\d*$/.test(Number(v))) {
                                cb(rule.message);
                            }
                            cb();
                        },
                        message: '只能输入整数且不超过2位',
                    }],
                    initialValue: val
                })(<Input
                type="number"
                placeholder="例如 50"
                size="large"
                addonAfter="%" />)}
            </FormItem>
        )
    }

    // 买赠立减
    renderDiscountDecreaseVolSetting(decorator) {

        // 数据回显
        const { gift : { data }} = this.props;
        let val = data.reduceValue == undefined ? null : data.reduceValue;

        return (
            <FormItem style={{marginBottom: 0}}>
                {decorator({
                    key: 'discountDecreaseVolSetting',
                    rules: [{required: true, message: '不能为空'}, {
                        validator: (rule, num, cb) => {
                            Number(num) > 0 &&  Number(num) <= 10000 ? cb() : cb(rule.message);
                        },
                        message: '请输入大于0，整数五位数以内且小数2位数以内的数值',
                    }],
                    initialValue: val
                })(<Input
                type="number"
                placeholder="输入立减金额"
                size="large"
                addonAfter="元" />)}
            </FormItem>
        )
    }

    // 买赠券特价
    renderSpecialPriceVolSetting(decorator) {
        // 数据回显
        const { gift : { data }} = this.props;
        let val = data.reduceValue == undefined ? 0 : data.reduceValue;
        return (
            <FormItem style={{marginBottom: 0}}>
                {decorator({
                    key: 'specialPriceVolSetting',
                    rules: [{required: true, message: '不能为空'}, {
                        validator: (rule, num, cb) => {
                            Number(num) >= 0 &&  Number(num) <= 10000 ? cb() : cb(rule.message);
                        },
                        message: '请输入大于等于0，整数5位以内且小数2位以内的数值',
                    }],
                    initialValue: val
                })(<Input
                type="number"
                placeholder="输入特价价格"
                size="large"
                addonAfter="元" />)}
            </FormItem>
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
        //    一笔订单同时满足多个单品，优惠金额按照 BOGOdiscountWay 0 高价单品优先 1 低价单品优先
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
    renderShareImgSettings(decorator) {
        const { gift: { data } } = this.props;
        let {values} = this.state
        let {transferImage = {}} = values
        let {transferImagePath = '', transferThumbnailImagePath = ''} = transferImage
        return (
            <Row>
                <Col>
                    {decorator({
                        rules: [{ required: false, message: ' ' }]
                    })(
                        <PhotoFrame
                            restaurantShareImagePath={transferThumbnailImagePath}
                            shareImagePath={transferImagePath}
                            onChange={this.onRestImg}
                            type={''}
                        />
                    )}
                </Col>
            </Row>
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
    changeShopNames = (val) => {
        const {values} = this.state;
        values.shopNames = val;
        values.shopScopeType = 1;
        values.excludeShops = [];
        this.setState({ 
            values:Object.assign({},values)
        });
    }
    renderShopNames(decorator) {
        const { shopNames = [],excludeShops = [],selectBrands = [],applyScene } = this.state.values;
        const { gift: { data } } = this.props;
        const brandList = selectBrands.map(x=>x.targetID);
        return (
            <Row style={{ marginBottom: shopNames.length === 0 ? -15 : 0 }}>
                <Col style={{position:'relative'}}>
                    {applyScene == 2 || (selectBrands && selectBrands.length == 0 && excludeShops.length == 0) ? null : <div className={styles.disabledWrapper}></div>}
                    {decorator({
                        onChange:this.changeShopNames
                    })(
                        <ShopSelector
                            brandList={brandList}
                            isCreateCoupon = {true}
                            filterParm={isFilterShopType() ? {productCode: 'HLL_CRM_License'} : {}}
                        />
                    )}
                </Col>
                <p style={{ 
                    color: 'orange', 
                    display: shopNames.length > 0 ? 'none' : 'block' ,
                    width: '100%',
                    height: '32px',
                    lineHeight:'32px',
                    background: '#FFFBE6',
                    borderRadius: '4px',
                    border: '1px solid #FFE58F',
                    marginTop:'4px',
                    marginBottom:'14px',
                    paddingLeft:'10px'
                }}>未选择门店时默认所有门店通用</p>
            </Row>
        )
    }
    changeExcludeShopNames = (val) => {
        const {values} = this.state;
        values.shopNames = val;
        values.shopScopeType = 2;
        values.selectedShops = [];
        this.setState({ 
            values:Object.assign({},values)
        });
    }
    renderExcludeShops(decorator) {
        const { shopNames = [],selectedShops = [],selectBrands = []} = this.state.values;
        let { gift: { data } } = this.props;
        const brandList = selectBrands.map(x=>x.targetID);
        return (
            <Row style={{ marginBottom: 5,position:'relative' }}>
                <Col style={{position:'relative'}}>
                    {selectBrands && selectBrands.length > 0 && selectedShops.length == 0 ? null : <div className={styles.disabledWrapper}></div>}
                    {decorator({
                        onChange:this.changeExcludeShopNames
                    })(
                        <ShopSelector
                            brandList={brandList}
                            isCreateCoupon = {true}
                            filterParm={isFilterShopType() ? {productCode: 'HLL_CRM_License'} : {}}
                        />
                    )}
                </Col>
                <p style={{ 
                    color: 'orange', 
                    display: shopNames.length > 0 ? 'none' : 'block' ,
                    width: '100%',
                    height: '32px',
                    lineHeight:'32px',
                    background: '#FFFBE6',
                    borderRadius: '4px',
                    border: '1px solid #FFE58F',
                    marginTop:'4px',
                    marginBottom:'14px',
                    paddingLeft:'10px'
                }}>排除店铺不选择时，默认所有店铺都不排除</p>
            </Row>
        )
    }
    
    renderisNeedCustomerInfo = (decorator) => {
        const combineTypes = hasMallArr;
        const { gift: {data,value }} = this.props;
        const { values:{isNeedCustomerInfo}} = this.state;
        const checked = isNeedCustomerInfo ? isNeedCustomerInfo : data.isNeedCustomerInfo ? data.isNeedCustomerInfo : false
        return (
                combineTypes.includes(value) ? 
                <FormItem style={{marginLeft:-10}}>
                    <Col span={7}>核销校验会员</Col>
                    <Col span={16}>
                        {
                            decorator({
                            })(
                                <Switch
                                    checkedChildren="是"
                                    unCheckedChildren="否"
                                    size="small"
                                    checked={checked}
                                />
                            )
                        }
                    </Col>
                </FormItem> 
                :
                <FormItem>
                    <Col span={5}>核销校验会员</Col>
                    <Col span={16}>
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
                </FormItem>
        )
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
    renderMoneyLimitTypeAndValue(decorator) {
        const { gift: { data, value } } = this.props;
        
        const { isActivityFoods } = this.state;
        const {
            moneyLimitType = '0',
            moenyLimitValue = '100',
            amountType = ''
        } = data;
        return (
            decorator({
                rules: [
                    {
                        validator: (rule, {moneyLimitType, moenyLimitValue} = {}, cb) => {
                            if (moneyLimitType > 0 && !(moenyLimitValue > 0)) {
                                return cb('请输入限制金额')
                            }
                            cb()
                        }
                    }
                ],
                initialValue: { moneyLimitType:JSON.stringify({moneyLimitType,amountType}), moenyLimitValue },
            })(<MoneyLimitTypeAndValue type={value} isActivityFoods={isActivityFoods} giftInfo={data}></MoneyLimitTypeAndValue>)
        )
    }
    renderFoodsboxs(decorator) {
        const { gift: { data,value } } = this.props;
        const { values:{mallScope}} = this.state;
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
            <FormItem
                style={{
                    width: '149.176%',
                    marginTop: -12,
                    marginBottom: -15,
                    display: this.isHuaTianSpecificCoupon() ? 'none' : 'block',
                }}>
                {
                    decorator({})(
                        hasMallArr.includes(value) ? 
                            <CategoryAndFoodSelectors
                                scopeLst={scopeList}
                                showEmptyTips={true}
                                mallScope={mallScope}
                            />
                            :
                            <GiftCategoryAndFoodSelector
                                scopeLst={scopeList}
                                showEmptyTips={true}
                            /> 
                    )
                }
            </FormItem>
        )
    }
    renderFoodName(decorator, form) {
        const { gift: { data,value } } = this.props;
        const { values:{mallScope}} = this.state;
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

        // if (!scopeList.length) { // 历史数据，只有fooNameList，兼容显示
        //     let { isFoodCatNameList = '1', foodNameList = [] } = this.props.gift.data;
        //     scopeList = foodNameList.map(nameStr => ({
        //         scopeType: isFoodCatNameList == 1 ? 1 : 2,
        //         targetName: nameStr,
        //         targetUnitName: '',
        //     }))
        // }

        return (
            <div
                style={{
                    width: '149.176%',
                }}
                className={styles.foodSelectorWrapper}
            >
                {
                    decorator({
                        // rules: [
                        //     {
                        //         validator: (rule, v, cb) => {
                        //             const {
                        //                 dishes = [],
                        //                 foodCategory = [],
                        //             } = v || {};
                        //             if (!dishes.length && !foodCategory.length) {
                        //                 return cb(rule.message);
                        //             }
                        //             cb();
                        //         },
                        //         message: '不可为空',
                        //     },
                        // ],
                    })(
                        hasMallArr.includes(value) ? 
                            <CategoryAndFoodSelectors
                                scopeLst={scopeList}
                                showEmptyTips={true}
                                mallScope={mallScope}
                                giftType={value}
                                foodUnitType={this.state.foodUnitType}
                            />
                            :
                            <GiftCategoryAndFoodSelector
                                scopeLst={scopeList}
                                showEmptyTips={true}
                            /> 
                    )
                }
            </div>
        )
    }
    // 适用商城
    renderMallListSelector = (decorator)=>{
        const { malls : mallList, values } = this.state;
        const {gift:{data}} = this.props;
        let initialValue;
        if(values.applyScene == '1'){
            if(values.shopIDs && values.shopIDs.length > 0){
                initialValue = values.shopIDs[0];
            }else{
                initialValue = undefined
            }
        }
        if(values.applyScene == '2'){
            if(values.shopIDs && values.shopIDs.length > 0){
                let len = values.shopIDs.length
                initialValue = values.shopIDs[len - 1];
            }else{
                initialValue = undefined
            }
        }
        return (
            decorator({
                key: 'selectMall',
                rules: [
                    {required: true, message: '必须选择一个商城'}
                ],
                initialValue,
            })(
                <SelectMall
                    dataSource= { mallList }
                    onMallChange = { (shopID)=>{ this.handleMallChange(shopID)}}
                />
            )

        )
    }

    // 商城分类
    renderMallCategorySelector = (decorator, form) => {
        const { goodCategories, goods, gift: {
            value: giftTypeValue
        },type} = this.props;
        const { values } = this.state;
        let initialValue = [];
        let showToolTips = false;
        if(values.applyScene == '1' || values.applyScene == '2') {
            if(goodCategories instanceof Array && goodCategories.length == 0) {
                // data.selectBrands[0].targetID; 当前店铺 ID
                // 区分回显还是新建
                if(values.hasOwnProperty('shopIDs') && values.shopIDs instanceof Array && values.shopIDs.length > 0) {
                    // 满足以上全部条件（回显模式下需要满足）
                    this.handleMallChange(values.shopIDs[0]);
                }
            } else {
                // 前端传到后端采用拼接，组合成 couponFoodScope， 后端返回字段名称又改为 couponFoodScopeList
                if(goodCategories.length > 0){
                    goodCategories.forEach((item1) => {
                        if(values.couponFoodScopeList instanceof Array && values.couponFoodScopeList.length > 0) {
                            values.couponFoodScopeList.forEach((item2)=>{
                                if(item2.targetID == item1.value){
                                    initialValue.push(item2.targetID)
                                }
                            });
                        }
                    })
                }
            }
        }
        
        // 调整校验规则
        let rules = [
            {
                required: true,
                message: '请选择商品分类'
            }
        ];
        if (giftTypeValue == '10') {
            rules = [];
        }
        if(type != 'edit'){
            initialValue = []
        }
        // 调整 toolTips, 代金券。且内容为空时
        if(giftTypeValue == '10') {
            if(initialValue instanceof Array &&  initialValue.length == 0) {
                showToolTips = true;
            }
            if(form.getFieldValue('mallCategory') instanceof Array && form.getFieldValue('mallCategory') == 0 ) {
                showToolTips = true;
            }
        }
        return (
            <div>
                {
                    decorator({
                        key: 'mallCategory',
                        rules,
                        initialValue,
                    })(
                        <SelectMallCategory
                            dataSource = { goodCategories }
                        />
                    )
                }
                {showToolTips && (
                    <div
                        style={{
                            color: 'orange',
                            overflow: 'hidden',
                            marginBottom: '8px',
                            width: '300px',
                            height: '32px',
                            background: '#FFFBE6',
                            borderRadius: '4px',
                            border: '1px solid #FFE58F',
                            paddingLeft: '10px'
                        }}
                    >
                        未选择时默认所有可用
                    </div>
                )}
            </div>
        );

    }

    // 商城商品选择（根据具体的类）
    renderMallExcludeGoodsSelector = (decorator) => {
        const { goods, goodCategories } = this.props;
        const { values} = this.state;
        let initialValue = [];
        if(values.applyScene == '1' || values.applyScene == '2') {
            // 适用菜品方式 0：按菜品单品 1：按菜品分类 2：不限制
            // params.foodSelectType = params.mallScope == '0' ? '1' : '0';
            if(values.hasOwnProperty('foodSelectType') && values.foodSelectType == '1') {
                if(values.hasOwnProperty('excludeFoodScopes') && values.excludeFoodScopes instanceof Array &&  values.excludeFoodScopes.length > 0) {
                    initialValue = values.excludeFoodScopes.map((item)=>{
                        return item.targetID;
                    });
                }
            }
        }
        return (
            decorator({
                key: 'mallExcludedGood',
                rules: [],
                initialValue,
            })(
                <MultipleGoodSelector
                    placeholder="选择排除商品"
                    allDishes={ goods }
                    allCategories={ goodCategories }
                />
            )

        )
    }

    renderMallIncludeGoodsSelector = (decorator, form) => {
        const { gift: { name: describe, data }, type } = this.props;
        const { goods, goodCategories } = this.props;
        const { values} = this.state;

        let showToolTips = true;
        let mallIncludeGoods = form.getFieldValue('mallIncludeGood');
        if(mallIncludeGoods instanceof Array && mallIncludeGoods.length > 0) {
            showToolTips = false;
        }
        let initialValue = [];
        if(values.applyScene == '1' || values.applyScene == '2') {

            // 适用菜品方式 0：按菜品单品 1：按菜品分类 2：不限制
            // params.foodSelectType = params.mallScope == '0' ? '1' : '0';
            if(goodCategories instanceof Array && goodCategories.length == 0) {
                // data.selectBrands[0].targetID; 当前店铺 ID
                // 区分回显还是新建
                if(values.hasOwnProperty('shopIDs')) {
                    // 满足以上全部条件（回显模式下需要满足）
                    this.handleMallChange(values.shopIDs[0]);
                }
            }

            if(values.hasOwnProperty('foodSelectType') && values.foodSelectType == '0') {
                // if(values.hasOwnProperty('couponFoodScopeList') && values.couponFoodScopeList instanceof Array &&  values.couponFoodScopeList.length > 0) {
                //     
                //     initialValue = values.couponFoodScopeList.map((item)=>{
                //         return item.targetID;
                //     });
                // }
                if(values.hasOwnProperty('mallIncludeGood') && values.mallIncludeGood instanceof Array &&  values.mallIncludeGood.length > 0) {
                    initialValue = values.mallIncludeGood;
                }
            }

            if(initialValue instanceof Array && initialValue.length > 0) {
                showToolTips = false;
            }
        }

        let rules = [], tips;
        if(describe != '代金券') {
            rules = [{
                required: true,
                message: '必须选择适用商品'
            }];
            tips = '不能为空';
        } else {
            tips = '未选择时默认所有';
        }
        return (
            <div>
                {
                    decorator({
                        key: 'mallIncludeGood',
                        rules: rules,
                        initialValue,
                    })(
                    <MultipleGoodSelector
                        placeholder="选择商品"
                        allDishes={ goods }
                        allCategories={ goodCategories }
                    />)
                }
                {showToolTips && (
                    <div
                        style={{
                            color: 'orange',
                            overflow: 'hidden',
                            marginBottom: '8px',
                            width: '300px',
                            height: '32px',
                            background: '#FFFBE6',
                            borderRadius: '4px',
                            border: '1px solid #FFE58F',
                            paddingLeft: '10px'
                        }}
                    >
                        {tips}
                    </div>
                )}
            </div>
        )
    }

    // 选择商城
    // 对应的表单内容（商城类别、商城商品要进行变更）
    handleMallChange(shopID) {
        this.props.getMallGoodsAndCategories(shopID);
    }


    renderBuyGiveFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        let { couponFoodScopeList = []} = data;
        const scopeList = couponFoodScopeList.map(food => ({scopeType: 2, ...food}));
        return (
            decorator({
                rules: [
                    {
                        required: true,
                        validator: (rule, v, cb) => {
                            const { dishes = [] } = v || {};
                            if (!dishes.length) {
                                return cb(rule.message);
                            }
                            cb();
                        },
                        message: '不可为空',
                    },
                ],
            })(
                <CategoryAndFoodSelectors
                    dishOnly
                    priceLst={scopeList}
                />
            )
        )
    }

    renderBuyGiveSecondaryFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        let { couponFoodOfferList = [] } = data;
        const scopeList = couponFoodOfferList.map(food => ({
            scopeType: 2,
            targetName: food.foodName,
            targetUnitName:food.foodUnitName,
            ...food
        }));
        return (
            decorator({
                rules: [
                    {
                        required: true,
                        validator: (rule, v, cb) => {
                            const { dishes = [] } = v || {};
                            if (!dishes.length) {
                                return cb(rule.message);
                            }
                            cb();
                        },
                        message: '不可为空',
                    },
                ],
            })(
                <CategoryAndFoodSelectors
                    dishOnly
                    priceLst={scopeList}
                />
            )
        )
    }


    renderCouponTrdChannelStockNums(decorator, form) {
        return (
            decorator({})(<CouponTrdChannelStockNums form={form} giftItemID={this.props.gift.data.giftItemID} />)
        )
    }

    /**
     * @description 调整后端返回数据的key, 对应到前端表单key
     * @example 满减券后端优惠规则 key 为 reduceType, 对应前端key为discountRule
     * @notice 所有需要赋值的字段，如果已经有了该字段则不进行变更
    */
    justifyServerEndKeyToFormKeys(data) {

        // 根据后端返回数据来进行前端数据进行变更。
        // data.discountRule = `${data.reduceType}`;
        data.discountRule = data.reduceType == undefined ? '1' : `${data.reduceType}`;

        // 组合买赠券复合组件属性，优惠菜品数量及优惠值
        data.compositeDiscount = {
            reduceValue: data.reduceValue,
            reduceType: data.reduceType
        };
        delete data.reduceType;

        // 商城默认值为0
        data.mallScope = '0';
        if(data.hasOwnProperty('foodSelectType') && data.foodSelectType == '0') {
            data.mallScope = '1'
        }
        if(data.hasOwnProperty('shopIDs')) {
            if(data.hasOwnProperty('applyScene') && data.applyScene == '1') {
                data.selectMall = data.shopIDs
            }
        }

        // 买赠券
        data.discountSortRule = data.priceSortRule == undefined ? '0' : `${data.priceSortRule}`;

        // MallCategory (分类模式)
        // 渲染的时候没有处理，直接用后端的字段  couponFoodScopeList 进行处理
        // TODO: 这块代码优化下，重复。发版时间紧急
        if(data.mallScope == '0') {
            if(data.hasOwnProperty('couponFoodScopeList') && data.couponFoodScopeList instanceof Array) {
                data.mallCategory = data.couponFoodScopeList.map((item)=>{
                    return item.targetID;
                })
            }
        } else if(data.mallScope == '1'){
            if(data.hasOwnProperty('couponFoodScopeList') && data.couponFoodScopeList instanceof Array) {
                data.mallIncludeGood = data.couponFoodScopeList.map((item)=>{
                    return item.targetID;
                })
            }
        }
        // 券转赠 分享信息 数据转换
        let {transferType, transferInfo = '{}'} = data
        transferInfo = JSON.parse(transferInfo)
        let {transferTitle = '', transferThumbnailImagePath = '', transferImagePath = '', transferringAvailable = ''} = transferInfo
        if(transferType){
            data.transferTitle = transferTitle
            data.transferringAvailable = transferringAvailable
            data.transferImage = {transferImagePath, transferThumbnailImagePath}
        }

        return data;
    }

    /**
     * @description 动态调整表单结构思路。 1. 初始表单值 根据配置文件从配置中取。 动态的，根据values值去动态添加或者删除
     * 根据所有的key值，根据其value的不同取值，动态调整某些key是否可见。只在显示的时候做动态处理，不保存到state中
     * @example 代金券 商城模式 适用场景 如果为0.及分类，这时可选商品不可见。（但是配置项是所有的。这里要动态进行删除操作）
    */
    justifyFormKeysToDisplay = () => {
        const { gift: { name: describe, value, data }, visible, type } = this.props,
        { firstKeys, secondKeys, thirdKeys,fourthKeys,values, unit } = this.state;

        // 数据拷贝（隔离）
        let firstKeysToDisplay = JSON.parse(JSON.stringify(firstKeys[describe]));
        let secondKeysToDisplay = JSON.parse(JSON.stringify(secondKeys[describe]));
        let thirdKeysToDisplay = {};
        let fourthKeysToDisplay = {};
        if(thirdKeys[describe]){
            thirdKeysToDisplay = JSON.parse(JSON.stringify(thirdKeys[describe]));
        }
        if(fourthKeys[describe]){
            fourthKeysToDisplay = JSON.parse(JSON.stringify(fourthKeys[describe]));
        }
        if(describe == '代金券' || describe == '菜品优惠券' || describe == '菜品兑换券' || describe == '不定额代金券') {
                if(values.applyScene == '0') {
                    // 店铺券
                    firstKeysToDisplay[0].keys = [...FIRST_KEYS[describe][0].keys];
                    secondKeysToDisplay[0].keys = [...SECOND_KEYS[describe][0].keys];
                    if(describe != '不定额代金券'){
                        thirdKeysToDisplay[0].keys = [...THIRD_KEYS[describe][0].keys];
                    }
                }else if(values.applyScene == '1') {// 商城券
                    firstKeysToDisplay[0].keys = [...FIRST_KEYS[describe][0].keys];
                    secondKeysToDisplay[0].keys = [...SECOND_KEYS[describe][0].keys];
                    fourthKeysToDisplay[0].keys = [...FOURTH_KEYS[describe][0].keys];
                    if(values.mallScope == '0' || values.mallScope == undefined) {
                        fourthKeysToDisplay[0].keys = fourthKeysToDisplay[0].keys.filter((key)=>{
                            return key !== 'mallIncludeGoodSelector';
                        });
                    } else {
                        fourthKeysToDisplay[0].keys = fourthKeysToDisplay[0].keys.filter((key)=>{
                            return key !== 'mallCategorySelector' && key !== 'mallExcludeGoodSelector';
                        });
                    }
                }else if(values.applyScene && values.applyScene == '2'){
                    firstKeysToDisplay[0].keys = [...FIRST_KEYS[describe][0].keys];
                    secondKeysToDisplay[0].keys = [...SECOND_KEYS[describe][0].keys];
                    thirdKeysToDisplay[0].keys = [...THIRD_KEYS[describe][0].keys];
                    fourthKeysToDisplay[0].keys = [...FOURTH_KEYS[describe][0].keys];
                    thirdKeysToDisplay[0].keys = thirdKeysToDisplay[0].keys.filter(item => item != 'excludeShops');
                    if(values.mallScope == '0' || values.mallScope == undefined) {
                        fourthKeysToDisplay[0].keys = fourthKeysToDisplay[0].keys.filter((key)=>{
                            return key !== 'mallIncludeGoodSelector';
                        });
                    } else {
                        fourthKeysToDisplay[0].keys = fourthKeysToDisplay[0].keys.filter((key)=>{
                            return key !== 'mallCategorySelector' && key !== 'mallExcludeGoodSelector';
                        });
                    }
                }
            
            

            // 根据券与券公用来调整是否显示选券表单 （动态增加）
            if(values.hasOwnProperty('giftShareType') && values.giftShareType == '2') {
                const giftShareTypeIdx = _.findIndex(secondKeysToDisplay[0].keys, item => item == 'giftShareType');
                if(giftShareTypeIdx != -1) {
                    secondKeysToDisplay[0].keys.splice(giftShareTypeIdx + 1, 0, 'shareIDs');
                }
            }

            // 根据账单金额限制控制一笔订单最多使用多少张（动态增加）
            // @Notice 仅限 菜品兑换券，代金券，菜品优惠券三种场景
            if(values.hasOwnProperty('moneyLimitTypeAndValue')) {
                if(values.moneyLimitTypeAndValue.hasOwnProperty('moneyLimitType')) {
                    const { moneyLimitType } = values.moneyLimitTypeAndValue;
                    // moneyLimitType = 1 为每满
                    if( moneyLimitType == '1') {
                        const moneyLimitTypeAndValueIndex = _.findIndex(secondKeysToDisplay[0].keys, item => item == 'moneyLimitTypeAndValue');
                        if(moneyLimitTypeAndValueIndex != -1) {
                            // 菜品优惠券不支持一笔订单使用张数的限制设置
                            // http://jira.hualala.com/browse/WTCRM-2756
                            if(describe != '菜品优惠券') {
                                secondKeysToDisplay[0].keys.splice(moneyLimitTypeAndValueIndex + 1, 0, 'maxUseLimit');
                            }

                        }
                    }

                }
            }
        }

        if(describe == '代金券' || describe == '菜品优惠券' || describe == '菜品兑换券' || describe == '折扣券' || describe == '配送券' || describe == '买赠券' || describe == '不定额代金券') {
            if(values.transferType == '0' || values.transferType == undefined) {
                secondKeysToDisplay[0].keys = secondKeysToDisplay[0].keys.filter((key)=>{
                    return key !== 'transferTitle' &&　key !== 'transferImage' && key !== 'transferringAvailable';
                });
            } else {
                secondKeysToDisplay[0].keys = secondKeysToDisplay[0].keys.filter((key)=>{
                    return key !== '';
                });
            }
        }

        if(describe === '线上礼品卡') {
            const keys = firstKeysToDisplay[0].keys
            const firstKeysToDisplayKeys = keys.filter(v => v !== 'selectBrands')
            firstKeysToDisplay[0].keys = firstKeysToDisplayKeys


        }

        // 'discountRateSetting',                   // 折扣设置 （注释掉，通过代码动态注释）
        // 'specialPriceVolSetting',                // 特价设置
        // 'discountDecreaseVolSetting',            // 立减
        // if(describe == '买赠券'){
        //     if ( values.discountRule != undefined) {
        //         switch(values.discountRule) {
        //             case '1':
        //                 firstKeysToDisplay[0].keys = firstKeysToDisplay[0].keys.filter((key)=>{
        //                     return key != 'discountRateSetting' && key != 'discountDecreaseVolSetting'
        //                 });
        //                 break;
        //             case '2':
        //                 firstKeysToDisplay[0].keys = firstKeysToDisplay[0].keys.filter((key)=>{
        //                     return key != 'specialPriceVolSetting' && key != 'discountDecreaseVolSetting'
        //                 });
        //                 break;
        //             case '3':
        //                 firstKeysToDisplay[0].keys = firstKeysToDisplay[0].keys.filter((key)=>{
        //                     return key != 'specialPriceVolSetting' && key != 'discountRateSetting'
        //                 });
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }


        // }
        return {
            firstKeysToDisplay,
            secondKeysToDisplay,
            thirdKeysToDisplay,
            fourthKeysToDisplay,
        };
    }

    renderApplyScene = (decorator, form)=>{
        const {type,gift: { name: describe, value, data }} = this.props;
        const { values:{applyScene} } = this.state;
        const useValue = applyScene ? applyScene : data.applyScene ? data.applyScene : '0';
        let groupValue = null;
        switch (useValue){
            case '0':
                groupValue=['0'];
                break;
            case '1':
                groupValue=['1'];
                break;
            case '2':
                groupValue=['0','1'];
                break;
        }
        let applySceneOpts = [
            {label:'店铺券',value:'0'},
            {label:'商城券',value:'1'},
        ]
        if(describe == '不定额代金券'){
            applySceneOpts = [{label:'店铺券',value:'0'}]
        }
        let disabled = false
        if(type == 'edit' || describe == '不定额代金券' || form.getFieldValue('foodUnitType') == 1) {
            disabled = true;
        }
        return  decorator({
            key:'applyScene',
            initialValue:groupValue
        })(
            <Checkbox.Group  
                disabled={disabled} 
                options={applySceneOpts}
            />
        )
    }
    //重新选择所属品牌，清空适用店铺和排除店铺
    changeSelectedBrands(value,form){
        const {values} = this.state;
        const { gift: { value:giftType }, type } = this.props;
        values.selectedShops = [];
        values.excludeShops = [];
        values.shopNames = [];
        values.shopIDs = [];
        values.selectBrands = value;
        form.setFieldsValue({
            selectedShops: [],
            excludeShops: [],
            shopIDs:[]
        });
        if(giftType == '22' || giftType == '110' || giftType == '111' ){
            if(this.secondForm){
                this.secondForm.setFieldsValue({
                    selectedShops: [],
                    excludeShops: [],
                    shopIDs:[]
                });
            }
        }
        this.setState({ 
            values:Object.assign({},values)
        });
    }
    renderSelectBrands = (decorator,form) => {
        const { values} = this.state;
        return  decorator({
            key:'selectBrands',
            initialValue:values.selectBrands,
            onChange:(value) => this.changeSelectedBrands(value,form)
        })(
            <SelectBrands />
        )
    }
    
    /**
     * @description
     * @params this.props.gift 传入的参数
     * @params this.props.gift.data 如果不为undefined，在编辑和展示模式下，为后端返回的数据，前后端数据如果有key值不同，则需要进行变更处理
    */
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props,
            { firstKeys, secondKeys, values, unit,groupID } = this.state;
        const {applyScene} = values;
        // 判断是否是空对象
        // 影响 PhonePreview 回显。
        let formData =JSON.stringify(values) == '{}' ? data : values ;
        const { firstKeysToDisplay: displayFirstKeys, secondKeysToDisplay: displaySecondKeys,thirdKeysToDisplay:displayThirdKeys,fourthKeysToDisplay:displayFourthKeys} = this.justifyFormKeysToDisplay();

        if (formData.shopNames && formData.shopNames.length > 0 && formData.shopNames[0].id) {
            formData.shopNames = formData.shopNames.map(shop => shop.id);
        }

        if (formData.moneyTopLimitValue) {
            formData.moneyTopLimitType = '1'
        } else {
            formData.moneyTopLimitType = '0'
        }
        if (formData.numberOfTimeValue) {
            formData.numberOfTimeType = '1'
        } else {
            formData.numberOfTimeType = '0'
        }
        if(formData.applyScene){
            formData.applyScene = formData.applyScene.toString()
        }
        
        // 折扣上限显示
        if (value == '111' && formData.discountOffMax == 0) {
            formData.discountOffMax = ''
        }
        let giftValueLabel = '可抵扣金额';
        if (value == '10' || value == '91') {
            giftValueLabel = '礼品价值';
        }
        if (value == '21') {
            giftValueLabel = '兑换金额';
        }
        const isUnit = ['10', '91'].includes(value);
        const giftNameValid = (type === 'add') ? { max: 25, message: '不能超过25个字符' } : {};
        // 定义所有类型的表单项，根据不同礼品类型进行配置
        const formItems = {
            ...FORMITEMS,
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            // 新增礼品商城属性
            // 券应用场景（店铺，商城）
            applyScene: {
                label: '礼品属性',
                rules: [
                    { required: true,message:'至少选择一项' },
                    // {
                    //     validator: (rule, v, cb) => {
                    //         if(v.length == 0){
                    //             cb('至少选择一项');
                    //         }
                    //         cb()
                    //     },
                    // },
                ],
                type: 'custom',
                defaultValue: ['0'],
                render: (decorator, form) => this.renderApplyScene(decorator, form)
            },

            pushMessage: {
                label: <span>
                <span>推送方式</span>
                <Tooltip title={
                    <div>
                        <p>
                            公众号推送：在所选公众号推送 券到账/券到期/券核销提醒
                        </p>
                        <p>
                            服务通知：在所选小程序推送礼品到账提醒/礼品过期提醒
                        </p>
                        <p>
                            短信推送：推送 券到账/券到期/券剩余数量 短信提醒
                        </p>
                    </div>
                    
                }>
                    <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                </Tooltip></span>,
                rules: [{
                    validator: (rule, v, cb) => {
                        if (!v.pushMessageMpID) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '请选择微信推送的公众号',
                },{
                    validator: (rule, v, cb) => {
                        if (v.sendType.indexOf('wechat') === -1) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '微信推送为必选项',
                },{
                    validator: (rule, v, cb) => {
                        if (v.sendType.indexOf('mini') > -1 && !v.pushMimiAppMsg) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '请选择推送的小程序',
                }],
                type: 'custom',
                render: (decorator,form) => {
                    return (
                        <Col>
                            {
                                decorator({})(
                                    <PushMessageMpID formData = {formData} groupID={groupID}/>
                                )
                            }
                            <span>* 此处为该券模板支持的推送方式，最终是否推送消息以营销活动配置为准</span>
                        </Col>
                    )
                }
            },
            giftImagePath: {
                label: '礼品图样',
                type: 'custom',
                render: decorator => decorator({})(<GiftImagePath/>),
            },
            selectBrands: {
                label: '所属品牌',
                type: 'custom',
                render: (decorator, form) => this.renderSelectBrands(decorator, form)
            },
            cardTypeList: {
                label: '适用卡类',
                type: 'custom',
                render: decorator => decorator({})(<SelectCardTypes/>),
            },

            // 券增加商城类别
            selectMall: {
                label: '适用商城',
                type: 'custom',
                render: decorator => this.renderMallListSelector(decorator)
            },

            mallCategorySelector: {
                label: '商品分类',
                type: 'custom',
                render: (decorator, form) => this.renderMallCategorySelector(decorator, form)
            },

            mallExcludeGoodSelector: {
                label: '排除商品',
                type: 'custom',
                render: decorator => this.renderMallExcludeGoodsSelector(decorator)
            },

            // 买赠券
            compositeFoodDiscount: {
                label: '组合设置',
                type: 'custom',
                render: decorator => this.renderCompositeFoodDiscountSetting(decorator)
            },

            mallIncludeGoodSelector: {
                label: '适用商品',
                type: 'custom',
                render: (decorator, form) => this.renderMallIncludeGoodsSelector(decorator, form)
            },

            giftValueCurrencyType: {
                label: '货币单位',
                type: 'combo',
                disabled: type !== 'add' && type !== 'copy',
                defaultValue: '¥',
                options: [
                    { label: '¥', value: '¥' },
                    { label: '€', value: '€' },
                    { label: '£', value: '£' },
                    { label: 'RM', value: 'RM' },
                    { label: 'S$', value: 'S$' },
                    { label: 'DHS', value: 'DHS' },
                    { label: 'MOP$', value: 'MOP$' },
                ],
            },
            giftValue: {
                label: giftValueLabel,
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add' && type !== 'copy',
                prefix: unit,
                rules: [
                    { required: true, message: `${isUnit ? '礼品价值' : '可抵扣金额'}不能为空` },
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
                    {
                        validator: (rule, v, cb) => {
                            if(String(v || '').includes('，')||String(v || '').includes(',')) {
                                cb(rule.message);
                            }
                            cb();
                        },
                        message: '请不要输入逗号',
                    },
                    { max: this.props.type == 'add' ? 35 : 50, message: `不能超过${this.props.type == 'add' ? `35`: `50`}个字符` },
                    /*{
                        message: '汉字、字母、数字、小数点，50个字符以内',
                        pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.]{1,50}$/,
                    },*/
                ],
                disabled: type !== 'add' && type !== 'copy',
            },
            selectedShops: {
                type: 'custom',
                label: '适用店铺',
                defaultValue: [],
                render: decorator => this.renderShopNames(decorator),
            },
            excludeShops: {
                type: 'custom',
                label: (<span>
                    <span>排除店铺</span>
                    <Tooltip title={
                        <p>
                            必须选择所属品牌后才能操作，适用店铺和排除店铺不可以同时选择
                        </p>
                    }>
                        <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                    </Tooltip>
                    </span>
                ),
                defaultValue: [],
                render: decorator => this.renderExcludeShops(decorator),
            },
            shareIDs: {
                type: 'custom',
                label: '可共用礼品券',
                defaultValue: [],
                render: decorator => this.renderGiftTree(decorator, data.giftItemID),
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
            TrdTemplate: {// 是否关联第三方券
                label: ' ',
                labelCol: { span: 3 },
                wrapperCol: { span: 21 },
                type: 'custom',
                render: (decorator) => decorator({})(
                    <TrdTemplate
                        giftItemId={value}
                        type={type}
                        describe={describe}
                        clearPromotion={() => {
                            values.promotionID = [] // 清空已选活动
                            this.secondForm.setFieldsValue({ promotionID: [] })
                            this.setState({ values })
                        }}
                        data={
                            ((data.extraInfo && data.extraInfo !== '0') || data.trdTemplateInfo) ?
                            {
                                extraInfo: data.extraInfo,
                                trdChannelID: data.trdChannelID,
                                trdTemplateID: data.trdTemplateID,
                                trdTemplateInfo: data.trdTemplateInfo,
                            }
                            : undefined
                        }
                    />
                )
            },
            moneyLimitTypeAndValue: {
                label: '金额限制',
                type: 'custom',
                render: (decorator, form) => this.renderMoneyLimitTypeAndValue(decorator, form),
            },
            moneyLimitTypeAndValue2: {
                label: '账单金额限制',
                type: 'custom',
                render: (decorator, form) => this.renderMoneyLimitTypeAndValue(decorator, form),
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
                label: value == '91' ? '礼品售价' : <span>
                <span>记录实收金额</span>
                <Tooltip title={
                    <p>
                        记录实收金额：仅用于报表作为实收金额核算
                    </p>
                }>
                    <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                </Tooltip></span>,
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add' && type !== 'copy',
                prefix: value === '91' ? null : unit,
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
            delivery: {
                label: <span>
                <span>配送费立减</span>
                <Tooltip title={
                    <p>
                        用于抵扣配送费，支持超收。eg. 配送费5元，用户有一张8元配送券也可使用，抵扣5元，3元免找
                    </p>
                }>
                    <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                </Tooltip></span>,
                type: 'text',
                placeholder: '请输入金额',
                prefix: unit,
                rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                        if(!pattern.test(value)){
                            return callback('最大支持8位整数，2位小数');
                        }
                        if (!+value>0) {
                            return callback('金额要大于0');
                        }
                        return callback();
                    },
                }],
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
            priceSortRule: {
                label: (
                    <span>
                        {`${value == 21 ? '兑换' : '赠送'}规则`}&nbsp;
                        <Tooltip title={
                            <p>
                                {`当${value == 21 ? '兑换' : '赠送'}菜品包含多个菜品时，可通过设置控制${value == 21 ? '兑换' : '赠送'}其中一道高价菜品或者低价菜品。`}
                            </p>
                        }>
                            <Icon type="question-circle" />
                        </Tooltip>
                    </span>
                ),
                type: 'custom',
                defaultValue: 0,
                render: (decorator, form) => {
                    const applyScene = form.getFieldValue('applyScene');
                    let descTxt = applyScene != '1' ? '菜品' : '商品';
                    return decorator({})(
                        <RadioGroup>
                            <Radio value={0}>{`${value == 21 ? '兑换' : '赠送'}高价${descTxt}`}</Radio>
                            <Radio value={1}>{`${value == 21 ? '兑换' : '赠送'}低价${descTxt}`}</Radio>
                        </RadioGroup>
                    )
                },
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
            disCountTypeAndValue: {
                label: (
                    <span>
                        折扣&nbsp;
                        <Tooltip title={
                            <p>
                                指定菜品折扣可以对在适用范围内的菜品都参与打折；
                                <br/>
                                单品折扣仅对适用范围内菜品价格最高的一道菜参与打折
                            </p>
                        }>
                            <Icon type="question-circle" />
                        </Tooltip>
                    </span>
                ),
                type: 'custom',
                render: decorator => this.renderDiscountTypeAndValue(decorator),
            },
            stageAmount: {
                label: '购买指定菜品满',
                type: 'custom',
                render: decorator => this.renderStageAmount(decorator),
            },
            giveFoodCount: {
                label: '享受优惠菜品',
                type: 'custom',
                render: (decorator, form) => this.renderGiveFoodCount(decorator, form),
            },
            disCountRate_Max: {
                label: ' ',
                type: 'custom',
                render: decorator => this.renderDisCountRate(decorator),
            },
            foodsboxs: { // 代金券，折扣券
                label: '',
                type: 'custom',
                render: decorator => this.renderFoodsboxs(decorator),
            },
            foodScopes: { // 菜品优惠券，菜品兑换券
                label: '',
                type: 'custom',
                render: (decorator, form) => this.renderFoodName(decorator, form),
            },
            buyGiveFoods: {
                type: 'custom',
                label: '适用菜品',
                required: true,
                render: decorator => this.renderBuyGiveFoodsboxs(decorator),
            },

            buyGiveSecondaryFoods: {
                type: 'custom',
                label: '优惠菜品',
                required: true,
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
            transferringAvailable: {
                label: '转赠中是否可核销',
                type: 'radio',
                defaultValue: 1,
                options: GiftCfg.transferringAvailable,
            },
            // 转赠分享
            transferTitle: {
                label: '转赠文案',
                type: 'text',
                defaultValue: '好友送你一张优惠券，点击领取！',
            },
            transferImage: {
                label: '分享图',
                type: 'custom',
                defaultValue: {transferImagePath: '', transferThumbnailImagePath: ''},
                render: decorator => this.renderShareImgSettings(decorator),
            },

            isNeedCustomerInfo: {
                // label: '',
                type: 'custom',
                defaultValue: false,
                //options: GiftCfg.isNeedCustomerInfo,
                render: decorator => this.renderisNeedCustomerInfo(decorator),
            },
            isSynch: {
                label: ` `,
                type: 'custom',
                defaultValue: false,
                render: type === 'copy' ? decorator => decorator({})(<div></div>) : decorator => decorator({})(<IsSync/>),
            },
            amountType: {
                label: `规则设置`,
                type: 'custom',
                render: decorator => decorator({})(<AmountType/>),
            },
            mallScope: {
                label: '活动范围',
                type: 'custom',
                defaultValue: '0',
                render: (decorator, form) => {
                    // const applyScene = form.getFieldValue('applyScene');
                    // let descTxt = applyScene != '1' ? '菜品' : '商品';
                    return decorator({})(
                        <RadioGroup disabled={form.getFieldValue('foodUnitType') == 1}>
                            <Radio value={'0'}>按分类</Radio>
                            <Radio value={'1'}>按菜品</Radio>
                        </RadioGroup>
                    )
                },
            },
            foodUnitType: {
                label: '兑换菜品类型',
                type: 'custom',
                defaultValue: 0,
                render: (decorator, form) => {
                    // const applyScene = form.getFieldValue('applyScene');
                    // let descTxt = applyScene != '1' ? '菜品' : '商品';
                    return decorator({})(
                        <RadioGroup>
                            <Radio value={0}>普通菜品</Radio>
                            <Radio value={1}>称重菜品</Radio>
                            <Tooltip title={
                            <p>
                                仅POS2.5支持；仅能”按菜品“选择活动范围且仅可以兑换”需要确认数量“的菜品；不支持商城券
                            </p>
                        }>
                            <Icon type="question-circle" />
                        </Tooltip>
                        </RadioGroup>
                    )
                },
            },
            weight: {
                label: <span>
                <span>兑换菜品重量</span>
                <Tooltip title={
                    <p>
                        兑换菜品的重量，以斤为单位
                    </p>
                }>
                    <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                </Tooltip></span>,
                type: 'custom',
                required: true,
                defaultValue: '',
                rules: [{ required: true, message: '不能为空' }, {
                    validator: (rule, value, callback) => {
                        const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                        if(!pattern.test(value)){
                            return callback('最大支持8位整数，2位小数');
                        }
                        if (!+value>0) {
                            return callback('兑换菜品重量要大于0');
                        }
                        return callback();
                    },
                }],
                render: (decorator, form) => {
                    return form.getFieldValue('foodUnitType') == 1?decorator({})(
                        <Input size="large" addonAfter="斤" />
                    ):null
                },
            },
            weightOffset: {
                label: <span>
                <span>称重误差值</span>
                <Tooltip title={
                    <p>
                        兑换菜品的重量误差，以斤为单位
                    </p>
                }>
                    <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                </Tooltip></span>,
                type: 'custom',
                required: true,
                defaultValue: '',
                rules: [{ required: true, message: '不能为空' }, {
                    validator: (rule, value, callback) => {
                        const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                        if(!pattern.test(value)){
                            return callback('最大支持8位整数，2位小数');
                        }
                        if (!+value>0) {
                            return callback('称重误差值要大于0');
                        }
                        return callback();
                    },
                }],
                render: (decorator, form) => {
                    return form.getFieldValue('foodUnitType') == 1?decorator({})(
                        <Input size="large" addonAfter="斤" addonBefore={'±'}/>
                    ):null
                },
            },
            subRule: {
                label: '配菜计算',
                type: 'custom',
                defaultValue: 0,
                render: (decorator, form) => {
                    const giftVal = this.props.gift.value;
                    return decorator({})(
                        <RadioGroup className={ giftVal == '111' ? styles.subRule  : ''}>
                            <Radio value={0}>不参与</Radio>
                            <Radio value={1}>参与</Radio>
                        </RadioGroup>
                    )
                },
            },
            // 买赠券折扣
            // discountRateSetting: {
            //     label: '折扣',
            //     type: 'custom',
            //     render: decorator => this.renderDiscountRateSetting(decorator),
            // },

            // // 买赠券立减
            // discountDecreaseVolSetting: {
            //     label: '立减',
            //     type: 'custom',
            //     render: decorator => this.renderDiscountDecreaseVolSetting(decorator),
            // },

            // // 买赠券特价
            // specialPriceVolSetting: {
            //     label: '特价',
            //     type: 'custom',
            //     render: decorator => this.renderSpecialPriceVolSetting(decorator),
            // }


        };
        const giftVal = this.props.gift.value;
        if (giftVal == '20') {
            formItems.moneyLimitTypeAndValue.label = '账单金额';
        } else if(giftVal == '21' || giftVal == '111'|| giftVal == '22' || giftVal == '110'){
            formItems.moneyLimitTypeAndValue.label = '账单金额限制';
        } else {
            formItems.moneyLimitTypeAndValue.label = '金额限制';
        }
        if (giftVal == '10' && (type === 'add' || type === 'edit' || values.amountType == 1)) {
            const {
                dishes = [],
                excludeDishes = [],
                foodCategory = [],
            } = values.foodsboxs || {};
            if (dishes.length || excludeDishes.length || foodCategory.length) {
                this.state.isActivityFoods = true
                formItems.moneyLimitTypeAndValue.label = '活动菜品金额限制'
            } else {
                this.state.isActivityFoods = false
                formItems.moneyLimitTypeAndValue.label = '账单金额限制'
            }
        }

        formItems.moneyLimitTypeAndValue.label = '核销限制'//都改成了核销限制
        if (this.props.gift.value == '10') {
            formItems.aggregationChannels.options = [
                { label: '金豆商城', value: 'goldGift' },
                { label: 'vivo快应用', value: 'vivoChannel' },
            ]
        } else {
            formItems.aggregationChannels.options = [
                { label: 'vivo快应用', value: 'vivoChannel' },
            ]
        }
        if (this.props.gift.value == '22') {
            formData.delivery = formData.giftValue;
        }
        formData.shareIDs = this.state.sharedGifts;
        formData.giftShareType = String(formData.giftShareType);
        formData.couponPeriodSettings = formData.couponPeriodSettingList;
        if(!formData.pushMessage) {
            const sendType = ['wechat']
            if (formData.openPushSms) {
                sendType.push('msg')
            }
            if(formData.pushMimiAppMsg){
                sendType.push('mini')
            }
            formData.pushMessage = {
                pushMessageMpID: formData.pushMessageMpID,
                pushMimiAppMsg: formData.pushMimiAppMsg,
                sendType,
                reminderTime: formData.reminderTime || 3,
            }
        }
        const combineTypes = hasMallArr;
        if(formData.shopScopeType == 1){
            formData.selectedShops = formData.shopNames;
            formData.excludeShops = [];
        }else if(formData.shopScopeType == 2){
            formData.excludeShops = formData.shopNames;
            formData.selectedShops = [];
        }
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
                {
                    (applyScene == '0' || applyScene == '2') && combineTypes.includes(value) ? 
                    <div className={styles.selectFoodsWrapper}>
                        <div className={styles.foodWrapperHeader}>店铺券属性设置</div>
                        {/* <div className={type == 'edit' ? styles.foodWrapperNotAllow : ''}></div> */}
                        <div className={styles.foodWrapperCont}>   
                            <BaseForm
                                getForm={(form) => {
                                    this.thirdForm = form
                                }}
                                getRefs={refs => this.thirdFormRefMap = refs}
                                formItems={formItems}
                                formData={formData}
                                formItemLayout={{
                                    labelCol: {span: 4},
                                    wrapperCol: {span: 16}
                                }}
                                formKeys={displayThirdKeys}
                                onChange={(key, value) => this.handleFormChange(key, value, this.thirdForm)}
                                getSubmitFn={(handles) => {
                                    this.handles[0] = handles;
                                }}
                                key={`${describe}-${type}1`}
                            />
                        </div>
                    </div>:null
                }
                {
                    (applyScene == '1' || applyScene == '2') && combineTypes.includes(value) ?
                    <div className={styles.selectFoodsWrapper} style={{ marginTop:applyScene == '2' ? 16 : 0}}>
                        {/* <div className={type == 'edit' ? styles.foodWrapperNotAllow : ''}></div> */}
                        <div className={styles.foodWrapperHeader}>商城券属性设置</div>
                        <div className={styles.foodWrapperCont}>
                            <BaseForm
                                getForm={(form) => {
                                    this.fourthForm = form
                                }}
                                formItemLayout={{
                                    labelCol: {span: 4},
                                    wrapperCol: {span: 16}
                                }}
                                getRefs={refs => this.fourthFormRefMap = refs}
                                formItems={formItems}
                                formData={formData}
                                formKeys={displayFourthKeys}
                                onChange={(key, value) => this.handleFormChange(key, value, this.fourthForm)}
                                getSubmitFn={(handles) => {
                                    this.handles[0] = handles;
                                }}
                                key={`${describe}-${type}1`}
                            />
                        </div> 
                    </div> 
                    : null
                }
                
                <div
                    style={{
                        margin: '20px 0 10px 94px'
                    }}
                    className={styles2.logoGroupHeader
                }>使用规则</div>
                <BaseForm
                    getRefs={refs => this.secondFormRefMap = refs}
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

        // 商城商品及分类信息
        goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories').toJS(),
        goods: state.sale_promotionDetailInfo_NEW.get('goods').toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchFoodCategoryInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoAC(opts, flag, id))
        },

        fetchFoodMenuInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoAC(opts, flag, id))
        },
        fetchFoodMenuLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoLightAC(opts, flag, id))
        },
        fetchFoodCategoryLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoLightAC(opts, flag, id))
        }, 
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

        // 获取商城商品及分类信息
        getMallGoodsAndCategories: (opts) => {
            dispatch(getMallGoodsAndCategories(opts))
        },
    };
}



export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(GiftAddModalStep)

