/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-02T15:49:20+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: PriceInput.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T10:12:09+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import styles from '../ActivityPage.less';

class PriceInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            number: value.number || '',
            modal: this.props.modal || 'float', // float or int
            maxNum: this.props.maxNum || 'noLimit',
            // status: this.props.status || {},
        };

        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({ ...value });
        }
    }
    handleNumberChange(e) {
        const { value } = e.target;
        let reg,
            valueNum;
        // const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if (this.state.modal === 'float') {
            if (this.props.discountMode) {
                reg = /^-?([0-9]*)(\.[0-9]{0,3})?$/;
            } else {
                reg = /^-?([0-9]*)(\.[0-9]{0,2})?$/;
            }
            valueNum = this.state.number;
            if (!isNaN(value) && reg.test(value)) {
                valueNum = value;
            } else if (value === '') {
                valueNum = null;
            }
        }
        if (this.state.modal === 'int') {
            const { maxNum } = this.state;
            const _reg = new RegExp(`^\\+?\\d{0,${maxNum}}$`);
            reg = maxNum == 'noLimit' ? /^\d\d*$/ : _reg;
            valueNum = this.state.number;
            // before modification
            // if (!isNaN(value) && reg.test(value)) {
            //    valueNum = parseInt(value);
            // }else if(value === ''){
            //     valueNum = null;
            // }
            if (value === '') {
                valueNum = null;
            } else if (!isNaN(value) && reg.test(value)) {
                valueNum = parseInt(value);
            }
        }
        this.setState({ number: valueNum }, () => {
            this.props.onChange && this.props.onChange(Object.assign({}, this.state));
        });
    }

    handleBlur(e) {
        const onBlur = this.props.onBlur;
        const value = e.target.value;
        if (value) {
            if (value.charAt(value.length - 1) === '.') {
                this.handleNumberChange({ value: value.slice(0, -1) });
            }
        } else {
            return;
        }

        if (onBlur) {
            onBlur();
        }
    }

    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        const { size, disabled } = this.props;
        const props = Object.assign({}, this.props);
        delete props.modal; // 将modal 属性传递下去会产生warning
        const state = this.state;
        return (
            <Input
                {...props}
                type="text"
                size={size}
                value={state.number}
                onBlur={this.handleBlur}
                onChange={this.handleNumberChange}
                addonBefore={this.props.addonBefore}
                addonAfter={this.props.addonAfter}
            />
        );
    }
}

export default PriceInput;
