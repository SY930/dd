import React from "react";
import { Input } from "antd";
import ImageUpload from "../../../components/common/ImageUpload";
import styles from "./payHaveGift.less";

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
        render(d) {
            const { formData } = this.props.createActiveCom;
            return (
                <div className={styles.textAreaWrap}>
                    {d({})(
                        <Input
                            placeholder="请输入活动说明，至多1000字"
                            type="textarea"
                            maxLength={1000}
                            style={{ height: "117px" }}
                        />
                    )}
                    <div className={styles.textNumCount}>
                        {formData.eventRemark ? formData.eventRemark.length : 0}
                        /1000
                    </div>
                </div>
            );
        },
    },
};

export const formKeys1 = [
    "actType",
    "eventName",
    "merchantLogoUrl",
    "eventRemark",
];

export const imgUrl = "http://res.hualala.com/";
