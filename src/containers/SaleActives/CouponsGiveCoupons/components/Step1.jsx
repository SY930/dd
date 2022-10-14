import React from 'react'
import  BaseForm  from '../../../../components/common/BaseForm';
import { Input } from 'antd'
import {getFormItems1,formKeys1} from '../constant'
import styles from '../CouponsGiveCoupons.less'
import {connect} from 'react-redux';
import { renderEventRemark, eventLimitDateRender,sendSmsGateRender } from '../../helper/common'
import moment from 'moment'
import { dateFormat } from '../../constant'
import ShopSelector from 'components/ShopSelector';
import { isFilterShopType } from '../../../../helpers/util'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Step1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
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

    render () {
        const { formData,isView,isEdit  } = this.props.createActiveCom;
        const formItems1 = getFormItems1(isEdit ? true : false)
        formItems1.eventRemark.render = renderEventRemark.bind(this)
        formItems1.eventLimitDate.render = eventLimitDateRender.bind(this)
        formItems1.smsGate.render = sendSmsGateRender.bind(this);
        const render = d => d()(<ShopSelector eventWay='81' filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}} brandList={[]} />);
        formItems1.shopIDList = { ...formItems1.shopIDList, render };
        let shopIdList = [];
        if(formData.shopIDList && formData.shopIDList.length > 0){
            shopIdList = formData.shopIDList.map((item,index)=>{
                return item.toString();
            })
        }
        formData.shopIDList = shopIdList;
        
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
