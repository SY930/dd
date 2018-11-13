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
import { Row, Col, Form, Select, Radio, Input, InputNumber } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import RangeInput from '../../../containers/SaleCenterNEW/common/RangeInput';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import EditBoxForDishes from '../common/EditBoxForDishes';

import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';


const RULE_TYPE = [
    {
        value: '2',
        label: '购买指定菜品满',
    },
    {
        value: '1',
        label: '购买当前菜品满',
    }
]

class BuyGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            foodMenuList: [],
            foodCategoryCollection: [],
            // TODO:存到state中了，页面中需要用到defaultValue的地方现在都是state代替的，要换成redux中的数据
            stageAmount: '',
            giveFoodCount: '',
            dishes: [],
            targetScope: 0,
            stageAmountFlag: true,
            stageType: 2,
            giveFoodCountFlag: true,
            dishsSelectStatus: 'success',
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderGiveDishNumInput = this.renderGiveDishNumInput.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.handleStageTypeChange = this.handleStageTypeChange.bind(this);
        this.onGiveFoodCountChange = this.onGiveFoodCountChange.bind(this);
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
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
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

    handleSubmit = () => {
        let { stageAmount, stageType, giveFoodCount, dishes, targetScope, stageAmountFlag, giveFoodCountFlag, dishsSelectStatus, foodMenuList } = this.state;
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

        if (stageAmountFlag && giveFoodCountFlag && dishsSelectStatus == 'success') {
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

            const dish = dishes.map((dish) => {
                return foodMenuList.find((menu) => {
                    // return dish.id === menu.foodID不唯一
                    return dish.itemID == menu.itemID
                })
            });
            const priceLst = dish.map((price) => {
                return {
                    foodUnitID: price.itemID,
                    foodUnitCode: price.foodKey,
                    foodName: price.foodName,
                    foodUnitName: price.unit,
                    price: price.price,
                }
            });
            this.props.setPromotionDetail({
                rule, priceLst,
            });
            return true
        }
        return false
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
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
    handleStageTypeChange(value) {
        this.setState({ stageType: Number(value) });
    }

    onGiveFoodCountChange(value) {
        let { giveFoodCount, giveFoodCountFlag } = this.state;
        if (value.number == null || value.number == '') {
            giveFoodCountFlag = false;
            giveFoodCount = value.number;
        } else {
            giveFoodCountFlag = true;
            giveFoodCount = value.number;
        }
        this.setState({ giveFoodCount, giveFoodCountFlag });
    }

    renderBuyDishNumInput() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.stageAmountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={<Select size="default"
                                         onChange={this.handleStageTypeChange}
                                         value={`${this.state.stageType}`}
                                         getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            RULE_TYPE.map((item) => {
                                return (<Option key={item.value} value={item.value}>{item.label}</Option>)
                            })
                        }
                    </Select>}
                    addonAfter={'份'}
                    value={{ number: this.state.stageAmount }}
                    defaultValue={{ number: this.state.stageAmount }}
                    onChange={this.onStageAmountChange}
                    modal="int"
                />
                <span className={[styles.gTip, styles.gTipInLine].join(' ')}>表示购买菜品的总数，如输入2，代表所有菜品任意购买满2份</span>
            </FormItem>
        )
    }

    renderGiveDishNumInput() {
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.giveFoodCountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={'菜品赠送数量'}
                    addonAfter={'份'}
                    value={{ number: this.state.giveFoodCount }}
                    defaultValue={{ number: this.state.giveFoodCount }}
                    onChange={this.onGiveFoodCountChange}
                    modal="int"
                />
                <span className={[styles.gTip, styles.gTipInLine].join(' ')}>表示赠送菜品的总数，如输入2，代表所有赠送菜品任选，共赠送2份</span>
            </FormItem>
        )
    }

    renderDishsSelectionBox() {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem
                label="赠送菜品"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={true}
                validateStatus={this.state.dishsSelectStatus}
                help={this.state.dishsSelectStatus == 'success' ? null : '赠送菜品不可为空'}
            >
                <EditBoxForDishes onChange={(value) => {
                    this.onDishesChange(value);
                }}
                />
            </FormItem>
        )
    }
    onDishesChange(value) {
        // console.log(value)
        let { dishes } = this.state;
        dishes = value;
        this.setState({
            dishes,
            dishsSelectStatus: value.length > 0 ? 'success' : 'error',
        }, () => {
            // console.log(this.state.dishsSelectStatus)
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


    render() {
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <PromotionDetailSetting />
                    {this.renderBuyDishNumInput()}
                    {this.renderDishsSelectionBox()}
                    {this.renderGiveDishNumInput()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(BuyGiveDetailInfo));
