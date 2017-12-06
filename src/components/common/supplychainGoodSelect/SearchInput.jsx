/* 搜索框组件 */
import React, { Component } from 'react'
import { Input, Icon, Button, Row, Col, Checkbox, Table, Spin } from 'antd';
import styles from './treeSelect.less';
import Tree from '../../basic/tree';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';

import { connect } from 'react-redux';
import {
    UPDATE_COMMON_GOODSELECT_GOOD_KEYWORD,
} from '../../../redux/actions/supplychain/goodSelect/goodSelect.action.js';

class SearchInput extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
    }
    // 前端搜索
    searchChange = _.debounce((e) => {
        const searchKey = $.trim(e.target.value);
        if (searchKey) {
            this.props.searchGood(searchKey)
        }
    }, 350)
    render() {
        return (<Input
            addonBefore={<Icon type="search" />}
            placeholder="名称、编码、助记码搜索品项"
            onChange={(e) => { e.persist(); this.searchChange(e) }}
            className={'searchInput'}
            onFocus={(e) => { $(e.currentTarget).select() }}
        />);
    }
}
function mapStateToProps(state) {
    return {
        searchKey: state.goodSelect.get('searchKey'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        searchGood: (searchKey) => {
            dispatch({
                type: UPDATE_COMMON_GOODSELECT_GOOD_KEYWORD,
                searchKey,
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
