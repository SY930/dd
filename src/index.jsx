import registerPackage from '@hualala/platform-base'

import * as entryCodes from './contants/entryCodes'

const { registeEntryCode } = registerPackage('sale')

export default registeEntryCode(entryCodes, completed => import('./components').then(completed))
