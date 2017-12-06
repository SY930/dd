import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_ITEM_DETAIL_LIST_ING = 'supplchain_report_item_detail: fetch item detail data ing'
export const FETCH_REPORT_ITEM_DETAIL_LIST_SUCCESS = 'supplchain_report_item_detail: fetch item detail data success'
export const FETCH_REPORT_ITEM_DETAIL_LIST_FAIL = 'supplchain_report_item_detail: fetch item detail data fail'
export const CLOSE_REPORT_ITEM_DETAIL = 'supplchain_report_item_detail: item detail close'

export const fetchItemDetailReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_ITEM_DETAIL_LIST_ING,
        })

        fetchData('queryItemDetailReportList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_ITEM_DETAIL_LIST_SUCCESS,
                    payload: res.records,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_ITEM_DETAIL_LIST_FAIL,
                })
            })
    }
}
