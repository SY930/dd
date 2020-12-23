import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Button, Table, Tooltip, Row, Col, Select, Input, Switch, Modal, message } from 'antd';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import BaseForm  from '../../../components/common/BaseForm';
import CustomerRange from './components/CustomerRange'
import styles from './housekeeper.less'

const Option = Select.Option;

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Housekeeper extends React.Component {
    constructor(){
        super();
        this.state = {
            cycleTypeOpt: [{label: '每周', value: '1'}, {label: '每月', value: '2'}],
            cycleDateOpt: [],
            customerRangeSettings: [],
            eventRule: {}
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

    // 交叉校验
    checkTimeRange = (arr) => {
        for (var k in arr) {
            if (!this.judege(k, arr)) {
                return false
            }
        }
        return true
    }

    judege = (index, arr) => {
        for (var k in arr) {
            if(Number(arr[k].amountStart) >= Number(arr[k].amountEnd)){
                message.warning(`第${Number(k)+1}条单均消费结束必须大于开始！`)
                return false;
            }
            if (index !== k) {
                //判断交叉时间是从第一个对象对比除了本身之外的开始时间和结束时间，如果开始时间在对比对象的开始时间和结束时间之间，或者结束时间在对比对象的开始时间和结束时间之间则是交叉。
                if (Number(arr[k].amountStart) <= Number(arr[index].amountStart) && Number(arr[k].amountEnd) >= Number(arr[index].amountStart)) {
                    message.warning('每组规则的金额不能有交叉');
                    return false
                }
                if (Number(arr[k].amountStart) <= Number(arr[index].amountEnd) && Number(arr[k].amountEnd) >= Number(arr[index].amountEnd)) {
                    message.warning('每组规则的金额不能有交叉');
                    return false
                }
            }
        }
        return true
    }

    onSubmit = () => {
        let {customerRangeSettings, eventRule} = this.state
        this.eventRuleForm.validateFields((err, value) => {
            // console.log('>>aa', err, value)
            if(!err){
                this.customerRangeForm.validateFieldsAndScroll((error, val) => {
                    // console.log('>>bb', error, val)
                    if(!error){
                        // 校验
                        let checked = this.checkTimeRange(customerRangeSettings)
                        if(!checked){
                            return;
                        } 
                        let parm = {
                            ...eventRule,
                            ...value,
                            customerRangeSettings
                        }
                        // 新增、编辑
                        let editType = eventRule.itemID ? 'createActiveCom/updateEventRule' : 'createActiveCom/addEventRule'
                        this.props.dispatch({
                            type: editType,
                            payload: {eventRule: parm}
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
            type: 'createActiveCom/getEventRuleDetail',
            payload: {}
        }).then(res => {
            let {customerRangeSettings = []} = res
            this.setState({customerRangeSettings, eventRule: res})
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
        this.eventRuleForm.validateFields((err, value) => {
            if(!err){
                this.customerRangeForm.validateFieldsAndScroll((error, val) => {
                    if(!error){
                        checkeFlag = true
                    }
                })
            }
        })
        if(checkeFlag || eventRule.itemID){
            let content = value ? '启用规则后，会在下个周期执行方案推送' : '禁用规则后，将不再执行方案推送'
            Modal.confirm({
                title: `确定要${value ? '启用': '禁用'}设置吗？`,
                content: (
                    <div>
                        <span>{content}</span>
                    </div>
                ),
                onOk: () => {
                    this.props.dispatch({
                        type: 'createActiveCom/switchEventRuleActive',
                        payload: {active: value ? 1 : 0}
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
            this.setState({cycleDateOpt: opts})
        }
    }

    RangeChange = (list) => {
        this.setState({customerRangeSettings: list})
    }


    render(){
        let {cycleTypeOpt, cycleDateOpt, customerRangeSettings = []} = this.state
        const { eventRule } = this.props.createActiveCom
        let formData = eventRule;
        let {active, cycleType, cycleDate} = eventRule
        let formItems = {
            active: {
                type: 'custom',
                label: '启用状态',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                // rules: ['required'],
                render: decorator => (
                    <Row>
                        <Switch checked={!!active} checkedChildren="开" unCheckedChildren="关" onChange={this.switchChange} />
                    </Row>
                ),
            }, 
            cycle: {
                type: 'custom',
                label: '推送周期',
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
            consumeDays: {
                type: 'custom',
                label: '会员群体',
                labelCol: { span: 2 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                render: decorator => (
                    <Row className={styles.textWrap}>
                        <Col span={2}>距今超</Col>
                        <Col span={4}>
                            {decorator({
                                key: 'consumeDays',
                                rules: [{
                                    required: true, message: '数值不能为空',
                                }, {
                                    pattern: /^(([1-9]\d{0,4}))?$/,
                                    message: '请输入大于零的5位以内整数',
                                }],
                            })(
                                <Input placeholder="请输入天数" addonAfter="天" />
                            )}
                        </Col>
                        <Col span={2}>未消费</Col>
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
                                    pattern: /^(([1-9]\d{0,4}))?$/,
                                    message: '请输入大于零的5位以内整数',
                                }],
                            })(
                                <Input placeholder="请输入天数" addonAfter="天" />
                            )}
                        </Col>
                    </Row>
                ),
            }, 
        };
        let formKeys = ['active', 'cycle', 'consumeDays', 'customerRangeSettings', 'giftValidUntilDay'];

        return (
            <div className={styles.actWrap}>
                <Row style={{width: '100%'}}>
                    <Col span={24}>
                        <BaseForm
                            getForm={(form) => this.eventRuleForm = form}
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

export default Housekeeper
