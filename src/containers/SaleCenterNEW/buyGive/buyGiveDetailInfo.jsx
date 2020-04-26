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
import { Row, Col, Form, Select, Radio, Input, InputNumber, Tooltip, Icon } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

@injectIntl()
class BuyGiveDetailInfo extends React.Component {
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
                            [
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
                            ],
            index: 'not-important',
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
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
        // 根据ruleJson填充页面
        this.setState({
            display,
            stageType: _rule.stageType ? _rule.stageType: 2,
            stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
            giveFoodCount: _rule.stage ? _rule.stage[0].giveFoodCount : '',
        }, () => {
            if(this.state.stageType == 2 || this.state.stageType == 1) {
                this.renderMultiGrade(false);
            } else {
                this.renderSingleGrade();
            }
        });     
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }
    initData = (data) => {
        data.map((item) => {
            item.rule = JSON.parse(item.rule);
            return item;
        })
        return data;
    }

    handleSubmit = () => {
        let { stageAmount, stageType, giveFoodCount, dishes, targetScope, stageAmountFlag, giveFoodCountFlag, dishsSelectStatus, foodRuleList } = this.state;
        let flag = 'success';
        if(stageType == 1 || stageType == 2){
            foodRuleList.forEach((item) => {
                if(!item.priceList.length) {
                    flag = 'error';
                }
                if(!item.rule.StageAmountFlag){
                    flag = 'error';
                }
                if(!item.rule.giveFoodCount){
                    flag = 'error';
                }
            })
        }else {
            if (stageAmount == null || stageAmount == '') {
                stageAmountFlag = false;
            }
            if (giveFoodCount == null || giveFoodCount == '') {
                giveFoodCountFlag = false;
            }
            if (dishes.length == 0) {
                dishsSelectStatus = 'error'
            }
            this.setState({ giveFoodCountFlag, stageAmountFlag, dishsSelectStatus });
            flag = stageAmountFlag && giveFoodCountFlag && dishsSelectStatus
        }
        if (flag == 'success') {
            const rule = {
                stageType,
                targetScope,
                stage: [
                    {
                        stageAmount,
                        giveFoodCount,
                    },
                ],
            }
            if(stageType == 1 || stageType == 2){
                //满的逻辑
                const { foodRuleList } = this.state;
                foodRuleList.map((item) => {
                    item.rule = JSON.stringify(item.rule);
                    return item;
                });
                this.props.setPromotionDetail({
                    rule, priceLst: [], foodRuleList,
                });
            }else {
                let tempArr1 = [];
                let priceLst = dishes.map((price) => {
                    if(tempArr1.indexOf(dish.itemID) == -1){
                        tempArr1.push(dish.itemID);
                        return {
                            foodUnitID: price.itemID,
                            foodUnitCode: price.foodKey,
                            foodName: price.foodName,
                            foodUnitName: price.unit,
                            brandID: price.brandID || '0',
                            price: price.price,
                            imagePath: price.imgePath,
                        }
                    }
                });
                priceLst = priceLst.filter((item) =>{if(item){ return item}})
                this.props.setPromotionDetail({
                    rule, priceLst,
                });
            }
            return true
        }
        return false
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    onStageAmountChange = (value, index) => {
        let { stageAmount, stageAmountFlag, foodRuleList } = this.state;
        if(index === 0 || index){
            //当是满的逻辑
            // 在这会加上每个档位对于这个stageAmount的flag的判断加上新的判断flag整理数据的时候加上
            foodRuleList[index].stageAmountFlag = true;
            foodRuleList[index].rule.stageAmount = value.number;
            if(index == foodRuleList.length-1) {
                if(index == 0){
                    if(!+value.number || +value.number <= 0 ){
                        foodRuleList[index].rule.StageAmountFlag = false;
                    }else {
                        foodRuleList[index].rule.StageAmountFlag = true;
                    }
                }else if(index > 1){
                    //在这种情况下index为2
                    for(let i = index; i > 0; i-- ) {
                        if(+foodRuleList[i-1].rule.stageAmount >= +foodRuleList[i].rule.stageAmount) {
                            foodRuleList[i].rule.StageAmountFlag = false;
                            foodRuleList[i-1].rule.StageAmountFlag = false;
                        } else {
                            foodRuleList[i].rule.StageAmountFlag = true;
                            foodRuleList[i-1].rule.StageAmountFlag = true;
                        }
                    }
                }else {
                    //在这种情况下index为1
                    if(+foodRuleList[index-1].rule.stageAmount >= +value.number){
                        foodRuleList[index].rule.StageAmountFlag = false;
                        foodRuleList[index-1].rule.StageAmountFlag = false;
                    }else {
                        foodRuleList[index-1].rule.StageAmountFlag = true;
                        foodRuleList[index].rule.StageAmountFlag = true;
                    }
                }
                if(!+value.number || +value.number <= 0 ){
                    foodRuleList[index].rule.StageAmountFlag = false;
                }
            }else {
                    for(let i = foodRuleList.length-1; i > 0; i-- ) {
                        if(+foodRuleList[i-1].rule.stageAmount >= +foodRuleList[i].rule.stageAmount) {
                            foodRuleList[i].rule.StageAmountFlag = false;
                            foodRuleList[i-1].rule.StageAmountFlag = false;
                        } else {
                            foodRuleList[i].rule.StageAmountFlag = true;
                            foodRuleList[i-1].rule.StageAmountFlag = true;
                        }
                    }
                    if(!+value.number || +value.number <= 0 ){
                        foodRuleList[index].rule.StageAmountFlag = false;
                    }
            }
            this.setState({
                foodRuleList,
            })
        }else {
            //当不是满的逻辑
            if (value.number == null || value.number == '') {
                stageAmountFlag = false;
                stageAmount = value.number;
            } else {
                stageAmountFlag = true;
                stageAmount = value.number;
            }
            this.setState({ stageAmount, stageAmountFlag });
        }
        
    }
    handleStageTypeChange = (value, index) => {
        //这边不传index 的意思是无论如何 index都为0，因为变动了类型的时候，以为着多档 单档切换了，所以无论什么时候index都是0
        if(Number(value) == 2 || Number(value) == 1) {
            this.renderMultiGrade(true, value);
        } else {
            this.renderSingleGrade();
        }
        this.setState({ stageType: Number(value) });
    }

    onGiveFoodCountChange(value, index) {
        let { giveFoodCount, giveFoodCountFlag, foodRuleList } = this.state;
        if(index === 0 || index){
            //当是满的逻辑
            foodRuleList[index].rule.giveFoodCount = value.number;
            this.setState({
                foodRuleList,
            })
        }else {
            if (value.number == null || value.number == '') {
                giveFoodCountFlag = false;
                giveFoodCount = value.number;
            } else {
                giveFoodCountFlag = true;
                giveFoodCount = value.number;
            }
            this.setState({ giveFoodCount, giveFoodCountFlag });
        }
        
    }
    renderMultiGrade = (ifNotMount, type) => {
        //更改所有相关数据为数组
        this.setState({
            ifMultiGrade: true,
        })
        if(ifNotMount) {
            this.setState({
                foodRuleList: [
                    {
                        rule: {
                            stageAmount: '',
                            giveFoodCount: '',
                            stageType: type,
                            stageNum: 0,
                        },
                        priceList: [],
                        scopeList: [],
                    }
                ]
            })
        }
    }
    renderSingleGrade = () => {
        this.setState({
            ifMultiGrade: false,
        })
    }

    addGrade = () => {
        let { foodRuleList } = this.state;
        let index = foodRuleList.length;
        foodRuleList.push({
            rule: {
                stageAmount: '',
                giveFoodCount: '',
                stageType: foodRuleList[0].rule.stageType,
                stageNum: index,
            },
            priceList: [],
            scopeList: [],
        })
        this.setState({
            foodRuleList,
        })
    }

    deleteGrade = (e, index) => {
        let { foodRuleList } = this.state;
        foodRuleList.splice(index, 1);
        this.setState({
            foodRuleList,
        })
    }

    renderBuyDishNumInput = (item, index) => {
        //指定菜品
        const { intl } = this.props;
        const { ifMultiGrade, foodRuleList } = this.state;
        let singleAdd, bothIcon, singleDelete;  
        singleAdd = index == 0 && foodRuleList.length == 1;
        bothIcon = index != 0 && index == foodRuleList.length - 1;
        singleDelete = index < 4 && index != foodRuleList.length - 1 || index == 4 && index == foodRuleList.length - 1;
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const k5hlxzmq = intl.formatMessage(SALE_STRING.k5hlxzmq);
        const k5hlxzv2 = intl.formatMessage(SALE_STRING.k5hlxzv2);
        const RULE_TYPE = [
            {
                value: '2',
                label: k5ez4pvb,
            },
            {
                value: '4',
                label: k5ez4qew,
            },
            {
                value: '1',
                label: k5hlxzmq,
            },
            {
                value: '3',
                label: k5hlxzv2,
            },
        ]
        if(typeof item.rule == 'string') {
            item.rule = JSON.parse(item.rule);
        }
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={ifMultiGrade ? item.rule.stageAmount == null || item.rule.stageAmount == '' || !foodRuleList[index].rule.stageAmountFlag ? 'success' : 'error' :this.state.stageAmountFlag ? 'success' : 'error'}
                help={ifMultiGrade ? foodRuleList[index]? foodRuleList[index].rule.StageAmountFlag ? null : `需大于0并且后面的档位需大于之前档位` : null : this.state.stageAmount ? null : `需大于0`}
            >
                <PriceInput key={2}
                    addonBefore={<Select size="default"
                                        onChange={
                                            (value) => {
                                                this.handleStageTypeChange(value);
                                            }}
                                        value={ifMultiGrade ? `${item.rule.stageType}`:`${this.state.stageType}`}
                                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            RULE_TYPE.map((item) => {
                                return (<Option key={item.value} value={item.value}>{item.label}</Option>)
                            })
                        }
                    </Select>}
                    addonAfter={'份'}
                    value={{ number: ifMultiGrade ? item.rule.stageAmount : this.state.stageAmount }}
                    defaultValue={{ number: ifMultiGrade ? item.rule.stageAmount : this.state.stageAmount  }}
                    onChange={(value) => {
                        this.onStageAmountChange(value, index);
                    }}
                    modal="int"
                /> 
                <span className={[styles.gTip, styles.gTipInLine].join(' ')}>&nbsp;</span>
                {
                    ifMultiGrade ? 
                        singleAdd ? 
                            <span className={styles.operateIcon}><Icon className={styles.addIconGrade} onClick={this.addGrade}  type="plus-circle-o" /></span> :
                                singleDelete ? <span className={styles.operateIcon}><Icon className={styles.minIconGrade} onClick={(value) => {this.deleteGrade(value, index)}} type="minus-circle-o" /></span> :
                                <span className={styles.operateIcon}><Icon className={styles.addIconGrade} onClick={this.addGrade} type="plus-circle-o" /> <Icon className={styles.minIconGrade} type="minus-circle-o" onClick={(value) => {this.deleteGrade(value, index)}} /></span> : null
                }
                {
                    ifMultiGrade ? 
                        <span className={styles.GradeStyle}>{`档位${index ? index+1 : 1}`}</span> 
                        : null
                }
            </FormItem>
        )
    }

    renderGiveDishNumInput = (wapper, item, index) => {
        //菜品赠送数量
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const { ifMultiGrade } = this.state;
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: wapper ? wapper : 17, offset: wapper ? 5 : 4 }}
                required={true}
                validateStatus={ifMultiGrade ? item.rule.giveFoodCount == null || item.rule.giveFoodCount == '' ? 'error' : 'success' : this.state.giveFoodCountFlag ? 'success' : 'error'}
            >
                <Tooltip title={wapper ? SALE_LABEL.k5hly0k2 : ''}>
                    <PriceInput
                        addonBefore={SALE_LABEL.k5hly03e}
                        addonAfter={k5ez4qy4}
                        value={{ number: ifMultiGrade ? `${item.rule.giveFoodCount ? item.rule.giveFoodCount : ''}`:this.state.giveFoodCount }}
                        defaultValue={{ number: ifMultiGrade ? `${item.rule.giveFoodCount}`:this.state.giveFoodCount }}
                        onChange={(value) => {
                            this.onGiveFoodCountChange(value, index);
                        }}
                        modal="int"
                    />
                </Tooltip>
                {
                    wapper ? null :
                    <span className={[styles.gTip, styles.gTipInLine].join(' ')}>{SALE_LABEL.k5hly0k2}</span>
                }
            </FormItem>
        )
    }

    renderDishsSelectionBox(wapper, item, index) {
        //赠送菜品
        const { ifMultiGrade } = this.state;
        return (
            <FormItem
                label={SALE_LABEL.k5hly0bq}
                className={styles.FormItemStyle}
                labelCol={{ span: wapper ? 3 : 4,  offset: wapper ? 1 : 0}}
                wrapperCol={{ span: wapper ? wapper : 17, offset: wapper ? 1 : 0}}
                required={true}
                validateStatus={ifMultiGrade ? item.priceList.length ? 'success' : 'error' : this.state.dishsSelectStatus ? 'success' : 'error'}
                help={ifMultiGrade ? item.priceList.length ? null : SALE_LABEL.k5hkj1ef  :this.state.dishsSelectStatus == 'success' ? null : SALE_LABEL.k5hkj1ef}
            >
                <ConnectedPriceListSelector foodRuleList={this.state.foodRuleList} isShopMode={this.props.isShopFoodSelectorMode} onChange={(value) => {this.onDishesChange(value, index)}} index={index} />
            </FormItem>
        )
    }
    onDishesChange = (value, index) => {
        let { ifMultiGrade, foodRuleList } = this.state;
        if (ifMultiGrade) {
            //当时满时走的逻辑
            foodRuleList[index].priceList = [...value];
            this.setState({
                foodRuleList,
            })
        } else {
            this.setState({
                dishes: [...value],
                dishsSelectStatus: value.length > 0 ? 'success' : 'error',
            });
        }
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

    renderMultiGradeSelect = (item, index) => {
        return (
            <div className={styles.dangStyle}>
                {this.renderBuyDishNumInput(item,index)}
                <div className={styles.MultiGradeBorder}>
                    {this.renderDishsSelectionBox(17, item, index)}
                    {this.renderGiveDishNumInput(17, item, index)}
                </div>
            </div>
        )
    }


    render() {
        const { ifMultiGrade, foodRuleList } = this.state;
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    {
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
                    }
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
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
)(Form.create()(BuyGiveDetailInfo));
