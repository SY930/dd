
export const programList = [
    { label: '无', value: '0' },
    { label: '首页', value: 'home' },
    { label: '分享好友', value: 'share' },
    { label: '我的', value: 'center' },
    { label: '领券中心', value: 'voucherCenter/voucherList' },
    { label: '我的优惠券', value: 'or/myCoupon' },
    { label: '我的会员卡', value: 'or/cards' },
    { label: '在线储值', value: 'member/cardRecharge' },
    { label: '会员权益购买', value: 'member/packetInterests' },
];
export const faceDefVal = {
    id: '1',
    triggerScene: '1', // 点餐页弹窗海报图
    conditionType: '1', // 会员身份1， 会员标签2
    conditionName: '是否持卡会员', // 是否持卡会员| 会员身份
    conditionValue: 'whetherHasCard', // 是否持卡key | 7023267909942119317
    targetName: '持卡会员',
    targetValue: '1', // 1 是持卡会员 0否
    // 点击触发的事件
    triggerEventName: '购物车夹菜',
    triggerEventValue: '',
    triggerEventCustomInfo: '',
    everyTagsRule: [],
};
