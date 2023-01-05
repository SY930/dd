import React from 'react'
import moment from 'moment';
import  BaseForm  from '../../../../components/common/BaseForm';
import { Input } from 'antd'
import {formItems1,formKeys1} from '../constant'
import styles from '../payHaveGift.less'
import {connect} from 'react-redux';
import { renderEventRemark, renderTagLst } from '../../helper/common'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step1 extends React.Component {

    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
            })
        }
    }

    handleFromChange = (key,value) => {

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

        this.form.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }

        })


        return flag
    }
    render () {
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        formItems1.tagLst.render = renderTagLst.bind(this)
        let { formData,isView,isEdit } = this.props.createActiveCom
        formData = {
            ...formData,
            eventCode: isView ? formData.eventCode : formData.eventCode ? formData.eventCode : `YX${moment(new Date()).format('YYYYMMDDHHmmss')}`
        }
        return (
            <div className={styles.step1Wrap}>
                {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                <BaseForm
                    getForm={this.getForm}
                    formItems={formItems1}
                    formData={formData}
                    formKeys={formKeys1}
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

export default Step1
