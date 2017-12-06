import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_ING = 'supplchain_report_collection_of_library_category: fetch collection of library category data ing'
export const FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_SUCCESS = 'supplchain_report_collection_of_library_category: fetch collection of library category data success'
export const FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_FAIL = 'supplchain_report_collection_of_library_category: fetch collection of library category data fail'
export const CLOSE_REPORT_COLLECTION_OF_LIBRARY_CATEGORY = 'supplchain_report_collection_of_library_category: collection of library category close'

export const fetchCollectionOfLibraryCategoryReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_ING,
        })

        fetchData('queryCollectionOfLibraryCategoryList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_FAIL,
                })
            })

        /* fetch('http://rap.hualala.com/mockjsdata/501/esReport/houseOutCategory/getHouseOutCategory', {method: 'post'})
			.then(res => {
				if (res.status === 200) {
					return res.json()
				}
			})
			.then(res => {
				dispatch({
					type: FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_SUCCESS,
					payload: res.data
				})
			}) */
    }
}
