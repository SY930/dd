import React, {
    Component,
} from 'react'
import $ from 'jquery'
import {
    Icon,
    Tree,
} from 'antd'
import styles from './SCTreeSelect.less'

const TreeNode = Tree.TreeNode

export default class SCTreeSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            clearVisible: false,
            treeVisible: false,
            value: '',
            inputValue: '',
        }

        this.showTree = this.showTree.bind(this)
        this.hideTree = this.hideTree.bind(this)
        this.showClear = this.showClear.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleClear = this.handleClear.bind(this)
    }

    showTree() {
        this.setState({
            treeVisible: true,
        })
    }

    hideTree(e) {
        const target = $(e.target)

        if (target.parents('.SCTreeSelect').length > 0) {
            return
        }

        this.setState({
            treeVisible: false,
        })
    }

    showClear(visible) {
        if (visible && this.state.clearVisible) {
            return
        }

        if (visible && this.state.inputValue && this.state.inputValue !== '') {
            this.setState({
                clearVisible: true,
            })
        } else {
            this.setState({
                clearVisible: false,
            })
        }
    }

    handleCheck(checkedKeys, e) {
        const checkedNodes = e.checkedNodes || []

        const value = []
        const inputValue = []

        checkedNodes.forEach((node) => {
            if (node.props.isFinal) {
                value.push(node.key)
                inputValue.push(node.props.title)
            }
        })

        this.props.input.onChange({
            value: value.join(','),
            inputValue: inputValue.join(','),
        })
    }

    handleClear(e) {
        this.props.input.onChange({
            value: '',
            inputValue: '',
        })

        e.preventDefault()
        e.stopPropagation()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.input.value ? nextProps.input.value.value : '',
            inputValue: nextProps.input.value ? nextProps.input.value.inputValue : '',
        })
    }

    render() {
        const {
            label,
            wrapperStyles,
            width,
            multiple,
            treeCheckable,
            el,
            treeData,
        } = this.props

        const renderTreeNode = (data) => {
            return data.map((node) => {
                if (node.children) {
                    return (
                        <TreeNode key={node.value} title={node.label}>
                            {renderTreeNode(node.children)}
                        </TreeNode>
                    )
                }

                return <TreeNode key={node.value} title={node.label} isFinal={true} />
            })
        }

        return (
            <div
                className={wrapperStyles.element}
                style={{ width }}
            >
                <div
                    className={wrapperStyles.label}
                    style={{ width: label.width }}
                >
                    <span>
                        {label.name}
                    </span>
                </div>
                <div
                    className={wrapperStyles.el}
                    style={{ width: el.width }}
                >
                    <div className={['SCTreeSelect', styles.SCTreeSelect].join(' ')}>
                        <div
                            className={styles.input}
                            onClick={this.showTree}
                            onMouseOver={() => { this.showClear(true) }}
                            onMouseOut={() => { this.showClear(false) }}
                        >
                            <span>{this.state.inputValue}</span>
                            <Icon
                                type="cross-circle"
                                style={{ 'display': this.state.clearVisible ? 'block' : 'none' }}
                                onClick={this.handleClear}
                            />
                        </div>
                        <div
                            className={styles.tree}
                            style={{ display: this.state.treeVisible ? 'block' : 'none' }}
                        >
                            <Tree
                                onCheck={this.handleCheck}
                                checkedKeys={this.state.value ? this.state.value.split(',') : []}
                                multiple={multiple}
                                checkable={treeCheckable}
                            >
                                {renderTreeNode(treeData)}
                            </Tree>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.body.addEventListener('click', this.hideTree)
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.hideTree)
    }
}
