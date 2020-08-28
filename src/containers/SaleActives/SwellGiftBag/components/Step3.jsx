import React from 'react'
import  BaseForm  from '../../../../components/common/BaseForm';
import { Input, Tabs, Radio } from 'antd'
import {formItems1,formKeys1} from '../constant'
import styles from '../swellGiftBag.less'
import {connect} from 'react-redux';
import {renderEventRemark} from '../../helper/common'
import TabItem from './TabItem/TabItem'


const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step3 extends React.Component {

    state = {
        giftGetRule: 1,
        chooseTab: '1'
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

        this.form.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }

        })


        return flag
    }

    onRadioChange = (e) => {
        this.setState(
           {
            giftGetRule: e.target.value
           }
        )
    }

    handleTabChange = (e) => {
        this.setState({
            chooseTab: e
        })
    }

    getForm = (key) => (form) => {
        this.formData[key] = from
    }

    handleGiftChange = (key) => (giftData) => {
        console.log('handleGiftChange',key,giftData)
    }

    render () {
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        const { formData } = this.props.createActiveCom
        const { giftGetRule, chooseTab } = this.state


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
                    <TabPane tab="档位一" key="1">
                        <TabItem
                            key="1"
                            getForm={this.getForm('1')}
                            handleGiftChange={this.handleGiftChange('1')}
                         />
                        </TabPane>
                    <TabPane tab="档位二" key="2">
                        <TabItem
                        key="2"
                        getForm={this.getForm('2')}
                        handleGiftChange={this.handleGiftChange('2')}
                        />
                    </TabPane>
                    <TabPane tab="档位三" key="3">
                        <TabItem
                        key="3"
                        getForm={this.getForm('2')}
                        handleGiftChange={this.handleGiftChange('3')}
                        />
                    </TabPane>
                </Tabs>
                <div className={styles.helpPeople}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                        发起人奖励
                    </div>
                    <TabItem handleGiftChange={this.handleGiftChange('4')} isHelp/>
                </div>
            </div>
        )
    }
}

export default Step3
