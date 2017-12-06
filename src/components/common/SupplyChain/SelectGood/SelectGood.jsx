import React, { Component } from 'react'
import {
    Input,
    Button,
    Modal,
    Icon,
} from 'antd'
import {
    change,
} from 'redux-form'
import _ from 'lodash'
import SupplychainGoodsSelect from '../../../../components/common/supplychainGoodSelect/supplychainGoodsSelect'
import styles from './SelectGood.less'

export default class SelectGood extends Component {
    constructor(props) {
        super(props)

        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.getBatchValue = this.getBatchValue.bind(this)

        this.state = {
            modalVisible: false,
            clearVisible: false,
            batchAddFlag: false,
            value: props.value ? props.value.value : '',
            inputValue: props.value ? props.value.inputValue : '',
        }
    }

    showClear(visible) {
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

    showModal(e) {
        this.setState({
            modalVisible: true,
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

    getBatchValue(value) {
        this.setState({
            batchAddFlag: false,
        })

        if (this.props.multiple !== void 0 && !this.props.multiple && value.length > 1) {
            Modal.error({
                content: '最多只可选择一个品项，请重新选择',
            })

            return
        }

        const inputValueKey = this.props.inputValueKey ? this.props.inputValueKey : 'goodsName'
        const valueKey = this.props.valueKey ? this.props.valueKey : 'goodsID'

        const names = []
        const ids = []

        value.forEach((item) => {
            names.push(item[inputValueKey])
            ids.push(item[valueKey])
        })

        this.props.input.onChange({
            value: ids.join(','),
            inputValue: names.join(','),
        })
    }

    handleOk() {
        this.setState({
            modalVisible: false,
            batchAddFlag: true,
        })
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.input.value ? nextProps.input.value.value : '',
            inputValue: nextProps.input.value ? nextProps.input.value.inputValue : '',
        })
    }

    render() {
        const {
            wrapperStyles,
            width,
            label,
            el,
        } = this.props

        const getBatchProps = {
            getBatchValue: this.getBatchValue,
            batchAddFlag: this.state.batchAddFlag,
            queryGoodsListUrl: 'queryGoodsAndCategory',
            queryGoodsListParas: {
                isActive: '1',
            },
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
                    <div
                        className={styles.SelectGood}
                        onClick={this.showModal}
                        onMouseOver={() => { this.showClear(true) }}
                        onMouseOut={() => { this.showClear(false) }}
                    >
                        <span>{this.state.inputValue}</span>
                        <Icon
                            type="cross-circle"
                            style={{ 'display': this.state.clearVisible ? 'block' : 'none' }}
                            onClick={this.handleClear}
                        />
                        <Modal
                            title={this.props.modalTitle}
                            width={1100}
                            visible={this.state.modalVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <SupplychainGoodsSelect {...getBatchProps} />
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}
