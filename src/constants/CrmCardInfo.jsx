export const customerType = [
    {value:'1',label:'普通用户'},
    {value:'2',label:'会员卡'},
    //{value:'3',label:'协议单位'},
];

export const  cardStatus = [
    {value:'10',label:'正常'},
    {value:'20',label:'挂失中'},
    {value:'30',label:'冻结'},
    {value:'40',label:'注销'},
    {value:'50',label:'过期'},
];

export const  queryCardStatus = [
    {value:'',label:'全部'},
    {value:'10',label:'正常'},
    {value:'20',label:'挂失中'},
    {value:'30',label:'冻结'},
    {value:'40',label:'注销'},
    {value:'50',label:'过期'},
];

export const status = [
    {value:'0',label:'全部'},
    {value:'1',label:'1'},
    {value:'2',label:'2'}
];

export const grade = [
    {value:'0',label:'0'},
    {value:'1',label:'1'},
    {value:'2',label:'2'}
];

export const sex = [
    {value:'1',label:'男'},
    {value:'0',label:'女'},
    {value:'2',label:'未知'}
];

export const protocolUnitType = [
    {value:'0',label:'0'},
    {value:'1',label:'1'},
    {value:'2',label:'2'}
];

export const IDCardType = [
    {value:'1',label:'身份证'},
    {value:'2',label:'军官证'},
    {value:'3',label:'护照'},
    {value:'4',label:'警察证'},
    {value:'5',label:'其它'}
];

export const adjustType = [
    {value:'40',label:'储值类调账'},
    {value:'41',label:'消费类调账'},
];

export const giftEntryTime = [
    {value:'0',label:'立即生效'},
    {value:'1',label:'1'},
    {value:'2',label:'2'}
];

export const transType = [
    {value:'',label:'全部'},
    {value:'10',label:'初始转入'},
    {value:'11',label:'入会办卡'},
    {value:'20',label:'储值'},
    {value:'21',label:'套餐购买礼包'},
    {value:'22',label:'退菜反冲值'},
    {value:'30',label:'消费'},
    {value:'31',label:'支付'},
    {value:'40',label:'储值类调账'},
    {value:'41',label:'消费类调账'},
    {value:'50',label:'活动赠积分'},
    {value:'51',label:'推荐奖励'},
    {value:'60',label:'积分兑换'},
    {value:'70',label:'积分清零'},
    {value:'80',label:'活动赠余额'},
    {value:'90',label:'消费撤销'},
    {value:'91',label:'销卡退款'},
    {value:'92',label:'退款'},
];

export const payType = [
    {value:'0',label:'现金'},
    {value:'1',label:'银行卡'},
    {value:'2',label:'支付宝'},
];

export const cardLevel = [
    {value:'0',label:'可挂账'},
    {value:'1',label:'银行卡'},
    {value:'2',label:'支付宝'},
];

export const effectTimeHours = [
    {label: '立即生效',value: '0',},
    {label: '次日零点生效',value: '-1'},
    {label: '3小时',value: '3'},
    {label: '6小时',value: '6'},
    {label: '9小时',value: '9'},
    {label: '12小时',value: '12'},
    {label: '18小时',value: '18'},
    {label: '1天',value: '24'},
    {label: '2天',value: '48'},
    {label: '3天',value: '72'},
    {label: '7天',value: '168'},
    {label: '10天',value: '240'},
    {label: '15天',value: '360'},
    {label: '20天',value: '480'},
    {label: '25天',value: '600'},
    {label: '30天',value: '720'},
    {label: '45天',value: '1080'},
    {label: '60天',value: '1440'},
];

export const effectType = [
    {label:'相对有效期',value:'1'},
    {label:'固定有效期',value:'2'}
];

export const isReturn = [
    {value:'',label:'全部'},
    {value:'1',label:'未返还'},
    {value:'2',label:'已返还'},
    {value: '3', label: '失败'}
]