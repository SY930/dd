import React from 'react'
import styles from '../grabRedPacket.less'
import {connect} from 'react-redux';
import {renderEventRemark, eventLimitDateRender, getDateCount} from '../../helper/common'
import ShareSetting from './ShareSetting/ShareSetting'

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
    
    formDataChange = (v) => {
        const { formData } = this.props.createActiveCom
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData: {
                    ...formData,
                    ...v
                }
            }
        })
    }
    render () {
        const {isView,isEdit,formData } = this.props.createActiveCom
        const { shareImagePath } = formData
        const { messageSignList,queryFsmGroupList,msgTplList} = this.props;
        return (
            <div className={styles.step4Wrap}>
                {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                <ShareSetting
                    getForm = {this.getForm}
                    formData={formData}
                    onRestImg= {this.onRestImg}
                    onChange={this.formDataChange}
                    messageSignList={messageSignList}
                    queryFsmGroupList={queryFsmGroupList}
                    msgTplList={msgTplList}
                    value={{
                        type: '82',
                        isHideDining: true,
                        shareImagePath
                    }}
                />
            </div>
        )
    }
}

export default Step4
