
export const UPDATE_CURRENT_PROMOTION_PAGE = 'sale center: update current promotion page';

export const updateCurrentPromotionPageAC = (opts) => {
  return {
    type: UPDATE_CURRENT_PROMOTION_PAGE,
    payload: opts,
  }
}
