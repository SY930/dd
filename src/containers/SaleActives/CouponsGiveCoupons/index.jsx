import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import ActSteps from '../components/ActSteps/ActSteps'
import styles from './CouponsGiveCoupons.less'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import {imgUrl} from './constant'
import moment from 'moment'
const format = "YYYYMMDD";
@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class CouponsGiveCoupons extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            stepTwo: false
        }
    }
    componentDidMount() {
        // 查询详情
        this.queryDetail()
    }
    componentWillUnmount() {
        // this.form1.resetFields()
        this.form0.resetFields()
    }
    queryDetail = () => {
        const  { itemID } = decodeUrl()
        if(itemID) {
            this.getDetail(itemID)
            if(!this.props.createActiveCom.isEdit) {
                this.props.dispatch({
                    type: 'createActiveCom/updateState',
                    payload: {
                        isView: true
                    }
                })
            }
        }

    }

    getDetail = (itemID) => {
        this.props.dispatch({
            type: 'createActiveCom/queryEventDetail_NEW_couponsGiveCoupons',
            payload: {
                itemID,
            }
        })
    }

    handleNext =  (cb,current) => {
        this.setState({
            stepTwo: true
        })
         if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            cb()
         }
    }
    handleFinish = (cb,current) => {
        if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            const { formData, type } = this.props.createActiveCom
            const { eventLimitDate, gifts, eventName, eventRemark } = formData
            const  { itemID } = decodeUrl()
            this.props.dispatch({
                type: itemID ? 'createActiveCom/updateEvent_NEW__couponsGiveCoupons' : 'createActiveCom/addEvent_NEW_couponsGiveCoupons',
                payload: {
                    event: {
                        eventWay: type,
                        eventName,
                        eventRemark,
                        eventEndDate: moment(eventLimitDate[1]).format(format),
                        eventStartDate: moment(eventLimitDate[0]).format(format),
                    },
                    gifts: gifts
                },
            }).then(res => {
                if(res) {
                    closePage()
                    jumpPage({pageID: '1000076003'})
                }
            })
         }
    }
    handlePrev = (cb) => {
        this.setState({
            stepTwo: false
        })
        cb()
    }
    handleCancel = (cb) => {
        const  { itemID } = decodeUrl()
        closePage()
        if(itemID) {
            jumpPage({pageID: '1000076003'})
        } else {
            //营销盒子
            jumpPage({pageID: '10000730001'})
        }
        this.props.dispatch({
            type: 'createActiveCom/clearData'
        })
    }
    getSubmitFn = (current) => ({submitFn,form}) => {
        this[`submitFn${current}`] = submitFn
        this[`form${current}`] = form
    }

    handleStepChange = (current) => {
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                currentStep: current
            }
        })
    }

    render () {
        const { loading } = this.props
        const {
            formData,
            currentStep,
            crmGiftTypes,
            giftValue,
            isView
        } = this.props.createActiveCom
        const { merchantLogoUrl, eventName, backgroundColor, giftList, originalImageUrl } = formData
        // const { rangeDate, effectType, giftEffectTimeHours, giftValidUntilDayCount,giftID } = giftList
        // const giftList = crmGiftTypes.reduce((pre,currentValue,) => {
        //     const children = currentValue.children || []
        //     return [...pre,...children]
        // },[])
        // const giftItem = giftList.find(v => v.value === giftID)
        const saveLoading = loading.effects['createActiveCom/addEvent_NEW_CouponsGiveCoupons']
        const { stepTwo } = this.state
        const steps = [{
            title: '基本信息',
            content:  <Step1
            getSubmitFn={this.getSubmitFn(0)}
            />,
          },  {
            title: '活动内容',
            content:  <Step2
            stepTwo={this.state.stepTwo}
            getSubmitFn={this.getSubmitFn(1)}
            />,
          }];
        return (
            <div className={styles.actWrap}>
                <div className={styles.settingWrap}>
                    <ActSteps
                        isUpdate={true}
                        loading={saveLoading}
                        disabled={isView || saveLoading}
                        steps={steps}
                        onNext={this.handleNext}
                        onFinish={this.handleFinish}
                        onPrev={this.handlePrev}
                        onCancel={this.handleCancel}
                        callback={this.handleStepChange}
                    />
                </div>

            </div>
        )
    }
}

export default CouponsGiveCoupons
