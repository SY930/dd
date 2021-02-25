import React from 'react';
import { Icon, Spin } from 'antd';
import {connect} from 'react-redux';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import { getBrandList, getShopList, querySMSSignitureList, queryFsmGroupSettleUnit} from './AxiosFactory';
import moment from 'moment'
import ActSteps from '../components/ActSteps/ActSteps'
import styles from './grabRedPacket.less'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import { imgUrl } from '../constant'

const formatType = 'YYYY.MM.DD'


@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class GrabRedPacket extends React.Component {
    state = {
        brandList: [],
        shops: [],
        messageSignList:[],
        queryFsmGroupList:[]
    }
    componentDidMount() {
        getBrandList().then(list => {
            this.setState({ brandList: list });
        });
        getShopList().then(list => {
            this.setState({ shops: list });
        });
        querySMSSignitureList().then(list => {
            this.setState({ messageSignList: list });
        });
        queryFsmGroupSettleUnit().then(list => {
            this.setState({ queryFsmGroupList: list });
        });
        // 查询详情
        this.queryDetail()
        this.props.dispatch({
            type: 'createActiveCom/getAuthLicenseData',
            payload: {productCode: 'HLL_CRM_Marketingbox',}
        })

    }
    componentWillUnmount() {
        this.form1.resetFields()
        this.form0.resetFields()
    }
    queryDetail = () => {
        const  { itemID } = decodeUrl()
        if(itemID) {
            this.getDetail(itemID)
        }

    }

    getDetail = async (itemID) => {
        this.props.dispatch({
            type: 'createActiveCom/queryEventDetail_NEW',
            payload: {
                itemID,
            }
        }).then(res => {
            if(res) {
                 const { data, gifts } = res
                 const { eventRemark, eventStartDate,  eventEndDate , eventName, shareTitle, shareSubtitle} = data
                 const needCount = []

                 this.props.dispatch({
                    type: 'createActiveCom/couponService_getSortedCouponBoardList',
                    payload: {}
                }).then(boardList => {
                    gifts.forEach((v,i) => {
                        if(v.effectTime && v.validUntilDate && v.effectTime !== '0') {
                           v.rangeDate = [moment(v.effectTime,'YYYY-MM-DD'),moment(v.validUntilDate,'YYYY-MM-DD')]
                        } else {
                           v.rangeDate = []
                        }
                        v.effectType = String(v.effectType)
                        if(v.effectType == 3) {
                            // 之前的接口定义太不合理，需要转换
                            v.countType = '1'
                            v.effectType = '1'
                        }
                        v.giftEffectTimeHours = String(v.giftEffectTimeHours)
                        if(i < 3) {
                           needCount[i] = v.needCount
                        }
                        // 获取券名字和面值
                        let chooseCoupon = {}
                        const chooseCouponItem = boardList.filter(val => {
                            const list = val.children || []
                           const chooseItem =  list.find(item => item.key === v.giftID)
                            if(chooseItem) {
                                chooseCoupon = chooseItem
                            }
                            return chooseItem
                        })

                         v.label = chooseCouponItem[0] && chooseCouponItem[0].label
                         v.giftValue = chooseCoupon.giftValue

                    })

                    this.props.dispatch({
                        type: 'createActiveCom/updateState',
                        payload: {
                           formData: {
                               ...data,
                               giftList: gifts,
                               eventLimitDate: [moment(eventStartDate),moment(eventEndDate)],
                               needCount
                           },
                           crmGiftTypes: boardList
                        }
                    })
                })

                 this.form0.setFieldsValue({
                    eventRemark,
                    eventLimitDate: [moment(eventStartDate),moment(eventEndDate)],
                    eventName
                 })
                 this.form3.setFieldsValue({
                    shareTitle,
                    shareSubtitle ,
                 })
                 this.props.dispatch({
                     type: 'createActiveCom/updateState',
                     payload: {
                        formData: {
                            ...data,
                            eventLimitDate: [moment(eventStartDate),moment(eventEndDate)],
                            needCount
                        }
                     }
                 })
            }
        })
    }

    handleNext =  (cb,current) => {
        console.log(this.submitFn1,current,'ddddddddddddddyihetuan')
        console.log(typeof this[`submitFn${current}`],this[`submitFn${current}`](),'12345678------------------')
         if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
             console.log('gohere===============')
            cb()
         }
    }
    handleFinish = (cb,current) => {
        if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {

            this.form3.validateFieldsAndScroll((e,v) => {
                if(e) {
                    return
                }
                const { formData, type, isEdit } = this.props.createActiveCom
                const {
                    eventName,
                    eventRemark,
                    eventEndDate,
                    eventStartDate,
                    giftGetRule,
                    shareImagePath,
                    countCycleDays,
                    partInTimes,
                    giftList,

                } = formData
                const { shareSubtitle,
                    shareTitle,} = v
                let typePath =  'createActiveCom/addEvent_NEW'

                if(isEdit) {
                    typePath = 'createActiveCom/updateEvent_NEW'
                }

                giftList.forEach((v,i) => {
                    if(v.countType == 1) {
                        v.effectType = '3'
                    }
                    v.sendType = 0
                    if(i === 3) {
                        v.sendType = 1
                    }
                })

                this.props.dispatch({
                    type: typePath ,
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
                        gifts: giftList
                    }
                }).then(res => {
                    if(res) {
                        cb()
                        closePage()
                        jumpPage({pageID: '1000076003'})
                    }
                })

            })


         }
    }
    handlePrev = (cb) => {
        cb()
    }
    handleCancel = (cb) => {
        const  { itemID } = decodeUrl()
        cb()
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
        console.log(current,submitFn,form,'getSubmitFn===============')
        this[`submitFn${current}`] = submitFn
        this[`form${current}`] = form
    }

    handleStepChange = (current) => {
        console.log(current,'handleeeStepChangecurrent')
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                currentStep: current
            }
        })
    }

    render () {
        const { loading } = this.props
        const { brandList ,messageSignList}  = this.state
        const {
            formData,
            isView
        } = this.props.createActiveCom
        const { eventLimitDate, needCount, giftList = [] } = formData


        const giftListMap = giftList.filter((v,i) => {
            return v && i < 3
        })
        const saveLoading = loading.effects['createActiveCom/addEvent_NEW']
        const loadLoading = loading.effects['createActiveCom/couponService_getSortedCouponBoardList']

        const steps = [{
            title: '基本信息',
            content:  <Step1
            getSubmitFn={this.getSubmitFn(0)}
            />,
          },  {
            title: '活动范围',
            content:  <Step2
            getSubmitFn={this.getSubmitFn(1)}
            brandList={brandList}
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
            messageSignList={messageSignList}
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
                    {loadLoading ?
                     <div className={styles.loading}>
                        <Spin></Spin>
                        </div>
                    : null}
                </div>
            </div>
        )
    }
}

export default GrabRedPacket
