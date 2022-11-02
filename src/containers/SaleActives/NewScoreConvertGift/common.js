import { Icon, Tooltip, Radio, Input, Form, Select } from "antd";
import moment from "moment";
import DateRange from "../../PromotionV3/Camp/DateRange";

export const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
};
export const baseFormItems = {
    eventType: {
        type: "custom",
        label: "活动类型",
        render: () => <p>积分换礼</p>,
        defaultValue: "23",
    },
    eventName: {
        type: "text",
        label: "活动名称",
        rules: [
            "required",
            "stringLength",
            { max: "50", message: "不能超过50个字符" },
        ],
    },
    eventCode: {
        type: "text",
        label: "活动编码",
        rules: [
            "required",
            {
                message: "字母、数字组成，不多于50个字符",
                pattern: /^[A-Za-z0-9]{1,50}$/,
            },
        ],
    },
    smsGate: {
        type: "combo",
        label: "是否发送消息",
        options: [
            { label: "不发送", value: 0 },
            { label: "仅发送短信", value: 1 },
            { label: "仅推送微信", value: 2 },
            { label: "同时发送短信和微信", value: 4 },
            { label: "微信推送不成功则发送短信", value: 3 },
        ],
        style: { width: 300 },
        defaultValue: 0,
    },
    eventRange: {
        type: "custom",
        label: "活动起止日期",
        rules: ["required"],
        wrapperCol: { span: 15 },
        labelCol: { span: 5 },
        defaultValue: [moment(), moment().add(6, "days")],
        render: (d) => d()(<DateRange type={"85"} />),
    },
    eventRemark: {
        type: "textarea",
        label: "活动说明",
        placeholder: "请输入活动说明，最多1000个字符",
        rules: ["description2", "required", { max: "1000", message: "不能超过1000个字符" }],
    },
};

export const ruleFormItem = {
    joinType: {
        type: "radio",
        label: "参与次数",
        options: [
            { label: "不限次数", value: "0" },
            { label: "限制次数", value: "1" },
            { label: "限制参与次数的周期", value: "2" },
        ],
        defaultValue: "0",
    },
    partInTimes: {
        type: "custom",
        label: " ",
        wrapperCol: { span: 8 },
        labelCol: { span: 5 },
        rules: [
            "required",
            {
                pattern: /^([1-9]\d{0,})$/,
                message: "请输入正整数",
            },
        ],
        render: (d, form) => {
            return form.getFieldValue("joinType") == 1
                ? d()(
                      <Input
                          placeholder="请输入次数"
                          addonBefore="可参与"
                          addonAfter="次"
                      />
                  )
                : null;
        },
    },
    countCycleDays: {
        type: "custom",
        label: " ",
        wrapperCol: { span: 15 },
        labelCol: { span: 5 },
        render: (d, form) => {
            return form.getFieldValue("joinType") == 2 ? (
                <div style={{ display: "flex", width: 400 }}>
                    <Form.Item style={{ padding: 0 }}>
                        {d({
                            key: "countCycleDays",
                            rules: [
                                "required",
                                {
                                    pattern: /^([1-9]\d{0,})$/,
                                    message: "请输入正整数",
                                },
                            ],
                        })(
                            <Input
                                placeholder="请输入天数"
                                addonBefore="同一用户"
                                addonAfter="天，可参与"
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ padding: 0 }}>
                        {d({
                            key: "partInTimes1",
                            rules: [
                                "required",
                                {
                                    pattern: /^([1-9]\d{0,})$/,
                                    message: "请输入正整数",
                                },
                            ],
                        })(<Input placeholder="请输入次数" addonAfter="次" />)}
                    </Form.Item>
                </div>
            ) : null;
        },
    },
    memberRange: {
        type: "custom",
        wrapperCol: { span: 18 },
        labelCol: { span: 2 },
        label: " ",
        render: (d) => {},
        defaultValue: "",
    },
    orgs: {
        type: "custom",
        wrapperCol: { span: 18 },
        labelCol: { span: 2 },
        label: " ",
        render: (d) => {},
        defaultValue: [],
    },
    exchangeType: {
        type: "radio",
        label: "兑换类型",
        options: [
            { label: "商品", value: "0" },
            { label: "优惠券", value: "1" },
        ],
        defaultValue: "0",
    },
    goods: {
        type: "custom",
        label: " ",
        wrapperCol: { span: 21 },
        labelCol: { span: 3 },
        render: () => {},
    },
    coupon: {
        type: "custom",
        label: " ",
        wrapperCol: { span: 21 },
        labelCol: { span: 3 },
        render: () => {},
    },
};

export const approvalFormItems = {
    approval: {
        type: "custom",
        wrapperCol: { span: 18 },
        labelCol: { span: 2 },
        label: " ",
        render: (d) => {},
        defaultValue: "",
    },
};

const KEY6 = [
    "joinType",
    "partInTimes",
    "countCycleDays",
    "memberRange",
    "orgs",
    "exchangeType",
    "goods",
    "coupon",
];
const formKeys32 = [...KEY6];

export { formKeys32, KEY6 };

export const baseFormKeys = [
    "eventType",
    "eventName",
    "eventCode",
    "smsGate",
    "eventRange",
    "eventRemark",
];

export const approvalFormKeys = [
    "approval",
];
