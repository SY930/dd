/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-10 14:36:10
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-10-24 16:37:16
 * @FilePath: /platform-sale/src/containers/SaleActives/SeckillInLimitedTime/components/UsageRuleForm.jsx
 */

import React, { PureComponent as Component } from "react";
import BaseForm from "components/common/BaseForm";
import DateRange from "../DateRange/index";
import {
    ruleFormItem,
    ruleFormKeys,
    formItemLayout,
} from "../common";
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
                    d()(
                        <AddGifts
                            accountInfo={accountInfo}
                            getGiftForm={this.getForm}
                        />
                    )
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
