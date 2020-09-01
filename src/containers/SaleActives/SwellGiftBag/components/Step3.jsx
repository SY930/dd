import React from 'react'
import  BaseForm  from '../../../../components/common/BaseForm';
import { Input, Tabs, Radio, message } from 'antd'
import {formItems1,formKeys1} from '../constant'
import styles from '../swellGiftBag.less'
import {connect} from 'react-redux';
import {renderEventRemark} from '../../helper/common'
import TabItem from './TabItem/TabItem'


const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const formList = []
const giftForm = []
@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step3 extends React.Component {

    state = {
        giftGetRule: 0,
        chooseTab: '0',
        treeData: [],
        formList: []
    }

    componentDidMount () {

        this.getSubmitFn()
    }

    getSubmitFn = () => {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
    }

    handleFromChange = (key,value) => {

        const { formData } = this.props.createActiveCom

        formData[key] =value

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })
    }
    handleSubmit = () => {
        let flag = true

        const { formData: modalFormData } = this.props.createActiveCom
        const { giftGetRule } = this.state
        const { needCount } = modalFormData
        let formData = {
            ...modalFormData,
            giftGetRule
        }
        const gifts = []

        giftForm.forEach(form => {
            if(form) {
                form.validateFieldsAndScroll((e,v) => {
                    if(e) {
                        flag = false
                    }

                    gifts.push(v)
                })
            }
        })
        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })



        if( !(formList.length === 3) && flag) {
            message.warn('你有未设置的档位')
            return false
        }

        // 校验膨胀人数
        if(needCount[1] < needCount[0]) {
            message.warn('第二档数值必须大于上一档位的人数')
            return false
        }

        if(needCount[2] < needCount[1]) {
            message.warn('第三档数值必须大于上一档位的人数')
            return false
        }

        // 添加膨胀所需要的人数
        gifts.forEach((v,i) => {
            v.needCount = needCount[i]
        })


        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    gifts
                }
            }
        })

        return  flag
    }

    onRadioChange = (e) => {
        this.setState(
           {
            giftGetRule: e.target.value
           }
        )
    }

    handleTabChange = (e) => {
        let flag = true
        giftForm.forEach(form => {
            if(form) {
                form.validateFieldsAndScroll((e,v) => {
                    if(e) {
                        flag = false
                    }

                })
            }
        })
        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })

        if(!flag) {
            return
        }
        this.setState({
            chooseTab: e
        })

    }

    getForm = (key) => (form) => {
        if(!formList[key] ) {
            formList[key] = form
        }

    }

    handleGiftChange = (key) => (giftData) => {
        const { formData } = this.props.createActiveCom
        const { giftList } =  formData
        const { treeData } = this.state
        let chooseCoupon = {}
        const chooseCouponItem = treeData.filter(v => {
            const list = v.children || []
           const chooseItem =  list.find(item => item.key === giftData[0].giftID)
            if(chooseItem) {
                chooseCoupon = chooseItem
            }
            return chooseItem
        })

        giftData[0].label = chooseCouponItem[0] && chooseCouponItem[0].label
        giftData[0].giftValue = chooseCoupon.giftValue

        giftList[key] = giftData[0]

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

    onIptChange = (key) => (e)  => {

        const { formData } = this.props.createActiveCom
        const { needCount } =  formData
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


    render () {
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        const { formData } = this.props.createActiveCom
        const {giftList} = formData
        const { giftGetRule, chooseTab ,treeData } = this.state

        console.log('treeData',treeData)
        return (
            <div className={styles.step3Wrap}>
                <div className={styles.initiatorWrap}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                        发起人奖励
                    </div>
                    <div className={styles.giftMethods}>
                        礼品领取方式
                        <RadioGroup style={{marginLeft: '20px'}} onChange={this.onRadioChange} value={giftGetRule}>
                            <Radio value={0}>领取符合条件的最高档位礼品</Radio>
                            <Radio value={1}>领取符合条件的所有档位礼品</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <Tabs
                    hideAdd={true}
                    onChange={this.handleTabChange}
                    activeKey={chooseTab}
                    type="card"
                    className={styles.tabs}
                >
                    <TabPane tab="档位一" key="0">
                        <TabItem
                            itemKey={"0"}
                            getForm={this.getForm('0')}
                            handleGiftChange={this.handleGiftChange('0')}
                            giftList={giftList}
                            onIptChange={this.onIptChange('0')}
                            getGiftForm={this.getGiftForm('0')}
                         />
                        </TabPane>
                    <TabPane tab="档位二" key="1">
                        <TabItem
                        itemKey={"1"}
                        getForm={this.getForm('1')}
                        handleGiftChange={this.handleGiftChange('1')}
                        giftList={giftList}
                        treeData={treeData}
                        onIptChange={this.onIptChange('1')}
                        getGiftForm={this.getGiftForm('1')}
                        />
                    </TabPane>
                    <TabPane tab="档位三" key="2">
                        <TabItem
                        itemKey={"2"}
                        getForm={this.getForm('2')}
                        handleGiftChange={this.handleGiftChange('2')}
                        giftList={giftList}
                        treeData={treeData}
                        onIptChange={this.onIptChange('2')}
                        getGiftForm={this.getGiftForm('2')}
                        />
                    </TabPane>
                </Tabs>
                <div className={styles.helpPeople}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                        发起人奖励
                    </div>
                    <TabItem
                     itemKey={"3"}
                     handleGiftChange={this.handleGiftChange('3')}
                     giftList={giftList} i
                     isHelp
                     treeData={treeData}
                     cacheTreeData={this.cacheTreeData}
                     getGiftForm={this.getGiftForm('3')}
                     />
                </div>
            </div>
        )
    }
}

export default Step3
