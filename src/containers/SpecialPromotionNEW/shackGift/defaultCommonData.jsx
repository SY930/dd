export const defaultData = {
    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    giftConfImagePath: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },

    //赠送积分
    givePoints: {
        value: {},
        validateStatus: 'success',
        msg: null,
    },
    //赠送红包
    giveRedPacket: {
        isOn: false,
        redPacketID: {
            value: undefined,
            validateStatus: 'success',
            msg: null,
        },
        redPacketValue: {
            value: undefined,
            validateStatus: 'success',
            msg: null,
        },
    },

    //赠送优惠券
    giveCoupon: {
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
            dependType: '1',
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
    giftConfImagePath: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    //赠送积分
    givePoints: {
        value: {},
        validateStatus: 'success',
        msg: null,
    },
    //赠送红包
    giveRedPacket: {
        isOn: false,
        redPacketID: {
            value: undefined,
            validateStatus: 'success',
            msg: null,
        },
        redPacketValue: {
            value: undefined,
            validateStatus: 'success',
            msg: null,
        },
    },
    //赠送优惠券
    giveCoupon: {
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
            dependType: '1',
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

export const defaultGivePoints = {
    givePointsValue: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    card: {
        value: '',
        validateStatus: 'success',
        msg: null,
    }
}

export const defaultGiveRedPacket = {
    //赠送红包
    isOn: false,
    redPacketID: {
        value: undefined,
        validateStatus: 'success',
        msg: null,
    },
    redPacketValue: {
        value: undefined,
        validateStatus: 'success',
        msg: null,
    },
}

export const defaultGiveCoupon = {
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
    dependType: '1',
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