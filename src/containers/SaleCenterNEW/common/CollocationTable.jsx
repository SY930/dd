/**
 * @Author: chenshuang
 * @Date:   2017-03-29T18:06:22+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:21:01+08:00
 */


import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, Tree, Table, Modal, Form, Icon } from 'antd';

import styles from '../ActivityPage.less';
import PriceInputIcon from './PriceInputIcon'; // 编辑

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
import {
    HualalaTreeSelect,
    HualalaSelected,
    HualalaSearchInput,
} from '../../../components/common';
import HualalaGroupSelectS from './HualalaGroupSelect/index';

class CollocationTable extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            visible: false,
            selectedDishes: [],
            foodCategoryCollection: [], // 存储所有相关数据
            dataSource: [],
            recordInfo: null,
            data: [
                {
                    // foods存放购买菜品的foodInfo
                    foods: [
                        {
                            foodName: '',
                            unit: '份',
                        },
                    ],

                    foodsCountInfo: {}, // 购买菜品对应的count {itemID: countNum}
                    // free存放赠送菜品的foodInfo
                    free: [
                        {
                            foodName: '',
                            unit: '份',
                        },
                    ],
                    freeCountInfo: {}, // 赠送菜品对应的count {itemID: countNum}

                },
            ],
            foodOptions: [],
            foodSelections: new Set(), // treeSelect已选数据
            foodCurrentSelections: [],

            priceLst: [],
            scopeLst: [],
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectDishes = this.selectDishes.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleCountChange = this.handleCountChange.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.sortData = this.sortData.bind(this);
    }

    componentDidMount() {
        const foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        this.setState({
            foodCategoryCollection,
            priceLst: this.props.priceLst,
            scopeLst: this.props.scopeLst,
        }, () => {
            this.sortData(this.state.priceLst, this.state.scopeLst);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.get('foodCategoryCollection') !== this.props.promotionDetailInfo.get('foodCategoryCollection')) {
            const foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();
            this.setState({
                foodCategoryCollection,
            }, () => {
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }
        if (nextProps.priceLst !== this.props.priceLst) {
            this.setState({ priceLst: nextProps.priceLst }, () => {
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }
        if (nextProps.scopeLst !== this.props.scopeLst) {
            this.setState({
                scopeLst: nextProps.scopeLst,
            }, () => {
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }
    }

    sortData(priceLst, scopeLst) {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const { foodCategoryCollection } = this.state;
        const data = [];
        if (priceLst.length === 0 || scopeLst.length === 0 || foodCategoryCollection.length === 0) {
            return
        }
        priceLst.forEach((price) => {
            if (!data[price.stageNo]) {
                data[price.stageNo] = {
                    // foods存放购买菜品的foodInfo
                    foods: [],
                    foodsCountInfo: {}, // 购买菜品对应的count {itemID: countNum}
                    // free存放赠送菜品的foodInfo
                    free: [],
                    freeCountInfo: {}, // 赠送菜品对应的count {itemID: countNum}

                };
            }
            foodCategoryCollection.forEach((categoryGroup) => {
                categoryGroup.foodCategoryName.forEach((category) => {
                    category.foods.find((item) => {
                        if (item.itemID == price.foodUnitID) {
                            data[price.stageNo].free.push(promotionType === '1040' &&
                                (item.isSetFood == '1' || item.isTempFood == '1' || item.isTempSetFood == '1') ? {} : item); // 过滤套餐
                            data[price.stageNo].freeCountInfo[item.itemID] = price.num;
                        }
                    });
                })
            });
            // 如果明明有pricelst却未匹配，说明菜品被库删除，则恢复data数据格式，否则table渲染出无数据，没加号
            if (data[price.stageNo].free.length === 0) {
                data[price.stageNo].free = [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ]
            }
        });

        scopeLst.forEach((scope) => {
            if (!data[scope.stageNo]) {
                data[scope.stageNo] = {
                    // foods存放购买菜品的foodInfo
                    foods: [],

                    foodsCountInfo: {}, // 购买菜品对应的count {itemID: countNum}
                    // free存放赠送菜品的foodInfo
                    free: [],
                    freeCountInfo: {}, // 赠送菜品对应的count {itemID: countNum}

                };
            }
            foodCategoryCollection
                .forEach((categoryGroup) => {
                    categoryGroup.foodCategoryName
                        .forEach((category) => {
                            category.foods
                                .find((item) => {
                                    if (item.itemID == scope.targetID) {
                                        if (data[scope.stageNo].foods.findIndex(food => food.foodKey === item.foodKey) === -1 ) {
                                            data[scope.stageNo].foods.push(item);
                                            data[scope.stageNo].foodsCountInfo[item.itemID] = scope.num;
                                        }
                                    }
                                });
                        })
                });
            // 如果明明有scopeLst却未匹配，说明菜品被库删除，则恢复data数据格式，否则table渲染出无数据，没加号
            if (data[scope.stageNo].foods.length == 0) {
                data[scope.stageNo].foods = [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ]
            }
        });

        this.setState({
            data,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.data);
        });
    }
    // 点击添加菜品操作
    selectDishes(indexInfo) {
        let selections = new Set();
        // 把已选的数据放到foodSelectiions里
        if (indexInfo[3] === '0') { // foods
            if (Object.keys(this.state.data[indexInfo[0]].foods[0]).length !== 2) {
                selections = new Set(this.state.data[indexInfo[0]].foods);
            }
            // 当为搭赠时，恢复套餐
            if (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType === '1040') {
                // 过滤套餐
                const foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
                this.setState({
                    foodCategoryCollection,
                });
            }
        } else if (indexInfo[1] === indexInfo[3]) { // free
            if (this.state.data[indexInfo[0]].free[0] && Object.keys(this.state.data[indexInfo[0]].free[0]).length !== 2) {
                // selections = new Set(this.state.data[indexInfo[0]].free);// 将赠品中套餐为空对象的去掉
                selections = new Set(this.state.data[indexInfo[0]].free.filter((food) => {
                    return Object.keys(food).length > 0
                }));
            } else {
                selections = new Set();
            }
            // 当为搭赠时，过滤套餐
            if (this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType === '1040') {
                // 过滤套餐
                const foodCategoryCollection = this.state.foodCategoryCollection.map((city) => {
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
                })
                this.setState({
                    foodCategoryCollection,
                });
            }
        }
        this.setState({
            visible: true,
            recordInfo: indexInfo,
            foodOptions: [],
            foodSelections: selections,
            foodCurrentSelections: Array.from(selections),
        });
    }
    // 模态框确认事件
    handleOk() {
        // 已选中的菜品, set转成array
        const { foodSelections, recordInfo, data } = this.state;
        // foods
        if (recordInfo[3] == 0) {
            if (foodSelections.size !== 0) {
                data[recordInfo[0]].foods = Array.from(foodSelections);
                // 选中的菜品把count 的默认值设置成1,删除的菜品count删掉
                foodSelections.forEach((food) => {
                    // 已经有count的,不变,没有的设置成1
                    if (data[recordInfo[0]].foodsCountInfo[food.itemID] === undefined) {
                        data[recordInfo[0]].foodsCountInfo[food.itemID] = 1;
                    }
                });

                // 如果菜品已经删除,把count中对应信息也删除
                for (const i in data[recordInfo[0]].foodsCountInfo) {
                    const flag = Array.from(foodSelections).find((food) => {
                        return food.itemID === i
                    });
                    if (flag === undefined) {
                        delete data[recordInfo[0]].foodsCountInfo[i]
                    }
                }
            } else { // 如果选择的菜品为空(清空),回到初始状态
                data[recordInfo[0]].foods = [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ];

                data[recordInfo[0]].foodsCountInfo = {};
            }
        } else if (recordInfo[1] == recordInfo[3]) {
            // free 赠品
            if (foodSelections.size !== 0) {
                data[recordInfo[0]].free = Array.from(foodSelections);
                // 选中的赠送把count 的默认值设置成1

                foodSelections.forEach((food) => {
                    if (data[recordInfo[0]].freeCountInfo[food.itemID] === undefined) {
                        data[recordInfo[0]].freeCountInfo[food.itemID] = 1;
                    }
                });

                for (const i in data[recordInfo[0]].freeCountInfo) {
                    const flag = Array.from(foodSelections).find((food) => {
                        return food.itemID === i
                    });
                    if (flag === undefined) {
                        delete data[recordInfo[0]].freeCountInfo[i]
                    }
                }
            } else {
                data[recordInfo[0]].free = [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ];

                data[recordInfo[0]].freeCountInfo = {};
            }
        }

        this.setState({
            data,
            visible: false,
            // foodOptions: [],
            // foodSelections: new Set(),
            foodCurrentSelections: [],
        }, () => {
            this.props.onChange && this.props.onChange(this.state.data);
        });
    }
    // 取消
    handleCancel() {
        this.setState({
            visible: false,
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
        });
    }
    // 数量变化
    handleCountChange(indexInfo, record, count) {
        const data = this.state.data;

        // food
        if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
            const itemID = record.itemID;
            data[indexInfo[0]].foodsCountInfo[itemID] = count.number>=1 ? count.number : 1;
        }
        // free
        if (parseInt(indexInfo[3]) >= parseInt(indexInfo[1])) {
            const itemID = record.itemID;
            data[indexInfo[0]].freeCountInfo[itemID] = count.number>=1 ? count.number : 1;
        }
        this.setState({
            data,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.data);
        });
    }
    // 菜品选择框
    renderDishesSelectionBox(idx) {
        const { recordInfo } = this.state;
        const isRecommendFood = this.props.type == '5010' && (recordInfo || [])[3] == 0;// 推荐菜的点菜foods
        const recommendFreeMax = this.props.type == '5010' && (recordInfo || [])[3] == 1;// 推荐菜free
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
            <div className={styles.treeSelectMain}>
                <div className={styles.proAll}>
                    <div className={styles.proRight}>
                        <div className={styles.projectIco}>
                            <HualalaTreeSelect level1Title={'全部菜品'}>
                                <HualalaSearchInput onChange={(value) => {
                                    this.handleFoodSearchInputChange(value, idx)
                                }}
                                />
                                <Tree onSelect={(value) => {
                                    this.handleFoodTreeNodeChange(value, idx)
                                }}
                                >
                                    {loop(treeData)}
                                </Tree>

                                <HualalaGroupSelectS
                                    options={this.state.foodOptions}
                                    labelKey="foodName+unit"
                                    valueKey="itemID"
                                    value={this.state.foodCurrentSelections}
                                    onChange={(value) => {
                                        this.handleFoodGroupSelect(value, idx)
                                    }}
                                    isRecommendFood={isRecommendFood}
                                    recommendFreeMax={recommendFreeMax}
                                    foodSelections={Array.from(this.state.foodSelections || [])}
                                />
                                <HualalaSelected
                                    itemName="foodName+unit"
                                    selectdTitle={'已选菜品'}
                                    value={this.state.foodSelections}
                                    onChange={(value) => { this.handleFoodSelectedChange(value, idx) }}
                                    onClear={() => this.clear(idx)}
                                />
                            </HualalaTreeSelect>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // 输入框
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
                    if (food.foodMnemonicCode.indexOf(value) != -1 || food.foodName.indexOf(value) != -1) {
                        allMatchItem.push(food);
                    }
                })
            });
        });

        // update currentSelections according the selections
        const foodCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (Array.from(foodSelections).findIndex(food => food.itemID == storeEntity.itemID) > -1) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections,
        });
    }
    // 单击移除等
    handleFoodSelectedChange(value) {
        const foodSelections = this.state.foodSelections;
        let foodCurrentSelections = this.state.foodCurrentSelections;

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
    }
    // GroupSelect 处理函数
    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const foodSelections = this.state.foodSelections;
            const foodOptions = this.state.foodOptions;
            const selectIds = Array.from(foodSelections).map(select => select.itemID)
            // 进行过滤， 并添加新属性
            foodOptions.forEach((shopEntity) => {
                if (value.includes(Number(shopEntity.itemID)) || value.includes(String(shopEntity.itemID))) {
                    // TODO: 添加
                    shopEntity.newPrice = shopEntity.newPrice || shopEntity.price;
                    !selectIds.includes(shopEntity.itemID) && foodSelections.add(shopEntity);
                } else {
                    shopEntity.newPrice = null;
                    // 重置
                    foodSelections.delete(Array.from(foodSelections).find(select => select.itemID == shopEntity.itemID))
                }
            });
            this.setState({
                foodCurrentSelections: value,
                foodSelections,
            });
        }
    }
    // 左侧树点击处理函数
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
            if ((Array.from(this.state.foodSelections).findIndex(food => food.itemID === storeEntity.itemID) > -1)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: storeOptions,
            foodCurrentSelections,
        });
    }
    // 清空选择器
    clear() {
        const foodSelections = this.state.foodSelections;

        foodSelections.clear();
        this.setState({
            foodSelections,
            foodCurrentSelections: [],
        });
    }
    // 新增一个组合
    addGroup() {
        const { data } = this.state;
        this.props.type == '5010' && data.length >= 50 ? null : data.push(
            {
                foods: [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ],

                foodsCountInfo: {},

                free: [
                    {
                        foodName: '',
                        unit: '份',
                    },
                ],
                freeCountInfo: {},

            }
        );
        this.setState({ data });
    }
    // 移除一个组合
    removeGroup(indexInfo) {
        const { data } = this.state;
        data.splice(indexInfo[0], 1);
        this.setState({ data });
    }

    render() {
        const data = this.state.data;
        const dataSource = [];

        // 拼接成DataSource
        data.forEach((groupItem, index) => {
            const count = groupItem.foods.length;

            const freeCount = groupItem.free.length;
            // key [组合, 购买菜品数, 赠送菜品数, index]
            groupItem.foods.forEach((food, foodIndex) => {
                const temp = { ...food, groupName: `组合${index + 1}`, key: `${index}_${count}_${freeCount}_${foodIndex}` };
                dataSource.push(JSON.parse(JSON.stringify(temp)));
            })
            // 兼容套餐菜品被过滤不渲染表格
            freeCount > 0 ? groupItem.free.forEach((freeFood, freeFoodIndex) => {
                const temp = { ...freeFood, groupName: `组合${index + 1}`, key: `${index}_${count}_${freeCount}_${count + freeFoodIndex}` };
                dataSource.push(JSON.parse(JSON.stringify(temp)));
            }) : dataSource.push({ groupName: `组合${index + 1}`, key: `${index}_${count}_1_${count + 0}` })
        });
        const numInput = {
            title: '数量',
            width: 120,
            dataIndex: 'count',
            key: 'count',
            className: 'noPadding',
            colSpan: 1,
            render: (text, record, index) => {
                let indexInfo = record.key.split('_'),
                    data = this.state.data,
                    count = null;
                // count 如果存在就显示设置的count,不存在显示1
                if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) { // foods
                    const accountInfo = data[indexInfo[0]].foodsCountInfo;
                    if (record.itemID !== undefined) {
                        count = accountInfo[record.itemID] ? accountInfo[record.itemID] : 1;
                    }
                } else { // free
                    const accountInfo = data[indexInfo[0]].freeCountInfo;
                    if (record.itemID !== undefined) {
                        count = accountInfo[record.itemID] ? accountInfo[record.itemID] : 1;
                    }
                }
                return (
                    <span className={styles.rightAlign}>
                        <PriceInputIcon
                            key={`table${index}`}
                            type="text"
                            placeholder="请输入数量"
                            modal="int"
                            value={{ number: count }}
                            index={index}
                            onChange={(val) => {
                                this.handleCountChange(indexInfo, record, val);
                            }}
                        />
                    </span>
                )
            },
        }
        const columns = [
            {
                title: '组合',
                dataIndex: 'collocation',
                key: 'collocation',
                width: 120,
                rowSpan: 2,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    const obj = {
                        children: null,
                        props: {},
                    };

                    const indexInfo = record.key.split('_');
                    // 当只有一个组合的时候,只渲染一个"+"号
                    // 有多个组合时,最后一个组合 渲染 "-"和"+"
                    // 其余的组合 只渲染一个"-"号
                    if (indexInfo[0] == 0 && data.length == 1) {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.plus} type="plus-circle-o" onClick={this.addGroup} />
                                </div>
                            </span>
                        );
                    } else if (indexInfo[0] != data.length - 1 && data.length > 1) {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.delete} type="minus-circle-o" onClick={() => this.removeGroup(indexInfo)} />
                                </div>
                            </span>
                        );
                    } else {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.delete} type="minus-circle-o" onClick={() => this.removeGroup(indexInfo)} />
                                    <Icon className={styles.plus} type="plus-circle-o" onClick={this.addGroup} />
                                </div>
                            </span>
                        );
                    }

                    if (indexInfo[3] == 0) {
                        obj.props.rowSpan = parseInt(indexInfo[1]) + parseInt(indexInfo[2]);
                    } else {
                        obj.props.rowSpan = 0;
                    }


                    return obj;
                },
            },
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: 120,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    const indexInfo = record.key.split('_');
                    // 根据index显示序号
                    if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
                        return <span>{this.props.type == '5010' ? '主菜' : '菜品'}{parseInt(indexInfo[3]) + 1}</span>
                    }
                    return <span>{this.props.type == '5010' ? '推荐菜' : '赠菜'}{parseInt(indexInfo[3]) - parseInt(indexInfo[1]) + 1}</span>
                },
            },
            {
                title: '菜品分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 70,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return record.foodCategoryName || ''
                },
            },
            {
                title: '菜品名称',
                dataIndex: 'foodName',
                key: 'foodName',
                width: 230,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return record.foodName
                },
            },
            {
                title: '规格',
                width: 230,
                dataIndex: 'unit',
                key: 'unit',
                className: 'TableTxtLeft',
                // colSpan:0,
                render: (text, record, index) => {
                    return `${record.prePrice==-1?record.price:record.prePrice || ''}元/${record.unit || '份'}`;
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 120,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    // indexInfo [组合, 购买菜品数, 赠送菜品数, index]
                    const indexInfo = record.key.split('_');

                    const obj = {
                        children: (
                            <div className="editable-row-operations">
                                <span>
                                    <a title="添加菜品" alt="添加菜品" onClick={() => this.selectDishes(indexInfo)}>添加菜品</a>
                                </span>
                            </div>
                        ),
                        props: {},
                    };

                    if (indexInfo[3] == 0) { // 购买菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[1];
                    } else if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0; // 购买菜品其他行的rowSpan = 0
                    } else if (indexInfo[3] == indexInfo[1]) { // 赠送菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[2]
                    } else if (parseInt(indexInfo[3]) > parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0;// 赠送菜品其他行的rowSpan = 0
                    }

                    return obj;
                },
            },
        ];
        this.props.type == '5010' ? null : columns.splice(4, 0, numInput);
        return (
            <FormItem className={[styles.FormItemStyle, styles.noBackground].join(' ')}>
                <Row>
                    <Col>
                        <Table bordered={true} dataSource={dataSource} columns={columns} pagination={false} />
                    </Col>
                </Row>

                <Modal
                    visible={this.state.visible}
                    maskClosable={false}
                    onOk={() => { this.handleOk() }}
                    onCancel={() => { this.handleCancel() }}
                    width="922px"
                    title={this.state.recordInfo && this.state.recordInfo[3] == '0' ? (this.props.type == '5010' ? '选择主菜' : '选择搭售菜品') : (this.props.type == '5010' ? '选择推荐菜' : '选择赠送菜品')}
                >
                    <div>
                        {this.renderDishesSelectionBox()}
                    </div>
                </Modal>

            </FormItem>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
    }
};
export default connect(mapStateToProps)(CollocationTable);
