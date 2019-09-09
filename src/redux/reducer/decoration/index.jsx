import Immutable from 'immutable';
import {
    SELECT_PROMOTION_FOR_DECORATION,
} from '../../actions/decoration';

const $initialState = Immutable.fromJS({
    currentPromotion: null,
});

export const promotion_decoration = ($$state = $initialState, action) => {
    switch (action.type) {
        case SELECT_PROMOTION_FOR_DECORATION:
            return $$state.set('currentPromotion', action.payload);
        default: return $$state;
    }
};
