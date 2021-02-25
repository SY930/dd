import React from 'react'
import { Tabs, Radio, message, Form, Select, Col, Input, Row } from 'antd'
import styles from '../grabRedPacket.less'
import { connect } from 'react-redux';
import TabItem from './TabItem/TabItem'
import moment from 'moment'
import { dateFormat } from '../../constant'
import BaseForm from 'components/common/BaseForm';
import { formItemLayout } from '../Common';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formList = []
const giftForm = []
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))
class Step3 extends React.Component {
    state = {
        giftGetRule: 0,
        chooseTab: '0',
        treeData: this.props.createActiveCom.crmGiftTypes,
        formList: [],
        partInTimes:'',
        needCount1:1,
        isCountVisible:false,
        needShow:0
    }

    componentDidMount() {

        this.getSubmitFn()

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

        // const { formData: modalFormData } = this.props.createActiveCom

        // const { needCount, giftList } = modalFormData
        // let formData = {
        //     ...modalFormData,
        // }

        // giftList.forEach(v => {
        //     if (v.rangeDate) {
        //         v.effectTime = moment(v.rangeDate[0]).format(dateFormat)
        //         v.validUntilDate = moment(v.rangeDate[1]).format(dateFormat)
        //     }
        // })

        // formList.forEach(form => {
        //     form.validateFieldsAndScroll((e, v) => {
        //         if (e) {
        //             flag = false
        //         }

        //     })
        // })
        // if (giftForm[3]) {
        //     giftForm[3].validateFieldsAndScroll((e, v) => {
        //         if (e) {
        //             flag = false
        //         }

        //     })
        //     if (flag == false) {
        //         return false
        //     }
        // }

        // const initiator = [...giftList]
        // initiator.length = 3
        // if (initiator.filter(v => v).length !== 3 && flag) {
        //     message.warn('你有未设置的档位')
        //     return false
        // }

        // // 校验膨胀人数
        // if (needCount[1] < needCount[0]) {
        //     message.warn('第二档数值必须大于上一档位的人数')
        //     return false
        // }

        // if (needCount[2] < needCount[1]) {
        //     message.warn('第三档数值必须大于上一档位的人数')
        //     return false
        // }

        // // 添加膨胀所需要的人数
        // giftList.forEach((v, i) => {
        //     v.needCount = needCount[i]

        // })


        // this.props.dispatch({
        //     type: 'createActiveCom/updateState',
        //     payload: {
        //         formData: {
        //             ...formData,
        //             giftList
        //         }
        //     }
        // })

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
        console.log(e,formList,'e-----------12345')
        const { needShow } = this.state;

        this.setState({
            needShow:e
        })
         
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

    handleGiftChange = (key) => (giftData,type) => {


        // console.log(key,giftData,'giftData--------------')
        // const { formData, isView, isEdit } = this.props.createActiveCom
        // console.log(formData,'formDatahandleGiftCHANGE----------------')
        // let {giftList} = formData
        // const { treeData ,needShow} = this.state
        
        const { formData,isView,isEdit } = this.props.createActiveCom
        const { giftList } =  formData
        const { treeData } = this.state

        if((isView || isEdit) && !giftList[3] && key == 3 ) {
            return
        }
        let chooseCoupon = {}
        const chooseCouponItem = treeData.filter(v => {
            const list = v.children || []
           const chooseItem =  list.find(item => item.key === giftData[0].giftID)
            if(chooseItem) {
                chooseCoupon = chooseItem
            }
            return chooseItem
        })
        const label = chooseCouponItem[0] && chooseCouponItem[0].label

        if(label) {
            giftData[0].label =  label
            giftData[0].giftValue = chooseCoupon.giftValue
        }


        giftList[key] = giftData[0]
        console.log(key,giftData,'giftData------=======--=-=-=-=-=-=-=-=')
        console.log(giftList,'giftlist==================')
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
    handleStageTypeChange(value) {
        // const data = Object.assign({}, {0: this.state.data['0']});
        // if (value === '1') {
        //     this.props.onChange && this.props.onChange({data, stageType: '1'});
        //     this.uuid = 0;
        // } else {
        //     this.props.onChange && this.props.onChange({data, stageType: '2'})
        // }
    }
    handleFromChange = (key, value) => {
        
        if(!value) return;
        console.log(key, value, 'vaalueeeeeeeeeeeeeeee')
        const {formData} = this.props.createActiveCom;
        formData[key] =value
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })

    }
    changeJoinedCount = (key,value) => {
        console.log(key,value,'changeJOINIDEcoUNT----------------')
        const {formData} = this.props.createActiveCom;
        if(key == '1'){
            this.setState({
                needCount1:key,
                isCountVisible:false
            })
            formData['partInTimes'] = 0;
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })
        }
        if(key == '2'){
            this.setState({
                needCount1:key,
                isCountVisible:true
            })
        }
    }
    renderStartEnd(decorator, form) {
        const {partInTimes,needCount1,isCountVisible} = this.state;
        return (
            <Row>
                <Col span={8}>每人每天参与活动次数</Col>
                <Col span={6}>
                    <FormItem>
                        <Select onChange={this.changeJoinedCount} placeholder="不限制">
                            <Option key="2" value="2">限制</Option>
                            <Option key="1" value="1">不限制</Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col span={6}>
                    <FormItem>
                            {isCountVisible ?
                                decorator({
                                    key: 'partInTimes',
                                    rules: [
                                        
                                        {
                                            validator: (rule, v, cb) => {
                                                if (v === '') cb();
                                                const reg = /^(([1-9]\d{0,5})|0)$/;
                                                if(reg.test(v)){
                                                    cb()
                                                }else{
                                                    cb(rule.message)
                                                }
                                                // v >= 0 && v <= 99999 ? cb() : cb(rule.message);
                                            },
                                            message: '请输入大于0的5位以内整数'
                                        },
                                        // {
                                        //     validator: (rule, v, cb) => {
                                        //         String(v || '').trim().length <= 5 ? cb() : cb(rule.message);
                                        //     },
                                        //     message: '活动参与次数超出限制'
                                        // },
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
        console.log(formData,'formData=======-step333333')
        const { giftList, needCount, giftGetRule } = formData
        const { chooseTab, treeData } = this.state
        if (isEdit && currentStep !== 2) {
            return null
        }
        // const checkedHelp = giftList[3]
        // const isNew = !(isEdit || isView)
        const formItems3 = {
            consumeTotalAmount: {
                type: 'text',
                label: '触发条件',
                surfix: '元，可参与活动',
                prefix: '消费满',
                placeholder: '请输入金额',
                rules: [{
                    required: true,
                    pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
                    message: '请输入0~100000数字，支持两位小数',
                }],
                wrapperCol: { span: 10 },
            },
            maxPartInPerson: {
                type: 'text',
                label: '领取限制',
                surfix: '人',
                prefix: '分享活动后，至多领取人数',
                placeholder: '请输入人数',
                rules: [{
                    required: true,
                    pattern: /^(([1-9]\d{0,5})|0)$/,
                    message: '请输入大于0的5位以内整数',
                }],
                wrapperCol: { span: 10 },
            },
            partInTimes: {
                label: '参与次数',
                type: 'custom',
                render: (decorator, form) => this.renderStartEnd(decorator, form),
            }
        };
        const formKeys3 = ['consumeTotalAmount', 'maxPartInPerson','partInTimes'];
        return (
            <div className={styles.step3Wrap}>
                <div>
                    <BaseForm
                        getForm={this.getForm('2')}
                        formItems={formItems3}
                        formKeys={formKeys3}
                        onChange={this.handleFromChange}
                        formData={formData || {}}
                        formItemLayout={formItemLayout}
                    />

                    {/* <PriceInput
                            addonBefore={<Select value={this.state.stageType} onChange={this.handleStageTypeChange}>
                                <Option value="2">限制</Option>
                                <Option value="1">不限制</Option>
                            </Select>}
                            addonAfter='次'
                            modal="float"
                            placeholder='请输入次数'
                            onChange={(value) => {
                                console.log(value,'value------------')
                                // const { data } = this.state;
                                // if (value.number == null || value.number == '' || value.number > 10) {
                                //     data[k].validateFlag = false;
                                // } else {
                                //     data[k].validateFlag = true;
                                // }

                                // data[k].value = value.number;
                                // this.setState({ data });
                                // this.props.onChange && this.props.onChange(data);
                            }}
                            // value={{ number: '1' }}
                        /> */}


                </div>

                <Tabs
                    hideAdd={true}
                    onChange={this.handleTabChange}
                    activeKey={chooseTab}
                    type="card"
                    className={styles.tabs}
                >
                    <TabPane tab="随机礼品" key="0">
                        {/* {isView && !isEdit && <div className={styles.disabledDiv}></div>} */}
                        <TabItem
                            itemKey={"0"}
                            getForm={this.getForm('0')}
                            handleGiftChange={this.handleGiftChange('0')}
                            giftList={giftList}
                            onIptChange={this.onIptChange('0')}
                            getGiftForm={this.getGiftForm('0')}
                            needCount={needCount}
                        />
                    </TabPane>
                    <TabPane tab="最优礼品" key="1">
                        {/* {isView && !isEdit && <div className={styles.disabledDiv}></div>} */}

                        <TabItem
                            itemKey={"1"}
                            getForm={this.getForm('1')}
                            handleGiftChange={this.handleGiftChange('1')}
                            giftList={giftList}
                            treeData={treeData}
                            onIptChange={this.onIptChange('1')}
                            getGiftForm={this.getGiftForm('1')}
                            needCount={needCount}
                        />
                    </TabPane>

                </Tabs>

            </div>
        )
    }
}

export default Step3
