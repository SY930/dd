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
        chooseRadio: 1,
        chooseTab: '1'
    }

    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
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
            chooseRadio: e.target.value
           }
        )
    }

    handleTabChange = (e) => {
        this.setState({
            chooseTab: e
        })
    }

    render () {
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        const { formData } = this.props.createActiveCom
        const { chooseRadio, chooseTab } = this.state

        return (
            <div className={styles.step3Wrap}>
                <div className={styles.initiatorWrap}>
                    <div className={styles.title}>
                        <div className={styles.line}></div>
                        发起人奖励
                    </div>
                    <div className={styles.giftMethods}>
                        礼品领取方式
                        <RadioGroup style={{marginLeft: '20px'}} onChange={this.onRadioChange} value={chooseRadio}>
                            <Radio value={1}>领取符合条件的最高档位礼品</Radio>
                            <Radio value={2}>领取符合条件的所有档位礼品</Radio>
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
                        <TabItem/>
                        </TabPane>
                    <TabPane tab="档位二" key="2">
                        <TabItem/>
                    </TabPane>
                    <TabPane tab="档位三" key="3">
                        <TabItem/>
                    </TabPane>
                </Tabs>
                <BaseForm
                    getForm={this.getForm}
                    formItems={formItems1}
                    formData={formData}
                    formKeys={[]}
                    onChange={this.handleFromChange}
                    formItemLayout={{
                    labelCol: { span: 3 },
                    wrapperCol: { span: 21 },
                    }}
                />

            </div>
        )
    }
}

export default Step3
