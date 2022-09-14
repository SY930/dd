import { Icon, Tooltip, Radio } from "antd";

const regOpts = [
    { label: "无需用户填写注册信息", value: "1" },
    { label: "用户需填写注册信息", value: "0" },
];

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
    triggerType: {
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
            { label: "弹窗时自动发放", value: "1" },
            { label: "弹框时用户手动领取", value: "2" },
        ],
        defaultValue: "1",
    },
    triggerScene: {
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
            { label: "堂食点餐页", value: "1" },
            { label: "外卖点餐页", value: "2" },
            { label: "自提点餐页", value: "3" },
        ],
        defaultValue: "1",
    },
    people: {
        type: "radio",
        label: "参与用户",
        options: [
            { label: "全部", value: "1" },
            { label: "非会员", value: "2" },
            { label: "会员", value: "3" },
        ],
        defaultValue: "1",
    },
    cardLevelRangeType: {
        type: "radio",
        label: "会员范围",
        options: [
            { label: "全部", value: "1" },
            { label: "按卡类别", value: "2" },
            { label: "按卡等级", value: "3" },
        ],
        defaultValue: "1",
    },
    cardTypeIDList: {
        type: "custom",
        label: "卡类别",
        render: () => <p />,
        defaultValue: [],
        rules: ["required"],
    },
    cardLevelIDList: {
        type: "custom",
        label: "卡等级",
        render: () => <p />,
        defaultValue: [],
        rules: ["required"],
    },
    autoRegister: {
        type: "radio",
        label: "参与成为会员",
        options: regOpts,
        defaultValue: "1",
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

export const baseFormKeys = [
    "eventType",
    "eventName",
    "triggerType",
    "triggerScene",
    "people",
    "shopIDList",
    "eventRemark",
];
