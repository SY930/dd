import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Form,
    Radio,
    Table,
    Row,
    Col,
    Tooltip,
    Popconfirm,
} from 'antd';
import styles from '../ActivityPage.less';
import FoodSelector from '../../../components/common/FoodSelector'
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import PriceInput from '../common/PriceInput';

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
            scope.scopeType == 1 && categories.push({value: `${scope.brandID || 0}__${scope.targetName}`, discountRate: scope.discountRate || undefined})
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

class NoThresholdDiscountFoodSelector extends Component {

    constructor(props) {
        super(props);
        if (props.dishOnly) {
            const {
                dishes,
            } = getDishesInfoFromPriceOrScopeList(props.priceLst) // 只取初始值
            this.state = {
                categoryOrDish: 1,
                selectorModalVisible: false,
                dishes,
                categories: [],
                excludeDishes: [],
                foodCategory: [],
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
                categories, // [{value, discountRate}]
                excludeDishes,
                foodCategory: [], // table datasource
            }
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 50,
                className: 'TableTxtCenter',
                render: (text) => `${text + 1}`,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(record)}>
                                <a title="删除" alt="删除">删除</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
            {
                title: '品牌',
                dataIndex: 'brandName',
                key: 'brandName',
                width: 72,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: '分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: '折扣（折）',
                width: 80,
                dataIndex: 'discountRate',
                key: 'discountRate',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInput
                                maxNum={1}
                                modal="float"
                                placeholder="默认折扣"
                                value={{ number: record.discountRate }}
                                onChange={(val) => { this.onCellChange(val, record) }}
                            />
                        </span>
                    )
                },
            },
        ];
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
            categories: selectedCategoryObj,
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
            const categoryObjects = selectedCategoryObj.reduce((acc, curr) => {
                const category = categories.find(item => item.value === curr.value);
                category && acc.push({...category, discountRate: curr.discountRate})
                return acc;
            }, [])
            this.setState({
                foodCategory: categoryObjects,
            })
            this.props.onChange({
                categoryOrDish,
                dishes: [],
                excludeDishes: excludeDishObjects,
                foodCategory: categoryObjects,
            })
        }
    }
    handleDel = (record) => {
        const categories = [...this.state.categories];
        categories.splice(record.index, 1);
        this.setState({
            categories,
            excludeDishes: this.getExcludeDishesAfterCategoryChange(categories.map(item => item.value)),
        }, () => {
            this.mapSelectedValueToObjectsThenEmit()
        })
    };
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
    onCellChange = (val, {index}) => {
        const categories = [...this.state.categories];
        categories[index].discountRate = val.number;
        this.setState({
            categories,
        }, () => this.mapSelectedValueToObjectsThenEmit())
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
    getExcludeDishesAfterCategoryChange = (categories) => {
        // 当分类发生变动时，要把属于被去掉分类下的排除菜品也去掉
        let excludeDishes = this.state.excludeDishes.slice();
        if (categories.length) {
            const {
                allBrands,
                allCategories,
                allDishes,
            } = this.props;
            const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
            excludeDishes = dishes
                .filter(({value: dishValue, localFoodCategoryID, onlineFoodCategoryID}) =>
                    excludeDishes.includes(dishValue) &&
                    (categories.includes(localFoodCategoryID) || categories.includes(onlineFoodCategoryID)))
                .map(item => item.value);
        }
        return excludeDishes;
    }
    handleExcludeDishChange = (value) => {
        this.setState({
            dishes: [],
            excludeDishes: value,
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
        })
    }
    handleModalOk = (v) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { categories } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const categoryObjects = v.reduce((acc, curr) => {
            const categoryObj = categories.find(item => item.value === curr);
            if (categoryObj) {
                const reservedCategory = this.state.categories.find(item => item.value === categoryObj.value);
                acc.push(reservedCategory ? {...categoryObj, discountRate: reservedCategory.discountRate} : categoryObj)
            }
            return acc;
        }, [])
        this.setState({
            selectorModalVisible: false,
            categories: categoryObjects,
            excludeDishes: this.getExcludeDishesAfterCategoryChange(v),
        }, () => {
            this.mapSelectedValueToObjectsThenEmit()
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
    renderFoodSelectorModal() {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        const initialValue = this.state.categories.map((item) => item.value);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="category"
                initialValue={initialValue}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }
    handleModalCancel = () => {
        this.setState({
            selectorModalVisible: false,
        })
    }
    handleModalOpen = () => {
        this.setState({
            selectorModalVisible: true,
        })
    }
    renderCategorySelectionBox() {
        const {
            allBrands,
            allCategories,
            allDishes,
            dishFilter,
            showExludeDishes,
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
        const categoryValues = this.state.categories.map(item => item.value);
        if (this.state.categories.length) { // 如果已选分类，排除菜品只能从当中选择
            filteredCategories = filteredCategories.filter(({value}) => categoryValues.includes(value))
            filteredDishes = filteredDishes.filter(({localFoodCategoryID: value, onlineFoodCategoryID}) => 
            categoryValues.includes(value) || categoryValues.includes(onlineFoodCategoryID))
            filteredBrands = filteredBrands.filter(brand => filteredCategories.some(cat => cat.brandID === brand.brandID))
        }
        if (dishFilter) {
            filteredDishes = dishFilter(filteredDishes) 
        }
        const displayDataSource = this.state.foodCategory.map((item, index) => ({...item, index}))
        return (
            <div>
                <FormItem className={styles.FormItemStyle}>
                    <Row>
                        <Col span={4}>
                            <div style={{ textAlign: 'right', paddingRight: 8 }} className={styles.gTitle}>选择菜品分类</div>
                        </Col>
                        <Col span={4} offset={13}>
                            <a
                                className={styles.gTitleLink}
                                onClick={this.handleModalOpen}
                            >
                                批量添加
                            </a>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={17} offset={4}>
                            <Table
                                bordered={true}
                                dataSource={displayDataSource}
                                columns={this.columns}
                                pagination={{ size: 'small', pageSize: 10 }}
                            />
                        </Col>
                    </Row>
                    {this.state.selectorModalVisible && this.renderFoodSelectorModal()}
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
NoThresholdDiscountFoodSelector.defaultProps = {
    showExludeDishes: true,
    dishOnly: false,
    dishLabel: '适用菜品',
    /** 分类/菜品框是否显示required红色星号 */
    showRequiredMark: false,
    /** 是否显示不选等于全选的文案 */
    showEmptyTips: false,
};

export default connect(mapStateToPropsForPromotion)(NoThresholdDiscountFoodSelector)
