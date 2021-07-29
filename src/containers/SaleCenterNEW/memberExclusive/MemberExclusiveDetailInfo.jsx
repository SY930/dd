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
import { injectIntl } from '../IntlDecor';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import settingGuideImg from './assets/settingGuide.png';
import AdvancedPromotionDetailSetting from '../common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from "../common/PriceInput";
@injectIntl()
class MemberExclusiveDetailInfo extends React.Component {
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
                price: parseFloat(item.newPrice) < 0 ? item.price : parseFloat(item.newPrice),
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
            const k6hdpu19 = this.props.intl.formatMessage(SALE_STRING.k6hdpu19)
            message.warning(k6hdpu19);
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

        if (isCustomerUseCountLimited == 1 && customerUseCountLimit > 0 && (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '3010' || this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '1010')) {
            rule.customerUseCountLimit = customerUseCountLimit;
        } else {
            if (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '3010' || this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '1010') {
                rule.customerUseCountLimit = 0;
            }
        }
        this.props.setPromotionDetail({
            priceLst,
            rule, // 为黑白名单而设
        });
        return true;
    };

   
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
    handleIsCustomUseCountLimitedChange = (value) => {
        this.setState({ isCustomerUseCountLimited: value })
        if (value == 0) {
            this.props.setPromotionDetail({
                customerUseCountLimit: 0,
            })
        } else {
            this.props.setPromotionDetail({
                customerUseCountLimit: 1,
            })
        }
    }
    handleCustomerUseCountLimitChange = (value) => {
        this.setState({ customerUseCountLimit: value.number })
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
                    message: <p style={{ whiteSpace: 'nowrap' }}>{SALE_LABEL.k6hdpu9l}</p>
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
        const k5f4b1b9 = intl.formatMessage(SALE_STRING.k5f4b1b9);
        const { customerUseCountLimit } = this.state;
        return (
            <div style={{ width: '360px' }}>
                <Col span={this.state.isCustomerUseCountLimited == 0 ? 24 : 12}>
                    <Select onChange={this.handleIsCustomUseCountLimitedChange}
                        value={String(this.state.isCustomerUseCountLimited)}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        <Option key="0" value={'0'}>不限制</Option>
                        <Option key="1" value={'1'}>每人每天限购</Option>
                    </Select>
                </Col>
                {
                    this.state.isCustomerUseCountLimited == 1 ?
                        <Col span={8} style={{ marginLeft: 5 }}>
                            <FormItem
                                style={{ marginTop: -6 }}
                                validateStatus={customerUseCountLimit > 0 && customerUseCountLimit <= 10000 ? 'success' : 'error'}
                                help={customerUseCountLimit > 0 && customerUseCountLimit <= 10000 ? null : '大于0且小于10000'}
                            >
                                <PriceInput
                                    addonAfter={'份'}
                                    maxNum={5}
                                    value={{ number: this.state.customerUseCountLimit }}
                                    onChange={this.handleCustomerUseCountLimitChange}
                                    modal="int"
                                />
                            </FormItem>
                        </Col> : null
                }
            </div>

        )
    }

    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <FormItem
                        label={'活动菜品'}
                        required
                        className={styles.FormItemStyle}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <div style={{marginTop:8}}>
                            只可添加1项菜品，仅能添加“不可单独销售”菜品 
                            <div className={styles.settingGuide}>
                                设置指南
                                <img src={settingGuideImg} alt="" className={styles.settingImg}/>
                            </div>
                        </div>
                        <SpecialDishesTableWithBrand
                            onChange={this.dishesChange}
                        />
                    </FormItem>
                    <FormItem
                        label={'参与限制'}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}
                        style={{marginTop:20}}
                    >
                        {this.renderLimitRules()}
                    </FormItem>
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
)(MemberExclusiveDetailInfo);
