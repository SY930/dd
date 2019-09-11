import { axiosData } from '../../../helpers/util';

export const SELECT_PROMOTION_FOR_DECORATION = 'sale center:: SELECT_PROMOTION_FOR_DECORATION';
export const UPDATE_DECORATION_ITEM = 'sale center:: UPDATE_DECORATION_ITEM';
export const RESET_DECORATION_INFO = 'sale center:: RESET_DECORATION_INFO';

export const selectPromotionForDecoration = opts => ({
    type: SELECT_PROMOTION_FOR_DECORATION,
    payload: opts,
});
export const updateDecorationItem = opts => ({
    type: UPDATE_DECORATION_ITEM,
    payload: opts,
});
export const resetDecorationInfo = () => ({
    type: RESET_DECORATION_INFO,
});
