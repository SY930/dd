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
/*    {
        key: entryCodes.SHARE_RULES,
        value: entryCodes.SHARE_RULES,
        label: '规则设置',
        parent: [entryCodes.SET_MSG_TEMPLATE],
    },*/

]);

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
