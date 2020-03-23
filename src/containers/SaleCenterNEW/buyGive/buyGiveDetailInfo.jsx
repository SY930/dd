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
                    imagePath: price.imgePath,
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

    renderBuyDishNumInput = () => {
        const { intl } = this.props;
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

    renderGiveDishNumInput = () => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        return (
            <FormItem
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                wrapperCol={{ span: 17, offset: 4 }}
                required={true}
                validateStatus={this.state.giveFoodCountFlag ? 'success' : 'error'}
            >

                <PriceInput
                    addonBefore={SALE_LABEL.k5hly03e}
                    addonAfter={k5ez4qy4}
                    value={{ number: this.state.giveFoodCount }}
                    defaultValue={{ number: this.state.giveFoodCount }}
                    onChange={this.onGiveFoodCountChange}
                    modal="int"
                />
    <span className={[styles.gTip, styles.gTipInLine].join(' ')}>{SALE_LABEL.k5hly0k2}</span>
            </FormItem>
        )
    }

    renderDishsSelectionBox() {
        return (
            <FormItem
                label={SALE_LABEL.k5hly0bq}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={true}
                validateStatus={this.state.dishsSelectStatus}
                help={this.state.dishsSelectStatus == 'success' ? null : SALE_LABEL.k5hkj1ef}
            >
                <ConnectedPriceListSelector isShopMode={this.props.isShopFoodSelectorMode} onChange={this.onDishesChange} />
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
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }


    render() {
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
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
