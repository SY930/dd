import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_INCOME_COST_STATISTICS_LIST_ING,
    FETCH_REPORT_INCOME_COST_STATISTICS_LIST_SUCCESS,
    FETCH_REPORT_INCOME_COST_STATISTICS_LIST_FAIL,
    CLOSE_REPORT_INCOME_COST_STATISTICS,
} from '../../../../actions/supplychain/report/repertory/incomeCostStatistics.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        incomeCostStatisticsTotal: {},
        incomeCostStatisticsList: [],
    })

const $initialState = createInitState()

export function incomeCostStatisticsReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_INCOME_COST_STATISTICS_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_INCOME_COST_STATISTICS_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records

            return $$state.merge({
                loading: false,
                incomeCostStatisticsList: Immutable.List(records),
                total: Number(total),
            })
        case FETCH_REPORT_INCOME_COST_STATISTICS_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_INCOME_COST_STATISTICS:
            return $$state.merge(createInitState())
    }

    return $$state
}
