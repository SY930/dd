import React from 'react'
import BaseForm from '../../../../components/common/BaseForm';
import { Input, Form } from 'antd'
import { formItems1, formKeys1 } from '../constant'
import styles from '../WeighAndGive.less'
import { connect } from 'react-redux';
import moment from 'moment'
import { renderEventRemark, eventLimitDateRender, getDateCount } from '../../helper/common'
import { dateFormat } from '../../constant'
import PromotionBasicInfo from '../../../SaleCenterNEW/common/promotionBasicInfo'

@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))
class Step1 extends React.Component {


    getForm = (form) => {
        this.form = form;
        if (typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
            })
        }
    }

    handleFromChange = (key, value) => {
        const { formData } = this.props.createActiveCom
        if (key === 'eventLimitDate' && value) {
            formData[key] = value

            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })
        }

        if (key === 'eventRemark') {
            formData[key] = value

            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })
        }


    }
    handleSubmit = () => {
        let flag = true

        this.form.validateFieldsAndScroll((e, v) => {
            if (e) {
                flag = false
                return false
            }
            const { formData } = this.props.createActiveCom

            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData: {
                        ...formData,
                        ...v,
                        eventStartDate: v.eventLimitDate[0] && moment(v.eventLimitDate[0]).format(dateFormat),
                        eventEndDate: v.eventLimitDate[1] && moment(v.eventLimitDate[1]).format(dateFormat),
                    }
                }
            })

        })


        return flag
    }

    handleCategoryChange(value) {
        this.setState({
            category: value,
        });
    }

    render() {
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        formItems1.eventLimitDate.render = eventLimitDateRender.bind(this)
        const { formData, isView, isEdit } = this.props.createActiveCom
        return (
            <div className={styles.step1Wrap}>
                {isView && !isEdit && <div className={styles.disabledDiv}></div>}
                {/* <BaseForm
                    getForm={this.getForm}
                    formItems={formItems1}
                    formData={formData}
                    formKeys={formKeys1}
                    onChange={this.handleFromChange}
                    formItemLayout={{
                    labelCol: { span: 3 },
                    wrapperCol: { span: 21 },
                    }}
                /> */}
                <PromotionBasicInfo
                    isNew={!isView && !isEdit }
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                />
            </div>
        )
    }
}

export default Step1
