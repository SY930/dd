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
}

/**
 * 会员拉新
 * @type {Array}
 */
export const NEW_CUSTOMER_PROMOTION_TYPES = [
    {
        title: '分享裂变',
        isSpecial: true,
        tags: ['小程序'],
        text: '活动可以分享给好友，好友参与后可获得礼品，属于分享裂变,有利于获得新用户',
        example: '',
        key: '65',
        right: 13,
        bottom: 3,
    },
    {
        title: '膨胀大礼包',
        isSpecial: true,
        tags: ['小程序'],
        text: '参与活动领礼品，邀请好友助力礼品更丰厚',
        example: '',
        key: '66',
        right: 16,
        bottom: 2,
    },
    {
        title: '桌边砍',
        isSpecial: true,
        text: '针对买单环节发起邀请同行好友砍价，沉淀高价值的到店用户',
        example: '',
        key: '67',
        right: 13,
        bottom: 1,
    },
    {
        title: '推荐有礼',
        isSpecial: true,
        isNew: true,
        tags: ['新微信'],
        text: '老客户推荐新用户，双方都能拿到礼品返还，适合长期会员拉新使用',
        example: '',
        key: '68',
        right: 11,
        bottom: 0,
    },
    {
        title: '免费领取',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: ['微信', '小程序'],
        text: '限时免费领取礼品，达到短期拉新的效果',
        example: '',
        key: '21',
        right: 17,
        bottom: 0,
    },
    {
        title: '关注送礼',
        isSpecial: true,
        text: '用户关注公众号后，商户可设置赠送代金券等礼品，有利于增加会员关注数',
        example: '',
        key: '31',
        right: 13,
        bottom: 0,
    },
    {
        title: '线上餐厅送礼',
        isSpecial: true,
        tags: ['新微信', '微信', '小程序'],
        text: '点菜界面自动弹出领取，这也是增加会员注册量的一种手段。',
        example: '',
        key: '23',
        right: 16,
        bottom: 0,
    },
    {
        title: '开卡赠送',
        isSpecial: true,
        text: '开启开卡赠送礼品，可以带来更多的新客户',
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
        title: '摇奖活动',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: ['微信', '小程序'],
        text: '人人都希望中奖，意外的礼品总是刺激着顾客的就餐神经',
        example: '',
        key: '20',
        right: 16,
        bottom: 6,
    },
    {
        title: '评价送礼',
        tags: ['新微信', '小程序'],
        isSpecial: true,
        text: '客户消费完毕后有可对消费的订单评价，评价后可获取一定的奖励',
        example: '',
        key: '64',
        right: 19,
        bottom: 6,
    },
    {
        title: '报名活动',
        isSpecial: true,
        tags: ['微信'],
        text: '通过报名设置，筛选企业不同价值的客户',
        example: '',
        key: '22',
        right: 0,
        bottom: 0,
    },
    {
        title: '随机立减',
        isSpecial: false,
        tags: ['pos', '新微信', '微信'],
        text: '消费满X元随机立减一定金额,顾客可获得幸福感',
        example: '例如:消费满100元随机立减1-5元',
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
        title: '群发礼品',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '在最恰当的时间，送去最温馨的优惠礼品，顾客倍感惊喜',
        example: '',
        key: '53',
        right: 3,
        bottom: 0,
    },
    {
        title: '群发短信',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '群发短消息，将问候和优惠及时传递给你的每一位顾客',
        example: '',
        key: '50',
        right: 13,
        bottom: 6,
    },
    {
        title: '消费返礼品',
        tags: ['pos', '新微信', '微信', '小程序'],
        isSpecial: false,
        text: '消费后获得奖励将使顾客下次光临的时间大大提前',
        example: '例如:消费满100元送1张10元代金券',
        key: '3010',
        right: 17,
        bottom: 7,
    },
    {
        title: '消费返积分',
        tags: ['pos', '新微信', '微信', '小程序'],
        isSpecial: false,
        text: '会员消费满X元送积分,积分可兑换礼品或抵现',
        example: '例如:消费每满1元返1分',
        key: '3020',
        right: 13,
        bottom: 3,
    },
    {
        title: '积分兑换',
        tags: ['微信'],
        isSpecial: true,
        text: '顾客可以使用积分兑换相应的礼品，增加顾客的消费黏性',
        example: '',
        key: '30',
        right: 18,
        bottom: 8,
    },
    {
        title: '累计次数赠送',
        tags: ['pos'],
        isSpecial: false,
        text: '提高老客户忠诚度，开展累计消费次数赠送的活动',
        example: '例如:累计消费2次赠送A菜，累计消费3次赠送B菜',
        key: '1080',
        right: 6,
        bottom: 13,
    },
    {
        title: '累计次数减免',
        tags: ['pos'],
        isSpecial: false,
        text: '提高老客户忠诚度，开展累计消费次数减免的活动',
        example: '例如:累计消费2次减免2元，累计消费3次减免5元',
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
        title: '生日赠送',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '生日总要HAPPY一下，此时赠送礼品恰到好处的吸引客户进店消费',
        example: '',
        key: '51',
        right: 11,
        bottom: 7,
    },
    {
        title: '唤醒送礼',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '统计会员即将流失的天数，针对即将流失的会员，可以选择发送礼品和发送信息',
        example: '',
        key: '63',
        right: 19,
        bottom: 0,
    },
    {
        title: '累计消费送礼',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '当客人消费达到累计的次数或者金额后，商家能够赠送相应的礼品，客人体验感会更好',
        example: '',
        key: '62',
        right: 13,
        bottom: 11,
    },
    {
        title: '升级送礼',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '选择升级后的会员等级为某等级，升级后是这个等级中的，赠送礼品',
        example: '',
        key: '61',
        right: 29,
        bottom: 2,
    },
    {
        title: '完善资料送礼',
        isSpecial: true, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        tags: ['小程序'],
        text: '获取会员更详细的资料，例如生日，住址，手机号，邮箱等资料，与会员建立更多维度的维系渠道',
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
        title: '折扣',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '可设置显示账单折扣,菜品折扣',
        example: '例如:全部菜品9折,酒水不打折',
        tags: ['pos', '新微信', '微信'],
        key: '2020',
        right: 2,
        bottom: -14,
    },
    {
        title: '特价菜',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '直接降价促销',
        example: '例如:周一凉菜类会员立减10元',
        tags: ['pos', '新微信', '微信'],
        key: '1010',
        right: 10,
        bottom: 0,
    },
    {
        title: '团购活动',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '对接美团点评团购券,并拆分券实收和优惠金额',
        example: '',
        key: '4010',
        tags: ['pos'],
        right: -5,
        bottom: 0,
    },
    {
        title: '第二份打折',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '更实在的折扣优惠,常用于情侣消费,朋友消费',
        example: '例如:午餐12点-13点可乐第二份8折,第三份半价',
        tags: ['pos'],
        key: '1050',
        right: 15,
        bottom: 5,
    },
    {
        title: '加价换购',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '任意或指定消费满X元再加Y元即可换购指定菜品',
        example: '例如:任意消费满100元加10元即可换购土豆丝一份',
        tags: ['pos', '新微信'],
        key: '1070',
        right: 14,
        bottom: 12,
    },
    {
        title: '菜品推荐',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '向用户推荐菜品，提高目标菜品曝光率和客单价',
        example: '例如:客户点A菜推荐B菜，点C菜推荐D菜和F菜',
        tags: ['新微信', '微信'],
        key: '5010',
        right: 12,
        bottom: 15,
    },
    {
        title: '加价升级换新',
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        text: '加价升级换新是区别加价换购的一个营销活动',
        example: '例如:消费满88元，点中杯拿铁，加2元，可升级成大杯拿铁',
        tags: ['pos'],
        key: '1090',
        right: 18,
        bottom: 1,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '满减/每满减',
        text: '顾客只要消费满一定金额即可得到一定的减价优惠',
        example: '例如:菜金满100减10元/酒水每满100减5元',
        tags: ['pos', '新微信', '微信', '小程序'],
        key: '2010',
        right: 14,
        bottom: 5,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '满赠/每满赠',
        text: '顾客消费满足条件,商家即赠送菜品',
        example: '例如:菜金满100赠可乐一瓶',
        tags: ['pos', '新微信', '小程序'],
        key: '1030',
        right: 16,
        bottom: 11,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '买赠',
        text: '顾客买X赠送Y,常用于单品推新的促销和曝光度',
        example: '例如:点新菜品2份以上可免费送可乐一瓶',
        tags: ['pos', '新微信', '微信', '小程序'],
        key: '1020',
        right: 19,
        bottom: 7,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '买三免一',
        text: '消费满X份菜品即可在X中免单Y份最低价菜品',
        example: '例如:消费满4份热菜即可在4份中免单最低价的1份',
        tags: ['pos'],
        key: '1060',
        right: 0,
        bottom: 1,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '买减/买折',
        text: '购买一定份数的指定菜品可享受相应折扣或减价',
        example: '例如:购买1份土豆丝+1份黄瓜即可打9折或减价3元',
        tags: ['pos'],
        key: '2040',
        right: 16,
        bottom: 9,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '组合减免/折扣',
        text: '购买X组菜品组合即可享受相应折扣或减价',
        example: '例如:购买任意两组菜品组合即可打9折或减价3元',
        tags: ['pos'],
        key: '2050',
        right: 0,
        bottom: -3,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '搭赠',
        text: '购买指定菜品组合时可搭配赠送指定菜品',
        example: '例如:购买土豆与茄子组合即可赠送西红柿',
        tags: ['pos'],
        key: '1040',
        right: 12,
        bottom: 0,
    },
    {
        isSpecial: false, // 表示活动是否是特色营销活动(false 则为基础营销活动)
        title: '低价促销',
        text: '消费一定的菜品, 可对价格最低菜品进行减免、折扣、特定售价等优惠活动',
        example: '',
        tags: ['pos'],
        key: '2080',
        right: 25,
        bottom: 6,
    },
];

export const WECHAT_MALL_ACTIVITIES = [
    {
        title: '商城秒杀',
        color: '#84aac6',
        text: '在微信商城可设置商品限时限量购的秒杀活动',
        example: '',
        tags: ['微信商城'],
        key: '72',
    },
    {
        title: '拼团活动',
        color: '#84aac6',
        text: '邀请好友来拼团，也可直接购买',
        example: '',
        tags: ['微信商城'],
        key: '71',
    },
    {
        title: '消费返积分',
        color: '#84aac6',
        text: '邀请好友来拼团，也可直接购买',
        example: '',
        tags: ['微信商城'],
        key: '73',
    },
];
/**
 * 线上营销
 * @type {Array}
 */
export const ONLINE_PROMOTION_TYPES = [
    {
        title: '满减活动',
        isSpecial: false,
        text: '用户下单满足条件后可享受减免优惠',
        desc: `
            用户下单满足条件后可享受减免优惠; 与特价菜活动互斥，不可同享;\r\n
            同一时间如果有多个满减活动，仅执行一个活动，优先执行「活动创建日期较早」的活动
        `,
        tags: ['小程序'],
        key: '2060',
        right: 14,
        bottom: 5,
    },
    {
        title: '特价商品',
        isSpecial: false,
        text: '用户购买指定商品可享受特价优惠',
        desc: `
            用户购买指定商品可享受特价优惠;\r\n
            活动不与满减同享;\r\n
            同一时间同一商品只能参与一个特价活动。如果同一时间同一商品设置有多个特价活动，则按「活动创建日期较早」的活动设置价格参与;`,
        tags: ['小程序'],
        key: '1100',
        right: 10,
        bottom: 0,
    },
];

