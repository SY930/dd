// 活动标题和说明
import PayHaveGift from "./PayHaveGift/index";

export const actInfoList = [
    {
        title: "微信支付有礼",
        key: "79",
        dsc:
            "微信支付成功页投放微信支付商家券，引导用户领券，提升复购。（一个集团在同一时间段内只能创建一个活动）",
        render(props = {}) {
            return <PayHaveGift {...props} />;
        },
    },
];
