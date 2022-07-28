import React from 'react';
import { Row, Col, Tooltip, Icon, Radio, Input } from "antd";
import BaseForm from 'components/common/BaseForm';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import styles from "./style.less";

const RadioGroup = Radio.Group;

const formKeys = ['status', 'createRule', 'durationTime', 'rebateRatio', 'rebateWithdrawRule'];
const formItems = {
    status: {
        type: 'switcher',
        label: '启用状态',
        defaultValue: false,
        onLabel: '开',
        offLabel: '关',
    },
    // distributionGood: {
    //     type: 'text',
    //     label: '被邀请人',
    // },
    // applicableShops: {
    //     type: 'custom',
    //     label: '下单时间',
    //     render: decorator => (
    //         <Row>
    //             <Col>
    //               111111
    //             </Col>
    //         </Row>
    //     ),
    // },
    createRule: {
        type: 'radio',
        label: '分销关系建立规则',
        defaultValue: 0,
        options: [
            { label: '被邀请人下单后建立', value: 0 },
            { label: '被邀请人通过分享链接进入时', value: 1 },
        ],
    },
    durationTime: {
        type: 'custom',
        label: '分销关系持续时间',
        render: decorator => (
            <Row>
                <Col>
                    {
                        decorator({})(
                           <div style={{display: 'flex', alignItems: 'center'}}>
                                <PriceInput 
                                    modal="int"
                                    style={{ width: 130 }} 
                                    addonAfter='天' 
                                />
                                <Tooltip 
                                    placement="top" 
                                    title='此配置仅针对新邀请用户有效，即上线邀请后，系统记录关系绑定时间，到期后自动解绑，上线不再享受佣金。' 
                                >
                                    <Icon type="question-circle-o"  style={{marginLeft: '8px'}} />
                                </Tooltip>
                           </div>
                        )
                    }
                </Col>
            </Row>
        )
    },
    rebateRatio: {
        type: 'custom',
        label: '分销返佣金比例 占订单实付金额',
        render: decorator => (
            <Row>
                <Col>
                    {
                        decorator({})(
                           <div style={{display: 'flex', alignItems: 'center'}}>
                                <PriceInput 
                                    modal="int"
                                    style={{ width: 130 }} 
                                    addonAfter='%' 
                                />
                           </div>
                        )
                    }
                </Col>
            </Row>
        )
    },
    rebateWithdrawRule: {
        type: 'custom',
        label: '返佣提现规则',
        render: decorator => (
            <Row>
                <Col>
                    {
                        decorator({
                            key: 'rebateWithdrawRule'
                        })(
                           <div>
                                <RadioGroup className={styles.rebateWithdrawRuleRadioGroup} defaultValue={'1'}>
                                    <Radio value={'1'} className={styles.rebateWithdrawRuleRadio}>
                                        {
                                            decorator({
                                                key: 'days'
                                            })(
                                                <PriceInput
                                                    addonBefore='被邀请人支付成功'
                                                    modal="int"
                                                    style={{ width: 130 }} 
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
                                    <Radio value={'2'}>被邀请人交易完成</Radio>
                                </RadioGroup>
                           </div>
                        )
                    }
                </Col>
            </Row>
        )
    }
};

export default class Admin extends React.Component {
    constructor(props){
        super(props);
        this.queryFrom = null;
        this.state = {
            ruleType: 1,
            days: null,
        }
    }

    onFormChange = (key, value) => {
        console.log('key===key', key, value);
        // setFieldsValue
        // this.queryFrom.setFieldsValue({
        //     key: value.number
        // });
    }

    render() {
        return (
            <Col span={24}>
                <BaseForm
                    getForm={form => this.queryFrom = form}
                    formItems={formItems}
                    formKeys={formKeys}
                    layout="horizontal"
                    onChange={this.onFormChange}
                />
            </Col>
        )
    }
}
