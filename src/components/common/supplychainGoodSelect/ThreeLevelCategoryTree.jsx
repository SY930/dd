/* 搜索框组件 */
import React, { Component } from 'react'
import { Input, Tree, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';

import { connect } from 'react-redux';
import {
    fetchGoodCategoryList,
    UPDATE_COMMON_GOODSELECT_GOOD_CATEGORY,
} from '../../../redux/actions/supplychain/goodSelect/goodSelect.action.js'

const TreeNode = Tree.TreeNode

/* 左侧树 */
class ThreeLevelCategoryTree extends Component {
    constructor(props) {
        super(props);
        this.clickLeftThreeLevelTree = this.clickLeftThreeLevelTree.bind(this);
    }
    clickLeftThreeLevelTree(categoryID) {
        this.props.clickLeftThreeLevelTree(categoryID);
    }
    componentDidMount() {
        this.props.fetchGoodCategoryList()
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    render() {
        const goodCategoryList = this.props.goodCategoryList.toJS();
        const loop = data => data.map((node) => {
            if (node.childs && node.childs.length) {
                return (
                    <TreeNode key={node.categoryID} title={node.categoryName}>
                        {loop(node.childs)}
                    </TreeNode>
                )
            }
            return <TreeNode key={node.categoryID} title={node.categoryName} />
        })

        return (
            <Col span={6}>
                <div className={styles.SelectLevel1}>
                    <div className={styles.SelectTit}>
                        <a style={{ color: '#676a6c' }}>全部分类</a>
                    </div>
                    <ul>
                        <Tree onSelect={this.clickLeftThreeLevelTree}>
                            {goodCategoryList.length ? loop(goodCategoryList) : null}
                        </Tree>
                    </ul>
                </div>
            </Col>
        );
    }
}
function mapStateToProps(state) {
    return {
        goodCategoryList: state.goodSelect.get('goodCategoryList'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchGoodCategoryList: () => {
            dispatch(fetchGoodCategoryList());
        },
        clickLeftThreeLevelTree(categoryID) {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_GOOD_CATEGORY,
                payload: categoryID.join(' '),
                searchKey: '',
                loadding: true,
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ThreeLevelCategoryTree);
