export const defaultData = {
    // 膨胀所需人数
    needCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    effectType: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },

    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },

    //赠送积分
    givePointsXXXXX: {
        value: {},
        validateStatus: 'success',
        msg: null,
    },

    //赠送优惠券
    giveCouponXXXXX: {
        value:{
            isOn: true,
        },
        validateStatus: 'success',
        msg: null,
    },
};

export const getDefaultGiftData = (typeValue = 0, typePropertyName = 'sendType') => ({
    // 膨胀所需人数
    needCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    effectType: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    //赠送积分
    givePointsXXXXX: {
        value: {},
        validateStatus: 'success',
        msg: null,
    },
    //赠送优惠券
    giveCouponXXXXX: {
        value:{
            isOn: true,
        },
        validateStatus: 'success',
        msg: null,
    },
    [typePropertyName]: typeValue,
})

export const defaultGivePointsXXXXX = {
    givePointsValueXXXXX: {
        value: '1',
        validateStatus: 'success',
        msg: null,
    },
    cardXXXXX: {
        value: '',
        validateStatus: 'success',
        msg: null,
    }
}