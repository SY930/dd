// import cb from '../cube.js';
import React from 'react';
import { Tree } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const TreeNode = Tree.TreeNode;

export class TreeControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expendall: this.props.expendall,
            multiple: this.props.multiple,
            checkable: this.props.checkable,
            defaultExpandAll: this.props.defaultExpandAll,
            keyField: this.props.keyField || 'key',
            titleField: this.props.titleField || 'title',
            dataSource: [],
        };
        this.onSelect = this.onSelect.bind(this);
    }
    componentDidMount() {
        if (this.props.model) { this.props.model.addListener(this); }
    }
    componentWillUnmount() {
        if (this.props.model) { this.props.model.removeListener(this); }
    }
    onSelect(selectedKeys, e) {
        if (this.props.model) { this.props.model.select(selectedKeys); }
    }
    render() {
        const loop = data => data.map((item) => {
            if (item.children || item.childs) {
                expandedKeys.push(item[keyField]);
                return <TreeNode data={item} title={item[titleField]} key={item[keyField]}>{loop(item.children || item.childs)}</TreeNode>;
            }
            expandedKeys.push(item[keyField]);
            return <TreeNode data={item} title={item[titleField]} key={item[keyField]} isLeaf={true} disabled={item.disabled} />;
        });
        let treeData,
            titleField,
            keyField;// 变量提升
        if (this.props.treeData) {
            treeData = this.props.treeData;
            titleField = this.props.titleField;
            keyField = this.props.keyField;
        } else {
            treeData = this.state.dataSource;
            titleField = this.state.titleField;
            keyField = this.state.keyField;
        }
        const expandedKeys = [];
        const treeNodes = loop(treeData);
        const treeProps = {
            multiple: this.state.multiple,
            checkable: this.state.checkable,
            defaultExpandAll: this.state.defaultExpandAll,
        };
        if (this.state.expendall) {
            treeProps.expandedKeys = expandedKeys;
        }
        return (
            <Tree onSelect={this.props.onSelect || this.onSelect} {...treeProps}>
                {treeNodes}
            </Tree>
        )
    }
}
export default TreeControl
