import React, { Component } from 'react'
import {
    DatePicker,
} from 'antd'

export default class SCDatePicker extends Component {
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

    onChange(e, v) {
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
            now,
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
                    <DatePicker
                        allowClear={false}
                        placeholder="请选择日期"
                        format="YYYY-MM-DD"
                        {...this.props.input}
                    />
                    {
                        /* this.props.meta.error && 
						<span>{this.props.meta.error}</span> */
                    }
                </div>
            </div>
        )
    }
}
