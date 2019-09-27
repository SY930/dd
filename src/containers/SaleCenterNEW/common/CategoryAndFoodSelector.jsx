import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Radio,
    Tree,
} from 'antd';
import styles from '../ActivityPage.less';
import FoodSelector from '../../../components/common/FoodSelector'
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// 基础营销里的类型与礼品模版中的分类、单品类型是0 1相反的
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
const getFoodInfoFromScopeList = (scopeList) => {
    if (!Array.isArray(scopeList) || !scopeList.length) {
        return {
            categoryOrDish: 0,
            dishes: [],
            categories: [],
            excludeDishes: [],
        }
    }
    let categoryOrDish = null;
    const dishes = [];
    const categories = [];
    const excludeDishes = [];
    scopeList.forEach(scope => {
        if (categoryOrDish === null) {
            categoryOrDish = scope.scopeType == 2 ? 1 : 0
        }
        if (categoryOrDish === 1 && scope.scopeType == 2) { // 单品
            dishes.push(`${scope.brandID || 0}__${scope.targetName}${scope.targetUnitName}`)
        } else if (categoryOrDish === 0 && scope.scopeType != 2) {
            scope.scopeType == 1 && categories.push(`${scope.brandID || 0}__${scope.targetName}`)
            scope.scopeType == 4 && excludeDishes.push(`${scope.brandID || 0}__${scope.targetName}${scope.targetUnitName}`)
        }
    })
    return {
        categoryOrDish,
        dishes,
        categories,
        excludeDishes,
    }
}
const getDishesInfoFromPriceOrScopeList = (priceLst) => {
    if (!Array.isArray(priceLst) || !priceLst.length) {
        return {
            dishes: [],
        }
    }
    return {
        dishes: priceLst.map((item) => item.foodName ? `${item.brandID || 0}__${item.foodName}${item.foodUnitName}`
        : `${item.brandID || 0}__${item.targetName}${item.targetUnitName}`
        )
    }
}

class CategoryAndFoodSelector extends Component {

    constructor(props) {
        super(props);
        if (props.dishOnly) {
            const {
                dishes,
            } = getDishesInfoFromPriceOrScopeList(props.priceLst) // 只取初始值
            this.state = {
                categoryOrDish: 1,
                dishes,
                categories: [],
                excludeDishes: [],
            }
        } else {
            const {
                categories,
                categoryOrDish,
                dishes,
                excludeDishes,
            } = getFoodInfoFromScopeList(props.scopeLst) // 只取初始值
            this.state = {
                categoryOrDish,
                dishes,
                categories,
                excludeDishes,
            }
        }
    }
    componentDidMount() {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            this.mapSelectedValueToObjectsThenEmit()
        }
    }
    mapSelectedValueToObjectsThenEmit = () => {
        const {
            allBrands,
            allCategories,
            allDishes
        } = this.props;
        const { dishes, categories } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const {
            categories: selectedCategoryValues,
            categoryOrDish,
            dishes: selectedDishValues,
            excludeDishes: excludeDishValues,
        } = this.state;
        if (categoryOrDish === 1) {
            const dishObjects = selectedDishValues.reduce((acc, curr) => {
                const dish = dishes.find(item => item.value === curr);
                dish && acc.push(dish)
                return acc;
            }, [])
            this.props.onChange({
                categoryOrDish,
                dishes: dishObjects,
                excludeDishes: [],
                foodCategory: [],
            })
        } else {
            const excludeDishObjects = excludeDishValues.reduce((acc, curr) => {
                const dish = dishes.find(item => item.value === curr);
                dish && acc.push(dish)
                return acc;
            }, [])
            const categoryObjects = selectedCategoryValues.reduce((acc, curr) => {
                const category = categories.find(item => item.value === curr);
                category && acc.push(category)
                return acc;
            }, [])
            this.props.onChange({
                categoryOrDish,
                dishes: [],
                excludeDishes: excludeDishObjects,
                foodCategory: categoryObjects,
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allBrands.size || !prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapSelectedValueToObjectsThenEmit()
            }
        }
        if (this.props.selectedBrands !== prevProps.selectedBrands) {
            if (JSON.stringify(this.props.selectedBrands.toJSON()) !== JSON.stringify(prevProps.selectedBrands.toJSON())) {
                this.setState({
                    dishes: [],
                    categories: [],
                    excludeDishes: [],
                }, () => this.mapSelectedValueToObjectsThenEmit())
            }
        }
    }
    
    handleCategoryOrDishChange = ({target : {value}}) => {
        this.setState({
            categoryOrDish: value,
            dishes: [],
            excludeDishes: [],
            categories: []
        })
        this.props.onChange({
            categoryOrDish: value,
            dishes: [],
            excludeDishes: [],
            foodCategory: []
        })
    }
    handleDishChange = (value) => {
        this.setState({
            dishes: value,
            excludeDishes: [],
            categories: []
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
        })
    }
    handleCategoryChange = (value) => {
        this.setState({
            dishes: [],
            excludeDishes: [],
            categories: value
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
        })
    }
    handleExcludeDishChange = (value) => {
        this.setState({
            dishes: [],
            excludeDishes: value,
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
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
                {this.props.scopeTip}
            </FormItem>

        );
    }
    renderDishsSelectionBox() {
        const {
            allBrands,
            allCategories,
            allDishes,
            dishFilter,
            dishLabel,
            showRequiredMark,
            showEmptyTips,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        if (dishFilter) {
            dishes = dishFilter(dishes)
        }
        if (this.props.dishOnly) {
            return (
                <FoodSelector
                    mode="dish"
                    placeholder={`点击添加${dishLabel}`}
                    allDishes={dishes}
                    allCategories={categories}
                    allBrands={brands}
                    value={this.state.dishes}
                    onChange={this.handleDishChange}
                />
            )
        }
        return (
            <div>
                <FormItem
                    label={dishLabel}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={showRequiredMark}
                >
                    <FoodSelector
                        mode="dish"
                        placeholder={`点击添加${dishLabel}`}
                        allDishes={dishes}
                        allCategories={categories}
                        allBrands={brands}
                        value={this.state.dishes}
                        onChange={this.handleDishChange}
                    />
                </FormItem>
                {
                    (showEmptyTips && this.state.dishes.length === 0) && (
                        <div
                            style={{
                                color: 'orange',
                                paddingLeft: '16.67%',
                                overflow: 'hidden',
                                lineHeight: 1.15,
                            }}
                        >
                            未选择菜品时默认所有菜品适用
                        </div>
                    )
                }
            </div>
        )
    }
    renderCategorySelectionBox() {
        const {
            allBrands,
            allCategories,
            allDishes,
            dishFilter,
            showExludeDishes,
            showRequiredMark,
            showEmptyTips,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        let filteredCategories = categories;
        let filteredDishes = dishes;
        let filteredBrands = brands;
        if (this.state.categories.length) { // 如果已选分类，排除菜品只能从当中选择
            filteredCategories = filteredCategories.filter(({value}) => this.state.categories.includes(value))
            filteredDishes = filteredDishes.filter(({localFoodCategoryID: value, onlineFoodCategoryID}) => 
            this.state.categories.includes(value) ||
            this.state.categories.includes(onlineFoodCategoryID)
        )
            filteredBrands = filteredBrands.filter(brand => filteredCategories.some(cat => cat.brandID === brand.brandID))
        }
        if (dishFilter) {
            filteredDishes = dishFilter(filteredDishes) 
        }
        return (
            <div>
                <FormItem
                    label="适用菜品分类"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={showRequiredMark}
                >
                    <FoodSelector
                        mode="category"
                        placeholder="点击添加适用分类"
                        allDishes={dishes}
                        allCategories={categories}
                        allBrands={brands}
                        value={this.state.categories}
                        onChange={this.handleCategoryChange}
                    />
                </FormItem>
                {
                    (showEmptyTips && this.state.categories.length === 0) && (
                        <div
                            style={{
                                color: 'orange',
                                paddingLeft: '16.67%',
                                overflow: 'hidden',
                                lineHeight: 1.15,
                                marginBottom: 8,
                            }}
                        >
                            未选择分类时默认所有分类适用
                        </div>
                    )
                }
                {
                    showExludeDishes && (
                        <FormItem label="排除菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <FoodSelector
                                mode="dish"
                                placeholder="点击添加排除菜品"
                                allDishes={filteredDishes}
                                allCategories={filteredCategories}
                                allBrands={filteredBrands}
                                value={this.state.excludeDishes}
                                onChange={this.handleExcludeDishChange}
                            />
                        </FormItem>
                    )
                }
            </div>
            
        )
    }
    render() {
        if (this.props.dishOnly) {
            return this.renderDishsSelectionBox()
        }
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
const mapStateToPropsForPromotion = (state) => {
    return {
        /** 基础营销活动范围中设置的品牌 */
        selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
const mapStateToPropsForGift = (state) => {
    return {
        /** 礼品模版中设置的品牌 [{targetID: XXX, targetName: XXX}] */
        selectedBrands: state.sale_editGiftInfoNew
            .getIn(['createOrEditFormData', 'selectBrands'], Immutable.fromJS([]))
            .map(item => `${item.get('targetID')}`),
        /** 礼品模版中查询到的品牌 */
        allBrands: state.sale_editGiftInfoNew.get('allBrands'),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
CategoryAndFoodSelector.defaultProps = {
    showExludeDishes: true,
    dishOnly: false,
    dishLabel: '适用菜品',
    /** 分类/菜品框是否显示required红色星号 */
    showRequiredMark: false,
    /** 是否显示不选等于全选的文案 */
    showEmptyTips: false,
};

export default connect(mapStateToPropsForPromotion)(CategoryAndFoodSelector)
export const GiftCategoryAndFoodSelector = connect(mapStateToPropsForGift)(CategoryAndFoodSelector)
