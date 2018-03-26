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
import styles from '../../SaleCenterNEW/ActivityPage.less';

import { saleCenterSetPromotionDetailAC, fetchFoodCategoryInfoAC, fetchFoodMenuInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';

const Immutable = require('immutable');

const FormItem = Form.Item;

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

// TODO: delete the line, rebase test

const PROMOTION_OPTIONS = Object.freeze([
    {
        value: 2,
        name: '全部',
    },
    {
        value: 1,
        name: '按分类选择',
    }, {
        value: 0,
        name: '按单品选择',
    },
]);
const EXCLUDE_OPTIONS = Object.freeze([
    {
        value: '0',
        name: '无排除菜品',
    },
    {
        value: '1',
        name: '有排除菜品',
    },
]);

class MoreFoodBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 活动范围
            foodSelectType: 2,
            selectedCategory: [],
            selectedDishes: [],
            isExcludeFood: '0',
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
        this.handlefoodSelectTypeChange = this.handlefoodSelectTypeChange.bind(this);
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
        this.renderExcludeRange = this.renderExcludeRange.bind(this);
        this.handleisExcludeFoodChange = this.handleisExcludeFoodChange.bind(this);
    }
    // 将props中的数据匹配到分类，单品，排除框中
    initialData(_scopeLst, foodCategoryCollection) {
        if (_scopeLst === undefined || !_scopeLst || foodCategoryCollection === undefined) {
            return
        }
        if (_scopeLst.length === 0 || foodCategoryCollection.length === 0) {
            return
        }
        const foodCategorySelections = new Set()
        const foodSelections = new Set()
        const excludeSelections = new Set();
        // const { foodCategorySelections, foodSelections, excludeSelections } = this.state;
        if (_scopeLst.length > 0) {
            _scopeLst.forEach((scope) => {
                if (scope.scopeType == 1) {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .forEach((category) => {
                                    if (category.foodCategoryID == scope.targetID || category.foodCategoryName == scope.foodCategoryName) {
                                        foodCategorySelections.add(category); // 返回的已选分类
                                    }
                                });
                        });
                }
                if (scope.scopeType == 4) {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .forEach((category) => {
                                    category.foods
                                        .forEach((menu) => {
                                            if (menu.itemID == scope.targetID) {
                                                excludeSelections.add(menu); // 返回的排除菜品
                                            }
                                        });
                                })
                        });
                }
                if (scope.scopeType == 2) {
                    foodCategoryCollection
                        .forEach((categoryGroup) => {
                            categoryGroup.foodCategoryName
                                .forEach((category) => {
                                    category.foods
                                        .forEach((menu) => {
                                            if (menu.itemID == scope.targetID || (menu.foodName + menu.unit) == scope.foodNameWithUnit) {
                                                foodSelections.add(menu); // 返回的已选单品
                                            }
                                        });
                                })
                        });
                }
            });

            this.setState({
                foodCategorySelections,
                foodSelections,
                excludeSelections,
            }, () => {
                const { foodSelectType, isExcludeFood } = this.state;
                this.props.onChange && this.props.onChange({
                    foodSelectType,
                    foodCategory: Array.from(foodCategorySelections),
                    dishes: Array.from(foodSelections),
                    isExcludeFood,
                    excludeDishes: Array.from(excludeSelections),
                })
            });
        }
    }
    componentDidMount() {
        const opts = {
            _groupID: this.props.user.toJS().accountInfo.groupID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.fetchFoodMenuInfo({ ...opts });
        const foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        if (this.props.scopeLst) {
            const { scopeLst, foodSelectType = 2, isExcludeFood = '0' } = this.props;
            this.setState({
                foodCategoryCollection,
                scopeLst,
                foodSelectType,
                isExcludeFood,
            }, () => {
                this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
            });
        }
    }

    // // TODO:第二次进入不执行ReceiveProps,state里没有数据
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.get('foodCategoryCollection') !==
            this.props.promotionDetailInfo.get('foodCategoryCollection')) {
            const foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();
            this.setState({
                foodCategoryCollection,
            }, () => {
                this.initialData(this.state.scopeLst, this.state.foodCategoryCollection);
            });
        }
    }

    // 渲染活动范围radio
    renderPromotionRange() {
        return (
            <FormItem style={{ marginBottom: -8 }}>
                <RadioGroup
                    value={this.state.foodSelectType}
                    onChange={this.handlefoodSelectTypeChange}
                >
                    {PROMOTION_OPTIONS.map((type) => {
                        return (<Radio key={type.value} value={type.value}>{type.name}</Radio >);
                    })}
                </RadioGroup >
            </FormItem>

        );
    }
    // 点击活动范围radio
    handlefoodSelectTypeChange(e) {
        const { foodSelectType, foodCategorySelections, foodSelections, isExcludeFood, excludeSelections, } = this.state;
        foodSelections.clear();
        foodCategorySelections.clear();
        excludeSelections.clear();
        this.setState({
            foodSelectType: e.target.value,
            foodCategorySelections,
            foodSelections,
            isExcludeFood: '0',
            excludeSelections,
            foodCategoryCurrentSelections: [],
            foodCurrentSelections: [],
            excludeCurrentSelections: [],
        });
        this.props.onChange && this.props.onChange({
            foodSelectType: e.target.value,
            // foodCategory: [],
            // dishes: [],
            isExcludeFood: '0',
            // excludeDishes: [],
            CouponFoodScope: [], // 菜品限制范围类型：1,包含菜品分类;2,包含菜品;3,不包含菜品分类;4不包含菜品
        })
    }

    // 渲染菜品分类modal
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
                <FormItem
                // label="适用菜品分类" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}
                >
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
                {this.renderExcludeRange()}
                {
                    this.state.isExcludeFood == '1' && this.state.foodSelectType == 1 ? this.renderExcludedFoodMenu() : null
                }
            </div>
        );
    }
    // 处理分类搜索框事件
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

    // 点击菜品分类modal左侧分类tree事件
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
    // 点击modal右侧菜品分类，
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
    }

    // 点击菜品分类modal右侧分类checkBox事件
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

    // 处理菜品分类modal确定ok事件
    handleFoodCategoryEditorBoxChange(value) {
        const { foodSelectType, isExcludeFood, excludeSelections, } = this.state;
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
            this.props.onChange && this.props.onChange({
                foodSelectType: 1,
                foodCategory: Array.from(this.state.foodCategorySelections),
                dishes: [],
                isExcludeFood,
                excludeDishes: Array.from(excludeSelections),
            })
        });
    }
    // 删除已选菜品分类事件
    handleFoodCategorySelectedChange(value) {
        let { foodCategorySelections, foodCategoryCurrentSelections, foodSelections, isExcludeFood, excludeSelections, excludeCurrentSelections, excludeOptions } = this.state;

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
            foodSelectType: 1,
            foodCategory: Array.from(foodCategorySelections),
            dishes: [],
            isExcludeFood,
            excludeDishes: Array.from(excludeSelections),
        })
    }

    // 渲染排除菜品radio
    renderExcludeRange() {
        console.log('isExcludeFood', this.state.isExcludeFood)
        return (
            <FormItem style={{ marginBottom: -8, marginTop: 18 }}>
                <RadioGroup
                    value={this.state.isExcludeFood || '0'}
                    onChange={this.handleisExcludeFoodChange}
                >
                    {EXCLUDE_OPTIONS.map((type) => {
                        return (<Radio key={type.value} value={type.value}>{type.name}</Radio >);
                    })}
                </RadioGroup >
            </FormItem>

        );
    }

    // 点击排除菜品范围radio
    handleisExcludeFoodChange(e) {
        const { foodSelectType, foodCategorySelections, isExcludeFood, excludeSelections, } = this.state;
        excludeSelections.clear();
        this.setState({
            isExcludeFood: e.target.value,
            excludeSelections: new Set(),
        });
        this.props.onChange && this.props.onChange({
            foodSelectType: 1,
            foodCategory: Array.from(foodCategorySelections),
            dishes: [],
            isExcludeFood: e.target.value,
            excludeDishes: [],
        })
    }

    // 渲染排除菜品modal
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
                <FormItem style={{ marginBottom: 8 }}>
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
    // 排除菜品搜素
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
    // 排除菜品modal左侧tree点击事件
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
            this.state.foodCategoryCollection.forEach((item) => {
                if (typeof item === 'object') {
                    item.foodCategoryName.forEach((cate) => {
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
    // 排除菜品modal右侧checkBox点击事件
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
    // 排除菜品modal确定事件
    handleExcludeEditorBoxChange(value) {
        const { foodSelectType, foodCategorySelections, isExcludeFood, } = this.state;
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
        });
        this.props.onChange && this.props.onChange({
            foodSelectType: 1,
            foodCategory: Array.from(foodCategorySelections),
            dishes: [],
            isExcludeFood: '1',
            excludeDishes: Array.from(value),
        })
    }
    // 删除排除菜品事件
    handleExcludeSelectedChange(value) {
        let { foodCategorySelections, excludeSelections, excludeCurrentSelections } = this.state;

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
        this.props.onChange && this.props.onChange({
            foodSelectType: 1,
            foodCategory: Array.from(foodCategorySelections),
            dishes: [],
            isExcludeFood: '1',
            excludeDishes: Array.from(excludeSelections),
        });
    }

    // 渲染菜品单品modal
    renderDishsSelectionBox() {
        const treeData = [];
        this.state.foodCategoryCollection.forEach((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.forEach((cate) => {
                    treeData.push(cate)
                })
            }
        });

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    return typeof item === 'object' ? <TreeNode key={index} title={item.foodCategoryName} /> : null
                });
            }
            return null;
        };
        return (
            <div>
                <FormItem style={{ marginBottom: 8 }}>
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

    // 菜品单品搜素事件

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
    // 点击菜品单品左侧tree事件
    handleFoodTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = parseInt(value[0]);
        const treeData = [];
        this.state.foodCategoryCollection.forEach((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.forEach((cate) => {
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

    // 点击菜品单品右侧checkBox事件
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


    // 菜品单品确定ok事件
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
            this.props.onChange && this.props.onChange({
                foodSelectType: 0,
                foodCategory: [],
                dishes: Array.from(this.state.foodSelections),
                isExcludeFood: '0',
                excludeDishes: [],
            })
        });
    }

    // 删除菜品单品事件
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
            foodSelectType: 0,
            foodCategory: [],
            dishes: Array.from(foodSelections),
            isExcludeFood: '0',
            excludeDishes: [],
        })
    }

    // 清除某种已选
    clear(type) {
        const selection = this.state[`${type}Selections`];
        selection.clear();
        this.setState({
            [`${type}Selections`]: selection,
            [`${type}CurrentSelections`]: [],
        });
    }

    render() {
        return (
            <div>
                {this.renderPromotionRange()}
                {
                    this.state.foodSelectType == 0 ? this.renderDishsSelectionBox() :
                        this.state.foodSelectType == 1 ? this.renderCategorySelectionBox() :
                            null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user,
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
export default connect(mapStateToProps, mapDispatchToProps)(MoreFoodBox);
