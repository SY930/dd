
export const programList = [
    { label: '无', value: '' },
    { label: '首页', value: '/home' },
    { label: '分享好友', value: '/share' },
    { label: '我的', value: '/customer/center' },
    { label: '领券中心', value: '/coupon/getCenter' },
    { label: '我的优惠券', value: '/customer/couponList' },
    { label: '我的会员卡', value: '/customer/cardList' },
    { label: '在线储值', value: '/card/recharge' },
    { label: '会员权益购买', value: '/card/purchaseRights' },
];
export const faceDefVal = {
    id: '0',
    triggerScene: '1', // 点餐页弹窗海报图
    conditionType: '1', // 会员身份1， 会员标签2
    conditionName: '是否持卡会员', // 是否持卡会员| 会员身份
    conditionValue: 'whetherHasCard', // 是否持卡key | 7023267909942119317
    targetName: '持卡会员',
    targetValue: '1', // 1 是持卡会员 0否
    // 点击触发的事件  小程序2.0
    triggerEventName: '购物车夹菜',
    triggerEventValue: '',
    triggerEventCustomInfo: '',
    // 点击触发的事件 h5
    triggerEventName2: '购物车夹菜',
    triggerEventValue2: '',
    triggerEventCustomInfo2: '',
    // children: [], // 点击小程序触发事件后的三级联动菜单
    everyTagsRule: [],
    // isTagRemove: false,
    isShowDishSelector: false,
};
