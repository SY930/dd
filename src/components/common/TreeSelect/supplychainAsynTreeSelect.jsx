/*
 *组件名称：SupplychainTreeSelect (树选择)
 * 功能：选择品项组件
 * 李慧  2017/10/24
 */
import React, { Component } from 'react'
import { Input, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import Tree from '../../basic/tree';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';

/* 搜索框组件 */
class SearchInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<Input
            addonBefore={<Icon type="search" />}
            placeholder="名称、编码、助记码搜索品项"
            onChange={(e) => { this.props.onChange(e.target.value) }}
            className={'searchInput'}
            onFocus={(e) => { $(e.currentTarget).select() }}
        />);
    }
}
/* 左侧树 */
class ThreeLevelCategoryTree extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    render() {
        return (
            <Col span={6}>
                <div className={styles.SelectLevel1}>
                    <div className={styles.SelectTit}>
                        <a style={{ color: '#676a6c' }}>全部分类</a>
                    </div>
                    <ul>
                        <Tree
                            titleField="categoryName"
                            keyField="categoryID"
                            treeData={this.props.treeData}
                            onSelect={(selectedKey, event) => { this.props.clickLeftThreeLevelTree(selectedKey, event) }}
                        />
                    </ul>
                </div>
            </Col>
        );
    }
}
/* 右侧分类品项 */
class RightGoodsTableOfOneCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: this.props.selectedGoods,
            checkAll: false,
            selectedRowKeys: [],
            plainOptions: this.props.allGoods, // 开始默认全部品项
        };
        this.columns = [
            {
                title: '品项编码',
                dataIndex: 'goodsCode',
                key: 'goodsCode',
                width: '90px',
            }, {
                title: '品项名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: '100px',
            }, {
                title: '规格',
                dataIndex: 'goodsDesc',
                key: 'goodsDesc',
                width: '80px',
            }, {
                title: '标准单位',
                dataIndex: 'standardUnit',
                key: 'standardUnit',
                width: '70px',
            }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                key: 'purchaseUnit',
                width: '70px',
            }, {
                title: '订货单位',
                dataIndex: 'orderUnit',
                key: 'orderUnit',
                width: '70px',
            }, {
                title: '成本单位',
                dataIndex: 'costUnit',
                key: 'costUnit',
                width: '70px',
            }, {
                title: '辅助单位',
                dataIndex: 'assistUnit',
                key: 'assistUnit',
                width: '70px',
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
        ]
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.plainOptions, nextProps.plainOptions)) {
            this.setState({ plainOptions: nextProps.plainOptions })
        }
        if (!_.isEqual(this.props.selectedGoods, nextProps.selectedGoods)) {
            this.setState({
                selectedRows: nextProps.selectedGoods,
            })
        }
        if (!_.isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
            this.setState({ selectedRowKeys: nextProps.selectedRowKeys, selectedRows: nextProps.selectedGoods })
        }
        // if (!_.isEqual(this.props.plainOptions, nextProps.plainOptions) || !_.isEqual(this.props.selectedGoods, nextProps.selectedGoods) || !_.isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
        //     this.setState({ 
        //         plainOptions: nextProps.plainOptions,
        //         selectedRowKeys: nextProps.selectedRowKeys, 
        //         selectedRows: nextProps.selectedGoods,
        //     });
        // }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    render() {
        const rightDataSource = this.props.isAllCategory ? this.state.plainOptions.slice(0, 20) : this.state.plainOptions;// 如果是全部分类品项，默认展示前20条，全选是选全部品项
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                });
                this.props.handleRightTableSelectChange(selectedRows, selectedRowKeys);
            },
            selectedRowKeys: this.state.selectedRowKeys,
            onSelectAll: (selected, selectedRows, changeRows) => {
                let keys = [];
                if (this.props.isAllCategory) {
                    if (selected) { // 选的是全部分类
                        keys = _.map(this.state.plainOptions, 'goodsID');
                        this.setState({
                            selectedRowKeys: keys,
                            selectedRows: this.state.plainOptions,
                        })
                        this.props.handleRightTableSelectChange(this.state.plainOptions, keys);
                    } else { // 选的是全部分类的反选      
                        this.setState({
                            selectedRowKeys: [],
                            selectedRows: [],
                        })
                        this.props.handleRightTableSelectChange([], []);
                    }
                }
            },
        };
        return (
            <Col span={18} style={{ paddingLeft: 10 }}>
                <div className={styles.SelectLevel2Div}>
                    <Table
                        className={styles.selectLevel2Table}
                        style={{ width: '100%' }}
                        rowSelection={rowSelection}
                        rowKey="goodsID"
                        bordered={true}
                        dataSource={rightDataSource}
                        scroll={{ y: 140 }}
                        columns={this.columns}
                        pagination={false}
                    ></Table>
                </div>
            </Col>
        );
    }
}
/* 下侧选中品项 */
class Selected extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '品项编码',
                dataIndex: 'goodsCode',
                key: 'goodsCode',
                width: '110px',
            }, {
                title: '品项名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: '120px',
            }, {
                title: '规格',
                dataIndex: 'goodsDesc',
                key: 'goodsDesc',
                width: '100px',
            }, {
                title: '标准单位',
                dataIndex: 'standardUnit',
                key: 'standardUnit',
                width: '85px',
            }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                key: 'purchaseUnit',
                width: '85px',
            }, {
                title: '订货单位',
                dataIndex: 'orderUnit',
                key: 'orderUnit',
                width: '85px',
            }, {
                title: '成本单位',
                dataIndex: 'costUnit',
                key: 'costUnit',
                width: '85px',
            }, {
                title: '辅助单位',
                dataIndex: 'assistUnit',
                key: 'assistUnit',
                width: '85px',
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: '150px',
            },
        ]
    }
    deleteItem = (item) => {
        this.props.deleteItem(item)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    render() {
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>已选品项</span>（单击移除）</div>
                <Table
                    className={styles.selectLevel3Table}
                    style={{ width: '100%' }}
                    rowKey="goodsID"
                    bordered={true}
                    dataSource={this.props.selectedGoods}
                    scroll={{ y: 220 }}
                    columns={this.columns}
                    pagination={false}
                    onRowClick={this.deleteItem}
                ></Table>
            </div>
        );
    }
}

/* 选择品项组件 */
export default class SupplychainTreeSelect extends Component {
    constructor(props) {
        super(props);
        const treelist = [];
        this.deletList = [];
        this.props.treeData.map((item, idx) => {
            treelist.push(Object.assign({}, item));
        })
        this.searchIndex = 1;// 搜索时定义的index(递增)
        this.state = {
            selectedGoods: this.props.selectedGoods ? this.props.selectedGoods : [],
            treeData: treelist, // treeCopy,
            index: '0',
            searchResult: [],
            plainOptions: [],
            selectedRowKeys: [],
            isAllCategory: true, // 默认是全部分类
            batchLoading: false,
        }
        this.flag = true;
        this.allSelected = [];// 可以同时保留 选择的不同的类 的品项(搜索的 单击左侧树后的...)
    }
    // 前端搜索
    searchChange = _.debounce((value) => {
        if ($.trim(value).length) {
            fetchData('queryGoodsList', {
                'searchKey': $.trim(value),
                'pageSize': '-1',
                'isActive': '1',
            }, null, { path: 'data' })
                .then((queryGoodsList) => {
                    this.setState({
                        searchResult: queryGoodsList.records,
                        isAllCategory: false,
                        batchLoading: false,
                        index: value,
                        focus: '2',
                    });
                });
        }
    }, 350)
    // click left three-level category tree
    clickLeftThreeLevelTree = (selectedKey, event) => {
        event.selectedNodes[0] && this.setState({ batchLoading: true }, () => {
            fetchData('queryGoodsList', {
                'categoryID': event.selectedNodes[0].props.data.categoryID,
                'categoryLevel': event.selectedNodes[0].props.data.categoryLevel,
                'isActive': '1',
            }, null, { path: 'data' })
                .then((queryGoodsList) => {
                    this.setState({
                        index: selectedKey,
                        plainOptions: queryGoodsList.records,
                        batchLoading: false,
                        searchResult: [], // 查询结果置空
                        isAllCategory: false,
                        focus: '1',
                    });
                });
        })
    }
    // 选中右侧品项，移到下面
    handleRightTableSelectChange = (selectedRows, selectedRowKeys) => {
        this.setState({ batchLoading: true }, () => {
            const index = this.state.focus === '2' ? `search${this.searchIndex++}` : this.state.index;
            let showCities = [];
            const uniqID = selectedRowKeys;
            const noRepeatData = [];

            this.allSelected[index] = selectedRows;
            for (const key in this.allSelected) {
                showCities = showCities.concat(this.allSelected[key]);
            }
            _.forEach(showCities, (item, key) => {
                if (selectedRowKeys.indexOf(item.goodsID) >= 0) {
                    noRepeatData.push(item);
                }
            });
            this.setState({
                selectedGoods: noRepeatData,
                selectedRowKeys: uniqID,
                batchLoading: false,
            });
        })
    }
    // 点击删除行事件
    deleteItem = (item) => {
        let newShowCities = [];
        newShowCities = this.state.selectedGoods.filter((itm, idx, array) => {
            return (itm.goodsID != item.goodsID)
        })
        const selectedRowKeys = [];
        newShowCities.map((item) => {
            selectedRowKeys.push(item.goodsID)
        })
        this.setState({
            selectedGoods: newShowCities,
            selectedRowKeys,
        });
    }
    // 清空
    handleClear = () => {
        for (const i in this.allSelected) {
            this.allSelected[i] = [];
        }
        this.setState({ selectedGoods: [], selectedRowKeys: [] })
    }
    getThreeLevelCategoryTreeProps = () => {
        return {
            treeData: this.state.treeData,
            clickLeftThreeLevelTree: this.clickLeftThreeLevelTree,
        };
    }
    getRightGoodsTableOfOneCategoryProps = () => {
        return {
            plainOptions: this.state.focus === '2' ? this.state.searchResult : this.state.plainOptions, // '2' 搜索结果
            selectedRowKeys: this.state.selectedRowKeys,
            handleRightTableSelectChange: this.handleRightTableSelectChange,
            allGoods: this.props.allGoods,
            selectedGoods: this.state.selectedGoods,
            isAllCategory: this.state.isAllCategory,
        };
    }
    // Life Cycle Functions
    componentWillReceiveProps(nextProps) {
        if (nextProps.batchAddFlag) {
            nextProps.getBatchValue(this.state.selectedGoods);
        }
    }
    componentWillUnmount() {
        this.state.searchResult = [];
    }
    render() {
        return (
            <Spin size="large" spinning={this.state.batchLoading}>
                <div className={styles.treeSelectMain}>
                    <SearchInput
                        onChange={(value) => {
                            this.searchChange(value);
                        }}
                    />
                    <div className={styles.treeSelectBody}>
                        <Row>
                            <ThreeLevelCategoryTree {...this.getThreeLevelCategoryTreeProps()} />
                            <RightGoodsTableOfOneCategory {...this.getRightGoodsTableOfOneCategoryProps()} />
                        </Row>
                    </div>
                    <div className={styles.treeSelectFooter}>
                        <Selected {... { selectedGoods: this.state.selectedGoods, deleteItem: this.deleteItem }} />
                        <div onClick={this.handleClear} className={styles.Tclear}>清空</div>
                    </div>
                </div>
            </Spin>
        );
    }
}
