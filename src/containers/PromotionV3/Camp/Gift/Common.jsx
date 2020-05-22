
const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const timeOpts = (() => {
    const list = [{ label: '立即生效', value: '0' }];
    for(let i = 1; i < 25; i++) {
        list.push({ label: `${i}小时生效`, value: `${i}` });
    }
    return list;
})();
const dayOpts = (() => {
    let list = [];
    for(let i = 1; i < 31; i++) {
        list.push({ label: `${i}天后生效`, value: `${i}` });
    }
    return list;
})();

const formKeys1 = ['giftItemID', 'giftCount', 'effectType', 'countType', 'giftEffectTimeHours', 'giftValidUntilDayCount'];
const formKeys2 = ['giftItemID', 'giftCount', 'effectType', 'rangeDate'];
const formItems = {
    giftItemID: {
        type: 'custom',
        label: '礼品名称',
        rules: ['required'],
        render: null,
    },
    giftCount: {
        type: 'text',
        label: '礼品数量',
        surfix: '个',
        rules: [{
            required: true,
            validator: (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    return callback('请输入数字');
                }
                if (+value<1 || +value>50) {
                    return callback('大于0，限制50个');
                }
                return callback();
            },
        }],
    },
    effectType: {
        type: 'radio',
        label: '生效方式',
        defaultValue: '1',
        options: [
            { label: '相对有效期', value: '1' },
            { label: '固定有效期', value: '2' },
        ],
    },
    countType: {
        type: 'radio',
        label: '相对有效期',
        defaultValue: '0',
        options: [
            { label: '按小时', value: '0' },
            { label: '按天', value: '1' },
        ],
    },
    giftEffectTimeHours: {
        type: 'combo',
        label: '生效时间',
        options: timeOpts,
        defaultValue: '0',
    },
    giftValidUntilDayCount: {
        type: 'text',
        label: '有效天数',
        surfix: '天',
        rules: ['required', 'numbers'],
    },
    rangeDate: {
        type: 'datepickerRange',
        label: '固定有效期',
        rules: ['required'],
    },
};

export {
    imgURI, href, formItemLayout,
    formKeys1, formItems, formKeys2,
    timeOpts, dayOpts
}
