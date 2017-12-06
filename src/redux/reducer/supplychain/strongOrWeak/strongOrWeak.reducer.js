import Immutable from 'immutable';
import { GET_CHAIN_TYPE_SUCCESS } from '../../../actions/supplychain/strongOrWeak/strongOrWeak.action'

const $initialState = Immutable.fromJS({
    chainType: '', // 1：强连锁，2：弱连锁
})
export default function reducer($state = $initialState, action = {}) {
    const { type, payload } = action
    switch (type) {
        case GET_CHAIN_TYPE_SUCCESS:
            return $state.merge({
                chainType: payload,
            })
        default:
            return $state
    }
}
