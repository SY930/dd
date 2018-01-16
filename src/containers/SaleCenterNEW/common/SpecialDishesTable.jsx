/**
 * @Author: chenshuang
 * @Date:   2017-03-29T18:06:22+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:21:01+08:00
 */


import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import Immutable, { List } from 'immutable';

import { Row, Col, Tree, Table, Input, Popconfirm, message, Modal, Form, Spin } from 'antd';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}
import styles from '../ActivityPage.less';
import ProjectEditBox from '../../../components/basic/ProjectEditBox/ProjectEditBox'; // 编辑

import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,

} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSearchInput, HualalaSelectedTable } from '../../../components/common';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;

class SpecialDishesTable extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            visible: false,
            selectedDishes: [],
            foodCategoryCollection: [], // 存储所有相关数据
            dataSource: [],
            data: [],
            foodOptions: [], // 右上侧列表待选数据
            foodSelections: new Set(), // 已选特色菜
            foodCurrentSelections: [], // 当前备选列表内,已选的特色菜
            priceLst: [],
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);

        this.sortData = this.sortData.bind(this);
        this.filterGroup = this.filterGroup.bind(this);
    }

    componentDidMount() {
        // 从redux中获取特价菜列表
        const _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        // 获取菜品信息
        let foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        foodCategoryCollection = this.filterGroup(foodCategoryCollection);
        this.setState({
            foodCategoryCollection,
            priceLst: _priceLst,
        }, () => {
            this.sortData(this.state.foodCategoryCollection, this.state.priceLst);
        });
    }

    /**
     * tranform foodList to sourceData used by table
     * @param  {Array} foodCategoryCollection 所有菜品信息，按照 组--》类别——》食品 树形结构组织
     * @param  {foodList} foodList   特价菜后台返回列表
     * @return {null}  不返回数据，变更的数据直接通过setState操作保存到组件当中
     */
    sortData(foodCategoryCollection, foodList) {
        if (foodCategoryCollection === undefined || foodList === undefined) {
            return
        }
        // 已选菜品 {foodSelections}，当前复选框中选择的菜品 {foodCurrentSelections}
        const { foodSelections } = this.state;

        // 根据特价菜列表中的foodUnitID，对所有菜品进行匹配过滤，将选中的菜品添加到foodSelections
        // 但是，添加的菜品信息并不包含特价菜的特价信息
        foodList
            .forEach((food) => {
                foodCategoryCollection
                    .forEach((categoryGroup) => {
                        categoryGroup.foodCategoryName
                            .forEach((category) => {
                                category.foods
                                    .find((item) => {
                                        if (item.itemID == food.foodUnitID) {
                                            item.newPrice = food.price;
                                            foodSelections.add(item);
                                        }
                                    });
                            })
                    });
            });
        this.setState({
            foodSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(this.state.foodSelections));
        });
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
    // TODO:第二次进入不执行ReceiveProps,state里没有数据
    componentWillReceiveProps(nextProps) {
        // foodCategoryCollection modified
        if (
            nextProps.promotionDetailInfo.get('foodCategoryCollection') !==
            this.props.promotionDetailInfo.get('foodCategoryCollection')
        ) {
            let foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();
            foodCategoryCollection = this.filterGroup(foodCategoryCollection);
            this.setState({
                foodCategoryCollection,
                foodSelections: new Set(),
            }, () => {
                this.sortData(this.state.foodCategoryCollection, this.state.priceLst);
            });
        }

        // promotionDetail priceLst 特价菜列表发生改变
        if (
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])
        ) {
            const priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
            this.setState({
                priceLst,
            }, () => {
                this.sortData(this.state.foodCategoryCollection, this.state.priceLst)
            })
        }
    }

    renderDishesSelectionBox() {
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
                                <HualalaSelectedTable
                                    itemName="foodName+unit"
                                    selectdTitle={'已选菜品'}
                                    value={this.state.foodSelections}
                                    onChange={(value) => { this.handleFoodSelectedChange(value) }}
                                    onClear={() => this.clear('food')}
                                />
                            </HualalaTreeSelect>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections,
        });
    }

    handleFoodSelectedChange(value) {
        // console.log(value);
    }

    // GroupSelect 处理函数
    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { foodSelections, foodOptions, priceLst } = this.state;

            // 进行过滤， 并添加新属性
            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    // TODO: 添加
                    shopEntity.newPrice = shopEntity.newPrice || shopEntity.price
                    foodSelections.add(shopEntity);
                } else {
                    shopEntity.newPrice = null; // 重置
                    foodSelections.delete(shopEntity)
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
            if (this.state.foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({ foodOptions: storeOptions, foodCurrentSelections });
    }

    clear() {
        const foodSelections = this.state.foodSelections;
        // 清理添加的数据，将newPrice重置为price
        for (const food in foodSelections) {
            foodSelections[food].newPrice = foodSelections[food].price;
        }
        foodSelections.clear();
        this.setState({
            foodSelections,
            foodCurrentSelections: [],
            data: [],
        });
    }

    selectDishes = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.handleCancel();
        const data = Array.from(this.state.foodSelections);
        this.props.onChange && this.props.onChange(data);
    };

    handleCancel=() => {
        this.setState({
            visible: false,
        });
    };

    // 删除一行数据
    handleDel = (text, record, index) => {
        confirm({
            title: '删除特价菜',
            content: (
                <div>
                    您将删除
                    【<span>{record.foodName}</span>】
                    <br />
                    <span>删除是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            footer: null,
            onOk: () => {
                const { foodSelections, foodCurrentSelections } = this.state;

                // 恢复原状态
                record.newPrice = record.price;

                foodSelections.delete(record);
                foodCurrentSelections.splice(foodCurrentSelections.indexOf(record.itemID), 1);
                this.setState({
                    foodSelections,
                    foodCurrentSelections,
                });
                // TODO: useful data foodCurrentSelections
                this.props.onChange && this.props.onChange(Array.from(foodSelections));
            },
            onCancel: () => {},
        });
    };

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                fixed: 'left',
                width: 50,
                className: 'TableTxtCenter',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                fixed: 'left',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <a title="删除" alt="删除" onClick={() => this.handleDel(text, record, index)}>删除</a>
                            </span>
                        </div>
                    );
                },
            },
            {
                title: '菜品',
                dataIndex: 'foodName',
                key: 'foodName',
                fixed: 'left',
                width: 100,
                className: 'TableTxtLeft',
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: 50,
                className: 'TableTxtCenter',
            },
            {
                title: '编码',
                dataIndex: 'foodCode',
                key: 'foodCode',
                className: 'TableTxtCenter',
            },
            {
                title: '分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                className: 'TableTxtLeft',
            },
            {
                title: '原价格(元)',
                dataIndex: 'price',
                key: 'price',
                width: 80,
                className: 'TableTxtRight',
            },
            {
                title: '打折比例(%)',
                dataIndex: 'salePercent',
                key: 'salePercent',
                width: 90,
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return record.newPrice == -1 ? '' : `${(record.newPrice / record.price * 100).toFixed(2)}%`
                },
            },
            {
                title: '特价(元)',
                width: 80,
                dataIndex: 'newPrice',
                key: 'newPrice',
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return record.newPrice == -1 ? '' : record.newPrice
                },
            },
        ];


        const data = Array.from(this.state.foodSelections);
        data.forEach((rowItem, index) => {
            rowItem.key = index;
        })
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={2}>
                        <span className={styles.gTitle}>选择菜品</span>
                    </Col>
                    <Col span={4} offset={18}>
                        <a className={styles.gTitleLink} onClick={this.selectDishes}>
                      批量添加菜品
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table bordered={true} dataSource={data} columns={columns} scroll={{ x: 660 }} pagination={{ size: 'small', pageSize: 10 }} />
                    </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width="922px"
                    title="选择特价菜品"
                >
                    <div style={{ width: '100%' }}>
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
        user: state.user.toJS(),
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
export default connect(mapStateToProps, mapDispatchToProps)(SpecialDishesTable);
