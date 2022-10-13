/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-10 14:36:10
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-10-11 10:57:13
 * @FilePath: /platform-sale/src/containers/SaleActives/SeckillInLimitedTime/components/UsageRuleForm.jsx
 * @Description: 这是默认设置
 */

import React, { PureComponent as Component } from "react";
import { Icon, Button, Form, Input } from "antd";
import BaseForm from "components/common/BaseForm";
import EveryDay from "../../../PromotionV3/Camp/EveryDay";
import DateRange from "../../../PromotionV3/Camp/DateRange";
import {
    ruleFormItem,
    ruleFormKeys,
    formItemLayout,
} from "../common";
import WxCouponModal from "./WxCouponModal";
import SleectedWxCouponTable from "./SleectedWxCouponTable";
import AddGifts from "../AddGifts/AddGifts";

class UsageRuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: ruleFormKeys,
            wxCouponVisible: false,
            slectedWxCouponList: [] //选中的微信券
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.slectedWxCouponList != this.props.slectedWxCouponList) {
            this.setState({
                slectedWxCouponList: nextProps.slectedWxCouponList,
            });
        }
    }

    onChangeRuleForm = (key, value) => {
        const { ruleForm: form, formData = {} } = this.props;
        let newFormKeys = [...ruleFormKeys];
    };

    // 添加商家券
    addWXCoupon = () => {
        this.setState({
            wxCouponVisible: true,
        });
    };

    onWXCouponCancel = () => {
        this.setState({
            wxCouponVisible: false,
        });
    };

    onWxCouponChange = (rowSelected) => {
        const { setSlectedWxCouponList } = this.props;
        this.setState({ slectedWxCouponList: rowSelected });
        setSlectedWxCouponList(rowSelected);
    };

    getForm = (formList) => {
        const { getGiftForm } = this.props;
        getGiftForm(formList);
    };

    resetFormItems = () => {
        const { gifts, eventRange } = ruleFormItem;
        const { accountInfo, ruleForm = {}, formData, basicForm } = this.props;
        let cycleType = "";
        if (ruleForm) {
            const { getFieldValue } = ruleForm;
            const { cycleType: t } = formData || {};
            cycleType = getFieldValue("cycleType") || t;
        }
        return {
            ...ruleFormItem,
            eventRange: {
                ...eventRange,
                render: (d) => d({})(<DateRange type={"86"} />),
            },
            gifts: {
                ...gifts,
                render: (d, form) =>
                    // form.getFieldValue("couponType") == 1 ? (
                    //     <div style={{ width: "100%" }}>
                    //         <p>
                    //             <Button icon="plus" onClick={this.addWXCoupon}>
                    //                 添加第三方微信优惠券
                    //             </Button>
                    //         </p>
                    //         <p
                    //             style={{
                    //                 height: 36,
                    //                 paddingLeft: 13,
                    //                 marginBottom: 4,
                    //                 background: "#FFFBE6",
                    //                 borderRadius: 4,
                    //                 lineHeight: "36px",
                    //                 color: "#666",
                    //                 marginTop: "10px",
                    //             }}
                    //         >
                    //             <Icon
                    //                 type="exclamation-circle"
                    //                 style={{
                    //                     color: "#FAAD14",
                    //                     marginRight: 10,
                    //                 }}
                    //             />
                    //             <span>
                    //                 第三方微信优惠券领取后，可同步微信卡包展示。
                    //             </span>
                    //         </p>
                    //         <Form.Item
                    //             label={"用户单次领取优惠券张数"}
                    //             labelCol={{ span: 7 }}
                    //             wrapperCol={{ span: 17 }}
                    //         >
                    //             {d({
                    //                 key: "giftCount",
                    //                 rules: [
                    //                     "required",
                    //                     {
                    //                         pattern: /^([1-9]|10)$/,
                    //                         message: "请输入为1-10的整数",
                    //                     },
                    //                 ],
                    //             })(
                    //                 <Input
                    //                     placeholder={"请输入1-9的整数"}
                    //                     type="number"
                    //                 />
                    //             )}
                    //         </Form.Item>
                    //         <SleectedWxCouponTable
                    //             slectedWxCouponList={
                    //                 this.state.slectedWxCouponList
                    //             }
                    //             onWxCouponChange={this.onWxCouponChange}
                    //         />
                    //         {this.state.wxCouponVisible && (
                    //             <WxCouponModal
                    //                 onCancel={this.onWXCouponCancel}
                    //                 slectedWxCouponList={
                    //                     this.state.slectedWxCouponList
                    //                 }
                    //                 user={this.props.user}
                    //                 onWxCouponChange={this.onWxCouponChange}
                    //             />
                    //         )}
                    //     </div>
                    // ) : (
                        d()(
                            <AddGifts
                                accountInfo={accountInfo}
                                getGiftForm={this.getForm}
                            />
                        )
                    // ),
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
