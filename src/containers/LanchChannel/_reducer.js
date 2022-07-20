import Immutable from 'immutable';
import {
  SALE_GET_GROUP_ID,
} from './_action.js';

const $initialState = Immutable.fromJS({
  groupId: ''
})

export function saleLanchChannel($$state = $initialState, action) {
  switch (action.type) {
    case SALE_GET_GROUP_ID:
      return $$state.set('groupId', Immutable.fromJS(action.payload.groupId));

    default:
      return $$state;
  }
}
