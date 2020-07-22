import React from "react";
import { Tooltip, Icon, Select } from "antd";
import styles from "./payHaveGift.less";
import { PriceInput, ImageUpload } from "../../../components/common/index";
import { AddGift, ColorSetting } from "../components/index";

const Option = Select.Option;

export const formItems1 = {
    actType: {
        type: "custom",
        label: "活动类型",
        render() {
            return <div>微信支付有礼</div>;
        },
    },
    eventName: {
        type: "text",
        label: "活动名称",
        // placeholder: "请输入活动名称",
        rules: [{ required: true, message: "活动姓名不能为空" }],
    },
    merchantLogoUrl: {
        type: "custom",
        label: "品牌LOGO",
        render(d) {
            return (
                <div className={styles.imgUploadWrap}>
                    {d({})(
                        <ImageUpload
                            limitSize={1000000}
                            limitType="png,jpg,jpeg"
                            getFileName
                        />
                    )}
                    <p className={styles.textWrap}>
                        ·尺寸要求 120*120像素
                        <br />
                        ·不大于1000kb
                        <br />
                        ·支持png、jpg
                    </p>
                </div>
            );
        },
    },
    eventRemark: {
        type: "custom",
        label: "活动说明",
        placeholder: "请输入活动说明，至多1000字",
    },
};

export const formKeys1 = [
    "actType",
    "eventName",
    "merchantLogoUrl",
    "eventRemark",
];

export const imgUrl = "http://res.hualala.com";

export const formItems2 = {
    consumeTotalAmount: {
        type: "custom",
        label: "参与限制",
        render(d) {
            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "174px", marginRight: "8px" }}>
                        {d()(
                            <PriceInput
                                addonAfter={"元"}
                                modal="float"
                                maxNum={7}
                                placeholder="请输入金额"
                            />
                        )}
                    </div>

                    <div>可参与活动</div>
                </div>
            );
        },
    },
    mySendGift: {
        type: "custom",
        label: "投放礼品",
        render(d) {
            return (
                <div>
                    {d({
                        rules: [
                            {
                                required: true,
                                message: "请选择投放礼品",
                            },
                        ],
                    })(<AddGift dispatch={this.props.dispatch} />)}
                </div>
            );
        },
    },
    originalImageUrl: {
        type: "custom",
        label: "礼品图片",
        render(d) {
            return (
                <div className={styles.imgUploadWrap}>
                    {d({})(
                        <ImageUpload
                            limitSize={1000000}
                            limitType="png,jpg,jpeg"
                            getFileName
                        />
                    )}
                    <p className={styles.textWrap}>
                        ·尺寸要求 678*232像素
                        <br />
                        ·不大于1000kb
                        <br />
                        ·支持png、jpg
                    </p>
                </div>
            );
        },
    },
    backgroundColor: {
        type: "custom",
        label: "背景颜色",
        render(d) {
            return d({})(<ColorSetting />);
        },
    },
    afterPayJumpType: {
        type: "custom",
        label: "跳转路径",
        render(d) {
            const { formData } = this.props.createActiveCom;
            return (
                <div style={{ display: "flex" }}>
                    {d({})(
                        <Select style={{ width: "272px" }}>
                            <Option value="3" key="3">
                                微信支付
                            </Option>
                            <Option value="4" key="4">
                                微信小程序
                            </Option>
                        </Select>
                    )}
                    <div style={{ marginLeft: "4px" }}>
                        <Tooltip
                            title={
                                formData.afterPayJumpType === "3"
                                    ? "投放日期必须在券有效期范围内，且投放周期不能超过90天"
                                    : "用户点击立即使用可直接跳转至小程序支付"
                            }
                        >
                            <Icon
                                style={{ fontSize: "16px" }}
                                type="question-circle"
                            />
                        </Tooltip>
                    </div>
                </div>
            );
        },
    },
    miniProgramInfo: {
        type: "combo",
        label: "小程序名称",
        options: [],
    },
    eventDate: {
        type: "custom",
        label: "投放日期",
    },
};

export const formKeys2 = [
    "consumeTotalAmount",
    "mySendGift",
    "originalImageUrl",
    "backgroundColor",
    "afterPayJumpType",
    // "miniProgramInfo",
    "eventDate",
];
