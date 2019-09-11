import Immutable from 'immutable';
import {
    SELECT_PROMOTION_FOR_DECORATION,
    UPDATE_DECORATION_ITEM,
    RESET_DECORATION_INFO,
} from '../../actions/decoration';

const $initialState = Immutable.fromJS({
    currentPromotion: {
        id: '',
        title: '',
        type: '',
    },
    decorationInfo: {
        images: {

        },
        colors: {

        }
    },
    loading: false,
});

export const promotion_decoration = ($$state = $initialState, action) => {
    switch (action.type) {
        case SELECT_PROMOTION_FOR_DECORATION:
            return $$state.set('currentPromotion', Immutable.fromJS(action.payload));
        case UPDATE_DECORATION_ITEM:
            const { key, value } = action.payload;
            return $$state.setIn(['decorationInfo', ...key], Immutable.fromJS(value));
        case RESET_DECORATION_INFO:
            return $$state.set('decorationInfo', Immutable.fromJS({
                images: {},
                colors: {},
            }))
        default: return $$state;
    }
};
