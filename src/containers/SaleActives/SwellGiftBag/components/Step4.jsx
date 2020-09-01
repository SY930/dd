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

    state = {
        shareImagePath: ''
    }

    componentDidMount () {

        this.getSubmitFn()
    }
    getSubmitFn = (form) => {
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
            })
        }
    }


    handleSubmit = () => {
        let flag = true
        const { formData: modalFormData } = this.props.createActiveCom
        const { shareImagePath } = this.state
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
                    shareImagePath
                }
            }
        })
        return flag
    }

    getForm = (form) => {
        this.shareForm = form
    }

    onRestImg = (v) => {
        this.setState({
            shareImagePath: v.value
        })
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
