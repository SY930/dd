const CrmRechargePackageCfg = {
    isActive: [
        { value: '', label: '全部' },
        { value: 'true', label: '开启' },
        { value: 'false', label: '未开启' },
    ],
    isSellGift: [
        { value: '', label: '全部' },
        { value: 'false', label: '套餐' },
        { value: 'true', label: '权益包' },
        { value: '-1', label: '未来权益套餐' },
    ],
    validState: [
        { value: '', label: '全部' },
        { value: '1', label: '执行中' },
        { value: '2', label: '已结束' },
        { value: '3', label: '未开始' },
    ],
    isOpen: [
        { value: '0', label: '仅线下可用' },
        { value: '1', label: '线上、线下均可' },
        { value: '2', label: '仅线上可用' },
    ],
    futureRightsType: [
        { value: '1', label: '第二天返还第一天充值冻结金额' },
        { value: '2', label: '固定天数返赠' },
    ],
    shengxiaofangshi: [
        { value: '1', label: '相对有效期' },
        { value: '2', label: '固定有效期' },
    ],
    EGiftEffectTimeHoursOptions: [
        { 'value': '0', 'label': '立即生效' },
        // {'value':'-1',label:'次日有效'},
        { 'value': '3', 'label': '3小时' },
        { 'value': '6', 'label': '6小时' },
        { 'value': '9', 'label': '9小时' },
        { 'value': '12', 'label': '12小时' },
        { 'value': '24', 'label': '1天' },
        { 'value': '48', 'label': '2天' },
        { 'value': '72', 'label': '3天' },
        { 'value': '168', 'label': '7天' },
        { 'value': '240', 'label': '10天' },
        { 'value': '360', 'label': '15天' },
        { 'value': '480', 'label': '20天' },
        { 'value': '600', 'label': '25天' },
        { 'value': '720', 'label': '30天' },
        { 'value': '1080', 'label': '45天' },
        { 'value': '1440', 'label': '60天' },

    ],
    giftType: [
        { label: '电子代金券', value: '10' },
        { label: '菜品优惠券', value: '20' },
        { label: '菜品兑换券', value: '21' },
        { label: '实物礼品券', value: '30' },
        { label: '会员充值券', value: '40' },
        { label: '会员积分券', value: '42' },
        { label: '会员权益券', value: '80' },
        { label: '礼品定额卡', value: '90' },
    ],
}
export default CrmRechargePackageCfg
