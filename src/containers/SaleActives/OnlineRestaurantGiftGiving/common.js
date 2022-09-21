import { Icon, Tooltip, Radio, Input, Form, Select } from "antd";
import moment from "moment";
import DateRange from "../../PromotionV3/Camp/DateRange";
import Advance from "../../PromotionV3/Camp/Advance";
import DateTag from "../../PromotionV3/Camp/DateTag";
import TimeRange from "../../PromotionV3/Camp/TimeRange";
import EveryDay from "../../PromotionV3/Camp/EveryDay";

export const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
};
export const baseFormItems = {
    eventType: {
        type: "custom",
        label: "活动类型",
        render: () => <p>线上餐厅弹窗送礼</p>,
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
    giftSendType: {
        type: "radio",
        label: (
            <span>
                发券方式
                <Tooltip title="弹窗自动发券时，如果用户为非会员将会静默将该用户注册成为会员">
                    <Icon style={{ marginLeft: 5 }} type="question-circle-o" />
                </Tooltip>
            </span>
        ),
        options: [
            { label: "弹窗时自动发放", value: 1 },
            { label: "弹框时用户手动领取", value: 2 },
        ],
        defaultValue: 1,
    },
    enterPosition: {
        type: "radio",
        label: (
            <span>
                发券位置
                <Tooltip title="若同一时间，同一发券位置也设置了弹窗类广告，则两者都弹出，先弹出优惠券再弹出广告">
                    <Icon style={{ marginLeft: 5 }} type="question-circle-o" />
                </Tooltip>
            </span>
        ),
        options: [
            { label: "堂食点餐页", value: 1 },
            { label: "外卖点餐页", value: 2 },
            { label: "自提点餐页", value: 3 },
        ],
        defaultValue: 1,
    },
    partInUser: {
        type: "radio",
        label: "参与用户",
        options: [
            { label: "全部", value: 1 },
            { label: "非会员", value: 2 },
            { label: "会员", value: 3 },
        ],
        defaultValue: 1,
    },
    cardLevelRangeType: {
        type: "custom",
        label: "",
        wrapperCol: { span: 24 },
        defaultValue: 0,
        render: (d, form) => {
            if (form.getFieldValue("partInUser") == 3) {
                return (
                    <Form.Item
                        label="会员范围"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        style={{ padding: 0 }}
                    >
                        {d({})(
                            <Radio.Group>
                                <Radio value={0}>全部</Radio>
                                <Radio value={2}>按卡类别</Radio>
                                <Radio value={5}>按卡等级</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                );
            }
            return null;
        },
    },
    cardTypeIDList: {
        type: "custom",
        wrapperCol: { span: 24 },
        render: () => <p />,
        defaultValue: [],
        rules: ["required"],
    },
    autoRegister: {
        type: "custom",
        wrapperCol: { span: 24 },
        label: "",
        defaultValue: 0,
        render: (d, form) => {
            if (
                (form.getFieldValue("partInUser") == 1 ||
                    form.getFieldValue("partInUser") == 2) &&
                form.getFieldValue("giftSendType") == 2
            ) {
                return (
                    <Form.Item
                        label="参与成为会员"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        style={{ padding: 0 }}
                    >
                        {d({})(
                            <Radio.Group>
                                <Radio value={1}>无需用户填写注册信息</Radio>
                                <Radio value={0}>用户需填写注册信息</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                );
            }
            return null;
        },
    },
    shopIDList: {
        type: "custom",
        label: "适用门店",
        render: () => <p />,
        defaultValue: [],
        rules: ["required"],
    },
    eventRemark: {
        type: "textarea",
        label: "活动说明",
        placeholder: "请输入活动说明，最多1000个字符",
        rules: ["stringLength", { max: "1000", message: "不能超过1000个字符" }],
    },
};

export const ruleFormItem = {
    couponValue: {
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
    joinCount: {
        type: "custom",
        label: "参与次数",
        render: (d, form) => (
            <div>
                <div>
                    {d({
                        key: "joinCount",
                        initialValue: "0",
                    })(
                        <Radio.Group>
                            <Radio value="0">不限次数</Radio>
                            <Radio value="1">限制次数</Radio>
                            <Radio value="2">限制参与次数的周期</Radio>
                        </Radio.Group>
                    )}
                </div>
                <div>
                    {form.getFieldValue("joinCount") == 1 ? (
                        <div style={{ width: 300, height: 40 }}>
                            <Form.Item>
                                {d({
                                    key: "partInTimes",
                                    rules: [
                                        "required",
                                        {
                                            pattern: /^([1-9]\d{0,})$/,
                                            message: "请输入正整数",
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入次数"
                                        addonBefore="可参与"
                                        addonAfter="次"
                                    />
                                )}
                            </Form.Item>
                        </div>
                    ) : form.getFieldValue("joinCount") == 2 ? (
                        <div
                            style={{ display: "flex", width: 400, height: 40 }}
                        >
                            <Form.Item>
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
                            <Form.Item>
                                {d({
                                    key: "partInTimes",
                                    rules: [
                                        "required",
                                        {
                                            pattern: /^([1-9]\d{0,})$/,
                                            message: "请输入正整数",
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder="请输入次数"
                                        addonAfter="次"
                                    />
                                )}
                            </Form.Item>
                        </div>
                    ) : null}
                </div>
            </div>
        ),
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
        wrapperCol: { span: 12 },
        labelCol: { span: 5 },
        defaultValue: [moment(), moment().add(6, "days")],
        render: (d) => d()(<DateRange type={"85"} />),
    },
    advMore: {
        type: "custom",
        render: (d) => d()(<Advance text={true} />),
        wrapperCol: { span: 22 },
    },
    cycleType: {
        type: "combo",
        label: "选择周期",
        options: [
            { label: "每日", value: "" },
            { label: "每周", value: "w" },
            { label: "每月", value: "m" },
        ],
        defaultValue: "",
    },
    timeList: {
        type: "custom",
        label: "活动时段",
        render: (d) => d()(<TimeRange type="85" />),
        defaultValue: [{ id: "0" }],
    },
    validCycle: {
        type: "custom",
        label: "每逢",
        render: (d, form) => {
            let { cycleType } = form.getFieldsValue();
            return d()(<EveryDay type={cycleType} />);
        },
        defaultValue: ["w1", "m1"],
    },
    excludedDate: {
        type: "custom",
        label: "活动排除日期",
        render: (d) => d()(<DateTag limit={true} />),
        defaultValue: [],
    },
};

export const baseFormKeys = [
    "eventType",
    "eventName",
    "giftSendType",
    "enterPosition",
    "partInUser",
    "autoRegister",
    "cardLevelRangeType",
    "cardTypeIDList",
    "shopIDList",
    "eventRemark",
];

export const ruleFormKeys = [
    "couponValue",
    "gifts",
    "joinCount",
    "smsGate",
    "eventRange",
    "advMore",
];
