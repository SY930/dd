import React, { PureComponent as Component } from "react";
import { connect } from "react-redux";
import BaseForm from "components/common/BaseForm";
import { Select } from "antd";
import ShopSelector from "components/ShopSelector";
import { isFilterShopType } from "../../../../helpers/util";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
        };
    }

    onChangeBasicForm = (key, value) => {
        const { basicForm } = this.props;
        if (!basicForm) {
            return;
        }
        const values = basicForm.getFieldsValue();
        let formKeys = [...this.state.formKeys];
        //发券方式
        if (key == "triggerType") {
            //用户手动领取&&全部或非会员
            if (value == 2 && (values.people == 1 || values.people == 2)) {
                formKeys.splice(5, 0, "autoRegister");
            } else {
                formKeys = formKeys.filter((item) => item != "autoRegister");
            }
            //参与用户
        } else if (key == "people") {
            if (value == 1 || value == 2) {
                if (values.triggerType == 2) {
                    formKeys.splice(5, 0, "autoRegister");
                } else {
                    formKeys = formKeys.filter(
                        (item) => item != "autoRegister"
                    );
                }
            } else {
                formKeys.splice(5, 0, "cardLevelRangeType");
            }
            //会员范围
        } else if (key == "cardLevelRangeType") {
            if (value == 2) {
                formKeys = formKeys.filter((item) => item != "cardLevelIDList");
                formKeys.splice(6, 0, "cardTypeIDList");
            } else if (value == 3) {
                formKeys = formKeys.filter((item) => item != "cardTypeIDList");
                formKeys.splice(6, 0, "cardLevelIDList");
            } else {
                formKeys = formKeys.filter(
                    (item) =>
                        item != "cardTypeIDList" && item != "cardLevelIDList"
                );
            }
        }
        this.setState({ formKeys });
    };

    resetFormItems = () => {
        const { shopIDList, cardTypeIDList } = baseFormItems;
        return {
            ...baseFormItems,
            shopIDList: {
                ...shopIDList,
                render: (d) =>
                    d()(
                        <ShopSelector
                            filterParm={
                                isFilterShopType()
                                    ? { productCode: "HLL_CRM_License" }
                                    : {}
                            }
                        />
                    ),
            },
        };
    };
    render() {
        const { formData, getForm } = this.props;
        const { formKeys } = this.state;
        return (
            <div style={{ maxWidth: 800 }}>
                <BaseForm
                    getForm={getForm}
                    formItems={this.resetFormItems()}
                    formKeys={formKeys}
                    onChange={this.onChangeBasicForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default BasicInfoForm;
