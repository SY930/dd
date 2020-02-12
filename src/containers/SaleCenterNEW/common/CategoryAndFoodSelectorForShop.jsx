import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Radio,
} from 'antd';
import styles from '../ActivityPage.less';
import FoodSelector from '../../../components/common/FoodSelector/ShopFoodSelector'
import {
    memoizedShopCategoriesAndDishes
} from '../../../utils';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
            dishes.push(`${scope.targetName}${scope.targetUnitName}`)
        } else if (categoryOrDish === 0 && scope.scopeType != 2) {
            scope.scopeType == 1 && categories.push(`${scope.targetName}`)
            scope.scopeType == 4 && excludeDishes.push(`${scope.targetName}${scope.targetUnitName}`)
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
        dishes: priceLst.map((item) => item.foodName ? `${item.foodName}${item.foodUnitName}`
        : `${item.targetName}${item.targetUnitName}`
        )
    }
}
@injectIntl()
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
        if (this.props.allCategories.size && this.props.allDishes.size) {
            this.mapSelectedValueToObjectsThenEmit()
        }
    }
    mapSelectedValueToObjectsThenEmit = () => {
        const {
            allCategories,
            allDishes
        } = this.props;
        const { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
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
        if (this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapSelectedValueToObjectsThenEmit()
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
    handleCategoryChange = (categories) => {
        // 当分类发生变动时，要把属于被去掉分类下的排除菜品也去掉
        let excludeDishes = this.state.excludeDishes.slice();
        if (categories.length) {
            const {
                allCategories,
                allDishes,
            } = this.props;
            const { dishes } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
            excludeDishes = dishes
                .filter(({value: dishValue, localFoodCategoryID, onlineFoodCategoryID}) =>
                    excludeDishes.includes(dishValue) &&
                    (categories.includes(localFoodCategoryID) || categories.includes(onlineFoodCategoryID)))
                .map(item => item.value);
        }
        this.setState({
            dishes: [],
            excludeDishes,
            categories,
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
    renderPromotionRange = () => {
        const { intl } = this.props;
        const k5gfsugb = intl.formatMessage(SALE_STRING.k6hhuayf);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k6hhub6r);
        // 基础营销里的类型与礼品模版中的分类、单品类型是0 1相反的
        const PROMOTION_OPTIONS = [
            {
                key: '0',
                value: 0,
                name: k5gfsugb,
            }, {
                key: '1',
                value: 1,
                name: k5gfsuon,
            },
        ];
        return (
            <FormItem
                label={SALE_LABEL.k5gfsuwz}
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
            allCategories,
            allDishes,
            dishFilter,
            dishLabel = SALE_LABEL.k5gfsvlz,
            showRequiredMark,
            showEmptyTips,
        } = this.props;
        let { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        if (dishFilter) {
            dishes = dishFilter(dishes)
        }
        if (this.props.dishOnly) {
            return (
                <FoodSelector
                    mode="dish"
                    placeholder={`${dishLabel}`}
                    allDishes={dishes}
                    allCategories={categories}
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
                        placeholder={`${dishLabel}`}
                        allDishes={dishes}
                        allCategories={categories}
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
                            {SALE_LABEL.k5gfsvub}
                        </div>
                    )
                }
            </div>
        )
    }
    renderCategorySelectionBox() {
        const {
            allCategories,
            allDishes,
            dishFilter,
            showExludeDishes,
            showRequiredMark,
            showEmptyTips,
        } = this.props;
        let { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        let filteredCategories = categories;
        let filteredDishes = dishes;
        if (this.state.categories.length) { // 如果已选分类，排除菜品只能从当中选择
            filteredCategories = filteredCategories.filter(({value}) => this.state.categories.includes(value))
            filteredDishes = filteredDishes.filter(({localFoodCategoryID: value, onlineFoodCategoryID}) =>
            this.state.categories.includes(value) || this.state.categories.includes(onlineFoodCategoryID))
        }
        if (dishFilter) {
            filteredDishes = dishFilter(filteredDishes)
        }
        return (
            <div>
                <FormItem
                    label={SALE_LABEL.k5m6e53r}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={showRequiredMark}
                >
                    <FoodSelector
                        mode="category"
                        placeholder=""
                        allDishes={dishes}
                        allCategories={categories}
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
                            {SALE_LABEL.k5m4pywe}
                        </div>
                    )
                }
                {
                    showExludeDishes && (
                        <FormItem label={SALE_LABEL.k5gfsvdn} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <FoodSelector
                                mode="dish"
                                placeholder=""
                                allDishes={filteredDishes}
                                allCategories={filteredCategories}
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
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
CategoryAndFoodSelector.defaultProps = {
    showExludeDishes: true,
    dishOnly: false,
    dishLabel: '',
    /** 分类/菜品框是否显示required红色星号 */
    showRequiredMark: false,
    /** 是否显示不选等于全选的文案 */
    showEmptyTips: false,
};

export default connect(mapStateToPropsForPromotion)(CategoryAndFoodSelector)
