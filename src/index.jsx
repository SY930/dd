import registerPackage, {registerLocalPage} from '@hualala/platform-base'

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale', process.env.JS_VERSION);
registerLocalPage([{
    key: 'set_message_templates',
    value: 'set_message_templates',
    label: '短信模板',
    parent: ['1000076005'],
}]);

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
