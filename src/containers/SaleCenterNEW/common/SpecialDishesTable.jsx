/**
 * @Author: chenshuang
 * @Date:   2017-03-29T18:06:22+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:21:01+08:00
 */


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import _ from 'lodash';

import { Row, Col, Tree, Table, Input, Popconfirm, message, Modal, Form, Spin, Checkbox } from 'antd';

import styles from '../ActivityPage.less';

import {
    saleCenterSetPromotionDetailAC,

} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    HualalaTreeSelect,
    HualalaGroupSelect,
    HualalaSearchInput,
    HualalaSelectedTable,
} from '../../../components/common';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;

class SpecialDishesTable extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this._state = null;
        this.state = {
            visible: false,
            selectedDishes: [],
            foodCategoryCollection: [], // 存储所有相关数据
            dataSource: [],
            data: [],
            foodOptions: [], // 右侧列表待选数据,有可能筛掉非会员价菜品
            foodOptionsNoFilter: [], //右侧列表待选数据,全部，没筛掉非会员价菜品
            foodSelections: new Set(), // 已选特色菜
            foodCurrentSelections: [], // 当前备选列表内,已选的特色菜
            priceLst: [],
            filterPrice: 'newPrice',
            onlyVip: false,
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.sortData = this.sortData.bind(this);
        this.filterGroup = this.filterGroup.bind(this);
        this.onOnlyVipChange = this.onOnlyVipChange.bind(this)
    }

    componentDidMount() {
        // 从redux中获取特价菜列表
        let _priceLst;
        if (this.props.isWeChatMall) {
            _priceLst = this.props.goodsList;
        } else {
            try {
                _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
            } catch (e) {
                _priceLst = []
            }
        }
        let foodCategoryCollection;
        // 获取菜品信息
        try {
            foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        } catch (e) {
            foodCategoryCollection = []
        }

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
        const selectIds = Array.from(foodSelections).map(select => select.itemID)

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
                                        if (this.props.isWeChatMall) {
                                            if (item.itemID == food.foodItemID) {
                                                item.mPrice = food.price;
                                                item.mPoint = food.point;
                                                item.totalAmount = food.storage;
                                                item.limitAmount = food.purchaseLimit;
                                                !selectIds.includes(item.itemID) && foodSelections.add(item);
                                            }
                                        } else {
                                            if (item.itemID == food.foodUnitID) {
                                                item.newPrice = food.price;
                                                !selectIds.includes(item.itemID) && foodSelections.add(item);
                                            }
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
            // foodCategoryCollection = this.filterGroup(foodCategoryCollection);
            this.setState({
                foodCategoryCollection,
                foodSelections: new Set(),
            }, () => {
                this.sortData(this.state.foodCategoryCollection, this.state.priceLst);
            });
        }
        if (this.props.isWeChatMall) {
            // TODO: 微信商城priceLst变动
        }else {
            // promotionDetail priceLst 特价菜列表发生改变
            if (
                nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
                this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])
            ) {
                let priceLst = [];
                if (Immutable.List.isList(nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']))) {
                    priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
                }
                this.setState({
                    priceLst,
                }, () => {
                    this.sortData(this.state.foodCategoryCollection, this.state.priceLst)
                })
            }
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

                            {!this.props.isWeChatMall && <Checkbox style={{ marginLeft:2,position:'relative',top:-5 }} onChange={this.onOnlyVipChange}>{`    只显示有会员价的菜品`}</Checkbox>}
                            <HualalaTreeSelect level1Title={this.props.isWeChatMall ? '全部商品': '全部菜品'}>
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
                                    isWeChatMall={this.props.isWeChatMall}
                                    valueKey="itemID"
                                    value={this.state.foodCurrentSelections}
                                    onChange={(value) => {
                                        this.handleFoodGroupSelect(value)
                                    }}
                                />
                                <HualalaSelectedTable
                                    isWeChatMall={this.props.isWeChatMall}
                                    itemName="foodName+unit"
                                    selectdTitle={this.props.isWeChatMall ? '已选商品': '已选菜品'}
                                    value={this.state.foodSelections}
                                    onClear={() => this.clear('food')}
                                    filterPriceChange={(v) => this.setState({ filterPrice: v })}
                                    filterPrice={this.state.filterPrice}
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
            if (Array.from(foodSelections).findIndex(food => food.itemID == storeEntity.itemID) > -1) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections,
        });
    }

    // GroupSelect 处理函数
    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { foodSelections, foodOptions } = this.state;
            const selectIds = Array.from(foodSelections).map(select => select.itemID)
            // 进行过滤， 并添加新属性
            foodOptions.forEach((shopEntity) => {
                if (value.includes(Number(shopEntity.itemID)) || value.includes(String(shopEntity.itemID))) {
                    shopEntity.newPrice = shopEntity.newPrice || shopEntity.price
                    !selectIds.includes(shopEntity.itemID) && foodSelections.add(shopEntity);
                } else {
                    shopEntity.newPrice = null;
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
            foodOptions: this.state.onlyVip ? storeOptions.filter(v => v.vipPrice > -1) : storeOptions,
            foodOptionsNoFilter: storeOptions,
            foodCurrentSelections
        });
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
        this._state = _.cloneDeep(this.state);
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        if (!this.props.isWeChatMall) {
            this.setState({
                visible: false,
            });
            const data = Array.from(this.state.foodSelections);
            this.props.onChange && this.props.onChange(data);
        } else {
            const data = Array.from(this.state.foodSelections);
            // == 是有意的, 因为有时会有null的情况
            if (data.some(food => {
                if ((food.mPrice == undefined || food.mPrice <= 0 || food.mPrice === '') && (food.mPoint == undefined || food.mPoint <= 0 || food.mPoint === '')) {// 秒杀价没填
                    message.warning('积分秒杀价和现金秒杀价至少要有1个大于0');
                    return true;
                }
                if (food.limitAmount == undefined || food.limitAmount === '' || food.totalAmount === '' || food.totalAmount == undefined || Number(food.limitAmount) > Number(food.totalAmount)) {// 库存 限购没填或限购大于库存
                    message.warning('库存及限购数量不得为空, 限购数量不能大于库存量');
                    return true;
                }
                return false;
                })) {
            }
            else {
                this.setState({
                    visible: false,
                });
                this.props.onChange && this.props.onChange(data);
            }
        }
    };

    handleCancel = () => {
        this.setState(this._state);
    };

    // 删除一行数据
    handleDel = (text, record, index) => {
        confirm({
            title: this.props.isWeChatMall ? '移除商品' : '移除特价菜',
            content: (
                <div>
                    您将移除
                    【<span>{record.foodName}</span>】
                    <br />
                    <span>保存后操作生效，请慎重考虑~</span>
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
            onCancel: () => { },
        });
    };
    onOnlyVipChange(e) {
        let foodOptions = this.state.foodOptions.filter(v => v.vipPrice > -1)
        this.setState({
            onlyVip: e.target.checked,
            foodOptions: e.target.checked ? this.state.foodOptions.filter(v => v.vipPrice > -1) : this.state.foodOptionsNoFilter
        })
    }

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
                    return <span>{record.key + 1}</span>
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
                title: this.props.isWeChatMall ? '商品' : '菜品',
                dataIndex: 'foodName',
                key: 'foodName',
                fixed: 'left',
                width: 100,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: this.props.isWeChatMall ? '规格' : '单位',
                dataIndex: 'unit',
                key: 'unit',
                fixed: 'left',
                width: 100,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '编码',
                dataIndex: 'foodCode',
                key: 'foodCode',
                width: 100,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
        ];
        const specificColumns = this.props.isWeChatMall ? [
            {
                title: `积分秒杀价(积分)`,
                dataIndex: 'mPoint',
                key: 'mPoint',
                width: 120,
                className: 'TableTxtRight',
            },
            {
                title: `现金秒杀价 (元)`,
                dataIndex: 'mPrice',
                key: 'mPrice',
                width: 110,
                className: 'TableTxtRight',
            },
            {
                title: '积分/现金售价',
                dataIndex: 'prePrice',
                key: 'prePrice',
                width: 120,
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    if (record.price >= 0 && record.foodScore >= 0) {
                        return `${record.foodScore}积分+${record.price}元`
                    } else if (record.price >= 0) {
                        return `${record.price}元`
                    } else if (record.foodScore >= 0) {
                        return `${record.foodScore}积分`
                    }
                    return '--'
                },
            },
            {
                title: '库存量',
                width: 80,
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                className: 'TableTxtCenter',
            },
            {
                title: '限购数',
                dataIndex: 'limitAmount',
                key: 'limitAmount',
                className: 'TableTxtCenter',
            },

        ] : [
            {
                title: '分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 100,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '原价格(元)',
                dataIndex: 'price',
                key: 'price',
                width: 80,
                className: 'TableTxtRight',
            },
            {
                title: '折扣',
                dataIndex: 'salePercent',
                key: 'salePercent',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return Number(record.newPrice) <= 0 ? '0折' : Number(record.newPrice) !== Number(record.price) ? `${Number((Number(record.newPrice) / record.price * 10).toFixed(3))}折` : '不打折'
                },
            },
            {
                title: '特价(元)',
                width: 80,
                dataIndex: 'newPrice',
                key: 'newPrice',
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return Number(record.newPrice) <= 0 ? 0 : Number(record.newPrice)
                },
            },
        ];
        columns.push(...specificColumns);


        const data = Array.from(this.state.foodSelections);
        data.forEach((rowItem, index) => {
            rowItem.key = index;
        })
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={2}>
                        <span className={styles.gTitle}>{this.props.isWeChatMall ? '选择商品' : '选择菜品'}</span>
                    </Col>
                    <Col span={4} offset={18}>
                        <a className={styles.gTitleLink} onClick={this.selectDishes}>
                            {this.props.isWeChatMall ? '批量添加商品' : '批量添加菜品'}
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table bordered={true} dataSource={data} columns={columns} scroll={{ x: this.props.isWeChatMall ? 960 : 750 }} pagination={{ size: 'small', pageSize: 10 }} />
                    </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={1000}
                    title={`        ${this.props.isWeChatMall ? '选择特价商品' : '选择特价菜品'}`}
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
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SpecialDishesTable);
