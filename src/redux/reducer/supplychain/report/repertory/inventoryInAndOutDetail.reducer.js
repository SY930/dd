import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_ING,
    FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_SUCCESS,
    FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_FAIL,
    CLOSE_REPORT_INVENTORY_IN_AND_OUT_DETAIL,
} from '../../../../actions/supplychain/report/repertory/inventoryInAndOutDetail.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        inventoryInAndOutDetailTotal: {},
        inventoryInAndOutDetailList: [],
    })

const $initialState = createInitState()

export function inventoryInAndOutDetailReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records

            return $$state.merge({
                loading: false,
                inventoryInAndOutDetailList: Immutable.List(records),
                total: Number(total),
            })
        case FETCH_REPORT_INVENTORY_IN_AND_OUT_DETAIL_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_INVENTORY_IN_AND_OUT_DETAIL:
            return $$state.merge(createInitState())
    }

    return $$state
}
