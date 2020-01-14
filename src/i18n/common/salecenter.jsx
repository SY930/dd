import { defineMessages, FormattedMessage } from 'react-intl';
// Date.now().toString(36) 生成 时间戳 key
const LABEL_MAP = {
    k5ddu8nr: {
        id: 'SaleCenter.k5ddu8nr',
        defaultMessage: '请选择店铺'
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
});

for (const key in COMMON_LABEL) {
    const val = COMMON_LABEL[key];
    COMMON_LABEL[key] = <FormattedMessage {...val} />;
}

export {
    COMMON_LABEL as MYACTIVE, LABEL_MAP,
};
