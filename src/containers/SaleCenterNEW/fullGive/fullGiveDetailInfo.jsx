/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-30T10:17:40+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: fullGiveDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T22:40:04+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react';
import { Row, Col, Form, Select, Radio } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AddGrade from '../../../containers/SaleCenterNEW/common/AddGrade'; // 可增删的输入框 组件
import NewAddGrade from '../../../containers/SaleCenterNEW/common/NewAddGrade';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

//周黑鸭需求
import AdvancedPromotionDetailSettingNew from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSettingNew';
import GoodsRef from '@hualala/sc-goodsRef';
import Approval from '../../../containers/SaleCenterNEW/common/Approval';
import { isCheckApproval, checkGoodsScopeListIsNotEmpty, isZhouheiya, businessTypesList } from '../../../constants/WhiteList';

const Immutable = require('immutable');
@injectIntl()
class FullGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        const { data, ruleType, countType, maxFreeLimitType, maxFreeAmount } = this.initState();
        this.state = {
            display: !this.props.isNew,
            ruleType,
            priceLst: [],
            data,
            priceLst: Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList'])) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS() : Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) ?
                this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [],
            foodRuleList: Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList'])) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS() : [],
            flag: true,
            //周黑鸭需求
            countType,
            maxFreeLimitType,
            maxFreeAmount

        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        //周黑鸭需求
        if (isZhouheiya(this.props.user.groupID)) {
            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            if (goodsScopeList.length > 0) {
                this.goodsScopeList = goodsScopeList[0]
            }

            let requiredLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'requiredLst']).toJS();
            this.requiredLst = {
                containData: { goods: requiredLst },
                containType: 1,
                exclusiveData: {},
                participateType: 1
            }
        }

    }
    initState = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return  {
                ruleType: '0',
                data: {
                    0: {
                        stageAmount: '',
                        giftType: '0',
                        dishes: [],
                        giftName: 'qqq',
                        foodCount: '',
                        foodCountFlag: true,
                        dishesFlag: true,
                        StageAmountFlag: true,
                    },
                },
                //周黑鸭需求
                countType: '1',
                maxFreeLimitType: '0',
                maxFreeAmount: ''
            };
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let ruleType = _rule.stageType || '0';
        let data = {
            0: {
                stageAmount: '',
                giftType: '0',
                dishes: [],
                giftName: 'qqq',
                foodCount: '',
                foodCountFlag: true,
                dishesFlag: true,
                StageAmountFlag: true,
            },
        };
        //周黑鸭需求
        let _scopeLst = []
        if (isZhouheiya(this.props.user.groupID)) {
            let goodsScopeList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'goodsScopeList']).toJS();
            _scopeLst = goodsScopeList
        } else {
            _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        }
        if (_rule.stageType == 0) {
            // 下单即赠送
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
            if (isZhouheiya(this.props.user.groupID)) {
                let stageGoodsList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'stageGoodsList']).toJS();
                let goodsList = []
                if (stageGoodsList.length > 0 && stageGoodsList[0].goodsList.length > 0) {
                    goodsList = stageGoodsList[0].goodsList
                }
                data[0].dishes = goodsList
            }
        } else if (_rule.stageType == '1') {
            if (isZhouheiya(this.props.user.groupID)) {
                if (!checkGoodsScopeListIsNotEmpty(_scopeLst)) {
                    ruleType = '1'
                } else {
                    ruleType = '4'
                }
            } else {
                if (_scopeLst.length == 0) {
                    ruleType = '1'
                } else {
                    ruleType = '4'
                }
            }

            // 每满
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
            data[0].stageAmount = _rule.stageAmount || '';
            if (isZhouheiya(this.props.user.groupID)) {
                let stageGoodsList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'stageGoodsList']).toJS();
                let goodsList = []
                if (stageGoodsList.length > 0 && stageGoodsList[0].goodsList.length > 0) {
                    goodsList = stageGoodsList[0].goodsList
                }
                data[0].dishes = goodsList
            }
        } else {
            // 满
            if (isZhouheiya(this.props.user.groupID)) {
                if (!checkGoodsScopeListIsNotEmpty(_scopeLst)) {
                    ruleType = '2'
                } else {
                    ruleType = '3'
                }
            } else {
                if (_scopeLst.length == '0') {
                    ruleType = '2'
                } else {
                    ruleType = '3'
                }
            }

            let foodRuleList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS()

            if (isZhouheiya(this.props.user.groupID)) {
                let stageGoodsList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'stageGoodsList']).toJS();
                foodRuleList = stageGoodsList
            } else {
                foodRuleList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS()
            }
            if (isZhouheiya(this.props.user.groupID)) {
                if (foodRuleList && foodRuleList.length) {
                    foodRuleList.map((stage, index) => {
                        data[index] = {
                            stageAmount: '',
                            giftType: '0',
                            dishes: stage.goodsList,
                            giftName: null,
                            foodCount: '',
                            foodCountFlag: true,
                            dishesFlag: true,
                            StageAmountFlag: true,
                        };
                        data[index].foodCount = _rule.stage[index].giveFoodCount || '';
                        data[index].giftName = _rule.stage[index].giftName || '';
                        data[index].stageAmount = _rule.stage[index].stageAmount || '';
                    })
                } else {
                    _rule.stage && _rule.stage.map((stage, index) => {
                        data[index] = {
                            stageAmount: '',
                            giftType: '0',
                            dishes: [],
                            giftName: null,
                            foodCount: '',
                            foodCountFlag: true,
                            dishesFlag: true,
                            StageAmountFlag: true,
                        };
                        data[index].foodCount = stage.giveFoodCount || '';
                        data[index].giftName = stage.giftName || '';
                        data[index].stageAmount = stage.stageAmount || '';
                    })
                }
            } else {
                if (foodRuleList && foodRuleList.length) {
                    foodRuleList.map((stage, index) => {
                        let tempRule = JSON.parse(stage.rule);
                        data[index] = {
                            stageAmount: '',
                            giftType: '0',
                            dishes: [],
                            giftName: null,
                            foodCount: '',
                            foodCountFlag: true,
                            dishesFlag: true,
                            StageAmountFlag: true,
                        };
                        data[index].foodCount = tempRule.giveFoodCount || '';
                        data[index].giftName = tempRule.giftName || '';
                        data[index].stageAmount = tempRule.stageAmount || '';
                    })
                } else {
                    _rule.stage && _rule.stage.map((stage, index) => {
                        data[index] = {
                            stageAmount: '',
                            giftType: '0',
                            dishes: [],
                            giftName: null,
                            foodCount: '',
                            foodCountFlag: true,
                            dishesFlag: true,
                            StageAmountFlag: true,
                        };
                        data[index].foodCount = stage.giveFoodCount || '';
                        data[index].giftName = stage.giftName || '';
                        data[index].stageAmount = stage.stageAmount || '';
                    })
                }
            }

        }

        return {
            data,
            ruleType,
            //周黑鸭需求
            countType: _rule.countType ? _rule.countType : '1',
            maxFreeLimitType: _rule.maxFreeLimitType ? _rule.maxFreeLimitType : '0',
            maxFreeAmount: _rule.maxFreeAmount
        }
    }

    handleSubmit = (cbFn) => {
        const { data, dishes, ruleType } = this.state;
        let nextFlag = true;

        if (isZhouheiya(this.props.user.groupID)) {
            this.props.form.validateFieldsAndScroll((err1, basicValues) => {
                if (err1) {
                    nextFlag = false;
                }
                let flag = false;
                let length = Object.keys(data).length;
                for (let i = 0; i < length; i++) {
                    if (!data[i].StageAmountFlag) {
                        flag = true;
                    }
                }
                if (flag) {
                    nextFlag = false;
                }
                let stage = [{}];
                let priceLst = [];
                let foodRuleList = [];
                let tempArr = []

                // save state to redux
                if (ruleType == '0') {
                    if (data[0].foodCount == '' || data[0].foodCount == null) {
                        data[0].foodCountFlag = false;
                        nextFlag = false;
                    }
                    if (data[0].dishes.length == 0) {
                        data[0].dishesFlag = false;
                        nextFlag = false;
                    }

                    this.setState({ data });
                    stage[0].giveFoodCount = data[0].foodCount;
                    stage[0].stageNum = 0;

                    //周黑鸭需求
                    let stageGoodsList = []
                    stageGoodsList.push({ stage: 0, goodsList: data[0].dishes })
                    this.props.setPromotionDetail({
                        stageGoodsList,
                    });
                } else if (ruleType == '1' || ruleType == '4') {

                    if (this.state.maxFreeLimitType == 1 && !this.state.maxFreeAmount) {
                        nextFlag = false;
                    }
                    // 每满
                    if (data[0].foodCount == '' || data[0].foodCount == null) {
                        data[0].foodCountFlag = false;
                        nextFlag = false;
                    }

                    if (!data[0].stageAmount || data[0].stageAmount <= 0) {
                        data[0].StageAmountFlag = false;
                        nextFlag = false;
                    }
                    this.setState({ data });
                    stage[0].stageAmount = data[0].stageAmount;
                    stage[0].giveFoodCount = data[0].foodCount;
                    stage[0].stageNum = 0;
                    let tempArr1 = [];
                    priceLst = data[0].dishes.map((dish, index) => {
                        if (tempArr1.indexOf(dish.itemID) == -1) {
                            tempArr1.push(dish.itemID);
                            return {
                                foodUnitID: dish.itemID || index,
                                foodUnitCode: dish.foodKey,
                                foodName: dish.foodName,
                                brandID: dish.brandID || '0',
                                foodUnitName: dish.unit,
                                price: dish.price,
                                stageNo: 0,
                                imagePath: dish.imgePath,
                            }
                        }
                    });

                    if (ruleType == 1) {
                        this.props.setPromotionDetail({
                            goodsScopeList: [],
                        });
                    } else {
                        //周黑鸭需求
                        let stageGoodsList = []
                        stageGoodsList.push({ stage: 0, goodsList: data[0].dishes })
                        this.props.setPromotionDetail({
                            stageGoodsList,
                        });
                    }

                } else {
                    // 满
                    //多档位的增加新字段
                    const { ruleType } = this.state;
                    Object.keys(data).map((keys) => {
                        if (data[keys].foodCount == '' || data[keys].foodCount == null) {
                            data[keys].foodCountFlag = false;
                            nextFlag = false;
                        }
                        if (data[keys].dishes.length == 0) {
                            data[keys].dishesFlag = false;
                            nextFlag = false;
                        }
                        if (!data[keys].stageAmount || data[keys].stageAmount <= 0) {
                            data[keys].StageAmountFlag = false;
                            nextFlag = false;
                        }
                    });
                    this.setState({ data });
                    stage = Object.keys(data).map((keys, index) => {
                        let tempIndex = index;
                        return {
                            stageAmount: data[keys].stageAmount,
                            giveFoodCount: data[keys].foodCount,
                            stageNum: tempIndex,
                        }
                    })

                    if (ruleType == 2) {
                        this.props.setPromotionDetail({
                            goodsScopeList: []
                        });
                    }

                    let stageGoodsList = []
                    for (let i = 0; i < length; i++) {
                        if (!data[i].StageAmountFlag) {
                            flag = true;
                        }
                        stageGoodsList.push({ stage: i, goodsList: data[i].dishes })
                    }
                    this.props.setPromotionDetail({
                        stageGoodsList,
                    });
                }
                const rule = (ruleType == '2' || ruleType == '3') ?
                    ({
                        stageType: '2',
                        stage,
                        countType: this.state.countType
                    }) : (ruleType == '1' || ruleType == '4' ?
                        ({
                            stageType: '1',
                            countType: this.state.countType,
                            maxFreeLimitType: this.state.maxFreeLimitType,
                            maxFreeAmount: this.state.maxFreeAmount,
                            ...stage[0],
                        }) :
                        ({
                            stageType: '0',
                            countType: this.state.countType,
                            ...stage[0],
                        }));
                let newPrice = [];
                priceLst = priceLst.filter((item) => { if (item) { return item } })
                if (priceLst[0] && typeof priceLst[0] === 'object') {
                    priceLst.forEach((price, index) => {
                        newPrice = newPrice.concat(priceLst[index]);
                    })
                }
                for (let i = 0; i < foodRuleList.length; i++) {
                    tempArr.push(...foodRuleList[i])
                }
                let secondTrans = [];
                tempArr.forEach((item) => {
                    let tempKeys = item.rule.stageAmount;
                    let flag = false;
                    secondTrans.length && secondTrans.map((ath) => {
                        if (ath.rule.stageAmount == tempKeys) {
                            flag = true;
                            if (!ath.priceList.filter((a) => {
                                return a.foodUnitID == item.priceList[0].foodUnitID;
                            }).length) {
                                ath.priceList = ath.priceList.concat(item.priceList);
                            }
                        }
                    })
                    if (!flag) {
                        secondTrans.push(item);
                    }
                })
                secondTrans.map((item) => {
                    item.rule = JSON.stringify(item.rule);
                })

                this.props.setPromotionDetail({
                    rule
                });

                //周黑鸭需求
                this.props.setPromotionDetail({
                    approval: this.state.approvalInfo,
                });
                if (isCheckApproval && (!this.state.approvalInfo.activityCost || !this.state.approvalInfo.estimatedSales || !this.state.approvalInfo.auditRemark)) {
                    nextFlag = false
                }
            });
        } else {
            this.props.form.validateFieldsAndScroll((err1, basicValues) => {

                if (err1) {
                    nextFlag = false;
                }
                let flag = false;
                let length = Object.keys(data).length;
                for (let i = 0; i < length; i++) {
                    if (!data[i].StageAmountFlag) {
                        flag = true;
                    }
                }
                if (flag) {
                    nextFlag = false;
                }
                let stage = [{}];
                let priceLst = [];
                let foodRuleList = [];
                let tempArr = []
                // save state to redux
                if (ruleType == '0') {
                    if (data[0].foodCount == '' || data[0].foodCount == null) {
                        data[0].foodCountFlag = false;
                        nextFlag = false;
                    }
                    if (data[0].dishes.length == 0) {
                        data[0].dishesFlag = false;
                        nextFlag = false;
                    }
                    this.setState({ data });
                    stage[0].giveFoodCount = data[0].foodCount;
                    stage[0].stageNum = 0;
                    let tempArr1 = [];
                    priceLst = data[0].dishes.map((dish, index) => {
                        if (tempArr1.indexOf(dish.itemID) == -1) {
                            tempArr1.push(dish.itemID);
                            return {
                                foodUnitID: dish.itemID || index,
                                foodUnitCode: dish.foodKey,
                                foodName: dish.foodName,
                                foodUnitName: dish.unit,
                                brandID: dish.brandID || '0',
                                price: dish.price,
                                stageNo: 0,
                                imagePath: dish.imgePath,
                            }
                        }

                    });
                } else if (ruleType == '1' || ruleType == '4') {
                    // 每满
                    if (data[0].foodCount == '' || data[0].foodCount == null) {
                        data[0].foodCountFlag = false;
                        nextFlag = false;
                    }
                    if (data[0].dishes.length == 0) {
                        data[0].dishesFlag = false;
                        nextFlag = false;
                    }
                    if (!data[0].stageAmount || data[0].stageAmount <= 0) {
                        data[0].StageAmountFlag = false;
                        nextFlag = false;
                    }
                    this.setState({ data });
                    stage[0].stageAmount = data[0].stageAmount;
                    stage[0].giveFoodCount = data[0].foodCount;
                    stage[0].stageNum = 0;
                    let tempArr1 = [];
                    priceLst = data[0].dishes.map((dish, index) => {
                        if (tempArr1.indexOf(dish.itemID) == -1) {
                            tempArr1.push(dish.itemID);
                            return {
                                foodUnitID: dish.itemID || index,
                                foodUnitCode: dish.foodKey,
                                foodName: dish.foodName,
                                brandID: dish.brandID || '0',
                                foodUnitName: dish.unit,
                                price: dish.price,
                                stageNo: 0,
                                imagePath: dish.imgePath,
                            }
                        }
                    });
                } else {
                    // 满
                    //多档位的增加新字段
                    const { ruleType } = this.state;
                    Object.keys(data).map((keys) => {
                        if (data[keys].foodCount == '' || data[keys].foodCount == null) {
                            data[keys].foodCountFlag = false;
                            nextFlag = false;
                        }
                        if (data[keys].dishes.length == 0) {
                            data[keys].dishesFlag = false;
                            nextFlag = false;
                        }
                        if (!data[keys].stageAmount || data[keys].stageAmount <= 0) {
                            data[keys].StageAmountFlag = false;
                            nextFlag = false;
                        }
                    });
                    this.setState({ data });
                    stage = Object.keys(data).map((keys, index) => {
                        priceLst = [];
                        let tempIndex = index;
                        foodRuleList.push(data[keys].dishes.map((dish, Athindex) => {
                            return {
                                rule: {
                                    stageAmount: data[keys].stageAmount,
                                    giveFoodCount: data[keys].foodCount,
                                    stageNum: tempIndex,
                                },
                                priceList: [{
                                    foodUnitID: dish.itemID || Athindex,
                                    foodUnitCode: dish.foodKey,
                                    foodName: dish.foodName,
                                    foodUnitName: dish.unit,
                                    brandID: dish.brandID || '0',
                                    price: dish.price,
                                    stageNo: keys,
                                    imagePath: dish.imgePath,
                                }],
                                scopeList: [],
                            }
                        }));
                        return {
                            stageAmount: data[keys].stageAmount,
                            giveFoodCount: data[keys].foodCount,
                            stageNum: tempIndex,
                        }
                    })
                }
                const rule = (ruleType == '2' || ruleType == '3') ?
                    ({
                        stageType: '2',
                        stage,
                    }) : (ruleType == '1' || ruleType == '4' ?
                        ({
                            stageType: '1',
                            ...stage[0],
                        }) :
                        ({
                            stageType: '0',
                            ...stage[0],
                        }));
                let newPrice = [];
                priceLst = priceLst.filter((item) => { if (item) { return item } })
                if (priceLst[0] && typeof priceLst[0] === 'object') {
                    priceLst.forEach((price, index) => {
                        newPrice = newPrice.concat(priceLst[index]);
                    })
                }
                for (let i = 0; i < foodRuleList.length; i++) {
                    tempArr.push(...foodRuleList[i])
                }
                let secondTrans = [];
                tempArr.forEach((item) => {
                    let tempKeys = item.rule.stageAmount;
                    let flag = false;
                    secondTrans.length && secondTrans.map((ath) => {
                        if (ath.rule.stageAmount == tempKeys) {
                            flag = true;
                            if (!ath.priceList.filter((a) => {
                                return a.foodUnitID == item.priceList[0].foodUnitID;
                            }).length) {
                                ath.priceList = ath.priceList.concat(item.priceList);
                            }
                        }
                    })
                    if (!flag) {
                        secondTrans.push(item);
                    }
                })
                secondTrans.map((item) => {
                    item.rule = JSON.stringify(item.rule);
                })
                this.props.setPromotionDetail({
                    rule, priceLst: newPrice || priceLst, foodRuleList: secondTrans,
                });
            });
        }
        return nextFlag;
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    renderGoodRef() {
        return (
            <div>
                <FormItem
                    label={'活动范围'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <GoodsRef
                        defaultValue={this.goodsScopeList}
                        businessTypesList={businessTypesList}
                        onChange={(goods) => {
                            this.props.setPromotionDetail({
                                goodsScopeList: [goods],
                            });
                        }} ></GoodsRef>
                </FormItem>

            </div>
        )
    }

    renderPromotionRule = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { intl } = this.props;
        const k5g5bcic = intl.formatMessage(SALE_STRING.k5g5bcic);
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const type = [
            { value: '0', name: k5g5bcic },
            { value: '2', name: k5ez4ovx },
            { value: '1', name: k5ez4pdf },
            { value: '3', name: k5ez4pvb },
            { value: '4', name: k5ez4qew },
        ];
        return (
            <div>

                <FormItem
                    label={SALE_LABEL.k5ez4n7x}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Select
                        placeholder=""
                        defaultValue={this.state.ruleType}
                        className={`${styles.linkSelectorRight} fullGiveDetailMountClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.ruleType}
                        onChange={(val) => {
                            let { ruleType } = this.state;
                            ruleType = val;
                            this.setState({
                                flag: false,
                            }, () => {
                                this.setState({
                                    flag: true,
                                })
                            })
                            if (val == '0' || val == '1' || val == '2') {
                                this.props.setPromotionDetail({
                                    // i清空已选,
                                    scopeLst: [],
                                    dishes: [],
                                    priceLst: [],
                                    foodCategory: [],
                                    excludeDishes: [],
                                });
                            }
                            if(val == 2 || val == 3) {
                                this.setState({
                                    data: {
                                        0: {
                                            stageAmount: '',
                                            giftType: '0',
                                            dishes: [],
                                            giftName: null,
                                            foodCount: '',
                                            foodCountFlag: true,
                                            dishesFlag: true,
                                            StageAmountFlag: true,
                                        },
                                    },
                                    foodRuleList: []
                                })
                            }
                            this.setState({ ruleType });
                        }
                        }
                    >
                        {type
                            .map((type) => {
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })}
                    </Select>
                </FormItem>
                {!isZhouheiya(this.props.user.groupID) && (this.state.ruleType == 3 || this.state.ruleType == 4) ?
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} /> : isZhouheiya(this.props.user.groupID) && (this.state.ruleType == 3 || this.state.ruleType == 4) ?
                        this.renderGoodRef()
                        : null}
                <Row>
                    <Col span={19} offset={2}>
                        {
                            isZhouheiya(this.props.user.groupID) && ((this.state.ruleType == 3 || this.state.ruleType == 2) ?
                                <NewAddGrade
                                    getFieldDecorator={getFieldDecorator}
                                    getFieldValue={getFieldValue}
                                    form={this.props.form}
                                    ruleType={this.state.ruleType}
                                    value={this.state.data}
                                    onChange={(value, countType) => {
                                        this.setState({ data: value, countType });
                                    }
                                    }
                                    onCountTypeChange={(countType) => {
                                        this.setState({ countType })
                                    }}
                                    countType={this.state.countType}
                                    foodRuleList={this.state.foodRuleList}
                                /> :
                                <AddGrade
                                    getFieldDecorator={getFieldDecorator}
                                    getFieldValue={getFieldValue}
                                    form={this.props.form}
                                    ruleType={this.state.ruleType}
                                    value={this.state.data}
                                    onChange={(value) => {
                                        this.setState({ data: value });
                                    }}
                                    onCountTypeChange={(countType, maxFreeLimitType, maxFreeAmount) => {
                                        this.setState({ countType, maxFreeLimitType, maxFreeAmount })
                                    }}
                                    countType={this.state.countType}
                                    onMaxFreeLimitTypeChange={(val) => {
                                        this.setState({
                                            maxFreeLimitType: val.maxFreeLimitType, maxFreeAmount: val.maxFreeAmount
                                        })
                                    }}
                                    onMaxFreeAmountChange={(maxFreeAmount) => {
                                        this.setState({
                                            maxFreeAmount
                                        })
                                    }}
                                    maxFreeLimitType={this.state.maxFreeLimitType}
                                    maxFreeAmount={this.state.maxFreeAmount}
                                />)
                        }
                        {
                            !isZhouheiya(this.props.user.groupID) && ((this.state.ruleType == 3 || this.state.ruleType == 2) ?
                                <NewAddGrade
                                    getFieldDecorator={getFieldDecorator}
                                    getFieldValue={getFieldValue}
                                    form={this.props.form}
                                    ruleType={this.state.ruleType}
                                    value={this.state.data}
                                    onChange={(value) => {
                                        this.setState({ data: value });
                                    }
                                    }
                                    foodRuleList={this.state.foodRuleList}
                                /> :
                                <AddGrade
                                    getFieldDecorator={getFieldDecorator}
                                    getFieldValue={getFieldValue}
                                    form={this.props.form}
                                    ruleType={this.state.ruleType}
                                    value={this.state.data}
                                    onChange={(value) => {
                                        this.setState({ data: value });
                                    }
                                    }
                                />)
                        }
                    </Col>
                </Row>

            </div>
        )
    }

    renderAdvancedSettingButton() {
        return (

            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>


        )
    }

    //周黑鸭需求
    renderMustFood() {
        return (
            <div>
                <FormItem
                    label={'必选菜品'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <GoodsRef
                        defaultValue={this.requiredLst}
                        businessTypesList={businessTypesList}
                        containLabel=""
                        exclusiveShow={false}
                        onChange={(goods) => {
                            this.props.setPromotionDetail({
                                requiredLst: goods.containData.goods,
                            });

                        }}
                        showContainSeletorOption={{ categoryShow: false }}
                        showParticipateLabel={{ participate: false, unParticipate: false }}>

                    </GoodsRef>
                </FormItem>

            </div>
        )
    }

    render() {
        const payLimit = this.state.ruleType != 0;
        return (
            <div style={{position: "initial", width: '100%', height: '100%', overflow: 'auto'}}>
                <div style={{position: "absolute", left: -226, background: 'white', top: 160, width: 221,}}>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 14, fontWeight: 500, margin: '10px 0'}}>活动说明：</p>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, margin: '10px 0'}}>1. 同一活动时间，有多个满赠活动，活动会执行哪个？</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动时段】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</p>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, padding: '10px 0', borderTop: '1px solid #E9E9E9', marginTop: '7px'}}>2. 满赠活动使用注意事项</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>满赠/每满赠活动与买赠、第二份打折、加价换购活动之间不受互斥规则限制，在线上餐厅都按共享执行</p>
                </div>
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display && isZhouheiya(this.props.user.groupID) && this.renderMustFood()}
                    {this.state.display && !isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSetting payLimit={payLimit} /> : null}
                    {this.state.display && isZhouheiya(this.props.user.groupID) ? <AdvancedPromotionDetailSettingNew bizType={1} payLimit={payLimit} /> : null}
                    {isZhouheiya(this.props.user.groupID) ? <Approval onApprovalInfoChange={(val) => {
                        this.setState({
                            approvalInfo: {
                                ...val
                            }
                        })
                    }} /> : null}
                </Form>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        user: state.user.get('accountInfo').toJS()
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(FullGiveDetailInfo));
