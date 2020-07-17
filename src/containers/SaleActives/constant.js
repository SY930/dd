// 活动标题和说明
import PayHaveGift from "./PayHaveGift/index";

export const actInfoList = [
    {
        title: "微信支付有礼",
        key: "80",
        dsc:
            "微信支付成功页投放微信支付商家券，引导用户领券，提升复购。（一个集团在同一时间段内只能创建一个活动）",
        render(props = {}) {
            return <PayHaveGift {...props} />;
        },
    },
];

export const giftTypeName = [
    { label: "全部", value: "" },
    { label: "代金券", value: "10" },
    { label: "菜品优惠券", value: "20" },
    { label: "菜品兑换券", value: "21" },
    { label: "实物礼品券", value: "30" },
    { label: "会员充值券", value: "40" },
    { label: "会员积分券", value: "42" },
    { label: "会员权益券", value: "80" },
    { label: "礼品定额卡", value: "90" },
    { label: "线上礼品卡", value: "91" },
    { label: "买赠券", value: "110" },
    { label: "折扣券", value: "111" },
    { label: "现金红包", value: "113" },
    { label: "配送券", value: "22" },
];
