import React from 'react'
import {connect} from 'react-redux';
import { formItems2, formKeys2 } from '../contanst'
import  BaseForm  from '../../../../components/common/BaseForm';
import moment from 'moment'
import { getDefaultGiftData } from '../../helper/index'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn(this.handleSubmit)
        }
    }

    handleFromChange = (key,value) => {
        console.log('key',key,value)
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
        const { giftForm } = this.props.createActiveCom
        this.form.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }
            console.log('v---',v)
        })
        giftForm.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }
            console.log('v---',v)
        })

        return flag
    }
    getDateCount = () => {
        const { formData } = this.props.createActiveCom;
        const { startTime, endTime } = formData || {};
        if (undefined == startTime || undefined == endTime) {
            return 0
        }
        return moment(endTime, DATE_FORMAT)
            .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
    }
    render () {
        formItems2.eventDate.render = formItems2.eventDate.render.bind(this)
        formItems2.mySendGift.render = formItems2.mySendGift.render.bind(this)

        return (
            <div style={{marginRight: '20px'}}>
                 <BaseForm
                    getForm={this.getForm}
                    formItems={formItems2}
                    formData={{}}
                    formKeys={formKeys2}
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

export default Step2
