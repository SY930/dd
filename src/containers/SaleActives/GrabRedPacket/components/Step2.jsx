import React, { PureComponent as Component } from 'react';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from '../Common';
import ShopSelector from 'components/ShopSelector';
import { isFilterShopType } from '../../../../helpers/util'
import { checkEventShopUsed } from '../AxiosFactory';
import {connect} from 'react-redux';
import styles from '../grabRedPacket.less';
import moment from 'moment'
import { dateFormat } from '../../constant'
import _ from 'lodash';
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))

class Step2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            brands: [],     // 选中的品牌，用来过滤店铺
            isShopSelectorShow : '2',
            shopLists:[]
        };
    }
    
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
    checkEventShopUsed = (opts) => {
        checkEventShopUsed(opts).then(data => {
            if(data){
                this.setState({
                    isShopSelectorShow:'1'
                })
                
            }else{
                this.setState({
                    isShopSelectorShow:'2'
                })
            }
            this.render();
        });
    }
    handleFromChange = (key, value) => {
        const {formData}  = this.props.createActiveCom;
        formData[key] = value;
        if (key === 'brandList') {
            this.setState({ brands: value });
        }
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                formData
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        const { formData } = this.props.createActiveCom;
        const { shopsList } = this.props;
        const { shopIDList } = formData;
        if (shopIDList.length > 0 && shopsList.length > 0){
            let shopItem = []
            let shopValue = _.cloneDeep(shopIDList);
            shopsList.map((item,index) => {
                shopValue.map((item1,index1) => {
                    if(item.shopID == item1){
                        shopItem.push({"shopID":item.shopID,"shopName":item.shopName})
                    }
                })
            })

            const eventStartDate =  formData.eventLimitDate && formData.eventLimitDate[0] && moment(formData.eventLimitDate[0]).format(dateFormat)
            const eventEndDate = formData.eventLimitDate && formData.eventLimitDate[1] && moment(formData.eventLimitDate[1]).format(dateFormat)
            const shopInfos = shopItem;
            let checkOptions = {
                eventWay: '82',
                eventEndDate,
                eventStartDate,
                shopInfos
            }
            this.checkEventShopUsed(checkOptions)
        }

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
        // const _this  = this;
        const { brands ,isShopSelectorShow} = this.state;
        const render = d => d()(<ShopSelector  eventWay='82'isShopSelectorShow = {isShopSelectorShow} filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}} brandList={brands} />);
        const options = this.getBrandOpts();
        const { shopIDList, brandList, ...other } = formItems2;
        return {
            ...other,
            shopIDList: { ...shopIDList, render },
            brandList: { ...brandList, options },
        };
    }
    render() {
        // const { formData, getForm, form } = this.props;
        const newFormItems = this.resetFormItems();
        const { formData, isView, isEdit } = this.props.createActiveCom
        let shopIdList = [];
        let orderList = formData.orderTypeList.length > 0 ? formData.orderTypeList : ["31"];
        if(formData.shopIDList && formData.shopIDList.length > 0){
            shopIdList = formData.shopIDList.map((item,index)=>{
                return _.isString(item) ? item : item.toString();
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

