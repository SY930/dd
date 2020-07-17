import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage,closePage } from '@hualala/platform-base'
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

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class PayHaveGift extends React.Component {
    handleNext =  (cb,current) => {
         if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            cb()
         }
    }
    handleFinish = (cb,current) => {
        if(typeof this[`submitFn${current}`]  === 'function' && this[`submitFn${current}`]()) {
            cb()
            console.log('完成')
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
    getSubmitFn = (current) => (submitFn) => {
        this[`submitFn${current}`] = submitFn
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
        const {
            formData,
            currentStep
        } = this.props.createActiveCom
        const {merchantLogoUrl,eventName} = formData
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

        return (
            <div className={styles.actWrap}>
                <div className={styles.setResult}>
                        {
                            currentStep == 0 &&  <div className={styles.resultImgWrap}>
                            <img className={styles.contentBg} src="http://res.hualala.com/basicdoc/db96d381-7930-4a40-8689-1cb2f12420c2.png"/>
                            <div className={styles.showData}>
                                <img   src={merchantLogoUrl ? imgUrl +  merchantLogoUrl.url : null}/>
                                <div className={styles.text}>
                                     <div className={styles.title}>{eventName}</div>
                                    <div className={styles.content}>大师咖啡立减12元</div>
                                </div>
                            </div>

                             </div>
                        }

                        {currentStep == 1 &&
                            <div className={styles.resultImgWrap}>
                                <img className={styles.contentBg} src="http://res.hualala.com/basicdoc/f5354b35-e33e-40ee-b857-133ba4e6a1a6.png"/>
                                <div className={styles.topBg}>
                                     <img style={{width: '254px',height: '93px',fill: '#8E60BF'}} alt="" src="data:image/png;base64,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"></img>
                                </div>
                                <div className={styles.step2HeaderImg}>
                                    <img src={merchantLogoUrl} />
                                </div>
                                <div className={styles.step2ContentBanner}>
                                    <img/>
                                </div>
                            </div>
                        }

                </div>
                <div className={styles.settingWrap}>
                    <ActSteps
                        isUpdate={true}
                        loading={false}
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
