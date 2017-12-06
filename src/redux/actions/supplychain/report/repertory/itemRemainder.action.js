import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_ITEM_REMAINDER_LIST_ING = 'supplchain_report_item_remainder: fetch item remainder data ing'
export const FETCH_REPORT_ITEM_REMAINDER_LIST_SUCCESS = 'supplchain_report_item_remainder: fetch item remainder data success'
export const FETCH_REPORT_ITEM_REMAINDER_LIST_FAIL = 'supplchain_report_item_remainder: fetch item remainder data fail'
export const CLOSE_REPORT_ITEM_REMAINDER = 'supplchain_report_item_remainder: item remainder close'

export const fetchItemRemainderReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_ITEM_REMAINDER_LIST_ING,
        })

        fetchData('queryItemRemainderReportList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_ITEM_REMAINDER_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_ITEM_REMAINDER_LIST_FAIL,
                })
            })
    }
}
