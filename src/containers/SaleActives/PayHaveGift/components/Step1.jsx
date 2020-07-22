import React from 'react'
import  BaseForm  from '../../../../components/common/BaseForm';
import {formItems1,formKeys1,imgUrl} from '../contanst'
import styles from '../payHaveGift.less'
import {connect} from 'react-redux';

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
        formItems1.eventRemark.render = formItems1.eventRemark.render.bind(this)
        const { formData } = this.props.createActiveCom
        return (
            <div className={styles.step1Wrap}>
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
