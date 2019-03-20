import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Radio,
    Tree,
} from 'antd';
import styles from '../ActivityPage.less';
import FoodSelector from '../../../components/common/FoodSelector'
import { expandCategoriesAndDishes } from '../../../utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const mapStateToProps = (state) => {
    return {
        /** 基础营销活动范围中设置的品牌 */
        selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
const PROMOTION_OPTIONS = [
    {
        key: '0',
        value: 0,
        name: '按分类',
    }, {
        key: '1',
        value: 1,
        name: '按菜品',
    },
];

@connect(mapStateToProps)
export default class CategoryAndFoodSelector extends Component {

    constructor() {
        super();
        this.state = {
            categoryOrDish: 0,
        }
    }
    handleCategoryOrDishChange = (value) => {
        this.setState({
            categoryOrDish: value,
        })
    }
    renderPromotionRange() {
        return (
            <FormItem
                label="活动范围"
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 17,
                }}
            >
                <RadioGroup
                    value={this.state.categoryOrDish}
                    onChange={this.handleCategoryOrDishChange}
                >
                    {PROMOTION_OPTIONS.map((type) => {
                        return (<Radio key={type.key} value={type.value}>{type.name}</Radio >);
                    })}
                </RadioGroup >
            </FormItem>

        );
    }
    renderDishsSelectionBox() {
        return (
            <FormItem label="适用菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                <FoodSelector
                    mode="dish"
                    placeholder="点击添加适用菜品"
                    allDishes={[]}
                    allCategories={[]}
                    allBrands={[]}
                    value={[]}
                    onChange={(v) => console.log(v)}
                />
            </FormItem>
        )
    }
    renderCategorySelectionBox() {
        const {
            allBrands,
            allCategories,
            allDishes
        } = this.props;
        const { dishes, categories, brands } = expandCategoriesAndDishes(allBrands, allCategories, allDishes)
        return (
            <div>
                <FormItem label="适用菜品分类" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <FoodSelector
                        mode="category"
                        placeholder="点击添加适用分类"
                        allDishes={dishes}
                        allCategories={categories}
                        allBrands={brands}
                        value={this.state.cats || []}
                        onChange={(v) => this.setState({cats: v})}
                    />
                </FormItem>
                <FormItem label="排除菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <FoodSelector
                        mode="dish"
                        placeholder="点击添加排除菜品"
                        allDishes={dishes}
                        allCategories={categories}
                        allBrands={brands}
                        value={[]}
                        onChange={(v) => console.log(v)}
                    />
                </FormItem>
            </div>
            
        )
    }
    render() {
        return (
            <div>
                {this.renderPromotionRange()}
                {
                    this.state.categoryOrDish == 1 ? this.renderDishsSelectionBox() : this.renderCategorySelectionBox()
                }
            </div>
        );
    }
}
