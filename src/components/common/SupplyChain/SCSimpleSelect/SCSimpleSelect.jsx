import React, { PureComponent } from 'react'
import {
    Select,
} from 'antd'

export default class SCSimpleSelect extends PureComponent {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    getRenderedComponent() {
        return this.componentRef;
    }

    initComponentRef = (r) => {
        this.componentRef = r;
    }

    onChange(v) {
        if (v === void 0 || v === null) {
            v = ''
        }

        return this.props.input.onChange(v)
    }

    render() {
        const {
            wrapperStyles,
            width,
            label,
            el,
        } = this.props

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
                    <Select
                        allowClear={true}
                        name={this.props.input.name}
                        value={this.props.input.value}
                        onChange={this.onChange}
                    >
                        {this.props.children}
                    </Select>
                    {
                        /* this.props.meta.error && 
						<span>{this.props.meta.error}</span> */
                    }
                </div>
            </div>
        )
    }
}
