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

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const Immutable = require('immutable');

import EditBoxForDishes from '../common/EditBoxForDishes';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'

const RULE_TYPE = [
    {
        value: '2',
        label: '购买指定菜品满',
    },
    {
        value: '4',
        label: '购买指定菜品每满',
    },
    {
        value: '1',
        label: '购买同一菜品满',
    },
    {
        value: '3',
        label: '购买同一菜品每满',
    },
]

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
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
        nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }

    handleSubmit = () => {
        let { stageAmount, stageType, giveFoodCount, dishes, targetScope, stageAmountFlag, giveFoodCountFlag, dishsSelectStatus } = this.state;
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
                <span className={[styles.gTip, styles.gTipInLine].join(' ')}>&nbsp;</span>
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
                {
                    this.props.isShopFoodSelectorMode ? (
                        <EditBoxForDishes onChange={this.onDishesChange} />
                    ) : (
                        <ConnectedPriceListSelector onChange={this.onDishesChange} />
                    )
                }
                
            </FormItem>
        )
    }
    onDishesChange = (value) => {
        this.setState({
            dishes: [...value],
            dishsSelectStatus: value.length > 0 ? 'success' : 'error',
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
                    {
                        this.props.isShopFoodSelectorMode ? <PromotionDetailSetting /> :
                        <ConnectedScopeListSelector/>
                    }
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
