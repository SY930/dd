import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_INVENTORY_COST_LIST_ING,
    FETCH_REPORT_INVENTORY_COST_LIST_SUCCESS,
    FETCH_REPORT_INVENTORY_COST_LIST_FAIL,
    CLOSE_REPORT_INVENTORY_COST,
} from '../../../../actions/supplychain/report/repertory/inventoryCost.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        inventoryCostTotal: {},
        inventoryCostList: [],
        inventoryCostFooterData: [],
    })

const $initialState = createInitState()

export function inventoryCostReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_INVENTORY_COST_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_INVENTORY_COST_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records

            return $$state.merge({
                loading: false,
                inventoryCostList: Immutable.List(records),
                total: Number(total),
            })
        case FETCH_REPORT_INVENTORY_COST_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_INVENTORY_COST:
            return $$state.merge(createInitState())
    }

    return $$state
}
