import React, { Component } from 'react';
import { Tree } from 'antd';
import { isEqual, uniq, difference } from 'lodash';
import uuid from 'uuid/v4'
import PropTypes from 'prop-types';

import { pyMatch } from '../../../helpers/util';

const TreeNode = Tree.TreeNode;

const LEAF_TAG = uuid();

class HualalaTree extends Component {
    constructor(props) {
        super(props);
        this.treeData = this.calcTreeData(props.options);
        this.state = {
            autoExpandParent: false,
            expandedKeys: this.calcExpandedKeys(props.keyword, props.autoExpandAll),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options)) {
            this.treeData = this.calcTreeData(nextProps.options);
            this.setState({
                autoExpandParent: !!nextProps.keyword,
                expandedKeys: this.calcExpandedKeys(nextProps.keyword, nextProps.autoExpandAll),
            });
        }
        if (!isEqual(this.props.keyword, nextProps.keyword)) {
            this.setState({
                autoExpandParent: !!nextProps.keyword,
                expandedKeys: this.calcExpandedKeys(nextProps.keyword, nextProps.autoExpandAll),
            });
        }
    }

    calcTreeData(records = []) {
        const childList = records.reduce((ret, record) => {
            const { parent } = record;
            if (!parent) return ret;
            ret[parent] = ret[parent] || [];
            ret[parent].push(record);
            return ret;
        }, {});
        return records.map((record) => {
            const { value } = record;
            record._children = childList[value] || [];
            return record;
        });
    }

    calcExpandedKeys(keyword = '', expandAll = false) {
        const expandedKeys = [];
        const loop = treeData => treeData.forEach((item) => {
            const { label, py, parent, _children } = item;
            if (!parent || parent === '0') {
                // do nothing, just pass through to loop children
            } else if (expandedKeys.indexOf(parent) === -1 &&
                ((!keyword && expandAll) || (keyword && pyMatch({ name: label, py }, keyword)))
            ) {
                expandedKeys.push(parent);
            }
            _children && _children.length && loop(_children);
        });
        if (!keyword && !expandAll) return expandedKeys;
        loop(this.getRootNodes());
        return expandedKeys;
    }

    getRootNodes() {
        return this.treeData.filter(
            record => (!record.parent || record.parent === '0')
        );
    }

    encodeLeafKey(key = '') {
        return `${key}${LEAF_TAG}`;
    }

    decodeLeafKey(key = '') {
        const match = key.match(`^(.+)${LEAF_TAG}$`)
        return match && match[1];
    }

    handleCheck = (checkedKeys, { checked, node }) => {
        const { checkStrictly, autoCheckChildren } = this.props;
        const findChildKeys = ({ value, _children }, ret) => {
            const _ret = ret || [];
            if (!_children || !_children.length) return _ret.concat(value);
            return _ret.concat(
                value,
                ..._children.map(child => findChildKeys(child, _ret))
            );
        };
        let keys = checkStrictly ? checkedKeys : checkedKeys.map(
            key => this.decodeLeafKey(key)
        ).filter(key => key);
        if (checkStrictly && autoCheckChildren) {
            const curNode = this.treeData.find(record => record.value === node.props.eventKey);
            const childKeys = findChildKeys(curNode);
            keys = checked ? uniq(keys.concat(childKeys)) : difference(checkedKeys, childKeys);
        }
        this.props.onChange(keys);
    }

    handleExpand = (expandedKeys) => {
        this.setState({ expandedKeys });
    }

    renderTreeNodes(treeData) {
        const { keyword, checkStrictly } = this.props;
        const loop = data => data.map((item) => {
            const { value, label, py, disabled, _children } = item;
            const isLeaf = !_children || !_children.length;
            const isMatch = keyword && pyMatch({ name: label, py }, keyword);
            const title = isMatch ? (
                <span style={{ color: '#f50' }}>{label}</span>
            ) : label;
            return (
                <TreeNode
                    key={isLeaf && !checkStrictly ? this.encodeLeafKey(value) : value}
                    title={title}
                    disableCheckbox={disabled}
                >
                    {isLeaf ? null : loop(_children)}
                </TreeNode>
            );
        });
        return loop(treeData);
    }

    render() {
        const { checkable, checkStrictly, value } = this.props;
        const { autoExpandParent, expandedKeys } = this.state;
        const checkedKeys = checkStrictly ? {
            checked: value,
        } : value.map(key => this.encodeLeafKey(key));
        return (
            <Tree
                checkable={checkable}
                checkStrictly={checkStrictly}
                autoExpandParent={autoExpandParent}
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                selectedKeys={[]}
                onCheck={this.handleCheck}
                onExpand={this.handleExpand}
            >
                {this.renderTreeNodes(this.getRootNodes())}
            </Tree>
        );
    }
}

HualalaTree.defaultProps = {
    checkable: false,
    checkStrictly: false,
    autoCheckChildren: false,
    options: [],
    // FIXME: set default value for a controled component will get antd form warning.
    // value: [],
    // onChange() {},
};

HualalaTree.propTypes = {
    /** 是否显示勾选框 */
    checkable: PropTypes.bool,
    /** 节点是否可以独立勾选（父子节点不再关联） */
    checkStrictly: PropTypes.bool,
    /** 节点独立勾选模式下，是否自动勾选子节点 */
    autoCheckChildren: PropTypes.bool,
    /** 所有节点信息（注意：节点的 value 值不可重复） */
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        parent: PropTypes.string,
        py: PropTypes.string,
    })),
    /** 当前选中的节点 */
    value: PropTypes.arrayOf(PropTypes.string),
    /** 勾选节点时触发的回调 */
    onChange: PropTypes.func,
};

export default HualalaTree;
