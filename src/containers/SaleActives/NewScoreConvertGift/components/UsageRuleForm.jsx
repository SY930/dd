import React, { PureComponent as Component } from "react";
import BaseForm from "components/common/BaseForm";
import EveryDay from "../../../PromotionV3/Camp/EveryDay";
import CardLevel from '../../../SpecialPromotionNEW/common/CardLevel';
import {
    formKeys32,
    ruleFormItem,
    formItemLayout,
} from "../common";
import ShopAreaSelector from '../../../../components/ShopAreaSelector/index.jsx';
import Goods from '../../../../containers/BasicModules/Goods';
import Coupon from '../../../../containers/BasicModules/Coupon';
import { isZhouheiya, isGeneral } from "../../../../constants/WhiteList";

class UsageRuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: formKeys32,
            wxCouponVisible: false,
            slectedWxCouponList: [], //选中的微信券
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.slectedWxCouponList != this.props.slectedWxCouponList) {
            this.setState({
                slectedWxCouponList: nextProps.slectedWxCouponList,
            });
        }
    }

    onChangeRuleForm = (key, value) => {};

    getForm = (formList) => {
        const { getGiftForm } = this.props;
        getGiftForm(formList);
    };

    handleShopAreaChange = (value) => {
        const { setRuleForm } = this.props;
        console.log(value);
        const { areaList } = value.otherRes || {};
        let orgs = [];
        if(value.radioValue == 'shop') {
            orgs = value.list.map(shopID => ({
                shopID,
                shopType: '1'
            }))
        } else {
            orgs = value.list.map(shopID => ({
                shopID,
                shopType: '2',
                shopPath: (areaList.find(item => item.orgID == shopID) || {}).path + shopID + '/'
            }))
        }
        setRuleForm({
            shopAreaData: {
                type: value.radioValue,
                list: value.list,
            },
            orgs
        })
        console.log(orgs, 'orgs');
    }

    resetFormItems = () => {
        const { gifts, validCycle, eventRange, memberRange, orgs, goods, coupon } = ruleFormItem;
        const { accountInfo, ruleForm = {}, formData, basicForm, setRuleForm, shopAreaData, mode, groupID, goodsData = [], couponData = [] } = this.props;
        let cycleType = "";
        if (ruleForm) {
            const { getFieldValue } = ruleForm;
            const { cycleType: t } = formData || {};
            cycleType = getFieldValue("cycleType") || t;
        }
        const renderValidCycle = (d) => d()(<EveryDay type={cycleType} />);
        const userCount = formData.userCount || 0; 

        const { auditStatus } = formData;
        const editIsDisabled = (mode === 'edit' && !isGeneral() && (auditStatus == 2 || auditStatus == 4)) || mode === 'view';

        return {
            ...ruleFormItem,
            memberRange: {
                ...memberRange,
                render: (d, form) =>
                    d()(
                        <CardLevel
                            onChange={(obj) => {
                                //d()此方法不执行
                                this.setState(obj);
                            }}
                            catOrCard={'card'}
                            type={89}
                            form={form}
                        />
                    ),
            },
            orgs: {
                ...orgs,
                render: (d, form) => (
                    <ShopAreaSelector
                        // brandList={brandList}
                        groupID={groupID}
                        firstRequired={!isGeneral() && mode != 'view' ? true : false}
                        secondRequired={!isGeneral() && mode != 'view' ? true : false}
                        firstValidateStatus={'error'}
                        secondValidateStatus={shopAreaData.type == 'area' && shopAreaData.list.length == 0 && !isGeneral() && mode != 'view' ? 'error' : 'success'}
                        firstHelp={shopAreaData.type == 'shop' && shopAreaData.list.length == 0 && !isGeneral() && mode != 'view' ? '请选择店铺' : ''}
                        secondHelp={shopAreaData.type == 'area' && shopAreaData.list.length == 0 && !isGeneral() && mode != 'view' ? '请选择区域' : ''}
                        value={{
                            radioValue: shopAreaData.type,
                            list: shopAreaData.list
                        }}
                        onChange={this.handleShopAreaChange}
                        formatRes={(params) => {
                            return params;
                        }}
                        disabled={editIsDisabled}
                    />
                )
            },
            goods: {
                ...goods,
                render: (d, form) => {
                    if (form.getFieldValue("exchangeType") == 0) {
                            return (
                                <Goods disabled={editIsDisabled} groupID={groupID} value={goodsData} onChange={(data) => {
                                    console.log(data, 'goods');
                                    setRuleForm({
                                        goodsData: data
                                    })
                                }} />
                            );
                        }
                    }
            },
            coupon: {
                ...coupon,
                render: (d, form) => {
                    if (form.getFieldValue("exchangeType") == 1) {
                            return (
                                <Coupon disabled={editIsDisabled} groupID={groupID} value={couponData} onChange={(data) => {
                                    console.log(data, 'coupon');
                                    setRuleForm({
                                        couponData: data
                                    })
                                }} />
                            );
                        }
                    }
            },
        };
    };

    render() {
        const { formData, getForm } = this.props;
        const { formKeys } = this.state;
        return (
            <div style={{ width: 800, marginBottom: 16 }}>
                <BaseForm
                    getForm={getForm}
                    formItems={this.resetFormItems()}
                    formKeys={formKeys}
                    onChange={this.onChangeRuleForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default UsageRuleForm;
