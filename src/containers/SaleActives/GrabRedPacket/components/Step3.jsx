import React from 'react'
import { Tabs, Radio, message, Form, Select, Col, Input, Row } from 'antd'
import styles from '../grabRedPacket.less'
import { connect } from 'react-redux';
import TabItem from './TabItem/TabItem'
import moment from 'moment'
import { dateFormat } from '../../constant'
import BaseForm from 'components/common/BaseForm';
// import { formItemLayout } from '../Common';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formList = []
const giftForm = []
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 30 },
}
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))
class Step3 extends React.Component {
    state = {
        giftGetRule: 0,
        chooseTab: '0',
        treeData: this.props.createActiveCom.crmGiftTypes,
        partInTimes: '',
        needCount1: 1,
        isCountVisible: false,
    }
    componentDidMount() {
        this.getSubmitFn()
    }
    componentWillReceiveProps() {
        const {formData} = this.props.createActiveCom
        const { partInTimes } = formData;
        if (partInTimes) {
            this.setState({
                isCountVisible: true
            })
        }
    }
    getSubmitFn = () => {
        if (typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
    }

    handleSubmit = () => {
        let flag = true
        const {isCountVisible} = this.state
        const { formData: modalFormData } = this.props.createActiveCom
        const { giftList, giftList2 ,consumeTotalAmount,maxPartInPerson,partInTimes} = modalFormData
        let formData = {
            ...modalFormData,
        }
        giftList.forEach(v => {
            if (v.rangeDate) {
                v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
                v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
            }
        })
        giftList2.forEach(v => {
            if (v.rangeDate) {
                v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
                v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
            }
        })
        formList.forEach(form => {
            form.validateFieldsAndScroll((e, v) => {
                if (e) {
                    flag = false
                    return false
                }
            })
        })

        if (!flag) {
            return false
        }
        if (!consumeTotalAmount){
            message.warn('请添加触发条件')
            return false;
        }
        if (!maxPartInPerson){
            message.warn('请添加领取限制')
            return false;
        }
        if (isCountVisible && !partInTimes){
            message.warn('请填入每人每天参与活动次数')
            return false;
        }
        if (giftList.length == 1 && (!giftList[0].giftName  || !giftList[0].giftValidUntilDayCount)) {
            message.warn('请添加随机礼品')
            return false
        }
        if (giftList2.length ==  0 || giftList2.length == 1 && (!giftList2[0].giftName  || !giftList2[0].giftValidUntilDayCount)) {
            message.warn('请添加最优礼品')
            return false
        }

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList,
                    giftList2
                }
            }
        })

        return flag
    }

    onRadioChange = (e) => {
        const { formData } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftGetRule: e.target.value
                }
            }
        })

    }

    handleTabChange = (e) => {
        let flag = true
        const giftFormInitiator = [...giftForm]
        giftFormInitiator.length = 2
        giftFormInitiator.forEach(form => {
            if (form) {
                form.validateFieldsAndScroll((e, v) => {
                    if (e) {
                        flag = false
                    }

                })
            }
        })
        formList.forEach(form => {
            form.validateFieldsAndScroll((e, v) => {
                if (e) {
                    flag = false
                }

            })
        })

        if (!flag) {
            return
        }
        this.setState({
            chooseTab: e
        })

    }

    getForm = (key) => (form) => {
        if (!formList[key]) {
            formList[key] = form
        }

    }

    handleGiftChange = (key) => (giftData, type) => {
        const { formData, isView, isEdit } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList: giftData
                }
            }
        })
    }
    handleGiftChange2 = (key) => (giftData, type) => {
        const { formData, isView, isEdit } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList2: giftData
                }
            }
        })
    }
    cacheTreeData = (treeData) => {
        this.setState({
            treeData
        })
    }

    onIptChange = (key) => (e) => {
        const { formData } = this.props.createActiveCom
        const { needCount } = formData
        needCount[key] = Number(e.number)

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    needCount
                }
            }
        })

    }

    getGiftForm = (key) => (form) => {
        giftForm[key] = form
    }

    handleHelpCheckbox = (e) => {
        const { formData } = this.props.createActiveCom
        const { giftList } = formData
        if (e.target.checked && (giftList.length < 4)) {
            giftList[3] = ({
                id: 'wdjiejmgnglooe',
                effectType: '1'
            })
        } else {
            giftList.length = 3
        }
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList
                }
            }
        })
    }
    handleFromChange = (key, value) => {
        // if (!value) return;
        const { formData } = this.props.createActiveCom;
        formData[key] = value
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })

    }
    changeJoinedCount = (key, value) => {
        const { formData } = this.props.createActiveCom;
        if (key == '1') {
            this.setState({
                needCount1: key,
                isCountVisible: false
            })
            formData['partInTimes'] = '';
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })
        }
        if (key == '2') {
            this.setState({
                needCount1: key,
                isCountVisible: true
            })
        }
    }
    renderStartEnd(decorator, form) {
        const { formData } = this.props.createActiveCom;
        let { partInTimes } = formData;
        const { isCountVisible } = this.state;
        return (
            <Row>
                <Col span={6}>每人每天参与活动次数</Col>
                <Col span={6} className={styles.step3JoinNumSelect}>
                    <FormItem>
                        <Select onChange={this.changeJoinedCount} placeholder="不限制" value={isCountVisible ? '限制' : '不限制'}>
                            <Option key="2" value="2">限制</Option>
                            <Option key="1" value="1">不限制</Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col span={6} className={styles.step3JoinNumS}>
                    <FormItem>
                        {isCountVisible ?
                            decorator({
                                key: 'partInTimes',
                                rules: [
                                    {
                                        required:true,
                                        validator: (rule, v, cb) => {
                                            if (v === '') cb(rule.message);
                                            const reg = /^(([1-9]\d{0,4}))$/;
                                            if (reg.test(v)) {
                                                cb()
                                            } else {
                                                cb(rule.message)
                                            }
                                        },
                                        message: '请输入大于0的5位以内整数'
                                    },
                                ],
                            })(<Input
                                type="text"
                                value={partInTimes}
                                addonAfter='次'
                            />) : null
                        }
                    </FormItem>
                </Col>
            </Row>
        )
    }
    render() {
        const { formData, currentStep, isEdit, isView } = this.props.createActiveCom
        const { giftList, giftList2, needCount, giftGetRule } = formData
        const { chooseTab, treeData } = this.state
        if (isEdit && currentStep !== 2) {
            return null
        }
    
        const formItems3 = {
            consumeTotalAmount: {
                type: 'text',
                label: '触发条件',
                surfix: '元，可参与活动',
                prefix: '消费满',
                placeholder: '请输入金额',
                rules: [{
                    required: true,
                    pattern: /^((([1-9]\d{0,4}))(\.\d{0,2})?$)|(0\.\d{0,2}?$)/,
                    message: '请输入大于0，整数5位以内且小数2位以内的数值',
                }],
                wrapperCol: { span: 15 },
            },
            maxPartInPerson: {
                type: 'text',
                label: '领取限制',
                surfix: '人',
                prefix: '分享活动后，至多领取人数',
                placeholder: '请输入人数',
                rules: [{
                    required: true,
                    pattern: /^(([1-9]\d{0,4}))$/,
                    message: '请输入大于0的5位以内整数',
                }],
                wrapperCol: { span: 15 },
            },
            partInTimes: {
                label: '参与次数',
                type: 'custom',
                render: (decorator, form) => this.renderStartEnd(decorator, form),
            }
        };
        const formKeys3 = ['consumeTotalAmount', 'maxPartInPerson', 'partInTimes'];
        return (
            <div className={styles.step3Wrap}>
                <div style={{position:'relative'}}>
                    {isView && !isEdit && <div className={styles.disabledDiv}></div>}
                    <BaseForm
                        getForm={this.getForm('2')}
                        formItems={formItems3}
                        formKeys={formKeys3}
                        onChange={this.handleFromChange}
                        formData={formData || {}}
                        formItemLayout={formItemLayout}
                    />
                </div>
                <div>
                    <FormItem
                        label='添加礼品'
                        required
                        formItemLayout={{
                            labelCol: { span: 3 },
                            wrapperCol: { span: 40 }
                        }}
                        className={styles.giftWrapper}
                    >
                        <Tabs
                            hideAdd={true}
                            onChange={this.handleTabChange}
                            activeKey={chooseTab}
                            type="card"
                            className={styles.tabs}
                            required
                            style={{position:'relatve'}}
                        >
                            <TabPane tab="随机礼品" key="0">
                                <TabItem
                                    itemKey={"0"}
                                    getForm={this.getForm('0')}
                                    handleGiftChange={this.handleGiftChange('0')}
                                    giftList={giftList}
                                    onIptChange={this.onIptChange('0')}
                                    getGiftForm={this.getGiftForm('0')}
                                    needCount={needCount}
                                    isMulti={true}
                                    required
                                />
                            </TabPane>
                            <TabPane tab="最优礼品" key="1">
                                <TabItem
                                    itemKey={"1"}
                                    getForm={this.getForm('1')}
                                    handleGiftChange={this.handleGiftChange2('1')}
                                    giftList={giftList2}
                                    treeData={treeData}
                                    onIptChange={this.onIptChange('1')}
                                    getGiftForm={this.getGiftForm('1')}
                                    needCount={needCount}
                                    isMulti={false}
                                    required
                                />
                            </TabPane>
                        </Tabs>
                    </FormItem>
                </div>
            </div>
        )
    }
}

export default Step3
