import React, { Component } from 'react'
import { Row, Col, Icon, Form, Select } from 'antd';
import Rule from './Rule';
import styles from './styles.less';

const FormItem = Form.Item;

class MyFaceRule extends Component {
    constructor(props) {
        console.log(props, 'propspropsprops')
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    onChange = () => {

    }

    add = () => {
        const { value } = this.props;
    }

    // del = () => {

    // }

    render() {
        const { value = [], decorator } = this.props;
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 31 ~ MyFaceRule ~ render ~ value", value)
        // const { getFieldDecorator } = form;
        const { length } = value;
        // TODO: 查看状态不可编辑
        // 防止回显没数据不显示礼品组件
        if (!value[0]) {
            value.push({ id: '1' });
        }
        return (
            <div>
                {
                    value.map((v, i) => {
                        return (
                            <div key={v.id} className={styles.MyFaceRuleBox}>
                                <div className={styles.MyFaceRuleConntet}>
                                    <span>规则{i + 1}</span>
                                    <p style={{ height: 24 }}></p>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p> <span className={styles.tip}>*</span>目标范围</p>
                                        <FormItem>
                                            {
                                                decorator({
                                                    key: 'range',
                                                    initialValue: '',
                                                    onChange: this.onRange,
                                                    rules: [{
                                                        require: true,
                                                        validator: () => {

                                                        },
                                                    }],
                                                })(
                                                    <Select style={{ width: '120px' }}>
                                                        {
                                                            [{ label: '会员身份', value: 'memberShip' }, { label: '会员标签', value: 'memberLabel' }].map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        {
                                            v.range === 'memberShip' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'isHaveCard',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [{ label: '是', value: '1' }, { label: '否', value: '0' }].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            v.range === 'memberLabel' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'attribute',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [{ label: '会员星座', value: '1' }, { label: '活跃度', value: '0' }, { label: '消费特征', value: '2' }].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            v.range === 'memberLabel' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'thirdAttribute',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                    </div>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p>点击触发事件</p>
                                        <FormItem>
                                            {
                                                decorator({
                                                    key: 'events',
                                                    initialValue: '',
                                                    onChange: this.onEvents,
                                                    rules: [{
                                                        require: true,
                                                        validator: () => {

                                                        },
                                                    }],
                                                })(
                                                    <Select style={{ width: '120px' }}>
                                                        {
                                                            [{ label: '无', value: '0' }, { label: '免费领取', value: 'free' }, { label: '会员标签', value: 'memberLabel' }].map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        {
                                            v.events &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'eventsInfo',
                                                        initialValue: '',
                                                        onChange: this.onEvents,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '260px' }}>
                                                            {
                                                                [{ label: '免费领取', value: 'free' }, { label: '会员标签', value: 'memberLabel' }].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>

                                        }
                                    </div>
                                </div>
                                <div>
                                    {
                                        i == 0 && <div onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </div>
                                    }
                                    {i > 0 &&
                                        <div>
                                            <span onClick={this.onDel}>
                                                <Icon type="close-circle" style={{ fontSize: 26, color: '#Ed7773' }} />
                                            </span>
                                            <span onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </span>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default MyFaceRule
