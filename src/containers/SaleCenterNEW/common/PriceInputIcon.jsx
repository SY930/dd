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
import { Input, Icon } from 'antd';
import ReactDOM from 'react-dom';

import styles from '../ActivityPage.less';

class PriceInputIcon extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            number: value.number || '',
            modal: this.props.modal || 'float', // float or int
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
            reg = /^-?([0-9]*)(\.[0-9]{0,2})?$/;
            valueNum = this.state.number;
            if (!isNaN(value) && reg.test(value)) {
                valueNum = value;
            } else if (value === '') {
                valueNum = null;
            }
        }
        if (this.state.modal === 'int') {
            reg = /^\d\d*$/;
            valueNum = this.state.number;
            if (!isNaN(value) && reg.test(value)) {
                valueNum = parseInt(value);
            } else if (value === '') {
                valueNum = null;
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
                this.check();
            }
        } else {
            return;
        }

        if (onBlur) {
            onBlur();
        }
    }

    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }

    selected = (e) => {
        const dom = ReactDOM.findDOMNode(this[`_input${e.target.id}`]).getElementsByTagName('input')[0];
        dom.select();
    }

    render() {
        const { size } = this.props;
        const state = this.state;
        return (
            <span>
                <Input
                    type="text"
                    size={size}
                    value={state.number}
                    prefix={<Icon type="edit" />}
                    onBlur={this.handleBlur}
                    onChange={this.handleNumberChange}
                    addonBefore={this.props.addonBefore}
                    addonAfter={this.props.addonAfter}
                    placeholder={this.props.placeholder || ''}
                    id={this.props.index}
                    ref={(input) => {
                        this[`_input${this.props.index}`] = input
                    }}
                    onClick={e => this.selected(e)}
                    onPressEnter={this.check}
                />
            </span>
        );
    }
}

export default PriceInputIcon;
