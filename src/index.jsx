import registerPackage from '@hualala/platform-base'

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale', process.env.JS_VERSION)

export default registeEntryCode(entryCodes, completed => import('./components').then(completed))
