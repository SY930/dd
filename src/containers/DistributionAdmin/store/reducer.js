import Immutable from 'immutable';
import { SET_DISTRIBUTION_ITEMID } from './action';

const initialState = Immutable.fromJS({
  itemID: '',
});

export function distribution_reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DISTRIBUTION_ITEMID:
      return state.set('itemID', action.payload)
    default:
      return state;
  }
}
