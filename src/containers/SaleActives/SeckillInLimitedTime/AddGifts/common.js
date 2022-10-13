const giftTypeName = [
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

export const proCouponData = (giftTypes) => {
    const _giftTypes = _.filter(giftTypes, (giftItem) => {
        if (
            giftItem.giftType == 10 ||
            giftItem.giftType == 20 ||
            giftItem.giftType == 21 ||
            giftItem.giftType == 30 ||
            giftItem.giftType == 40 ||
            giftItem.giftType == 42 ||
            giftItem.giftType == 80 ||
            giftItem.giftType == 110 ||
            giftItem.giftType == 111 ||
            giftItem.giftType == 22
        )
            return true;
        return false;
    });
    let treeData = [];
    const gifts = [];
    _giftTypes.map((gt, idx) => {
        const giftTypeItem =
            _.find(giftTypeName, { value: String(gt.giftType) }) || {};
        treeData.push({
            label: giftTypeItem.label || "--",
            key: gt.giftType,
            children: [],
        });
        gt.crmGifts.map((gift) => {
            treeData[idx].children.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
                key: gift.giftItemID,
                giftValue: gift.giftValue,
                giftType: gt.giftType,
            });
            gifts.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
            });
        });
    });
    return (treeData = _.sortBy(treeData, "key"));
};

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const timeOpts = (() => {
    const list = [{ label: "立即生效", value: "0" }];
    for (let i = 1; i < 25; i++) {
        list.push({ label: `${i}小时生效`, value: `${i}` });
    }
    return list;
})();
const dayOpts = (() => {
    const list = [];
    for (let i = 1; i < 31; i++) {
        list.push({ label: `${i}天后生效`, value: `${i}` });
    }
    let extraList = [
        { label: "40天后生效", value: "40" },
        { label: "50天后生效", value: "50" },
        { label: "60天后生效", value: "60" },
    ];
    return [...list, ...extraList];
})();

const formKeys1 = [
    "giftID",
    "giftIDNumber",
    "giftCount",
    "effectType",
    "countType",
    "giftEffectTimeHours",
    "giftValidUntilDayCount",
];
const formKeys2 = [
    "giftID",
    "giftIDNumber",
    "giftCount",
    "effectType",
    "rangeDate",
];
const formItems = {
    giftID: {
        type: "custom",
        label: "礼品名称",
        rules: ["required"],
        render: null,
    },
    giftIDNumber: {
        type: "text",
        label: "礼品ID",
        disabled: true,
        defaultValue: " ",
    },
    giftCount: {
        type: "text",
        label: "礼品数量",
        surfix: "个",
        rules: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (!/^\d+$/.test(value)) {
                        return callback("请输入数字");
                    }
                    if (+value < 1 || +value > 50) {
                        return callback("大于0，限制50个");
                    }
                    return callback();
                },
            },
        ],
        defaultValue: "1",
    },
    effectType: {
        type: "radio",
        label: "生效方式",
        defaultValue: 1,
        options: [
            { label: "相对有效期", value: 1 },
            { label: "固定有效期", value: 2 },
        ],
    },
    countType: {
        // 接口定义有坑，选择相对有效期按小时的时候，对应的是effectType值为3
        type: "radio",
        label: "相对有效期",
        defaultValue: "0",
        options: [
            { label: "按小时", value: "0" },
            { label: "按天", value: "1" },
        ],
    },
    giftEffectTimeHours: {
        type: "combo",
        label: "生效时间",
        options: timeOpts,
        defaultValue: "0",
    },
    giftValidUntilDayCount: {
        type: "text",
        label: "有效天数",
        surfix: "天",
        rules: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (!/^\d+$/.test(value)) {
                        return callback("请输入数字");
                    }
                    if (+value < 1) {
                        return callback("请输入大于0的数字");
                    }
                    return callback();
                },
            },
        ],
    },
    rangeDate: {
        type: "datepickerRange",
        label: "固定有效期",
        rules: ["required"],
    },
};

export {
    formItemLayout,
    formKeys1,
    formItems,
    formKeys2,
    timeOpts,
    dayOpts,
};

export const initVal = {
    id: "0",
    effectType: 1,
    giftCount: "1",
    countType: "0",
    giftEffectTimeHours: '0',
};

