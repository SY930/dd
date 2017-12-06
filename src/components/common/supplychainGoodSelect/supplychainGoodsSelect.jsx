/*
 *组件名称：SupplychainTreeSelect (树选择)
 * 功能：选择品项组件
 * 李慧  2017/10/24
 */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Input, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';

import SearchInput from './SearchInput';
import ThreeLevelCategoryTree from './ThreeLevelCategoryTree';
import RightGoodsTableOfOneCategory from './RightGoodsTableOfOneCategory';
import Selected from './Selected';

import {
    UPDATE_COMMON_GOODSELECT_RESET_STATE,
} from '../../../redux/actions/supplychain/goodSelect/goodSelect.action.js'

/* 选择品项组件 */
class supplychainGoodsSelect extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    componentWillUnmount() {
        this.props.resetRduxState();
    }
    render() {
        return (
            <Spin size="large" spinning={this.props.loading}>
                <div className={styles.treeSelectMain}>
                    <SearchInput />
                    <div className={styles.treeSelectBody}>
                        <Row>
                            <ThreeLevelCategoryTree />
                            <RightGoodsTableOfOneCategory queryGoodsListUrl={this.props.queryGoodsListUrl} queryGoodsListParas={this.props.queryGoodsListParas} />
                        </Row>
                    </div>
                    <Selected batchAddFlag={this.props.batchAddFlag} getBatchValue={this.props.getBatchValue} />
                </div>
            </Spin>
        );
    }
}
function mapStateToProps(state) {
    return {
        loading: state.goodSelect.get('loading'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        resetRduxState() {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_RESET_STATE,
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(supplychainGoodsSelect);
