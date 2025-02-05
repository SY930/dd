
const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const timeOpts = (() => {
    const list = [{ label: '立即生效', value: '0' }];
    for (let i = 1; i < 25; i++) {
        list.push({ label: `${i}小时生效`, value: `${i}` });
    }
    return list;
})();
const dayOpts = (() => {
    const list = [{ label: '立即生效', value: '0' }];
    for (let i = 1; i < 31; i++) {
        list.push({ label: `${i}天后生效`, value: `${i}` });
    }
    let extraList = [{label: '40天后生效', value: '40'}, {label: '50天后生效', value: '50'}, {label: '60天后生效', value: '60'}]
    return [...list, ...extraList];
})();

const formKeys1 = ['giftID', 'giftIDNumber','giftCount', 'effectType', 'countType', 'giftEffectTimeHours', 'giftValidUntilDayCount'];
const formKeys2 = ['giftID', 'giftIDNumber','giftCount', 'effectType', 'rangeDate'];
const formItems = {
    giftID: {
        type: 'custom',
        label: '礼品名称',
        rules: ['required'],
        render: null,
    },
    giftIDNumber: {
        type: 'text',
        label: '礼品ID',
        disabled: true,
        defaultValue: ' ',
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
                if (+value < 1 || +value > 50) {
                    return callback('大于0，限制50个');
                }
                return callback();
            },
        }],
        disabled: true,
        defaultValue: '1',
    },
    effectType: {
        type: 'radio',
        label: '生效方式',
        defaultValue: '1',
        options: [
            { label: '相对有效期', value: '1' },
            { label: '固定有效期', value: '2' },
        ],
        disabled: true,
    },
    countType: {
        type: 'radio',
        label: '相对有效期',
        defaultValue: '1',
        options: [
            { label: '按小时', value: '0' },
            { label: '按天', value: '1' },
        ],
        disabled: true,
    },
    giftEffectTimeHours: {
        type: 'combo',
        label: '生效时间',
        options: timeOpts,
        defaultValue: '0',
        disabled: true,
    },
    giftValidUntilDayCount: {
        type: 'text',
        label: '有效天数',
        surfix: '天',
        // rules: ['required', 'numbers'],
        disabled: true,
    },
    rangeDate: {
        type: 'datepickerRange',
        label: '固定有效期',
        rules: ['required'],
        disabled: true,
    },
};

export {
    imgURI, href, formItemLayout,
    formKeys1, formItems, formKeys2,
    timeOpts, dayOpts,
}
