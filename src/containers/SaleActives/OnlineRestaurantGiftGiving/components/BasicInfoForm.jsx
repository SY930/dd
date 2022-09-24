import React, { PureComponent as Component } from "react";
import moment from "moment";
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
} from "../AxiosFactory";

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: baseFormKeys,
            cardInfo: [],
            cardTypeLst: [], //全部的卡类
            excludeEvent: [], //显示交叉的活动,
            excludeCardTypeIDs: [],
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
        // getExcludeCardLevelIds(params).then((res) => {
        //     if (res.code == "000") {
        //         this.setState({
        //             excludeEvent: res.excludeEventCardLevelIdModelList,
        //         });
        //     }
        // });
        getEventExcludeCardTypes(params).then(({ excludeCardTypeIDs = [] }) => {
            this.setState({
                excludeCardTypeIDs,
            });
        });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.cardTypeLst !== nextProps.cardTypeLst) {
            const cardTypeLst = nextProps.cardTypeLst;
            this.setState({
                cardTypeLst: cardTypeLst.filter((cardType) => {
                    return cardType.regFromLimit;
                }),
            });
        }
        if (this.props.eventRange !== nextProps.eventRange) {
            const { eventStartDate, eventEndDate } = nextProps.eventRange;
            const params = {
                groupID: nextProps.accountInfo.groupID,
                eventWay: "23",
                eventStartDate,
                eventEndDate,
            };
            this.getExcludeData(params);
        }
    }

    handleSelectChange = (value) => {
        const { basicForm } = this.props;
        basicForm && basicForm.setFieldsValue({ shopIDList: [] });
    };

    onChangeBasicForm = (key, value) => {};

    resetFormItems = () => {
        const { shopIDList, cardTypeIDList, defaultCardType } = baseFormItems;
        let { cardInfo, excludeCardTypeIDs, cardTypeLst } = this.state;
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
            defaultCardType: {
                ...defaultCardType,
                render: (d, form) => {
                    return form.getFieldValue("partInUser") == 1 ||
                        form.getFieldValue("partInUser") == 2
                        ? d()(
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
                }
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
