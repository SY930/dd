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
    componentDidMount() {
        // 查询详情
        this.queryDetail()
    }
    componentWillUnmount() {
        this.form1.resetFields()
        this.form0.resetFields()
    }
    queryDetail = () => {
        const  { itemID } = decodeUrl()
        if(itemID) {
            this.getDetail(itemID)
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    isView: true
                }
            })
        }

    }

    getDetail = (itemID) => {

        this.props.dispatch({
            type: 'createActiveCom/queryEventDetail_NEW_payHaveGift',
            payload: {
                itemID,
            }
        }).then(res => {
            if(res) {
                this.form1.setFieldsValue({mySendGift: res})
            }
        })
    }

    handleNext =  (cb,current) => {
         if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            cb()
         }
    }
    handleFinish = (cb,current) => {

        if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            const { formData, type } = this.props.createActiveCom
            const { eventDate } = formData
            this.props.dispatch({
                type: 'createActiveCom/getExcludeEventList',
                payload: {
                    eventStartDate: moment(eventDate[0]).format(format),
                    eventEndDate: moment(eventDate[1]).format(format),
                    eventWay: type
                }
            }).then(res => {
                if(res) {
                    this.props.dispatch({
                        type: 'createActiveCom/addEvent_NEW_payHaveGift'
                    }).then(res => {
                        if(res) {
                            cb()
                            closePage()
                            jumpPage({pageID: '1000076003'})
                        }
                    })
                }
            })

         }
    }
    handlePrev = (cb) => {
        cb()
    }
    handleCancel = (cb) => {
        cb()
        closePage()
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
        const { rangeDate, effectType, giftEffectTimeHours, giftValidUntilDayCount,giftID } = giftList
        // debugger
        // const giftList = crmGiftTypes.reduce((pre,currentValue,) => {
        //     const children = currentValue.children || []
        //     return [...pre,...children]
        // },[])
        // const giftItem = giftList.find(v => v.value === giftID)
        const saveLoading = loading.effects['createActiveCom/addEvent_NEW']
        const steps = [{
            title: '基本信息',
            content:  <Step1
            getSubmitFn={this.getSubmitFn(0)}
            />,
          },  {
            title: '活动内容',
            content:  <Step2
            getSubmitFn={this.getSubmitFn(1)}
            />,
          }];
        const headerUrl = merchantLogoUrl.url ? `${imgUrl}/${merchantLogoUrl.url}`   : `${imgUrl}/${merchantLogoUrl}`
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
