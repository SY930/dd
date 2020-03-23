import registerPackage, {registerLocalPage} from '@hualala/platform-base';
import {mountEpics} from '@hualala/platform-base';
import rootEpic from './redux/modules';

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode, registeLocale } = registerPackage('sale', process.env.JS_VERSION);
const DEFAULT_LANGUAGE = 'zh-cn';
const LOCEL_LANGUAGE_MAP = new Map([
    ['zh-cn', import('./i18n/locales/zh-cn')],
    ['zh-tw', import('./i18n/locales/zh-tw')],
    ['en', import('./i18n/locales/en')],
]);
// 注册epic
mountEpics(rootEpic);

// 注册本地页面, 可以jumpPage(key) 到达, 详细信息参考platform-base工程代码
registerLocalPage([
    {
        key: entryCodes.WECHAT_MALL_CREATE,
        value: entryCodes.WECHAT_MALL_CREATE,
        label: '新建商城活动',
        parent: [entryCodes.WECHAT_MALL_LIST],
    },
    {
        key: entryCodes.PROMOTION_CALENDAR_SHOP,
        value: entryCodes.PROMOTION_CALENDAR_SHOP,
        label: '营销日历',
        parent: [entryCodes.SALE_CENTER_PAGE_SHOP],
    },
    {
        key: entryCodes.PROMOTION_CALENDAR_GROUP,
        value: entryCodes.PROMOTION_CALENDAR_GROUP,
        label: '营销日历',
        parent: [
            entryCodes.SALE_CENTER_PAGE,
            entryCodes.SPECIAL_PAGE,
            entryCodes.GIFT_PAGE,
        ],
    },
    // debugger需要改回来的部分
    // {
    //     key: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
    //     value: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
    //     label: '微信支付代金券',
    //     parent: [entryCodes.PROMOTION_WECHAT_COUPON_LIST],
    // },
    {
        key: entryCodes.PROMOTION_ZHIFUBAO_COUPON_CREATE,
        value: entryCodes.PROMOTION_ZHIFUBAO_COUPON_CREATE,
        label: '支付宝代金券',
        parent: [entryCodes.PROMOTION_ZHIFUBAO_COUPON_LIST],
    },
    {
        key: entryCodes.PROMOTION_DECORATION,
        value: entryCodes.PROMOTION_DECORATION,
        label: '活动装修',
        parent: [entryCodes.SPECIAL_PAGE],
    },
]);
// 注册语言包
const registeLangPack = async () => {
    let lang = DEFAULT_LANGUAGE;
    try {
        const langTypeInCookie = /language_type=([^;]*)/.exec(document.cookie)[1];
        langTypeInCookie && (lang = langTypeInCookie)
    } catch (e) {
        // cookie 未设置，default zh-cn
    }
    console.log('营销中心语言包开始加载:', lang);
    await LOCEL_LANGUAGE_MAP.get(lang).then((data) => {
        registeLocale(data.default)
    });
    console.log('营销中心语言包加载完成:', lang);
}


registeLangPack();

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
