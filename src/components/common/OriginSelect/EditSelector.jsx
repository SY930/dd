import React, { Component } from 'react'
import { message } from 'antd';
import EditableTags from '../EditableTags'
import ModalSelector from './ModalSelector'

class EditSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false, // modal的显隐
            items: props.defaultValue, // 显示的组织数据
            selectedIds: [], // 显示的组织id
        }
    }
    componentWillMount() {
        const { defaultValue } = this.props
        const selectedIds = []
        const items = defaultValue.map((value) => {
            value.label = value.orgName
            value.name = value.orgID
            selectedIds.push(value.orgID)
            return value
        })
        this.setState({
            items,
            selectedIds,
        })
    }
    componentWillReceiveProps(nextProps) {
        const { defaultValue } = nextProps
        const selectedIds = []
        const items = defaultValue.map((value) => {
            value.label = value.orgName
            value.name = value.orgID
            selectedIds.push(value.orgID)
            return value
        })
        this.setState({
            items,
            selectedIds,
        })
    }
    onAdd = () => {
        this.setState({ visible: true })
    }
    // 移除的id
    onClose = (v) => {
        const { onchange, isNull } = this.props
        const { items: defaultValue } = this.state
        const selectedIds = []
        const filterArr = defaultValue.filter(val => val.value !== v)
        if (isNull && !filterArr.length) {
            message.warning('至少选择一个组织')
            return
        }
        const items = filterArr.map((value) => {
            value.label = value.orgName
            value.name = value.orgID
            selectedIds.push(value.orgID)
            return value
        })
        onchange && onchange(filterArr)
        this.setState({
            items,
            selectedIds,
        })
    }
    // modal确定事件
    onOk = (val) => {
        const { onChange, isNull } = this.props
        if (isNull && !val.length) {
            message.warning('请选择组织')
            return
        }
        const selectedIds = []
        const items = val.map((value) => {
            // const obj = {
            //     label: value.orgName,
            //     value: value.orgID,
            // }
            value.label = value.orgName
            value.value = value.orgID
            selectedIds.push(value.orgID)
            return value
        })
        onChange && onChange(val)
        this.setState({
            items,
            selectedIds,
            visible: false,
        })
        // const { defaultValue } = this.props
        // const selectedIds = defaultValue.map(value => value.value) // 选中的组织id
        // const item = []
        // const arr = val.filter((v) => {
        //     return selectedIds.indexOf(v.orgID) >= 0
        // })
    }
    onCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { editTitle, title } = this.props
        const { visible, items } = this.state
        const selectedIds = items.map(val => val.value) // 选中的组织id
        return (
            <div>
                <EditableTags
                    title={editTitle}
                    items={items}
                    onAdd={this.onAdd}
                    onClose={this.onClose}
                />
                <ModalSelector
                    title={title}
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    defaultValue={selectedIds}
                />
            </div>

        )
    }
}
EditSelector.defaultProps = {
    width: '90%',
    editTitle: '点击选择店铺', // 编辑框title
    title: '选择组织', // modal title
    onChang: () => { }, // 选中项变动事件
    // onOk: () => {},     //
    // onClose: () => {},
    defaultValue: [], // 默认选中的 {value:id:label:name};
    isNull: false, // 默认允许不选择组织
}
export default EditSelector
