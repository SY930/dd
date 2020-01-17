import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import FoodSelector from '../../../components/common/FoodSelector/ShopFoodSelector'
import FoodSelectModal from '../../../components/common/FoodSelector/ShopFoodSelectModal'
import {
    memoizedShopCategoriesAndDishes,
} from '../../../utils';
import PriceInput from '../common/PriceInput';
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
            scope.scopeType == 1 && categories.push({value: `${scope.targetName}`, discountRate: scope.discountRate || undefined})
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
class NoThresholdDiscountFoodSelectorForShop extends Component {

    constructor(props) {
        super(props);
        const { intl } = props;
        const k5gfsugb = intl.formatMessage(SALE_STRING.k5gfsugb);
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
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'index',
                key: 'index',
                width: 50,
                className: 'TableTxtCenter',
                render: (text) => `${text + 1}`,
            },
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(record)}>
                                <a title={ COMMON_LABEL.delete }>{ COMMON_LABEL.delete }</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
            {
                title: k5gfsugb,
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5ezcu1b,
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
                                placeholder=""
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
            excludeDishes: [],
        }, () => {
            this.mapSelectedValueToObjectsThenEmit()
        })
    };
    componentDidUpdate(prevProps) {
        if (this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapSelectedValueToObjectsThenEmit()
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
    handleModalOk = (v) => {
        const {
            allCategories,
            allDishes,
        } = this.props;
        const { categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes);
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
            excludeDishes: [],
        }, () => {
            this.mapSelectedValueToObjectsThenEmit()
        })
    }
    renderPromotionRange = () => {
        const { intl } = this.props;
        const k5gfsugb = intl.formatMessage(SALE_STRING.k5gfsugb);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
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
    renderFoodSelectorModal() {
        const {
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        const initialValue = this.state.categories.map((item) => item.value);
        return (
            <FoodSelectModal
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
        const { intl } = this.props;
        const k5gfsugb = intl.formatMessage(SALE_STRING.k5gfsugb);
        const {
            allCategories,
            allDishes,
            dishFilter,
            showExludeDishes,
            showEmptyTips,
        } = this.props;
        let { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        let filteredCategories = categories;
        let filteredDishes = dishes;
        const categoryValues = this.state.categories.map(item => item.value);
        if (this.state.categories.length) { // 如果已选分类，排除菜品只能从当中选择
            filteredCategories = filteredCategories.filter(({value}) => categoryValues.includes(value))
            filteredDishes = filteredDishes.filter(({localFoodCategoryID: value, onlineFoodCategoryID}) =>
            categoryValues.includes(value) || categoryValues.includes(onlineFoodCategoryID))
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
                        <div style={{ textAlign: 'right', paddingRight: 8 }} className={styles.gTitle}>{k5gfsugb}</div>
                        </Col>
                        <Col span={4} offset={13}>
                            <a
                                className={styles.gTitleLink}
                                onClick={this.handleModalOpen}
                            >
                                {SALE_LABEL.k5gfsv5b}
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
                            {SALE_LABEL.k5gfsvub}
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
NoThresholdDiscountFoodSelectorForShop.defaultProps = {
    showExludeDishes: true,
    dishOnly: false,
    dishLabel: '',
    /** 分类/菜品框是否显示required红色星号 */
    showRequiredMark: false,
    /** 是否显示不选等于全选的文案 */
    showEmptyTips: false,
};

export default connect(mapStateToPropsForPromotion)(NoThresholdDiscountFoodSelectorForShop)
