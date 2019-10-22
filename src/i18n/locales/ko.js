import appLocaleData from 'react-intl/locale-data/ko';
import antdLocal from 'antd/lib/locale-provider/ko_KR';
import messages from './ko.messages.json';

const appLocale = {
    messages: Object.assign({}, antdLocal, messages),
    locale: 'ko',
    data: appLocaleData,
    formats: {
        date: {
            normal: {
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            },
        },
        money: {
            currency: 'CNY',
        },
    },
};

export default appLocale;
