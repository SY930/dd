import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Input, message } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

const FormItem = Form.Item;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import { NDiscount } from './NDiscount'; // 可增删的输入框 组件

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
const RadioGroup = Radio.Group;
const Immutable = require('immutable');
@injectIntl()
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
            priceLst: [],
            shortRule: '0',
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
        const priceLst = Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [];
        this.setState({priceLst, display});
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
                    value: Number((rule.discountRate * 1).toFixed(3)).toString(), // Number.prototype.toFixed()
                    validateFlag: true,
                }
            });
            this.setState({ nDiscount: dis });
        }
        if (_rule.stageType) {
            this.setState({ stageType: String(_rule.stageType) });
        }
        if (_rule.shortRule) {
            this.setState({ shortRule: String(_rule.shortRule) });
        }
    }


    handleSubmit = () => {
        let nextFlag = true;
        const { nDiscount, priceLst, stageType, shortRule = '0' } = this.state;
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
                        discountRate: Number(nDis.value),
                    }
                }),
            };
            this.props.setPromotionDetail({
                rule, priceLst: []
            });
            return true;
        } else if (nextFlag && stageType == '1') {
            if (!priceLst.length) {
                message.warning(this.props.intl.formatMessage(SALE_STRING.k6hdp6nz));
                return false;
            }
            const rule = {
                stageType: Number(stageType),
                stage: disArr.map((nDis, index) => {
                    return {
                        stageAmount: index + 2,
                        discountRate: Number(nDis.value),
                    }
                }),
                shortRule,
            };
            this.props.setPromotionDetail({
                rule, priceLst,
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
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                    {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
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
            brandID: food.brandID || '0',
            price: food.prePrice==-1?food.price:food.prePrice}));
        this.setState({priceLst})
    }

    onReqChange = ({ target }) => {
        const { value } = target;
        this.setState({ shortRule: value });
    }
    render() {
        const { priceLst, stageType, shortRule = '0' } = this.state;
        const _priceLst = priceLst.map(food => ({
            'scopeType': '2',
            'foodNameWithUnit': food.foodName + food.foodUnitName,
        }));
        //并且选择的「第二份菜品」数量大于等于2时再联动出现“执行要求”的选项。默认选中“按优惠力度大执行”。
        const gtTwo = priceLst[1];
        return (
            <div>
                <Form className={styles.FormStyle}>
                <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} />
                    <NDiscount
                        onChange={this.handleDiscountTypeChange}
                        form={this.props.form}
                        stageType={stageType}
                        value={this.state.nDiscount}
                    />
                    {
                        stageType === '1' && (
                            <FormItem required={true} label={SALE_LABEL.k6hdp6wb} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                                <ConnectedPriceListSelector isShopMode={this.props.isShopFoodSelectorMode} onChange={(dishes) => this.handleDishesChange({dishes})} />
                            </FormItem>
                        )
                    }
                    {
                        stageType === '1' && gtTwo && (
                            <FormItem label="执行要求" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                                <RadioGroup
                                    value={shortRule}
                                    onChange={this.onReqChange}
                                >
                                    <Radio value="0">按优惠力度大执行</Radio >
                                    <Radio value="1">按优惠力度小执行</Radio >
                                </RadioGroup >
                            </FormItem>
                        )
                    }
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
)(Form.create()(NDiscountDetailInfo));
