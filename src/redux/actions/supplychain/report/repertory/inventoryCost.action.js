import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_INVENTORY_COST_LIST_ING = 'supplchain_report_inventory_cost: fetch inventory cost data ing'
export const FETCH_REPORT_INVENTORY_COST_LIST_SUCCESS = 'supplchain_report_inventory_cost: fetch inventory cost data success'
export const FETCH_REPORT_INVENTORY_COST_LIST_FAIL = 'supplchain_report_inventory_cost: fetch inventory cost data fail'
export const CLOSE_REPORT_INVENTORY_COST = 'supplchain_report_inventory_cost: inventory cost close'

export const fetchInventoryCostReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_INVENTORY_COST_LIST_ING,
        })

        fetchData('getShopInventory', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_INVENTORY_COST_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_INVENTORY_COST_LIST_FAIL,
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
					type: FETCH_REPORT_INVENTORY_COST_LIST_SUCCESS,
					payload: res.data
				})
			}) */
    }
}
