import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from '../Common';
import ShopSelector from 'components/ShopSelector';
import { isFilterShopType } from '../../../../helpers/util'
import {connect} from 'react-redux';
import styles from '../grabRedPacket.less';
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))

class Step2 extends Component {
    state = {
        brands: [],     // 选中的品牌，用来过滤店铺
    };

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
        let shopIdList = [];
        let orderList = formData.orderTypeList.length > 0 ? formData.orderTypeList : ["31"];
        if(formData.shopIDList && formData.shopIDList.length > 0){
            shopIdList = formData.shopIDList.map((item,index)=>{
                return item.toString();
            })
        }
        const formData1 = {
            brandList: formData.brandList,
            orderTypeList: orderList,
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

