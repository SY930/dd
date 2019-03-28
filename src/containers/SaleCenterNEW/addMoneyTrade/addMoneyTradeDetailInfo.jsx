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
import {
    Form,
    Select,
    Radio,
} from 'antd';
import { connect } from 'react-redux'
import PriceInput from '../common/PriceInput';

const RadioGroup = Radio.Group;


import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import EditBoxForDishes from '../common/EditBoxForDishes';


import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'

class AddfreeAmountTradeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            foodMenuList: [],
            previousRuleType: null, // 妥协后端奇妙的数据结构
            foodCategoryCollection: [],
            freeAmount: '',
            stageAmount: '',
            stageCount: '',
            stageType: 2,
            dishes: [],
            freeAmountFlag: true,
            stageCountFlag: true,
            stageAmountFlag: true,
            dishsSelectionFlag: true,
            ruleType: '0',
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onStageCountChange = this.onStageCountChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.ruleTypeChange = this.ruleTypeChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        if (this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized'])) {
            const foodMenuList = this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;

            this.setState({
                foodMenuList,
            })
        }
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        const display = !this.props.isNew;
        let ruleType = _scopeLst.size > 0 ? 1 : 0;
        if (Number(_rule.stageStyle) === 1) {
            ruleType += 2;
        }
        // 根据ruleJson填充页面
        this.setState({
            display,
            stageType: _rule.stageType || 2,
            stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
            stageCount: _rule.stage ? _rule.stage[0].stageCount: '',
            freeAmount: _rule.stage ? _rule.stage[0].freeAmount : '',
            //ruleType: _scopeLst.size > 0 ? '1' : '0',
            ruleType: String(ruleType)
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
        nextProps.promotionDetailInfo.getIn(['$foodCategoryListInfo', 'initialized'])) {
            this.setState({
                foodMenuList: nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records,
                foodCategoryCollection: nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS(),
            })
        }

        if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).size > 0) {
            const foodMenuList = nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;
            const _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) ?
                nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [];
            const _dish = [];
            _priceLst.map((price) => {
                foodMenuList.map((food) => {
                    // if(food.foodKey === price.foodUnitCode){不唯一，一个菜会匹配多次，添加多次
                    if (food.itemID == price.foodUnitID) { // foodUnitID就是由itemID转换
                        _dish.push(food)
                    }
                });
            });
            _dish.map(((item) => {
                item.id = item.foodID;
                item.content = item.foodName;
            }));
            this.setState({
                foodMenuList,
                dishes: _dish,
            });
        }
    }

    handleSubmit() {
        let { stageAmount, stageType, stageCount, dishes, stageCountFlag, stageAmountFlag, foodMenuList, freeAmount, freeAmountFlag, dishsSelectionFlag, ruleType } = this.state;
        if (stageAmount == null || stageAmount == '') {
            stageAmountFlag = false;
        }
        if (stageCount == null || stageCount == '') {
            stageCountFlag = false;
        }
        if (freeAmount == null || freeAmount == '') {
            freeAmountFlag = false;
        }
        if (dishes.length == 0) {
            dishsSelectionFlag = false;
        }
        this.setState({ freeAmountFlag, stageAmountFlag, stageCountFlag, dishsSelectionFlag });

        if (((stageType == 2 && stageAmountFlag) || (stageType == 1 && stageCountFlag)) && freeAmountFlag && dishsSelectionFlag) {
            const rule = {
                stageType,
                stageStyle: Number(ruleType) > 1 ? 1 : 2, // 1 每满XX加价（可加N次）  2 满XX加价（加1次）
                stage: [
                    {
                        stageCount: stageCount || 0,
                        stageAmount: stageAmount || 0,
                        freeAmount,
                    },
                ],
            }
            const priceLst = dishes.map((price) => {
                return {
                    foodUnitID: price.itemID,
                    foodUnitCode: price.foodKey,
                    foodName: price.foodName,
                    foodUnitName: price.unit,
                    brandID: price.brandID || '0',
                    price: price.price,
                }
            });
            if (ruleType == '0' || ruleType == '2') {
                this.props.setPromotionDetail({
                    rule,
                    priceLst,
                    scopeLst: [],
                    dishes: [],
                    excludeDishes: [],
                    foodCategory: [],
                });
            } else {
                this.props.setPromotionDetail({
                    rule, priceLst,
                });
            }
            return true
        }
        const errElement = document.querySelector('.ant-form-explain');
        errElement && errElement.scrollIntoView(false);
        return false
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    onRadioChange(event) {
        const stageType = Number(event.target.value);
        const previousRuleType = this.state.previousRuleType;
        const ruleType = this.state.ruleType;
        if (previousRuleType !== null) {
            this.setState({stageType, ruleType: previousRuleType, previousRuleType: ruleType});
        } else {
            this.setState({stageType, ruleType: '0', previousRuleType: ruleType});
        }

    }
    // 减免金额
    onStageAmountChange(value) {
        let { stageAmount, stageAmountFlag } = this.state;
        if (value.number == null || value.number == '') {
            stageAmountFlag = false;
            stageAmount = value.number;
        } else {
            stageAmountFlag = true;
            stageAmount = value.number;
        }
        this.setState({ stageAmount, stageAmountFlag });
    }

    // 减免数量
    onStageCountChange(value) {
        let { stageCount, stageCountFlag } = this.state;
        if (value.number == null || value.number == '') {
            stageCountFlag = false;
            stageCount = value.number;
        } else {
            stageCountFlag = true;
            stageCount = value.number;
        }
        this.setState({ stageCount, stageCountFlag });
    }
    // 满金额
    handleFreeAmountChange(value) {
        let { freeAmount, freeAmountFlag } = this.state;
        if (value.number == null || value.number == '') {
            freeAmountFlag = false;
            freeAmount = value.number;
        } else {
            freeAmountFlag = true;
            freeAmount = value.number;
        }
        this.setState({ freeAmount, freeAmountFlag });
    }

    renderBuyDishNumInput() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.freeAmountFlag ? 'success' : 'error'}
                help={this.state.freeAmountFlag ? null : '请输入加价金额'}
            >
                <PriceInput
                    addonBefore={'加价'}
                    addonAfter={'元'}
                    value={{ number: this.state.freeAmount }}
                    defaultValue={{ number: this.state.freeAmount }}
                    onChange={this.handleFreeAmountChange}
                    modal="float"
                />
            </FormItem>
        )
    }

    renderDishsSelectionBox() {
        return (

            <FormItem
                label="换购菜品"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={true}
                validateStatus={this.state.dishsSelectionFlag ? 'success' : 'error'}
                help={this.state.dishsSelectionFlag ? null : '请选择换购菜品'}
            >
                {
                    this.props.isShopFoodSelectorMode ? (
                        <EditBoxForDishes
                            type='1070'
                            onChange={(value) => {
                                this.onDishesChange(value);
                            }}
                        />
                    ) : (
                        <ConnectedPriceListSelector
                            onChange={(value) => {
                                this.onDishesChange(value);
                            }}
                        />
                    )
                }        
            </FormItem>
        )
    }
    // 换购菜品onchange
    onDishesChange(value) {
        let { dishes } = this.state;
        dishes = value;
        this.setState({
            dishes,
            dishsSelectionFlag: value.length != 0,
        });
    }

    renderAdvancedSettingButton() {
        return (

            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }

    ruleTypeChange(val) {
        this.setState({ ruleType: val })
    }

    render() {
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <FormItem
                        label="活动方式"
                        required={true}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <p>
                            任意或指定消费满一定金额或数量后，再加价一定金额即可换购指定菜品
                        </p>
                        <RadioGroup onChange={this.onRadioChange} value={this.state.stageType}>
                            <Radio key={'2'} value={2}>{'按金额'}</Radio>
                            <Radio key={'1'} value={1}>{'按数量'}</Radio>
                        </RadioGroup>
                    </FormItem>
                    {this.state.stageType == 2 ?
                    <FormItem
                        className={[styles.FormItemStyle, styles.explainBack].join(' ')}
                        wrapperCol={{ span: 17, offset: 4 }}
                        validateStatus={this.state.stageAmountFlag ? 'success' : 'error'}
                        help={this.state.stageAmountFlag ? null : '请输入消费金额'}
                    >
                        <PriceInput
                            addonBefore={
                                <Select size="default"
                                        onChange={this.ruleTypeChange}
                                        value={this.state.ruleType}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option key="0" value="0">任意消费满</Option>
                                    <Option key="2" value="2">任意消费每满</Option>
                                    <Option key="1" value="1">活动菜品消费满</Option>
                                    <Option key="3" value="3">活动菜品消费每满</Option>
                                </Select>
                            }
                            addonAfter={'元'}
                            value={{ number: this.state.stageAmount }}
                            defaultValue={{ number: this.state.stageAmount }}
                            onChange={this.onStageAmountChange}
                            modal="int"
                        />
                    </FormItem> :
                    <FormItem
                        className={[styles.FormItemStyle, styles.explainBack].join(' ')}
                        wrapperCol={{ span: 17, offset: 4 }}
                        validateStatus={this.state.stageCountFlag ? 'success' : 'error'}
                        help={this.state.stageCountFlag ? null : '请输入菜品数量'}>
                        <PriceInput
                            addonBefore={
                                <Select size="default"
                                        onChange={this.ruleTypeChange}
                                        value={this.state.ruleType}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option key="0" value="0">任意菜品数量满</Option>
                                    <Option key="2" value="2">任意菜品数量每满</Option>
                                    <Option key="1" value="1">活动菜品数量满</Option>
                                    <Option key="3" value="3">活动菜品数量每满</Option>
                                </Select>
                            }
                            addonAfter={'份'}
                            value={{ number: this.state.stageCount }}
                            defaultValue={{ number: this.state.stageCount }}
                            onChange={this.onStageCountChange}
                            modal="int"
                        />
                    </FormItem>
                    }
                    {
                        this.state.ruleType == '0' || this.state.ruleType == '2' ?
                            null :
                            this.props.isShopFoodSelectorMode ? <PromotionDetailSetting /> :
                            <ConnectedScopeListSelector/>
                    }
                    {this.renderBuyDishNumInput()}
                    {this.renderDishsSelectionBox()}
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
)(Form.create()(AddfreeAmountTradeDetailInfo));
