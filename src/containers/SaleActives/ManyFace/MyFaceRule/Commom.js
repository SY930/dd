
export const programList = [
    // { label: '无', value: '' },
    { label: '首页', value: '/home' },
    { label: '分享好友', value: '/share' },
    { label: '我的', value: '/customer/center' },
    { label: '领券中心', value: '/coupon/getCenter' },
    { label: '我的优惠券', value: '/customer/couponList' },
    { label: '我的会员卡', value: '/customer/cardList' },
    { label: '在线储值', value: '/card/recharge' },
    { label: '会员权益购买', value: '/card/purchaseRights' },
];

export const eventSelectOptionCopy = [
    { label: '小程序', value: 'miniAppPage', children: programList },
    { label: '分享裂变', value: 'event_65', children: [] },
    { label: '膨胀大礼包', value: 'event_66', children: [] },
    { label: '免费领取', value: 'event_21', children: [] },
    { label: '摇奖活动', value: 'event_20', children: [] },
    { label: '完善资料送礼活动', value: 'event_60', children: [] },
    { label: '推荐有礼', value: 'event_68', children: [] },
    { label: '集点活动', value: 'event_75', children: [] },
    { label: '签到活动', value: 'event_76', children: [] },
    { label: '盲盒活动', value: 'event_79', children: [] },
    { label: '一键拨号', value: 'speedDial', children: [] },
    // { label: '自定义页面', value: '1', children: [] },
    // { label: '软文，文本消息', value: '7', children: [] },
    { label: '商城', value: 'jumpToMall', children: [] },
    { label: '跳转至小程序', value: 'jumpToMiniApp', children: [] },
    { label: '自定义链接', value: 'customLink' },
    { label: '菜品加入购物车', value: 'shoppingCartAddFood' },
    // { label: '小程序开卡', value: 'toOpenCard' }, // 仅针对九毛九集团可见
    { label: '小程序自定义页面', value: 'miniAppCustomPage', children: [] },
]
export const faceDefVal = {
    id: '0',
    conditionType: '', // 会员身份1， 会员标签2
    conditionName: '', // 是否持卡会员| 会员身份
    conditionValue: '', // 是否持卡key | 7023267909942119317
    targetName: '',
    targetValue: '', // 1 是持卡会员 0否
    // 点击触发的事件  小程序3.0
    triggerEventName1: '购物车夹菜',
    triggerEventValue1: '',
    triggerEventCustomInfo1: '',
    triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' },
        { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序

    triggerEventInfoList: [
        {
            id: '011',
            parentId: '0',
            decorateInfo: { imagePath: '' },
            triggerEventName1: '购物车夹菜',
            triggerEventValue1: '',
            triggerEventCustomInfo1: '',
            triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' },
                { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序
        },
    ], // banner

    // 点击触发的事件 h5
    triggerEventName2: '购物车夹菜',
    triggerEventValue2: '',
    triggerEventCustomInfo2: '',
    // children: [], // 点击小程序触发事件后的三级联动菜单
    everyTagsRule: [],

    decorateInfo: { imagePath: '' }, // 弹窗海报
    // isShowDishSelector: false,
};


export const triggerEventInfoVal = {
    id: '011',
    decorateInfo: { imagePath: '' },
    triggerEventName1: '购物车夹菜',
    triggerEventValue1: '',
    triggerEventCustomInfo1: '',
    triggerEventCustomInfoApp1: [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }], // 跳转至小程序
}
