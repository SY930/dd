import React, { PureComponent as Component } from "react";
import moment from "moment";
import { uniq } from "lodash";
import BaseForm from "components/common/BaseForm";
import { Select, message, Form } from "antd";
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
            cardInfo: [],
            cardTypeLst: [], //全部的卡类
            canUseShops: [], //所选卡类适用店铺id
            cardLevelIDList: [], //选择的卡类别
            excludeEvent: [], //显示交叉的活动,
            shopStatus: true,
        };
    }

    componentDidMount() {
        const { accountInfo } = this.props;
        fetchSpecialCardLevel({
            _groupID: accountInfo.groupID,
            _role: accountInfo.roleType,
            _loginName: accountInfo.loginName,
            _groupLoginName: accountInfo.groupLoginName,
        }).then((res) => {
            this.setState({ cardInfo: res });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.cardTypeLst !== nextProps.cardTypeLst) {
            const cardTypeLst = nextProps.cardTypeLst;
            this.setState(
                {
                    cardTypeLst: cardTypeLst.filter((cardType) => {
                        return cardType.regFromLimit;
                    }),
                },
                () => {
                    this.queryCanuseShops(this.state.cardLevelIDList);
                }
            );
        }
        if (this.props.formData != nextProps.formData) {
            if (nextProps.formData.cardLevelIDList) {
                this.setState({
                    cardLevelIDList: nextProps.formData.cardLevelIDList || [],
                });
            }
        }
    }

    handleSelectChange = (value) => {
        const { basicForm } = this.props;
        this.queryCanuseShops(value);
        this.setState({
            cardLevelIDList: value,
            canUseShops: [],
        });
        basicForm && basicForm.setFieldsValue({ shopIDList: [] });
    };

    queryCanuseShops = (cardTypeIDs) => {
        let { cardInfo, cardTypeLst } = this.state;
        cardInfo = cardInfo.filter(
            (item) =>
                cardTypeLst.findIndex(
                    (cardType) => cardType.cardTypeID === item.cardTypeID
                ) > -1
        );
        const { basicForm, accountInfo } = this.props;
        let questArr = [];
        if (cardTypeIDs && cardTypeIDs.length) {
            const { cardLevelRangeType } =
                basicForm && basicForm.getFieldsValue();
            if (cardLevelRangeType == "5") {
                // 卡等级
                cardTypeIDs.forEach((id) => {
                    const index = cardInfo.findIndex((cardType) => {
                        return (cardType.cardTypeLevelList || [])
                            .map((cardLevel) => cardLevel.cardLevelID)
                            .includes(id);
                    });
                    if (index > -1) {
                        questArr.push(cardInfo[index].cardTypeID);
                    }
                });
            } else {
                // 卡类
                questArr = cardTypeIDs;
            }
        } else {
            // 没选的情况下, 查所有能选的卡类下的适用店铺
            questArr = cardInfo.map((cardType) => cardType.cardTypeID);
        }
        if (!questArr.length) {
            return;
        }
        getListCardTypeShop({
            groupID: accountInfo.groupID,
            cardTypeIds: uniq(questArr).join(","),
            queryCardType: 1,
        }).then((res) => {
            let canUseShops = [];
            (res || []).forEach((cardType) => {
                cardType.cardTypeShopResDetailList.forEach((shop) => {
                    canUseShops.push(String(shop.shopID));
                });
            });
            canUseShops = Array.from(new Set(canUseShops));
            if (canUseShops.length <= 0) {
                message.warning("该卡类无适用的店铺，请选择其他卡类");
            }
            this.setState({ canUseShops });
        });
    };

    onChangeBasicForm = (key, value) => {};

    resetFormItems = () => {
        const { shopIDList, cardTypeIDList, defaultCardType } = baseFormItems;
        let { cardInfo, canUseShops = [], cardTypeLst } = this.state;
        cardInfo = cardInfo.filter(
            (item) =>
                cardTypeLst.findIndex(
                    (cardType) => cardType.cardTypeID === item.cardTypeID
                ) > -1
        );
        const boxData = [];
        this.state.cardLevelIDList.forEach((id) => {
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.push(level);
                    }
                });
            });
        });
        return {
            ...baseFormItems,
            defaultCardType: {
                ...defaultCardType,
                render: (d, form) => {
                    return form.getFieldValue("partInUser") == 1 ||
                        form.getFieldValue("partInUser") == 2
                        ? d({
                              onChange: (e) => this.handleSelectChange([e]),
                          })(
                              <Select
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
                          )
                        : null;
                },
            },
            shopIDList: {
                ...shopIDList,
                render: (d) =>
                    d()(
                        <ShopSelector
                            filterParm={
                                isFilterShopType("23")
                                    ? { productCode: "HLL_CRM_License" }
                                    : {}
                            }
                            canUseShops={canUseShops}
                            disabled={canUseShops.length <= 0}
                            onChange={this.editBoxForShopsChange}
                        />
                    ),
            },
            cardTypeIDList: {
                ...cardTypeIDList,
                render: (d, form) => {
                    if (form.getFieldValue("partInUser") != 3) {
                        return null;
                    }
                    if (form.getFieldValue("cardLevelRangeType") == 2) {
                        return (
                            <Form.Item
                                style={{ padding: 0, paddingBottom: 25 }}
                                label="卡类别"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {d({
                                    key: "cardTypeIDList",
                                    rules: [
                                        {
                                            required: true,
                                            message: "卡类别不能为空",
                                        },
                                    ],
                                    onChange: this.handleSelectChange,
                                })(
                                    <Select
                                        multiple={true}
                                        showSearch={true}
                                        notFoundContent="未搜索到结果"
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
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
                                )}
                            </Form.Item>
                        );
                    } else if (form.getFieldValue("cardLevelRangeType") == 5) {
                        return (
                            <Form.Item
                                style={{ padding: 0, paddingBottom: 25 }}
                                label="卡等级"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {d({
                                    key: "cardLevelIDList",
                                    rules: [
                                        {
                                            required: true,
                                            message: "卡等级不能为空",
                                        },
                                    ],
                                    onChange: (value) => {
                                        // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                        const _value = value.map(
                                            (level) => level.cardLevelID
                                        );
                                        this.handleSelectChange(_value);
                                    },
                                })(
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
                                    />
                                )}
                            </Form.Item>
                        );
                    }
                    return null;
                },
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
