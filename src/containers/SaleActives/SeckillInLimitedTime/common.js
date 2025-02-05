import { Icon, Tooltip, Radio, Input, Form, Select } from "antd";
import moment from "moment";
import DateRange from "../../PromotionV3/Camp/DateRange";
import CategoryFormItem from "containers/GiftNew/GiftAdd/CategoryFormItem";

export const baseFormItems = {
    eventType: {
        type: "custom",
        label: "活动类型",
        render: () => <p>限时秒杀</p>,
        defaultValue: "95",
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
    },
    eventName: {
        type: "text",
        label: "活动名称",
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
        rules: [
            "required",
            "stringLength",
            { max: "50", message: "不能超过50个字符" },
        ],
    },
    eventCode: {
        type: "text",
        label: <span>活动编码 <Tooltip title='活动编码填写后不可修改'><Icon type="question-circle" style={{ marginLeft: 5 }} /></Tooltip></span>,
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
        rules: [
            {
                message: "字母、数字组成，不多于50个字符",
                pattern: /^[A-Za-z0-9]{1,50}$/,
            },
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
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
        // rules: ["required"],
    },
    eventRemark: {
        type: "textarea",
        label: "活动说明",
        placeholder: "请输入活动说明，最多1000个字符",
        rules: ["description2", { max: "1000", message: "不能超过1000个字符" }],
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
    },
    settleUnitID: {
        label: '券包结算主体',
        type: 'custom',
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
        defaultValue: '',
        rules: ['required'],
    },
    cardTypeID: {
        label: '新用户注册卡类',
        type: 'custom',
        wrapperCol: { span: 14 },
        labelCol: { span: 5 },
        defaultValue: '',
        rules: ['required'],
    },
    tagLst: {
        label: '标签',
        type: 'custom',
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
        render: (decorator, form) => {
            return (
                <div>
                    {
                        decorator({})(
                            <CategoryFormItem
                                decorator={decorator}
                                form={form}
                                key='category'
                                phraseType='2'
                            />
                        )
                    }
                </div>
            )
        }
    }
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
        label: "秒杀商品",
        wrapperCol: { span: 19 },
        labelCol: { span: 5 },
        render: () => <p />,
    },
    giftName: {
        type: "custom",
        label: "券包名称",
        render: () => <p />,
    },
    giftID: {
        type: "custom",
        label: "券包ID",
        rules: ["required",{ message:"请选择券包" }],
        render: (d, form) => {
            return d()(
                <Input
                    disabled
                />
            )
        },
    },
    giftTotalCount: {
        type: "custom",
        label: "活动库存",
        rules: [
            "required",
            {
                pattern: /^([1-9]\d{0,5})$/,
                message: "请输入1～999999数字",
            },
        ],
        render: (d, form) => {
            return d()(
                <Input
                    placeholder="请输入秒杀库存"
                />
            )
        },
    },
    eventRange: {
        type: "custom",
        label: "活动起止日期",
        rules: ["required"],
        wrapperCol: { span: 12 },
        labelCol: { span: 5 },
        render: (d) => d()(<DateRange type={"85"} />),
    },
    buyLimit: {
        type: "custom",
        label: "限购数量",
        rules: [
            {
                pattern: /^([1-9]\d{0,})$/,
                message: "请输入正整数",
            },
        ],
        render: (d, form) => {
            return d()(
                <Input
                    placeholder="请输入每人可限购数量，不填写表示不限制"
                    addonAfter="次"
                />
            )
        },
    },
    systermPassedTimeReturnMoney: {
        type: "radio",
        label: "系统过期自动退款",
        options: [
            { label: "支持", value: "0" },
            { label: "不支持", value: "1" },
        ],
        defaultValue: "0",
    },
    userSelfReturnMoney: {
        type: "radio",
        label: "用户自助退款",
        options: [
            { label: "支持", value: "0" },
            { label: "不支持", value: "1" },
        ],
        defaultValue: "0",
    },
    presentValue: {
        type: "custom",
        label: "原价",
        rules: [
            {
                pattern: /^([1-9]\d{0,})$/,
                message: "请输入正整数",
            },
        ],
        render: (d, form) => {
            return d()(
                <Input
                    placeholder="请输入原价"
                />
            )
        },
    },
    giftGetRuleValue: {
        type: "custom",
        label: "秒杀金额",
        rules: [
            "required",
            {
                pattern: /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/,//支持两位小数
                message: "请输入正整数",
            },
        ],
        render: (d, form) => {
            return d()(
                <Input
                    placeholder="请输入秒杀金额"
                />
            )
        },
    },
}

export const ruleFormKeys = ["eventRange","gifts"];
export const baseFormKeys = ["eventType","eventName","eventCode", 'tagLst', "shopIDList","settleUnitID","cardTypeID","eventRemark"];
export const giftRemainSettings = ["giftName","giftID","giftTotalCount","buyLimit","presentValue","giftGetRuleValue"];

