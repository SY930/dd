import { SALE_LABEL } from 'i18n/common/salecenter';
/**
 * 集团视角新建营销活动页面 5个大分类的constants
 *
 */

export const BASIC_PROMOTION_MAP = {
    '2020': '折扣',
    '1010': '特价菜',
    '4010': '团购活动',
    '1050': '第二份打折',
    '1070': '加价换购',
    // '5010': '菜品推荐',
    // '5020': '会员专属菜',
    '1090': '加价升级换新',
    '2010': '满减/每满减',
    '2030': '随机立减',
    '1030': '满赠/每满赠',
    '1020': '买赠',
    '1060': '买三免一',
    '2040': '买减/买折',
    '2050': '组合减免/折扣',
    '1040': '搭赠',
    '2080': '低价促销',
    '1080': '累计次数赠送',
    '2070': '累计次数减免',
    '1021': '称重买赠',
    '10071': '拼团活动',
}

export const GIFT_MAP = {
    '10': '代金券',
    '20': '菜品优惠券',
    '21': '菜品兑换券',
    '30': '实物礼品券',
    '40': '会员充值券',
    '42': '会员积分券',
    '80': '会员权益券',
    '90': '礼品定额卡',
    '100': '活动券',
    '91': '微信礼品卡',
    '110': '买赠券',
    '111': '折扣券',
    '22': '配送券',
    '-10': '会员价',
    '-20': '会员折扣',
    '81': '特殊权益券',
}

/**
 * @description 营销活动分类
 * @field title 营销活动名称
 * @field isSpecial 营销活动类别，true 为特色营销活动，false为基础营销活动
 * 
*/
export const CRM_PROMOTION_TYPES = {
    53: {
        title: SALE_LABEL.k67b2pz0,
        isSpecial: true,
        text: SALE_LABEL.k67b4t5q,
        example: '',
        key: '53',
        right: 3,
        bottom: 0,
    },
    51: {
        title: SALE_LABEL.k67b2r4o,
        isSpecial: true,
        text: SALE_LABEL.k67b4us2,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        key: '51',
        right: 11,
        bottom: 7,
        isHot: true,
    },
    62: {
        title: SALE_LABEL.k67b2rlc,
        isSpecial: true,
        text: SALE_LABEL.k67b4v8q,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        key: '62',
        right: 13,
        bottom: 11,
    },
    63: {
        title: SALE_LABEL.k67b2rd0,
        isSpecial: true,
        text: SALE_LABEL.k67b4v0e,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        key: '63',
        right: 19,
        bottom: 0,
    },
}

/**
 * 会员拉新
 * @type {Array}
 */
export const NEW_CUSTOMER_PROMOTION_TYPES = [
    {
        title: SALE_LABEL.k636p3a1,
        isSpecial: true,
        tags: [SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['wx', 'app'],
        text: SALE_LABEL.k67b3xsp,
        example: '',
        key: '65',
        right: 13,
        bottom: 3,
        isHot: true,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '好友助力（原膨胀大礼包）',
        isSpecial: true,
        tags: [SALE_LABEL.k639vgbm],
        signs: ['app'],
        text: SALE_LABEL.k67b3y11,
        example: '',
        key: '66',
        right: 16,
        bottom: 2,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: SALE_LABEL.k639vh8y,
        isSpecial: true,
        text: SALE_LABEL.k67b3y9d,
        tags: ['微信'],
        signs: ['wx'],
        example: '',
        key: '67',
        right: 13,
        bottom: 1,
        isNew: new Date('2022/04/12').getTime(),
        isOffline: true,     //是否下线状态
    },
    {
        title: '老带新（原推荐有礼）',
        isSpecial: true,
        tags: [SALE_LABEL.k639vgjy, '小程序'],
        signs: ['wx', 'app'],
        text: SALE_LABEL.k67b3yhp,
        example: '',
        key: '68',
        right: 11,
        bottom: 0,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '免费赠券（原免费领取）',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['wx', 'app'],
        text: SALE_LABEL.k67b4rb2,
        example: '',
        key: '21',
        right: 17,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k639vhpm,
        isSpecial: true,
        tags: ['微信'],
        signs: ['wx'],
        text: SALE_LABEL.k67b4rje,
        example: '',
        key: '31',
        right: 13,
        bottom: 0,
    },
    {
        title: '线上餐厅弹窗送礼',
        isSpecial: true,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['xwx', 'wx', 'app'],
        text: '线上餐厅多个功能页面自动弹出领取，给用户强力的优惠视觉冲击，促进消费',
        example: '',
        key: '23',
        right: 16,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2p1n,
        tags: [SALE_LABEL.k639vgsa],
        signs: ['wx', 'app', 'pos'],
        isSpecial: true,
        text: SALE_LABEL.k67b4s02,
        example: '',
        key: '52',
        right: 5,
        bottom: 7,
    },
    {
        title: '会员专属菜',
        isSpecial: false,
        text: '会员专属菜品，利用低价吸引用户注册会员',
        example: '',
        tags: ['微信'],
        signs: ['wx'],
        key: '5020',
        isNew: new Date('2022/04/12').getTime(),
        right: 10,
        bottom: 0,
    },
];

/**
 * 粉丝互动
 * @type {Array}
 */
export const FANS_INTERACTIVITY_PROMOTION_TYPES = [
    {
        title: '盲盒',
        tags: ['小程序'],
        signs: ['app'],
        isSpecial: true,
        text: '拆未知礼盒，增加猎奇趣味',
        example: '',
        key: '79',
        right: 12,
        bottom: 4,
        isHot: true,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '签到',
        tags: [SALE_LABEL.k639vgjy, '小程序'],
        signs: ['wx', 'app'],
        isSpecial: true,
        text: '签到获取礼品，提升用户日活量',
        example: '',
        key: '76',
        right: 14,
        bottom: 12,
        isHot: true,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '支付后广告',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: ['微信'],
        signs: ['wx'],
        text: '支付成功页自定义投放广告内容，便于餐后营销',
        example: '',
        key: '77',
        right: 16,
        bottom: 6,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '下单抽抽乐',
        isSpecial: false,
        tags: ['微信', '小程序'],
        signs: ['wx', 'app'],
        text: '下单后抽取礼品，促进下次消费',
        example: SALE_LABEL.k67cpoj7,
        key: '78',
        right: 12,
        bottom: 4,
        isNew: new Date('2022/04/12').getTime(),
    },
    // 摇奖活动
    {
        title: SALE_LABEL.k636p31p,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['wx', 'app'],
        text: SALE_LABEL.k67b4s8e,
        example: '',
        key: '20',
        right: 16,
        bottom: 6,
    },
    {
        title: SALE_LABEL.k67b2p9z,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k639vgbm],
        signs: ['wx', 'app'],
        isSpecial: true,
        text: SALE_LABEL.k67b4sgq,
        example: '',
        key: '64',
        right: 19,
        bottom: 6,
    },
    {
        title: SALE_LABEL.k67b2pic,
        isSpecial: true,
        tags: [SALE_LABEL.k5krn6z9],
        signs: ['wx'],
        text: SALE_LABEL.k67b4sp2,
        example: '',
        key: '22',
        right: 0,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2pqo,
        isSpecial: false,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, '小程序'],
        signs: ['wx', 'app'],
        text: SALE_LABEL.k67b4sxe,
        example: SALE_LABEL.k67cpoj7,
        key: '2030',
        right: 12,
        bottom: 4,
    },
    {
        title: '拼手气抢红包',
        isSpecial: true,
        tags: ['小程序'],
        signs: ['app'],
        text: '下单后引导用户拼手气抢红包，提升活跃度',
        example: '',
        key: '82',
        right: 16,
        bottom: 2,
        isNew: new Date('2022/04/12').getTime(),
    },
    {
        title: '口令领券',
        tags: ['小程序'],
        signs: ['app'],
        isSpecial: true,
        text: '通过“口令密码”获取优惠券，提升用户活跃度',
        example: '',
        key: '83',
        right: 12,
        bottom: 4,
        isHot: true,
        isNew: new Date('2022/04/12').getTime(),
    },
];

/**
 * 促进复购
 * @type {Array}
 * @field isSpecial // 表示活动是否是特色营销活动(false 则为基础营销活动)
 */
export const REPEAT_PROMOTION_TYPES = [
    {
        title: "用券送礼（原消费券返券）",
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: "会员消费了A券返B券，消费B券返C券，循环返券拉动复购",
        tags: ["pos", SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ["pos", "wx", "app"],
        example: "",
        key: "81",
        right: 16,
        bottom: 6,
        isHot: true,
        isNew: new Date("2022/04/12").getTime()
    },
    {
        title: "微信支付有礼",
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: "微信支付成功页投放微信支付商家券，引导用户领券",
        tags: ["新微信"],
        signs: ["wx"],
        example: "",
        key: "80",
        right: 16,
        bottom: 6,
        isHot: true,
        isNew: new Date("2022/04/12").getTime()
    },
    {
        title: "集点卡",
        isSpecial: true,
        text: "消费后获得集点，促进会员多次消费",
        tags: ["新微信", "小程序"],
        signs: ["wx", "app"],
        example: "",
        key: "75",
        right: 16,
        bottom: 6,
        isHot: true,
        isNew: new Date("2022/04/12").getTime()
    },
    // 群发礼品
    {
        title: SALE_LABEL.k67b2pz0,
        isSpecial: true,
        text: SALE_LABEL.k67b4t5q,
        signs: [],
        example: "",
        key: "53",
        right: 3,
        bottom: 0
    },
    // 群发短信
    {
        title: SALE_LABEL.k67b2q7c,
        isSpecial: true,
        text: SALE_LABEL.k67b4te2,
        signs: [],
        example: "",
        key: "50",
        right: 13,
        bottom: 6
    },
    // 消费返礼品
    {
        title: SALE_LABEL.k5m4q0ae,
        tags: ["pos", SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ["pos", "wx", "app"],
        isSpecial: false,
        text: SALE_LABEL.k67b4tme,
        example: SALE_LABEL.k67cporj,
        key: "3010",
        right: 17,
        bottom: 7
    },
    // 消费返积分
    {
        title: SALE_LABEL.k5m4q0iq,
        tags: ["pos", SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ["pos", "wx", "app"],
        isSpecial: false,
        text: SALE_LABEL.k67b4tuq,
        example: SALE_LABEL.k67cpozv,
        key: "3020",
        right: 13,
        bottom: 3
    },
    // 积分兑换
    {
        title: SALE_LABEL.k67b2qfo,
        tags: [SALE_LABEL.k5krn6z9, "小程序"],
        signs: ["wx", "app"],
        isSpecial: true,
        text: SALE_LABEL.k67b4u32,
        example: "",
        key: "30",
        right: 18,
        bottom: 8
    },
    {
        title: SALE_LABEL.k67b2qo0,
        tags: ["pos"],
        isSpecial: false,
        text: SALE_LABEL.k67b4ube,
        example: SALE_LABEL.k67cpp87,
        key: "1080",
        right: 6,
        bottom: 13,
        isOffline: true
    },
    {
        title: SALE_LABEL.k67b2qwc,
        tags: ["pos"],
        isSpecial: false,
        text: SALE_LABEL.k67b4ujq,
        example: SALE_LABEL.k67cppgj,
        key: "2070",
        right: 22,
        bottom: 13,
        isOffline: true
    },
    {
        title: "千人千面",
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: "可根据设置条件筛选用户，推送不同的营销活动",
        tags: [SALE_LABEL.k639vgbm],
        signs: ["app"],
        example: "",
        key: "85",
        right: 16,
        bottom: 6,
        isNew: new Date("2022/04/12").getTime()
    },
    {
        title: "消费送礼",
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '消费后获得奖励将使顾客下次光临的时间大大提前',
        tags: ['pos', SALE_LABEL.k639vgbm],
        signs: ['pos', 'app'],
        example: '',
        key: '87',
        right: 16,
        bottom: 6,
        isNew: new Date("2022/04/12").getTime()
    },
    {
        title: "限时秒杀",
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: "限时超低价格购买商品，吸引客户参与活动，提升顾客消费粘性",
        tags: [SALE_LABEL.k639vgbm],
        signs: ["app"],
        example: "",
        key: "86",
        right: 16,
        bottom: 6
        // isNew: new Date("2022/04/12").getTime()
    }
];

/**
 * 会员关怀
 * @type {Array}
 */
export const LOYALTY_PROMOTION_TYPES = [
    {
        title: SALE_LABEL.k67b2r4o,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67b4us2,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        signs: ['pos', 'wx', 'app'],
        key: '51',
        right: 11,
        bottom: 7,
        isHot: true,
    },
    {
        title: SALE_LABEL.k67b2rd0,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67b4v0e,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        signs: ['pos', 'wx', 'app'],
        key: '63',
        right: 19,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2rlc,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67b4v8q,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        signs: ['pos', 'wx', 'app'],
        key: '62',
        right: 13,
        bottom: 11,
    },
    {
        title: SALE_LABEL.k67b2rto,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp0nm,
        example: '',
        tags: [SALE_LABEL.k639vgsa],
        signs: ['pos', 'wx', 'app'],
        key: '61',
        right: 29,
        bottom: 2,
    },
    {
        title: SALE_LABEL.k67b2s20,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k639vgsa],
        signs: ['pos', 'wx', 'app'],
        text: SALE_LABEL.k67cp0vy,
        example: '',
        key: '60',
        right: 10,
        bottom: 5,
    },

];

/**
 * 促进销量
 * @type {Array}
 * @field isSpecial  // 表示活动是否是特色营销活动(false 则为基础营销活动)
 *
 */
export const SALE_PROMOTION_TYPES = [
    {
        title: SALE_LABEL.k5ezcu1b,
        isSpecial: false,
        text: SALE_LABEL.k67cp14a,
        example: SALE_LABEL.k67cppov,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9],
        signs: ['pos', 'wx'],
        key: '2020',
        right: 2,
        bottom: -14,
        isHot: true,
    },
    {
        title: SALE_LABEL.k67b2sac,
        isSpecial: false,
        text: SALE_LABEL.k67cp1cm,
        example: SALE_LABEL.k67cppx7,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, '小程序'],
        signs: ['pos', 'wx', 'app'],
        key: '1010',
        right: 10,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2sio,
        isSpecial: false,
        text: SALE_LABEL.k67cp1ky,
        example: '',
        key: '4010',
        tags: ['pos'],
        signs: ['pos'],
        right: -5,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2sr0,
        isSpecial: false,
        text: SALE_LABEL.k67cp1ta,
        example: SALE_LABEL.k67cpq5j,
        tags: ['pos', SALE_LABEL.k639vgjy, '小程序'],
        signs: ['pos', 'wx', 'app'],
        key: '1050',
        right: 15,
        bottom: 5,
    },
    {
        title: SALE_LABEL.k67b3uk0,
        isSpecial: false,
        text: SALE_LABEL.k67cp21m,
        example: SALE_LABEL.k67cpqdv,
        tags: ['pos', SALE_LABEL.k639vgjy],
        signs: ['pos', 'wx'],
        key: '1070',
        right: 14,
        bottom: 12,
    },
    {
        title: SALE_LABEL.k5m5auib,
        isSpecial: false,
        text: SALE_LABEL.k67cp29y,
        example: SALE_LABEL.k67cpqm7,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, '小程序'],
        signs: ['wx', 'app'],
        key: '5010',
        right: 12,
        bottom: 15,
    },
    {
        title: SALE_LABEL.k67b3usc,
        isSpecial: false,
        text: SALE_LABEL.k67cp2ia,
        example: SALE_LABEL.k67cpquj,
        tags: ['pos'],
        signs: ['pos'],
        key: '1090',
        right: 18,
        bottom: 1,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3v0o,
        text: SALE_LABEL.k67cp2qm,
        example: SALE_LABEL.k67cpr2v,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['pos', 'wx', 'app'],
        key: '2010',
        right: 14,
        bottom: 5,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3v90,
        text: SALE_LABEL.k67cp2yy,
        example: SALE_LABEL.k67cprb7,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k639vgbm],
        signs: ['pos', 'wx', 'app'],
        key: '1030',
        right: 16,
        bottom: 11,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3vhc,
        text: SALE_LABEL.k67cp37a,
        example: SALE_LABEL.k67cprjj,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        signs: ['pos', 'wx', 'app'],
        key: '1020',
        right: 19,
        bottom: 7,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3vpo,
        text: SALE_LABEL.k67cp3fm,
        example: SALE_LABEL.k67g7rpg,
        tags: ['pos', '微信'],
        signs: ['pos', 'wx'],
        key: '1060',
        right: 0,
        bottom: 1,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3vy0,
        text: SALE_LABEL.k67cp3ny,
        example: SALE_LABEL.k67g7rxs,
        tags: ['pos'],
        signs: ['pos'],
        key: '2040',
        right: 16,
        bottom: 9,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3w6c,
        text: SALE_LABEL.k67cp3wa,
        example: SALE_LABEL.k67g7s64,
        tags: ['pos'],
        signs: ['pos'],
        key: '2050',
        right: 0,
        bottom: -3,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3weo,
        text: SALE_LABEL.k67cp44m,
        example: SALE_LABEL.k67g7seg,
        tags: ['pos'],
        signs: ['pos'],
        key: '1040',
        right: 12,
        bottom: 0,
    },
    {
        isSpecial: false,
        title: SALE_LABEL.k67b3wn0,
        text: SALE_LABEL.k67cp4cy,
        example: '',
        tags: ['pos'],
        signs: ['pos'],
        key: '2080',
        right: 25,
        bottom: 6,
    },
    {
        title: '称重买赠',
        isSpecial: false,
        text: '仅适用于POS2.5，应用于称重类商品，买1斤A赠送0.5斤A，或是买1斤A赠送0.5斤B。支持买赠和每买赠。',
        example: '',
        tags: ['pos'],
        signs: ['pos'],
        key: '1021',
        right: 2,
        bottom: -14,
        isHot: true,
    },
    {
        title: SALE_LABEL.k67b3x3o,
        color: '#84aac6',
        text: SALE_LABEL.k67cpnlv,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        signs: ['wx'],
        key: '10071',
        right: 5,
        bottom: 0,
        filter: true,
    }, {
        title: '秒杀',
        color: '#84aac6',
        text: SALE_LABEL.k67cp4la,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        signs: ['wx'],
        key: '10072',
        right: 15,
        bottom: 0,
        filter: true, // 可过滤
    },
];

/**
 * 管家活动  哗管家
 */
export const HOUSEKEEPER_TYPES = [
    {
        title: '流失唤醒',
        isSpecial: true,
        text: '',
        example: '',
        tags: [],
        signs: [],
        key: 'housekeeper',
        right: 2,
        bottom: -14,
        isHot: false,
    },
    {
        title: '智能发券',
        isSpecial: true,
        text: '',
        example: '',
        tags: [],
        signs: [],
        key: 'intelligentGiftRule',
        right: 2,
        bottom: -14,
        isHot: false,
    },
]

export const WECHAT_MALL2_ACTIVITIES = [
    {
        title: SALE_LABEL.k67b3wvc,
        color: '#84aac6',
        text: SALE_LABEL.k67cp4la,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        key: '10072',
        right: 15,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b3x3o,
        color: '#84aac6',
        text: SALE_LABEL.k67cpnlv,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        key: '10071',
        right: 5,
        bottom: 0,
    },
];

export const WECHAT_MALL_ACTIVITIES = [
    {
        title: SALE_LABEL.k67b3wvc,
        color: '#84aac6',
        text: SALE_LABEL.k67cp4la,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        key: '72',
        right: 15,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b3x3o,
        color: '#84aac6',
        text: SALE_LABEL.k67cpnlv,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        key: '71',
        right: 5,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k5m4q0iq,
        color: '#84aac6',
        text: SALE_LABEL.k67cpnu7,
        example: '',
        tags: [SALE_LABEL.k639vh0m],
        key: '73',
        right: 14,
        bottom: 5,
    },
];
/**
 * 线上营销
 * @type {Array}
 */
export const ONLINE_PROMOTION_TYPES = [
    {
        title: SALE_LABEL.k67b3xc1,
        isSpecial: false,
        text: SALE_LABEL.k67cpo2j,
        desc: <p>{SALE_LABEL.k67g7sms}{SALE_LABEL.k67g7sv4}</p>,
        tags: [SALE_LABEL.k639vgbm],
        key: '2060',
        right: 14,
        bottom: 5,
        isHot: true,
    },
    {
        title: SALE_LABEL.k67b3xkd,
        isSpecial: false,
        text: SALE_LABEL.k67cpoav,
        desc: <p>{SALE_LABEL.k67cpoav}<br />{SALE_LABEL.k67g7t3g}<br />{SALE_LABEL.k67g7tbs}</p>,
        tags: [SALE_LABEL.k639vgbm],
        key: '1100',
        right: 10,
        bottom: 0,
    },
];

