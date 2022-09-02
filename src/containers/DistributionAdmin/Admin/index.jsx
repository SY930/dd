import React from 'react';
import { Row, Col, Tooltip, Icon, Radio, Input, Form, Switch } from "antd";
import { connect } from "react-redux";
import styles from "./style.less";
import BaseForm from '../../../components/common/BaseForm';
import { distributionTypesOptions, relationRuleOptions } from "./constant";
import ImageUpload from 'components/common/ImageUpload';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

// const formKeys = ['status', 'createRule', 'durationTime', 'rebateRatio', 'rebateWithdrawRule'];

class Admin extends React.Component {
    constructor(props){
        super(props);
        this.form = null;
    }

    render() {
        // // const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const formKeys = ['distributionStatus', 'distributionTypes', 'relationRule', 'distributionTimeStep', 'rebateRatio', 'rebateRule', 'rakeBackID', 'bannerUri'];
        const formItems = {
            distributionStatus: {
                label: '启用状态:',
                type: 'switcher',
                onLabel: '开',
                offLabel: '关',
            },
            distributionTypes: {
                label: '分销商品类型:',
                type: 'checkbox',   
                rules: [{
                    required: true, message: '请选择分销商品类型',
                }],
                options: distributionTypesOptions
            },
            relationRule: {
                label: '分销关系建立规则:',
                type: 'radio',
                defaultValue: 1,
                options: relationRuleOptions
            },
            distributionTimeStep: {
                label: '分销关系持续时间:',
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                            {decorator({
                                rules: [
                                 {
                                    pattern: /^\+?\d{0,8}$/,
                                    message: '请输入8位以内整数',
                                }],
                            })(<Input addonAfter="天" />)}
                            <Tooltip 
                                placement="top" 
                                title='此配置仅针对新邀请用户有效，即上线邀请后，系统记录关系绑定时间，到期后自动解绑，上线不再享受佣金。' 
                            >
                                <Icon type="question-circle-o"  style={{marginLeft: '8px'}} className={styles.questionIcon} />
                            </Tooltip>
                        </Col>
                    </Row>
                ),
            },
            rebateRatio: {
                label: '分销返佣金比例:',
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{marginRight: '5px'}}>订单实付金额的</span>
                            {decorator({
                                rules: [
                                 {
                                    pattern: /^\+?\d{0,8}$/,
                                    message: '请输入8位以内整数',
                                }],
                            })(<Input addonAfter="%" />)}
                            <Tooltip 
                                placement="top" 
                                title='为避免被人重复下单退单所产生的刷单行为，建议在支付/交易完成1～10天后允许提现。' 
                            >
                                <Icon type="question-circle-o"  style={{marginLeft: '8px'}} className={styles.questionIcon} />
                            </Tooltip>
                        </Col>
                    </Row>
                ),
            },
            rebateRule: {
                label: '返佣提现规则:',
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                            {decorator({
                                initialValue: '1',
                                rules: [
                                {
                                    pattern: /^\+?\d{0,8}$/,
                                    message: '请输入8位以内整数',
                                }],
                            })(
                                <RadioGroup>
                                    <Radio value="1" style={{ display: 'block' }}>
                                        <span>被邀请人支付成功</span>
                                        {decorator({
                                            key: 'withdrawTimeStep'
                                        })(
                                            <Input style={{ width: '100px', margin: '0 5px' }} />
                                        )}
                                        <span>天后可提现</span>
                                    </Radio>
                                    <Radio value="2" style={{ display: 'block' }}>
                                        <span>被邀请人交易完成</span>
                                        {decorator({
                                            key: 'withdrawTimeStep'
                                        })(
                                            <Input style={{ width: '100px', margin: '0 5px' }} />
                                        )}
                                        <span>天后可提现</span>
                                    </Radio>
                                </RadioGroup>  
                            )}
                        </Col>
                    </Row>
                ),
            },
            rakeBackID: {
                label: '权益包账户ID:',
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col span={24}>
                            {decorator({
                                rules: [
                                    { required: true, message: '最大输入限制50字符' }
                                ],
                            })(<Input style={{width: '400px'}} />)}
                        </Col>
                    </Row>
                ),
            },
            bannerUri: {
                label: '分销引导图',
                type: 'custom',
                render: decorator => (
                    <Row style={{position: 'relative'}}>
                        <Col className={styles.bannerUriBox}>
                            <Col className={styles.leftBanner}>
                                {
                                    decorator({

                                    })(
                                        <ImageUpload
                                            limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                                            limitSize={5 * 1024 * 1024}
                                            getFileName={true}
                                            tips={'上传图片'}
                                        />
                                    )
                                }
                            </Col>
                            <Col>
                                <div className={styles.rightDesc}>
                                    <p>图片大小不要超过1M</p>
                                    <p>建议尺寸750*2000</p>
                                    <p>支持JPG、PNG图片文件</p>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                ),
            }
        }
        return (
           <Col span={24} className={styles.adminContainer} style={{height: 'calc(100vh - 100px'}}>
                <BaseForm
                    getForm={form => this.form = form}
                    formKeys={formKeys}
                    formItems={formItems}
                    formItemLayout={FormItemLayout}
                />
           </Col>
        )
    }
}

export default Admin;

