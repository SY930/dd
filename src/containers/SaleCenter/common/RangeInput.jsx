/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-02T11:12:54+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: RangeInput.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-15T15:34:28+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

'use strict'

import React, {PropTypes} from 'react';
import {
    Form,
    Input,
    Button,
    Col,
    Row,
    InputNumber,
    Icon
} from 'antd';
import PriceInput from './PriceInput';
import styles from './RangeInput.less';

class RangeInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            maxCount: this.props.maxCount || 3,
            data: this.props.data || [
                [0, 0]
            ]
        };

        this.checkPrice = this.checkPrice.bind(this);
        this.add = this.add.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onBlur() {

        alert("blur");
        this.props.form.validateFields((errors, value) => {
            //console.log("errrors is", errors);
            //console.log("value", value);
        })
    }

    checkPrice(rule, value, callback, index) {

        if (value.number > 0) {

            if ("0" == value.key) {
                // less than the amount of the bill count
                if (value.number > this.state.data[value.index][1]) {
                    this.state.data[value.index][0] = value.number;
                    return;
                } else {
                    callback("账单金额小于减去额");
                }

            } else {
                // off number is larger than the whole bill count
                if (value.number < this.state.data[value.index][0]) {
                    this.state.data[value.index][1] = value.number;
                    return
                }
                callback("超过账单金额");
            }
        }
        callback("输入有效金额");
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
            }
        });
    }

    render() {

        const {getFieldDecorator, getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {
                span: 0
            },
            wrapperCol: {
                span: 24
            }
        };

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                span: 24,
                offset: 0
            }
        };

        const formItems = this.state.data.map((item, index) => {

            return (
                <Row key={index}>
                    <Col span={13}>
                        <Form.Item>
                            {getFieldDecorator(`item-${index}-0`, {
                                initialValue: {
                                    number: this.state.data[index][0]
                                },
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            this.checkPrice(rule, {
                                                index: index,
                                                key: "0",
                                                ...value
                                            }, callback)
                                        }
                                    }
                                ]
                            })(<PriceInput addonBefore={'消费满'} addonAfter={"元"}
                                           modal="float"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <div>减</div>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            {getFieldDecorator(`item-${index}-1`, {
                                initialValue: {
                                    number: this.state.data[index][1]
                                },

                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            this.checkPrice(rule, {
                                                index: index,
                                                key: "1",
                                                ...value
                                            }, callback)
                                        }
                                    }
                                ]
                            })(<PriceInput addonAfter={"元"}
                                           modal="float"/>)}

                        </Form.Item>
                    </Col>
                    <Col span ={4}>
                        <div className={styles.iconsStyle}>
                            {this.renderHandleIcon(index)}
                        </div>
                    </Col>
                </Row>

            )
        });
        return (
            <Form  className={styles.rightInput} onSubmit={this.handleSubmit}>
                {formItems}
            </Form>
        )



    }



    remove(index) {
        let newArr = this.state.data;
        newArr.splice(index, 1);
        this.setState({data: newArr});

        let fieldsValue = newArr.reduce((previous, current, index) => {
            previous[`item-${index}-0`] = {
                number: current[0]
            };
            previous[`item-${index}-1`] = {
                number: current[1]
            };
            return previous;
        }, {});

        this.props.form.setFieldsValue(fieldsValue);
    }

    add() {

        if (this.state.data.length == 3)
            return;
        let newArr = this.state.data;
        newArr.push([0, 0]);
        this.setState({data: newArr});
    }

    renderHandleIcon(index) {

        let disabledPlus = this.state.data.length == 3
            ? true
            : false;

        if (index == 0) {
            if (this.state.data.length > 1) {
                return (
                    <span>
            <Icon className={styles.pulsIcon} disabled={disabledPlus} type="plus-circle-o" onClick={this.add}/>
            <Icon className={styles.deleteIcon} type="minus-circle-o" onClick={() => this.remove(index)}/>
          </span>
                )
            }
            return (<Icon className={styles.pulsIconLeft} type="plus-circle-o" onClick={this.add}/>)
        } else if (index == 1) {
            return (
                <span>
          <Icon className={styles.pulsIcon} disabled={disabledPlus} type="plus-circle-o" onClick={this.add}/>
          <Icon className={styles.deleteIcon} type="minus-circle-o" onClick={() => this.remove(index)}/>
        </span>
            )
        } else if (index == 2) {
            return (<Icon className={styles.deleteIcon} type="minus-circle-o" onClick={() => this.remove(index)}/>)
        }
    }
}

export default Form.create()(RangeInput);
