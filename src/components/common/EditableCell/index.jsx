/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-05-03T17:54:37+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:12:13+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import { Input, Icon, Button, Popconfirm } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';


class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    selected = (e) => {
        ReactDOM.findDOMNode(this[`_input${e.target.id}`]).select();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value,
            })
        }
    }
    render() {
        const { value, editable } = this.state;
        // const value = this.props.value;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                id={this.props.index}
                                ref={(input) => {
                                    this[`_input${this.props.index}`] = input
                                }}
                                onClick={e => this.selected(e)}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                                onBlur={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            <span onClick={this.edit}>{value || ' '}</span>
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

export default EditableCell;
