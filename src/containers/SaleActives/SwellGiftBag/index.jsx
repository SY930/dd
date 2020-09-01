import React from 'react';
import { Icon } from 'antd';
import {connect} from 'react-redux';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import moment from 'moment'
import ActSteps from '../components/ActSteps/ActSteps'
import styles from './swellGiftBag.less'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import { imgUrl } from '../constant'

const formatType = 'YYYY.MM.DD'


@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class SwellGiftBag extends React.Component {
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
            console.log('formData---',formData,type)
            const {
                eventName,
                eventRemark,
                eventEndDate,
                eventStartDate,
                giftGetRule,
                shareSubtitle,
                shareTitle,
                shareImagePath,
                countCycleDays,
                partInTimes,
                gifts
            } = formData
            this.props.dispatch({
                type: 'createActiveCom/addEvent_NEW',
                payload: {
                    event: {
                        eventWay: type,
                        eventName,
                        eventRemark,
                        eventEndDate,
                        eventStartDate,
                        giftGetRule,
                        shareSubtitle,
                        shareTitle,
                        shareImagePath,
                        countCycleDays,
                        partInTimes,
                    },
                    gifts
                }
            }).then(res => {
                if(res) {
                    cb()
                    closePage()
                    jumpPage({pageID: '1000076003'})
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
        const { eventLimitDate, needCount, giftList } = formData

        console.log('formData---',formData)
        const giftListMap = giftList.filter((v,i) => {
            return v && i < 3
        })
        const saveLoading = loading.effects['createActiveCom/addEvent_NEW']
        const steps = [{
            title: '基本信息',
            content:  <Step1
            getSubmitFn={this.getSubmitFn(0)}
            />,
          },  {
            title: '活动规则',
            content:  <Step2
            getSubmitFn={this.getSubmitFn(1)}
            />,
          },  {
            title: '活动内容',
            content:  <Step3
            getSubmitFn={this.getSubmitFn(2)}
            />,
          }, {
            title: '分享推送',
            content:  <Step4
            getSubmitFn={this.getSubmitFn(3)}
            />,
          }];

        return (
            <div className={styles.actWrap}>
                <div className={styles.setResult}>

                        <div className={styles.resultImgWrap}>

                                <div className={styles.contentBg}>
                                    <img className={styles.statusBar} src={`${imgUrl}/basicdoc/4cd4c139-ae05-4a5c-9fcb-2fb7fbdb2416.png`}/>
                                    <div className={styles.container}>
                                        <img className={styles.topImg} src={`${imgUrl}/basicdoc/b877b38f-da49-4530-9bff-58382f1bf227.png`}/>
                                        <div className={styles.actTime}>
                                            {eventLimitDate &&  eventLimitDate[0] ?
                                                <div>
                                                    活动时间：{moment(eventLimitDate[0]).format(formatType)}-{moment(eventLimitDate[1]).format(formatType)}
                                                </div>
                                            : null}

                                        </div>
                                        <div className={styles.couponWrap}>
                                            <div className={styles.bigCoupon}  >
                                                <div className={styles.left}>
                                                    {giftListMap[0] && giftListMap[0].giftValue ?
                                                    <div>¥ <span style={{fontWeight: 'bold',fontSize: '14px'}}>{ giftListMap[0].giftValue}</span></div>
                                                    : null}

                                                    <div className={styles.scale8}>{giftListMap[0] && giftListMap[0].label}</div>
                                                </div>
                                                <div className={styles.right}>

                                                    <div style={{fontWeight: 'bold'}} className={styles.giftName}>{giftListMap[0] && giftListMap[0].giftName}</div>
                                                    {
                                                        giftListMap[0] && giftListMap[0].giftName ?
                                                        <div style={{color: '#BCBCBC'}} className={styles.scale8}>优惠券详情</div>
                                                        : null
                                                    }

                                                </div>
                                            </div>
                                            <div className={styles.submitBtn}>立即参与</div>
                                        </div>

                                        <div className={styles.giftsWrap}>
                                            <div className={styles.title}>活动好礼</div>
                                            <div className={styles.peopleNum}>
                                                <div className={styles.line}></div>
                                                <div className={styles.numWrap}>
                                                    <div className={styles.num}>
                                                        <Icon type="caret-down" />
                                                        <div>{needCount[0] || 0}人</div>
                                                    </div>
                                                    <div className={styles.num}>
                                                        <Icon type="caret-down" />
                                                        {needCount[1] ?  <div>{needCount[1]}人</div> : null}
                                                    </div>
                                                    <div className={styles.num}>
                                                        <Icon type="caret-down" />
                                                        {needCount[2] ?  <div>{needCount[2]}人</div> : null}
                                                    </div>
                                                </div>
                                             </div>

                                             <div className={styles.couponList}>
                                                {giftListMap.map(v => {
                                                    return (
                                                        <div className={styles.couponItem}>
                                                        <div>
                                                            {v.giftValue ?  <div className={styles.scale8}>¥</div> : null}
                                                        <div className={styles.fontWeight}>{v.giftValue}</div>
                                                        </div>
                                                    <div className={styles.label}>{v.label}</div>
                                                    </div>
                                                    )
                                                })}


                                             </div>
                                        </div>


                                    </div>

                                </div>

                        </div>

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

export default SwellGiftBag
