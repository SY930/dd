import { Icon, Tooltip, Radio, Input, Form, Select } from "antd";
import moment from "moment";
import DateRange from "../../PromotionV3/Camp/DateRange";
import Advance from "../../PromotionV3/Camp/Advance";
import DateTag from "../../PromotionV3/Camp/DateTag";
import TimeRange from "../../PromotionV3/Camp/TimeRange";

export const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
};
export const baseFormItems = {
    eventType: {
        type: "custom",
        label: "活动类型",
        render: () => <p>限时秒杀</p>,
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
    shopIDList: {
        type: "custom",
        label: (
            <span>
                适用店铺
                <Tooltip
                    overlayStyle={{ maxWidth: "300px" }}
                    title={
                        <div>
                            <div>1、不选则默认全部店铺都能参与活动</div>
                            <div>
                                2、如选择指定会员卡类别或卡等级参与活动，则只能选择会员卡类别或卡等级范围内的适用店铺
                            </div>
                        </div>
                    }
                >
                    <Icon style={{ marginLeft: 5 }} type="question-circle-o" />
                </Tooltip>
            </span>
        ),
        render: () => <p />,
        defaultValue: [],
        // rules: ["required"],
    },
    eventRemark: {
        type: "textarea",
        label: "活动说明",
        placeholder: "请输入活动说明，最多1000个字符",
        rules: ["description2", { max: "1000", message: "不能超过1000个字符" }],
    },
};

export const ruleFormItem = {
    couponType: {
        type: "custom",
        label: "优惠券",
        render: (d) =>
            d()(
                <Radio.Group>
                    <Radio.Button value="0">哗啦啦优惠券</Radio.Button>
                    <Radio.Button value="1">第三方微信优惠券</Radio.Button>
                </Radio.Group>
            ),
        defaultValue: "0",
    },
    gifts: {
        type: "custom",
        label: "券包内容",
        wrapperCol: { span: 19 },
        labelCol: { span: 5 },
        render: () => <p />,
    },
    eventRange: {
        type: "custom",
        label: "活动起止日期",
        rules: ["required"],
        wrapperCol: { span: 12 },
        labelCol: { span: 5 },
        defaultValue: [moment(), moment().add(6, "days")],
        render: (d) => d()(<DateRange type={"85"} />),
    },
    // joinType: {
    //     type: "radio",
    //     label: "参与次数",
    //     options: [
    //         { label: "不限次数", value: "0" },
    //         { label: "限制次数", value: "1" },
    //         { label: "限制参与次数的周期", value: "2" },
    //     ],
    //     defaultValue: "0",
    // },
    // partInTimes: {
    //     type: "custom",
    //     label: " ",
    //     wrapperCol: { span: 8 },
    //     labelCol: { span: 5 },
    //     rules: [
    //         "required",
    //         {
    //             pattern: /^([1-9]\d{0,})$/,
    //             message: "请输入正整数",
    //         },
    //     ],
    //     render: (d, form) => {
    //         return form.getFieldValue("joinType") == 1
    //             ? d()(
    //                   <Input
    //                       placeholder="请输入次数"
    //                       addonBefore="可参与"
    //                       addonAfter="次"
    //                   />
    //               )
    //             : null;
    //     },
    // },
    // countCycleDays: {
    //     type: "custom",
    //     label: " ",
    //     wrapperCol: { span: 15 },
    //     labelCol: { span: 5 },
    //     render: (d, form) => {
    //         return form.getFieldValue("joinType") == 2 ? (
    //             <div style={{ display: "flex", width: 400 }}>
    //                 <Form.Item style={{ padding: 0 }}>
    //                     {d({
    //                         key: "countCycleDays",
    //                         rules: [
    //                             "required",
    //                             {
    //                                 pattern: /^([1-9]\d{0,})$/,
    //                                 message: "请输入正整数",
    //                             },
    //                         ],
    //                     })(
    //                         <Input
    //                             placeholder="请输入天数"
    //                             addonBefore="同一用户"
    //                             addonAfter="天，可参与"
    //                         />
    //                     )}
    //                 </Form.Item>
    //                 <Form.Item style={{ padding: 0 }}>
    //                     {d({
    //                         key: "partInTimes1",
    //                         rules: [
    //                             "required",
    //                             {
    //                                 pattern: /^([1-9]\d{0,})$/,
    //                                 message: "请输入正整数",
    //                             },
    //                         ],
    //                     })(<Input placeholder="请输入次数" addonAfter="次" />)}
    //                 </Form.Item>
    //             </div>
    //         ) : null;
    //     },
    // },
    // smsGate: {
    //     type: "combo",
    //     label: "是否发送消息",
    //     options: [
    //         { label: "不发送", value: 0 },
    //         { label: "仅发送短信", value: 1 },
    //         { label: "仅推送微信", value: 2 },
    //         { label: "同时发送短信和微信", value: 4 },
    //         { label: "微信推送不成功则发送短信", value: 3 },
    //     ],
    //     style: { width: 300 },
    //     defaultValue: 0,
    // },
    
    // advMore: {
    //     type: "custom",
    //     render: (d) => d()(<Advance text={true} />),
    //     wrapperCol: { span: 22 },
    // },
    // cycleType: {
    //     type: "combo",
    //     label: "选择周期",
    //     options: [
    //         { label: "每日", value: "" },
    //         { label: "每周", value: "w" },
    //         { label: "每月", value: "m" },
    //     ],
    //     defaultValue: "",
    // },
    // timeList: {
    //     type: "custom",
    //     label: "活动时段",
    //     render: (d) => d()(<TimeRange type="85" />),
    //     defaultValue: [{ id: "0" }],
    // },
    // validCycle: {
    //     type: "custom",
    //     label: "每逢",
    //     render: () => <p></p>,
    //     defaultValue: ["w1", "m1"],
    // },
    // excludedDate: {
    //     type: "custom",
    //     label: "活动排除日期",
    //     render: (d) => d()(<DateTag limit={true} />),
    //     defaultValue: [],
    // },
}

// const KEY3 = ["timeList", "cycleType"];
// const KEY4 = ["validCycle"];
// const KEY5 = ["excludedDate"];
const ruleFormKeys = [
    "eventRange",
    "gifts",
    // "joinType",
    // "partInTimes",
    // "countCycleDays",
    // "smsGate",
    // "advMore",
];

export { ruleFormKeys };
export const baseFormKeys = [
    "eventType",
    "eventName",
    "shopIDList",
    "eventRemark",
];
