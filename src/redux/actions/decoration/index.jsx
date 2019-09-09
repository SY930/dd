import { axiosData } from '../../../helpers/util';

export const SELECT_PROMOTION_FOR_DECORATION = 'sale center:: SELECT_PROMOTION_FOR_DECORATION';

// 打开新建窗口
export const selectPromotionForDecoration = opts => ({
    type: SELECT_PROMOTION_FOR_DECORATION,
    payload: opts,
});
