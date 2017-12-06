import Cfg from '../../../constants/CrmOperationCfg_dkl';

export const FORM_ITEMS = {
    transWay: {
        type: 'radio',
        label: '充值方式',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请选择充值方式',
        options: Cfg.rechargeWay,
        defaultValue: 'false',
    },
    subjectName: {
        type: 'radio',
        label: '付款方式',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入会员卡号或手机号',
        options: Cfg.paymentWay,
        defaultValue: '0',
    },
    invoiceFlag: {
        type: 'radio',
        label: '是否开发票',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入会员卡号或手机号',
        options: Cfg.isInvoice,
        defaultValue: 'false',
    },
    invoiceConsumFlag: {
        type: 'radio',
        label: '是否开发票',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入会员卡号或手机号',
        options: Cfg.isInvoice,
        defaultValue: 'false',
    },
    invoiceNO: {
        type: 'text',
        label: '发票单号',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入发票单号',
    },
    kaipiaojine: {
        type: 'text',
        label: '开票金额',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入开票金额',
        surfix: '元',
    },
    transRemark: {
        type: 'textarea',
        label: '备注信息',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入备注信息',
    },
    refundMoneyAmount: {
        type: 'text',
        label: '退现金卡值',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入退现金卡值',
        surfix: '元',
        rules: [{
            required: true, message: '请输入退现金卡值'
        }, {
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    refundGiveAmount: {
        type: 'text',
        label: '减赠送卡值',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入减赠送卡值',
        surfix: '元',
        rules: [{
            required: true, message: '请输入减赠送卡值'
        }, {
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    refundPointAmount: {
        type: 'text',
        label: '扣除积分',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入扣除积分',
        surfix: '分',
        rules: [{
            required: true, message: '请输入扣除积分'
        }, {
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    newCardNO: {
        type: 'text',
        label: '更换后卡号',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入更换后卡号',
        rules: [{
            required: true, message: '请输入更换后卡号'
        }],
    },
    cardFee: {
        type: 'text',
        label: '换卡工本费',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入换卡工本费',
        surfix: '元',
        rules: [{
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    jiesuanzhuotai: {
        type: 'text',
        label: '结算桌台',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入结算桌台',
    },
    zhangdanrenshu: {
        type: 'text',
        label: '账单人数',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入账单人数',
        surfix: '人',
    },
    deductMoneyAmount: {
        type: 'text',
        label: '卡结金额',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入卡结金额',
        surfix: '元',
        rules: [{
            required: true, message: '请输入卡结金额'
        }, {
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }],
    },
    deferType: {
        type: 'radio',
        label: '延期方式',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        options: Cfg.yanqifangshi,
        defaultValue: '1',
    },
    deferToDate: {
        label: '选择日期',
        type: 'datepicker',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请选择日期',
        rules: [{
            required: true, message: '请选择延期日期',
        }]
    },
    deferDays: {
        type: 'text',
        label: '延期天数',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入延期天数',
        surfix: '天',
        rules: [{
            required: true, message: '请选择延期天数',
        }, {
            pattern: /^(([1-9]\d{0,4}))?$/,
            message: '必须是大于0的5位整数',
        }]

    },
    startCardNO: {
        type: 'text',
        label: '起始卡号',
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
        placeholder: '请输入起始卡号',
        rules: [{
            required: true, message: '请输入起始卡号',
        }, {
            pattern: /^(([1-9]\d{0,7}))?$/,
            message: '必须是大于0的8位整数',
        }]
    },
    endCardNO: {
        type: 'text',
        label: '终止卡号',
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
        placeholder: '请输入终止卡号',
        rules: [{
            required: true, message: '请输入终止卡号',
        }, {
            pattern: /^(([1-9]\d{0,7}))?$/,
            message: '必须是大于0的8位整数',
        }]
    },
    transType: {
        type: 'radio',
        label: '调账类型',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        options: Cfg.tiaozhangleixing,
    },
    adjustMoneyBalance: {
        type: 'text',
        label: '现金卡值调整',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入现金卡值调整数值',
        surfix: '元',
        rules: [{
            pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    adjustGiveBalance: {
        type: 'text',
        label: '赠送卡值调整',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入赠送卡值调整数值',
        surfix: '元',
        rules: [{
            pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    adjustPointBalance: {
        type: 'text',
        label: '积分调整',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入积分调整数值',
        surfix: '分',
        rules: [{
            pattern: /^[+-]?\d{1,8}$/,
            message: '必须是整数部分不超过8位',
        }]
    },
    visiable: {
        type: 'switcher',
        label: '用户是否可见',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
    },
    smsContent: {
        type: 'textarea',
        label: '短信通知用户',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入短信用户',
    },
    creditAmount: {
        type: 'text',
        label: '调整额度',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入调整额度金额数量',
        surfix: '元',
        rules: [{
            required: true, message: '请输入调账额度'
        }, {
            pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
            message: '必须是整数部分不超过8位且小数部分不超过2位的数',
        }]
    },
    oldCardPWD: {
        type: 'password',
        label: '请输入原密码',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入原密码',
        rules: [{
            required: true, message: '请输入原密码',
        }]
    },
    invoiceNum: {
        type: 'text',
        label: '发票单号',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入发票单号',
        // surfix: '元',
    },
    invoiceTitle: {
        type: 'text',
        label: '发票抬头',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入发票抬头',
    },
    taxNum: {
        type: 'text',
        label: '纳税人识别号',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入纳税人识别号',
        // surfix: '元',
    },
    remark: {
        type: 'textarea',
        label: '备注',
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
        placeholder: '请输入备注信息',
    },
};
