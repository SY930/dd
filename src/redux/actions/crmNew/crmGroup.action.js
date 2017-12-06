export const CRM_GROUP_UNSHIFT_SELECTED = 'crm group: unshift selected';
export const CRM_GROUP_DELETE_SELECTED = 'crm group: delete selected item';

export const unshiftItemToSelected = (opts) => {
    return {
        type: CRM_GROUP_UNSHIFT_SELECTED,
        payload: opts,
    }
};

export const deleteItemToSelected = (opts) => {
    return {
        type: CRM_GROUP_DELETE_SELECTED,
        payload: opts,
    }
}


// export const CHANGE_CRM_GROUP_FOUNDER = 'crm:: change crm group founder';
// export const CRM_GROUP_DATA = 'crm:: crm group data';
//
// export const changeCrmGroupFounder = (opts) => {
//     return {
//         type: CHANGE_CRM_GROUP_FOUNDER,
//         payload: opts
//     }
// }
//
// export const dataSource = (opts) => {
//     return {
//         type:CRM_GROUP_DATA,
//         payload:opts
//     }
// }

/*
const initializationOfMyActivitiesSucceed = (opts)=>{
  return {
    type: SALE_CENTER_INITIALIZATION_OF_MY_ACTIVITIES_SUCCEED,
    payload: opts
  }
};
*/
