/*
  Created by Zbl on 2016/12/03. 带单位的输入框
  注意：输入框分为2种情况，1、如果是自动百分百的不用考虑，如果是固定宽度需要设定2个宽度，否则样式出错，参数如下：
  width: 是设置总宽度
  InputWidth：是设置里面中间的 输入框 宽度
  background：设置外面的背景颜色
  addonBefore：这是标题名字
  addonAfter：设置单元名字 如果没有单元名称就不用填写
  textAlign:有两个属性  left 和 right
  placeholder : 在组建中直接设置默认值的属性
*/

import React, { Component } from 'react'
import { render } from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Router } from 'react-router';
import { Input, Select, Icon } from 'antd';

const Option = Select.Option;

import styles from './UnitInput.less';
// if (process.env.__CLIENT__ === true) {
//   require('../../../../client/components.less')
// }

export class UnitInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    // this.triggerChange({ value });
    }
    triggerChange(changedValue) {
    // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }
    render() {
        const styles1 = {
            background: this.props.background,
            width: this.props.width,
        }
        const styles2 = {
            width: this.props.InputWidth,
            float: 'right',
            textAlign: this.props.textAlign,
        }

        return (
            <div style={styles1} className={[styles.UnitInputAll, 'clearfix'].join(' ')}>
                <Input
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    addonBefore={this.props.addonBefore}
                    addonAfter={this.props.addonAfter}
                    value={this.props.value}
                    size="large"
                    style={styles2}
                    ref={'unitInput'}
                    onBlur={
                        (e) => {
                            // console.log(e.target.value)
                            this.props.callback && this.props.callback(e.target.value);
                        }
                    }
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}
