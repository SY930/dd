/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-02T14:31:40+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Input, message } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';
import RangeInput from '../../../containers/SaleCenterNEW/common/RangeInput';

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox';
import { NDiscount } from './NDiscount'; // 可增删的输入框 组件

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import FoodBox from "../../GiftNew/GiftAdd/FoodBox";

const Immutable = require('immutable');


const client = [
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];


class NDiscountDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            nDiscount: {
                0: {},
            },
            stageType: '2',
            priceLst: []
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDiscountTypeChange = this.handleDiscountTypeChange.bind(this);
        this.handleDishesChange = this.handleDishesChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        this.initRule();
        const display = !this.props.isNew;
        const priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() || [];
        this.setState({priceLst, display});
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) || (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']))
    }*/

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) {
            const priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
            this.setState({
                priceLst
            });
        }
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'rule']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule'])) {
            this.initRule(nextProps);
        }
    }

    initRule(props = this.props) {
        let _rule = props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // default value
        _rule = Object.assign({}, _rule);
        const dis = {};
        if (_rule.stage) {
            _rule.stage.map((rule, index) => {
                dis[index] = {
                    value: (rule.discountRate * 10).toFixed(2),
                    validateFlag: true,
                }
            });
            this.setState({ nDiscount: dis });
        }
        if (_rule.stageType) {
            this.setState({ stageType: String(_rule.stageType) });
        }
    }


    handleSubmit = () => {
        let nextFlag = true;
        const { nDiscount, priceLst, stageType } = this.state;
        const disArr = [];

        Object.keys(nDiscount).map((key) => {
            if (nDiscount[key].value == '') {
                nextFlag = false;
                nDiscount[key].validateFlag = false;
            } else {
                disArr.push(nDiscount[key]);
            }
        })
        this.setState({ nDiscount });

        if (nextFlag && stageType == '2') {
            const rule = {
                stageType: Number(stageType),
                stage: disArr.map((nDis, index) => {
                    return {
                        stageAmount: index + 2,
                        discountRate: (nDis.value * 1000) / 10000,
                    }
                }),
            };
            this.props.setPromotionDetail({
                rule
            });
            return true;
        } else if (nextFlag && stageType == '1') {
            if (!priceLst.length) {
                message.warning('请指定第二份菜品');
                return false;
            }
            const rule = {
                stageType: Number(stageType),
                stage: disArr.map((nDis, index) => {
                    return {
                        stageAmount: index + 2,
                        discountRate: (nDis.value * 1000) / 10000,
                    }
                }),
            };
            this.props.setPromotionDetail({
                rule, priceLst
            });
            return true;
        }
        return false
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };


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

    handleDiscountTypeChange(value) {
        if (!value.stageType) {
            this.setState({ nDiscount: value });
        } else {
            this.setState({ nDiscount: value.data, stageType: value.stageType });
        }

    }

    handleDishesChange(value) {
        const priceLst = (value.dishes || []).map(food => ({
            foodUnitID: food.itemID,
            foodUnitCode: food.foodKey,
            foodName: food.foodName,
            foodUnitName: food.unit,
            price: food.price}));
        this.setState({priceLst})
    }


    render() {
        const { priceLst } = this.state;
        const _priceLst = priceLst.map(food => ({
            'scopeType': 'FOOD_INCLUDED',
            'foodNameWithUnit': food.foodName + food.foodUnitName,
        }));
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <PromotionDetailSetting radioLabel="适用菜品选择方式" />
                    <NDiscount
                        onChange={this.handleDiscountTypeChange}
                        form={this.props.form}
                        stageType={this.state.stageType}
                        value={this.state.nDiscount}
                    />
                    {this.state.stageType === '1' && <FoodBox categoryOrDish={0}
                                                              dishOnly={true}
                                                              boxLabel="第2份菜品"
                                                              noExclude={true}
                                                              onChange={this.handleDishesChange}
                                                              catOrFoodValue={_priceLst}
                                                              autoFetch={true} />}
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
)(Form.create()(NDiscountDetailInfo));
