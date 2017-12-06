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
    handleInputChange = (e) => {
        this.props.onChange(e.target.value);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    // componentDidMount() {
    //     $('.searchInput').focus()
    // }
    render() {
        // console.log(1)
        return (<Input
            addonBefore={<Icon type="search" />}
            placeholder="名称、编码、助记码搜索品项"
            onChange={this.handleInputChange}
            className={'searchInput'}
            onFocus={this.props.onFocus}
        />);
    }
}
/* 左侧树 */
class SelectLevel1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }
    handleLevel1Change = (item, e) => {
        // console.log(item,'item')
        this.props.handleLevel1Change(item, e);
        // this.props.onFocus();
    }
    // clickAllCategory = () => {
    //     this.props.clickAllCategory();
    // }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    render() {
        return (
            <Col span={6}>
                <div className={styles.SelectLevel1}>
                    <div className={styles.SelectTit}/*  onClick={() => { this.clickAllCategory() }} */>
                        <a style={{ color: '#676a6c' }}>全部分类</a>
                    </div>
                    <ul>
                        <Tree
                            titleField="categoryName"
                            keyField="categoryID"
                            treeData={this.props.treeData}
                            onSelect={this.handleLevel1Change}
                        />
                    </ul>
                </div>
            </Col>
        );
    }
}
/* 右侧分类品项 */
class SelectLevel2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: this.props.selectedGoods,
            checkAll: false,
            selectedRowKeys: [],
            plainOptions: this.props.allGoods, // 开始默认全部品项
            // batchLoading: false
        };
        // this.plainOptions = this.props.allGoods;
        this.columns = [
            // {
            //     title: '序号',
            //     dataIndex: 'index',
            //     key: 'index',
            //     width: '50px',
            //     className: 'TableTxtCenter',
            //     render: (text, record, index) => {
            //         return <span>{index + 1}</span>
            //     },
            // }, 
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
                // width:'110px',
            },
        ]
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.plainOptions, nextProps.plainOptions)) {
            this.setState({ plainOptions: nextProps.plainOptions })
        }
        if (!_.isEqual(this.props.selectedGoods, nextProps.selectedGoods)) {
            this.setState({
                checkedList: nextProps.selectedGoods,
            })
        }
        if (!_.isEqual(this.props.selectedKeys, nextProps.selectedKeys)) {
            this.setState({ selectedRowKeys: nextProps.selectedKeys, selectedRows: nextProps.showCities })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    render() {
        /* let rightDataSource = [];
        if (this.props.isAllCategory) {//如果是全部分类品项，默认展示前20条，全选是选全部品项
            if (this.state.plainOptions.length > 20) {
                rightDataSource = this.state.plainOptions.slice(0, 20);
            } else {
                rightDataSource = this.state.plainOptions;
            }
        } else {
            rightDataSource = this.state.plainOptions;
        } */
        // console.log(rightDataSource)
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    checkedList: selectedRows,
                });
                this.props.handleLevel2Change(selectedRows, selectedRowKeys);
            },
            selectedRowKeys: this.state.selectedRowKeys,
            selectedRows: this.state.selectedRows,
            /* onSelectAll: (selected, selectedRows, changeRows) => {
                let keys = [];
                let { plainOptions } = this.state;
                if (this.props.isAllCategory) {
                    if (selected) {//选的是全部分类的反选
                        plainOptions.map(item => {
                            keys.push(item.goodsID)
                        })
                        this.setState({
                            selectedRowKeys: keys,
                            checkedList: plainOptions
                        })
                        this.props.handleLevel2Change(plainOptions, keys);
                    } else {
                        if (this.props.isAllCategory) {
                            this.setState({
                                selectedRowKeys: [],
                                checkedList: []
                            })
                            this.props.handleLevel2Change([], []);
                        }
                    }
                }
            }, */
        };
        return (
            <Col span={18} style={{ paddingLeft: 10 }}>
                {/* <Spin size="large" spinning={this.state.batchLoading}> */}
                <div className={styles.SelectLevel2Div}>
                    <Table
                        className={styles.selectLevel2Table}
                        style={{ width: '100%' }}// 793
                        rowSelection={rowSelection}
                        rowKey="goodsID"
                        bordered={true}
                        dataSource={this.state.plainOptions}
                        scroll={{ y: 140 }}
                        columns={this.columns}
                        pagination={false}
                    ></Table>
                </div>
                {/* </Spin> */}
            </Col>
        );
    }
}
/* 下侧选中品项 */
class Selected extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            // {
            //     title: '序号',
            //     dataIndex: 'index',
            //     key: 'index',
            //     width: '50px',
            //     className: 'TableTxtCenter',
            //     render: (text, record, index) => {
            //         return <span>{index + 1}</span>
            //     },
            // }, 
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
        // console.log(this.props.showCities,'this.props.showCities')
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>已选品项</span>（单击移除）</div>
                <Table
                    className={styles.selectLevel3Table}
                    style={{ width: '100%' }}// 1068
                    rowKey="goodsID"
                    bordered={true}
                    dataSource={this.props.showCities}
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
        const treeCopy = this.convertTree(treelist);
        this.state = {
            showCities: this.props.showCities ? this.props.showCities : [],
            treeData: treeCopy,
            index: '0',
            searchResult: [],
            plainOptions: [],
            selectedKeys: [],
            searchIndex: 1, // 搜索时定义的index(递增)
            isAllCategory: true, // 默认是全部分类
            batchLoading: false,
        }
        this.flag = true;
        this.allSelected = [];// 可以同时保留不同的类的品项
        this.childrenNames = 'children';
    }
    convertTree = (treelist) => {
        let treeCopy = [],
            childrenNames = 'childs',
            childFatherFlag;

        treelist.map((itm, idx) => {
            const item = {
                ...itm,
            }
            const children = item[childrenNames]
            if (children && children[0]) {
                if (childrenNames != this.childrenNames) {
                    item.children = this.convertTree(children);
                    item[this.props.childrenNames] = null;
                    // item[this.props.childrenNames] = null;
                }
            }
            treeCopy.push(item);
        });
        return treeCopy
    }

    // 前端搜索
    searchChange = _.debounce((value) => {
        // console.log(value)
        if ($.trim(value).length > 0) {
            // this.setState({ batchLoading: true }, () => {
            //     let currentGoods = this.props.allGoods.filter(item => {
            //         // return [item.goodsName,item.goodsCode,item.remark].indexOf(value)>-1
            //         return item.goodsName.indexOf(value) > -1 || item.goodsCode.indexOf(value) > -1 || item.remark.indexOf(value) > -1 || item.goodsMnemonicCode.indexOf(value) > -1
            //     })
            //     // console.log(currentGoods,'currentGoods')
            //     this.setState({ searchResult: currentGoods, isAllCategory: false, batchLoading: false });
            // })
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
                    });
                });
        }
    }, 150)

    // 前端筛选
    handleLevel1Change = (value, item) => {
        this.setState({ batchLoading: true }, () => {
            // if (value.length) {
            //     let index = value;
            //     let currentGoods = this.props.allGoods.filter(item => {
            //         return item.categoryLevelOneID == index || item.categoryLevelTwoID == index || item.categoryID == index
            //     })
            //     // console.log(currentGoods,'currentGoods')
            //     this.setState({
            //         index: index,
            //         plainOptions: currentGoods,
            //         isAllCategory: false,
            //         batchLoading: false,
            //         searchResult: [],//查询结果置空
            //     });
            // } else {
            //     this.setState({
            //         plainOptions: [],
            //         isAllCategory: false,
            //         batchLoading: false,
            //         searchResult: [],//查询结果置空
            //     })
            // }
            if (item.selectedNodes[0]) {
                fetchData('queryGoodsList', {
                    'categoryID': item.selectedNodes[0].props.data.categoryID,
                    'categoryLevel': item.selectedNodes[0].props.data.categoryLevel,
                    'isActive': '1',
                }, null, { path: 'data' })
                    .then((queryGoodsList) => {
                        this.setState({
                            index: value,
                            plainOptions: queryGoodsList.records,
                            batchLoading: false,
                            searchResult: [], // 查询结果置空
                            isAllCategory: false,
                            focus: '1',
                        });
                    });
            } else {
                this.setState({
                    plainOptions: [],
                    batchLoading: false,
                    searchResult: [], // 查询结果置空
                    isAllCategory: false,
                    focus: '1',
                });
            }
        })
    }
    // 选中右侧品项，移到下面
    handleLevel2Change = (selectedGoods, selectedRowKeys) => {
        this.setState({ batchLoading: true }, () => {
            let index = this.state.index;
            if (this.state.focus == '2') { // 搜索结果
                index = `a${this.state.searchIndex}`;
                this.state.searchIndex++;
            }
            const showCities = [];
            this.allSelected[index] = selectedGoods;
            for (const i in this.allSelected) {
                this.allSelected[i].map((itm) => {
                    showCities.push(itm);
                })
            }
            const uniqID = selectedRowKeys;
            const noRepeatData = []
            for (let h = 0; h < uniqID.length; h++) {
                for (let j = 0; j < showCities.length; j++) {
                    if (showCities[j].goodsID == uniqID[h]) {
                        noRepeatData.push(showCities[j]);
                        break;
                    }
                }
            }
            this.setState({
                showCities: noRepeatData,
                selectedKeys: uniqID,
                batchLoading: false,
            }, function () {
                this.props.callback && this.props.callback(this.state.showCities);
            });
        })
    }
    // 选的是全部分类
    // clickAllCategory = () => {
    //     this.setState({
    //         plainOptions: this.props.allGoods,
    //         focus: '1',
    //         isAllCategory: true
    //     })
    // }
    // 点击删除行事件
    deleteItem = (item) => {
        let newShowCities = [];
        newShowCities = this.state.showCities.filter((itm, idx, array) => {
            return (itm.goodsID != item.goodsID)
        })
        const selectedKeys = [];
        newShowCities.map((item) => {
            selectedKeys.push(item.goodsID)
        })
        this.setState({
            showCities: newShowCities,
            selectedKeys,
        }, function () {
            this.props.callback && this.props.callback(this.state.showCities);
        });
    }
    // 清空
    handleClear = () => {
        for (const i in this.allSelected) {
            this.allSelected[i] = [];
        }
        this.setState({ showCities: [], selectedKeys: [] }, () => {
            this.props.callback && this.props.callback(this.state.showCities);
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.batchAddFlag) {
            nextProps.getBatchValue(this.state.showCities);
        }
    }

    componentWillUnmount() {
        this.props.callback && this.props.callback(this.state.showCities);
        this.state.searchResult = [];
        clearTimeout(this.timer)
    }

    getLevel1Props = () => {
        const level1Props = {
            level1Title: this.state.level1Title,
            treeData: this.state.treeData,
            levelsNames: this.props.levelsNames,
            childrenNames: this.childrenNames,
            handleLevel1Change: this.handleLevel1Change,
            // clickAllCategory: this.clickAllCategory,
            onFocus: () => {
                this.setState({
                    focus: '1',
                })
            },
        };
        return level1Props;
    }

    getLevel2Props = () => {
        let plainOptions;
        if (this.state.focus == '2') { // 搜索结果
            plainOptions = this.state.searchResult;
        } else {
            plainOptions = this.state.plainOptions
        }
        const level2Props = {
            treeData: this.state.treeData,
            plainOptions,
            childrenNames: this.childrenNames,
            selectedKeys: this.state.selectedKeys,
            handleLevel2Change: this.handleLevel2Change,
            allGoods: this.props.allGoods,
            showCities: this.state.showCities,
            isAllCategory: this.state.isAllCategory,
            // batchLoading: this.state.batchLoading
        };
        return level2Props
    }
    render() {
        // console.log(this.state.batchLoading)
        const selectedProps = {
            childrenNames: this.childrenNames,
            showCities: this.state.showCities,
            deleteItem: this.deleteItem,
        };
        return (
            <Spin size="large" spinning={this.state.batchLoading}>
                <div className={styles.treeSelectMain}>
                    <SearchInput
                        onChange={(value) => {
                            this.setState({
                                index: value,
                            }, () => {
                                { /* clearTimeout(this.timer) */ }
                                { /* this.timer = setTimeout(() => { */ }
                                this.searchChange(value);
                                { /* }, 500) */ }
                            })
                        }}
                        onFocus={(e) => {
                            $(e.currentTarget).select();
                            this.setState({
                                focus: '2',
                            })
                        }}
                    />
                    <div className={styles.treeSelectBody}>
                        <Row>
                            <SelectLevel1 {...this.getLevel1Props()} />
                            <SelectLevel2 {...this.getLevel2Props()} />
                        </Row>
                    </div>
                    <div className={styles.treeSelectFooter}>
                        <Selected {...selectedProps} />
                        <div onClick={this.handleClear} className={styles.Tclear}>清空</div>
                    </div>

                </div>
            </Spin>
        );
    }
}
