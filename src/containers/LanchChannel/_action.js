import { getStore } from '@hualala/platform-base';

export const SALE_GET_GROUP_ID = 'sale lanch channel:: easy way to get group id';

export const getGroupId = (opts) => {
  const { groupID } = getStore().getState().user.get('accountInfo').toJS();
  return (dispatch) => {
    dispatch({
      type: SALE_GET_GROUP_ID,
      payload: {
        groupId: groupID
      }
    })
  }
}
