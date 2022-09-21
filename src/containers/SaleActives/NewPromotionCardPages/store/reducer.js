import Immutable from 'immutable';
import {
  UPDATE_CURRENT_PROMOTION_PAGE
} from './action';

const initialState = Immutable.fromJS({
  promotion: {},
});

export const newPromotionCardPagesReducer = (state = initialState, action) => {
  switch (action.type) {
  case UPDATE_CURRENT_PROMOTION_PAGE:
    return state.merge({
      promotion: {
        ...state.toJS().promotion,
        ...action.payload,
      },
    });
  default:
    return state;
  }
};
