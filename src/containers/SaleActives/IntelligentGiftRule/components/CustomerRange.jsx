import React, { PureComponent as Component } from 'react';
import { Tabs, Button, Icon, Input, Form, Select, Row, Col, Tooltip, message, TreeSelect } from 'antd';
import styles from '../IntelligentGiftRule.less'
import { axios, getStore } from '@hualala/platform-base';
import _ from 'lodash'

const FormItem = Form.Item;

class CustomerRange extends Component {
    state = {
        curId: 10,
        treeData: this.props.treeData || [],
    }
    
    componentDidMount() {
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        
    }

    onAllChange(data){
        const { value, onChange } = this.props;
        let list = {...value};
        const item = list;
        list = { ...item, ...data };
        
        onChange(list);
    }

    giftValueChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ initialGiftValue: value, adjustMinAmount: value });
    }

    adjustStepChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ adjustStepLength: value });
    }

    adjustMaxChange = ({ target }) => {
        const { value } = target;
        this.onAllChange({ adjustMaxAmount: value });
    }



    render() {
        const { value, decorator, form, getForm } = this.props;
        const { getFieldDecorator } = form

        let {isActive, initialGiftValue = 0, adjustStepLength = 0, adjustMinAmount = 0, adjustMaxAmount = 0,} = value
        if (typeof getForm === 'function') {
            getForm(form)
        }

        return (
            <div className={styles.mainBox}>
                <div className={styles.boxTitle}>每个周期发券后根据用户消费情况，在上一周期券的基础上按调整幅度调整发券面额</div>
                <div className={styles.boxCon}>
                    <Form layout="horizontal">
                        <div className={styles.singleItem} >
                            <FormItem 
                                label="初始券面额"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 9}}
                            >
                                {
                                    getFieldDecorator('initialGiftValue', {
                                        rules: [{
                                            required: true, message: '数值不能为空',
                                        }, {
                                            pattern: /^(([1-9]\d{0,4}))?$/,
                                            message: '请输入大于零的5位以内整数',
                                        }],
                                        initialValue: initialGiftValue
                                    })(<Input disabled={!!isActive} onChange={(e)=>{this.giftValueChange(e)}} placeholder="请输入金额" addonAfter="元" />)
                                }
                            </FormItem>
                            <FormItem 
                                label=" 每次调整幅度"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                            >
                                <Row>
                                    <Col span={12}>
                                        {
                                            getFieldDecorator('adjustStepLength', {
                                                rules: [{
                                                    required: true, message: '数值不能为空',
                                                }, {
                                                    pattern: /^(([1-9]\d{0,4}))?$/,
                                                    message: '请输入大于零的5位以内整数',
                                                }],
                                                initialValue: adjustStepLength
                                            })(
                                                <Input disabled={!!isActive} onChange={(e)=>{this.adjustStepChange(e)}} placeholder="请输入金额" addonAfter="元" />
                                            )
                                        }
                                    </Col>
                                    <Col span={2} style={{textAlign: 'center'}}>
                                        <Tooltip title={'系统会根据设置幅度在券面额范围内加减券面额'}>
                                            <Icon type="question-circle" />
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem 
                                label="调整后券面额范围"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 18}}
                            >
                                <Row>
                                    <Col span={10}>
                                        <Input disabled value={initialGiftValue} placeholder="最小值" addonAfter="元" />
                                    </Col>
                                    <Col span={2} style={{textAlign: 'center'}}>~</Col>
                                    <Col span={10}>
                                        {
                                            getFieldDecorator('adjustMaxAmount', {
                                                rules: [{
                                                    required: true, message: '数值不能为空',
                                                }, {
                                                    pattern: /^(([1-9]\d{0,4}))?$/,
                                                    message: '请输入大于零的5位以内整数',
                                                }],
                                                initialValue: adjustMaxAmount
                                            })(
                                                <Input disabled={!!isActive} onChange={(e)=>{this.adjustMaxChange(e)}} placeholder="最大值" addonAfter="元" />
                                            )
                                        }
                                    </Col>
                                </Row>
                            </FormItem>
                        </div>
                    </Form>
                
                </div>
            </div>

        )
    }
}

export default Form.create()(CustomerRange)
