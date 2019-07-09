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
import { Row, Col, Form, Select, Radio, message } from 'antd';
import { connect } from 'react-redux'
import Immutable from 'immutable';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import SpecialDishesTable from '../common/SpecialDishesTable'; // 表格
import SpecialDishesTableWithBrand from './SpecialDishesTableWithBrand';

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from "../common/PriceInput";

class SpecialDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            selections: [],
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
            data: [],
            amountLimit: 1, // 特价菜同一菜品使用数量限制, 默认为1份, int, > 0
            isLimited: 0, // 0 为不限制使用数量, 1为限制
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
        this.handleIsLimitedChange = this.handleIsLimitedChange.bind(this);
        this.handleAmountLimitChange = this.handleAmountLimitChange.bind(this);
        this.dishesChange = this.dishesChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        const _categoryOrDish = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']);
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        const amountLimit = _rule ? Number(_rule.specialFoodMax) : 0;
        const display = !this.props.isNew;
        this.setState({
            display,
            isLimited: Number(!!amountLimit),
            amountLimit: amountLimit || 1,
            targetScope: _categoryOrDish,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])
            !== nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])});
        }
    }

    handleSubmit = (cbFn) => {
        const { data } = this.state;
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
        if (this.state.isLimited == 1 && !this.state.amountLimit) {
            return false;
        }
        if (priceLst.length === 0) {
            message.warning('请至少添加一个菜品');
            return false;
        }
        const rule = {};
        if (this.state.isLimited == 1 && this.state.amountLimit) {
            rule.specialFoodMax = this.state.amountLimit;
        } else {
            rule.specialFoodMax = 0;
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
                <span className={styles.gTip}>更多活动用户限制和互斥限制请使用</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    高级设置 {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
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

    render() {
        const { isOnline } = this.props;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {
                        this.props.isShopFoodSelectorMode ? (
                            <SpecialDishesTable
                                onChange={this.dishesChange}
                            />
                        ) : (
                            <SpecialDishesTableWithBrand
                                onChange={this.dishesChange}
                            />
                        )
                    }                   
                    <div style={{height: '50px', marginTop: '8px'}} className={styles.flexContainer}>
                        <div style={{lineHeight: '28px', marginRight: '14px'}}>
                            同一商品每单限制
                        </div>
                        <div style={{width: '300px'}}>
                            <Col  span={this.state.isLimited == 0 ? 24 : 8}>
                                <Select onChange={this.handleIsLimitedChange}
                                        value={String(this.state.isLimited)}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option key="0" value={'0'}>不限制</Option>
                                    <Option key="1" value={'1'}>限制</Option>
                                </Select>
                            </Col>
                            {
                                this.state.isLimited == 1 ?
                                    <Col span={16}>
                                        <FormItem
                                            style={{ marginTop: -6 }}
                                            validateStatus={this.state.amountLimit > 0 ? 'success' : 'error'}
                                            help={this.state.amountLimit > 0 ? null : '必须大于0'}
                                        >
                                            <PriceInput
                                                addonAfter={'份'}
                                                value={{ number: this.state.amountLimit }}
                                                defaultValue={{ number: this.state.amountLimit }}
                                                onChange={this.handleAmountLimitChange}
                                                modal="int"
                                            />
                                        </FormItem>
                                    </Col> : null
                            }
                        </div>
                </div>
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
