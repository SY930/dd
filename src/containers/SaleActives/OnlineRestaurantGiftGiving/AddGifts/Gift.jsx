import React, { PureComponent as Component } from "react";
import { TreeSelect } from "antd";
import BaseForm from "components/common/BaseForm";
import {
    timeOpts,
    dayOpts,
    formKeys1,
    formItems,
    formKeys2,
    formItemLayout,
} from "./common";

export default class Gift extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        options: [], // 生效时间下拉框
        formKeys: formKeys1,
        giftIDNumber: "",
    };
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        const { idx, onChange } = this.props;
        if (key === "countType") {
            // 相对有效期
            const options = value == "0" ? timeOpts : dayOpts;
            this.setState({
                options,
            }, () => {
                if(this.props.formData.countType == '1') {
                    this.form.setFieldsValue({ giftEffectTimeHours: this.props.formData.giftEffectTimeHours });
                }
            });
            if (this.isInit) {
                // 控制初始化，暂时处理方式
                if (value == "1") {
                    this.form.setFieldsValue({ giftEffectTimeHours: "1" });
                    onChange(idx, { giftEffectTimeHours: "1", [key]: value });
                } else {
                    this.form.setFieldsValue({ giftEffectTimeHours: "0" });
                    onChange(idx, { giftEffectTimeHours: "0", [key]: value });
                }
            }
            this.isInit = true;
            return;
        }
        if (key === "effectType") {
            // 生效方式
            if (value == "1") {
                this.setState({ formKeys: formKeys1 }, () => {
                    const countType = this.form.getFieldValue("countType");
                    // this.form.setFieldsValue({ 'giftEffectTimeHours': countType });
                });
            } else {
                this.setState({ formKeys: formKeys2 });
            }
        }
        if (key === "giftID") {
            this.setState({
                giftIDNumber: value,
            });
        }
        onChange(idx, { [key]: value });
    };
    /** 得到form */
    getForm = (form) => {
        this.form = form;
        const { idx, getForm } = this.props;
        getForm(idx, form);
    };
    resetFormItems() {
        const { options } = this.state;
        const { treeData } = this.props;
        const { giftID, giftEffectTimeHours } = formItems;
        const render = (d) =>
            d()(
                <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    treeData={treeData}
                    placeholder="请选择礼品名称"
                    showSearch={true}
                    treeNodeFilterProp="label"
                    allowClear={true}
                />
            );
        return {
            ...formItems,
            giftID: { ...giftID, render },
            giftEffectTimeHours: { ...giftEffectTimeHours, options },
        };
    }
    render() {
        const { formKeys, giftIDNumber } = this.state;
        let { formData } = this.props;
        if (formData) {
            formData.giftIDNumber = giftIDNumber
                ? giftIDNumber
                : formData.giftID;
        }
        const newFormItems = this.resetFormItems();
        return (
            <BaseForm
                getForm={this.getForm}
                formItems={newFormItems}
                formKeys={formKeys}
                onChange={this.onFormChange}
                formData={formData || {}}
                formItemLayout={formItemLayout}
            />
        );
    }
}
