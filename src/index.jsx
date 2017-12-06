import registerPackage from '@hualala/platform-base'

import * as entryCodes from './constants/entryCodes'

const { registeEntryCode } = registerPackage('sale')

export default registeEntryCode(entryCodes, completed => import('./containers').then(completed))
