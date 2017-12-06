import {
    fetchData,
} from '../../../../../helpers/util';

export const FETCH_REPORT_INCOME_COST_STATISTICS_LIST_ING = 'supplchain_report_income_cost_statistics: fetch income cost statistics data ing'
export const FETCH_REPORT_INCOME_COST_STATISTICS_LIST_SUCCESS = 'supplchain_report_income_cost_statistics: fetch income cost statistics data success'
export const FETCH_REPORT_INCOME_COST_STATISTICS_LIST_FAIL = 'supplchain_report_income_cost_statistics: fetch income cost statistics data fail'
export const CLOSE_REPORT_INCOME_COST_STATISTICS = 'supplchain_report_income_cost_statistics: income cost statistics close'

export const fetchIncomeCostStatisticsReportList = (params) => {
    return (dispatch) => {
        dispatch({
            type: FETCH_REPORT_INCOME_COST_STATISTICS_LIST_ING,
        })

        fetchData('queryIncomeCostStatisticsList', params, null, { path: 'data' })
            .then((res) => {
                dispatch({
                    type: FETCH_REPORT_INCOME_COST_STATISTICS_LIST_SUCCESS,
                    payload: res,
                })
            }).catch(() => {
                dispatch({
                    type: FETCH_REPORT_INCOME_COST_STATISTICS_LIST_FAIL,
                })
            })

        /* fetch('http://rap.hualala.com/mockjsdata/501/esReport/inComeCostSum/getInComeCostSum', {method: 'post'})
			.then(res => {
				if (res.status === 200) {
					return res.json()
				}
			})
			.then(res => {
				dispatch({
					type: FETCH_REPORT_INCOME_COST_STATISTICS_LIST_SUCCESS,
					payload: res.data
				})
			}) */
    }
}
