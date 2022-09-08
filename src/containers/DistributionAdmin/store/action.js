
export const SET_IS_CREATED_DISTRIBUTION = 'set is created distribution or not';

export const setIsCreatedDistributionAC = (isCreated) => {
  return {
    type: SET_IS_CREATED_DISTRIBUTION,
    payload: isCreated,
  }
};

