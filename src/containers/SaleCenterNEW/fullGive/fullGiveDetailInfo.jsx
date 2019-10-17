/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-30T10:17:40+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: fullGiveDetailInfo.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T22:40:04+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React, { Component } from 'react';
import { Row, Col, Form, Select, Radio } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import AddGrade from '../../../containers/SaleCenterNEW/common/AddGrade'; // 可增删的输入框 组件
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';


const Immutable = require('immutable');

const type = [
    { value: '0', name: '下单即赠送' },
    { value: '2', name: '任意菜品消费满' },
    { value: '1', name: '任意菜品消费每满' },
    { value: '3', name: '指定菜品消费满' },
    { value: '4', name: '指定菜品消费每满' },
];

class FullGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        const { data, ruleType } = this.initState();
        this.state = {
            display: !this.props.isNew,
            ruleType,
            priceLst: [],
            data,
            priceLst: Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) ?
                this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [],
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }
    initState = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return  {
                ruleType: '0',
                data: {
                    0: {
                        stageAmount: '',
                        giftType: '0',
                        dishes: [],
                        giftName: 'qqq',
                        foodCount: '',
                        foodCountFlag: true,
                        dishesFlag: true,
                        StageAmountFlag: true,
                    },
                },
            };
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let ruleType = _rule.stageType || '0';
        let data = {
            0: {
                stageAmount: '',
                giftType: '0',
                dishes: [],
                giftName: 'qqq',
                foodCount: '',
                foodCountFlag: true,
                dishesFlag: true,
                StageAmountFlag: true,
            },
        };
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        if (_rule.stageType == 0) {
            // 下单即赠送
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
        } else if (_rule.stageType == '1') {
            if (_scopeLst.length == 0) {
                ruleType = '1'
            } else {
                ruleType = '4'
            }
            // 每满
            data[0].foodCount = _rule.giveFoodCount || '';
            data[0].giftName = _rule.giftName || '';
            data[0].stageAmount = _rule.stageAmount || '';
        } else {
            // 满
            if (_scopeLst.length == '0') {
                ruleType = '2'
            } else {
                ruleType = '3'
            }
            _rule.stage && _rule.stage.map((stage, index) => {
                data[index] = {
                    stageAmount: '',
                    giftType: '0',
                    dishes: [],
                    giftName: null,
                    foodCount: '',
                    foodCountFlag: true,
                    dishesFlag: true,
                    StageAmountFlag: true,
                };
                data[index].foodCount = stage.giveFoodCount || '';
                data[index].giftName = stage.giftName || '';
                data[index].stageAmount = stage.stageAmount || '';
            })
        }
        return {
            data,
            ruleType,
        }
    }

    handleSubmit = (cbFn) => {
        const { data, dishes, ruleType } = this.state;
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }

            let stage = [{}];
            let priceLst = [];
            // save state to redux
            if (ruleType == '0') {
                if (data[0].foodCount == '' || data[0].foodCount == null) {
                    data[0].foodCountFlag = false;
                    nextFlag = false;
                }
                if (data[0].dishes.length == 0) {
                    data[0].dishesFlag = false;
                    nextFlag = false;
                }
                this.setState({ data });
                stage[0].giveFoodCount = data[0].foodCount;
                stage[0].stageNum = 0;
                priceLst = data[0].dishes.map((dish, index) => {
                    return {
                        foodUnitID: dish.itemID || index,
                        foodUnitCode: dish.foodKey,
                        foodName: dish.foodName,
                        foodUnitName: dish.unit,
                        brandID: dish.brandID || '0',
                        price: dish.price,
                        stageNo: 0,
                    }
                });
            } else if (ruleType == '1' || ruleType == '4') {
                // 每满
                if (data[0].foodCount == '' || data[0].foodCount == null) {
                    data[0].foodCountFlag = false;
                    nextFlag = false;
                }
                if (data[0].dishes.length == 0) {
                    data[0].dishesFlag = false;
                    nextFlag = false;
                }
                if (!data[0].stageAmount || data[0].stageAmount <= 0) {
                    data[0].StageAmountFlag = false;
                    nextFlag = false;
                }
                this.setState({ data });
                stage[0].stageAmount = data[0].stageAmount;
                stage[0].giveFoodCount = data[0].foodCount;
                stage[0].stageNum = 0;
                priceLst = data[0].dishes.map((dish, index) => {
                    return {
                        foodUnitID: dish.itemID || index,
                        foodUnitCode: dish.foodKey,
                        foodName: dish.foodName,
                        brandID: dish.brandID || '0',
                        foodUnitName: dish.unit,
                        price: dish.price,
                        stageNo: 0,
                    }
                });
            } else {
                // 满
                Object.keys(data).map((keys) => {
                    if (data[keys].foodCount == '' || data[keys].foodCount == null) {
                        data[keys].foodCountFlag = false;
                        nextFlag = false;
                    }
                    if (data[keys].dishes.length == 0) {
                        data[keys].dishesFlag = false;
                        nextFlag = false;
                    }
                    if (!data[keys].stageAmount || data[keys].stageAmount <= 0) {
                        data[keys].StageAmountFlag = false;
                        nextFlag = false;
                    }
                });
                this.setState({ data });
                stage = Object.keys(data).map((keys, index) => {
                    priceLst.push(data[keys].dishes.map((dish, index) => {
                        return {
                            foodUnitID: dish.itemID || index,
                            foodUnitCode: dish.foodKey,
                            foodName: dish.foodName,
                            foodUnitName: dish.unit,
                            brandID: dish.brandID || '0',
                            price: dish.price,
                            stageNo: keys,
                        }
                    }));
                    return {
                        stageAmount: data[keys].stageAmount,
                        giveFoodCount: data[keys].foodCount,
                        stageNum: index,
                    }
                })
            }
            const rule = (ruleType == '2' || ruleType == '3') ?
                ({
                    stageType: '2',
                    stage,
                }) : (ruleType == '1' || ruleType == '4' ?
                    ({
                        stageType: '1',
                        ...stage[0],
                    }) :
                    ({
                        stageType: '0',
                        ...stage[0],
                    }));
            let newPrice = [];
            if (priceLst[0] && typeof priceLst[0] === 'object') {
                priceLst.forEach((price, index) => {
                    newPrice = newPrice.concat(priceLst[index]);
                })
            }
            this.props.setPromotionDetail({
                rule, priceLst: newPrice || priceLst,
            });
        });
        return nextFlag;
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };


    renderPromotionRule() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <div>

                <FormItem
                    label="活动方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Select
                        placeholder="请选择活动类别"
                        defaultValue={this.state.ruleType}
                        className={`${styles.linkSelectorRight} fullGiveDetailMountClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.ruleType}
                        onChange={(val) => {
                            let { ruleType } = this.state;
                            ruleType = val;
                            if (val == '0' || val == '1' || val == '2') {
                                this.props.setPromotionDetail({
                                    // i清空已选,
                                    scopeLst: [],
                                    dishes: [],
                                    priceLst: [],
                                    foodCategory: [],
                                    excludeDishes: [],
                                });
                            }
                            this.setState({ ruleType });
                        }
                        }
                    >
                        {type
                            .map((type) => {
                                return <Option key={type.value} value={type.value}>{type.name}</Option>
                            })}
                    </Select>
                </FormItem>
                {this.state.ruleType == 3 || this.state.ruleType == 4 ?
                        <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    : null}
                <Row>
                    <Col span={19} offset={2}>
                        <AddGrade
                            getFieldDecorator={getFieldDecorator}
                            getFieldValue={getFieldValue}
                            form={this.props.form}
                            ruleType={this.state.ruleType}
                            value={this.state.data}
                            onChange={(value) => {
                                this.setState({ data: value });
                            }
                            }
                        />
                    </Col>
                </Row>

            </div>
        )
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
        const payLimit = this.state.ruleType != 0;
        return (
            <div >
                <Form className={styles.FormStyle}>
                    {this.renderPromotionRule()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={payLimit} /> : null}
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
)(Form.create()(FullGiveDetailInfo));
