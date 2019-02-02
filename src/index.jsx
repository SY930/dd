import registerPackage, {registerLocalPage} from '@hualala/platform-base';
import {mountEpics} from '@hualala/platform-base';
import rootEpic from './redux/modules';

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale', process.env.JS_VERSION);
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
    {
        key: entryCodes.PROMOTION_WECHAT_COUPON_LIST,
        value: entryCodes.PROMOTION_WECHAT_COUPON_LIST,
        label: '微信支付代金券',
        parent: [entryCodes.GIFT_PAGE],
    },
    {
        key: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
        value: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
        label: '微信支付代金券',
        parent: [entryCodes.GIFT_PAGE],
    },
]);

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
