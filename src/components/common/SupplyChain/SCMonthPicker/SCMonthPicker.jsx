import React, { PureComponent } from 'react'
import {
    DatePicker,
} from 'antd'

const MonthPicker = DatePicker.MonthPicker

export default class SCMonthPicker extends PureComponent {
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
                    <MonthPicker
                        allowClear={false}
                        placeholder="请选择月份"
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
