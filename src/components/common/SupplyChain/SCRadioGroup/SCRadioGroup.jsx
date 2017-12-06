import React, { PureComponent } from 'react'
import { Radio } from 'antd'

const RadioGroup = Radio.Group
export default class SCRadioGroup extends PureComponent {
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
        return (
            <RadioGroup onChange={this.onChange} value={this.props.input.value}>
                {this.props.children}
            </RadioGroup>
        )
    }
}
