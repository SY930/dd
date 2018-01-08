import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchData } from '../../../helpers/util';
import { Row, Col, Modal, Form, Select, Input, message, TreeSelect } from 'antd';
import styles from './GiftAdd.less';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import BaseForm from '../../../components/common/BaseForm';
import CustomProgressBar from '../../SaleCenterNEW/common/CustomProgressBar';
import { FORMITEMS, FIRST_KEYS, SECOND_KEYS } from './_formItemConfig';
import InputTreeForGift from './InputTreeForGift';
import FoodCatTree from './FoodCatTree';
import PromotionDetailSetting from '../../SaleCenterNEW/common/promotionDetailSetting';
import GiftPromotion from './GiftPromotion';
import GiftCfg from '../../../constants/Gift';
import {
    FetchGiftList,
    FetchGiftSort,
} from '../_action';
import { saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
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
            isFoodCatNameList: '0',
            foodNameList: [],
            scopeLst: [],
            foodNameListStatus: 'success',
            // transferType:0
        };
        this.firstForm = null;
        this.secondForm = null;
    }

    componentDidMount() {
        const { FetchGiftSort, type, data, visible, gift: thisGift } = this.props;

        fetchData('getSchema', {}, null, { path: 'data' }).then((data) => {
            let { cities, shops } = data;
            const treeData = [];
            if (cities === undefined) {
                cities = [];
            }
            if (shops === undefined) {
                shops = [];
            }
            cities.map((city, index) => {
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
            data.map((d) => {
                groupTypes.push({ value: d.brandID, label: d.brandName })
            });
            groupTypes.push({ value: '-1', label: '(空)' });
            this.setState({ groupTypes });
        });
        // 公众号
        fetchData('queryWechatMpInfo', {
            groupID: this.props.accountInfo.toJS().groupID,
        }, null, { path: 'mpList' }).then((mpList) => {
            this.setState({ mpList: mpList || [] })
            // 微信公众号券模版
            this.queryTrdTemplate(mpList[0].mpID, 10)
        });
        FetchGiftSort({});
    }
    queryTrdTemplate = (mpID, trdChannelID) => {
        // 第三方券模版
        fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((trdTemplateInfoList) => {
            console.log(trdTemplateInfoList)
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList || [],
            })
        });
    }
    componentWillReceiveProps(nextProps) {
        this.firstForm && this.firstForm.resetFields();
        this.secondForm && this.secondForm.resetFields();
        const { gift: { name, data, value }, type, giftData, sharedGifts, FetchSharedGifts, visible } = nextProps;
        const { secondKeys } = this.state;
        if (type === 'edit' && value === '10') {
            if (data.moneyLimitType != 0) {
                secondKeys[name][0].keys = ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'giftShareType', 'moneyLimitType', 'moenyLimitValue', 'shopNames'];
                this.setState({ secondKeys })
            }
        }
        if (type === 'edit' && value === '100') {
            if (data.trdTemplateID) {
                this.secondForm.setFieldsValue({ trdTemplateIDLabel: data.trdTemplateID });
                if (data.giftItemID !== this.props.gift.data.giftItemID) {
                    // 三方券模版
                    const mp = (this.state.mpList || []).find(mp => mp.mpName == data.wechatMpName);
                    const mpID = mp ? mp.mpID : this.state.mpList[0].mpID;
                    this.queryTrdTemplate(mpID, data.trdChannelID)/////////////////////////////////////////////////
                }
            }
        }
        const _sharedGifts = sharedGifts && sharedGifts.toJS();
        this.setState({
            sharedGifts: this.proSharedGifts(_sharedGifts.giftShareList),
        });
    }
    proSharedGifts = (sharedGifts = []) => {
        if (sharedGifts instanceof Array) {
            if (sharedGifts.length === 0) {
                return [];
            }
            const proSharedGifts = [];
            sharedGifts.forEach((sharedGift, idx) => {
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

    handleFormChange(key, value, form) {
        const { gift: { name: describe }, type } = this.props;
        let { secondKeys, values } = this.state;
        let newKeys = [...secondKeys[describe][0].keys];
        const index = _.findIndex(newKeys, item => item == key);
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
                    const { foodCategory, dishes, categoryOrDish } = value;
                    const _foodCategory = foodCategory && foodCategory.map((cat) => {
                        return cat.foodCategoryName
                    })
                    const _dishes = dishes && dishes.map((dish) => {
                        return dish.foodName + dish.unit || dish.foodNameWithUnit
                    })
                    this.setState({
                        isFoodCatNameList: categoryOrDish,
                        foodNameList: categoryOrDish == '0' ? _foodCategory : _dishes,
                    }, () => {
                        console.log(this.state.foodNameList)
                    })
                } else {
                    this.setState({
                        isFoodCatNameList: '0',
                        foodNameList: [],
                    })
                }
            case 'isMapTotrd':
                describe === '活动券' && value ? (!newKeys.includes('trdChannelID') ? newKeys.splice(1, 0, 'trdChannelID', 'wechatMpName', 'trdTemplateID', 'trdTemplateIDLabel') : null) :
                    _.remove(newKeys, function (k) {
                        return k === 'trdChannelID' || k === 'trdTemplateID' || k === 'trdTemplateIDLabel' || k === 'wechatMpName';
                    });
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys })
                break;
            case 'trdChannelID':
                describe === '活动券' && value === 10 && newKeys.includes('trdChannelID') && !newKeys.includes('wechatMpName') ? newKeys.splice(2, 0, 'wechatMpName') :
                    _.remove(newKeys, function (k) {
                        return k === 'wechatMpName';
                    });
                secondKeys[describe][0].keys = [...newKeys];
                this.setState({ secondKeys, }, () => {
                    this.secondForm.setFieldsValue({ trdChannelID: value, trdTemplateID: '', trdTemplateIDLabel: '', wechatMpName: '' });
                    type === 'add' ? this.queryTrdTemplate((value === 10 && this.state.mpList ? (this.state.mpList[0] ? this.state.mpList[0].mpID : undefined) : undefined), value) : null; // 第三方券模版
                })
                break;
            case 'wechatMpName':
                this.setState({ secondKeys, }, () => {
                    this.secondForm.setFieldsValue({ trdTemplateID: '', trdTemplateIDLabel: '' });
                    const mp = (this.state.mpList || []).find(mp => mp.mpName == value);
                    const mpID = mp ? mp.mpID : this.state.mpList ? this.state.mpList[0].mpID : undefined;
                    type === 'add' ? this.queryTrdTemplate(mpID, 10) : null; // wx公众号券模版/////////////////////////////////////
                })
                break;
            case 'trdTemplateID':
                this.secondForm.setFieldsValue({ trdTemplateID: value, trdTemplateIDLabel: value })
                break;
            default:
                break;
        }
        if (value && key == 'foodNameList') {
            values.isFoodCatNameList = value.categoryOrDish;
            values.foodNameList = value.categoryOrDish == '0' ? value.foodCategory : value.dishes;
        } else {
            values[key] = value;
            values.isFoodCatNameList = '0';
        }

        this.setState({ values });
    }
    /**
     * Callback once the user click the cancel button
     * @param  {Function} cb      callback function return by CustomProgressBar, it reset the state of the ProgressBar
     * @param  {int}   current current index of the steps which is passed to CustomProgressBar
     * @return {null}
     */
    handleCancel = (cb, current) => {
        this.setState({
            current: 0,
            values: {},
            firstKeys: FIRST_KEYS,
            secondKeys: SECOND_KEYS,
        });
        this.props.saleCenterResetDetailInfo({});
        this.props.onCancel();
        cb();
    }
    handleCCCCancel = () => {
        this.props.saleCenterResetDetailInfo({});
        this.props.onCancel();
    }
    handleNext = (cb) => {
        const validateFoodList = (_cb) => {
            if (this.state.foodNameList.length == 0) {
                this.setState({ foodNameListStatus: 'error' })
                return false;
            }
            this.setState({ foodNameListStatus: 'success' })

            _cb && _cb();
        }
        this.firstForm.validateFieldsAndScroll((error) => {
            if (error) {
                if (this.props.gift.value == '20') {
                    validateFoodList();
                }
            } else if (this.props.gift.value == '20') {
                validateFoodList(cb);
            } else {
                cb && cb();
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
                    return value && value[0].promotionIDStr;

                default:
                    return value !== undefined ? value : '';
            }
        })
    }
    handleFinish = (cb) => {
        const { values, groupTypes, foodNameList, isFoodCatNameList } = this.state;
        const { type, gift: { value, data } } = this.props;
        this.secondForm.validateFieldsAndScroll((err, formValues) => {
            if (err) return;
            let params = _.assign({}, values, formValues, { giftType: value });
            params = this.formatFormData(params);
            let shopNames = '',
                shopIDs = '',
                callServer;
            params.shopNames && params.shopNames.map((shop, idx) => {
                shopNames += `${shop.content},`;
                shopIDs += `${shop.id},`;
            });
            params.shopNames = shopNames;
            params.shopIDs = shopIDs;
            if (params.giftShareType == '2') {
                let shareIDs = '';
                params.shareIDs && params.shareIDs.map((share, idx) => {
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
            if (!params.isDiscountRate) {
                params.discountRate = 1
            }
            if (!params.isPointRate) {
                params.pointRate = 0
            }
            if (type === 'add') {
                callServer = 'addGift_dkl';
                if (values.brandID == '-1') {
                    params = _.omit(params, 'brandID');
                } else {
                    const brandJSON = _.find(groupTypes, { value: values.brandID }) || {};
                    params.giftName = `${brandJSON.label || ''}${values.giftName}`;
                }
            } else if (type == 'edit') {
                callServer = 'updateGift_dkl';
                params.giftItemID = data.giftItemID;
            }
            params.foodNameList = foodNameList instanceof Array ? foodNameList.join(',') : foodNameList;
            params.isFoodCatNameList = isFoodCatNameList == '0' ? '1' : '0';
            this.setState({
                finishLoading: true,
            });
            const { accountInfo } = this.props;
            const { groupName } = accountInfo.toJS();
            fetchData(callServer, { ...params, groupName }, null, { path: '' }).then((data) => {
                this.setState({
                    finishLoading: false,
                });
                if (data) {
                    message.success('成功', 3);
                    this.handleCancel(cb);
                } else {
                    message.success('失败', 3);
                }
                if (type == 'edit') {
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
            <Row>
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
                            rules: [{ required: true, message: '礼品名称不能为空' },
                            { max: 50, message: '请输入不超过50个字符的名称' }],
                        })(<Input size="large" placeholder="请输入礼品名称" />)}
                    </FormItem>
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
                        type={this.props.type}
                        giftItemID={giftItemID}
                        thisGiftItem={this.props.gift.data.giftItemID ? this.props.gift.data : null}
                    />)}
                </Col>
            </Row>
        )
    }

    renderShopNames(decorator) {
        const { shopNames } = this.state.values;
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
            <Row>
                <Col>
                    {decorator({})(<MyProjectEditBox
                        treeProps={shopCfg}
                        title="店铺"
                    />)}
                </Col>
            </Row>
        )
    }

    renderFoodName(decorator, form) {
        const { getFieldValue } = form;
        const formItemLayout = { labelCol: { span: 1 }, wrapperCol: { span: 23 } };
        // const isFoodCatNameList = getFieldValue('isFoodCatNameList') || '0';
        // const nameType = isFoodCatNameList == '0' ? '菜品' : '分类';
        let _scopeLst = [];
        if (this.props.type == 'edit') {
            const { isFoodCatNameList = '0', foodNameList = [] } = this.props.gift.data;
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
                help={this.state.foodNameListStatus == 'success' ? null : '抵扣菜品或分类不能为空'}
            >
                {
                    decorator({
                        rules: [
                            {
                                required: true,
                                message: '抵扣菜品或分类不能为空',
                            },
                        ],
                    })(<PromotionDetailSetting radioLabel={'抵扣方式'} noExclude={true} catOrFoodValue={_scopeLst} autoFetch={true} />)
                }
            </FormItem>

        )
    }
    renderGiftPromotion(decorator, form) {
        const { gift: { data }, type } = this.props,
            promotionID = data.promotionID ? [{ sharedIDStr: data.promotionID }] : [];
        return (
            <FormItem>
                {
                    decorator({})(<GiftPromotion promotionID={promotionID} type={type} />)
                }
            </FormItem>
        )
    }

    // afterClose = () => {
    // 	this.setState({
    // 		modalKey: Math.random()
    // 	})
    // }
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props,
            { current, firstKeys, secondKeys, values, mpList = [], trdTemplateInfoList = [], trdTemplateID, trdTemplateIDLabel } = this.state;
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
        dates.isMapTotrd = dates.trdChannelID ? true : false;
        const formItems = {
            ...FORMITEMS,
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            giftValue: {
                label: value == '10' ? '礼品价值' : '可抵扣金额',
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
                render: (decorator, form) => this.renderFoodName(decorator, form),
            },
            numberOfTimeType: {
                // label: '使用次数限制',
                type: 'custom',
                render: (decorator, form, formData) => {
                    return (
                        <Row style={{ display: 'none' }}>
                            <Col span={12}>
                                <FormItem>
                                    {decorator({
                                        key: 'numberOfTimeType',
                                        initialValue: this.props.type == 'edit' ? `${this.props.gift.data.numberOfTimeType}` : '0',
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
                                    initialValue: this.props.type == 'edit' ? `${this.props.gift.data.moneyTopLimitType}` : '0',
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
            },
            trdChannelID: {
                label: '第三方渠道',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: 10,
                options: GiftCfg.trdChannelIDs,
            },
            wechatMpName: {
                label: '微信公众号选择',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: mpList[0] ? mpList[0].mpName : '',
                options: mpList.map(mp => {
                    return {
                        label: mp.mpName,
                        value: mp.mpName,
                    }
                }),
            },
            trdTemplateID: {
                label: '第三方券模板或活动',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'combo',
                rules: [{ required: true, message: '不能为空' }],
                defaultValue: '',
                options: trdTemplateInfoList.map(template => {
                    return {
                        label: template.trdGiftName,
                        value: template.trdGiftItemID,
                    }
                }),
            },
            trdTemplateIDLabel: {
                label: '第三方券模板或活动ID',
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                type: 'text',
                defaultValue: '',
                // value: trdTemplateID || dates.trdTemplateID || '',
                props: { disabled: true }
                // render: () => <Input value={trdTemplateID || dates.trdTemplateID || ''} disabled />
            },
            promotionID: {
                label: '对应基础营销活动',
                type: 'custom',
                rules: [{ required: true, message: '不能为空' }],
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                render: (decorator, form) => this.renderGiftPromotion(decorator, form) // <GiftPromotion></GiftPromotion>,
            },
        };
        let formData = {};
        // if (type == 'edit') {
        formData = data === undefined ? dates : values;
        // }
        if (type == 'edit') {
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
            content: (<div className={styles.giftWrap}>
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
                />
                <div className={value === '100' && type === 'edit' ? styles.opacitySet : null}></div>
            </div>),
        }];
        return (
            // Todo:点叉关闭功能
            <Modal
                // key={modalKey}
                title={`${type === 'add' ? '新建' : '编辑'}${describe}`}
                className={styles.foodModal}
                visible={visible}
                maskClosable={false}
                onCancel={() => this.handleCCCCancel()}
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
