import {
    fetchData,
    genFetchOptions,
} from '../../../../helpers/util'

export const FETCH_COMMON_GOODSELECT_GOOD_CATEGORY_SUCCESS = 'supplychain_common_good_select: fetch good category data success'
export const FETCH_COMMON_GOODSELECT_GOOD_LIST_SUCCESS = 'supplychain_common_good_select: fetch good list data success'
export const UPDATE_COMMON_GOODSELECT_GOOD_KEYWORD = 'supplychain_common_good_select: update good keyword'
export const UPDATE_COMMON_GOODSELECT_GOOD_CATEGORY = 'supplychain_common_good_select: update good category'
export const UPDATE_COMMON_GOODSELECT_GOOD_SELECTED = 'supplychain_common_good_select: update good selected'
export const UPDATE_COMMON_GOODSELECT_REMOVE_LOADING = 'supplychain_common_good_select: update good remove loading'
export const UPDATE_COMMON_GOODSELECT_RESET_STATE = 'supplychain_common_good_select: reset store'

export const fetchGoodCategoryList = (params) => {
    return (dispatch) => {
        fetchData('queryAll', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_COMMON_GOODSELECT_GOOD_CATEGORY_SUCCESS,
                    payload: res.records,
                })
            }).catch(() => {

            })
    }
}

export const fetchGoodList = (url, params) => {
    return (dispatch) => {
        fetchData(url, params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_COMMON_GOODSELECT_GOOD_LIST_SUCCESS,
                    payload: res.records,
                })
            }).catch(() => {

            })
    }
}
