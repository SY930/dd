import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchData, axiosData } from '../../../helpers/util';
import { Row, Col, Modal, Form, Select, Input, message, TreeSelect, Checkbox } from 'antd';
import styles from './GiftAdd.less';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import BaseForm from '../../../components/common/BaseForm';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import { FORMITEMS, FIRST_KEYS, SECOND_KEYS } from './_formItemConfig';
import InputTreeForGift from './InputTreeForGift';
// import FoodCatTree from './FoodCatTree';
import FoodBox from './FoodBox';
import MoreFoodBox from './MoreFoodBox';
import GiftPromotion from './GiftPromotion';
import GiftCfg from '../../../constants/Gift';
import {
    FetchGiftList,
    FetchGiftSort,
} from '../_action';
import {
    saleCenterResetDetailInfoAC,
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const FormItem = Form.Item;
const Option = Select.Option;
// const TreeNode = TreeSelect.TreeNode;


class CouponTrdChannelStockNums extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            couponTrdChannelStockNums: [
                { trdPartyPlatformID: 2001, trdStockNum: '', name: '微信小程序' },
                // { trdPartyPlatformID: 1001, trdStockNum: '', name: '彩蛋猫' },//}//四个选择项时，放开下面一个disable注释
                // { trdPartyPlatformID: 3001, trdStockNum: '', name: '悸动小程序' },
                // { trdPartyPlatformID: 3002, trdStockNum: '', name: '悸动小程序' },
            ],
            checkedArr: [true, false, false, false],
        }
    }
    componentDidMount() {
        let { couponTrdChannelStockNums, checkedArr } = this.state;
        if (this.props.value) {
            checkedArr = [false, false, false, false]
            couponTrdChannelStockNums.forEach((channel, index) => {
                const hadSet = this.props.value.find((_chan) => {
                    return _chan.trdPartyPlatformID == channel.trdPartyPlatformID;
                });
                if (hadSet) {
                    checkedArr[index] = true;
                    channel.trdStockNum = hadSet.trdStockNum
                }
            })
            this.setState({ couponTrdChannelStockNums, checkedArr })
        }
    }
    componentWillReceiveProps(nextProps) {
        const { couponTrdChannelStockNums } = this.state;
        if (nextProps.value) {
            couponTrdChannelStockNums.forEach((channel) => {
                const hadSet = nextProps.value.find((_chan) => {
                    return _chan.trdPartyPlatformID == channel.trdPartyPlatformID;
                });
                if (hadSet) {
                    channel.trdStockNum = hadSet.trdStockNum
                }
            })
            this.setState({ couponTrdChannelStockNums })
        }
    }
    handleCheckboxChange(index, checked) {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        checkedArr[index] = checked;
        if (!checked) {
            couponTrdChannelStockNums[index].trdStockNum = '';
            const input = "input" + index;
            this.props.form.setFieldsValue({ [input]: '' })
        }
        this.setState({ couponTrdChannelStockNums, checkedArr });
        this.props.onChange(couponTrdChannelStockNums)
    }
    handleInputChange(index, value) {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        couponTrdChannelStockNums[index].trdStockNum = checkedArr[index] ? value : '';
        this.setState({ couponTrdChannelStockNums });
        this.props.onChange(couponTrdChannelStockNums)
    }
    render() {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        return (
            <div style={{ marginTop: -6 }}>
                {
                    couponTrdChannelStockNums.map((channel, index) => {
                        return (
                            <FormItem
                                style={{
                                    marginBottom: -2,
                                }}
                                key={index}
                            >
                                <Col span={6}>
                                    <Checkbox
                                        // disabled={this.props.giftItemID && channel.trdStockNum > 0}//四个选择项时，放开此注释
                                        disabled={true}
                                        checked={checkedArr[index]}
                                        onChange={(e) => {
                                            this.handleCheckboxChange(index, e.target.checked)
                                        }}
                                    >
                                        {channel.name}
                                    </Checkbox>
                                </Col>
                                <Col span={4} offset={2}>总库存量</Col>
                                <Col span={12} style={{ marginTop: -5 }}>
                                    <FormItem>
                                        {
                                            this.props.form.getFieldDecorator('input' + index, {
                                                rules: [{
                                                    required: checkedArr[index],
                                                    message: '库存总量必须在1-9999999999之间',
                                                    pattern: /^[1-9]\d{0,9}$/,
                                                }],
                                                initialValue: channel.trdStockNum,
                                            })(
                                                <Input
                                                    disabled={!checkedArr[index]}
                                                    onChange={(e) => {
                                                        this.handleInputChange(index, e.target.value)
                                                    }}
                                                />

                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </FormItem>
                        )
                    })
                }
            </div>
        )
    }
}
class GiftAddModalStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            shopsData: [],
            values: {},
            finishLoading: false,
            numberOfTimeValueDisabled: true,
            moneyTopLimitValueDisabled: true,
            // modalKey:1,
            firstKeys: { ...FIRST_KEYS },
            secondKeys: { ...SECOND_KEYS },
            groupTypes: [],
            giftData: [],
            sharedGifts: [],
            isFoodCatNameList: '1',
            foodNameList: [],
            scopeLst: [],
            foodNameListStatus: 'success',
            // transferType:0
        };
        this.firstForm = null;
        this.secondForm = null;
    }

    componentDidMount() {
        const { FetchGiftSort, gift: thisGift } = this.props;

        fetchData('getSchema', {}, null, { path: 'data' }).then((data) => {
            let { cities, shops } = data;
            const treeData = [];
            if (cities === undefined) {
                cities = [];
            }
            if (shops === undefined) {
                shops = [];
            }
            cities.forEach((city) => {
                const newShops = [];
                shops.filter((shop) => {
                    return shop.cityID == city.cityID;
                }).forEach((shop) => {
                    const shopItem = {};
                    shopItem.content = shop.shopName;
                    shopItem.id = shop.shopID;
                    newShops.push(shopItem);
                });
                treeData.push({
                    province: {
                        content: city.cityName,
                        id: city.cityID,
                    },
                    shops: newShops,
                });
            });
            this.setState({ shopsData: [...treeData] });
        });
        fetchData('getShopBrand', {}, null, { path: 'data.records' }).then((data) => {
            if (!data) return;
            const groupTypes = [];
            data.forEach((d) => {
                groupTypes.push({ value: d.brandID, label: d.brandName })
            });
            groupTypes.push({ value: '-1', label: '(空)' });
            this.setState({ groupTypes });
        });
        // 公众号
        thisGift.value != 80 ? fetchData('queryWechatMpInfo', {}, null, { path: 'mpList' }).then((mpList) => {
            this.setState({ mpList: mpList || [] })
            // 微信公众号券模版
            this.queryTrdTemplate(mpList[0].mpID, 10)
        }) : null;
        FetchGiftSort({});
    }
    queryTrdTemplate = (mpID, trdChannelID) => {
        if (trdChannelID == 10 && !mpID) return
        // 第三方券模版
        fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID: trdChannelID == 10 ? mpID : undefined, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((trdTemplateInfoList) => {
            // console.log(trdTemplateInfoList)
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList || [],
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        this.firstForm && this.firstForm.resetFields();
        this.secondForm && this.secondForm.resetFields();
        const { gift: { name, data, value }, type, sharedGifts } = nextProps;
        const { secondKeys, values } = this.state;
        if (type === 'edit' && value === '10') {
            if (data.moneyLimitType != 0) {
                secondKeys[name][0].keys = ['isMapTotrd', 'isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'moneyLimitType', 'moenyLimitValue', 'shopNames'];
                this.setState({ secondKeys })
            }
        }
        if (type === 'edit' && value !== '80') {
            if (data.trdTemplateID) {
                this.secondForm.setFieldsValue({ trdTemplateIDLabel: data.trdTemplateID });
                if (data.giftItemID !== this.props.gift.data.giftItemID) {
                    // 三方券模版
                    const mp = (this.state.mpList || []).find(mp => mp.mpName == data.wechatMpName);
                    const mpID = mp ? mp.mpID : this.state.mpList[0].mpID;
                    this.queryTrdTemplate(mpID, data.trdChannelID)
                    this.props.fetchAllPromotionList({
                        groupID: this.props.accountInfo.toJS().groupID,
                    })
                }
            }
        }
        if (type === 'edit' && value == '111') {
            values.isDiscountOffMax = values.discountOffMax > 0 ? 1 : 0
            values.discountRate_111 = data.discountRate * 100
        }
        const _sharedGifts = sharedGifts && sharedGifts.toJS();
        this.setState({
            sharedGifts: this.proSharedGifts(_sharedGifts.crmGiftShareList),
            // values: { ...values, ...data } // ?带上data提交时也会带上冗余
        });
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
        // const releaseENV = HUALALA.ENVIRONMENT == 'production-release';
        // releaseENV ?
        //     _.remove(newKeys, function (k) {
        //         return k === 'isMapTotrd';
        //     }) : null
        values[key] = value;
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
            case 'foodNameList':
                if (value) {
                    const { foodCategory = [], dishes = [], categoryOrDish = '1' } = value;
                    const _foodCategory = foodCategory && foodCategory.map((cat) => {
                        return cat.foodCategoryName
                    })
                    const _dishes = dishes && dishes.map((dish) => {
                        return dish.foodName + dish.unit || dish.foodNameWithUnit
                    })
                    values.isFoodCatNameList = categoryOrDish;
                    values.foodNameList = categoryOrDish == '1' ? _foodCategory : _dishes;
                } else {
                    this.setState({
                        isFoodCatNameList: '1',
                        foodNameList: [],
                    })
                }
                break;
            case 'isMapTotrd':
                describe !== '会员权益券' && value ?
                    !newKeys.includes('trdChannelID') ?
                        (describe == '买赠券' || describe == '折扣券' ?
                            firstKeys[describe][0].keys.push('trdChannelID', 'wechatMpName', 'trdTemplateID', 'trdTemplateIDLabel')
                            : newKeys.splice(1, 0, 'trdChannelID', 'wechatMpName', 'trdTemplateID', 'trdTemplateIDLabel')) :
                        null :
                    (describe == '买赠券' || describe == '折扣券' ?
                        _.remove(firstKeys[describe][0].keys, function (k) {
                            return k === 'trdChannelID' || k === 'trdTemplateID' || k === 'trdTemplateIDLabel' || k === 'wechatMpName';
                        })
                        : _.remove(newKeys, function (k) {
                            return k === 'trdChannelID' || k === 'trdTemplateID' || k === 'trdTemplateIDLabel' || k === 'wechatMpName';
                        }));
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys, firstKeys });
                describe !== '会员权益券' ?
                    value ?
                        this.props.queryUnbindCouponPromotion({ channelID: data.trdChannelID || 10 }) :
                        this.props.queryUnbindCouponPromotion({ channelID: 1 })
                    : null
                if (type === 'add') {
                    values.trdChannelID = value ? 10 : 1;
                    values.wechatMpName = '';
                    values.trdTemplateID = '';
                    values.promotionID = [];
                    value && this.queryTrdTemplate(this.state.mpList ? this.state.mpList[0] ? this.state.mpList[0].mpID : undefined : undefined, 10)
                }
                break;
            case 'trdChannelID':
                let whichKey = describe == '买赠券' || describe == '折扣券' ? firstKeys[describe][0].keys : newKeys;
                let whichIdx = describe == '买赠券' || describe == '折扣券' ? 7 : 2
                describe !== '会员权益券' && value === 10 && whichKey.includes('trdChannelID')
                    ? (!whichKey.includes('wechatMpName')
                        ? whichKey.splice(whichIdx, 0, 'wechatMpName')
                        : null)
                    : _.remove(whichKey, function (k) {
                        return k === 'wechatMpName';
                    });
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ firstKeys, secondKeys, trdTemplateInfoList: [] }, () => {
                    describe == '买赠券' || describe == '折扣券'
                        ? this.firstForm.setFieldsValue({ trdChannelID: value, trdTemplateID: '', trdTemplateIDLabel: '', wechatMpName: '' })
                        : this.secondForm.setFieldsValue({ trdChannelID: value, trdTemplateID: '', trdTemplateIDLabel: '', wechatMpName: '' });
                    if (type === 'add') {
                        this.queryTrdTemplate((value === 10 && this.state.mpList ? (this.state.mpList[0] ? this.state.mpList[0].mpID : undefined) : undefined), value)
                        values.isMapTotrd ? this.props.queryUnbindCouponPromotion({ channelID: value || 10 }) : null;
                        values.promotionID = []; values.trdTemplateID = '';
                    }
                })
                break;
            case 'wechatMpName':
                this.setState({ secondKeys }, () => {
                    describe == '买赠券' || describe == '折扣券'
                        ? this.firstForm.setFieldsValue({ trdTemplateID: '', trdTemplateIDLabel: '' })
                        : this.secondForm.setFieldsValue({ trdTemplateID: '', trdTemplateIDLabel: '' });
                    const mp = (this.state.mpList || []).find(mp => mp.mpName == value);
                    const mpID = mp ? mp.mpID : this.state.mpList ? this.state.mpList[0].mpID : undefined;
                    type === 'add' ? this.queryTrdTemplate(mpID, 10) : null; // wx公众号券模版/////////////////////////////////////
                })
                break;
            case 'trdTemplateID':
                describe == '买赠券' || describe == '折扣券'
                    ? this.firstForm.setFieldsValue({ trdTemplateID: value, trdTemplateIDLabel: value })
                    : this.secondForm.setFieldsValue({ trdTemplateID: value, trdTemplateIDLabel: value })
                break;
            case 'isDiscountOffMax':
                this.secondForm.setFieldsValue({ discountOffMax: '' });
                break;
            default:
                break;
        }
        this.setState({ values });
    }
    /**
     * Callback once the user click the cancel button
     * @param  {Function} cb      callback function return by CustomProgressBar, it reset the state of the ProgressBar
     * @param  {int}   current current index of the steps which is passed to CustomProgressBar
     * @return {null}
     */
    handleCancel = (cb) => {
        this.setState({
            current: 0,
            values: {},
            firstKeys: FIRST_KEYS,
            secondKeys: SECOND_KEYS,
        });
        this.props.saleCenterResetDetailInfo({});
        this.props.onCancel();
        cb && cb();
    }
    handleCCCCancel = () => {
        this.props.saleCenterResetDetailInfo({});
        this.props.onCancel();
    }
    handleNext = (cb) => {
        const validateFoodList = (basicValues, _cb) => {
            if (!basicValues.foodNameList
                || (basicValues.foodNameList.categoryOrDish == 1 && basicValues.foodNameList.foodCategory.length == 0)
                || (basicValues.foodNameList.categoryOrDish == 0 && basicValues.foodNameList.dishes.length == 0)) {
                this.setState({ foodNameListStatus: 'error' })
                return false;
            }
            this.setState({ foodNameListStatus: 'success' })
            _cb && _cb();
        }
        this.firstForm.validateFieldsAndScroll((error, basicValues) => {
            if (this.props.gift.value == '20') {
                validateFoodList(basicValues, cb);
                if (error) return
            } else {
                if (error) return
                cb();
            }
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
    handleFinish = (cb) => {
        const { values, groupTypes } = this.state;
        const { type, gift: { value, data } } = this.props;
        this.secondForm.validateFieldsAndScroll((err, formValues) => {
            if (err) return;
            let params = _.assign({}, values, formValues, { giftType: value });
            params = this.formatFormData(params);
            let shopNames = '',
                shopIDs = '',
                callServer;
            params.shopNames && params.shopNames.forEach((shop) => {
                shopNames += `${shop.content},`;
                shopIDs += `${shop.id},`;
            });
            params.shopNames = shopNames;
            params.shopIDs = shopIDs;
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
                    message.error('必须至少选择一种投放渠道');
                    return;
                } else {
                    params.issueChannel = issueChannel.join(',');
                    params.couponTrdChannelStockNums = couponTrdChannelStockNums;
                }
            }
            if (value != 80) {
                // 买赠券和折扣券在第一步的formvalues
                const wechatMpName = value == '110' || value == '111' ? this.firstForm.getFieldsValue().wechatMpName : formValues.wechatMpName;
                const trdTemplateID = value == '110' || value == '111' ? this.firstForm.getFieldsValue().trdTemplateID : formValues.trdTemplateID;
                if (value == '110' || value == '111') {
                    params.wechatMpName = wechatMpName
                }
                params.extraInfo = JSON.stringify({
                    wechatMpName: wechatMpName,
                    trdTemplateIDLabel: ((this.state.trdTemplateInfoList || []).find((template) => {
                        return template.trdGiftItemID == trdTemplateID
                    }) || {}).trdGiftName ||
                        (this.props.gift.data.extraInfo ? JSON.parse(this.props.gift.data.extraInfo).trdTemplateIDLabel : undefined),
                })
                params = params.isMapTotrd ? params : { ...params, trdChannelID: undefined, trdTemplateID: undefined, trdTemplateIDLabel: undefined, wechatMpName: undefined }
            }
            if (params.discountRate_111 && value == '111') {
                params.discountRate = (params.discountRate_111 / 100).toFixed(2)
            }
            if (params.isDiscountOffMax == 0 && value == '111') {
                params.discountOffMax = 0 // 0标识不限制
            }
            // foodbxs数据,目前买赠券和折扣券用
            if (formValues.hasOwnProperty('foodsboxs')) {
                if (!formValues.foodsboxs) { // 用户没选择，默认信息
                    params.foodSelectType = 2;
                    params.isExcludeFood = 0;
                }
                if (formValues.foodsboxs && formValues.foodsboxs instanceof Object) {
                    const { foodSelectType, isExcludeFood, foodCategory, excludeDishes, dishes } = formValues.foodsboxs;
                    params.foodSelectType = foodSelectType;
                    params.isExcludeFood = isExcludeFood;
                    // 菜品限制范围类型：1,包含菜品分类;2,包含菜品;3,不包含菜品分类;4不包含菜品
                    params.couponFoodScopes = foodCategory.map((cat) => {
                        return {
                            scopeType: 1,
                            targetID: cat.foodCategoryID,
                            targetCode: cat.foodCategoryCode,
                            targetName: cat.foodCategoryName,
                            // targetUnitName
                        }
                    }).concat(
                        excludeDishes.map((food) => {
                            return {
                                scopeType: 4,
                                targetID: food.itemID,
                                targetCode: food.foodCode,
                                targetName: food.foodName,
                                targetUnitName: food.unit || '',
                            }
                        })
                    ).concat(
                        dishes.map((food) => {
                            return {
                                scopeType: 2,
                                targetID: food.itemID,
                                targetCode: food.foodCode,
                                targetName: food.foodName,
                                targetUnitName: food.unit || '',
                            }
                        })
                    )
                }
                delete params.foodsboxs
                delete params.couponFoodScopeList // 后台返回的已选菜品数据
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
            }
            if (formValues.transferLimitType == -1) {
                params.transferLimitType = formValues.transferLimitTypeValue
            }
            params.foodNameList = values.foodNameList instanceof Array ? values.foodNameList.join(',') : values.foodNameList;
            params.isFoodCatNameList = values.isFoodCatNameList
            this.setState({
                finishLoading: true,
            });
            const { accountInfo } = this.props;
            const { groupName } = accountInfo.toJS();
            axiosData(callServer, { ...params, groupName }, null, { path: '' }).then((data) => {
                this.setState({
                    finishLoading: false,
                });
                if (data) {
                    message.success('成功', 3);
                    this.handleCancel(cb);
                }
                if (type === 'edit') {
                    const { params, FetchGiftList } = this.props;
                    const listParams = params.toJS();
                    FetchGiftList(listParams);
                }
                this.props.saleCenterResetDetailInfo({});
            });
        });
    }

    handleGiftName(decorator) {
        const { groupTypes } = this.state;
        return (
            <Row style={{ marginTop: -6 }}>
                <Col span={11}>
                    <FormItem>
                        {decorator({
                            key: 'brandID',
                            rule: [{ required: true, message: '请选择品牌' }],
                            // initialValue: '-1',
                        })(<Select
                            className="giftNameStep"
                            placeholder={'请选择品牌名称'}
                            getPopupContainer={() => document.querySelector('.giftNameStep')}
                        >
                            {
                                groupTypes.map((t, i) => {
                                    return <Option key={t.label} value={t.value}>{t.label}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={1} offset={1}>-</Col>
                <Col span={11}>
                    <FormItem style={{ marginBottom: 0 }}>
                        {decorator({
                            key: 'giftName',
                            rules: [{ required: true, message: '礼品名称不能为空' }, { max: 50, message: '请输入不超过50个字符的名称' }],
                        })(<Input size="large" placeholder="请输入礼品名称" />)}
                    </FormItem>
                </Col>
            </Row>
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
                        })(<Select className="giftNameStep">
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
                                    key: 'discountThreshold',
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
                        })(<Select className="giftNameStep">
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
                                    if (!/^\+?\d{0,8}$/.test(Number(v))) {
                                        cb(rule.message);
                                    }
                                    cb();
                                },
                                message: '整数不超过8位',
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
    renderGiftTree(decorator, giftItemID) {
        return (
            <Row>
                <Col>
                    {decorator({
                        rules: [{ required: true, message: '可共用礼品券不能为空' }],
                    })(<InputTreeForGift
                        type={this.props.type}
                        giftItemID={giftItemID}
                        thisGiftItem={this.props.gift.data.giftItemID ? this.props.gift.data : null}
                    />)}
                </Col>
            </Row>
        )
    }

    renderShopNames(decorator) {
        const { shopNames = [] } = this.state.values;
        const shopCfg = {
            treeData: this.state.shopsData,
            level1Title: '全部店铺',
            level2Title: '店铺',
            selectdTitle: '已选店铺',
            levelsNames: 'province',
            childrenNames: 'shops',
            showItems: shopNames,
        };
        return (
            <Row style={{ marginBottom: shopNames.length == 0 ? -15 : 0 }}>
                <Col>
                    {decorator({})(<MyProjectEditBox
                        treeProps={shopCfg}
                        title="店铺"
                    />)}
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
            const { isFoodCatNameList = '1', foodNameList = [] } = this.props.gift.data;
            const _foodNameList = foodNameList instanceof Array ? foodNameList : foodNameList.split(',');
            _scopeLst = _foodNameList.map((name) => {
                return isFoodCatNameList == '1' ? {
                    'scopeType': 'CATEGORY_INCLUDED',
                    'foodCategoryName': name,
                } :
                    {
                        'scopeType': 'FOOD_INCLUDED',
                        'foodNameWithUnit': name,
                    }
            })
        }
        return (
            <FormItem
                {...formItemLayout}
                label={''}
                className={styles.foodBox}
                validateStatus={this.state.foodNameListStatus}
                help={this.state.foodNameListStatus === 'success' ? null : '不可为空'}
            >
                {
                    decorator({})(<FoodBox radioLabel={'抵扣方式'} noExclude={true} catOrFoodValue={_scopeLst} autoFetch={true} />)
                }
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
    renderFoodsboxs(decorator) {
        const { gift: { data } } = this.props;
        return (
            <FormItem style={{ marginTop: -12, marginBottom: 0 }}>
                {
                    decorator({})(
                        <MoreFoodBox
                            scopeLst={data.couponFoodScopeList}
                            foodSelectType={data.foodSelectType}
                            isExcludeFood={data.isExcludeFood ? 1 : 0}
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
            { firstKeys, secondKeys, values, mpList = [], trdTemplateInfoList = [] } = this.state;
        const dates = Object.assign({}, data);
        if (dates.discountRate && dates.discountRate != 1) {
            dates.isDiscountRate = true
        } else {
            dates.isDiscountRate = false
        }
        if (dates.pointRate) {
            dates.isPointRate = true
        } else {
            dates.isPointRate = false
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
        dates.isMapTotrd = dates.trdChannelID && dates.trdChannelID != 1;
        const formItems = {
            ...FORMITEMS,
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            giftValue: {
                label: value == '10' || value == '91' ? '礼品价值' : '可抵扣金额',
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add',
                surfix: '元',
                rules: [{ required: true, message: `${value === '10' ? '礼品价值' : '可抵扣金额'}不能为空` }, {
                    validator: (rule, v, cb) => {
                        if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '整数不超过8位，小数不超过2位',
                }],
            },
            giftName: {
                label: '礼品名称',
                type: 'custom',
                render: decorator => this.handleGiftName(decorator),
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
                                    })(<Select>
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
                                })(<Select>
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
            isMapTotrd: {
                label: '是否关联第三方券',
                type: 'switcher',
                defaultValue: false,
                onLabel: '是',
                offLabel: '否',
                props: { disabled: type === 'edit' },
            },
            trdChannelID: {
                label: '第三方渠道',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: 10,
                options: GiftCfg.trdChannelIDs,
                props: { disabled: type === 'edit' },
            },
            wechatMpName: {
                label: '微信公众号选择',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: mpList[0] ? mpList[0].mpName : '',
                options: mpList.map((mp) => {
                    return {
                        label: mp.mpName,
                        value: mp.mpName,
                    }
                }),
                props: { disabled: type === 'edit' },
            },
            trdTemplateID: {
                label: '第三方券模板或活动',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: '',
                options: type === 'add' ? trdTemplateInfoList.map((template) => {
                    return {
                        label: template.trdGiftName,
                        value: template.trdGiftItemID,
                    }
                }) : [{
                    label: this.props.gift.data.extraInfo ? JSON.parse(this.props.gift.data.extraInfo).trdTemplateIDLabel : '',
                    value: this.props.gift.data.trdTemplateID,
                }],
                props: { disabled: type === 'edit' },
            },
            trdTemplateIDLabel: {
                label: '第三方券模板或活动ID',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'text',
                defaultValue: '',
                // value: trdTemplateID || dates.trdTemplateID || '',
                props: { disabled: true },
                // render: () => <Input value={trdTemplateID || dates.trdTemplateID || ''} disabled />
            },
            promotionID: {
                label: '对应基础营销活动',
                type: 'custom',
                rules: [{ required: true, message: '不能为空' }],
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                render: (decorator, form) => this.renderGiftPromotion(decorator, form), // <GiftPromotion></GiftPromotion>,
            },
            price: {
                label: '礼品售价',
                type: 'text',
                placeholder: '请输入金额',
                disabled: type !== 'add',
                surfix: '元',
                rules: [{ required: true, message: `礼品售价不能为空` }, {
                    validator: (rule, v, cb) => {
                        if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '整数不超过8位，小数不超过2位',
                }],
            },
            validityDays: {
                label: '有效期',
                type: 'text',
                placeholder: '不填为不限制有效期',
                surfix: '天',
                // rules: [{ required: false, message: `请输入数字` }, {
                //     validator: (rule, v, cb) => {
                //         if (!/^\+?\d{0,8}$/.test(Number(v))) {
                //             cb(rule.message);
                //         }
                //         cb();
                //     },
                //     message: '请输入数字，不超过8位',
                // }],
            },
            transferLimitType: {
                label: '转赠设置',
                type: 'custom',
                render: (decorator, form) => {
                    return (
                        <Row>
                            <Col span={this.state.values.transferLimitType == 0 ? 24 : 11} style={{ marginTop: -6 }}>
                                <FormItem>
                                    {decorator({
                                        key: 'transferLimitType',
                                        initialValue: this.props.type === 'edit' ? `${this.props.gift.data.transferLimitType == 0 ? '0' : '-1'}` : '-1',
                                    })(<Select>
                                        <Option value="-1">可转赠</Option>
                                        <Option value="0">不可转赠</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            {
                                // console.log(this.state.values)
                            }
                            {
                                this.state.values.transferLimitType == 0 ? null :
                                    <div>
                                        <Col span={1}></Col>
                                        <Col span={12} style={{ marginTop: -4 }}>
                                            <FormItem>
                                                {decorator({
                                                    key: 'transferLimitTypeValue',
                                                    initialValue: this.props.type === 'edit' ? `${this.props.gift.data.transferLimitType == 0 ? '' : this.props.gift.data.transferLimitType}` : '',
                                                    rules: [{
                                                        required: true,
                                                        pattern: /^[1-9]\d{0,9}$/,
                                                        message: '转赠次数不可大于9999999999',
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
            disCountRate_Max: {
                label: ' ',
                type: 'custom',
                render: decorator => this.renderDisCountRate(decorator),
            },
            foodsboxs: {
                label: '选择菜品',
                type: 'custom',
                render: decorator => this.renderFoodsboxs(decorator),
            },
        };
        let formData = {};
        // if (type == 'edit') {
        formData = data === undefined ? dates : values;
        // }
        if (type === 'edit') {
            formData = dates;
            formData.foodNameList = formData.foodNameList instanceof Array ? formData.foodNameList : formData.foodNameList ? formData.foodNameList.split(',') : [];
        }
        formItems.giftName = type === 'add'
            ? { label: '礼品名称', type: 'custom', render: decorator => this.handleGiftName(decorator) }
            : { label: '礼品名称', type: 'text', disabled: true };
        // formData.gifts = [{
        //     itemID: '32140',
        //     foodName: '哈哈',
        //     foodUnitID:"32140",
        // }];
        formData.shareIDs = this.state.sharedGifts;
        formData.giftShareType = String(formData.giftShareType);
        // const releaseENV = HUALALA.ENVIRONMENT == 'production-release';
        const steps = [{
            title: '基本信息',
            content: <BaseForm
                getForm={(form) => {
                    this.firstForm = form
                }}
                formItems={formItems}
                formData={formData}
                formKeys={firstKeys[describe]}
                onChange={(key, value) => this.handleFormChange(key, value, this.firstForm)}
                getSubmitFn={(handles) => {
                    this.handles[0] = handles;
                }}
                key={`${describe}-${type}1`}
            />,
        }, {
            title: '使用规则',
            content: (
                <BaseForm
                    getForm={form => this.secondForm = form}
                    formItems={formItems}
                    formData={formData}
                    formKeys={secondKeys[describe]}
                    onChange={(key, value) => this.handleFormChange(key, value, this.secondForm)}
                    getSubmitFn={(handles) => {
                        this.handles[1] = handles;
                    }}
                    key={`${describe}-${type}2`}
                />),
        }];
        return (
            <Modal
                // key={modalKey}
                title={`${type === 'add' ? '新建' : '编辑'}${describe}`}
                className={styles.foodModal}
                visible={visible}
                maskClosable={false}
                onCancel={() => this.handleCancel()}
                footer={false}
                key={`${describe}-${type}`}
            // afterClose={this.afterClose}
            // wrapClassName="progressBarModal"
            >
                {
                    visible ?
                        <div className={styles.customProgressBar}>
                            <CustomProgressBar
                                style={{ height: '200px' }}
                                steps={steps}
                                callback={(arg) => {
                                    // this.props.callbacktwo(arg);
                                }}
                                onNext={this.handleNext}
                                onFinish={this.handleFinish}
                                onPrev={this.handlePrev}
                                onCancel={this.handleCancel}
                            />
                        </div>
                        : null
                }
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        params: state.sale_giftInfoNew.get('listParams'),
        giftData: state.sale_giftInfoNew.get('giftSort'),
        accountInfo: state.user.get('accountInfo'),
        sharedGifts: state.sale_giftInfoNew.get('sharedGifts'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        FetchGiftSort: opts => dispatch(FetchGiftSort(opts)),
        saleCenterResetDetailInfo: opts => dispatch(saleCenterResetDetailInfoAC(opts)),
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftAddModalStep)

class MyProjectEditBox extends React.Component {
    render() {
        const { value, ...otherProps } = this.props;
        return <ProjectEditBox {...otherProps} data={value} />;
    }
}

