/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-10 14:36:10
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-11-24 23:04:38
 * @FilePath: /platform-sale/src/containers/SaleActives/SeckillInLimitedTime/components/BasicInfoForm.jsx
 */
import React, { PureComponent as Component } from "react";
import moment from "moment";
import { uniq } from "lodash";
import BaseForm from "components/common/BaseForm";
import { Select, message, Form, Tooltip, Icon } from "antd";
import ShopSelector from "components/ShopSelector";
import BaseHualalaModal from "../../../SaleCenterNEW/common/BaseHualalaModal";
import { isFilterShopType } from "../../../../helpers/util";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";
import { fetchSpecialCardLevel, getListCardTypeShop } from "../AxiosFactory";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            shopStatus: true,
        };
    }

    componentDidMount() {
        const { accountInfo } = this.props;
    }

    componentWillReceiveProps(nextProps) {
    }

    onChangeBasicForm = (key, value) => {};

    resetFormItems = () => {
        const { shopIDList } = baseFormItems;
        return {
            ...baseFormItems,
            shopIDList: {
                ...shopIDList,
                render: (d) =>
                    d()(
                        <ShopSelector
                            filterParm={
                                isFilterShopType("95")
                                    ? { productCode: "HLL_CRM_License" }
                                    : {}
                            }
                            // canUseShops={canUseShops}
                            // disabled={canUseShops.length <= 0}
                            onChange={this.editBoxForShopsChange}
                        />
                    ),
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
                    onChange={this.onChangeBasicForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default BasicInfoForm;
