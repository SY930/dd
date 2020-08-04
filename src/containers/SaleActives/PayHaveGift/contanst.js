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
        rules: [
            { required: true, message: "活动名称不能为空" },
            { max: 9, message: "最多输入9位" },
        ],
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
                        {d({
                            rules: [
                                {
                                    validator: (rule, v = {}, cb) => {
                                        if (
                                            v.number === "" ||
                                            v.number === undefined
                                        ) {
                                            return cb(undefined);
                                        }
                                        if (v.number < 0.01) {
                                            return cb(
                                                "请输入大于0，整数5位以内且小数2位以内的数值"
                                            );
                                        } else if (v.number >= 100000) {
                                            return cb(
                                                "请输入大于0，整数5位以内且小数2位以内的数值"
                                            );
                                        }
                                        cb();
                                    },
                                },
                                { required: true, message: "参与限制不能为空" },
                            ],
                        })(
                            <PriceInput
                                addonAfter={"元"}
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
    },
    miniProgramInfo: {
        type: "combo",
        label: "小程序名称",
        options: [],
        rules: [{ required: true, message: "小程序名称不能为空" }],
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
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
