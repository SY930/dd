import React from 'react'
import { connect } from 'react-redux';
import { Row, Col, DatePicker, Tooltip, Icon, message, Select } from 'antd'
import _ from 'lodash'
import { formItems2, formKeys2 } from '../constant'
import  BaseForm  from '../../../../components/common/BaseForm';
import { partInTimesRender } from '../../helper/common'


@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step2 extends React.Component {
    state = {
        formKeys2: _.cloneDeep(formKeys2),
        partInTimes: 'A'
    }

    getForm = (form) => {
        this.form = form;
        if(typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { formData } = nextProps.createActiveCom

        const { partInTimes, countCycleDays } = formData
        if(partInTimes == 0 && partInTimes == 0) {
            this.form.setFieldsValue({
                partInTimes: 'A'
            })
            this.setState({
                partInTimes: 'A'
            })
        }
        if(partInTimes && countCycleDays == 0) {
            this.form.setFieldsValue({
                partInTimes: 'B'
            })
            this.setState({
                partInTimesB: partInTimes,
                partInTimes: 'B'
            })
        }
        if(partInTimes && countCycleDays) {
            this.form.setFieldsValue({
                partInTimes: 'C'
            })
            this.setState({
                partInTimesC: partInTimes,
                countCycleDays,
                partInTimes: 'C'
            })
        }

    }

    handleSubmit = () => {
        const { formData: modalFormData } = this.props.createActiveCom
        let flag = true
        this.form.validateFieldsAndScroll((e,v) => {
            if(e) {
                flag = false
                return false
            }
            let formData = {}
            const {partInTimesB,partInTimesC,countCycleDays} = this.state

            if(v.partInTimes === 'A') {
                formData = {
                    ...modalFormData,
                    partInTimes: 0,
                    countCycleDays: 0
                }
            }
            if(v.partInTimes === 'B') {
                formData = {
                    ...modalFormData,
                    partInTimes: partInTimesB,
                    countCycleDays: 0
                }
            }
            if(v.partInTimes === 'C') {
                formData = {
                    ...modalFormData,
                    partInTimes: partInTimesC,
                    countCycleDays
                }
            }
            if(!formData.partInTimes && v.partInTimes === 'B') {
                flag = false
               return  message.warn('助力次数不能为空')
            }
            if(v.partInTimes === 'C' && (!formData.countCycleDays || !formData.partInTimes)) {
                flag = false
              return  message.warn('助力周期次数不能为空')
            }
            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })

        })
        return flag
    }

    handleFromChange = (key,value) => {

        this.setState({
            [key]: value
        })
    }


    render () {
        const { formKeys2 } = this.state
        formItems2.partInTimes.render =  partInTimesRender.bind(this)
        const { formData } = this.props.createActiveCom

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
