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
import PriceInput from '../common/PriceInput';


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import PromotionDetailSetting from '../../../containers/SaleCenterNEW/common/promotionDetailSetting';

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


const client = [
    { key: 'ALL_USER', value: '0', name: '不限制' },
    { key: 'CUSTOMER_ONLY', value: '1', name: '仅会员' },
    { key: 'CUSTOMER_EXCLUDED', value: '2', name: '非会员' },
];

class AddMoneyUpgradeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            // foodMenuList: [],
            // foodCategoryCollection: [],
            // freeAmount: '',
            // stageAmount: '',
            // dishes: [],
            // freeAmountFlag: true,
            // stageAmountFlag: true,
            // dishsSelectionFlag: true,
            ruleType: '0',
            subjectType: '0',
            isAddMoney: '0',
            mostNewLimit: '0',
            singleNewLimit: '0',
        };

        this.renderBuyDishNumInput = this.renderBuyDishNumInput.bind(this);
        this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.handleFreeAmountChange = this.handleFreeAmountChange.bind(this);
        this.ruleTypeChange = this.ruleTypeChange.bind(this);
        this.subjectTypeChange = this.subjectTypeChange.bind(this);
        this.isAddMoneyChange = this.isAddMoneyChange.bind(this);
        this.renderNewLimit = this.renderNewLimit.bind(this);
        this.mostNewLimitChange = this.mostNewLimitChange.bind(this);
        this.singleNewLimitChange = this.singleNewLimitChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });

        // if (this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized'])) {
        //     const foodMenuList = this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;

        //     this.setState({
        //         foodMenuList,
        //     })
        // }
        // let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        // const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        // if (_rule === null || _rule === undefined) {
        //     return null;
        // }
        // _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        // _rule = Object.assign({}, _rule);
        // let { display } = this.state;
        // display = !this.props.isNew;
        // // 根据ruleJson填充页面
        // this.setState({
        //     display,
        //     stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
        //     freeAmount: _rule.stage ? _rule.stage[0].freeAmount : '',
        //     ruleType: _scopeLst.size > 0 ? '1' : '0',

        // });
    }
    componentWillReceiveProps(nextProps) {
        // if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
        // nextProps.promotionDetailInfo.getIn(['$foodCategoryListInfo', 'initialized'])) {
        //     this.setState({
        //         foodMenuList: nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records,
        //         foodCategoryCollection: nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS(),
        //     })
        // }

        // if (nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) &&
        //     nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).size > 0) {
        //     const foodMenuList = nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data']).toJS().records;
        //     const _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) ?
        //         nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS() : [];
        //     const _dish = [];
        //     _priceLst.map((price) => {
        //         foodMenuList.map((food) => {
        //             // if(food.foodKey === price.foodUnitCode){不唯一，一个菜会匹配多次，添加多次
        //             if (food.itemID == price.foodUnitID) { // foodUnitID就是由itemID转换
        //                 _dish.push(food)
        //             }
        //         });
        //     });
        //     _dish.map(((item) => {
        //         item.id = item.foodID;
        //         item.content = item.foodName;
        //     }));
        //     this.setState({
        //         foodMenuList,
        //         dishes: _dish,
        //     });
        // }
    }

    handleSubmit = () => {
        // let { stageAmount, dishes, stageAmountFlag, foodMenuList, freeAmount, freeAmountFlag, dishsSelectionFlag, ruleType } = this.state;
        // if (stageAmount == null || stageAmount == '') {
        //     stageAmountFlag = false;
        // }
        // if (freeAmount == null || freeAmount == '') {
        //     freeAmountFlag = false;
        // }
        // if (dishes.length == 0) {
        //     dishsSelectionFlag = false;
        // }
        // this.setState({ freeAmountFlag, stageAmountFlag, dishsSelectionFlag });

        // if (stageAmountFlag && freeAmountFlag && dishsSelectionFlag) {
        //     const rule = {
        //         stageType: 2,
        //         stage: [
        //             {
        //                 stageAmount,
        //                 freeAmount,
        //             },
        //         ],
        //     }

        //     const dish = dishes.map((dish) => {
        //         return foodMenuList.find((menu) => {
        //             // return dish.id === menu.foodID
        //             return dish.itemID == menu.itemID
        //         })
        //     });
        //     const priceLst = dish.map((price) => {
        //         return {
        //             foodUnitID: price.itemID,
        //             foodUnitCode: price.foodKey,
        //             foodName: price.foodName,
        //             foodUnitName: price.unit,
        //             price: price.price,
        //         }
        //     });
        //     if (ruleType == '0') {
        //         this.props.setPromotionDetail({
        //             rule,
        //             priceLst,
        //             scopeLst: [],
        //             dishes: [],
        //             excludeDishes: [],
        //             foodCategory: [],
        //         });
        //     } else {
        //         this.props.setPromotionDetail({
        //             rule, priceLst,
        //         });
        //     }

        //     return true
        // }
        // return false
    };


    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    // 减免金额
    onStageAmountChange(value) {
        // let { stageAmount, stageAmountFlag } = this.state;
        // if (value.number == null || value.number == '') {
        //     stageAmountFlag = false;
        //     stageAmount = value.number;
        // } else {
        //     stageAmountFlag = true;
        //     stageAmount = value.number;
        // }
        // this.setState({ stageAmount, stageAmountFlag });
    }
    // 满金额
    handleFreeAmountChange(value) {
        // let { freeAmount, freeAmountFlag } = this.state;
        // if (value.number == null || value.number == '') {
        //     freeAmountFlag = false;
        //     freeAmount = value.number;
        // } else {
        //     freeAmountFlag = true;
        //     freeAmount = value.number;
        // }
        // this.setState({ freeAmount, freeAmountFlag });
    }
    // 换购菜品onchange
    onDishesChange(value) {
        let { dishes } = this.state;
        dishes = value;
        this.setState({
            dishes,
            dishsSelectionFlag: value.length != 0,
        });
    }
    ruleTypeChange(val) {
        this.setState({ ruleType: val })
    }
    subjectTypeChange(val) {
        this.setState({ subjectType: val })
    }
    isAddMoneyChange(val) {
        this.setState({ isAddMoney: val })
    }
    mostNewLimitChange(val){
        this.setState({ mostNewLimit: val })
    }
    singleNewLimitChange(val){
        this.setState({ singleNewLimit: val })
    }
    // 加价方式
    renderBuyDishNumInput() {
        const { isAddMoney } = this.state;
        return (
            <FormItem
                className={[styles.FormItemStyle,].join(' ')}
                label='加价方式'
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Col span={isAddMoney == 0 ? 24 : 4}>
                    <Select onChange={this.isAddMoneyChange} value={isAddMoney}>
                        <Option key="0" value="0">不加价</Option>
                        <Option key="1" value="1">加价</Option>
                    </Select>
                </Col>
                {
                    isAddMoney == 1 ?
                        <Col span={isAddMoney == 0 ? 0 : 20}>
                            <PriceInput
                                addonAfter={'元'}
                                //value={{ number: this.state.stageAmount }}
                                //defaultValue={{ number: this.state.stageAmount }}
                                //onChange={this.onStageAmountChange}
                                modal="int"
                            />
                        </Col> : null
                }
            </FormItem>
        )
        //     <FormItem
        //         className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
        //         wrapperCol={{ span: 17, offset: 4 }}
        //         required={true}
        //         validateStatus={this.state.freeAmountFlag ? 'success' : 'error'}
        //         help={this.state.freeAmountFlag ? null : '请输入加价金额'}
        //     >
        //         <PriceInput
        //             addonBefore={'加价'}
        //             addonAfter={'元'}
        //             value={{ number: this.state.freeAmount }}
        //             defaultValue={{ number: this.state.freeAmount }}
        //             onChange={this.handleFreeAmountChange}
        //             modal="int"
        //         />
        //     </FormItem>
        // )
    }
    // 换购菜品
    renderDishsSelectionBox(beforeOrAfter) {
        return (
            <FormItem
                label={beforeOrAfter == 'beforeUpgrade' ? '升级前菜品' : '升级后菜品'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            // required={true}
            //validateStatus={this.state.dishsSelectionFlag ? 'sucess' : 'error'}
            //help={this.state.dishsSelectionFlag ? null : '请选择菜品'} 
            >
                <EditBoxForDishes onChange={(value) => {
                    {/* beforeOrAfter=='beforeUpgrade'?this.onBeforeDishesChange(value);:this.onAfterDishesChange(value); */ }
                    this.onDishesChange(value);
                }}
                />
            </FormItem>
        )
    }
    // 单笔订单最多升级换新数量限制
    renderNewLimit() {
        const {mostNewLimit, singleNewLimit}=this.state;
        return (
            <FormItem
                label=' '
                colon={false}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <FormItem
                    className={[styles.FormItemStyle,].join(' ')}
                    label='单笔订单最多升级换新数量限制'
                    labelCol={{ span: 13 }}
                    wrapperCol={{ span: 11 }}
                >
                    <Col span={mostNewLimit == 0 ? 24 : 8}>
                        <Select onChange={this.mostNewLimitChange} value={mostNewLimit}>
                            <Option key="0" value="0">不限制</Option>
                            <Option key="1" value="1">限制</Option>
                        </Select>
                    </Col>
                    {
                        mostNewLimit == 1 ?
                            <Col span={mostNewLimit == 0 ? 0 : 16}>
                                <PriceInput
                                    addonAfter={'份'}
                                    //value={{ number: this.state.stageAmount }}
                                    //defaultValue={{ number: this.state.stageAmount }}
                                    //onChange={this.onStageAmountChange}
                                    modal="int"
                                />
                            </Col> : null
                    }
                </FormItem>
                <FormItem
                    className={[styles.FormItemStyle,].join(' ')}
                    label='单笔订单同一菜品最多升级换新数量限制'
                    labelCol={{ span: 13 }}
                    wrapperCol={{ span: 11 }}
                >
                    <Col span={singleNewLimit == 0 ? 24 : 8}>
                        <Select onChange={this.singleNewLimitChange} value={singleNewLimit}>
                            <Option key="0" value="0">不限制</Option>
                            <Option key="1" value="1">限制</Option>
                        </Select>
                    </Col>
                    {
                        singleNewLimit == 1 ?
                            <Col span={singleNewLimit == 0 ? 0 : 16}>
                                <PriceInput
                                    addonAfter={'份'}
                                    //value={{ number: this.state.stageAmount }}
                                    //defaultValue={{ number: this.state.stageAmount }}
                                    //onChange={this.onStageAmountChange}
                                    modal="int"
                                />
                            </Col> : null
                    }
                </FormItem>
            </FormItem>
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
        let { ruleType, subjectType } = this.state;
        return (
            <div>
                <Form className={[styles.FormStyle,].join(' ')}>
                    <FormItem
                        className={[styles.FormItemStyle,].join(' ')}
                        label='活动条件限制'
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Col span={subjectType == 0 ? 24 : 4}>
                            <Select onChange={this.subjectTypeChange} value={subjectType}>
                                <Option key="0" value="0">不限制</Option>
                                <Option key="1" value="1">按金额</Option>
                                <Option key="2" value="2">按数量</Option>
                            </Select>
                        </Col>
                        {
                            subjectType == 1 ?
                                <Col span={subjectType == 0 ? 0 : 20}>
                                    <PriceInput
                                        addonBefore={
                                            <Select size="default"
                                                defaultValue='0'
                                            //onChange={this.ruleTypeChange}
                                            //value={ruleType}
                                            >
                                                <Option key="0" value="0">任意菜品实收满</Option>
                                                <Option key="1" value="1">任意菜品售价满</Option>
                                                <Option key="3" value="3">活动菜品实收满</Option>
                                                <Option key="4" value="4">活动菜品售价满</Option>
                                            </Select>
                                        }
                                        addonAfter={'元'}
                                        //value={{ number: this.state.stageAmount }}
                                        //defaultValue={{ number: this.state.stageAmount }}
                                        //onChange={this.onStageAmountChange}
                                        modal="int"
                                    />
                                </Col> : null
                        }
                        {
                            subjectType == 2 ?
                                <Col span={subjectType == 0 ? 0 : 20}>
                                    <PriceInput
                                        addonBefore={
                                            <Select size="default"
                                                defaultValue='0'
                                            //onChange={this.ruleTypeChange}
                                            //value={ruleType}
                                            >
                                                <Option key="0" value="0">任意菜品数量满</Option>
                                                <Option key="1" value="1">同一菜品数量满</Option>
                                            </Select>
                                        }
                                        addonAfter={'份'}
                                        //value={{ number: this.state.stageAmount }}
                                        //defaultValue={{ number: this.state.stageAmount }}
                                        //onChange={this.onStageAmountChange}
                                        modal="int"
                                    />
                                </Col> : null
                        }
                    </FormItem>
                    {<PromotionDetailSetting />/* 条件限制菜品 */}
                    {this.renderDishsSelectionBox('beforeUpgrade')/*升级前菜品*/}
                    {this.renderBuyDishNumInput()}
                    {this.renderDishsSelectionBox('afterUpgrade')/*升级后菜品*/}
                    {this.renderNewLimit()/*换新菜品数量限制*/}
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
)(Form.create()(AddMoneyUpgradeDetailInfo));
