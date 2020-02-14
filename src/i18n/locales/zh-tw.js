import appLocaleData from 'react-intl/locale-data/zh';
import messages from './zh-tw.messages.json';

const appLocale = {
    messages: Object.assign({}, (window.appLocale || {}).messages, messages),
    locale: 'zh-tw',
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
