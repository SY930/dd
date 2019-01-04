
const releaseENV = HUALALA.ENVIRONMENT == 'production-release';
const GiftCfg = {
    giftType: [
        {
            name: '代金券',
            describe: '抵扣一定面值的券，可通过特色营销发放',
            value: '10',
            color: '#84aac6',
            category: 'primary',
            tags: ['SaaS2.0', '新微信', '微信']
        },
        {
            name: '菜品优惠券',
            describe: '满足条件抵扣实际菜品，关联基础营销使用',
            value: '20',
            color: '#c49b79',
            category: 'primary',
            tags: ['SaaS2.0', '新微信', '微信']
        },
        {
            name: '菜品兑换券',
            describe: '用户可凭借该兑换券直接兑换菜品一份，仅需支付所设置的兑换金额。',
            example: '例如：菜品金额20元，设置的兑换金额为5元，用户只需支付5元就可兑换该菜品。',
            value: '21',
            color: '#c49b79',
            category: 'primary',
            tags: ['SaaS2.0', '新微信', '微信']
        },
        {
            name: '会员充值券',
            describe: '会员获取后，可直接充值到卡赠送余额中',
            value: '40',
            color: '#9dc568',
            category: 'secondary',
            tags: ['SaaS2.0']
        },
        {
            name: '会员积分券',
            describe: '会员获取后，可直接充值到卡积分余额中',
            value: '42',
            color: '#84aac6',
            category: 'secondary',
            tags: ['SaaS2.0']
        },
        {
            name: '会员权益券',
            describe: '会员获取后，可享受折扣，会员价，插队等权益',
            value: '80',
            category: 'secondary',
            color: '#84aac6'
        },
        {
            name: '礼品定额卡',
            describe: '固定额度的实体卡，购买后成为会员卡或用于会员充值',
            value: '90',
            color: '#c49b79',
            category: 'secondary',
            tags: ['SaaS2.0']
        },
        {
            name: '活动券',
            describe: '添加礼品的时候，在礼品信息里面增加券对应的基础营销活动的编码',
            value: '100',
            color: '#c49b79',
            tags: ['SaaS2.0']
        },
        {
            name: '线上礼品卡',
            describe: '用于线上渠道投放的定额礼品卡，支持多平台购买转赠、消费',
            value: '91',
            color: '#84aac6',
            category: 'secondary',
            tags: ['微信小程序']
        },
        {
            name: '折扣券',
            describe: '指定菜品满x元，折扣率为y',
            value: '111',
            category: 'primary',
            tags: ['SaaS2.0', '新微信', '微信'],
            color: '#84aac6'
        },
        {
            name: '买赠券',
            describe: '购买x份A菜品，赠送y份B菜品',
            value: '110',
            category: 'primary',
            tags: ['新微信', '微信'],
            color: '#c49b79'
        },
        {
            name: '实物礼品券',
            describe: '顾客获取后，线下展示券密码验证核销使用',
            value: '30',
            color: '#e5be6c',
            category: 'secondary',
            tags: ['SaaS2.0', '新微信']
        },
    ],
    giftTypeName: [
        { label: '全部', value: '' },
        { label: '代金券', value: '10' },
        { label: '菜品优惠券', value: '20' },
        { label: '菜品兑换券', value: '21' },
        { label: '实物礼品券', value: '30' },
        { label: '会员充值券', value: '40' },
        { label: '会员积分券', value: '42' },
        { label: '会员权益券', value: '80' },
        { label: '礼品定额卡', value: '90' },
        { label: '活动券', value: '100' },
        { label: '线上礼品卡', value: '91' },
        { label: '买赠券', value: '110' },
        { label: '折扣券', value: '111' },
    ],
    transferType: [
        { label: '不可分享', value: 0 },
        { label: '可分享', value: 1 },
        { label: '仅分享后使用', value: 2 },
    ],
    isHolidaysUsing: [
        { label: '不限制', value: '0' },
        { label: '不含节假日', value: '1' },
        { label: '仅节假日', value: '2' },
    ],
    usingTimeType: [
        { label: '早餐', value: '1' },
        { label: '午餐', value: '2' },
        { label: '下午茶', value: '3' },
        { label: '晚餐', value: '4' },
        { label: '夜宵', value: '5' },
    ],
    supportOrderType: [
        { label: '全部支持', value: '2' },
        { label: '堂食', value: '0' },
        { label: '外送', value: '1' },
    ],
    supportOrderTypes: [
        { label: '堂食', value: '0' },
        { label: '外送', value: '1' },
        { label: '自提', value: '2' },
        { label: '闪吃', value: '3' },
        { label: '预定', value: '4' },
    ],
    isOfflineCanUsing: [
        { label: '支持', value: 'true' },
        { label: '不支持', value: 'false' },
    ],
    shareType: [
        { label: '与所有券共用', value: '1' },
        { label: '与部分券共用', value: '2'},
        { label: '不共用', value: '0'},
    ],
    moneyLimitType: [
        { label: '不限', value: '0' },
        { label: '每满', value: '1' },
        { label: '满', value: '2' },
    ],
    isFoodCatNameList: [
        { label: '按菜品', value: '0' },
        { label: '按分类', value: '1' },
    ],
    isSynch: [ // 查券时是否优先读取券模板
        { label: '券信息以发出时数据为准', value: false },
        { label: '券信息以当前数据为准', value: true },
    ],
    getWay: [
        { value: '', label: '全部' },
        { value: '10', label: '消费返券', include: true },
        { value: '20', label: '摇奖活动', include: true },
        { value: '30', label: '积分摇奖', include: true },
        { value: '40', label: '积分兑换', include: true },
        { value: '50', label: '订单摇奖' },
        { value: '60', label: '免费领取', include: true },
        { value: '61', label: '消费红包' },
        { value: '62', label: '营销红包' },
        { value: '70', label: '商家赠送' },
        { value: '71', label: '会员推荐奖励' },
        { value: '80', label: '商家支付', include: true },
        { value: '90', label: '商家卖出', include: true },
        { value: '91', label: '会员摇奖' },
        { value: '92', label: '免费领取' },
        { value: '93', label: '积分兑换' },
        { value: '94', label: '参与活动' },
        { value: '95', label: '有奖竞猜' },
        { value: '96', label: '套餐充值' },
        { value: '97', label: '会员开卡送礼品' },
        { value: '98', label: '会员生日赠送' },
        { value: '99', label: '群发礼品' },
        { value: '100', label: '批量导入' },
        { value: '101', label: '购买权益包' },
        { value: '102', label: '消费赠送' },
        { value: '103', label: '商城售卖' },
        { value: '112', label: '完善资料送礼' },
        { value: '111', label: '升级送礼' },
        { value: '113', label: '累计消费送礼' },
        { value: '114', label: '线上餐厅送礼' },
        { value: '115', label: '微信购买领取' },
        { value: '116', label: '微信受赠领取' },
        { value: '117', label: '唤醒送礼' },
        { value: '118', label: '评价送礼' },
        { value: '120', label: '关注送礼' },
        { value: '3010', label: '基础营销消费返券' },
        { value: '3011', label: '批量生成' },
    ],
    giftSendStatus: [
        { value: '', label: '全部' },
        { value: '1', label: '可使用' },
        { value: '2', label: '已使用' },
        { value: '3', label: '已过期' },
        { value: '4', label: '已退订' },
        { value: '5', label: '已失效' },
        { value: '13', label: '已作废' },
        { value: '99', label: '已删除' },
    ],
    giftCardStatus: [
        { value: '', label: '全部' },
        { value: '11', label: '已制卡' },
        { value: '12', label: '已售出' },
        { value: '13', label: '已作废' },
        { value: '99', label: '已充值' },
    ],
    WXgiftCardStatus: [ // 线上礼品卡
        { value: '', label: '全部' },
        { value: '0', label: '待激活' },
        { value: '1', label: '可使用' },
        { value: '2', label: '转赠中' },
        { value: '3', label: '过期' },
        { value: '4', label: '注销 ' },
    ],
    giftUsedStatus: [
        { value: '', label: '全部' },
        { value: '1', label: '待处理' },
        { value: '2', label: '正在生成' },
        { value: '3', label: '已过期' },
        { value: '4', label: '已完成' },
    ],
    giftQuotaSendStatus: [
        { value: '', label: '全部' },
        { value: '1', label: '新建' },
        { value: '2', label: '准备' },
        { value: '3', label: '正在生成' },
        { value: '4', label: '已完成' },
    ],
    payWayName: [
        { value: '', label: '全部' },
        { value: '人民币', label: '人民币' },
        { value: '银行卡', label: '银行卡' },
        { value: '支票', label: '支票' },
        { value: '微信', label: '微信' },
        { value: '支付宝', label: '支付宝' },
        { value: '京东', label: '京东' },
        { value: '其它', label: '其它' },
    ],
    sex: [
        { value: '1', label: '男' },
        { value: '0', label: '女' },
        { value: '2', label: '未知' },
    ],
    trdChannelIDs: [
        { label: '微信优惠券', value: 10 },
        { label: '饮食通', value: 2, disabled: releaseENV },
        { label: '雅座', value: 3, disabled: releaseENV },
        { label: '眉州', value: 4, disabled: releaseENV },
        { label: '5i', value: 5, disabled: releaseENV },
        { label: '拉格代尔', value: 6, disabled: releaseENV },
        { label: '非码', value: 20 },
        { label: '企迈小程序', value: 30 },
    ],
    couponCodeType: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
    ],
    isNeedCustomerInfo: [
        { value: false, label: '不需要' },
        { value: true, label: '需要' },
    ],
}

export default GiftCfg
