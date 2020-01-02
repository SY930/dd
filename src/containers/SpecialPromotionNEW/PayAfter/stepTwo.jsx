/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Checkbox,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';

import styles from '../../SaleCenterNEW/ActivityPage.less';
import ShopSelector from "../../../components/common/ShopSelector";
import Immutable from 'immutable';
import { axiosData } from '../../../helpers/util';

const supportOrderTypesOptions = [
    {
        label: '堂食',
        value: '0',
    },
    {
        label: '外送',
        value: '1',
        disabled: true,
    },
    
    {
        label: '自提',
        value: '2',
        disabled: true,
    },
    {
        label: '闪吃',
        value: '3',
        disabled: true,
    },
    {
        label: '预定',
        value: '4',
        disabled: true,
    }, 
];

const CheckboxGroup = Checkbox.Group;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const $shopIDList = props.specialPromotionInfo.getIn(['$eventInfo', 'shopIDList']);
        const supportOrderTypes = props.specialPromotionInfo.getIn(['$eventInfo', 'supportOrderTypes']);
        this.state = {
            shopIDList: Immutable.List.isList($shopIDList) ? $shopIDList.toJS().map(idNumber => `${idNumber}`) : [],
            supportOrderTypes: supportOrderTypes ? supportOrderTypes.split(',') : ['0'],
            brands: [],
            $brands: [],
            filterShop: [],
        }
        this.handleBrandChange = this.handleBrandChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        //看看这个方法是不是真的写进了brands属性
        this.setState({
            $brands: this.props.specialPromotionInfo.toJS().$eventInfo.brands,
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            $brands: nextProps.shopSchema.toJS().brands,
        })
        if(nextProps.specialPromotionInfo.toJS().$eventInfo.eventStartDate){
            const a = this.props;
            const param = {
                eventStartDate: nextProps.specialPromotionInfo.toJS().$eventInfo.eventStartDate,
                eventEndDate: nextProps.specialPromotionInfo.toJS().$eventInfo.eventEndDate,
                eventWay: nextProps.specialPromotionInfo.toJS().$eventInfo.eventWay,
            }
            axiosData(
                '/specialPromotion/queryAvailableShopIDInfo.ajax',
                {...param},
                {},
                { path: 'shopIDList' },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then(res => {
                this.setState({
                    filterShop: res ? res : [],
                })
            })
        }
    }

    handleBrandChange(value) {
        this.setState({ brands: value, selections: []});
    }

    handleSubmit = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (flag) {
            const {
                supportOrderTypes,
                shopIDList,
                brands,
            } = this.state;
            this.props.setSpecialBasicInfo({
                shopIDList,
                shopRange: shopIDList.length > 0 ? 1 : 2,
                brands,
            });
        }
        return flag;
    }

    handleShopChange = (v) => {
        this.setState({
            shopIDList: v,
        })
    }
    handleSupportOrderTypesChange = (v) => {
        this.setState({
            supportOrderTypes: v,
        })
    }
    renderBrandFormItem() {
        const _brands = this.state.$brands;
        let options;
        // if (this.state.initialized) {
            if (typeof _brands === 'object' && _brands.length > 0) {
                options = _brands.map((brand, idx) => {
                    return (
                        <Option value={brand.brandID} key={idx}>{brand.brandName}</Option>
                    );
                })
            } else {
                options = (<Option value={'0'} disabled={true}>暂无数据</Option>);
            }
        // } else {
        //     options = (<Option value={'0'} disabled={true}>数据加载中....</Option>);
        // }

        const _brandList = {
            multiple: true,
            allowClear: true,
            showSearch: false,
            filterOption: false,
            placeholder: '全部品牌',
            onChange: this.handleBrandChange,
            defaultValue: this.state.brands,
            value: this.state.brands,
        };
        return (
            <Form.Item
                label="适用品牌"
                wrapperCol={{
                    span: 17,
                }}
                labelCol={{
                    span: 4,
                }}
                hasFeedback={true}
                className={styles.FormItemStyle}
            >
                <Select {..._brandList}
                        size="default"
                        getPopupContainer={(node) => node.parentNode}
                >
                    {options}
                </Select>

            </Form.Item>
        );
    }
    

    render() {
        const originTreeData = this.props.shopSchema.toJS();
        const shopData = this.props.shopSchema.toJS().shops;
        const filterShopData = shopData.filter( item => this.state.filterShop.indexOf(item.shopID) < 0);
        const addDataShop = filterShopData.concat(shopData.filter( item => this.state.shopIDList.indexOf(item.shopID) >= 0));
        originTreeData.shops = addDataShop;
        return (
            <div>
                {this.props.user.shopID > 0 ? null : null}
                <Form.Item
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <ShopSelector
                        value={this.state.shopIDList}
                        onChange={this.handleShopChange}
                        schemaData={originTreeData}
                    />
                </Form.Item>
            </div>
            
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
