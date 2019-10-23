import appLocaleData from 'react-intl/locale-data/ja';
import messages from './ja.messages.json';

window.appLocale = {
    messages: Object.assign({}, (window.appLocale || {}).messages, messages),
    locale: 'ja',
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

export default window.appLocale;
