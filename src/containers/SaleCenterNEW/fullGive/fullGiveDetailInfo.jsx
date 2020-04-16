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
import NewAddGrade from '../../../containers/SaleCenterNEW/common/NewAddGrade';
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../../../containers/SaleCenterNEW/common/ConnectedScopeListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Immutable = require('immutable');
@injectIntl()
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
            priceLst: Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList'])) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS() : Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) ?
                this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [],
            foodRuleList: Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList'])) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS() : [],
            flag: true,
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
            let foodRuleList =  [];
            let tempArr = []
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
                        imagePath: dish.imgePath,
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
                        imagePath: dish.imgePath,
                    }
                });
            } else {
                // 满
                //多档位的增加新字段
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
                    priceLst = [];
                    foodRuleList.push(data[keys].dishes.map((dish, index) => {
                        return {
                            rule: {
                                stageAmount: data[keys].stageAmount,
                                giveFoodCount: data[keys].foodCount,
                                stageNum: index,
                            },
                            priceList: [{
                                foodUnitID: dish.itemID || index,
                                foodUnitCode: dish.foodKey,
                                foodName: dish.foodName,
                                foodUnitName: dish.unit,
                                brandID: dish.brandID || '0',
                                price: dish.price,
                                stageNo: keys,
                                imagePath: dish.imgePath,
                            }],
                            scopeList: [],
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
            for (let i = 0; i < foodRuleList.length; i++) {
                tempArr.push(...foodRuleList[i])
            }
            let secondTrans = [];
            tempArr.forEach((item) => {
                let tempKeys = item.rule.stageAmount;
                let flag = false;
                secondTrans.length && secondTrans.map((ath) => {
                    if(ath.rule.stageAmount == tempKeys) {
                        flag = true;
                        if(!ath.priceList.filter((a) => {
                            return a.foodUnitID == item.priceList[0].foodUnitID;
                        }).length){
                            ath.priceList = ath.priceList.concat(item.priceList);
                        }
                    }
                })
                if(!flag){
                    secondTrans.push(item); 
                }
            })
            secondTrans.map((item) => {
                item.rule = JSON.stringify(item.rule);
            })
            this.props.setPromotionDetail({
                rule, priceLst: newPrice || priceLst, foodRuleList: secondTrans,
            });
        });
        return nextFlag;
    };

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };


    renderPromotionRule = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { intl } = this.props;
        const k5g5bcic = intl.formatMessage(SALE_STRING.k5g5bcic);
        const k5ez4ovx = intl.formatMessage(SALE_STRING.k5ez4ovx);
        const k5ez4pdf = intl.formatMessage(SALE_STRING.k5ez4pdf);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const type = [
            { value: '0', name: k5g5bcic },
            { value: '2', name: k5ez4ovx },
            { value: '1', name: k5ez4pdf },
            { value: '3', name: k5ez4pvb },
            { value: '4', name: k5ez4qew },
        ];
        return (
            <div>

                <FormItem
                    label={SALE_LABEL.k5ez4n7x}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Select
                        placeholder=""
                        defaultValue={this.state.ruleType}
                        className={`${styles.linkSelectorRight} fullGiveDetailMountClassJs`}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.ruleType}
                        onChange={(val) => {
                            let { ruleType } = this.state;
                            ruleType = val;
                            this.setState({
                                flag: false,
                            }, () => {
                                this.setState({
                                    flag: true,
                                })
                            })
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
                        {
                            this.state.ruleType == 3 || this.state.ruleType == 2 ?
                            <NewAddGrade
                                getFieldDecorator={getFieldDecorator}
                                getFieldValue={getFieldValue}
                                form={this.props.form}
                                ruleType={this.state.ruleType}
                                value={this.state.data}
                                onChange={(value) => {
                                    this.setState({ data: value });
                                }
                                }
                                foodRuleList = {this.state.foodRuleList}
                            /> :
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
                        }
                    </Col>
                </Row>

            </div>
        )
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
        const payLimit = this.state.ruleType != 0;
        return (
            <div style={{position: "initial", width: '100%', height: '100%', overflow: 'auto'}}>
                <div style={{position: "absolute", left: -226, background: 'white', top: 160, width: 221,}}>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, margin: '10px 0'}}>1. 同一活动时间，有多个满赠活动，活动会执行哪个？</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</p>
                    <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, padding: '10px 0', borderTop: '1px solid #E9E9E9', marginTop: '7px'}}>2. 满赠活动使用注意事项</p>
                    <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>满赠/每满赠活动与买赠、第二份打折、加价换购活动之间不受互斥规则限制，在线上餐厅都按通向执行</p>
                </div>
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
