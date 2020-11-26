import React from 'react'
import { connect } from 'react-redux';
import { message, Button, Icon,  Tabs } from 'antd'
import _ from 'lodash'
import { formItems2, formKeys2 } from '../constant'
import  BaseForm  from '../../../../components/common/BaseForm';
import moment from 'moment'
import styles from "../CouponsGiveCoupons.less";
import { eventDateRender, afterPayJumpTypeRender } from '../../helper/common'

const DATE_FORMAT = 'YYYYMMDD000000';
const { TabPane } = Tabs;
const formList = [null, null, null, null, null, null]

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    state = {
        formKeys2: _.cloneDeep(formKeys2),
        count: ['1'],
        activeKey: '1',
        treeData: []
    }
    componentDidMount() {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
        this.props.dispatch({
            type: 'createActiveCom/couponService_getSortedCouponBoardList',
            payload: {
                trdChannelID: 50,
            },
        }).then((res) => {
            if (res) {
                this.setState({ treeData: res })
            }
        })
    }
    getForm = (key) => (form) => {
        if(!formList[key] ) {
            formList[key] = form
        }
        
    }

    handleFromChange = (index) => (key, value, data) => {
        const { count } = this.state
        //因为最后一个添加的tab会影响整体数据，所以在提交时单独整合
        //debugger
        if(index === count.length-1) {
            return
        }
        const { formData } = this.props.createActiveCom
        if (key === 'mySendGift') {
            this.handleGiftChange(index, value)
        } else {
            formData[key] =value
        }
        
        // this.props.dispatch({
        //     type: 'createActiveCom/updateState',
        //     payload: {
        //         formData
        //     }
        // })
    }

     handleGiftChange = (index, value) => {
        // debugger
         if(JSON.stringify(value) === '{}') {
             console.log(`index ${index} has been send back`)
             return
         }
        const { formData,isView,isEdit } = this.props.createActiveCom
        const { giftList } =  formData
        giftList[index] = value
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

    handleSubmit = () => {
        let flag = true
        const { giftForm } = this.props.createActiveCom
        giftForm.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            } else {
                const { formData } = this.props.createActiveCom
                this.props.dispatch({
                    type: 'createActiveCom/updateState',
                    payload: {
                        formData: {
                            ...formData,
                            mySendGift: v
                        }
                    }
                })
            }

        })
        if(!flag) {
            return flag
        }
        formList.forEach(form => {
            form.validateFieldsAndScroll((e,v) => {
                if(e) {
                    flag = false
                }

            })
        })
        return flag
    }
    getDateCount = () => {
        const { formData } = this.props.createActiveCom;
        const {  eventDate, afterPayJumpType } = formData || {};
        const startTime = eventDate && eventDate[0]
        const endTime = eventDate && eventDate[1]
        if (undefined == startTime || undefined == endTime) {
            return 0
        }
        return moment(endTime, DATE_FORMAT)
            .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
    }

    addTab = () => {
        const { count } = this.state
        if(count.length < 5) {
            this.setState({
                count: count.concat(`1`)
            })
        } else {
            message.warn(`至多可添加5组规则`)
        }
    }

    onChange = (key) => {
        const { activeKey } = this.state
        //在切tab时 校验前一个tab是否合规
        let flag = true
        formList[activeKey-1].validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }
        })

        if(!flag) {
            return
        }
        this.setState({
            activeKey: key
        })
    }

    deleteTab = (key) => {
        let { count } = this.state
        let { formData } = this.props.createActiveCom
        let { giftList } =  formData
        count.splice(key-1, 1)
        debugger
        giftList.splice(key-1, 1)
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    giftList
                }
            }
        })
        this.setState({
            count: count,
        })
    }

    onEdit = (targetKey, action) => {
        switch(action) {
            case 'remove':
                this.deleteTab(targetKey)
                break;
            default:
                this.deleteTab(targetKey)
        }
    };


    render () {
        const { formKeys2, count, activeKey, treeData } = this.state
        const { wxNickNameList } = this.props.createActiveCom

        formItems2.eventDate.render = eventDateRender.bind(this)
        formItems2.mySendGift.render = formItems2.mySendGift.render.bind(this)
        formItems2.afterPayJumpType.render =  afterPayJumpTypeRender.bind(this)
        if(formKeys2.includes('consumeGiftID')) {
            console.log(treeData)
            formItems2.consumeGiftID.treeData = treeData
        }
        const { formData } = this.props.createActiveCom
        const { giftList = [] } = formData

        return (
            <div className={styles.stepTwo} style={{marginRight: '20px'}}>
                 <Button type='primary' onClick={this.addTab} className={styles.addRulesBtn}>
                    <Icon type="plus" />
                    添加规则
                 </Button>
                 <span className={styles.reminderSpan}>至多可添加5组规则</span>
                 <div className={styles.grayLine}></div>
                 <div className={styles.tabArea}>
                    <Tabs
                        className="tabsStyles"
                        activeKey={activeKey}
                        onChange={activeKey => this.onChange(activeKey)}
                        onEdit={this.onEdit}
                        type="editable-card"
                        hideAdd
                    >
                        {
                            count.map((tab, index) => {
                                formData.mySendGift = formData.giftList[index] || {}
                                return (
                                <TabPane tab={`规则${index+1}`} key={index+1}>
                                    <BaseForm
                                        getForm={this.getForm(index)}
                                        formItems={formItems2}
                                        formData={formData}
                                        formKeys={formKeys2}
                                        key={`speForm${index}`}
                                        onChange={this.handleFromChange(index)}
                                        formItemLayout={{
                                        labelCol: { span: 3 },
                                        wrapperCol: { span: 21 },
                                        }}
                                    />
                                </TabPane>)
                            })
                        }
                    </Tabs>
                 </div>
                 
                 
            </div>
        )
    }
}

export default Step2
