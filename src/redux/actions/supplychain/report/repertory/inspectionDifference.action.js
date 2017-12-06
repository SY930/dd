import { fetchData } from '../../../../../helpers/util';

export const FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_ING = 'supplchain_report_inspection_difference: fetch inspection difference detail data ing'
export const FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_SUCCESS = 'supplchain_report_inspection_difference: fetch inspection difference detail data success'
export const FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_FAIL = 'supplchain_report_inspection_difference: fetch inspection difference detail data fail'
export const CLOSE_REPORT_INSPECTION_DIFFERENCE = 'supplchain_report_inspection_difference: inspection difference detail close'

export const fetchInspectionDifferenceList = (params) => {
    console.log(params)
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_ING,
        })

        fetchData('getStraightCheckDiff', params, null, {
            path: 'data',
        })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_FAIL,
                })
            })
    }
}
