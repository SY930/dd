import appLocaleData from 'react-intl/locale-data/fr';
import messages from './fr.messages';

window.appLocale = {
    messages: Object.assign({}, messages),
    locale: 'fr',
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
