import Immutable from 'immutable';
import { SET_IS_CREATED_DISTRIBUTION } from './action';

const initialState = Immutable.fromJS({
  isCreated: false,
});

export function distribution_reducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_CREATED_DISTRIBUTION:
      return state.set('isCreated', action.payload)
    default:
      return state;
  }
}
