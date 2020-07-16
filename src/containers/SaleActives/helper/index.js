export const getDefaultGiftData = (
    typeValue = 0,
    typePropertyName = "sendType"
) => ({
    // 膨胀所需人数
    needCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: "success",
        msg: null,
    },
    effectType: "1",
    // 礼品生效时间
    giftEffectiveTime: {
        value: "0",
        validateStatus: "success",
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    giftOdds: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    [typePropertyName]: typeValue,
});
