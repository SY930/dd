import React from 'react'
import  BaseForm  from '../../../../components/common/BaseForm';
import { Input, Form  } from 'antd'
import {formItems1,formKeys1} from '../constant'
import styles from '../swellGiftBag.less'
import {connect} from 'react-redux';
import {renderEventRemark, eventLimitDateRender, getDateCount} from '../../helper/common'
import ShareSetting from '../../components/ShareSetting/ShareSetting'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step4 extends React.Component {


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
                // flag = false
            }

        })


        return flag
    }

    getForm = (form) => {
        this.shareForm = form
    }

    onRestImg = (v) => {
        console.log('v---',v)
    }

    render () {

        return (
            <div className={styles.step4Wrap}>
                <ShareSetting
                    getForm = {this.getForm}
                    onRestImg= {this.onRestImg}
                    value={{
                        type: '66',
                        isHideDining: true,
                    }}
                />
            </div>
        )
    }
}

export default Step4
