/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:52:34+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Input, InputNumber, Tooltip, Icon, Button, message } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../common/PriceInput';
import AdvancedPromotionDetailSetting from '../common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

@injectIntl()
class WeighBuyGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            stageAmount: '',
            giveFoodCount: '',
            dishes: [],
            targetScope: 0,
            stageAmountFlag: true,
            stageType: 2,
            giveFoodCountFlag: true,
            dishsSelectStatus: 'success',
            ifMultiGrade: true,
            foodRuleList: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS().length ?
                this.initData(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS()) :
                this.isNewOrOldData(),
            index: 'not-important',
            data: [
                {
                    stageAmount: '',
                    freeAmount: '',
                    stageAmountFlag: true,
                    freeAmountFlag: true,
                },
            ],
            priceList: [],
            priceListFlag: true,
            scopeLst: [],
            scopeLstFlag: true,
            floatDown: '',
            floatUp: '',
            floatDownFlag: true,
            floatUpFlag: true,
        };
    }
    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let { display } = this.state;
        display = !this.props.isNew;
        // 这边对数据进行解析设置priceList,scopeList
        const ifHasFoodRuleList = this.props.promotionDetailInfo.getIn(['$promotionDetail']).toJS()
        if (ifHasFoodRuleList.foodRuleList && ifHasFoodRuleList.foodRuleList.length) {
            this.setState({
                priceList: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS()[0].priceList
            })
        }
        if (ifHasFoodRuleList.scopeLst && ifHasFoodRuleList.scopeLst.length) {
            this.setState({
                scopeLst: this.props.promotionDetailInfo.getIn(['$promotionDetail']).toJS().scopeLst
            })
        }
        // 根据ruleJson填充页面
        this.setState({
            display,
            stageType: _rule.stageType ? _rule.stageType : 2,
            stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
            giveFoodCount: _rule.stage ? _rule.stage[0].giveFoodCount : '',
            floatUp: _rule.stage ? _rule.stage[0].floatUp : '',
            floatDown: _rule.stage ? _rule.stage[0].floatDown : '',
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }
    isNewOrOldData = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return [
                {
                    rule: {
                        stageAmount: '',
                        giveFoodCount: '',
                        stageType: '2',
                        stageNum: 0,
                    },
                    priceList: [],
                    scopeList: [],
                }
            ];
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        const tempArr = [
            {
                rule: {
                    stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
                    giveFoodCount: _rule.stage ? _rule.stage[0].giveFoodCount : '',
                    stageType: _rule.stageType ? _rule.stageType : 2,
                    stageNum: 0,
                    StageAmountFlag: _rule.stage[0].stageAmount ? true : false,
                },
                priceList: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS(),
                scopeList: [],
            }
        ];
        return tempArr;
    }
    initData = (data) => {
        data.map((item) => {
            item.rule = JSON.parse(item.rule);
            return item;
        })
        return data;
    }

    handleSubmit = () => {
        let {
            stageAmount,
            stageType,
            giveFoodCount,
            targetScope,
            stageAmountFlag,
            giveFoodCountFlag,
            floatDown,
            floatUp,
            floatDownFlag,
            floatUpFlag,
            scopeLstFlag,
            priceListFlag,
            scopeLst,
            priceList,
        } = this.state;
        let flag = true;
        if (stageAmount == null || stageAmount == '') {
            stageAmountFlag = false;
        }
        if (giveFoodCount == null || giveFoodCount == '') {
            giveFoodCountFlag = false;
        }
        if(Number(this.state.giveFoodCount) > Number(this.state.stageAmount)) {
            flag = false
        }
        if (!priceList.length) {
            priceListFlag = false;
        }
        if (!scopeLst.length) {
            scopeLstFlag = false;
        }
        if (!floatUp) {
            floatUpFlag = false
        }
        if(Number(this.state.floatUp) <= Number(this.state.giveFoodCount)) {
            flag = false
        }
        if (!floatDown) {
            floatDownFlag = false
        }
        if(Number(this.state.floatDown) > Number(this.state.giveFoodCount)) {
            flag = false
        }

        this.setState({ giveFoodCountFlag, stageAmountFlag, priceListFlag, scopeLstFlag, floatUpFlag, floatDownFlag });
        flag = flag && stageAmountFlag && giveFoodCountFlag && priceListFlag && scopeLstFlag && floatUpFlag && floatDownFlag   
        if (flag) {
            const rule = {
                stageType,
                targetScope,
                stage: [
                    {
                        stageAmount,
                        giveFoodCount,
                        stageNum: 0,
                        stageType,
                        stageAmountFlag,
                        giveFoodCount,
                        floatUp,
                        floatDown,
                    },
                ],
            }
            let tempArr1 = [];
            let priceLst = priceList.map((price, i) => {
                if (tempArr1.indexOf(price.itemID) == -1) {
                    tempArr1.push(price.itemID);
                    return {
                        foodUnitID: price.itemID || price.foodUnitID ,
                        foodUnitCode: price.foodKey || price.foodUnitCode,
                        foodName: price.foodName,
                        foodUnitName: price.unit || price.foodUnitName,
                        brandID: price.brandID || '0',
                        price: price.price,
                        imagePath: price.imgePath || price.imagePath,
                        stageNo: 0,
                    }
                }
            });
            let scopeList = scopeLst.map((price, i) => {
                if (tempArr1.indexOf(price.itemID) == -1) {
                    tempArr1.push(price.itemID);
                    return {
                        scopeType: '2',
                        targetID: price.itemID || price.targetID,
                        brandID: price.brandID || '0',
                        targetCode: price.foodKey || price.targetCode,
                        targetName: price.foodName || price.targetName,
                        targetUnitName: price.unit || price.targetUnitName,
                    }
                }
            });
            priceLst = priceLst.filter((item) => { if (item) { return item } });
            scopeList = scopeList.filter((item) => { if (item) { return item } });
            const rule1 = JSON.stringify({ stageAmount, giveFoodCount, stageType, stageNum: 0, StageAmountFlag: true, floatDown, floatUp });
            const foodRuleList = [{
                priceList: priceLst,
                rule: rule1,
            }]
            this.props.setPromotionDetail({
                rule, priceLst: [], foodRuleList, scopeLst: scopeList
            });
            return true
        }
        return false
    };

    onFreeAmountChange(value, idx) {
        const { data } = this.state;
        let freeAmountFlag,
            freeAmount;
        if (value.number == null || value.number === '' || value.number > data[idx].stageAmount) {
            freeAmountFlag = false;
            freeAmount = value.number;
        } else {
            freeAmountFlag = true;
            freeAmount = value.number;
        }
        data[idx].freeAmount = freeAmount;
        data[idx].freeAmountFlag = freeAmountFlag
        this.setState({ data });
    }

    stageTypeChange = (e) => {
        this.setState({ stageType: e.target.value, })
    }



    renderActType = () => {
        return (
            <FormItem
                label={'活动方式'}
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                labelCol={{ span: 3, offset: 1 }}
                wrapperCol={{ span: 17, offset: 0 }}
                validateStatus={'success'}
            >
                <Radio.Group
                    onChange={this.stageTypeChange}
                    value={this.state.stageType}
                >
                    <Radio.Button value={2}>满赠</Radio.Button>
                    <Radio.Button value={1}>每满赠</Radio.Button>
                </Radio.Group>
            </FormItem>
        )
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    renderAdvancedSettingButton = () => {
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

    onPriceListChange = (value) => {
        this.setState({
            priceList: value,
            priceListFlag: value.length ? true : false,
        })
    }

    onScopeLstChange = (value) => {
        this.setState({
            scopeLst: value,
            scopeLstFlag: value.length ? true : false,
        });
    }

    renderActRule = () => {
        return (
            <FormItem
                label={'活动规则'}
                className={[styles.FormItemStyle, styles.actRuleForm].join(' ')}
                labelCol={{ span: 3, offset: 1 }}
                wrapperCol={{ span: 17, offset: 0 }}
                required={true}
                // validateStatus={item.rule.giveFoodCount == null || item.rule.giveFoodCount == '' ? 'error' : 'success'}
                validateStatus={'success'}
            >
                <div className={styles.grayLineDiv}>
                    <div className={styles.darkGrayDiv}>
                        <div className={styles.leftBox}>
                            <FormItem
                                label={'活动商品'}
                                required={true}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 8, offset: 0 }}
                                wrapperCol={{ span: 16, offset: 0 }}
                                validateStatus={!this.state.priceListFlag ? 'error' : 'success'}
                                help={this.state.priceListFlag ? null : '请选择商品'}
                            >
                                <ConnectedPriceListSelector
                                    key={1}
                                    priceList={this.state.priceList}
                                    singleDish={true}
                                    foodRuleList={this.state.foodRuleList}
                                    isShopMode={this.props.isShopFoodSelectorMode}
                                    onChange={(value) => { this.onPriceListChange(value) }}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.rightBox}>
                            <FormItem
                                label={this.state.stageType === 2 ? '参与条件消费满' : '消费每满'}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 10, offset: 0 }}
                                wrapperCol={{ span: 14, offset: 0 }}
                                validateStatus={this.state.stageAmountFlag == '' ? 'error' : 'success'}
                                help={this.state.stageAmountFlag ? null : '请输入大于0，整数5位以内且小数2位内的数'}
                            >
                                <Input key={2}
                                    addonAfter={'斤'}
                                    value={this.state.stageAmount}
                                    onChange={(value) => {
                                        this.onStageAmountChange(value);
                                    }}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.leftBox}>
                            <FormItem
                                label={'赠送商品'}
                                required={true}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 8, offset: 0 }}
                                wrapperCol={{ span: 16, offset: 0 }}
                                validateStatus={!this.state.scopeLstFlag ? 'error' : 'success'}
                                help={this.state.scopeLstFlag ? null : '请选择商品'}
                            >
                                <ConnectedPriceListSelector
                                    key={2}
                                    priceList={this.state.scopeLst}
                                    singleDish={true}
                                    foodRuleList={this.state.foodRuleList}
                                    isShopMode={this.props.isShopFoodSelectorMode}
                                    onChange={(value) => { this.onScopeLstChange(value) }}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.rightBox}>
                            <FormItem
                                label={'赠送数量'}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 5, offset: 1 }}
                                wrapperCol={{ span: 14, offset: 0 }}
                                validateStatus={this.state.giveFoodCountFlag == '' ? 'error' : 'success'}
                                help={this.state.giveFoodCountFlag ? Number(this.state.giveFoodCount) > Number(this.state.stageAmount) ? '赠送数量不能大于购买数量' : null : '请输入大于0，整数5位以内且小数2位内的数'}
                            >
                                <Input key={2}
                                    addonAfter={'斤'}
                                    value={this.state.giveFoodCount}
                                    onChange={(value) => {
                                        this.onGiveFoodCountChange(value);
                                    }}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.leftBox}>
                            <FormItem
                                label={'允许赠送范围'}
                                required={true}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 9, offset: 1 }}
                                wrapperCol={{ span: 14, offset: 0 }}
                                validateStatus={this.state.floatDownFlag == '' ? 'error' : 'success'}
                                help={this.state.floatDownFlag ? this.state.floatDown && (Number(this.state.floatDown) >= Number(this.state.giveFoodCount)) ? '赠送最小值需小于赠送数量' : null  : '请输入大于0，整数5位以内且小数2位内的数'}
                            >
                                <Input key={2}
                                    addonAfter={'斤'}
                                    value={this.state.floatDown}
                                    onChange={(value) => {
                                        this.onFloatDownChange(value);
                                    }}
                                />
                            </FormItem>
                        </div>
                        <div className={styles.rightBox}>
                            <FormItem
                                label={'至'}
                                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                labelCol={{ span: 3, offset: 1 }}
                                wrapperCol={{ span: 14, offset: 0 }}
                                validateStatus={this.state.floatUpFlag == '' ? 'error' : 'success'}
                                help={this.state.floatUpFlag ? this.state.floatUp && (Number(this.state.floatUp) <= Number(this.state.giveFoodCount)) ? '赠送最大值需大于赠送数量' : null : '请输入大于0，整数5位以内且小数2位内的数'}
                            >
                                <Input key={2}
                                    addonAfter={'斤'}
                                    value={this.state.floatUp}
                                    onChange={(value) => {
                                        this.onFloatUpChange(value);
                                    }}
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>
            </FormItem>
        )
    }

    onStageAmountChange = (e) => {
        let value = e.target.value
        let { stageAmount, stageAmountFlag, foodRuleList } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            stageAmountFlag = false;
            stageAmount = value;
        } else {
            stageAmountFlag = true;
            stageAmount = value;
        }
        this.setState({ stageAmount, stageAmountFlag });

    }

    onGiveFoodCountChange = (e) => {
        let value = e.target.value
        let { giveFoodCount, giveFoodCountFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            giveFoodCountFlag = false;
            giveFoodCount = value;
        } else {
            giveFoodCountFlag = true;
            giveFoodCount = value;
        }
        this.setState({ giveFoodCount, giveFoodCountFlag });
    }

    onFloatUpChange = (e, type) => {
        let value = e.target.value
        let { floatUp, floatUpFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            floatUpFlag = false;
            floatUp = value;
        } else {
            floatUpFlag = true;
            floatUp = value;
        }
        this.setState({ floatUp, floatUpFlag });
    }

    onFloatDownChange = (e, type) => {
        let value = e.target.value
        let { floatDown, floatDownFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            floatDownFlag = false;
            floatDown = value;
        } else {
            floatDownFlag = true;
            floatDown = value;
        }
        this.setState({ floatDown, floatDownFlag });
    }


    openTheDishModal = () => {

    }



    render() {
        const { ifMultiGrade, foodRuleList } = this.state;
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    {/* <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} /> */}
                    {/* {
                        ifMultiGrade ? null :
                            this.renderBuyDishNumInput()
                    }
                    {ifMultiGrade ?
                        foodRuleList.map((item, index) => {
                            return this.renderMultiGradeSelect(item, index)
                        })
                    :
                        this.renderDishsSelectionBox()
                    }
                    {ifMultiGrade ?
                        null
                    :
                        this.renderGiveDishNumInput()
                    } */}
                    {
                        this.renderActType()
                    }
                    {
                        this.renderActRule()
                    }
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting justUserSetting={true} payLimit={false} /> : null}
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
)(Form.create()(WeighBuyGiveDetailInfo));
