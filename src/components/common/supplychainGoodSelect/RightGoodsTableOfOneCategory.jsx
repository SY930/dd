/* 搜索框组件 */
import React, { Component } from 'react'
import { Input, Tree, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
    fetchGoodList,
    UPDATE_COMMON_GOODSELECT_GOOD_SELECTED,
    UPDATE_COMMON_GOODSELECT_REMOVE_LOADING,
} from '../../../redux/actions/supplychain/goodSelect/goodSelect.action.js'

/* 右侧分类品项 */
class RightGoodsTableOfOneCategory extends Component {
    constructor(props) {
        super(props);
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
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    componentDidUpdate() {
        this.props.removeLoading();
    }
    componentDidMount() {
        this.props.fetchGoodList(
            this.props.queryGoodsListUrl, {
                ...this.props.queryGoodsListParas,
            })
    }
    render() {
        let goodList = this.props.goodList.toJS();
        const currentSelectedRowKeys = Immutable.fromJS(this.props.selectedRowKeys).toJS();
        const rowSelection = {
            selectedRowKeys: currentSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.updateSelected(selectedRowKeys, selectedRowKeys)// 解决右侧品项勾掉后，下面选中区品项没有去掉的bug
            },
        };

        if (this.props.category && !this.props.searchKey) {
            goodList = goodList.filter((good) => {
                return good.categoryID === this.props.category || good.categoryLevelOneID === this.props.category || good.categoryLevelTwoID === this.props.category
            })
        } else if (!this.props.searchKey) { // 首次进来是空table
            goodList = [];
        }
        if (this.props.searchKey) {
            goodList = goodList.filter((good) => {
                return good.goodsName.indexOf(this.props.searchKey) > -1 || good.goodsCode.indexOf(this.props.searchKey) > -1 || good.remark.indexOf(this.props.searchKey) > -1 || good.goodsMnemonicCode.indexOf(this.props.searchKey) > -1
            })
        }
        return (
            <Col span={18} style={{ paddingLeft: 10 }}>
                <div className={styles.SelectLevel2Div}>
                    <Table
                        className={styles.selectLevel2Table}
                        style={{ width: '100%' }}
                        rowSelection={rowSelection}
                        rowKey="goodsID"
                        bordered={true}
                        dataSource={goodList}
                        scroll={{ y: 140 }}
                        columns={this.columns}
                        pagination={false}
                    ></Table>
                </div>
            </Col>
        );
    }
}

function mapStateToProps(state) {
    return {
        goodList: state.goodSelect.get('goodList'),
        searchKey: state.goodSelect.get('searchKey'),
        category: state.goodSelect.get('category'),
        selectedRowKeys: state.goodSelect.get('selectedRowKeys'),
        downTableRowKeys: state.goodSelect.get('downTableRowKeys'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchGoodList: (url, params) => {
            dispatch(fetchGoodList(url, params));
        },
        updateSelected(selectedRowKeys, downTableRowKeys) {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_GOOD_SELECTED,
                selectedRowKeys,
                downTableRowKeys,
            })
        },
        removeLoading() {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_REMOVE_LOADING,
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RightGoodsTableOfOneCategory);
