import React from 'react'
import {connect} from 'react-redux';
import _ from 'lodash'
import { formItems2, formKeys2 } from '../contanst'
import  BaseForm  from '../../../../components/common/BaseForm';
import moment from 'moment'
import { getDefaultGiftData } from '../../helper/index'
const DATE_FORMAT = 'YYYYMMDD000000';

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    state = {
        formKeys2: _.cloneDeep(formKeys2)
    }
    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn(this.handleSubmit)
        }
    }

    handleFromChange = (key,value) => {
        console.log('step2----key',key,value)
        const { formData } = this.props.createActiveCom
        const { formKeys2 } = this.state

        if(key === 'afterPayJumpType' && value === '4') {
            const { wxNickNameList } = this.props.createActiveCom
            formKeys2.splice(5,0,'miniProgramInfo')
            if(!wxNickNameList.length) {
                this.props.dispatch({
                    type: 'createActiveCom/getApps'
                })
            }
        }
        if(key === 'afterPayJumpType' && value === '3') {
            if(formKeys2.includes('miniProgramInfo')) {
                formKeys2.splice(5,1)
            }
        }

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
    render () {
        const { formKeys2 } = this.state
        const { wxNickNameList } = this.props.createActiveCom

        formItems2.eventDate.render = formItems2.eventDate.render.bind(this)
        formItems2.mySendGift.render = formItems2.mySendGift.render.bind(this)
        formItems2.afterPayJumpType.render = formItems2.afterPayJumpType.render.bind(this)

        if(formKeys2.includes('miniProgramInfo')) {
            formItems2.miniProgramInfo.options = wxNickNameList
        }
        const { formData } = this.props.createActiveCom
        console.log('stp22-formData---',formData)
        return (
            <div style={{marginRight: '20px'}}>
                 <BaseForm
                    getForm={this.getForm}
                    formItems={formItems2}
                    formData={formData}
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
