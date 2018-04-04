export const FORMITEM_CONFIG = {
    batchNO: {
        label: '批次号',
        type: 'text',
        placeholder: '请输入批次号',
        rules: [{ required: true, message: '批次号不能为空' },
        { type: 'integer', message: '批次号必须为整数', transform: value => Number(value) },
        {
            validator: (rule, v, cb) => {
                if (v === '') cb();
                if (v > 0 && v < 999999) {
                    cb()
                } else { cb(rule.message); }
            },
            message: '批次号必须是1-999999之间的值',
        }],
    },
    startEnd: {
        label: '起止号',
        type: 'custom',
        render(decorator, form) {
            this.renderStartEnd.bind(this, decorator, form)
        },
    },
    price: {
        label: '售价',
        type: 'text',
        surfix: '元',
        placeholder: '请输入售价',
        rules: [
            {
                pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
                message: '必须是整数部分不超过8位且小数部分不超过2位的数',
            }, {
                required: true, message: '售价不能为空',
            },
        ],
    },
    useCardTypeID: {
        label: '会员卡类型',
        type: 'combo',
        defaultValue: '',
        // options: cardList,
        props: {
            showSearch: true,
        },
        rules: [
            { required: true, message: '会员卡类型不能为空' },
        ],
    },
    useCardLevelID: {
        label: '等级',
        type: 'combo',
        defaultValue: '',
        // options: levelList,
        props: {
            showSearch: true,
        },
        rules: [
            { required: true, message: '会员卡等级不能为空' },
        ],
    },
    transRemark: {
        label: '备注',
        type: 'textarea',
        placeholder: '请输入备注信息',
        rows: 2,
    },
};
