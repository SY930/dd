import React, { PureComponent as Component } from "react";
import { connect } from "react-redux";
import BaseForm from "components/common/BaseForm";
import { Select } from "antd";
import ShopSelector from "components/ShopSelector";
import BaseHualalaModal from "../../../SaleCenterNEW/common/BaseHualalaModal";
import { isFilterShopType } from "../../../../helpers/util";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";
import { fetchSpecialCardLevel } from "../AxiosFactory";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            cardInfo: [],
        };
    }

    componentDidMount() {
        const { accountInfo } = this.props;
        const params = {
            _groupID: accountInfo.groupID,
            _role: accountInfo.roleType,
            _loginName: accountInfo.loginName,
            _groupLoginName: accountInfo.groupLoginName,
        };
        fetchSpecialCardLevel(params).then((res) => {
            this.setState({ cardInfo: res });
        });
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
        const { shopIDList, cardTypeIDList, cardLevelIDList } = baseFormItems;
        const { cardInfo } = this.state;
        const boxData = [];
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
            cardTypeIDList: {
                ...cardTypeIDList,
                render: (d) =>
                    d()(
                        <Select
                            multiple={true}
                            showSearch={true}
                            notFoundContent="未搜索到结果"
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {cardInfo.map((type) => (
                                <Select.Option
                                    key={type.cardTypeID}
                                    value={type.cardTypeID}
                                >
                                    {type.cardTypeName}
                                </Select.Option>
                            ))}
                        </Select>
                    ),
            },
            cardLevelIDList: {
                ...cardLevelIDList,
                render: (d) =>
                    d()(
                        <BaseHualalaModal
                            outLabel="卡等级" //外侧选项+号下方文案
                            outItemName="cardLevelName" //外侧已选条目选项的label
                            outItemID="cardLevelID" //外侧已选条目选项的value
                            innerleftTitle="全部卡类" //   内部左侧分类title
                            innerleftLabelKey={"cardTypeName"} //   内部左侧分类对象的哪个属性为分类label
                            leftToRightKey={"cardTypeLevelList"} // 点击左侧分类，的何种属性展开到右侧
                            innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                            innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                            innerBottomTitle="已选卡等级" //   内部底部box的title
                            innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                            itemNameJoinCatName="cardTypeName" // item条目展示名称拼接类别名称
                            treeData={cardInfo} // 树形全部数据源【{}，{}，{}】
                            data={boxData} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                            onChange={(value) => {
                                // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                const _value = value.map(
                                    (level) => level.cardLevelID
                                );
                                console.log(_value);
                            }}
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
