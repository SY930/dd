// import React from 'react'
// import { connect } from 'react-redux';
// import { Row, Col, DatePicker, Tooltip, Icon, message, Select } from 'antd'
// import _ from 'lodash'
// import { formItems2, formKeys2 } from '../constant'
// import  BaseForm  from '../../../../components/common/BaseForm';
// import { partInTimesRender } from '../../helper/common'
// import styles from '../grabRedPacket.less'


// @connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
// class Step2 extends React.Component {
//     state = {
//         formKeys2: _.cloneDeep(formKeys2),
//         partInTimes: 'A'
//     }

//     getForm = (form) => {
//         this.form = form;
//         if(typeof this.props.getSubmitFn === 'function') {
//             this.props.getSubmitFn({
//                 submitFn: this.handleSubmit,
//                 form
//             })
//         }
//     }

//     componentWillReceiveProps(nextProps) {
//         const { formData } = nextProps.createActiveCom

//         const { partInTimes, countCycleDays } = formData
//         if(partInTimes == 0 && partInTimes == 0) {
//             this.form.setFieldsValue({
//                 partInTimes: 'A'
//             })
//             this.setState({
//                 partInTimes: 'A'
//             })
//         }
//         if(partInTimes && countCycleDays == 0) {
//             this.form.setFieldsValue({
//                 partInTimes: 'B'
//             })
//             this.setState({
//                 partInTimesB: partInTimes,
//                 partInTimes: 'B'
//             })
//         }
//         if(partInTimes && countCycleDays) {
//             this.form.setFieldsValue({
//                 partInTimes: 'C'
//             })
//             this.setState({
//                 partInTimesC: partInTimes,
//                 countCycleDays,
//                 partInTimes: 'C'
//             })
//         }

//     }

// handleSubmit = () => {
//     const { formData: modalFormData } = this.props.createActiveCom
//     let flag = true
//     this.form.validateFieldsAndScroll((e,v) => {
//         if(e) {
//             flag = false
//             return false
//         }
//         let formData = {}
//         const {partInTimesB,partInTimesC,countCycleDays} = this.state

//         if(v.partInTimes === 'A') {
//             formData = {
//                 ...modalFormData,
//                 partInTimes: 0,
//                 countCycleDays: 0
//             }
//         }
//         if(v.partInTimes === 'B') {
//             formData = {
//                 ...modalFormData,
//                 partInTimes: partInTimesB,
//                 countCycleDays: 0
//             }
//         }
//         if(v.partInTimes === 'C') {
//             formData = {
//                 ...modalFormData,
//                 partInTimes: partInTimesC,
//                 countCycleDays
//             }
//         }
//         if(!formData.partInTimes && v.partInTimes === 'B') {
//             flag = false
//            return  message.warn('助力次数不能为空')
//         }
//         if(v.partInTimes === 'C' && (!formData.countCycleDays || !formData.partInTimes)) {
//             flag = false
//           return  message.warn('助力周期次数不能为空')
//         }
//         this.props.dispatch({
//             type: 'createActiveCom/updateState',
//             payload: {
//                 formData
//             }
//         })

//     })
//     return flag
// }

//     handleFromChange = (key,value) => {

//         this.setState({
//             [key]: value
//         })
//     }


//     render () {
//         const { formKeys2 } = this.state
//         formItems2.partInTimes.render =  partInTimesRender.bind(this)
//         const { formData,isView,isEdit } = this.props.createActiveCom

//         return (
//             <div style={{marginRight: '20px', position: 'relative'}}>
//                 {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
//                  <BaseForm
//                     getForm={this.getForm}
//                     formItems={formItems2}
//                     formData={formData}
//                     formKeys={formKeys2}
//                     onChange={this.handleFromChange}
//                     formItemLayout={{
//                     labelCol: { span: 3 },
//                     wrapperCol: { span: 21 },
//                     }}
//                 />
//             </div>
//         )
//     }
// }

// export default Step2




import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from '../Common';
import ShopSelector from 'components/ShopSelector';
import { isFilterShopType } from '../../../../helpers/util'
import {connect} from 'react-redux';
import styles from '../grabRedPacket.less';
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [],     // 选中的品牌，用来过滤店铺
    };

    // onChange = (key, value) => {
    //     if (key === 'brandList') {
    //         this.setState({ brands: value });
    //     }
    // }
    getForm = (form) => {
        this.form = form;
        if (typeof this.props.getSubmitFn === 'function') {
            this.props.getSubmitFn({
                submitFn: this.handleSubmit,
                form
            })
        }
    }
    handleSubmit = () => {
        let flag = true
        const { formData } = this.props.createActiveCom

        this.form.validateFieldsAndScroll((e, v) => {
            
            // let formData = {}
            // const { partInTimesB, partInTimesC, countCycleDays } = this.state

            this.props.dispatch({
                type: 'createActiveCom/updateState',
                payload: {
                    formData
                }
            })

        })
        return flag
    }
    handleFromChange = (key, value) => {
        console.log(key,value,'value-----------brandlist')
        let results = value
        const { formData } = this.props.createActiveCom;
        if (key === 'brandList') {
            this.setState({ brands: value });
        }
        formData[key] = results;
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        const { formData } = nextProps.createActiveCom
    }
    getBrandOpts() {
        const { brandList } = this.props;
        return brandList.map(x => {
            const { brandID, brandName } = x;
            return { label: brandName, value: brandID };
        });
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { brands } = this.state;
        console.log(brands,'brands------------------')
        // let brandss = ['76070129']
        const render = d => d()(<ShopSelector filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}} brandList={brands} />);
        const options = this.getBrandOpts();
        const { shopIDList, brandList, ...other } = formItems2;
        return {
            ...other,
            shopIDList: { ...shopIDList, render },
            brandList: { ...brandList, options },
        };
    }
    render() {
        const { } = this.state;
        // const { formData, getForm, form } = this.props;
        const newFormItems = this.resetFormItems();
        const { formData, isView, isEdit } = this.props.createActiveCom
        console.log(formData.shopIDList,'step22222222222---formdata')
        let shopIdList = [];
        shopIdList = formData.shopIDList.length > 0 && formData.shopIDList.map((item,index)=>{
            return item.toString();
        })
        console.log(shopIdList,'shoplistsfdfsdf')
        const formData1 = {
            brandList: formData.brandList,
            orderTypeList: formData.orderTypeList,
            shopIDList: shopIdList,
        }
        return (
            <div style={{position: 'relative'}}>
                {isView&&!isEdit&&<div className={styles.disabledDiv}></div>}
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formKeys={formKeys2}
                    onChange={this.handleFromChange}
                    formData={formData1 || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step2

