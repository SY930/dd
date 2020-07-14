import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage } from '@hualala/platform-base'
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
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class PayHaveGift extends React.Component {
    render () {
        console.log('this---',this)
        const steps = [{
            title: 'First',
            content:  <Step1/>,
          }, {
            title: 'Second',
            content:  <Step2/>,
          }, {
            title: 'Last',
            content:  <Step3/>,
          }];
        return (
            <div>
                <ActSteps
                  loading={false}
                  steps={steps}
                  callback={(arg) => {
                      this.props.callbacktwo(arg);
                  }}
                  onNext={this.handleNext}
                  onFinish={this.handleFinish}
                  onPrev={this.handlePrev}
                  onCancel={this.handleCancel}
                />
            </div>
        )
    }
}

export default PayHaveGift
