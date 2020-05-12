import { SALE_LABEL } from 'i18n/common/salecenter';
/**
 * 集团视角新建营销活动页面 5个大分类的constants
 *
 */
// export const BASIC_PROMOTION_MAP = {
//     '2020': SALE_LABEL.k5ezcu1b,
//     '1010': SALE_LABEL.k67b2sac,
//     '4010': SALE_LABEL.k67b2sio,
//     '1050': SALE_LABEL.k67b2sr0,
//     '1070': SALE_LABEL.k67b3uk0,
//     '5010': SALE_LABEL.k5m5auib,
//     '1090': SALE_LABEL.k67b3usc,
//     '2010': SALE_LABEL.k67b3v0o,
//     '2030': SALE_LABEL.k67b2pqo,
//     '1030': SALE_LABEL.k67b3v90,
//     '1020': SALE_LABEL.k67b3vhc,
//     '1060': SALE_LABEL.k67b3vpo,
//     '2040': SALE_LABEL.k67b3vy0,
//     '2050': SALE_LABEL.k67b3w6c,
//     '1040': SALE_LABEL.k67b3weo,
//     '2080': SALE_LABEL.k67b3wn0,
//     '1080': SALE_LABEL.k67b2qo0,
//     '2070': SALE_LABEL.k67b2qwc,
// }
export const BASIC_PROMOTION_MAP = {
    '2020': '折扣',
    '1010': '特价菜',
    '4010': '团购活动',
    '1050': '第二份打折',
    '1070': '加价换购',
    '5010': '菜品推荐',
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
}

// export const GIFT_MAP = {
//     '10': SALE_LABEL.k5m5avfn,
//     '20': SALE_LABEL.k5m5avnz,
//     '21': SALE_LABEL.k5m5avwb,
//     '30': SALE_LABEL.k67g7tk4,
//     '40': SALE_LABEL.k67g7tsg,
//     '42': SALE_LABEL.k67g7u0s,
//     '80': SALE_LABEL.k67g7u94,
//     '90': SALE_LABEL.k67g7uhg,
//     '100': SALE_LABEL.k5m6e393,
//     '91': SALE_LABEL.k67g7ups,
//     '110': SALE_LABEL.k636qvpm,
//     '111': SALE_LABEL.k636qvha,
// }
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
    '91': '线上礼品卡',
    '110': '买赠券',
    '111': '折扣券',
    '22': '配送券',
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
        text: SALE_LABEL.k67b3xsp,
        example: '',
        key: '65',
        right: 13,
        bottom: 3,
        isHot: true,
        isNew: true,
    },
    {
        title: SALE_LABEL.k635s5id,
        isSpecial: true,
        tags: [SALE_LABEL.k639vgbm],
        text: SALE_LABEL.k67b3y11,
        example: '',
        key: '66',
        right: 16,
        bottom: 2,
        isNew: true,
    },
    {
        title: SALE_LABEL.k639vh8y,
        isSpecial: true,
        text: SALE_LABEL.k67b3y9d,
        tags: ['微信'],
        example: '',
        key: '67',
        right: 13,
        bottom: 1,
        isNew: true,
    },
    {
        title: SALE_LABEL.k639vhha,
        isSpecial: true,
        tags: [SALE_LABEL.k639vgjy, '小程序'],
        text: SALE_LABEL.k67b3yhp,
        example: '',
        key: '68',
        right: 11,
        bottom: 0,
        isNew: true,
    },
    {
        title: SALE_LABEL.k636p0yo,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
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
        text: SALE_LABEL.k67b4rje,
        example: '',
        key: '31',
        right: 13,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2otb,
        isSpecial: true,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        text: SALE_LABEL.k67b4rrq,
        example: '',
        key: '23',
        right: 16,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2p1n,
        tags: [SALE_LABEL.k639vgsa],
        isSpecial: true,
        text: SALE_LABEL.k67b4s02,
        example: '',
        key: '52',
        right: 5,
        bottom: 7,
    },
];

/**
 * 粉丝互动
 * @type {Array}
 */
export const FANS_INTERACTIVITY_PROMOTION_TYPES = [
    {
        title: '签到',
        tags: [SALE_LABEL.k639vgjy, '小程序'],
        isSpecial: true,
        text: '签到获取礼品，提升用户日活量',
        example: '',
        key: '76',
        right: 14,
        bottom: 12,
        isHot: true,
        isNew: true,
    },
    {
        title: '支付后广告',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: ['微信'],
        text: '支付成功页自定义投放广告内容，便于餐后营销',
        example: '',
        key: '77',
        right: 16,
        bottom: 6,
        isNew: true,
    },
    {
        title: SALE_LABEL.k636p31p,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        text: SALE_LABEL.k67b4s8e,
        example: '',
        key: '20',
        right: 16,
        bottom: 6,
    },
    {
        title: SALE_LABEL.k67b2p9z,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k639vgbm],
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
        tags: [SALE_LABEL.k5krn6z9, '小程序'],
        text: SALE_LABEL.k67b4sp2,
        example: '',
        key: '22',
        right: 0,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2pqo,
        isSpecial: false,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, '小程序'],
        text: SALE_LABEL.k67b4sxe,
        example: SALE_LABEL.k67cpoj7,
        key: '2030',
        right: 12,
        bottom: 4,
    },
];

/**
 * 促进复购
 * @type {Array}
 */
export const REPEAT_PROMOTION_TYPES = [
    {
        title: '集点卡',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '消费后获得集点，促进会员多次消费',
        tags: ['新微信', '小程序'],
        example: '',
        key: '75',
        right: 16,
        bottom: 6,
        isHot: true,
        isNew: true,
    },
    {
        title: SALE_LABEL.k67b2pz0,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67b4t5q,
        example: '',
        key: '53',
        right: 3,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2q7c,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67b4te2,
        example: '',
        key: '50',
        right: 13,
        bottom: 6,
    },
    {
        title: SALE_LABEL.k5m4q0ae,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        isSpecial: false,
        text: SALE_LABEL.k67b4tme,
        example: SALE_LABEL.k67cporj,
        key: '3010',
        right: 17,
        bottom: 7,
    },
    {
        title: SALE_LABEL.k5m4q0iq,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        isSpecial: false,
        text: SALE_LABEL.k67b4tuq,
        example: SALE_LABEL.k67cpozv,
        key: '3020',
        right: 13,
        bottom: 3,
    },
    {
        title: SALE_LABEL.k67b2qfo,
        tags: [SALE_LABEL.k5krn6z9, '小程序'],
        isSpecial: true,
        text: SALE_LABEL.k67b4u32,
        example: '',
        key: '30',
        right: 18,
        bottom: 8,
    },
    {
        title: SALE_LABEL.k67b2qo0,
        tags: ['pos'],
        isSpecial: false,
        text: SALE_LABEL.k67b4ube,
        example: SALE_LABEL.k67cpp87,
        key: '1080',
        right: 6,
        bottom: 13,
    },
    {
        title: SALE_LABEL.k67b2qwc,
        tags: ['pos'],
        isSpecial: false,
        text: SALE_LABEL.k67b4ujq,
        example: SALE_LABEL.k67cppgj,
        key: '2070',
        right: 22,
        bottom: 13,
    },
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
        key: '61',
        right: 29,
        bottom: 2,
    },
    {
        title: SALE_LABEL.k67b2s20,
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: [SALE_LABEL.k639vgsa],
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
 */
export const SALE_PROMOTION_TYPES = [
    {
        title: SALE_LABEL.k5ezcu1b,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp14a,
        example: SALE_LABEL.k67cppov,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9],
        key: '2020',
        right: 2,
        bottom: -14,
        isHot: true,
    },
    {
        title: SALE_LABEL.k67b2sac,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp1cm,
        example: SALE_LABEL.k67cppx7,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9],
        key: '1010',
        right: 10,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2sio,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp1ky,
        example: '',
        key: '4010',
        tags: ['pos'],
        right: -5,
        bottom: 0,
    },
    {
        title: SALE_LABEL.k67b2sr0,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp1ta,
        example: SALE_LABEL.k67cpq5j,
        tags: ['pos', SALE_LABEL.k639vgjy],
        key: '1050',
        right: 15,
        bottom: 5,
    },
    {
        title: SALE_LABEL.k67b3uk0,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp21m,
        example: SALE_LABEL.k67cpqdv,
        tags: ['pos', SALE_LABEL.k639vgjy],
        key: '1070',
        right: 14,
        bottom: 12,
    },
    {
        title: SALE_LABEL.k5m5auib,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp29y,
        example: SALE_LABEL.k67cpqm7,
        tags: [SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9],
        key: '5010',
        right: 12,
        bottom: 15,
    },
    {
        title: SALE_LABEL.k67b3usc,
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: SALE_LABEL.k67cp2ia,
        example: SALE_LABEL.k67cpquj,
        tags: ['pos'],
        key: '1090',
        right: 18,
        bottom: 1,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3v0o,
        text: SALE_LABEL.k67cp2qm,
        example: SALE_LABEL.k67cpr2v,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        key: '2010',
        right: 14,
        bottom: 5,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3v90,
        text: SALE_LABEL.k67cp2yy,
        example: SALE_LABEL.k67cprb7,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k639vgbm],
        key: '1030',
        right: 16,
        bottom: 11,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3vhc,
        text: SALE_LABEL.k67cp37a,
        example: SALE_LABEL.k67cprjj,
        tags: ['pos', SALE_LABEL.k639vgjy, SALE_LABEL.k5krn6z9, SALE_LABEL.k639vgbm],
        key: '1020',
        right: 19,
        bottom: 7,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3vpo,
        text: SALE_LABEL.k67cp3fm,
        example: SALE_LABEL.k67g7rpg,
        tags: ['pos'],
        key: '1060',
        right: 0,
        bottom: 1,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3vy0,
        text: SALE_LABEL.k67cp3ny,
        example: SALE_LABEL.k67g7rxs,
        tags: ['pos'],
        key: '2040',
        right: 16,
        bottom: 9,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3w6c,
        text: SALE_LABEL.k67cp3wa,
        example: SALE_LABEL.k67g7s64,
        tags: ['pos'],
        key: '2050',
        right: 0,
        bottom: -3,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3weo,
        text: SALE_LABEL.k67cp44m,
        example: SALE_LABEL.k67g7seg,
        tags: ['pos'],
        key: '1040',
        right: 12,
        bottom: 0,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: SALE_LABEL.k67b3wn0,
        text: SALE_LABEL.k67cp4cy,
        example: '',
        tags: ['pos'],
        key: '2080',
        right: 25,
        bottom: 6,
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

