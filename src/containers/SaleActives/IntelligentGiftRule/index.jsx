import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Button, Table, Tooltip, Row, Col, Select, Input, Switch, Modal, message } from 'antd';
import { jumpPage,closePage, decodeUrl, getStore } from '@hualala/platform-base'
import BaseForm  from '../../../components/common/BaseForm';
import CustomerRange from './components/CustomerRange'
import styles from './IntelligentGiftRule.less'

const Option = Select.Option;

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class IntelligentGiftRule extends React.Component {
    constructor(){
        super();
        this.state = {
            cycleTypeOpt: [{label: '每周', value: '1'}, {label: '每月', value: '2'}],
            cycleDateOpt: [],
            curCycleType: '1',
            customerRangeSettings: {},
            giftRule: {}
        }
    }

    componentDidMount(){
        this.getDetail()
    }

    componentWillReceiveProps(){

    }

    onCancel = () => {
        closePage()
        jumpPage({pageID: '10000730001'})
    }

    onSubmit = () => {
        let {customerRangeSettings, giftRule} = this.state
        this.GiftRuleForm.validateFields((err, value) => {
            // console.log('>>aa', err, value)
            if(!err){
                this.customerRangeForm.validateFieldsAndScroll((error, val) => {
                    // console.log('>>bb', error, val)
                    if(!error){
                        let parm = {
                            ...giftRule,
                            ...value,
                            ...customerRangeSettings
                        }
                        let {adjustStepLength = 0, initialGiftValue = 0, adjustMaxAmount = 0, cycleType = 1} = parm

                        // 校验
                        let remainder = initialGiftValue % adjustStepLength
                        if(remainder != 0){
                            message.warn('每次调整幅度数值需要被初始券面额数值整除');
                            return;
                        }
                        
                        if(adjustMaxAmount < initialGiftValue){
                            message.warn('调整区间最大值不能小于初始券面额');
                            return;
                        }

                        // 新增、编辑
                        let editType = giftRule.itemID ? 'createActiveCom/updateGiftRule' : 'createActiveCom/addGiftRule'
                        // console.log('parm', parm)
                        
                        this.props.dispatch({
                            type: editType,
                            payload: {...parm}
                        }).then(res => {
                            if(res){
                                this.onCancel()
                            }
                        })

                    }
                })
            }
        })
    }

    getDetail = () => {
        this.props.dispatch({
            type: 'createActiveCom/getGiftRuleDetail',
            payload: {}
        }).then(res => {
            this.setState({customerRangeSettings: res, giftRule: res})
        })
    }

    getCycleDateOpts = (type) => {
        let range = [];
        let weeks = ['周一','周二','周三','周四','周五','周六','周日',]
        let limit = type == 1 ? 7 : 31;
        for(let i=1; i<=limit; i++){
            let label = type == 1 ? weeks[i-1] : `${i}日`
            range.push({
                label,
                value: `${i}`
            });
        }
        return range
    }

    switchChange = (value) => {
        let checkeFlag = false;
        this.GiftRuleForm.validateFields((err, value) => {
            if(!err){
                this.customerRangeForm.validateFieldsAndScroll((error, val) => {
                    if(!error){
                        checkeFlag = true
                    }
                })
            }
        })
        if(checkeFlag || this.state.giftRule.itemID){
            let content = value ? '启用规则后，会在下个周期执行发券' : '禁用规则后，将不再给会员发券'
            Modal.confirm({
                title: `确定${value ? '启用': '禁用'}`,
                content: (
                    <div>
                        <span>{content}</span>
                    </div>
                ),
                onOk: () => {
                    this.props.dispatch({
                        type: 'createActiveCom/switchGiftRuleActive',
                        payload: {isActive: value ? 1 : 0, itemID: this.state.giftRule.itemID}
                    })
                    .then(res => {
                        if(res){
                            this.getDetail()
                        }
                    })
                },
                onCancel() {
                    
                },
            });
        }else{
            Modal.warning({
                title: '请先编辑并保存执行规则，再启用',
            });
        }
    }

    handleFromChange = (key, value) => {
        if(key == 'cycleType'){
            let opts = this.getCycleDateOpts(value)
            this.setState({cycleDateOpt: opts, curCycleType: value})
        }
    }

    RangeChange = (data) => {
        this.setState({customerRangeSettings: data})
    }

    render(){
        let {cycleTypeOpt, cycleDateOpt, customerRangeSettings = {}, curCycleType = '1'} = this.state
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        const { giftRule = {} } = this.props.createActiveCom
        
        let formData = giftRule;
        let {isActive, cycleType = '1', cycleDate = '1', itemID = ''} = formData
        let formItems = {
            isActive: {
                type: 'custom',
                label: '启用状态',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                disabled: !itemID,
                // rules: ['required'],
                render: decorator => (
                    <Row>
                        <Switch checked={!!isActive} checkedChildren="开" unCheckedChildren="关" onChange={this.switchChange} />
                    </Row>
                ),
            }, 
            cycle: {
                type: 'custom',
                label: '发券周期',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                render: decorator => (
                    <Row>
                        <Col span={3}>
                            {decorator({
                                key: 'cycleType',
                                rules: [{
                                    required: true, message: '请选择',
                                }],
                                initialValue: `${cycleType}` || '1'
                            })(
                                <Select style={{ width: '80px', margin: '0 10px 0 6px' }}>
                                    {cycleTypeOpt.map((v) => {
                                        return  <Option key={v.value}>{v.label}</Option>
                                    })}
                                </Select>
                            )}
                        </Col>
                        <Col span={3}>
                            {decorator({
                                key: 'cycleDate',
                                rules: [{
                                    required: true, message: '请选择',
                                }],
                                initialValue: cycleDate || '1'
                            })(
                                <Select style={{ width: '80px', margin: '0 10px 0 6px' }}>
                                    {cycleDateOpt.map((v) => {
                                        return  <Option key={v.value}>{v.label}</Option>
                                    })}
                                </Select>
                            )}
                        </Col>
                    </Row>
                ),
            }, 
            consumptionCount: {
                type: 'custom',
                label: '会员群体',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                render: decorator => (
                    <Row className={styles.textWrap}>
                        <Col span={3}>历史消费次数超</Col>
                        <Col span={4}>
                            {decorator({
                                key: 'consumptionCount',
                                rules: [{
                                    required: true, message: '数值不能为空',
                                }, {
                                    pattern: /^(([1-9]\d{0,4}))?$/,
                                    message: '请输入大于零的5位以内整数',
                                }],
                            })(
                                <Input placeholder="请输入次数" addonAfter="次" />
                            )}
                        </Col>
                        <Col span={3}>的会员参与活动</Col>
                    </Row>
                ),
            }, 
            customerRangeSettings: {
                type: 'custom',
                label: ' ',
                labelCol: { span: 2 },
                wrapperCol: { span: 20 },
                rules: ['required'],
                render: decorator => (
                    <Row className={styles.textWrap}>
                        <CustomerRange onChange={this.RangeChange} getForm={(form) => this.customerRangeForm = form} decorator={decorator} value={customerRangeSettings} />
                    </Row>
                ),
            }, 
            giftValidUntilDay: {
                type: 'custom',
                label: '券有效期',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                render: decorator => (
                    <Row className={styles.textWrap}>
                        <Col span={5}>发放后立即生效，有效期</Col>
                        <Col span={4}>
                            {decorator({
                                key: 'giftValidUntilDay',
                                rules: [{
                                    required: true, message: '数值不能为空',
                                }, {
                                    pattern: curCycleType == 1 ? /^(?:[1-7])$/ : /^(?:1[0-9]|2[0-9]|[1-9]|30)$/,
                                    message: `请输入1~${curCycleType == 1 ? '7' : '30'}之间的整数`,
                                }],
                            })(
                                <Input placeholder="请输入天数" addonAfter="天" />
                            )}
                        </Col>
                    </Row>
                ),
            }, 
            blacklistThreshold: {
                type: 'custom',
                label: '营销黑名单',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                render: decorator => (
                    <Row className={styles.textWrap}>
                        <Col span={2}>连续发放</Col>
                        <Col span={4}>
                            {decorator({
                                key: 'blacklistThreshold',
                                rules: [{
                                    required: true, message: '数值不能为空',
                                }, {
                                    pattern: /^(?:1[0-2]|[1-9])$/,
                                    message: '请输入1~12之间的整数',
                                }],
                            })(
                                <Input placeholder="请输入次数" addonAfter="次" />
                                )}
                        </Col>
                        <Col span={6}>顾客未消费，则停止向该用户发券</Col>
                    </Row>
                ),
            }, 
        };
        let formKeys = ['isActive', 'consumptionCount', 'cycle', 'customerRangeSettings', 'giftValidUntilDay', 'blacklistThreshold'];

        return (
            <div className={styles.actWrap}>
                <Row style={{width: '100%'}}>
                    <Col span={24}>
                        <BaseForm
                            getForm={(form) => this.GiftRuleForm = form}
                            formItems={formItems}
                            formData={formData}
                            formKeys={formKeys}
                            onChange={this.handleFromChange}
                        />
                    </Col>
                </Row>
                <div className={styles.btnWrap}>
                    <Button onClick={this.onSubmit} type="primary">确定</Button>
                    <Button onClick={this.onCancel}>取消</Button>
                </div>
            </div>
        )
    }
}

export default IntelligentGiftRule
