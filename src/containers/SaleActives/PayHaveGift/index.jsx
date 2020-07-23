import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import {
    Form,
    Button,
    Icon,
    Select,
    Input,
    message,
    Spin,
} from 'antd';
import ActSteps from '../components/ActSteps/ActSteps'
import styles from './payHaveGift.less'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import {imgUrl} from './contanst'
import moment from 'moment'
const format = "YYYYMMDD";




@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class PayHaveGift extends React.Component {
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
            type: 'createActiveCom/queryEventDetail_NEW',
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
                        type: 'createActiveCom/addEvent_NEW'
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
        const { merchantLogoUrl, eventName, backgroundColor, mySendGift, originalImageUrl } = formData
        const { rangeDate, effectType, giftEffectTimeHours, giftValidUntilDayCount,giftID } = mySendGift
        const giftList = crmGiftTypes.reduce((pre,currentValue,) => {
            const children = currentValue.children || []
            return [...pre,...children]
        },[])
        const giftItem = giftList.find(v => v.value === giftID)
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
                <div className={styles.setResult}>
                        {
                            currentStep == 0 &&  <div className={styles.resultImgWrap}>
                            <img className={styles.contentBg} src={`${imgUrl}/basicdoc/db96d381-7930-4a40-8689-1cb2f12420c2.png`}/>
                            <div className={styles.showData}>
                                <img style={merchantLogoUrl ? {} : {opacity: 0}}   src={ headerUrl }/>
                                <div className={styles.text}>
                                     <div className={styles.title}>{eventName}</div>
                                     <div className={styles.content}>{giftItem && giftItem.label}</div>
                                </div>
                            </div>

                             </div>
                        }

                        {currentStep == 1 &&
                            <div className={styles.resultImgWrap}>
                                <img className={styles.contentBg} src={`${imgUrl}/basicdoc/f5354b35-e33e-40ee-b857-133ba4e6a1a6.png`}/>
                                <div className={styles.topBg}>
                                    <svg
                                    width="254px"
                                    height="93px"
                                    viewBox="0 0 254 93"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <g
                                        id="微信支付有礼web"
                                        stroke="none"
                                        stroke-width="1"
                                        fill="none"
                                        fill-rule="evenodd"
                                    >
                                        <g
                                        id="画板"
                                        transform="translate(-219.000000, -501.000000)"
                                        fill={backgroundColor || '#EF903C'}
                                        >
                                        <path
                                            d="M248,501 L444,501 C460.016258,501 473,513.983742 473,530 L473,541 C473,563.09139 455.09139,581 433,581 L316.812151,581 C314.603012,581 312.812151,582.790861 312.812151,585 C312.812151,585.471239 312.895421,585.938771 313.05812,586.381032 L315.662632,593.460826 L315.662632,593.460826 L309.408583,588.525231 C303.23231,583.651016 295.593869,581 287.725939,581 L259,581 C236.90861,581 219,563.09139 219,541 L219,530 C219,513.983742 231.983742,501 248,501 Z"
                                            id="蒙版"
                                        ></path>
                                        </g>
                                    </g>
                                    </svg>
                                    <img className={styles.topBgImg}  src={`${imgUrl}/basicdoc/cd86a1a1-09d3-459c-b001-8c20023397ad.png`}/>
                                    <div  className={styles.topTitle}>“欢迎再次光临”</div>
                                </div>
                                <div className={styles.step2HeaderImg}>
                                    <img src={ headerUrl} />
                                </div>
                                <div className={styles.step2ContentBanner}>
                                    <img src={(originalImageUrl && originalImageUrl.url) ? `${imgUrl}/${originalImageUrl.url }` : `${imgUrl}/${originalImageUrl}`}/>
                                </div>
                                <div className={styles.couponInfoWrap}>
                                    <div className={styles.couponTitle}>
                                         {giftItem && giftItem.label}
                                    </div>

                                    {giftValue ?  <div className={styles.couponPrice}>
                                        {giftValue}<span>元</span>
                                    </div> : null}

                                    {effectType === '1' && giftEffectTimeHours ? <div className={styles.couponDate}>
                                        {giftEffectTimeHours  == '0' ? '立即生效，' : `${giftEffectTimeHours}天后生效`}
                                        {`有效期${giftValidUntilDayCount}天`}
                                    </div> :  null }

                                    {effectType === '2' && rangeDate ? <div className={styles.couponDate}>有效期{moment(rangeDate[0]).format('YYYY.MM.DD')}-{moment(rangeDate[1]).format('YYYY.MM.DD')}</div>
                                     : null }

                                    <div style={{background: backgroundColor}} className={styles.getBtn}>立即使用</div>
                                </div>
                            </div>
                        }

                </div>
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

export default PayHaveGift
