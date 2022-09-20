
export const SET_DISTRIBUTION_ITEMID = 'set distribution itemID';

export const setDistributionItemIDAC = (itemID) => {
  return {
    type: SET_DISTRIBUTION_ITEMID,
    payload: itemID,
  }
};

