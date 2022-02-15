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
    Button,
} from 'antd';
import styles from '../ActivityPage.less';
import FoodSelector from '../../../components/common/FoodSelector'
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import PriceInput from '../common/PriceInput';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

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
        if (scope.stageNo === 0) { // 单品
            dishes.push(`${scope.brandID || 0}__${scope.foodName}${scope.foodUnitName}`)
        } else if (scope.stageNo === -2) {
            excludeDishes.push(`${scope.brandID || 0}__${scope.foodName}${scope.foodUnitName}`)
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
@injectIntl()
class NoThresholdDiscountFoodSelector extends Component {

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
            } = getFoodInfoFromScopeList(props.priceListData) // 只取初始值
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
                render: (text, record, index) => `${index + 1}`,
            },
            {
                title: '线上菜品分类',
                dataIndex: 'foodOnlineCategoryName',
                key: 'foodOnlineCategoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: '菜品名称',
                dataIndex: 'foodName',
                key: 'foodName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: '规格',
                dataIndex: 'unit',
                key: 'unit',
                width: 72,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
        ];
    }
    componentDidMount() {
        let { allBrands, allCategories, allDishes } = this.props
        if ((allBrands && allBrands.size) && (allCategories && allCategories.size) && (allDishes && allDishes.size)) {
            this.mapSelectedValueToObjectsThenEmit()
        }
    }
    mapSelectedValueToObjectsThenEmit = () => {
        const {
            allBrands,
            allCategories,
            allDishes,
            noDish,
            noExclude,
            dishIndex,
        } = this.props;
        const { dishes, categories } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const {
            categories: selectedCategoryObj,
            categoryOrDish,
            dishes: selectedDishValues,
            excludeDishes: excludeDishValues,
        } = this.state;
        // if (categoryOrDish === 1) {
        const dishObjects = selectedDishValues.reduce((acc, curr) => {
            const dish = dishes.find(item => item.value === curr);
            dish && acc.push(dish)
            return acc;
        }, [])
        const excludedDishes = excludeDishValues.reduce((acc, curr) => {
            const dish = dishes.find(item => item.value === curr);
            dish && acc.push(dish)
            return acc;
        }, [])
        // 如果是档位dishes就要更新当前档位的dishes更新[index]
        // 如果是不计入点菜份数则只维护一个。
        const { promotionDetailInfo = {} } = this.props
        const promotionDetail = promotionDetailInfo.toJS()
        if(noDish) {
            this.props.onChange({
                categoryOrDish,
                excludeDishes: excludeDishValues,
                foodCategory: [],
                excludeDishesData: excludedDishes,
            }) 
        }
        if(noExclude) {
            let temp = promotionDetail.dishes
            temp[dishIndex] = dishObjects
            this.props.onChange({
                categoryOrDish,
                dishes: temp,
                // excludeDishes: excludeDishValues,
                foodCategory: [],
                // excludeDishesData: excludedDishes,
            })
        }
        // this.props.onChange({
        //     categoryOrDish,
        //     dishes: dishObjects,
        //     excludeDishes: excludeDishValues,
        //     foodCategory: [],
        //     excludeDishesData: excludedDishes,
        // })
        // } else {
        //     const excludeDishObjects = excludeDishValues.reduce((acc, curr) => {
        //         const dish = dishes.find(item => item.value === curr);
        //         dish && acc.push(dish)
        //         return acc;
        //     }, [])
        //     const categoryObjects = selectedCategoryObj.reduce((acc, curr) => {
        //         const category = categories.find(item => item.value === curr.value);
        //         category && acc.push({ ...category, discountRate: curr.discountRate })
        //         return acc;
        //     }, [])
        //     this.setState({
        //         foodCategory: categoryObjects,
        //     })
        //     this.props.onChange({
        //         categoryOrDish,
        //         dishes: [],
        //         excludeDishes: excludeDishObjects,
        //         foodCategory: categoryObjects,
        //     })
        // }
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
        let { allBrands, allCategories, allDishes } = this.props
        if ((allBrands && allBrands.size) && (allCategories && allCategories.size) && (allDishes && allDishes.size)) {
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
    onCellChange = (val, { index }) => {
        const categories = [...this.state.categories];
        categories[index].discountRate = val.number;
        this.setState({
            categories,
        }, () => this.mapSelectedValueToObjectsThenEmit())
    }

    handleCategoryOrDishChange = ({ target: { value } }) => {
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
                .filter(({ value: dishValue, localFoodCategoryID, onlineFoodCategoryID }) =>
                    excludeDishes.includes(dishValue) &&
                    (categories.includes(localFoodCategoryID) || categories.includes(onlineFoodCategoryID)))
                .map(item => item.value);
        }
        return excludeDishes;
    }
    handleExcludeDishChange = (value) => {
        this.setState({
            // dishes: [],
            excludeDishes: value,
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
        })
    }
    handleModalOk = (v) => {
        this.setState({
            dishes: v,
            // excludeDishes: [],
            categories: []
        }, () => {
            this.mapSelectedValueToObjectsThenEmit();
            this.setState({
                selectorModalVisible: false,
            })
        })
        // const {
        //     allBrands,
        //     allCategories,
        //     allDishes,
        // } = this.props;
        // const { categories } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        // const categoryObjects = v.reduce((acc, curr) => {
        //     const categoryObj = categories.find(item => item.value === curr);
        //     if (categoryObj) {
        //         const reservedCategory = this.state.categories.find(item => item.value === categoryObj.value);
        //         acc.push(reservedCategory ? {...categoryObj, discountRate: reservedCategory.discountRate} : categoryObj)
        //     }
        //     return acc;
        // }, [])
        // this.setState({
        //     selectorModalVisible: false,
        //     categories: categoryObjects,
        //     excludeDishes: this.getExcludeDishesAfterCategoryChange(v),
        // }, () => {
        //     this.mapSelectedValueToObjectsThenEmit()
        // })
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
        const { intl } = this.props;
        const k5gfsvlz = intl.formatMessage(SALE_STRING.k5gfsvlz);
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
            categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        }
        if (dishFilter) {
            dishes = dishFilter(dishes)
        }
        const dishLabel2 = dishLabel || k5gfsvlz;
        if (this.props.dishOnly) {
            return (
                <FoodSelector
                    mode="dish"
                    placeholder={`${dishLabel2}`}
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
                    label={dishLabel2}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={showRequiredMark}
                >
                    <FoodSelector
                        mode="dish"
                        placeholder={`${dishLabel2}`}
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
                            {SALE_LABEL.k5gfsvub}
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
            categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        }
        const initialValue = this.state.categories.map((item) => item.value);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={this.state.dishes}
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
            allBrands,
            allCategories,
            allDishes,
            dishFilter,
            showExludeDishes,
            showEmptyTips,
            noDish,
            noExclude,
        } = this.props;
        const {
            categories: selectedCategoryObj,
            categoryOrDish,
            dishes: selectedDishValues,
            excludeDishes: excludeDishValues,
        } = this.state;
        // if (categoryOrDish === 1) { 
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        }
        let filteredCategories = categories;
        let filteredDishes = dishes;
        let filteredBrands = brands;
        const categoryValues = this.state.categories.map(item => item.value);
        if (this.state.categories.length) { // 如果已选分类，排除菜品只能从当中选择
            filteredCategories = filteredCategories.filter(({ value }) => categoryValues.includes(value))
            filteredDishes = filteredDishes.filter(({ localFoodCategoryID: value, onlineFoodCategoryID }) =>
                categoryValues.includes(value) || categoryValues.includes(onlineFoodCategoryID))
            filteredBrands = filteredBrands.filter(brand => filteredCategories.some(cat => cat.brandID === brand.brandID))
        }
        if (dishFilter) {
            filteredDishes = dishFilter(filteredDishes)
        }
        const displayDataSource = this.state.foodCategory.map((item, index) => ({ ...item, index }))
        const dishObjects = selectedDishValues.reduce((acc, curr) => {
            const dish = dishes.find(item => item.value === curr);
            dish && acc.push(dish)
            return acc;
        }, [])
        // debugger
        return (
            <div>
                {
                    noDish ? null :
                        <FormItem className={styles.FormItemStyle}>
                            <Row>
                                <Col span={4}>
                                    <div style={{ textAlign: 'right', paddingRight: 8 }} className={styles.gTitle}>推荐菜品</div>
                                </Col>
                                {/* <Col span={4} offset={13}> */}
                                <Button
                                    // className={styles.gTitleLink}
                                    onClick={this.handleModalOpen}
                                    style={{
                                        position: 'absolute',
                                        right: 11,
                                    }}
                                >
                                    添加菜品
                                </Button>
                                <Col span={16}>
                                    <Table
                                        bordered={true}
                                        dataSource={dishObjects}
                                        columns={this.columns}
                                        pagination={{ size: 'small', pageSize: 10 }}
                                    />
                                </Col>
                                {/* </Col> */}
                            </Row>
                            {this.state.selectorModalVisible && this.renderFoodSelectorModal()}
                        </FormItem>
                }
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
                            {/* {SALE_LABEL.k5gfsvub} */}
                        </div>
                    )
                }
                {
                    (showExludeDishes && !noExclude) && (
                        <FormItem label={'不计入点菜份数'} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <FoodSelector
                                mode="dish"
                                placeholder=""
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
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail']),
    }
}
NoThresholdDiscountFoodSelector.defaultProps = {
    showExludeDishes: true,
    dishOnly: false,
    dishLabel: '',
    /** 分类/菜品框是否显示required红色星号 */
    showRequiredMark: false,
    /** 是否显示不选等于全选的文案 */
    showEmptyTips: false,
};

export default connect(mapStateToPropsForPromotion)(NoThresholdDiscountFoodSelector)
