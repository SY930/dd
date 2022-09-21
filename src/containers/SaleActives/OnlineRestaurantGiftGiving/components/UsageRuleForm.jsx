import React, { PureComponent as Component } from "react";
import { Icon, Button, Form, Input } from "antd";
import BaseForm from "components/common/BaseForm";
import { ruleFormItem, formItemLayout, ruleFormKeys } from "../common";
import WxCouponModal from "./WxCouponModal";
import SleectedWxCouponTable from "./SleectedWxCouponTable";
import AddGifts from "../AddGifts/AddGifts";

class UsageRuleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: ruleFormKeys,
            wxCouponVisible: false,
            sleectedWxCouponList: [], //选中的微信券
        };
    }

    onChangeRuleForm = (key, value) => {
        const { ruleForm } = this.props;
        if (!ruleForm) {
            return;
        }
        let formKeys = [...this.state.formKeys];
        //高级日期设置
        if (key === "advMore") {
            if (value) {
                formKeys.splice(6, 0, "timeList", "cycleType", "excludedDate");
            } else {
                formKeys.splice(6, 4);
            }
            //选择周期
        } else if (key === "cycleType") {
            //周月
            if (value) {
                formKeys = formKeys.filter((item) => item != "validCycle");
                formKeys.splice(8, 0, "validCycle");
                //日
            } else {
                formKeys.splice(6, 4);
                formKeys.splice(6, 0, "timeList", "cycleType", "excludedDate");
            }
        }
        this.setState({ formKeys });
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
        this.setState({ sleectedWxCouponList: rowSelected });
    };

    getForm = (formList) => {
        const { getGiftForm } = this.props;
        getGiftForm(formList);
    }

    resetFormItems = () => {
        const { gifts } = ruleFormItem;
        const { accountInfo, ruleForm = {}, getGiftForm } = this.props;
        return {
            ...ruleFormItem,
            gifts:
                ruleForm && ruleForm.getFieldDecorator
                    ? {
                          ...gifts,
                          render: (d, form) => (
                              <div>
                                  {form.getFieldValue("couponValue") == 1 ? (
                                      <div style={{ width: "100%" }}>
                                          <p>
                                              <Button
                                                  icon="plus"
                                                  onClick={this.addWXCoupon}
                                              >
                                                  添加第三方微信优惠券
                                              </Button>
                                          </p>
                                          <p
                                              style={{
                                                  height: 36,
                                                  paddingLeft: 13,
                                                  marginBottom: 4,
                                                  background: "#FFFBE6",
                                                  borderRadius: 4,
                                                  lineHeight: "36px",
                                                  color: "#666",
                                                  marginTop: "10px",
                                              }}
                                          >
                                              <Icon
                                                  type="exclamation-circle"
                                                  style={{
                                                      color: "#FAAD14",
                                                      marginRight: 10,
                                                  }}
                                              />
                                              <span>
                                                  第三方微信优惠券领取后，可同步微信卡包展示。
                                              </span>
                                          </p>
                                          <Form.Item
                                              label={"用户单次领取优惠券张数"}
                                              labelCol={{ span: 7 }}
                                              wrapperCol={{ span: 17 }}
                                          >
                                              {d({
                                                  key: "giftCount",
                                                  rules: [
                                                      "required",
                                                      {
                                                          pattern:
                                                              /^([1-9]|10)$/,
                                                          message:
                                                              "请输入为1-10的整数",
                                                      },
                                                  ],
                                              })(
                                                  <Input
                                                      placeholder={
                                                          "请输入1-9的整数"
                                                      }
                                                      type="number"
                                                  />
                                              )}
                                          </Form.Item>
                                          <SleectedWxCouponTable
                                              sleectedWxCouponList={
                                                  this.state
                                                      .sleectedWxCouponList
                                              }
                                              onWxCouponChange={
                                                  this.onWxCouponChange
                                              }
                                          />
                                          {this.state.wxCouponVisible && (
                                              <WxCouponModal
                                                  onCancel={
                                                      this.onWXCouponCancel
                                                  }
                                                  sleectedWxCouponList={
                                                      this.state
                                                          .sleectedWxCouponList
                                                  }
                                                  user={this.props.user}
                                                  onWxCouponChange={
                                                      this.onWxCouponChange
                                                  }
                                              />
                                          )}
                                      </div>
                                  ) : (
                                      <Form.Item>
                                          {form.getFieldDecorator(
                                              "gifts",
                                              {}
                                          )(
                                              <AddGifts
                                                  accountInfo={accountInfo}
                                                  getGiftForm={this.getForm}
                                              />
                                          )}
                                      </Form.Item>
                                  )}
                              </div>
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
                    onChange={this.onChangeRuleForm}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        );
    }
}

export default UsageRuleForm;
