/* 搜索框组件 */
import React, { Component } from 'react'
import { Input, Tree, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
    UPDATE_COMMON_GOODSELECT_GOOD_SELECTED,
} from '../../../redux/actions/supplychain/goodSelect/goodSelect.action.js'


/* 右侧分类品项 */
class Selected extends Component {
    constructor(props) {
        super(props);
        this.downTableData = [];
        this.goodList = [];
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
        ];
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    // 点击删除行事件
    deleteSelectedItem = (rowData) => {
        this.props.updateSelected(_.without(this.selectedRowKeys, rowData.goodsID), _.without(this.downTableRowKeys, rowData.goodsID))
    }
    // 清空
    clearSelected = () => {
        this.props.updateSelected([], [])
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.batchAddFlag) {
            nextProps.getBatchValue(this.goodList);
        }
    }
    render() {
        const goodList = this.props.goodList.toJS();
        this.downTableRowKeys = Immutable.fromJS(this.props.downTableRowKeys).toJS();
        this.selectedRowKeys = Immutable.fromJS(this.props.selectedRowKeys).toJS();
        this.goodList = goodList.filter((good) => {
            return this.downTableRowKeys.indexOf(good.goodsID) >= 0
        })
        return (
            <div className={styles.treeSelectFooter}>
                <div className={styles.SelectedLi}>
                    <div className={styles.SelectedLiT}><span>已选品项</span>（单击移除）</div>
                    <Table
                        className={styles.selectLevel3Table}
                        style={{ width: '100%' }}
                        rowKey="goodsID"
                        bordered={true}
                        dataSource={this.goodList}
                        scroll={{ y: 220 }}
                        columns={this.columns}
                        pagination={false}
                        onRowClick={this.deleteSelectedItem}
                    ></Table>
                </div>
                <div onClick={this.clearSelected} className={styles.Tclear}>清空</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        goodList: state.goodSelect.get('goodList'),
        selectedRowKeys: state.goodSelect.get('selectedRowKeys'),
        downTableRowKeys: state.goodSelect.get('downTableRowKeys'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateSelected(selectedRowKeys, downTableRowKeys) {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_GOOD_SELECTED,
                selectedRowKeys,
                downTableRowKeys,
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Selected);
