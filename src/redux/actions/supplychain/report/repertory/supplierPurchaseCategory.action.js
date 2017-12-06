import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_ING = 'supplchain_report_supplier_purchase_category: fetch supplier purchase category data ing'
export const FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_SUCCESS = 'supplchain_report_supplier_purchase_category: fetch supplier purchase category data success'
export const FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_FAIL = 'supplchain_report_supplier_purchase_category: fetch supplier purchase category data fail'
export const CLOSE_REPORT_SUPPLIER_PURCHASE_CATEGORY = 'supplchain_report_supplier_purchase_category: supplier purchase category close'

export const fetchSupplierPurchaseCategoryReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_ING,
        })

        fetchData('querySupplierPurchaseCategoryList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_FAIL,
                })
            })

        /* fetch('http://rap.hualala.com/mockjsdata/501/esReport/supplierGoodsCategory/getSupplierGoodsCategory', {method: 'post'})
			.then(res => {
				if (res.status === 200) {
					return res.json()
				}
			})
			.then(res => {
				dispatch({
					type: FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_SUCCESS,
					payload: res.data
				})
			}) */
    }
}
