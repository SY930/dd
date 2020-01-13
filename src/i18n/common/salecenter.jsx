import { defineMessages, FormattedMessage } from 'react-intl';

let COMMON_LABEL = defineMessages({
    OnlinePromotion: {
        id: 'SaleCenter.Label.OnlinePromotion',
        defaultMessage: '线上营销信息'
    },
    BasicPromotion: {
        id: 'SaleCenter.Label.BasicPromotion',
        defaultMessage: '基本营销信息'
    },
});

for (const key in COMMON_LABEL) {
    const val = COMMON_LABEL[key];
    COMMON_LABEL[key] = <FormattedMessage {...val} />;
}

export {
    COMMON_LABEL as MYACTIVE,
};
