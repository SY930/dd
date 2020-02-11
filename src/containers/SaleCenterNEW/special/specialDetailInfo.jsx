/**
 * @Author: chenshuang
 * @Date:   2017-04-01T10:37:50+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:57:47+08:00
 */


/*
 update by Cs on 2017/03/02 。 添加特价
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, message, Icon } from 'antd';
import { connect } from 'react-redux'
import Immutable from 'immutable';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import SpecialDishesTableWithoutBrand from './SpecialDishesTableWithoutBrand'; // 表格
import SpecialDishesTableWithBrand from './SpecialDishesTableWithBrand';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from "../common/PriceInput";
@injectIntl()
class SpecialDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        const {
            isLimited,
            amountLimit,
            totalAmountLimit,
            isTotalLimited,
            isCustomerUseCountLimited,
            customerUseCountLimit,
            shortRule,
        } = this.getInitState()
        this.state = {
            display: !props.isNew,
            selections: [],
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
            data: [],
            amountLimit, // 特价菜同一菜品使用数量限制, 默认为1份, int, > 0
            isLimited, // 同一菜品是否限制 0 为不限制使用数量, 1为限制
            totalAmountLimit, // 特价菜全部菜品使用数量限制, 默认为1份, int, > 0
            isTotalLimited, // 特价菜全部菜品是否限制 0 为不限制使用数量, 1为限制
            customerUseCountLimit, // 特价菜每人每天享受特价数量限制, 默认为1份, int, > 0
            isCustomerUseCountLimited, // 特价菜每人每天享受特价数量是否限制 0 为不限制使用数量, 1为限制
            shortRule,
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
        this.handleIsLimitedChange = this.handleIsLimitedChange.bind(this);
        this.handleAmountLimitChange = this.handleAmountLimitChange.bind(this);
        this.handleIsTotalLimitedChange = this.handleIsTotalLimitedChange.bind(this);
        this.handleTotalAmountLimitChange = this.handleTotalAmountLimitChange.bind(this);
        this.dishesChange = this.dishesChange.bind(this);
    }

    getInitState() {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        const amountLimit = _rule ? Number(_rule.specialFoodMax) : 0;
        const totalAmountLimit = _rule ? Number(_rule.totalFoodMax) : 0;
        const customerUseCountLimit = _rule ? Number(_rule.customerUseCountLimit) : 0;
        const shortRule = _rule ? Number(_rule.shortRule) : 0;
        return {
            isLimited: Number(!!amountLimit),
            amountLimit: amountLimit || 1,
            isTotalLimited: Number(!!totalAmountLimit),
            totalAmountLimit: totalAmountLimit || 1,
            isCustomerUseCountLimited: Number(!!customerUseCountLimit),
            customerUseCountLimit: customerUseCountLimit || 1,
            shortRule: shortRule || 0,
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }
    handleSubmit = (cbFn) => {
        const {
            data,
            isLimited,
            amountLimit,
            isTotalLimited,
            totalAmountLimit,
            isCustomerUseCountLimited,
            customerUseCountLimit,
            shortRule,
        } = this.state;
        const priceLst = data.map((item) => {
            return {
                foodUnitID: item.itemID,
                foodUnitCode: item.foodKey,
                foodName: item.foodName,
                foodUnitName: item.unit,
                brandID: item.brandID || 0,
                price: parseFloat(item.newPrice) < 0 ?  item.price : parseFloat(item.newPrice),
            }
        });
        if (isLimited == 1 && !amountLimit) {
            return false;
        }
        if (isCustomerUseCountLimited == 1 && !(customerUseCountLimit > 0)) {
            return 0;
        }

        if (isTotalLimited == 1 && !(totalAmountLimit > 0)) {
            return false;
        }
        if (isTotalLimited == 1 && isLimited == 1) {
            if (+totalAmountLimit < amountLimit) return false;
        }
        if (priceLst.length === 0) {
            message.warning(SALE_LABEL.k6hdpu19);
            return false;
        }
        const rule = {};
        if (isLimited == 1 && amountLimit) {
            rule.specialFoodMax = amountLimit;
        } else {
            rule.specialFoodMax = 0;
        }
        if (isTotalLimited == 1) {
            rule.shortRule = shortRule;
        }
        if (isTotalLimited == 1 && totalAmountLimit) {
            rule.totalFoodMax = totalAmountLimit;
        } else {
            rule.totalFoodMax = 0;
        }
        console.log('promotiontype is ' + this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType);
        if (isCustomerUseCountLimited == 1 && customerUseCountLimit > 0 && (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '3010' || this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '1010')) {
            rule.customerUseCountLimit = customerUseCountLimit;
        } else {
            if(this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '3010' || this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '1010'){
                rule.customerUseCountLimit = 0;
            }
        }
        this.props.setPromotionDetail({
            priceLst,
            rule, // 为黑白名单而设
        });
        return true;
    };

    onChangeClick() {
        this.setState(
            { display: !this.state.display }
        )
    }
    dishesChange(val) {
        val.forEach(item => {
            if (Number(item.newPrice) === 0) {
                item.newPrice = 0;
            } else if (item.newPrice === -1) {
                item.newPrice = item.price
            }
        });
        this.setState({
            data: val,
        })
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

    handleIsLimitedChange(value) {
        this.setState({isLimited: value})
    }

    handleAmountLimitChange(value) {
        this.setState({amountLimit: value.number})
    }
    handleIsTotalLimitedChange(value) {
        this.setState({isTotalLimited: value})
    }
    handleTotalAmountLimitChange(value) {
        this.setState({totalAmountLimit: value.number})
    }
    handleIsCustomUseCountLimitedChange = (value) => {
        this.setState({isCustomerUseCountLimited: value})
        if(value == 0) {
            this.props.setPromotionDetail({
                customerUseCountLimit: 0,
            })
        }else{
            this.props.setPromotionDetail({
                customerUseCountLimit: 1,
            })
        }
    }
    handleCustomerUseCountLimitChange = (value) => {
        this.setState({customerUseCountLimit: value.number})
        this.props.setPromotionDetail({
            customerUseCountLimit: value.number,
        });
    }

    getTotalAmountValidation = () => {
        const { intl } = this.props;
        const k5f4b1b9 = intl.formatMessage(SALE_STRING.k5f4b1b9);
        const {
            isLimited,
            isTotalLimited,
            amountLimit,
            totalAmountLimit,
        } = this.state;
        if (!(totalAmountLimit > 0)) {
            return {
                status: 'error',
                message: k5f4b1b9
            }
        }
        if (isLimited == 1 && isTotalLimited == 1) {
            if (amountLimit > 0 && totalAmountLimit > 0 && +amountLimit > totalAmountLimit) {
                return {
                    status: 'error',
                message: <p style={{whiteSpace: 'nowrap'}}>{SALE_LABEL.k6hdpu9l}</p>
                }
            }
        }
        return {
            status: 'success',
            message: null
        }
    }
    handleShortRule = (value) => {
        this.setState({
            shortRule: value.target.value,
        })
    }
    renderLimitRules() {
        const { intl } = this.props;
        const k6hdpuyl = intl.formatMessage(SALE_STRING.k6hdpuyl);
        const k5kp4vhr = intl.formatMessage(SALE_STRING.k5kp4vhr);
        const k5f4b1b9 = intl.formatMessage(SALE_STRING.k5f4b1b9);
        return (
            <div>
                <div style={{ color: 'rgba(0,0,0,0.85)'}} className={styles.coloredBorderedLabel}>
                    {SALE_LABEL.k6hdpuhx}
                </div>
                <div style={{height: '40px', paddingLeft: 35, marginTop: '8px'}} className={styles.flexContainer}>
                    <div style={{lineHeight: '28px', marginRight: '14px'}}>
                        {SALE_LABEL.k6hdpuq9}
                    </div>
                    <div style={{width: '400px'}}>
                        <Col  span={this.state.isLimited == 0 ? 24 : 12}>
                            <Select onChange={this.handleIsLimitedChange}
                                    value={String(this.state.isLimited)}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value={'0'}>{k6hdpuyl}</Option>
                                <Option key="1" value={'1'}>{k5kp4vhr}</Option>
                            </Select>
                        </Col>
                        {
                            this.state.isLimited == 1 ?
                                <Col span={12}>
                                    <FormItem
                                        style={{ marginTop: -6 }}
                                        validateStatus={this.state.amountLimit > 0 ? 'success' : 'error'}
                                        help={this.state.amountLimit > 0 ? null : k5f4b1b9}
                                    >
                                        <PriceInput
                                            maxNum={5}
                                            addonAfter={SALE_LABEL.k6hdpv6x}
                                            value={{ number: this.state.amountLimit }}
                                            onChange={this.handleAmountLimitChange}
                                            modal="int"
                                        />
                                    </FormItem>
                                </Col> : null
                        }
                    </div>
               </div>
                <div style={{height: '40px', paddingLeft: 35, marginTop: '8px'}} className={styles.flexContainer}>
                    <div style={{lineHeight: '28px', marginRight: '14px'}}>
                        {SALE_LABEL.k6hdpvf9}
                    </div>
                    <div style={{width: '400px'}}>
                        <Col  span={this.state.isTotalLimited == 0 ? 24 : 12}>
                            <Select onChange={this.handleIsTotalLimitedChange}
                                    value={String(this.state.isTotalLimited)}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value={'0'}>{k6hdpuyl}</Option>
                                <Option key="1" value={'1'}>{k5kp4vhr}</Option>
                            </Select>
                        </Col>
                        {
                            this.state.isTotalLimited == 1 ?
                                <Col span={12}>
                                    <FormItem
                                        style={{ marginTop: -6 }}
                                        validateStatus={this.getTotalAmountValidation().status}
                                        help={this.getTotalAmountValidation().message}
                                    >
                                        <PriceInput
                                            addonAfter={SALE_LABEL.k6hdpv6x}
                                            maxNum={5}
                                            value={{ number: this.state.totalAmountLimit }}
                                            onChange={this.handleTotalAmountLimitChange}
                                            modal="int"
                                        />
                                    </FormItem>
                                </Col> : null
                        }
                    </div>
                </div>
                {
                    this.state.isTotalLimited == 1 ?
                    <RadioGroup className={styles.radioStyle} value={this.state.shortRule} onChange={this.handleShortRule}>
                        <Radio key={'0'} value={0}>{SALE_LABEL.k6hdpvnl}</Radio>
                        <Radio key={'1'} value={1}>{SALE_LABEL.k6hdpvvx}</Radio>
                    </RadioGroup> : null
                }
                <div style={{height: '40px', paddingLeft: 35, marginTop: '8px'}} className={styles.flexContainer}>
                    <div style={{lineHeight: '28px', marginRight: '14px'}}>
                        {SALE_LABEL.k6hdpw49}
                    </div>
                    <div style={{width: '400px'}}>
                        <Col  span={this.state.isCustomerUseCountLimited == 0 ? 24 : 12}>
                            <Select onChange={this.handleIsCustomUseCountLimitedChange}
                                    value={String(this.state.isCustomerUseCountLimited)}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value={'0'}>{k6hdpuyl}</Option>
                                <Option key="1" value={'1'}>{k5kp4vhr}</Option>
                            </Select>
                        </Col>
                        {
                            this.state.isCustomerUseCountLimited == 1 ?
                                <Col span={12}>
                                    <FormItem
                                        style={{ marginTop: -6 }}
                                        validateStatus={this.state.customerUseCountLimit > 0 ? 'success' : 'error'}
                                        help={this.state.customerUseCountLimit > 0 ? null : k5f4b1b9}
                                    >
                                        <PriceInput
                                            addonAfter={SALE_LABEL.k6hdpv6x}
                                            maxNum={5}
                                            value={{ number: this.state.customerUseCountLimit }}
                                            onChange={this.handleCustomerUseCountLimitChange}
                                            modal="int"
                                        />
                                    </FormItem>
                                </Col> : null
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { isOnline } = this.props;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {
                        this.props.isShopFoodSelectorMode ? (
                            <SpecialDishesTableWithoutBrand
                                onChange={this.dishesChange}
                            />
                        ) : (
                            <SpecialDishesTableWithBrand
                                onChange={this.dishesChange}
                            />
                        )
                    }
                    {this.renderLimitRules()}
                    {!isOnline && this.renderAdvancedSettingButton()}
                    {!isOnline && this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
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
)(SpecialDetailInfo);
