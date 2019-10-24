export const defaultData = {
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
            giftInfo: {
                giftName: null,
                giftItemID: null,
                validateStatus: 'success',
                msg: null,
            },
            // 礼品数量
            giftCount: {
                value: '',
                validateStatus: 'success',
                msg: null,
            },
            //有效期限
            effectType: '1',
            // 礼品有效期
            giftValidDays: {
                value: '',
                validateStatus: 'success',
                msg: null,
            },
            //选了按小时还是按天,默认是按小时
            dependTypeXXXXX: '1',
            // 礼品生效时间
            giftEffectiveTime: {
                value: '0',
                validateStatus: 'success',
                msg: null,
            },
        },
        validateStatus: 'success',
        msg: null,
    },
};

export const getDefaultGiftData = (typeValue = 0, typePropertyName = 'sendType') => ({
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
            giftInfo: {
                giftName: null,
                giftItemID: null,
                validateStatus: 'success',
                msg: null,
            },
            // 礼品数量
            giftCount: {
                value: '',
                validateStatus: 'success',
                msg: null,
            },
            //有效期限
            effectType: '1',
            // 礼品有效期
            giftValidDays: {
                value: '',
                validateStatus: 'success',
                msg: null,
            },
            //选了按小时还是按天,默认是按小时
            dependTypeXXXXX: '1',
            // 礼品生效时间
            giftEffectiveTime: {
                value: '0',
                validateStatus: 'success',
                msg: null,
            },
        },
        validateStatus: 'success',
        msg: null,
    },
    [typePropertyName]: typeValue,
})

export const defaultGivePointsXXXXX = {
    givePointsValueXXXXX: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    cardXXXXX: {
        value: '',
        validateStatus: 'success',
        msg: null,
    }
}

export const defaultGiveCouponXXXXX = {
    isOn: true,
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    //有效期限
    effectType: '1',
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    //选了按小时还是按天,默认是按小时
    dependTypeXXXXX: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
}

export const defalutDisArr = [
    false, false, false, false, false, false, false, false, false, false, false, false
]