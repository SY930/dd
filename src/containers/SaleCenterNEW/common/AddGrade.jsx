/**
 * @Author: chenshuang
 * @Date:   2017-04-01T11:02:34+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T15:15:07+08:00
 */


import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux';

import { Row, Col, Icon, DatePicker, Button, Radio, Form, Input, InputNumber } from 'antd';
import styles from '../ActivityPage.less';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox'; // 编辑

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import EditBoxForDishes from './EditBoxForDishes';

class AddGrade extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            flag: {
                0: '0',
                1: '0',
                2: '0',
            },
            selectedDishes: [],
            foodCategoryCollection: [], // 存储所有相关数据

            data: {
                0: {
                    stageAmount: '',
                    giftType: '0',
                    dishes: [],
                    giftName: null,
                    foodCount: '',
                    foodCountFlag: true,
                    dishesFlag: true,
                    StageAmountFlag: true,
                },
            },
            // TODO:赠送份数没校验
            foodCountFlag: this.props.foodCountFlag || true,

        }
        this.allData = {};
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onFoodCountChange = this.onFoodCountChange.bind(this);
    }
    componentDidMount() {
        this.setState({
            data: this.props.value,
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.foodCountFlag != nextProps.foodCountFlag) {
            this.setState({
                foodCountFlag: nextProps.foodCountFlag,
            })
        }

        if (this.props.ruleType != nextProps.ruleType) { // 活动方式改变
            if (nextProps.ruleType !== '2' && nextProps.ruleType !== '3') {
                this.uuid = 0;
                const { form } = this.props;
                const keys = form.getFieldValue('keys');
                form.setFieldsValue({
                    keys: [0],
                });
            } else {
                this.uuid = Object.keys(nextProps.value).length - 1;
                const { form } = this.props;
                const keys = form.getFieldValue('keys');
                form.setFieldsValue({
                    keys: Object.keys(nextProps.value),
                });
            }
        }
        if (nextProps.foodCategoryCollection != this.props.foodCategoryCollection) {
            this.setState({
                foodCategoryCollection: nextProps.foodCategoryCollection,
            });
        }

        if (this.props.value != nextProps.value) {
            this.setState({
                data: nextProps.value,
            })
        }
    }

    onDishesChange(value, k) {
        const { data } = this.state;
        if (value.length == 0) {
            data[k].dishesFlag = false;
        } else {
            data[k].dishesFlag = true;
        }
        // save to redux
        data[k].dishes = value;
        data[k].giftName = value.foodName;
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    renderDishsSelectionBox(k) {
        return (
            <FormItem
                validateStatus={this.state.data[k].dishesFlag ? 'success' : 'error'}
                help={this.state.data[k].dishesFlag ? null : '请选择赠送菜品'}
            >
                <EditBoxForDishes
                    stageNum={k}
                    onChange={(value) => {
                        this.onDishesChange(value, k);
                    }}
                />
            </FormItem>

        )
    }

    // 删除一个档次
    remove = (k) => {
        const { data } = this.state;
        delete data[this.uuid];
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
        this.uuid--;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    // 新增一个档次
    add = () => {
        this.uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
        const { data } = this.state;
        data[this.uuid] = {
            stageAmount: '',
            giftType: '0',
            dishes: [],
            giftName: null,
            foodCount: '',
            foodCountFlag: true,
            dishesFlag: true,
            StageAmountFlag: true,
        };
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    onStageAmountChange(value, index) {
        const { data } = this.state;
        data[index].stageAmount = value.number;
        if (!value.number || value.number <= 0) {
            data[index].StageAmountFlag = false;
        } else {
            data[index].StageAmountFlag = true;
        }
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    onFoodCountChange(value, index) {
        const { data } = this.state;
        if (value.number == '' || value.number == null) {
            data[index].foodCountFlag = false
        } else {
            data[index].foodCountFlag = true
        }
        data[index].foodCount = value.number;
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    render() {
        // TODO:initialValue
        const { getFieldDecorator, getFieldValue } = this.props;
        // 满赠取消分档
        const isFullGive = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == 'FOOD_AMOUNT_THEN_GIVE';
        getFieldDecorator('keys', { initialValue: Object.keys(this.state.data) });
        const keys = isFullGive ? [0] : getFieldValue('keys');
        // let keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div className={styles.addGrade} key={index}>
                    <div className="Category-top">
                        <span className={styles.CategoryTitle}>档次{/* {this.props.ruleType == 2||this.props.ruleType == 3 ?parseInt(k)+1:null} */}</span>
                        {// 显示的可操作文字
                            this.props.ruleType == 2 || this.props.ruleType == 3 ? // 满
                (k == this.uuid ? (
                    k == 0 ? (// 满 第一个档次,//满赠取消分档
                        <span className="Category-add" onClick={this.add}>{isFullGive ? null : '添加新档'}</span>
                    ) : (
                        k == 2 ? (
                            <span className="Category-add" onClick={() => this.remove(k)}>删除</span>
                        ) : (// 满 非第一个档次
                            <span>
                                <span className="Category-add" onClick={this.add}>添加新档</span>
                                <span className="Category-add" onClick={() => this.remove(k)}>删除</span>
                            </span>
                        )
                    )
                ) : null) : null

                        }
                    </div>
                    <div className="Category-body">
                        <Row>
                            <Col span={18}>
                                {
                                    this.props.ruleType != '0' ?
                                        <FormItem
                                            className={styles.FormItemStyle}
                                            validateStatus={this.state.data[k].StageAmountFlag ? 'success' : 'error'}
                                            help={this.state.data[k].StageAmountFlag ? null : '请输入金额，必须大于0'}
                                        >
                                            <PriceInput
                                                addonBefore={
                                                    this.props.ruleType == '2' ? '任意菜品消费满' :
                                                        this.props.ruleType == '1' ? '任意菜品消费每满' :
                                                            this.props.ruleType == '3' ? '指定菜品消费满' : '指定菜品消费每满'
                                                }
                                                addonAfter={'元'}
                                                onChange={(val) => { this.onStageAmountChange(val, index) }}
                                                value={{ number: this.state.data[k].stageAmount }}
                                                modal="float"
                                            />
                                        </FormItem> : null
                                }
                            </Col>
                            <Col span={this.props.ruleType == '0' ? 24 : 5} offset={this.props.ruleType == '0' ? 0 : 1}>
                                <FormItem
                                    className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                    validateStatus={this.state.data[k].foodCountFlag ? 'success' : 'error'}
                                    help={this.state.data[k].foodCountFlag ? null : '请输入赠送份数'}
                                >
                                    <PriceInput
                                        addonBefore={this.props.ruleType == '0' ? '下单即赠送' : '赠送'}
                                        addonAfter={'份'}
                                        onChange={(val) => { this.onFoodCountChange(val, index) }}
                                        value={{ number: this.state.data[k].foodCount }}
                                        modal="int"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <div >
                            <FormItem required={true}>
                                <span className={styles.spanText}>赠送菜品 </span>
                            </FormItem>

                        </div>
                        <div >
                            <div className="Category-list" style={{ marginBottom: 0 }}>
                                {this.renderDishsSelectionBox(k)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });


        return (
            <div>
                {formItems}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.promotionDetailInfo_NEW,
        promotionBasicInfo: state.promotionBasicInfo_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AddGrade);
