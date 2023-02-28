/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-10 14:36:10
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-11-29 11:39:58
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
import AddSeckillGoods from "../AddSeckillGoods/AddSeckillGoods";

class UsageRuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: ruleFormKeys,
        };
    }

    componentWillReceiveProps(nextProps) {
        
    }

    onChangeRuleForm = (key, value) => {
        if(key == 'giftList'){
            this.props.onChange(key, value)
        }
    };
    onGiftChange = (value) => {
        this.props.onGiftChange(value)
    }

    getForm = (formList) => {
        const { getGiftForm } = this.props;
        getGiftForm(formList);
    };

    resetFormItems = () => {
        const { gifts, eventRange } = ruleFormItem;
        const { accountInfo, getGiftForm, isView, itemID} = this.props;
        let cycleType = "";
        return {
            ...ruleFormItem,
            eventRange: {
                ...eventRange,
                render: (d) => d({})(<DateRange type={"95"} />),
            },
            gifts: {
                ...gifts,
                render: (d, form) =>
                    d()(
                        <AddSeckillGoods
                            accountInfo={accountInfo}
                            getGiftForm={getGiftForm}
                            onGiftChange={this.onGiftChange}
                            isView={isView}
                            itemID={itemID}
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
