import { defineMessages, FormattedMessage } from 'react-intl';
// Date.now().toString(36) 生成 时间戳 key
const SALE_STRING = {
    k5ddu8nr: {
        id: 'SaleCenter.k5ddu8nr',
        defaultMessage: '请选择店铺'
    },
    k5dl3m7t: {
        id: 'SaleCenter.k5dl3m7t',
        defaultMessage: '请选择类型'
    },
    k5dl8joa: {
        id: 'SaleCenter.k5dl8joa',
        defaultMessage: '请选择使用状态'
    },
    k5dlp2gl: {
        id: 'SaleCenter.k5dlp2gl',
        defaultMessage: '未开始'
    },
    k5dlp7zc: {
        id: 'SaleCenter.k5dlp7zc',
        defaultMessage: '执行中'
    },
    k5dlpczr: {
        id: 'SaleCenter.k5dlpczr',
        defaultMessage: '已结束'
    },
    k5eng042: {
        id: 'SaleCenter.k5eng042',
        defaultMessage: '全部',
    },
    k5eng7pt: {
        id: 'SaleCenter.k5eng7pt',
        defaultMessage: '置顶',
    },
    k5engebq: {
        id: 'SaleCenter.k5engebq',
        defaultMessage: '置底',
    },
    k5engk5b: {
        id: 'SaleCenter.k5engk5b',
        defaultMessage: '上移',
    },
    k5engpht: {
        id: 'SaleCenter.k5engpht',
        defaultMessage: '下移',
    },
};
let COMMON_LABEL = defineMessages({
    k5dbdped: {
        id: 'SaleCenter.k5dbdped',
        defaultMessage: '线上营销信息'
    },
    k5dbefat: {
        id: 'SaleCenter.k5dbefat',
        defaultMessage: '基本营销信息'
    },
    k5dbiuws: {
        id: 'SaleCenter.k5dbiuws',
        defaultMessage: '自动执行'
    },
    k5dk4m5r: {
        id: 'SaleCenter.k5dk4m5r',
        defaultMessage: '活动时间'
    },
    k5dlbwqo: {
        id: 'SaleCenter.k5dlbwqo',
        defaultMessage: '使用状态'
    },
    k5dlcm1i: {
        id: 'SaleCenter.k5dlcm1i',
        defaultMessage: '活动名称'
    },
    k5dk5uwl: {
        id: 'SaleCenter.k5dk5uwl',
        defaultMessage: '活动类型'
    },
    k5dldshc: {
        id: 'SaleCenter.k5dldshc',
        defaultMessage: '高级查询'
    },
    k5dlggak: {
        id: 'SaleCenter.k5dlggak',
        defaultMessage: '适用店铺'
    },
    k5dli0fu: {
        id: 'SaleCenter.k5dli0fu',
        defaultMessage: '有效状态'
    },
    k5dljb1v: {
        id: 'SaleCenter.k5dljb1v',
        defaultMessage: '统计类别'
    },
    k5dlpi06: {
        id: 'SaleCenter.k5dlpi06',
        defaultMessage: '标签'
    },
    k5dlpn4t: {
        id: 'SaleCenter.k5dlpn4t',
        defaultMessage: '品牌'
    },
    k5dlpt47: {
        id: 'SaleCenter.k5dlpt47',
        defaultMessage: '适用业务'
    },
    k5dml2ik: {
        id: 'SaleCenter.k5dml2ik',
        defaultMessage: '有效时间'
    },
    k5dmmiar: {
        id: 'SaleCenter.k5dmmiar',
        defaultMessage: '活动编码'
    },
    k5dmps71: {
        id: 'SaleCenter.k5dmps71',
        defaultMessage: '创建人/修改人'
    },
    k5dmrraa: {
        id: 'SaleCenter.k5dmrraa',
        defaultMessage: '创建时间/修改时间'
    },
    k5dmw1z4: {
        id: 'SaleCenter.k5dmw1z4',
        defaultMessage: '出错了，请稍后再试'
    },
    k5dn26n4: {
        id: 'SaleCenter.k5dn26n4',
        defaultMessage: '不限制'
    },
    k5dnw1q3: {
        id: 'SaleCenter.k5dnw1q3',
        defaultMessage: '您确定要删除吗'
    },
    k5do4z54: {
        id: 'SaleCenter.k5do4z54',
        defaultMessage: '删除数据是不可恢复操作, 请慎重考虑'
    },
    k5do0ps6: {
        id: 'SaleCenter.k5do0ps6',
        defaultMessage: '执行成功'
    },
    k5do6vse: {
        id: 'SaleCenter.k5do6vse',
        defaultMessage: '您将删除'
    },
    k5doarw8: {
        id: 'SaleCenter.k5doarw8',
        defaultMessage: '请求超时'
    },
    k5doax7i: {
        id: 'SaleCenter.k5doax7i',
        defaultMessage: '请求失败'
    },
    k5dod8s9: {
        id: 'SaleCenter.k5dod8s9',
        defaultMessage: '暂无数据'
    },
    k5dohc0d: {
        id: 'SaleCenter.k5dohc0d',
        defaultMessage: '更新活动信息'
    },
});

for (const key in COMMON_LABEL) {
    const val = COMMON_LABEL[key];
    COMMON_LABEL[key] = <FormattedMessage {...val} />;
}

export {
    COMMON_LABEL as SALE_LABEL, SALE_STRING,
};
