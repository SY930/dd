import React from 'react';

const imgURI = 'http://res.hualala.com/';
const href = 'javascript:;';

const DF = 'YYYYMMDD';
const TF = 'HHmm';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};


const qFormKeys = ['name', 'q'];

const qFormItems = {
    name: {
        type: 'text',
        label: '券包名称',
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
}
const typeMap = { 1: '付费购买', 2: '活动投放' };
export {
    imgURI, href, formItemLayout,
    qFormKeys, qFormItems, typeMap,
}
