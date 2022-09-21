import React, { PureComponent as Component } from "react";
import moment from "moment";
import { uniq } from "lodash";
import BaseForm from "components/common/BaseForm";
import { Select, message, Form } from "antd";
import ShopSelector from "components/ShopSelector";
import BaseHualalaModal from "../../../SaleCenterNEW/common/BaseHualalaModal";
import { isFilterShopType } from "../../../../helpers/util";
import { baseFormItems, formItemLayout, baseFormKeys } from "../common";
import {
    fetchSpecialCardLevel,
    getExcludeCardLevelIds,
    getEventExcludeCardTypes,
    getListCardTypeShop,
} from "../AxiosFactory";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            cardInfo: [],
            cardTypeLst: [], //全部的卡类
            canUseShops: [], //所选卡类适用店铺id
            occupiedShops: [], //已经被占用的卡类适用店铺id
            excludeEvent: [], //显示交叉的活动,
            excludeCardTypeIDs: [],
            excludeCardTypeShops: [],
            cardLevelIDList: [], //选择的卡类别
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
        const params = {
            groupID: accountInfo.groupID,
            eventWay: "23",
            eventStartDate: moment().format("YYYYMMDD"),
            eventEndDate: moment().add(6, "days").format("YYYYMMDD"),
        };
        this.getExcludeData(params);
    }

    getExcludeData = (params) => {
        getExcludeCardLevelIds(params).then((res) => {
            if (res.code == "000") {
                this.setState({
                    excludeEvent: res.excludeEventCardLevelIdModelList,
                });
            }
        });
        getEventExcludeCardTypes(params).then(
            ({ excludeCardTypeIDs = [], excludeCardTypeShops = [] }) => {
                let occupiedShops = [];
                if (excludeCardTypeShops.length) {
                    occupiedShops = excludeCardTypeShops.reduce((acc, curr) => {
                        acc.push(
                            ...(curr.shopIDList || []).map((id) => `${id}`)
                        ); // 把shopID转成string, 因为基本档返回的是string
                        return acc;
                    }, []);
                }
                this.setState({
                    excludeCardTypeIDs,
                    excludeCardTypeShops,
                    occupiedShops,
                });
            }
        );
    };

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
    }

    queryCanuseShops = (cardTypeIDs) => {
        let { cardInfo, excludeCardTypeIDs, cardTypeLst } = this.state;
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
            if (cardLevelRangeType == "3") {
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
            if (excludeCardTypeIDs.length) {
                cardInfo = cardInfo.filter(
                    (cardType) =>
                        !excludeCardTypeIDs.includes(cardType.cardTypeID)
                );
            }
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

    handleSelectChange = (value) => {
        this.queryCanuseShops(value);
        this.setState({
            cardLevelIDList: value,
            canUseShops: [],
        });
        this.props.onChange &&
            this.props.onChange({ cardLevelIDList: value, shopIDList: [] });
    };

    onChangeBasicForm = (key, value) => {
        const { basicForm } = this.props;
        if (!basicForm) {
            return;
        }
        const values = basicForm.getFieldsValue();
        let formKeys = [...this.state.formKeys];
        //发券方式
        if (key == "giftSendType") {
            //用户手动领取&&全部或非会员
            if (value == 2) {
                if (values.partInUser == 1 || values.partInUser == 2) {
                    formKeys.splice(5, 0, "autoRegister");
                } else {
                    formKeys = formKeys.filter(
                        (item) => item != "autoRegister"
                    );
                }
            } else {
                formKeys = formKeys.filter((item) => item != "autoRegister");
            }
            //参与用户
        } else if (key == "partInUser") {
            if (value == 1 || value == 2) {
                formKeys = formKeys.filter(
                    (item) =>
                        item != "autoRegister" && item != "cardLevelRangeType"
                );
                if (values.giftSendType == 2) {
                    formKeys.splice(5, 0, "autoRegister");
                }
            } else {
                formKeys = formKeys.filter((item) => item != "autoRegister");
                formKeys.splice(5, 0, "cardLevelRangeType");
            }
            //会员范围
        } else if (key == "cardLevelRangeType") {
            if (value == 2) {
                formKeys = formKeys.filter((item) => item != "cardLevelIDList");
                formKeys.splice(6, 0, "cardTypeIDList");
            } else if (value == 5) {
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
        const { basicForm = {} } = this.props;
        let {
            cardInfo,
            canUseShops = [],
            occupiedShops = [],
            excludeCardTypeIDs,
            cardTypeLst,
        } = this.state;
        const finalCanUseShops = canUseShops.filter(
            (shopID) => !occupiedShops.includes(shopID)
        );
        cardInfo = cardInfo.filter(
            (item) =>
                cardTypeLst.findIndex(
                    (cardType) => cardType.cardTypeID === item.cardTypeID
                ) > -1
        );
        if (excludeCardTypeIDs.length) {
            cardInfo = cardInfo.filter(
                (cardType) => !excludeCardTypeIDs.includes(cardType.cardTypeID)
            );
        }
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
                            onChange={this.editBoxForShopsChange}
                            canUseShops={finalCanUseShops}
                            disabled={finalCanUseShops.length <= 0}
                        />
                    ),
            },
            cardTypeIDList:
                basicForm && basicForm.getFieldDecorator
                    ? {
                          ...cardTypeIDList,
                          render: (d) => (
                              <Form.Item
                                  style={{ padding: 0, paddingBottom: 25 }}
                              >
                                  {basicForm.getFieldDecorator(
                                      "cardTypeIDList",
                                      {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: "卡类别不能为空",
                                              },
                                          ],
                                      }
                                  )(
                                      <Select
                                          multiple={true}
                                          showSearch={true}
                                          notFoundContent="未搜索到结果"
                                          onChange={this.handleSelectChange}
                                          filterOption={(input, option) =>
                                              option.props.children
                                                  .toLowerCase()
                                                  .indexOf(
                                                      input.toLowerCase()
                                                  ) >= 0
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
                          ),
                      }
                    : {},
            cardLevelIDList:
                basicForm && basicForm.getFieldDecorator
                    ? {
                          ...cardLevelIDList,
                          render: (d) => (
                              <Form.Item
                                  style={{ padding: 0, paddingBottom: 25 }}
                              >
                                  {basicForm.getFieldDecorator(
                                      "cardLevelIDList",
                                      {
                                          rules: [
                                              {
                                                  required: true,
                                                  message: "卡等级不能为空",
                                              },
                                          ],
                                      }
                                  )(
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
                                              this.handleSelectChange(_value);
                                          }}
                                      />
                                  )}
                              </Form.Item>
                          ),
                      }
                    : {},
        };
    };
    render() {
        const { formData, getForm } = this.props;
        const { formKeys } = this.state;
        return (
            <div style={{ maxWidth: 800, marginBottom: 16 }}>
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
