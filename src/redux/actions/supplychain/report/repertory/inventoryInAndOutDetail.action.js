import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_ING = 'supplchain_report_inventory_in_and_out_detail: fetch inventory in and out detail data ing'
export const FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_SUCCESS = 'supplchain_report_inventory_in_and_out_detail: fetch inventory in and out detail data success'
export const FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_FAIL = 'supplchain_report_inventory_in_and_out_detail: fetch inventory in and out detail data fail'
export const CLOSE_REPORT_INVENTORY_IN_AND_OUT_DETAIL = 'supplchain_report_inventory_in_and_out_detail: inventory in and out detail close'

export const fetchInventoryInAndOutDetailReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_ING,
        })

        fetchData('queryInventoryInAndOutDetailList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_FAIL,
                })
            })

        /* fetch('http://rap.hualala.com/mockjsdata/501/esReport/stockInOutDetail/getStockInOutDetail', {method: 'post'})
			.then(res => {
				if (res.status === 200) {
					return res.json()
				}
			})
			.then(res => {
				dispatch({
					type: FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_SUCCESS,
					payload: res.data
				})
			}) */
    }
}
