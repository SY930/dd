import React from 'react';
import { Row, Col, Tooltip, Icon, Radio, Input, Form, Switch } from "antd";
import { connect } from "react-redux";
import ShopSelector from '../../../components/ShopSelector';
import styles from "./style.less";
import { isFilterShopType } from '../../../helpers/util';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const formKeys = ['status', 'createRule', 'durationTime', 'rebateRatio', 'rebateWithdrawRule'];

class Admin extends React.Component {
    constructor(props){
        super(props);
        this.queryFrom = null;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        return (
           <Col span={24} className={styles.admin}>
                <Form ref={node => this.queryFrom = node}>
                    <FormItem 
                        label='启用状态' 
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('openStatus', {
                                initialValue: false,
                                valuePropName: "checked",
                            })(
                                <Switch 
                                    checkedChildren="开" 
                                    unCheckedChildren="关"
                                    onChange={checked => this.setState({ openStatus: checked})}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem 
                        label='分销商品'
                        {...formItemLayout}
                    >
                        <div className={styles.rectBox}>
                            {
                                getFieldDecorator('distributionGoods', {        
                                })(
                                    <ShopSelector 
                                        placeholder='点击选择店铺，为空为全部商品'
                                    />
                                )
                            }
                        </div>
                    </FormItem>
                    <FormItem 
                        label='适用门店'
                        {...formItemLayout}
                    >
                        <div className={styles.rectBox}>
                            {
                                getFieldDecorator('applicableShops', {        
                                })(
                                    <ShopSelector 
                                        placeholder='点击选择店铺，为空为全部门店'
                                    />
                                )
                            }
                        </div>
                    </FormItem>
                    <FormItem 
                        label='分销关系建立规则' 
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('createRule', {
                                initialValue: 1,
                            })(
                                <RadioGroup>
                                    <Radio value={1}>被邀请人下单后建立</Radio>
                                    <Radio value={2}>被邀请人通过分享链接进入时</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    <FormItem 
                        label='分销关系持续时间' 
                        {...formItemLayout}
                        style={{display: 'flex'}}
                        className={styles.durationTime}
                    >
                        {
                            getFieldDecorator('durationTime', {
    
                            })(
                                <Input 
                                    addonAfter='天'
                                />
                            )
                        }
                            <Tooltip 
                                placement="top" 
                                title='此配置仅针对新邀请用户有效，即上线邀请后，系统记录关系绑定时间，到期后自动解绑，上线不再享受佣金。' 
                            >
                                <Icon type="question-circle-o"  style={{marginLeft: '8px'}} className={styles.questionIcon} />
                            </Tooltip>
                    </FormItem>
                    <FormItem 
                        label='分销返佣金比例' 
                        {...formItemLayout}
                    >
                        <span style={{marginRight: '8px'}}>占订单实付金额</span>
                        {
                            getFieldDecorator('rebateRatio', {
                            })(
                                <Input 
                                    addonAfter='%'
                                />
                            )
                        }
                        <Tooltip 
                            placement="top" 
                            title='为避免被人重复下单退单所产生的刷单行为，建议在支付/交易完成1～10天后允许提现。' 
                        >
                            <Icon type="question-circle-o"  style={{marginLeft: '8px'}} className={styles.questionIcon} />
                        </Tooltip>
                    </FormItem>
                    <FormItem 
                        label='返佣提现规则' 
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('rebateWithdrawRule', {
                                initialValue: 2,
                            })(
                                <RadioGroup className={styles.rebateWithdrawRuleRadioGroup}>
                                    <Radio value={1} className={styles.rebateWithdrawRuleRadio}>
                                        {
                                                getFieldDecorator('days')(
                                                <Input 
                                                    addonAfter='天'
                                                />
                                                )
                                        }
                                        <span style={{marginLeft: '8px'}}>后可提现</span>
                                        <Tooltip 
                                            placement="top" 
                                            title='为避免被人重复下单退单所产生的刷单行为，建议在支付/交易完成1～10天后允许提现。' 
                                        >
                                            <Icon type="question-circle-o"  style={{marginLeft: '8px'}} />
                                        </Tooltip>
                                    </Radio>
                                    <Radio value={2}>被邀请人交易完成</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                </Form>   
           </Col>
        )
    }
}

export default Form.create()(Admin)

