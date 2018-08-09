/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-15T10:50:38+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotionDetailSetting.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-05-08T16:23:33+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import { connect } from 'react-redux';

import { Form, Radio, Tree } from 'antd';
import styles from '../ActivityPage.less';

import { saleCenterSetPromotionDetailAC, fetchFoodCategoryInfoAC, fetchFoodMenuInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import CloseableTip from "../../../components/common/CloseableTip/index";

const Immutable = require('immutable');

const FormItem = Form.Item;

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

// TODO: delete the line, rebase test

const PROMOTION_OPTIONS = Object.freeze([
    {
        key: 0,
        value: 0,
        name: '按分类选择',
    }, {
        key: 1,
        value: 1,
        name: '按单品选择',
    },
]);

class PromotionDetailSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 活动范围
            categoryOrDish: 0,
            selectedCategory: [],
            selectedDishes: [],
            excludeDishes: [],

            foodCategoryCollection: [], // 存储所有相关数据
            // 弹框
            foodCategoryOptions: [],
            foodCategorySelections: new Set(),
            foodCategoryCurrentSelections: [],

            excludeOptions: [],
            excludeSelections: new Set(),
            excludeCurrentSelections: [],

            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
            scopeFlag: false,

        };

        this.renderPromotionRange = this.renderPromotionRange.bind(this);
        this.renderCategorySelectionBox = this.renderCategorySelectionBox.bind(this);
        // this.renderDishsSelectionBox = this.renderDishsSelectionBox.bind(this);
        // this.renderExcludedFoodMenu = this.renderExcludedFoodMenu.bind(this);
        this.handleCategoryOrDishChange = this.handleCategoryOrDishChange.bind(this);
        this.handleFoodCategoryTreeNodeChange = this.handleFoodCategoryTreeNodeChange.bind(this);
        this.handleFoodCategoryGroupSelect = this.handleFoodCategoryGroupSelect.bind(this);
        this.handleFoodCategorySelectedChange = this.handleFoodCategorySelectedChange.bind(this);
        this.handleFoodCategoryEditorBoxChange = this.handleFoodCategoryEditorBoxChange.bind(this);
        this.handleFoodCategorySearchInputChange = this.handleFoodCategorySearchInputChange.bind(this);
        this.handleExcludeTreeNodeChange = this.handleExcludeTreeNodeChange.bind(this);
        this.handleExcludeGroupSelect = this.handleExcludeGroupSelect.bind(this);
        this.handleExcludeSelectedChange = this.handleExcludeSelectedChange.bind(this);
        this.handleExcludeEditorBoxChange = this.handleExcludeEditorBoxChange.bind(this);
        this.handleExcludeSearchInputChange = this.handleExcludeSearchInputChange.bind(this);
        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodEditorBoxChange = this.handleFoodEditorBoxChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialData = this.initialData.bind(this);
        this.filterGroup = this.filterGroup.bind(this);
    }

    initialData(_scopeLst, foodCategoryCollection) {
        if (_scopeLst === undefined || foodCategoryCollection === undefined) {
            return
        }
        if (_scopeLst.length == 0 || foodCategoryCollection.length == 0) {
            return
        }
        const { foodCategorySelections, foodSelections, excludeSelections } = this.state;
        if (_scopeLst.length > 0) {
            let categoryOrDish = 0;
            _scopeLst.map((scope) => {
                if (scope.scopeType == '1') {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .find((category) => {
                                    if (category.foodCategoryID == scope.targetID || category.foodCategoryName == scope.foodCategoryName) {
                                        categoryOrDish = 0;
                                        foodCategorySelections.add(category);
                                    }
                                });
                        });
                }
                if (scope.scopeType == '4') {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .forEach((category) => {
                                    category.foods
                                        .find((menu) => {
                                            if (menu.itemID == scope.targetID) {
                                                categoryOrDish = 0;
                                                excludeSelections.add(menu);
                                            }
                                        });
                                })
                        });
                }
                if (scope.scopeType == '2') {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .forEach((category) => {
                                    category.foods
                                        .find((menu) => {
                                            if (menu.itemID == scope.targetID || (menu.foodName + menu.unit) == scope.foodNameWithUnit) {
                                                categoryOrDish = 1;
                                                foodSelections.add(menu);
                                            }
                                        });
                                })
                        });
                }
            });

            this.setState({
                categoryOrDish,
                foodCategorySelections,
                foodSelections,
                excludeSelections,
            });
            this.props.setPromotionDetail({
                foodCategory: Array.from(foodCategorySelections),
                excludeDishes: Array.from(excludeSelections),
                dishes: Array.from(foodSelections),
                categoryOrDish,
            });
        }
    }
    // 过滤套餐
    filterGroup(foodCategoryCollection) {
        if (foodCategoryCollection) {
            return foodCategoryCollection.map((city) => {
                return {
                    ...city,
                    foodCategoryName: city.foodCategoryName.map((category) => {
                        return {
                            ...category,
                            foods: category.foods.filter((food) => {
                                return food.isSetFood != '1' && food.isTempFood != '1' && food.isTempSetFood != '1'
                            }),
                        }
                    }),
                }
            });
        }
        return []
    }
    componentDidMount() {
        var opts = {
            _groupID: this.props.user.accountInfo.groupID,
        };
        // autoFetch只有菜品优惠券才发请求
        this.props.autoFetch && this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.autoFetch && this.props.fetchFoodMenuInfo({ ...opts });

        const promotionDetailInfo = this.props.promotionDetailInfo.get('$promotionDetail').toJS();
        const _scopeLst = Immutable.List.isList(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst'])) ?
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS() : [];
        let foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        // 当为第二份打折时，过滤套餐
        if (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType === '1050') {
            foodCategoryCollection = this.filterGroup(foodCategoryCollection);
        }
        this.setState({
            categoryOrDish: promotionDetailInfo.categoryOrDish,
            scopeLst: _scopeLst,
            foodCategoryCollection,
        }, () => {
            this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
        });
        if (this.props.catOrFoodValue) {
            const _scopeLst2 = this.props.catOrFoodValue;
            this.setState({
                scopeLst: _scopeLst2,
            }, () => {
                this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
            });
            this.props.onChange && this.props.onChange({
                foodCategory: _scopeLst2,
                dishes: _scopeLst2,
                categoryOrDish: _scopeLst2[0] ? (_scopeLst2[0].scopeType == '1' ? '0' : '1') : '0',
            })
        }
    }

    // TODO:第二次进入不执行ReceiveProps,state里没有数据
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.get('foodCategoryCollection') !=
            this.props.promotionDetailInfo.get('foodCategoryCollection')) {
            let foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();
            // 当为第二份打折时，过滤套餐
            if (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType === '1050') {
                foodCategoryCollection = this.filterGroup(foodCategoryCollection);
            }
            this.setState({
                foodCategorySelections: new Set(),
                foodSelections: new Set(),
                excludeSelections: new Set(),
                foodCategoryCollection,
            }, () => {
                this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
            });
        }
        if (nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst'])) {
            const _scopeLst = Immutable.List.isList(nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst'])) ?
                nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS() : [];
            this.setState({
                scopeLst: _scopeLst,
            }, () => {
                this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
            });
        }
    }

    handleCategoryOrDishChange(e) {
        // TODO: add the bottom to the finish
        if (e.target.value == 0) {
            const { foodSelections } = this.state;
            foodSelections.clear();
            this.setState({
                categoryOrDish: e.target.value,
                foodSelections,
            });
            this.props.setPromotionDetail({
                categoryOrDish: e.target.value,
                scopeLst: [],
                dishes: [],
                priceLst: [],
                foodCategory: [],
                excludeDishes: [],
            });
        }
        // 菜品
        else {
            const { foodCategorySelections, excludeSelections } = this.state;
            foodCategorySelections.clear();
            excludeSelections.clear();
            this.setState({
                categoryOrDish: e.target.value,
                foodCategorySelections,
                excludeSelections,
            });
            this.props.setPromotionDetail({
                categoryOrDish: e.target.value,
                scopeLst: [],
                dishes: [],
                priceLst: [],
                foodCategory: [],
                excludeDishes: [],
            });
        }
        this.props.onChange && this.props.onChange({
            foodCategory: [],
            dishes: [],
            categoryOrDish: `${e.target.value}`,
        })
        // save to redux
    }
    // 活动范围
    renderPromotionRange() {
        const $promotionDetailInfo = this.props.promotionDetailInfo.get('$promotionDetail');
        return (

            <FormItem
                label={this.props.radioLabel ? this.props.radioLabel : '指定菜品'}
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 17,
                }}
            >
                <RadioGroup
                    value={
                        $promotionDetailInfo.get('categoryOrDish') ?
                            $promotionDetailInfo.get('categoryOrDish') : 0
                    }
                    onChange={this.handleCategoryOrDishChange}
                >
                    {PROMOTION_OPTIONS.map((type) => {
                        return (<Radio key={type.value} value={type.value}>{type.name}</Radio >);
                    })}
                </RadioGroup >
                {this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '2020' && <CloseableTip content={
                    <div>
                        <p>指定菜品：</p>
                        <p>当未选择任何分类及菜品时，会根据基本档菜品库菜品是否设置了参与打折来执行。即：所有设置了参与打折的菜品都在活动参与范围</p>
                        <p>当选择了适用菜品，则活动按照设置的菜品执行，不再受基本档菜品是否参与打折的设置影响</p>
                    </div>
                } />}
            </FormItem>

        );
    }

    onCategoryChange(value) {
        // 对 excludeDishes 进行过滤。 用户先点排除菜品,后设置分类
        // TODO: add category id to dish {id: **, content: **, categoryID: **}
        let filteredExcludeDishes;
        if (value.length === 0) {
            filteredExcludeDishes = [];
        } else {
            filteredExcludeDishes = this.state.excludeDishes
                .filter((dish) => {
                    return value.filter((categoryItem) => {
                        if (undefined === categoryItem.foods) {
                            return false;
                        }
                        return categoryItem.foods.filter((food) => {
                            return food.id === dish.id;
                        }).length;
                    }).length;
                });
        }

        this.setState({
            selectedCategory: value,
            excludeDishes: filteredExcludeDishes,
        });

        this.props.setPromotionDetail({
            foodCategory: value.map((foodCategoryItem) => {
                return {
                    id: foodCategoryItem.id,
                    content: foodCategoryItem.content,
                    ...foodCategoryItem,
                };
            }),
        });
    }

    renderCategorySelectionBox() {
        const treeData = this.state.foodCategoryCollection;

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item === 'object') {
                        return <TreeNode key={index} title={item.foodCategoryGroupName.content} />;
                    }
                });
            }
            return null;
        };
        return (
            <div>
                <FormItem label="适用菜品分类" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <div className={styles.treeSelectMain}>
                        <HualalaEditorBox
                            label={'适用菜品分类'}
                            itemName="foodCategoryName"
                            itemID="foodCategoryID"
                            data={this.state.foodCategorySelections}
                            onChange={(value) => {
                                this.handleFoodCategoryEditorBoxChange(value)
                            }}
                            onTagClose={(value) => { this.handleFoodCategorySelectedChange(value) }}
                        >
                            <HualalaTreeSelect level1Title={'全部菜品分类'}>
                                <HualalaSearchInput onChange={(value) => {
                                    this.handleFoodCategorySearchInputChange(value)
                                }}
                                />
                                <Tree onSelect={(value) => {
                                    this.handleFoodCategoryTreeNodeChange(value)
                                }}
                                >
                                    {loop(treeData)}
                                </Tree>

                                <HualalaGroupSelect
                                    options={this.state.foodCategoryOptions}
                                    labelKey="foodCategoryName"
                                    valueKey="foodCategoryID"
                                    value={this.state.foodCategoryCurrentSelections}
                                    onChange={(value) => {
                                        this.handleFoodCategoryGroupSelect(value)
                                    }}
                                />
                                <HualalaSelected
                                    itemName="foodCategoryName"
                                    selectdTitle={'已选菜品分类'}
                                    value={this.state.foodCategorySelections}
                                    onChange={(value) => { this.handleFoodCategorySelectedChange(value) }}
                                    onClear={() => this.clear('foodCategory')}
                                />

                            </HualalaTreeSelect>
                        </HualalaEditorBox>
                    </div>
                </FormItem>
                {
                    this.props.noExclude ? null : this.renderExcludedFoodMenu()
                }
            </div>
        );
    }

    renderExcludedFoodMenu() {
        const treeData = [];
        if (this.state.foodCategorySelections.size > 0) {
            this.state.foodCategorySelections.forEach((item) => {
                if (typeof item === 'object') {
                    treeData.push(item)
                }
            });
        } else {
            this.state.foodCategoryCollection.map((item) => {
                if (typeof item === 'object') {
                    item.foodCategoryName.map((cate) => {
                        treeData.push(cate)
                    })
                }
            });
        }

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item === 'object') {
                        return <TreeNode key={index} title={item.foodCategoryName} />;
                    }
                });
            }
            return null;
        };

        return (
            <div>
                <FormItem label="排除菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <div className={styles.treeSelectMain}>
                        <HualalaEditorBox
                            label={'排除菜品'}
                            itemName="foodName+unit"
                            itemID="itemID"
                            data={this.state.excludeSelections}
                            onChange={(value) => {
                                this.handleExcludeEditorBoxChange(value)
                            }}
                            onTagClose={(value) => { this.handleExcludeSelectedChange(value) }}
                        >
                            <HualalaTreeSelect level1Title={'全部菜品'}>
                                <HualalaSearchInput onChange={(value) => {
                                    this.handleExcludeSearchInputChange(value)
                                }}
                                />
                                <Tree onSelect={(value) => {
                                    this.handleExcludeTreeNodeChange(value)
                                }}
                                >
                                    {loop(treeData)}
                                </Tree>

                                <HualalaGroupSelect
                                    options={this.state.excludeOptions}
                                    labelKey="foodName+unit"
                                    valueKey="itemID"
                                    value={this.state.excludeCurrentSelections}
                                    onChange={(value) => {
                                        this.handleExcludeGroupSelect(value)
                                    }}
                                />
                                <HualalaSelected
                                    itemName="foodName+unit"
                                    selectdTitle={'已选排除菜品'}
                                    value={this.state.excludeSelections}
                                    onChange={(value) => { this.handleExcludeSelectedChange(value) }}
                                    onClear={() => this.clear('exclude')}
                                />
                            </HualalaTreeSelect>
                        </HualalaEditorBox>
                    </div>
                </FormItem>
            </div>
        );
    }

    renderDishsSelectionBox() {
        const treeData = [];
        this.state.foodCategoryCollection.map((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.map((cate) => {
                    treeData.push(cate)
                })
            }
        });

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item === 'object') {
                        return <TreeNode key={index} title={item.foodCategoryName} />;
                    }
                });
            }
            return null;
        };
        return (
            <div>
                <FormItem label="适用菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <div className={styles.treeSelectMain}>
                        <HualalaEditorBox
                            label={'适用菜品'}
                            itemName="foodName+unit"
                            itemID="itemID"
                            data={this.state.foodSelections}
                            onChange={(value) => {
                                this.handleFoodEditorBoxChange(value)
                            }}
                            onTagClose={(value) => { this.handleFoodSelectedChange(value) }}
                        >
                            <HualalaTreeSelect level1Title={'全部菜品'}>
                                <HualalaSearchInput onChange={(value) => {
                                    this.handleFoodSearchInputChange(value)
                                }}
                                />
                                <Tree onSelect={(value) => {
                                    this.handleFoodTreeNodeChange(value)
                                }}
                                >
                                    {loop(treeData)}
                                </Tree>

                                <HualalaGroupSelect
                                    options={this.state.foodOptions}
                                    labelKey="foodName+unit"
                                    valueKey="itemID"
                                    value={this.state.foodCurrentSelections}
                                    onChange={(value) => {
                                        this.handleFoodGroupSelect(value)
                                    }}
                                />
                                <HualalaSelected
                                    itemName="foodName+unit"
                                    selectdTitle={'已选菜品'}
                                    value={this.state.foodSelections}
                                    onChange={(value) => { this.handleFoodSelectedChange(value) }}
                                    onClear={() => this.clear('food')}
                                />
                            </HualalaTreeSelect>
                        </HualalaEditorBox>
                    </div>
                </FormItem>
            </div>
        );
    }

    // 菜品分类
    handleFoodCategorySearchInputChange(value) {
        const { foodCategoryCollection, foodCategorySelections } = this.state;
        if (undefined === foodCategoryCollection) {
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        const allMatchItem = [];
        foodCategoryCollection.forEach((city) => {
            city.foodCategoryName.forEach((category) => {
                const allName = category.foodCategoryMnemonicCode.split(';').join('');
                if (category.foodCategoryMnemonicCode.indexOf(value) !== -1 || category.foodCategoryName.indexOf(value) !== -1 || allName.indexOf(value) !== -1) {
                    allMatchItem.push(category);
                }
            });
        });

        // update currentSelections according the selections
        const foodCategoryCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (foodCategorySelections.has(storeEntity)) {
                foodCategoryCurrentSelections.push(storeEntity.foodCategoryID)
            }
        });

        this.setState({
            foodCategoryOptions: allMatchItem,
            foodCategoryCurrentSelections,
        });
    }

    handleFoodCategoryEditorBoxChange(value) {
        const foodCategorySelections = value;
        const foodCategoryCurrentSelections = [];
        this.state.foodCategoryOptions.forEach((storeEntity) => {
            if (foodCategorySelections.has(storeEntity)) {
                foodCategoryCurrentSelections.push(storeEntity.foodCategoryID)
            }
        });
        this.setState({
            foodCategorySelections: value,
            foodCategoryCurrentSelections,
        }, () => {
            this.props.setPromotionDetail({
                foodCategory: Array.from(this.state.foodCategorySelections),
                excludeDishes: Array.from(this.state.excludeSelections),
                dishes: Array.from(this.state.foodSelections),
                categoryOrDish: this.state.categoryOrDish,
            });
            this.props.onChange && this.props.onChange({
                foodCategory: Array.from(this.state.foodCategorySelections),
                categoryOrDish: this.state.categoryOrDish ? `${this.state.categoryOrDish}` : '0',
            })
        });
    }

    handleFoodCategorySelectedChange(value) {
        let { foodCategorySelections, foodCategoryCurrentSelections, excludeSelections, excludeCurrentSelections, excludeOptions } = this.state;

        if (value !== undefined) {
            foodCategorySelections.delete(value);
            foodCategoryCurrentSelections = foodCategoryCurrentSelections.filter((item) => {
                return item !== value.foodCategoryID;
            })
        }
        if (value.length === 0) {
            this.clear('exclude');
            excludeCurrentSelections = [];
            excludeOptions = [];
        } else {
            excludeSelections
                .forEach((dish) => {
                    if (dish.foodCategoryID == value.foodCategoryID) {
                        excludeSelections.delete(dish);
                        excludeCurrentSelections.splice(excludeCurrentSelections.indexOf(dish.foodCategoryID), 1);
                        excludeOptions.splice(excludeCurrentSelections.indexOf(dish.foodCategoryID), 1);
                    }
                });
        }
        this.setState({
            foodCategorySelections,
            foodCategoryCurrentSelections,
            excludeSelections,
            excludeCurrentSelections,
            excludeOptions,
        });
        this.props.onChange && this.props.onChange({
            foodCategory: Array.from(foodCategorySelections),
            categoryOrDish: this.state.categoryOrDish ? `${this.state.categoryOrDish}` : '0',
        })
        this.props.setPromotionDetail({
            foodCategory: Array.from(foodCategorySelections), // 删尽则空，但是scopeLst不空,需手动清空scopeLst
            excludeDishes: Array.from(excludeSelections),
            scopeLst: [], // 即使清空，选择分类后，提交，后台仍会根据选择和排除菜品生成并返回scopeLst
        });
    }

    handleFoodCategoryGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { foodCategorySelections, foodCategoryOptions, excludeSelections } = this.state;

            foodCategoryOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.foodCategoryID)) {
                    foodCategorySelections.add(shopEntity);
                } else {
                    foodCategorySelections.delete(shopEntity)
                }
            });
            this.setState({
                foodCategoryCurrentSelections: value,
                foodCategorySelections,
                excludeSelections,
            });
        }
    }

    handleFoodCategoryTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = value[0];

        const storeOptions = this.state.foodCategoryCollection[indexArray].foodCategoryName;

        const foodCategoryCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (this.state.foodCategorySelections.has(storeEntity)) {
                foodCategoryCurrentSelections.push(storeEntity.foodCategoryID)
            }
        });

        this.setState({ foodCategoryOptions: storeOptions, foodCategoryCurrentSelections });
    }

    // 排除菜品

    handleExcludeSearchInputChange(value) {
        const { foodCategoryCollection, excludeSelections, foodCategorySelections } = this.state;
        if (undefined === foodCategoryCollection) {
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        const allMatchItem = [];
        const selectedCatIds = Array.from(foodCategorySelections).map((cat) => {
            return cat.foodCategoryID;// 已选适用菜品分类ids
        })
        foodCategoryCollection.forEach((city) => {
            city.foodCategoryName.forEach((category) => {
                category.foods.forEach((food) => {
                    const allName = food.foodMnemonicCode.split(';').join('');
                    if (food.foodMnemonicCode.indexOf(value) !== -1 || food.foodName.indexOf(value) !== -1 || allName.indexOf(value) !== -1) {
                        // allMatchItem.push(food);老版去所有菜品分类去匹配，新版如下，只匹配已选分类中的
                        if (selectedCatIds.length > 0 && selectedCatIds.includes(food.foodCategoryID)) {
                            allMatchItem.push(food);
                        }
                        if (selectedCatIds.length === 0) {
                            allMatchItem.push(food);
                        }
                    }
                })
            });
        });

        // update currentSelections according the selections
        const excludeCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (excludeSelections.has(storeEntity)) {
                excludeCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            excludeOptions: allMatchItem,
            excludeCurrentSelections,
        });
    }

    handleExcludeEditorBoxChange(value) {
        const excludeSelections = value;
        const excludeCurrentSelections = [];
        this.state.excludeOptions.forEach((storeEntity) => {
            if (excludeSelections.has(storeEntity)) {
                excludeCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({
            excludeSelections: value,
            excludeCurrentSelections,
        }, () => {
            this.props.setPromotionDetail({
                foodCategory: Array.from(this.state.foodCategorySelections),
                excludeDishes: Array.from(this.state.excludeSelections),
                dishes: Array.from(this.state.foodSelections),
                categoryOrDish: this.state.categoryOrDish,
            });
        });
    }

    handleExcludeSelectedChange(value) {
        let { excludeSelections, excludeCurrentSelections } = this.state;

        if (value !== undefined) {
            excludeSelections.delete(value);
            excludeCurrentSelections = excludeCurrentSelections.filter((item) => {
                return item !== value.itemID;
            })
        }

        this.setState({
            excludeCurrentSelections,
            excludeSelections,
        });
        this.props.setPromotionDetail({
            excludeDishes: Array.from(excludeSelections),
        });
    }

    handleExcludeGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { excludeSelections, excludeOptions } = this.state;

            excludeOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    excludeSelections.add(shopEntity);
                } else {
                    excludeSelections.delete(shopEntity)
                }
            });
            this.setState({
                excludeCurrentSelections: value,
                excludeSelections,
            });
        }
    }

    handleExcludeTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = parseInt(value[0]);
        const treeData = [];
        if (this.state.foodCategorySelections.size > 0) {
            this.state.foodCategorySelections.forEach((item) => {
                treeData.push(item)
            });
        } else {
            this.state.foodCategoryCollection.map((item) => {
                if (typeof item === 'object') {
                    item.foodCategoryName.map((cate) => {
                        treeData.push(cate)
                    })
                }
            });
        }


        const storeOptions = treeData[indexArray].foods.map((item) => {
            if (typeof item === 'object') {
                return item
            }
            return null;
        });
        const excludeCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (this.state.excludeSelections.has(storeEntity)) {
                excludeCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({ excludeOptions: storeOptions, excludeCurrentSelections });
    }

    // 菜品

    handleFoodSearchInputChange(value) {
        const { foodCategoryCollection, foodSelections } = this.state;
        if (undefined === foodCategoryCollection) {
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        const allMatchItem = [];

        foodCategoryCollection.forEach((city) => {
            city.foodCategoryName.forEach((category) => {
                category.foods.forEach((food) => {
                    const allName = food.foodMnemonicCode.split(';').join('');
                    if (food.foodMnemonicCode.indexOf(value) !== -1 || food.foodName.indexOf(value) !== -1 || allName.indexOf(value) !== -1) {
                        allMatchItem.push(food);
                    }
                })
            });
        });

        // update currentSelections according the selections
        const foodCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections,
        });
    }

    handleFoodEditorBoxChange(value) {
        const foodSelections = value;
        const foodCurrentSelections = [];
        this.state.foodOptions.forEach((storeEntity) => {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({
            foodSelections: value,
            foodCurrentSelections,
        }, () => {
            this.props.setPromotionDetail({
                foodCategory: Array.from(this.state.foodCategorySelections),
                excludeDishes: Array.from(this.state.excludeSelections),
                dishes: Array.from(this.state.foodSelections),
                categoryOrDish: this.state.categoryOrDish,
            });
            this.props.onChange && this.props.onChange({
                dishes: Array.from(this.state.foodSelections),
                categoryOrDish: this.state.categoryOrDish ? `${this.state.categoryOrDish}` : '0',
            })
        });
    }

    handleFoodSelectedChange(value) {
        let { foodSelections, foodCurrentSelections } = this.state;

        if (value !== undefined) {
            foodSelections.delete(value);
            foodCurrentSelections = foodCurrentSelections.filter((item) => {
                return item !== value.itemID;
            })
        }

        this.setState({
            foodCurrentSelections,
            foodSelections,
        });
        this.props.onChange && this.props.onChange({
            dishes: Array.from(foodSelections),
            categoryOrDish: this.state.categoryOrDish ? `${this.state.categoryOrDish}` : '0',
        })
        this.props.setPromotionDetail({
            dishes: Array.from(foodSelections),
            scopeLst: [], // 即使清空，选择分类后，提交，后台仍会根据选择和排除菜品生成并返回scopeLst
        });
    }

    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { foodSelections, foodOptions } = this.state;

            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    foodSelections.add(shopEntity);
                } else {
                    foodSelections.delete(shopEntity)
                }
            });
            this.setState({
                foodCurrentSelections: value,
                foodSelections,
            });
        }
    }

    handleFoodTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = parseInt(value[0]);
        const treeData = [];
        this.state.foodCategoryCollection.map((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.map((cate) => {
                    treeData.push(cate)
                })
            }
        });

        const storeOptions = treeData[indexArray].foods.map((item) => {
            if (typeof item === 'object') {
                return item
            }
            return null;
        });
        const foodCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (this.state.foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({ foodOptions: storeOptions, foodCurrentSelections });
    }

    clear(type) {
        const selection = this.state[`${type}Selections`];
        selection.clear();
        this.setState({
            [`${type}Selections`]: selection,
            [`${type}CurrentSelections`]: [],
        });
        this.props.setPromotionDetail({
            scopeLst: [], // 即使清空，选择分类后，提交，后台仍会根据选择和排除菜品生成并返回scopeLst
        })
    }

    render() {
        const $promotionDetailInfo = this.props.promotionDetailInfo.get('$promotionDetail');
        return (
            <div>
                {this.renderPromotionRange()}
                {
                    $promotionDetailInfo.get('categoryOrDish') ? this.renderDishsSelectionBox($promotionDetailInfo) : this.renderCategorySelectionBox($promotionDetailInfo)
                }
            </div>
        );
    }
}

PromotionDetailSetting.propTypes = {};

PromotionDetailSetting.defaultProps = {};

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user.toJS(),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
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
};
export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetailSetting);
