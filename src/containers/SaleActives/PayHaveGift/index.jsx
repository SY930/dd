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
    render () {
        const {
            formData,
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
                    <div className={styles.resultImgWrap}>
                        <img className={styles.contentBg} src="http://res.hualala.com/basicdoc/db96d381-7930-4a40-8689-1cb2f12420c2.png"/>
                        <div className={styles.showData}>
                            <img   src={merchantLogoUrl ? imgUrl +  merchantLogoUrl.url : null}/>
                            <div className={styles.text}>
                                 <div className={styles.title}>{eventName}</div>
                                <div className={styles.content}>大师咖啡立减12元</div>
                            </div>
                        </div>
                    </div>
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
                    />
                </div>
            </div>
        )
    }
}

export default PayHaveGift
