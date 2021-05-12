import React from 'react'
import { connect } from 'react-redux';
import { Row, Col, DatePicker, Tooltip, Icon, message, Select } from 'antd'
import _ from 'lodash'
import { formItems2, formKeys2 } from '../constant'
import  BaseForm  from '../../../../components/common/BaseForm';
import { partInTimesRender } from '../../helper/common'
import styles from '../swellGiftBag.less'


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

    /** 获取会员卡类型 */
    getGroupCardTypeOpts() {
        const { groupCardTypeList = [] } = this.props;
        const cardTypeList = groupCardTypeList.filter((i) => i.isActive);
        return cardTypeList.map(x => {
            const { cardTypeID, cardTypeName, isActive } = x;
            return { label: cardTypeName, value: cardTypeID };

        });
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
            console.log('v: ', v);
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
            if (!v.defaultCardType) {
                flag = false
                return  message.warn('新用户注册卡类不能为空')
            }
            formData = { ...formData, defaultCardType: v.defaultCardType }
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


    renderFunction = () => {
        return (d) => {
            return this.renderDefaultCardType(d)
        };
    }

    renderDefaultCardType = (d) => {
        const defaultCardOpts = this.getGroupCardTypeOpts();
        return (
            <div className={styles.partInTimesRender}>
                <div className={styles.title}>
                    <div className={styles.line}></div>
                    <div className={styles.text}>助力用户条件限制</div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <span style={{ marginRight: '5px' }}>新用户注册卡类</span>
                    {
                        d()(
                            <Select
                                style={{
                                    width: 354
                                }}
                                showSearch={true}
                                allowClear={true}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                // onChange={(v) => { this.handleDefaultCardTypeChange(v, 'defaultCardType') }}
                            >
                                {
                                    (defaultCardOpts || []).map((type, index) =>
                                        <Select.Option key={index} value={String(type.value)} >{type.label}</Select.Option>
                                    )
                                }
                            </Select>
                        )
                    }
                </div>
            </div>
        )
    }



    render () {
        const { formKeys2 } = this.state
        formItems2.partInTimes.render =  partInTimesRender.bind(this);
        formItems2.defaultCardType.render = this.renderFunction();
        const { formData,isView,isEdit } = this.props.createActiveCom
        console.log('formData: ', formData);

        return (
            <div style={{marginRight: '20px', position: 'relative'}}>
                {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
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
