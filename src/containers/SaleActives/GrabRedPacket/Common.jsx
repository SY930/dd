
const bizOpts = [
    { label: '预订', value: '10' },
    { label: '闪吃', value: '11' },
    { label: '外送', value: '20' },
    { label: '堂食', value: '31' },
    { label: '自提', value: '21' },
];
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};
const formItems2 = {
    brandList: {
        type: 'combo',
        label: '品牌',
        placeholder: '请选择品牌，不选默认全部品牌可用',
        multiple: true,
        options: [],
        defaultValue: [],
    },
    orderTypeList: {
        type: 'checkbox',
        label: '适用业务',
        options: bizOpts,
        defaultValue: ['31'],
    },
    shopIDList: {
        type: 'custom',
        label: '适用店铺4',
        render: () => (<p/>),
        defaultValue: [],
    },
};

const formKeys2 = ['brandList', 'orderTypeList', 'shopIDList'];

const formItems3 = {
    consumeTotalAmount: {
        type: 'text',
        label: '触发条件',
        surfix: '元，可参与活动',
        prefix: '消费满',
        placeholder:'请输入金额',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
        wrapperCol: { span: 10 },
    },
    maxPartInPerson: {
        type: 'text',
        label: '领取限制',
        surfix: '人',
        prefix: '分享活动后，至多领取人数',
        placeholder:'请输入人数',
        rules: [{
            required: true,
            pattern: /^(([1-9]\d{0,5})|0)(\.\d{0,2})?$/,
            message: '请输入0~100000数字，支持两位小数',
        }],
        wrapperCol: { span: 10 },
    },
    
};
const formKeys3 = ['consumeTotalAmount','maxPartInPerson'];

export {
    formItemLayout,
    formKeys2, formItems2
}
