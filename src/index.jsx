import registerPackage, {registerLocalPage} from '@hualala/platform-base';
import {mountEpics} from '@hualala/platform-base';
import rootEpic from './redux/modules';

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale', process.env.JS_VERSION);
mountEpics(rootEpic);

registerLocalPage([
    {

    },
]);

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
