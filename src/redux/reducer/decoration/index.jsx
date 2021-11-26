import Immutable from 'immutable';
import {
    SELECT_PROMOTION_FOR_DECORATION,
    UPDATE_DECORATION_ITEM,
    RESET_DECORATION_INFO,
    SET_DECORATION_LOADING,
    GET_DECORATION_SUCCESS,
    GET_DECORATION_FACE_SUCCESS,
    UPDATE_DECORATION_ITEM_FACE,
} from '../../actions/decoration';

const defaultDecorationInfo = {}
const defaultFaceDecorationInfo = []

const $initialState = Immutable.fromJS({
    currentPromotion: {
        id: '',
        title: '',
        type: '',
        needCount: '',
        giftArr: [],
        faceArr: [],
    },
    decorationInfo: defaultDecorationInfo,
    faceDecorationInfo: defaultFaceDecorationInfo,
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
                .set('faceDecorationInfo', Immutable.fromJS(defaultFaceDecorationInfo))
        case GET_DECORATION_FACE_SUCCESS:
            let infoFace;
            try {
                infoFace = JSON.parse(action.payload)
            } catch (e) {
                infoFace = defaultFaceDecorationInfo;
            }
            console.log("🚀 ~ file: index.jsx ~ line 55 ~ infoFace", infoFace)

            return $$state.mergeDeepIn(['faceDecorationInfo'], infoFace);
        case UPDATE_DECORATION_ITEM_FACE:
            const { key: index, value: v } = action.payload;
            // console.log("🚀 ~ file: index.jsx ~ line 59 ~ action.payload", action.payload)
            if(index == null) {
                // console.log("🚀 ~ file: index.jsx ~ line 59 ~ action.payloadvvvvvvvvvvvvvvvv", v,)
                // return $$state.set('faceDecorationInfo', Immutable.fromJS(v))
                return $$state.mergeIn(['faceDecorationInfo'], v)
            }
            return $$state.setIn(['faceDecorationInfo', index], v);
        default: return $$state;
    }
};
