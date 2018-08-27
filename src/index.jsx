import registerPackage, {registerLocalPage} from '@hualala/platform-base';
import {mountEpics} from '@hualala/platform-base';
import rootEpic from './redux/modules';

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale', process.env.JS_VERSION);
// 注册epic
mountEpics(rootEpic);

// 注册本地页面, 可以jumpPage(key) 到达, 详细信息参考platform-base 工程代码
registerLocalPage([
    {
        key: entryCodes.WECHAT_MALL_CREATE,
        value: entryCodes.WECHAT_MALL_CREATE,
        label: '新建商城活动',
        parent: [entryCodes.WECHAT_MALL_LIST],
    },
    {
        key: entryCodes.NEW_SALE_CENTER,
        value: entryCodes.NEW_SALE_CENTER,
        label: '新建基础营销',
        parent: [entryCodes.SALE_CENTER_PAGE],
    },
    {
        key: entryCodes.NEW_SPECIAL,
        value: entryCodes.NEW_SPECIAL,
        label: '新建特色营销',
        parent: [entryCodes.SPECIAL_PAGE],
    },
    {
        key: entryCodes.NEW_GIFT,
        value: entryCodes.NEW_GIFT,
        label: '新建礼品',
        parent: [entryCodes.GIFT_PAGE],
    },
]);

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
