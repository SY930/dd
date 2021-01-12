import Immutable from 'immutable';
import {
    SELECT_PROMOTION_FOR_DECORATION,
    UPDATE_DECORATION_ITEM,
    RESET_DECORATION_INFO,
    SET_DECORATION_LOADING,
    GET_DECORATION_SUCCESS,
} from '../../actions/decoration';

const defaultDecorationInfo = {}

const $initialState = Immutable.fromJS({
    currentPromotion: {
        id: '',
        title: '',
        type: '',
        needCount: '',
        giftArr: [],
    },
    decorationInfo: defaultDecorationInfo,
    loading: false,
});

export const promotion_decoration = ($$state = $initialState, action) => {
    switch (action.type) {
        case GET_DECORATION_SUCCESS:
            let info;
            try {
                info = JSON.parse(action.payload)
            } catch (e) {
                info = defaultDecorationInfo;
            }
            return $$state.mergeIn(['decorationInfo'], info);
        case SET_DECORATION_LOADING:
            return $$state.set('loading', Boolean(action.payload));
        case SELECT_PROMOTION_FOR_DECORATION:
            return $$state.set('currentPromotion', Immutable.fromJS(action.payload));
        case UPDATE_DECORATION_ITEM:
            const { key, value } = action.payload;
            return $$state.setIn(['decorationInfo', ...key], Immutable.fromJS(value));
        case RESET_DECORATION_INFO:
            return $$state.set('decorationInfo', Immutable.fromJS(defaultDecorationInfo))
        default: return $$state;
    }
};
