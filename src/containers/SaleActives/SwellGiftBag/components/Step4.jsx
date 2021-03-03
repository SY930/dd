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



    componentDidMount () {

        this.getSubmitFn()
    }
    getSubmitFn = (form) => {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form: this.shareForm
            })
        }
    }


    handleSubmit = () => {
        let flag = true
        const { formData: modalFormData } = this.props.createActiveCom

        let formData = {}
        this.shareForm.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
            }
            formData = {
                ...v
            }
        })

        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...modalFormData,
                    ...formData,

                }
            }
        })
        return flag
    }

    getForm = (form) => {
        this.shareForm = form
    }

    onRestImg = (v) => {
        const { formData } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    shareImagePath: v.value
                }
            }
        })

    }

    render () {
        const {isView,isEdit } = this.props.createActiveCom
        const { shareImagePath } = this.props.createActiveCom.formData
        return (
            <div className={styles.step4Wrap}>
                {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                <ShareSetting
                    getForm = {this.getForm}
                    onRestImg= {this.onRestImg}
                    value={{
                        type: '66',
                        isHideDining: true,
                        shareImagePath
                    }}
                />
            </div>
        )
    }
}

export default Step4
