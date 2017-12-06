import React, { Component } from 'react'
import {
    Input,
    Modal,
    Icon,
} from 'antd'
import {
    change,
} from 'redux-form'
import {
    ModalSelector,
} from '../../../../components/common/OriginSelect'
import styles from './SelectRepertory.less'
import {
    getStore,
} from '@hualala/platform-base'

export default class SelectRepertory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            clearVisible: false,
            value: '',
            inputValue: '',
        }

        this.showModal = this.showModal.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
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

    showModal() {
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

    handleOk(value) {
        const self = this

        let orgId = ''
        let orgName = ''

        if (this.props.multiple !== void 0 && !this.props.multiple && value.length > 1) {
            Modal.error({
                content: '最多只可选择一个仓位，请重新选择',
            })

            return
        }

        if (value && value.length > 0) {
            orgId = _.pluck(value, 'orgID').join(',')
            orgName = _.pluck(value, 'orgName').join(',')
        }

        this.setState({
            modalVisible: false,
        })

        this.props.input.onChange({
            value: orgId,
            inputValue: orgName,
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

        let urlFlag = '2'
        const vp = getStore().getState().user.get('viewPointID')

        if (vp === 2) {
            urlFlag = 'all'
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
                        className={styles.SelectRepertory}
                        onClick={this.showModal}
                        onMouseOver={() => { this.showClear(true) }}
                        onMouseOut={() => { this.showClear(false) }}
                    >
                        {this.state.inputValue}
                        <Icon
                            type="cross-circle"
                            style={{ 'display': this.state.clearVisible ? 'block' : 'none' }}
                            onClick={this.handleClear}
                        />
                        {
                            this.state.modalVisible ?
                                <ModalSelector
                                    visible={this.state.modalVisible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    urlFlag={urlFlag}
                                    defaultValue={[]}
                                />
                                : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}
