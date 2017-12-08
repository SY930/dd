const CrmOperationCfg = {
  operationTypeCfg: [
    {abbreviation: '充值', name: '会员卡充值', type: 'recharge', color: '#84aac6',describe: '您可以使用固定套餐与任意金额两种方式为会员卡充值金额', },
    {abbreviation: '退卡', name: '会员卡退款', type: 'recede', color: '#c49b79', describe: '您可以使用此功能将会员卡中余额以任意金额的方式退款'},
    // {abbreviation: '量充', name: '批量充值', type: 'batchRecharge', color: '#e5be6c',describe: '您可以依照起止卡号为区间内的所有会员卡充值相同金额', },
    // {abbreviation: '量制', name: '批量制卡', type: 'batchMake', color: '#9dc568', describe: '您可以使用总部权限设置起止卡号批量生成会员卡'},
    {abbreviation: '激活', name: '会员卡激活', type: 'active', color: '#84aac6', describe: '您可以使用此功能激活状态为挂失或冻结的会员卡'},
    {abbreviation: '挂失', name: '会员卡挂失', type: 'lose', color: '#84aac6', describe: '您可以使用此功能挂失遗失的会员卡，挂失期间会员卡所有功能不可使用'},
    {abbreviation: '冻结', name: '会员卡冻结', type: 'freeze', color: '#c49b79', describe: '您可以使用此功能冻结会员卡，冻结期间会员卡所有功能不可使用'},
    {abbreviation: '注销', name: '会员卡注销', type: 'cancelled', color: '#e5be6c', describe: '您可以使用此功能将会员卡注销，注销后该卡号永久作废'},
    {abbreviation: '换卡', name: '会员卡换卡', type: 'change', color: '#9dc568', describe: '您可以使用此功能将旧会员卡更换为新会员卡'},
    {abbreviation: '改密', name: '卡密码修改', type: 'modifyPassWord', color: '#84aac6', describe: '您可以使用原密码为会员卡更改新密码'},
    {abbreviation: '重置', name: '卡密码重置', type: 'resetPassword', color: '#84aac6', describe: '您可以使用此功能将会员卡密码直接重置为初始密码：888888'},
    {abbreviation: '消费', name: '会员卡消费', type: 'consumption', color: '#c49b79', describe: '您可以使用此功能记录会员卡的真实消费'},
    {abbreviation: '调帐', name: '会员卡调帐', type: 'adjustment', color: '#e5be6c', describe: '您可以使用财务权限为会员卡调整储值与消费金额，慎重操作'},
    {abbreviation: '延期', name: '会员卡延期', type: 'postpone', color: '#9dc568', describe: '您可以使用有效期延至与原有效期顺延两种方式为单个会员卡延期'},
    {abbreviation: '批延', name: '会员卡批量延期', type: 'batchPostpone', color: '#84aac6', describe: '您可以依照起止卡号为区间内的所有会员卡延长相同有效期'},
    {abbreviation: '调额', name: '调整挂账额度', type: 'adjustQuota', color: '#84aac6', describe: '您可以使用此功能增加或减少会员卡的挂账额度'},
    // {abbreviation: '发票', name: '开发票', describe: '您可以使用此功能为会员卡的储值信息记录发票', type: 'invoice', color: '#c49b79'},

  ],
  // 10：正常　20：挂失中　30：冻结　40：注销（作废）
  cardStatus: [
      {value:'10',label:'正常'},
      {value:'20',label:'挂失中'},
      {value:'30',label:'冻结'},
      {value:'40',label:'注销'},
      {value:'50',label:'过期'},
  ],
  rechargeWay: [
    {value : 'false', label : "任意金额"},
    {value : 'true', label : "充值套餐"},
  ],
  paymentWay: [
    {value:'0',label:'现金'},
    {value:'1',label:'银行卡'},
    {value:'2',label:'支票'},
    {value:'3',label:'其他'},
  ],
  isInvoice: [
    {value:'false',label:'否'},
    {value:'true',label:'是'},
  ],
  yanqifangshi: [
    {value:'1',label:'有效期延至'},
    {value:'2',label:'原有效期顺延'},
  ],
  zhikahouzhuangtai: [
    {value:'true',label:'正常'},
    {value:'false',label:'冻结'},
  ],
  tiaozhangleixing: [
    {value:'40',label:'充值调账'},
    {value:'41',label:'消费调账'},
  ],
  operationTypeKeys: [
    // {type: 'recharge', keys: ['shopID','transWay','transAmount','transReturnMoneyAmount','transReturnPointAmount','payWayName','invoiceFlag','transRemark']},
    {type: 'recharge', keys: ['shopID','transWay','transAmount','transReturnMoneyAmount','transReturnPointAmount','payWayName','transRemark']},
    {type: 'recede', keys: ['shopID','transAmount','transReturnMoneyAmount','transReturnPointAmount','transRemark']},
    {type: 'active', keys: ['shopID']},
    {type: 'freeze', keys: ['shopID']},
    {type: 'lose', keys: ['shopID']},
    // {type: 'cancelled', keys: ['shopID','transAmount']},
    {type: 'cancelled', keys: ['shopID']},
    {type: 'change', keys: ['shopID','newCardNoOrMobile','cardFee']},
    {type: 'consumption', keys: ['shopID','deductMoneyAmount','transTime','invoiceFlag','transRemark']},
    {type: 'postpone', keys: ['deferType','deferToDate']},
    {type: 'batchPostpone', keys: ['startCardNO','endCardNO','deferType','deferToDate']},
    {type: 'adjustment', keys: ['transType','adjustMoneyBalance','adjustGiveBalance','adjustPointBalance','shopID','visiable','smsContent']},
    {type: 'adjustQuota', keys: ['originCreditAmount','creditAmount']},
    {type: 'modifyPassWord', keys: ['oldCardPWD','cardPWD','newCardPWD']},
    {type: 'resetPassword', keys: []},
    {type: 'invoice', keys: ['shopID','fapiaodanhao','fapiaodanhao','transRemark']},
  ]
}

export default CrmOperationCfg
